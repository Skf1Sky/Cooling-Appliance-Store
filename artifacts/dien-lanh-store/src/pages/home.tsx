import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Wrench, Truck } from "lucide-react";
import { useGetFeaturedProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
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
              Điện Lạnh Store cung cấp các dòng máy lạnh, máy giặt chính hãng với dịch vụ lắp đặt chuyên nghiệp, tận tâm.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="text-base h-12 px-8">
                  Xem Sản Phẩm
                </Button>
              </Link>
              <Link href="/products?categoryId=1">
                <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                  Máy Lạnh
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá các dòng sản phẩm chất lượng cao được chọn lọc kỹ càng cho gia đình bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {loadingCategories ? (
            Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))
          ) : categories?.map((cat) => (
            <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
              <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                <img 
                  src={cat.id === 1 ? "/images/category-ac.png" : "/images/category-wm.png"} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-white/80 text-sm">{cat.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                    <ArrowRight className="w-5 h-5" />
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
            {loadingFeatured ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3 mt-2" />
                </div>
              ))
            ) : featuredProducts?.map((product, i) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Vì Sao Chọn Điện Lạnh Store?</h2>
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
      </section>
    </div>
  );
}
