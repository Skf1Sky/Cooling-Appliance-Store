import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldCheck, LogOut, Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"warranty">("warranty");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      setLocation("/login");
    } else {
      setIsAuthLoading(false);
    }
  }, [setLocation]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/login");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-primary">Quản Trị</h2>
          <p className="text-sm text-muted-foreground mt-1">Hệ thống bảo hành</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button 
            variant={activeTab === "warranty" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("warranty")}
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Bảo Hành
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Đăng Xuất
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="p-8">
          {activeTab === "warranty" && <WarrantyTab />}
        </div>
      </div>
    </div>
  );
}

function WarrantyTab() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<any>({
    customer_name: "", phone: "", product_name: "", serial_number: "", purchase_date: "", warranty_end_date: "", status: "active", note: ""
  });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchWarranties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('warranties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Không thể tải dữ liệu bảo hành");
    } else {
      setWarranties(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      customer_name: "", phone: "", product_name: "", serial_number: "", purchase_date: new Date().toISOString().split('T')[0], warranty_end_date: "", status: "active", note: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setEditId(w.id);
    setFormData({
      customer_name: w.customer_name,
      phone: w.phone,
      product_name: w.product_name,
      serial_number: w.serial_number || "",
      purchase_date: new Date(w.purchase_date).toISOString().split('T')[0],
      warranty_end_date: new Date(w.warranty_end_date).toISOString().split('T')[0],
      status: w.status,
      note: w.note || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      purchase_date: new Date(formData.purchase_date).toISOString(),
      warranty_end_date: new Date(formData.warranty_end_date).toISOString(),
    };

    if (editId) {
      const { error } = await supabase.from('warranties').update(payload).eq('id', editId);
      if (error) {
        toast.error("Lỗi khi cập nhật");
      } else {
        toast.success("Cập nhật thành công");
        setIsModalOpen(false);
        fetchWarranties();
      }
    } else {
      const { error } = await supabase.from('warranties').insert([payload]);
      if (error) {
        toast.error("Lỗi khi thêm mới");
      } else {
        toast.success("Thêm mới thành công");
        setIsModalOpen(false);
        fetchWarranties();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('warranties').delete().eq('id', deleteId);
    if (error) {
      toast.error("Lỗi khi xóa");
    } else {
      toast.success("Xóa thành công");
      setDeleteId(null);
      fetchWarranties();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-500">Còn bảo hành</Badge>;
      case "expired": return <Badge variant="destructive">Hết bảo hành</Badge>;
      case "pending": return <Badge className="bg-yellow-500">Chờ kích hoạt</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Quản lý Bảo Hành</h3>
        <Button onClick={openCreateModal}><Plus className="w-4 h-4 mr-2" /> Thêm hồ sơ bảo hành</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Ngày mua</TableHead>
              <TableHead>Hết hạn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warranties.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.customer_name}</TableCell>
                <TableCell>{w.phone}</TableCell>
                <TableCell>{w.product_name}</TableCell>
                <TableCell className="font-mono text-sm">{w.serial_number || "-"}</TableCell>
                <TableCell>{formatDate(w.purchase_date)}</TableCell>
                <TableCell>{formatDate(w.warranty_end_date)}</TableCell>
                <TableCell>{getStatusBadge(w.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(w)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteId(w.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {warranties.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Không có hồ sơ bảo hành nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? "Sửa hồ sơ bảo hành" : "Thêm hồ sơ bảo hành"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên khách hàng</Label>
                <Input required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Tên sản phẩm</Label>
                <Input required value={formData.product_name} onChange={(e) => setFormData({...formData, product_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Số Serial</Label>
                <Input value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Ngày mua</Label>
                <Input required type="date" value={formData.purchase_date} onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Ngày hết hạn</Label>
                <Input required type="date" value={formData.warranty_end_date} onChange={(e) => setFormData({...formData, warranty_end_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Còn bảo hành</SelectItem>
                    <SelectItem value="expired">Hết bảo hành</SelectItem>
                    <SelectItem value="pending">Chờ kích hoạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Ghi chú</Label>
                <Textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa hồ sơ này? Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
