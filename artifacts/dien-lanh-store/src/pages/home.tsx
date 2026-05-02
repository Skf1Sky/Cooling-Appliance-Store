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
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.png"
            alt="Showroom"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Không Gian Sống <span className="text-primary">Tiện Nghi</span> Hơn
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl">
              Điện Lạnh Minh Hoàng cung cấp các dòng máy lạnh, máy giặt, tủ lạnh chính hãng với dịch vụ lắp đặt chuyên nghiệp, tận tâm.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products?categoryId=1">
                <Button size="lg" className="text-base h-12 px-8">
                  Máy Lạnh
                </Button>
              </Link>
              <Link href="/dich-vu">
                <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                  Dịch Vụ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá các dòng sản phẩm chất lượng cao được chọn lọc kỹ càng cho gia đình bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-5 w-full flex items-end justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                        <p className="text-white/75 text-xs line-clamp-1">{cat.description}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:bg-primary transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4" />
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản Phẩm Nổi Bật</h2>
              <p className="text-muted-foreground">Các model được khách hàng tin dùng nhiều nhất</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="group">
                Xem tất cả <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                  <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Không chỉ bán sản phẩm — chúng tôi đồng hành cùng bạn lâu dài với các dịch vụ chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center p-6 bg-sky-50 rounded-xl border border-sky-100">
            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
              <Wind className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2">Vệ Sinh Máy Lạnh</h3>
            <p className="text-muted-foreground text-sm">Làm sạch, khử khuẩn, tăng hiệu suất và tiết kiệm điện cho thiết bị của bạn.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl border border-green-100">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2">Thu Cũ Đổi Mới</h3>
            <p className="text-muted-foreground text-sm">Định giá máy cũ hợp lý, trừ thẳng vào đơn hàng mới. Nhanh chóng, minh bạch.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
              <Wrench className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2">Sửa Chữa Điện Lạnh</h3>
            <p className="text-muted-foreground text-sm">Kỹ thuật viên lành nghề xử lý mọi sự cố tại nhà, bảo hành dịch vụ từ 3–6 tháng.</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dich-vu">
            <Button size="lg" variant="outline" className="h-12 px-8 group">
              Xem Chi Tiết Dịch Vụ <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vì Sao Chọn Điện Lạnh Minh Hoàng?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cam kết mang đến trải nghiệm mua sắm an tâm và dịch vụ hậu mãi tốt nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hàng Chính Hãng</h3>
              <p className="text-muted-foreground">100% sản phẩm mới, nguyên đai nguyên kiện từ các thương hiệu uy tín.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lắp Đặt Chuyên Nghiệp</h3>
              <p className="text-muted-foreground">Đội ngũ kỹ thuật viên lành nghề, đảm bảo đúng quy chuẩn kỹ thuật.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Giao Hàng Miễn Phí</h3>
              <p className="text-muted-foreground">Giao hàng và lắp đặt tận nơi nhanh chóng trong khu vực nội thành.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
