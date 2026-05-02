export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14">
      <div className="container px-4 text-center">

        {/* Brand */}
        <div className="mb-8">
          <div className="text-xl font-black text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
            ĐIỆN LẠNH <span className="text-primary">MINH HOÀNG</span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Máy lạnh, máy giặt, tủ lạnh chính hãng — dịch vụ lắp đặt tận tâm và chuyên nghiệp.
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8 text-xs font-bold tracking-widest uppercase text-slate-500">
          <a href="/products?categoryId=1" className="hover:text-white transition-colors">Máy Lạnh</a>
          <a href="/products?categoryId=2" className="hover:text-white transition-colors">Máy Giặt</a>
          <a href="/products?categoryId=3" className="hover:text-white transition-colors">Tủ Lạnh</a>
          <a href="/dich-vu" className="hover:text-white transition-colors">Dịch Vụ</a>
          <a href="/warranty" className="hover:text-white transition-colors">Kiểm Tra Bảo Hành</a>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-10 text-sm">
          <a href="tel:0898234048" className="hover:text-white transition-colors">📞 0898 234 048</a>
          <a href="mailto:hoang115@gmail.com" className="hover:text-white transition-colors">✉️ hoang115@gmail.com</a>
          <span>📍 123 Bãi Sậy</span>
        </div>

        {/* Divider + copyright */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Điện Lạnh Minh Hoàng. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
