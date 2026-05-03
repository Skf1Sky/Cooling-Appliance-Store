import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  useGetMe, 
  useLogout,
  useAdminListOrders,
  useAdminUpdateOrderStatus,
  useListProducts,
  useListCategories,
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
  useAdminListWarranties,
  useAdminCreateWarranty,
  useAdminUpdateWarranty,
  useAdminDeleteWarranty,
  getAdminListOrdersQueryKey,
  getListProductsQueryKey,
  getAdminListWarrantiesQueryKey,
  getGetMeQueryKey
} from "@workspace/api-client-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Package, ShoppingCart, ShieldCheck, LogOut, Loader2, Plus, Edit2, Trash2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Admin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"stats" | "orders" | "products" | "warranty">("stats");
  
  const { data: user, isLoading: isAuthLoading, isError: isAuthError } = useGetMe({
    query: {
      retry: false,
      queryKey: getGetMeQueryKey()
    }
  });

  const logoutMutation = useLogout();

  useEffect(() => {
    if (isAuthError || (!isAuthLoading && !user)) {
      setLocation("/login");
    }
  }, [isAuthError, isAuthLoading, user, setLocation]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthError || !user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/login");
      }
    });
  };

  if (isAuthLoading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-primary">Quản Trị Viên</h2>
          <p className="text-sm text-muted-foreground mt-1">Xin chào, {user?.username}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button 
            variant={activeTab === "stats" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("stats")}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Thống Kê
          </Button>
          <Button 
            variant={activeTab === "orders" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Đơn Hàng
          </Button>
          <Button 
            variant={activeTab === "products" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" /> Sản Phẩm
          </Button>
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
          {activeTab === "stats" && <StatsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "warranty" && <WarrantyTab />}
        </div>
      </div>
    </div>
  );
}

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  ordersByStatus: Array<{ status: string; count: number }>;
  revenueByDay: Array<{ date: string; revenue: number; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308", // yellow-500
  confirmed: "#3b82f6", // blue-500
  shipping: "#f97316", // orange-500
  delivered: "#22c55e", // green-500
  cancelled: "#ef4444", // red-500
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

function StatsTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<StatsData>;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Thống Kê</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-32 rounded-xl bg-muted animate-pulse" />
          <div className="h-32 rounded-xl bg-muted animate-pulse" />
          <div className="h-32 rounded-xl bg-muted animate-pulse" />
        </div>
        <div className="h-[400px] rounded-xl bg-muted animate-pulse mt-6" />
      </div>
    );
  }

  if (!stats) {
    return <div>Không có dữ liệu</div>;
  }

  const pieData = stats.ordersByStatus.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: Number(item.count),
    color: STATUS_COLORS[item.status] || "#94a3b8"
  }));

  const formatMillions = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    return val.toString();
  };

  const chartData = stats.revenueByDay.map(item => {
    const d = new Date(item.date);
    return {
      ...item,
      displayDate: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
    };
  });

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Thống Kê Tổng Quan</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Từ các đơn đã giao thành công</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tổng số đơn hàng đã đặt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đang có trong kho</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh Thu 30 Ngày Gần Nhất</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatMillions(value)}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                    labelFormatter={(label) => `Ngày ${label}`}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Trạng Thái Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                  <span className="truncate">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrdersTab() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useAdminListOrders();
  const updateStatusMutation = useAdminUpdateOrderStatus();

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() });
          toast.success("Cập nhật trạng thái thành công");
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "confirmed": return "bg-blue-500 hover:bg-blue-600 text-white";
      case "shipping": return "bg-orange-500 hover:bg-orange-600 text-white";
      case "delivered": return "bg-green-500 hover:bg-green-600 text-white";
      case "cancelled": return "bg-red-500 hover:bg-red-600 text-white";
      default: return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "confirmed": return "Đã xác nhận";
      case "shipping": return "Đang giao";
      case "delivered": return "Đã giao";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Quản lý Đơn Hàng</h3>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã ĐH</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerPhone}</TableCell>
                <TableCell>{formatCurrency(Number(order.total))}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipping">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Không có đơn hàng nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductsTab() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const { data: categories } = useListCategories();
  
  const createMutation = useAdminCreateProduct();
  const updateMutation = useAdminUpdateProduct();
  const deleteMutation = useAdminDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<any>({
    name: "", brand: "", categoryId: "", price: "", originalPrice: "", discountPercent: "0", 
    imageUrl: "", description: "", isFeatured: false, inStock: true
  });
  const [editId, setEditId] = useState<number | null>(null);

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      name: "", brand: "", categoryId: categories?.[0]?.id.toString() || "", price: "", originalPrice: "", discountPercent: "0", 
      imageUrl: "", description: "", isFeatured: false, inStock: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      discountPercent: product.discountPercent?.toString() || "0",
      imageUrl: product.imageUrl,
      description: product.description || "",
      isFeatured: product.isFeatured || false,
      inStock: product.inStock !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      discountPercent: parseInt(formData.discountPercent) || 0,
      specs: {}
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            setIsModalOpen(false);
            toast.success("Cập nhật thành công");
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            setIsModalOpen(false);
            toast.success("Thêm mới thành công");
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setDeleteId(null);
          toast.success("Xóa thành công");
        }
      }
    );
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Quản lý Sản Phẩm</h3>
        <Button onClick={openCreateModal}><Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên SP</TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Nổi bật</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain bg-white rounded" />
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate" title={product.name}>{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{product.isFeatured ? <Badge variant="default">Có</Badge> : <Badge variant="secondary">Không</Badge>}</TableCell>
                <TableCell>{product.inStock ? <Badge variant="outline" className="bg-green-100 text-green-800">Còn hàng</Badge> : <Badge variant="outline" className="bg-red-100 text-red-800">Hết hàng</Badge>}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteId(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên sản phẩm</Label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Thương hiệu</Label>
                <Input required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({...formData, categoryId: val})}>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hình ảnh (URL)</Label>
                <Input required value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Giá bán</Label>
                <Input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Giá gốc</Label>
                <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Mô tả</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})} />
                <Label htmlFor="featured">Sản phẩm nổi bật</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="instock" checked={formData.inStock} onCheckedChange={(checked) => setFormData({...formData, inStock: checked})} />
                <Label htmlFor="instock">Còn hàng</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</AlertDialogDescription>
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

