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
  const [activeImage, setActiveImage] = useState("");

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
        setActiveImage(data.image_url);
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

  const galleryImages = [
    product.image_url,
    product.image_url_2,
    product.image_url_3,
    product.image_url_4
  ].filter(img => !!img);

  return (
    <div className="container px-4 py-8 md:py-12">
      <Link href="/products">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border-2 border-slate-100 shadow-sm">
            <img 
              src={activeImage || "/images/category-ac.png"} 
              className="w-full h-full object-cover" 
              alt={product.name} 
            />
          </div>
          
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${product.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {product.condition === 'new' ? 'Hàng Mới' : 'Hàng Cũ'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.brand}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              <span className="text-primary mr-2 uppercase">{product.brand}</span>
              {product.name}
            </h1>
            
            <div className="text-3xl md:text-4xl font-black text-primary mb-8">
              {formatCurrency(product.price)}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Bảo hành 3-6 tháng</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Tất cả sản phẩm đều được hỗ trợ bảo hành tận nơi từ 3-6 tháng.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-slate-100">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Miễn phí ship 15km</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Hỗ trợ vận chuyển và lắp đặt chuyên nghiệp, miễn phí trong vòng 15km.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-50 rounded-3xl p-6 mb-10 shadow-sm">
              <h3 className="font-black uppercase tracking-widest text-[11px] text-slate-400 mb-4">Mô tả sản phẩm</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                {product.description || "Đang cập nhật thông tin mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <a href="tel:0898234048" className="block transform transition-transform hover:scale-[1.02] active:scale-95">
              <Button size="lg" className="w-full h-16 text-lg font-black uppercase tracking-[0.1em] rounded-2xl shadow-lg shadow-primary/25">
                <Phone className="w-5 h-5 mr-3 fill-current" /> GỌI NGAY: 0898 234 048
              </Button>
            </a>
            <p className="text-center text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-[0.2em]">
              Tư vấn miễn phí — Hỗ trợ 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
