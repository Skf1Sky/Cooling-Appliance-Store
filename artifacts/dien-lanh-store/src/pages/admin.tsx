import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/format";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldCheck, LogOut, Loader2, Plus, Edit2, Trash2, Package, Image as ImageIcon, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"warranty" | "products">("warranty");
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
          <Button 
            variant={activeTab === "products" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" /> Sản Phẩm
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
          {activeTab === "products" && <ProductsTab />}
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

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    condition: "new",
    category_id: "1",
    brand: "",
    imageUrl: ""
  });
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imageUrl: publicUrl });
      toast.success("Đã tải ảnh lên");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Không thể tải ảnh lên. Hãy chắc chắn bạn đã tạo bucket 'product-images' trên Supabase.");
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      name: "", price: "", description: "", condition: "new", category_id: "1", brand: "", imageUrl: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditId(p.id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      description: p.description || "",
      condition: p.condition || "new",
      category_id: p.category_id.toString(),
      brand: p.brand || "",
      imageUrl: p.image_url || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: slugify(formData.name) + "-" + Math.random().toString(36).substring(2, 7),
        brand: formData.brand || "Khác",
        price: parseInt(formData.price),
        description: formData.description,
        condition: formData.condition,
        category_id: parseInt(formData.category_id),
        image_url: formData.imageUrl,
      };

      if (editId) {
        // When updating, we don't necessarily want to change the slug unless the name changes
        // For simplicity, we just update everything except slug if it's already set
        const { error } = await supabase
          .from("products")
          .update({
            name: payload.name,
            brand: payload.brand,
            price: payload.price,
            description: payload.description,
            condition: payload.condition,
            category_id: payload.category_id,
            image_url: payload.image_url,
          })
          .eq("id", editId);
        
        if (error) throw error;
        toast.success("Đã cập nhật sản phẩm");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([payload]);
        
        if (error) throw error;
        toast.success("Đã thêm sản phẩm mới");
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Không thể lưu sản phẩm. Vui lòng kiểm tra lại bảng products trên Supabase.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      // 1. Get the product info first to get the image URL
      const productToDelete = products.find(p => p.id === deleteId);
      
      // 2. Delete the record from database
      const { error } = await supabase.from("products").delete().eq("id", deleteId);
      if (error) throw error;

      // 3. If there's an image in Supabase storage, try to delete it
      if (productToDelete?.image_url && productToDelete.image_url.includes('supabase.co/storage')) {
        try {
          const urlParts = productToDelete.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove([`products/${fileName}`]);
          
          if (storageError) console.error("Error deleting image from storage:", storageError);
        } catch (storageErr) {
          console.error("Failed to parse image URL for deletion:", storageErr);
        }
      }

      toast.success("Đã xóa sản phẩm và dữ liệu liên quan");
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Sản Phẩm</h2>
          <p className="text-muted-foreground">Nhập và quản lý danh sách sản phẩm trong kho</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" /> Thêm Sản Phẩm
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tên Sản Phẩm</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tình Trạng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Chưa có sản phẩm nào. Hãy nhấn "Thêm Sản Phẩm" để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded border" />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.brand || "-"}</TableCell>
                    <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</TableCell>
                    <TableCell>
                      <Badge variant={p.condition === 'new' ? 'default' : 'secondary'}>
                        {p.condition === 'new' ? 'Mới' : 'Cũ'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(p)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Tên sản phẩm</Label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="VD: Máy lạnh Daikin 1.5HP" />
              </div>
              <div className="space-y-2">
                <Label>Thương hiệu</Label>
                <Input required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="VD: Daikin, Panasonic..." />
              </div>
              <div className="space-y-2">
                <Label>Giá bán (VNĐ)</Label>
                <Input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="12000000" />
              </div>
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({...formData, category_id: v})}>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Máy Lạnh</SelectItem>
                    <SelectItem value="2">Máy Giặt</SelectItem>
                    <SelectItem value="3">Tủ Lạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tình trạng</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({...formData, condition: v})}>
                  <SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="used">Cũ / Like New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="flex-1" />
                    {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <Input 
                      value={formData.imageUrl} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                      placeholder="Hoặc dán link ảnh trực tiếp vào đây..." 
                      className="pl-10"
                    />
                  </div>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative w-32 h-32 rounded-xl overflow-hidden border shadow-sm">
                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => setFormData({...formData, imageUrl: ""})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Mô tả</Label>
                <Textarea className="min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Nhập thông tin chi tiết về sản phẩm..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu Sản Phẩm</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống? Hành động này không thể hoàn tác.</AlertDialogDescription>
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
