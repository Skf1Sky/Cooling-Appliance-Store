import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wind, RefreshCw, Wrench, Phone, CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    icon: Wind,
    title: "Vệ Sinh Máy Lạnh",
    subtitle: "Làm sạch — Khử khuẩn — Tăng hiệu suất",
    description:
      "Vệ sinh máy lạnh định kỳ giúp thiết bị hoạt động bền bỉ, tiết kiệm điện và đảm bảo không khí trong lành cho gia đình bạn.",
    benefits: [
      "Vệ sinh dàn lạnh, dàn nóng chuyên sâu",
      "Khử khuẩn, loại bỏ nấm mốc và vi khuẩn",
      "Kiểm tra gas và áp suất hoạt động",
      "Bảo dưỡng động cơ quạt và bộ điều khiển",
      "Cam kết máy hoạt động ổn định sau dịch vụ",
    ],
    color: "bg-sky-50 border-sky-100",
    iconColor: "bg-sky-100 text-sky-600",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    icon: RefreshCw,
    title: "Thu Cũ Đổi Mới",
    subtitle: "Định giá hợp lý — Đổi nhanh — Tiết kiệm chi phí",
    description:
      "Bạn muốn nâng cấp thiết bị điện lạnh mà không muốn lãng phí máy cũ? Chúng tôi thu mua với giá tốt và hỗ trợ trừ thẳng vào đơn hàng mới.",
    benefits: [
      "Thu mua máy lạnh, máy giặt, tủ lạnh đã qua sử dụng",
      "Định giá nhanh, minh bạch, sát thị trường",
      "Trừ trực tiếp vào giá sản phẩm mới",
      "Hỗ trợ vận chuyển và tháo lắp tận nơi",
      "Thủ tục đơn giản, không mất thêm phí",
    ],
    color: "bg-green-50 border-green-100",
    iconColor: "bg-green-100 text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  {
    icon: Wrench,
    title: "Sửa Chữa Điện Lạnh",
    subtitle: "Chuẩn đoán đúng — Sửa nhanh — Bảo hành dịch vụ",
    description:
      "Đội ngũ kỹ thuật viên giàu kinh nghiệm xử lý mọi sự cố cho máy lạnh, máy giặt và tủ lạnh các hãng tại nhà bạn.",
    benefits: [
      "Sửa chữa máy lạnh: không lạnh, chảy nước, hỏng bo mạch",
      "Sửa máy giặt: không vắt, rung ồn, không thoát nước",
      "Sửa tủ lạnh: không mát, đóng tuyết, hỏng máy nén",
      "Thay thế linh kiện chính hãng",
      "Bảo hành dịch vụ sửa chữa từ 3–6 tháng",
    ],
    color: "bg-orange-50 border-orange-100",
    iconColor: "bg-orange-100 text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
];

export default function DichVu() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dịch Vụ <span className="text-primary">Điện Lạnh</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Điện Lạnh Minh Hoàng cung cấp đầy đủ các dịch vụ bảo dưỡng và sửa chữa thiết bị điện lạnh chuyên nghiệp tại nhà bạn.
          </p>
          <a href="tel:0898234048">
            <Button size="lg" className="text-base h-12 px-8">
              <Phone className="w-4 h-4 mr-2" />
              Gọi ngay: 0898 234 048
            </Button>
          </a>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`rounded-2xl border p-8 flex flex-col ${service.color}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${service.iconColor}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{service.title}</h2>
                <p className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full inline-self-start mb-4 w-fit ${service.badge}`}>
                  {service.subtitle}
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2.5 flex-1">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <a href="tel:0898234048" className="mt-8 block">
                  <Button className="w-full" variant="default">
                    <Phone className="w-4 h-4 mr-2" />
                    Đặt lịch ngay
                  </Button>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-14 bg-primary/5 border-y">
        <div className="container px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Liên Hệ Tư Vấn Miễn Phí</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Gặp sự cố với thiết bị điện lạnh? Gọi ngay để được kỹ thuật viên tư vấn và đặt lịch phục vụ tận nhà.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0898234048">
              <Button size="lg" className="h-12 px-8">
                <Phone className="w-4 h-4 mr-2" />
                0898 234 048
              </Button>
            </a>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Về Trang Chủ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