function WarrantyTab() {
  const queryClient = useQueryClient();
  const { data: warranties, isLoading } = useAdminListWarranties();
  
  const createMutation = useAdminCreateWarranty();
  const updateMutation = useAdminUpdateWarranty();
  const deleteMutation = useAdminDeleteWarranty();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<any>({
    customerName: "", phone: "", productName: "", serialNumber: "", purchaseDate: "", warrantyEndDate: "", status: "active", note: ""
  });
  const [editId, setEditId] = useState<number | null>(null);

  const openCreateModal = () => {
    setEditId(null);
    setFormData({
      customerName: "", phone: "", productName: "", serialNumber: "", purchaseDate: new Date().toISOString().split('T')[0], warrantyEndDate: "", status: "active", note: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setEditId(w.id);
    setFormData({
      customerName: w.customerName,
      phone: w.phone,
      productName: w.productName,
      serialNumber: w.serialNumber || "",
      purchaseDate: new Date(w.purchaseDate).toISOString().split('T')[0],
      warrantyEndDate: new Date(w.warrantyEndDate).toISOString().split('T')[0],
      status: w.status,
      note: w.note || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      warrantyEndDate: new Date(formData.warrantyEndDate).toISOString(),
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getAdminListWarrantiesQueryKey() });
            setIsModalOpen(false);
            toast.success("Cập nhật thành công");
          }
        }
      );
    } else {
      createMutation.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getAdminListWarrantiesQueryKey() });
            setIsModalOpen(false);
            toast.success("Thêm mới thành công");
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(
      { id: deleteId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListWarrantiesQueryKey() });
          setDeleteId(null);
          toast.success("Xóa thành công");
        }
      }
    );
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
            {warranties?.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.customerName}</TableCell>
                <TableCell>{w.phone}</TableCell>
                <TableCell>{w.productName}</TableCell>
                <TableCell className="font-mono text-sm">{w.serialNumber || "-"}</TableCell>
                <TableCell>{formatDate(w.purchaseDate)}</TableCell>
                <TableCell>{formatDate(w.warrantyEndDate)}</TableCell>
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
            {(!warranties || warranties.length === 0) && (
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
                <Input required value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Tên sản phẩm</Label>
                <Input required value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Số Serial</Label>
                <Input value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Còn bảo hành</SelectItem>
                    <SelectItem value="expired">Hết bảo hành</SelectItem>
                    <SelectItem value="pending">Chờ kích hoạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày mua</Label>
                <Input type="date" required value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Hết hạn bảo hành</Label>
                <Input type="date" required value={formData.warrantyEndDate} onChange={(e) => setFormData({...formData, warrantyEndDate: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Ghi chú</Label>
                <Textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa hồ sơ bảo hành này? Hành động này không thể hoàn tác.</AlertDialogDescription>
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
