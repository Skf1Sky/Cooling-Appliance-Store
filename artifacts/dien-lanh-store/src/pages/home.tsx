import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Wrench, Truck, Wind, RefreshCw, Clock, Search } from "lucide-react";

export default function Home() {
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
            Hệ thống quản lý bảo hành trực tuyến
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 mx-auto tracking-tighter">
            Dịch Vụ <span className="text-primary">Tận Tâm</span><br />
            Bảo Hành <span className="text-primary">Chu Đáo</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Điện Lạnh Minh Hoàng — Chuyên sửa chữa, lắp đặt và cung cấp thiết bị điện lạnh uy tín. Tra cứu thông tin bảo hành sản phẩm của bạn ngay tại đây.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/warranty">
              <Button size="lg" className="h-14 px-10 text-base font-bold tracking-widest uppercase shadow-xl shadow-primary/20">
                <Search className="w-5 h-5 mr-2" /> Tra cứu bảo hành
              </Button>
            </Link>
            <a href="tel:0898234048">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold tracking-widest uppercase bg-white/10 text-white border-white/25 hover:bg-white/20 hover:text-white">
                Liên hệ kỹ thuật
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 md:py-32 container px-4">
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Chúng tôi làm gì</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Dịch Vụ Chuyên Nghiệp</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Xử lý mọi vấn đề về điện lạnh gia đình và công nghiệp với đội ngũ kỹ thuật viên tay nghề cao.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform">
              <Wind className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight">Vệ Sinh Máy Lạnh</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Làm sạch sâu, khử mùi hôi, tăng tuổi thọ máy và giúp không khí trong lành hơn.</p>
          </div>

          <div className="group flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight">Sửa Chữa Tại Nhà</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Có mặt nhanh chóng, chẩn đoán đúng bệnh, báo giá minh bạch và bảo hành dài hạn.</p>
          </div>

          <div className="group flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-3 tracking-tight">Lắp Đặt Di Dời</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Tư vấn vị trí lắp đặt tối ưu, thi công đúng kỹ thuật, thẩm mỹ cao cho ngôi nhà của bạn.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Tại sao chọn chúng tôi</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Cam Kết Chất Lượng<br />Từ Minh Hoàng</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Chúng tôi hiểu rằng sự hài lòng của khách hàng là thước đo thành công lớn nhất. Mọi dịch vụ đều được thực hiện với tinh thần trách nhiệm cao nhất.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Linh kiện chính hãng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Phục vụ nhanh chóng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Bảo hành dài hạn</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="/images/hero-banner.png" alt="Commitment" className="w-full h-full object-cover aspect-video lg:aspect-square" />
              <div className="absolute inset-0 bg-primary/10" />
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
