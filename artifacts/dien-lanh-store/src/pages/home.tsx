import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Wind, Wrench, RefreshCw, Loader2, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const airConditioners = products.filter(p => p.category_id === 1).slice(0, 4);
  const washingMachines = products.filter(p => p.category_id === 2).slice(0, 4);
  const refrigerators = products.filter(p => p.category_id === 3).slice(0, 4);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.png"
            alt="Showroom"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/80" />
        </div>

        <div className="container relative z-10 px-4 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold mb-4 text-primary-foreground border-primary/30 bg-primary/10">
            Dịch vụ điện lạnh uy tín & chuyên nghiệp
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 mx-auto tracking-tighter">
            Dịch Vụ <span className="text-primary">Tận Tâm</span><br />
            Bảo Hành <span className="text-primary">Chu Đáo</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Điện Lạnh Minh Hoàng — Chuyên sửa chữa, lắp đặt và cung cấp thiết bị điện lạnh chính hãng & cũ chất lượng cao.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="h-14 px-10 text-base font-bold tracking-widest uppercase shadow-xl shadow-primary/20">
                Xem sản phẩm
              </Button>
            </Link>
            <Link href="/warranty">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold tracking-widest uppercase bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white">
                <Search className="w-5 h-5 mr-2" /> Tra cứu bảo hành
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Đang tải sản phẩm mới nhất...</p>
        </div>
      ) : (
        <>
          {/* Section: Máy Lạnh */}
          {airConditioners.length > 0 && (
            <section className="py-20 bg-white">
              <div className="container px-4">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">Hàng mới về</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Máy Lạnh</h2>
                  </div>
                  <Link href="/products?categoryId=1">
                    <Button variant="ghost" className="font-bold tracking-widest uppercase text-xs">
                      Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {airConditioners.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Máy Giặt */}
          {washingMachines.length > 0 && (
            <section className="py-20 bg-slate-50">
              <div className="container px-4">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">Lựa chọn tốt nhất</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Máy Giặt</h2>
                  </div>
                  <Link href="/products?categoryId=2">
                    <Button variant="ghost" className="font-bold tracking-widest uppercase text-xs">
                      Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {washingMachines.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Tủ Lạnh */}
          {refrigerators.length > 0 && (
            <section className="py-20 bg-white">
              <div className="container px-4">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">Bền bỉ & Tiết kiệm</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Tủ Lạnh</h2>
                  </div>
                  <Link href="/products?categoryId=3">
                    <Button variant="ghost" className="font-bold tracking-widest uppercase text-xs">
                      Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {refrigerators.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {products.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-y">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-slate-500">Vui lòng đăng nhập Admin để thêm sản phẩm đầu tiên.</p>
            </div>
          )}
        </>
      )}

      {/* Services Preview */}
      <section className="py-20 md:py-32 bg-slate-900 text-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Dịch vụ</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">Dịch Vụ Chuyên Nghiệp</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group flex flex-col items-center text-center p-10 bg-white/5 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                <Wind className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">Vệ Sinh Máy Lạnh</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Làm sạch sâu, khử mùi hôi, tăng tuổi thọ máy và giúp không khí trong lành hơn.</p>
            </div>

            <div className="group flex flex-col items-center text-center p-10 bg-white/5 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">Sửa Chữa Tại Nhà</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Có mặt nhanh chóng, chẩn đoán đúng bệnh, báo giá minh bạch và bảo hành dài hạn.</p>
            </div>

            <div className="group flex flex-col items-center text-center p-10 bg-white/5 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">Lắp Đặt Di Dời</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Tư vấn vị trí lắp đặt tối ưu, thi công đúng kỹ thuật, thẩm mỹ cao cho ngôi nhà của bạn.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
