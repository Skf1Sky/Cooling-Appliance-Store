import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/format";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldCheck, LogOut, Loader2, Plus, Edit2, Trash2, Package, Image as ImageIcon, X, Search, Phone, User, Calendar, CreditCard, Filter, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"warranty" | "products">("warranty");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickSellData, setQuickSellData] = useState<{ id: number, name: string } | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      setLocation("/login");
    } else {
      setIsAuthLoading(false);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setLocation("/login");
    toast.success("Đã đăng xuất");
  };

  const handleQuickSell = (id: number, productName: string) => {
    setQuickSellData({ id, name: productName });
    setActiveTab("warranty");
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Bảng Quản Trị</h1>
          <p className="text-muted-foreground text-sm">Chào mừng quay trở lại, Admin</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto h-11 border-slate-200">
          <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-slate-100 rounded-xl">
          <TabsTrigger value="warranty" className="rounded-lg font-bold data-[state=active]:shadow-sm">
            <ShieldCheck className="w-4 h-4 mr-2 hidden xs:inline" /> Bảo Hành
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg font-bold data-[state=active]:shadow-sm">
            <Package className="w-4 h-4 mr-2 hidden xs:inline" /> Sản Phẩm
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm nhanh..." 
              className="pl-10 h-11 rounded-xl border-slate-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="warranty" className="mt-0">
          <WarrantyTab 
            searchQuery={searchQuery} 
            initialProductName={quickSellData} 
            onClearQuickSell={() => setQuickSellData(null)} 
          />
        </TabsContent>
        <TabsContent value="products" className="mt-0">
          <ProductsTab 
            searchQuery={searchQuery} 
            onQuickSell={handleQuickSell}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WarrantyTab({ searchQuery, initialProduct, onClearQuickSell }: { searchQuery: string, initialProduct: { id: number, name: string } | null, onClearQuickSell: () => void }) {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [sellingProductId, setSellingProductId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<any>({
    customer_name: "", phone: "", product_name: "", serial_number: "", purchase_date: "", warranty_end_date: "", status: "active", note: ""
  });

  const fetchWarranties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('warranties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("Không thể tải dữ liệu bảo hành");
    else setWarranties(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialProduct && !isModalOpen) {
      setEditId(null);
      setSellingProductId(initialProduct.id);
      const newFormData = {
        customer_name: "", 
        phone: "", 
        product_name: initialProduct.name, 
        serial_number: "", 
        purchase_date: new Date().toISOString().split('T')[0], 
        warranty_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: "active", 
        note: ""
      };
      setFormData(newFormData);
      setIsModalOpen(true);
      // We'll clear the quick sell data in the parent after a short delay
      // to ensure the modal has captured the initial state
      setTimeout(() => onClearQuickSell(), 100);
    }
  }, [initialProduct, isModalOpen, onClearQuickSell]);

  useEffect(() => { fetchWarranties(); }, []);

  const openCreateModal = () => {
    setEditId(null);
    setSellingProductId(null);
    setFormData({
      customer_name: "", phone: "", product_name: "", serial_number: "", 
      purchase_date: new Date().toISOString().split('T')[0], 
      warranty_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: "active", note: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setEditId(w.id);
    setSellingProductId(null);
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

    const { error } = editId 
      ? await supabase.from('warranties').update(payload).eq('id', editId)
      : await supabase.from('warranties').insert([payload]);

    if (error) toast.error("Lỗi khi lưu dữ liệu");
    else {
      toast.success(editId ? "Đã cập nhật" : "Đã kích hoạt bảo hành thành công");
      setIsModalOpen(false);
      fetchWarranties();

      // IF THIS WAS A QUICK SELL, DELETE THE PRODUCT
      if (!editId && sellingProductId) {
        try {
          // Get product info first to delete images
          const { data: p } = await supabase.from("products").select("*").eq("id", sellingProductId).single();
          if (p) {
            const imageFields = ['image_url', 'image_url_2', 'image_url_3', 'image_url_4'];
            const imagesToDelete: string[] = [];
            imageFields.forEach(f => {
              if (p[f]?.includes('supabase.co/storage')) {
                const fileName = p[f].split('/').pop();
                if (fileName) imagesToDelete.push(`products/${fileName}`);
              }
            });
            if (imagesToDelete.length > 0) {
              await supabase.storage.from('product-images').remove(imagesToDelete);
            }
          }
          // Delete from DB
          await supabase.from("products").delete().eq("id", sellingProductId);
          toast.info("Đã tự động xóa máy khỏi kho hàng");
          setSellingProductId(null);
        } catch (err) {
          console.error("Auto-delete error:", err);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('warranties').delete().eq('id', deleteId);
    if (error) toast.error("Lỗi khi xóa");
    else {
      toast.success("Đã xóa hồ sơ");
      setDeleteId(null);
      fetchWarranties();
    }
  };

  const filtered = warranties.filter(w => 
    w.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.phone.includes(searchQuery) ||
    w.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Danh sách bảo hành</h3>
        <Button onClick={openCreateModal} size="sm" className="font-bold rounded-xl"><Plus className="w-4 h-4 mr-1.5" /> Thêm mới</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((w) => (
          <Card key={w.id} className="border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-base tracking-tight leading-none mb-1">{w.customer_name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {w.phone}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest self-start sm:self-center ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {w.status === 'active' ? '● Còn hạn' : '○ Hết hạn'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sản phẩm</p>
                  <p className="text-xs font-bold line-clamp-1">{w.product_name}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Serial</p>
                  <p className="text-xs font-bold font-mono">{w.serial_number || "---"}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ngày mua</p>
                  <p className="text-xs font-bold">{formatDate(w.purchase_date)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hết hạn</p>
                  <p className="text-xs font-bold">{formatDate(w.warranty_end_date)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" size="sm" className="h-9 px-3 font-bold text-primary hover:bg-primary/5" onClick={() => openEditModal(w)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Sửa
                </Button>
                <Button variant="ghost" size="sm" className="h-9 px-3 font-bold text-destructive hover:bg-destructive/5" onClick={() => setDeleteId(w.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Không tìm thấy hồ sơ nào</p>
          </div>
        )}
      </div>

      {/* Warranty Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editId ? "Sửa hồ sơ" : "Thêm hồ sơ mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tên khách hàng *</Label>
                <Input required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Số điện thoại *</Label>
                <Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-10" />
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold">Tên sản phẩm *</Label>
                <Input required value={formData.product_name} onChange={(e) => setFormData({...formData, product_name: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Số Serial</Label>
                <Input value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} className="h-10 font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Còn bảo hành</SelectItem>
                    <SelectItem value="expired">Hết bảo hành</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Ngày mua *</Label>
                <Input required type="date" value={formData.purchase_date} onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Ngày hết hạn *</Label>
                <Input required type="date" value={formData.warranty_end_date} onChange={(e) => setFormData({...formData, warranty_end_date: e.target.value})} className="h-10" />
              </div>
            </div>
            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none h-11 rounded-xl font-bold">Hủy</Button>
              <Button type="submit" className="flex-1 sm:flex-none h-11 rounded-xl font-bold px-8 uppercase tracking-widest">Lưu hồ sơ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl w-[90vw] max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hồ sơ bảo hành sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-2">
            <AlertDialogCancel className="h-11 rounded-xl font-bold">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-11 rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90">Xóa ngay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductsTab({ searchQuery, onQuickSell }: { searchQuery: string, onQuickSell: (name: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", price: "", description: "", condition: "new", category_id: "1", brand: "", 
    imageUrl: "", imageUrl2: "", imageUrl3: "", imageUrl4: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Không thể tải danh sách sản phẩm");
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(`products/${fileName}`, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(`products/${fileName}`);
      setFormData({ ...formData, [fieldName]: publicUrl });
      toast.success("Tải ảnh thành công");
    } catch (error) {
      toast.error("Lỗi khi tải ảnh");
    } finally { setUploading(false); }
  };

  const openCreateModal = () => {
    setEditId(null);
    setFormData({ name: "", price: "", description: "", condition: "new", category_id: "1", brand: "", imageUrl: "", imageUrl2: "", imageUrl3: "", imageUrl4: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditId(p.id);
    setFormData({
      name: p.name, price: p.price.toString(), description: p.description || "",
      condition: p.condition || "new", category_id: p.category_id.toString(),
      brand: p.brand || "", imageUrl: p.image_url || "", 
      imageUrl2: p.image_url_2 || "", imageUrl3: p.image_url_3 || "", imageUrl4: p.image_url_4 || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name.toUpperCase(),
      brand: (formData.brand || "KHÁC").toUpperCase(),
      price: parseInt(formData.price),
      description: formData.description,
      condition: formData.condition,
      category_id: parseInt(formData.category_id),
      image_url: formData.imageUrl,
      image_url_2: formData.imageUrl2,
      image_url_3: formData.imageUrl3,
      image_url_4: formData.imageUrl4,
      slug: editId ? undefined : `${slugify(formData.name)}-${Math.random().toString(36).substring(2, 7)}`
    };

    const { error } = editId 
      ? await supabase.from("products").update(payload).eq("id", editId)
      : await supabase.from("products").insert([payload]);
    
    if (error) toast.error("Lỗi khi lưu sản phẩm");
    else {
      toast.success(editId ? "Đã cập nhật" : "Đã thêm mới");
      setIsModalOpen(false);
      fetchProducts();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const productToDelete = products.find(p => p.id === deleteId);
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    
    if (error) toast.error("Lỗi khi xóa");
    else {
      // Delete all 4 images if they exist in storage
      const imageFields = ['image_url', 'image_url_2', 'image_url_3', 'image_url_4'];
      const imagesToDelete: string[] = [];

      imageFields.forEach(field => {
        const url = productToDelete?.[field];
        if (url && url.includes('supabase.co/storage')) {
          const fileName = url.split('/').pop();
          if (fileName) imagesToDelete.push(`products/${fileName}`);
        }
      });

      if (imagesToDelete.length > 0) {
        await supabase.storage.from('product-images').remove(imagesToDelete);
      }

      toast.success("Đã xóa sản phẩm và toàn bộ hình ảnh");
      setDeleteId(null);
      fetchProducts();
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Danh sách sản phẩm</h3>
        <Button onClick={openCreateModal} size="sm" className="font-bold rounded-xl"><Plus className="w-4 h-4 mr-1.5" /> Thêm mới</Button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-all group flex flex-col rounded-2xl">
            <div className="aspect-[4/3] relative bg-slate-50 overflow-hidden">
              <img src={p.image_url || "/images/category-ac.png"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <div className="absolute top-2 left-2">
                <Badge className={`${p.condition === 'new' ? 'bg-green-500' : 'bg-amber-500'} text-[9px] px-1.5 py-0 font-black uppercase tracking-widest`}>
                  {p.condition === 'new' ? 'Mới' : 'Cũ'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3 flex-grow flex flex-col">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-0.5">{p.brand}</p>
              <h4 className="font-bold text-xs line-clamp-2 mb-2 min-h-[32px] tracking-tight">{p.name}</h4>
              <p className="text-sm font-black text-primary mt-auto">{formatCurrency(p.price)}</p>
            </CardContent>
            <div className="p-3 pt-0 flex flex-col gap-2">
              <Button 
                className="w-full h-9 rounded-xl font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-sm"
                onClick={() => onQuickSell(p.id, `${p.brand} ${p.name}`)}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-2" /> BÁN MÁY
              </Button>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-[11px] font-bold" onClick={() => openEditModal(p)}>
                  <Edit2 className="w-3 h-3 mr-1" /> Sửa
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 rounded-lg text-[11px] font-bold text-destructive hover:bg-destructive/5" onClick={() => setDeleteId(p.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Chưa có sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold">Tên sản phẩm *</Label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Thương hiệu *</Label>
                <Input required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Giá bán (VNĐ) *</Label>
                <Input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Danh mục</Label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({...formData, category_id: v})}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Máy Lạnh</SelectItem>
                    <SelectItem value="2">Máy Giặt</SelectItem>
                    <SelectItem value="3">Tủ Lạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tình trạng</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({...formData, condition: v})}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Hàng Mới</SelectItem>
                    <SelectItem value="used">Hàng Cũ / Like New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-3">
                <Label className="text-xs font-bold">Hình ảnh sản phẩm (Tối đa 4 ảnh)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'imageUrl', label: 'Ảnh chính' },
                    { id: 'imageUrl2', label: 'Ảnh 2' },
                    { id: 'imageUrl3', label: 'Ảnh 3' },
                    { id: 'imageUrl4', label: 'Ảnh 4' }
                  ].map((field) => (
                    <div key={field.id} className="space-y-2 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">{field.label}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field.id)} disabled={uploading} className="bg-white h-8 text-[10px] flex-1" />
                          {uploading && <Loader2 className="w-3 h-3 animate-spin" />}
                        </div>
                        <Input 
                          value={(formData as any)[field.id]} 
                          onChange={(e) => setFormData({...formData, [field.id]: e.target.value})} 
                          placeholder="Hoặc dán link..." 
                          className="bg-white h-8 text-[10px]"
                        />
                        {(formData as any)[field.id] && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border mt-1">
                            <img src={(formData as any)[field.id]} className="w-full h-full object-cover" alt="" />
                            <button type="button" onClick={() => setFormData({...formData, [field.id]: ""})} className="absolute top-0 right-0 bg-destructive text-white rounded-full p-0.5"><X className="w-2 h-2" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-bold">Mô tả</Label>
                <Textarea className="min-h-[80px] text-xs" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Thông tin chi tiết sản phẩm..." />
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none h-11 rounded-xl font-bold">Hủy</Button>
              <Button type="submit" className="flex-1 sm:flex-none h-11 rounded-xl font-bold px-8 uppercase tracking-widest">Lưu sản phẩm</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl w-[90vw] max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">Xóa sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>Dữ liệu sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-2">
            <AlertDialogCancel className="h-11 rounded-xl font-bold">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-11 rounded-xl font-bold bg-destructive text-white hover:bg-destructive/90">Xác nhận xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
