export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 md:py-16">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-white tracking-tight mb-4">
              Điện Lạnh<span className="text-primary"> Minh Hoàng</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Cung cấp các sản phẩm máy lạnh, máy giặt, tủ lạnh chính hãng với dịch vụ tận tâm và chuyên nghiệp.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sản Phẩm</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/products?categoryId=1" className="hover:text-white transition-colors">Máy Lạnh / Điều Hòa</a></li>
              <li><a href="/products?categoryId=2" className="hover:text-white transition-colors">Máy Giặt</a></li>
              <li><a href="/products?categoryId=3" className="hover:text-white transition-colors">Tủ Lạnh</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Dịch Vụ</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/dich-vu" className="hover:text-white transition-colors">Vệ Sinh Máy Lạnh</a></li>
              <li><a href="/dich-vu" className="hover:text-white transition-colors">Thu Cũ Đổi Mới</a></li>
              <li><a href="/dich-vu" className="hover:text-white transition-colors">Sửa Chữa Điện Lạnh</a></li>
              <li><a href="/warranty" className="hover:text-white transition-colors">Kiểm Tra Bảo Hành</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li>Hotline: <a href="tel:0898234048" className="hover:text-white transition-colors">0898 234 048</a></li>
              <li>Email: <a href="mailto:hoang115@gmail.com" className="hover:text-white transition-colors">hoang115@gmail.com</a></li>
              <li>Địa chỉ: 123 Bãi Sậy</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          &copy; {new Date().getFullYear()} Điện Lạnh Minh Hoàng. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
