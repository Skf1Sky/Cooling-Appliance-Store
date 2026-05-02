import { ShieldCheck, Clock, Users, Star, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const STATS = [
  { value: "500+", label: "Khách hàng tin dùng" },
  { value: "5+", label: "Năm kinh nghiệm" },
  { value: "3", label: "Danh mục sản phẩm" },
  { value: "15km", label: "Bán kính giao hàng miễn phí" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Uy Tín & Minh Bạch",
    desc: "Mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi bàn giao. Chúng tôi cam kết không bán hàng kém chất lượng.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Clock,
    title: "Phục Vụ Tận Tâm",
    desc: "Hỗ trợ tư vấn từ 7:00 – 21:00 mỗi ngày. Kỹ thuật viên đến tận nhà lắp đặt và sửa chữa nhanh chóng.",
    color: "text-green-600 bg-green-100",
  },
  {
    icon: Users,
    title: "Gắn Bó Cộng Đồng",
    desc: "Là cửa hàng địa phương, chúng tôi luôn ưu tiên lợi ích của khách hàng trong khu vực hơn lợi nhuận ngắn hạn.",
    color: "text-orange-600 bg-orange-100",
  },
  {
    icon: Star,
    title: "Giá Cả Hợp Lý",
    desc: "Cung cấp cả hàng mới chính hãng và hàng cũ còn tốt — giúp khách hàng có nhiều lựa chọn phù hợp với ngân sách.",
    color: "text-amber-600 bg-amber-100",
  },
];

export default function GioiThieu() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-slate-900 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <p className="nav-label text-primary mb-4">Về Chúng Tôi</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5" style={{ letterSpacing: "-0.04em" }}>
            Điện Lạnh Minh Hoàng
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Cửa hàng điện lạnh uy tín tại địa phương — chuyên cung cấp máy lạnh, máy giặt, tủ lạnh mới và cũ với dịch vụ lắp đặt tận tâm.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b bg-white">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-primary mb-1" style={{ letterSpacing: "-0.04em" }}>{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20 container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="nav-label text-primary mb-4">Câu Chuyện</p>
          <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ letterSpacing: "-0.04em" }}>
            Bắt Đầu Từ Đam Mê
          </h2>
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              Điện Lạnh Minh Hoàng được thành lập bởi anh <strong className="text-foreground">Minh Hoàng</strong> — một kỹ thuật viên điện lạnh với hơn 5 năm kinh nghiệm trong ngành. Xuất phát từ mong muốn mang đến cho người dân địa phương một địa chỉ mua sắm điện lạnh đáng tin cậy, cửa hàng được ra đời tại 123 Bãi Sậy.
            </p>
            <p>
              Điểm khác biệt của chúng tôi là không chỉ bán hàng mới chính hãng, mà còn cung cấp <strong className="text-foreground">hàng cũ đã qua sử dụng còn tốt</strong> — được kiểm tra kỹ, vệ sinh sạch và có bảo hành rõ ràng. Điều này giúp nhiều gia đình có thể sở hữu thiết bị điện lạnh chất lượng với chi phí hợp lý.
            </p>
            <p>
              Với phương châm <strong className="text-foreground">"Uy tín – Tận tâm – Hợp lý"</strong>, chúng tôi luôn đặt lợi ích khách hàng lên hàng đầu trong từng giao dịch.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <p className="nav-label text-primary mb-3">Giá Trị</p>
            <h2 className="text-3xl md:text-4xl font-black" style={{ letterSpacing: "-0.04em" }}>Cam Kết Của Chúng Tôi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-4 p-6 bg-white rounded-xl border items-start">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${v.color}`}>
                  <v.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm mb-1.5 tracking-tight">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Map */}
      <section className="py-16 md:py-20 container px-4">
        <div className="text-center mb-12">
          <p className="nav-label text-primary mb-3">Tìm Chúng Tôi</p>
          <h2 className="text-3xl md:text-4xl font-black" style={{ letterSpacing: "-0.04em" }}>Địa Chỉ & Liên Hệ</h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact info */}
          <div className="space-y-5">
            <div className="flex gap-4 items-start p-5 bg-white rounded-xl border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Địa Chỉ</div>
                <div className="text-sm font-semibold">123 Bãi Sậy</div>
                <div className="text-xs text-muted-foreground mt-0.5">Mở cửa: 7:00 – 21:00, mỗi ngày</div>
              </div>
            </div>

            <div className="flex gap-4 items-start p-5 bg-white rounded-xl border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Hotline</div>
                <a href="tel:0898234048" className="text-sm font-semibold hover:text-primary transition-colors">
                  0898 234 048
                </a>
                <div className="text-xs text-muted-foreground mt-0.5">Tư vấn miễn phí · Hỗ trợ 7 ngày/tuần</div>
              </div>
            </div>

            <div className="flex gap-4 items-start p-5 bg-white rounded-xl border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Email</div>
                <a href="mailto:hoang115@gmail.com" className="text-sm font-semibold hover:text-primary transition-colors">
                  hoang115@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a href="tel:0898234048" className="flex-1">
                <Button className="w-full font-bold tracking-widest uppercase text-xs h-11">
                  <Phone className="w-4 h-4 mr-2" /> Gọi Ngay
                </Button>
              </a>
              <Link href="/products" className="flex-1">
                <Button variant="outline" className="w-full font-bold tracking-widest uppercase text-xs h-11">
                  Xem Sản Phẩm
                </Button>
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border shadow-sm h-[380px]">
            <iframe
              title="Bản đồ Điện Lạnh Minh Hoàng"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0966!2d105.8514!3d21.0245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzI4LjIiTiAxMDXCsDUxJzA1LjAiRQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn&q=B%C3%A3i+S%E1%BA%ADy%2C+H%C3%A0+N%E1%BB%99i"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
