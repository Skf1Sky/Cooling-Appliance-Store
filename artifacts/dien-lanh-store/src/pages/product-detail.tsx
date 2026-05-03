import { useMemo } from "react";
import { useRoute } from "wouter";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { ShieldCheck, Truck, Clock, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id ? Number(params.id) : null;

  const product = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === productId);
  }, [productId]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <Link href="/products">
          <Button>Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">
                {product.condition === "new" ? "Hàng Mới" : "Hàng Cũ"}
              </Badge>
              {product.featured && (
                <Badge className="bg-primary text-white uppercase tracking-widest text-[10px]">Nổi Bật</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{product.name}</h1>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-primary">{formatCurrency(product.price)}</div>
            {product.originalPrice && (
              <div className="text-lg text-muted-foreground line-through opacity-70">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-1 border-b border-dashed md:border-none">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <Button size="lg" className="w-full h-14 text-base font-bold uppercase tracking-widest">
              <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ hàng
            </Button>
            <a href="tel:0898234048" className="block">
              <Button size="lg" variant="outline" className="w-full h-14 text-base font-bold uppercase tracking-widest">
                Gọi tư vấn: 0898 234 048
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bảo hành uy tín</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Giao hàng nhanh</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
