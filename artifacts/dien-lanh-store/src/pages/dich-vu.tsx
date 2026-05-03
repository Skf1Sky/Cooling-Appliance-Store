import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Wind, 
  RefreshCw, 
  Wrench, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  HeartHandshake 
} from "lucide-react";

const SERVICES = [
  {
    icon: Wind,
    title: "Vệ Sinh Máy Lạnh",
    subtitle: "SẠCH SÂU — DIỆT KHUẨN",
    description: "Vệ sinh máy lạnh định kỳ giúp tăng hiệu suất làm lạnh, tiết kiệm 30% điện năng và bảo vệ sức khỏe gia đình bạn.",
    benefits: ["Khử nấm mốc chuyên sâu", "Kiểm tra gas miễn phí", "Bảo dưỡng dàn nóng/lạnh"],
    gradient: "from-blue-600 to-sky-400",
    shadow: "shadow-blue-200",
  },
  {
    icon: Wrench,
    title: "Sửa Chữa Chuyên Nghiệp",
    subtitle: "NHANH CHÓNG — CHÍNH XÁC",
    description: "Xử lý triệt để mọi sự cố: Máy lạnh không lạnh, máy giặt không vắt, tủ lạnh hỏng block... Linh kiện chính hãng.",
    benefits: ["Kỹ thuật viên 5 năm kinh nghiệm", "Báo giá trước khi làm", "Bảo hành 6–12 tháng"],
    gradient: "from-orange-600 to-amber-400",
    shadow: "shadow-orange-200",
  },
  {
    icon: RefreshCw,
    title: "Thu Cũ Đổi Mới",
    subtitle: "GIÁ TỐT — TIẾT KIỆM",
    description: "Hỗ trợ thu mua máy cũ giá cao, đổi máy mới với chiết khấu hấp dẫn. Giải pháp nâng cấp thiết bị tiết kiệm nhất.",
    benefits: ["Định giá tại nhà", "Trừ thẳng vào máy mới", "Hỗ trợ tháo lắp miễn phí"],
    gradient: "from-emerald-600 to-teal-400",
    shadow: "shadow-emerald-200",
  },
];

const PROCESS = [
  { step: "01", title: "Tiếp Nhận", desc: "Liên hệ qua Hotline hoặc Zalo để đặt lịch hẹn." },
  { step: "02", title: "Kiểm Tra", desc: "Kỹ thuật viên đến tận nhà chuẩn đoán sự cố." },
  { step: "03", title: "Xử Lý", desc: "Sửa chữa nhanh chóng sau khi báo giá minh bạch." },
  { step: "04", title: "Bàn Giao", desc: "Viết phiếu bảo hành và hướng dẫn sử dụng bền lâu." },
];

export default function DichVu() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <Zap className="w-3 h-3 fill-primary" />
              DỊCH VỤ TẬN TÂM — CHẤT LƯỢNG VÀNG
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700">
              Chăm Sóc <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Điện Lạnh</span><br />
              Chuẩn Chuyên Gia
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
              Điện Lạnh Minh Hoàng cung cấp giải pháp sửa chữa, bảo trì máy lạnh, máy giặt, tủ lạnh chuyên nghiệp tại nhà. Chúng tôi cam kết uy tín, đúng giá và bảo hành dài hạn.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <a href="tel:0898234048">
                <Button size="lg" className="h-14 px-8 text-base font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                  <Phone className="w-5 h-5 mr-2" /> Gọi ngay: 0898 234 048
                </Button>
              </a>
              <Link href="/warranty">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold uppercase tracking-widest text-white border-white/20 hover:bg-white/10">
                  Tra cứu bảo hành
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 container px-4 relative -mt-16 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.title} 
                className={`group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 ${service.shadow}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-8 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-xs font-black tracking-[0.2em] text-primary mb-3">{service.subtitle}</div>
                <h2 className="text-2xl font-black mb-4 tracking-tight">{service.title}</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">{service.description}</p>
                
                <ul className="space-y-3 mb-10">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
                
                <a href="tel:0898234048" className="mt-auto block">
                  <Button variant="ghost" className="w-full h-12 rounded-xl group-hover:bg-slate-50 border border-slate-100 font-bold text-xs uppercase tracking-widest">
                    Đặt lịch ngay <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 text-center">
          <p className="text-xs font-black tracking-[0.4em] text-primary mb-4 uppercase">Quy trình làm việc</p>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tighter">4 Bước Nhanh Chóng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-slate-200 z-0" />
            
            {PROCESS.map((p) => (
              <div key={p.step} className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-50 shadow-xl flex items-center justify-center mb-6 text-2xl font-black text-primary">
                  {p.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Bảo Hành Dài Hạn</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Chúng tôi cung cấp phiếu bảo hành chính hãng từ 6 đến 12 tháng cho mọi dịch vụ.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Phục Vụ Siêu Tốc</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Có mặt trong vòng 30 phút sau khi nhận được yêu cầu trong khu vực nội thành.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">Giá Cả Minh Bạch</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Kiểm tra miễn phí, báo giá rõ ràng trước khi sửa, cam kết không phát sinh thêm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 container px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">Bạn Cần Hỗ Trợ Ngay?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10">
            Đừng để thiết bị hỏng làm ảnh hưởng đến cuộc sống của bạn. Gọi ngay cho chúng tôi để được tư vấn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a href="tel:0898234048">
              <Button size="lg" className="h-16 px-10 text-lg font-bold uppercase tracking-widest">
                <Phone className="w-5 h-5 mr-3" /> Gọi: 0898 234 048
              </Button>
            </a>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold uppercase tracking-widest text-white border-white/20 hover:bg-white/10">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
