import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Wrench, Truck, Wind, RefreshCw, Clock, Search } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4);

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
          <Badge variant="outline" className="mb-4 text-primary-foreground border-primary/30 bg-primary/10 px-4 py-1">
            Dịch vụ điện lạnh uy tín & chuyên nghiệp
          </Badge>
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

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Sản phẩm nổi bật</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Lựa Chọn Tốt Nhất</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="ghost" className="font-bold tracking-widest uppercase text-xs group">
                Xem tất cả sản phẩm <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 container px-4">
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Danh mục</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Sản Phẩm Của Chúng Tôi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MOCK_CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
              <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                <img 
                  src={cat.id === 1 ? "/images/category-ac.png" : (cat.id === 2 ? "/images/category-wm.png" : "/images/hero-banner.png")} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center px-6">
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{cat.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-xs font-bold tracking-widest uppercase group-hover:text-primary transition-colors">
                    Khám phá ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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

function Badge({ children, className, variant }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
