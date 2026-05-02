import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Wrench, Truck, Wind, RefreshCw } from "lucide-react";
import { useGetFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_IMAGES: Record<number, string> = {
  1: "/images/category-ac.png",
  2: "/images/category-wm.png",
  3: "/images/category-ac.png",
};

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative w-full h-[62vh] min-h-[520px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.png"
            alt="Showroom"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/80" />
        </div>

        <div className="container relative z-10 px-4 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 mx-auto" style={{ letterSpacing: "-0.04em" }}>
            Không Gian Sống{" "}
            <span className="text-primary">Tiện Nghi</span>{" "}
            Hơn
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Điện Lạnh Minh Hoàng cung cấp máy lạnh, máy giặt, tủ lạnh chính hãng và đã qua sử dụng — dịch vụ lắp đặt chuyên nghiệp, tận tâm.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products?categoryId=1">
              <Button size="lg" className="h-12 px-8 text-sm font-bold tracking-widest uppercase">
                Máy Lạnh
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-bold tracking-widest uppercase bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white">
                Xem Tất Cả
              </Button>
            </Link>
            <Link href="/dich-vu">
              <Button size="lg" variant="ghost" className="h-12 px-8 text-sm font-bold tracking-widest uppercase text-slate-300 hover:text-white hover:bg-white/10">
                Dịch Vụ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-12">
          <p className="nav-label text-primary mb-3">Danh Mục</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ letterSpacing: "-0.04em" }}>Sản Phẩm Của Chúng Tôi</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Máy lạnh, máy giặt, tủ lạnh — hàng mới chính hãng và hàng cũ còn tốt, giá cả hợp lý.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {loadingCategories
            ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)
            : categories?.map((cat) => (
                <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
                  <div className="relative h-56 rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src={CATEGORY_IMAGES[cat.id] ?? "/images/category-ac.png"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-center px-4">
                      <h3 className="text-lg font-black text-white mb-1 tracking-tight">{cat.name}</h3>
                      <p className="text-white/70 text-xs mb-3 line-clamp-1">{cat.description}</p>
                      <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold tracking-widest uppercase group-hover:text-primary transition-colors">
                        Xem ngay <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-10">
            <p className="nav-label text-primary mb-3">Bán Chạy</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ letterSpacing: "-0.04em" }}>Sản Phẩm Nổi Bật</h2>
            <p className="text-muted-foreground text-sm">Các model được khách hàng tin dùng nhiều nhất</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {loadingFeatured
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3 mt-2" />
                  </div>
                ))
              : featuredProducts?.map((product, i) => (
                  <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 80}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg" className="h-11 px-8 font-bold tracking-widest uppercase text-xs group">
                Xem Tất Cả Sản Phẩm
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-12">
          <p className="nav-label text-primary mb-3">Hỗ Trợ</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ letterSpacing: "-0.04em" }}>Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Không chỉ bán sản phẩm — chúng tôi đồng hành cùng bạn lâu dài với các dịch vụ chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-7 bg-sky-50 rounded-xl border border-sky-100">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mb-5">
              <Wind className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black mb-2 tracking-tight">Vệ Sinh Máy Lạnh</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Làm sạch, khử khuẩn, tăng hiệu suất và tiết kiệm điện cho thiết bị của bạn.</p>
          </div>

          <div className="flex flex-col items-center text-center p-7 bg-green-50 rounded-xl border border-green-100">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-5">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black mb-2 tracking-tight">Thu Cũ Đổi Mới</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Định giá máy cũ hợp lý, trừ thẳng vào đơn hàng mới. Nhanh chóng, minh bạch.</p>
          </div>

          <div className="flex flex-col items-center text-center p-7 bg-orange-50 rounded-xl border border-orange-100">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-5">
              <Wrench className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black mb-2 tracking-tight">Sửa Chữa Điện Lạnh</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Kỹ thuật viên lành nghề xử lý mọi sự cố tại nhà, bảo hành dịch vụ từ 3–6 tháng.</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dich-vu">
            <Button size="lg" variant="outline" className="h-11 px-8 font-bold tracking-widest uppercase text-xs group">
              Xem Chi Tiết Dịch Vụ
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <p className="nav-label text-primary mb-3">Cam Kết</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ letterSpacing: "-0.04em" }}>Vì Sao Chọn Chúng Tôi?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Cam kết mang đến trải nghiệm mua sắm an tâm và dịch vụ hậu mãi tốt nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-7 bg-white rounded-xl border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black mb-2 tracking-tight">Hàng Chính Hãng</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">100% sản phẩm mới, nguyên đai nguyên kiện từ các thương hiệu uy tín.</p>
            </div>

            <div className="flex flex-col items-center text-center p-7 bg-white rounded-xl border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black mb-2 tracking-tight">Lắp Đặt Chuyên Nghiệp</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Đội ngũ kỹ thuật viên lành nghề, đảm bảo đúng quy chuẩn kỹ thuật.</p>
            </div>

            <div className="flex flex-col items-center text-center p-7 bg-white rounded-xl border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black mb-2 tracking-tight">Giao Hàng Miễn Phí</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Giao hàng và lắp đặt tận nơi nhanh chóng trong khu vực nội thành.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
