import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { ArrowLeft, Phone, ShieldCheck, Truck, Loader2, Package } from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = params?.id;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-20 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <Link href="/products">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12">
      <Link href="/products">
        <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border shadow-sm">
            <img 
              src={product.image_url || "/images/category-ac.png"} 
              className="w-full h-full object-cover" 
              alt={product.name} 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-4 uppercase tracking-widest">
              {product.condition === 'new' ? 'Hàng Mới' : 'Hàng Cũ'}
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">{product.name}</h1>
            <div className="text-3xl font-black text-primary mb-6">
              {formatCurrency(product.price)}
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Bảo hành dài hạn</p>
                <p className="text-xs text-muted-foreground">Tất cả sản phẩm đều được bảo hành từ 6-12 tháng.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Lắp đặt tại nhà</p>
                <p className="text-xs text-muted-foreground">Hỗ trợ vận chuyển và lắp đặt chuyên nghiệp trong nội thành.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-3xl p-6 mb-8">
            <h3 className="font-bold mb-3">Mô tả sản phẩm</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description || "Đang cập nhật thông tin mô tả cho sản phẩm này."}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <a href="tel:0898234048" className="block">
              <Button size="lg" className="w-full h-16 text-lg font-bold uppercase tracking-widest">
                <Phone className="w-5 h-5 mr-3" /> Gọi ngay: 0898 234 048
              </Button>
            </a>
            <p className="text-center text-xs text-muted-foreground">
              Tư vấn miễn phí — Hỗ trợ 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
