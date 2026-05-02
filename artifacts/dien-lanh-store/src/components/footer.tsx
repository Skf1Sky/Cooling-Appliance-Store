export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 md:py-16">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-white tracking-tight mb-4">Điện Lạnh<span className="text-primary">Store</span></div>
            <p className="text-sm text-slate-400 mb-6">
              Cung cấp các sản phẩm máy lạnh, máy giặt chính hãng với dịch vụ tận tâm và chuyên nghiệp.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Sản Phẩm</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/products?categoryId=1" className="hover:text-white transition-colors">Máy Lạnh / Điều Hòa</a></li>
              <li><a href="/products?categoryId=2" className="hover:text-white transition-colors">Máy Giặt</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Tất Cả Sản Phẩm</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Chính Sách</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Chính Sách Bảo Hành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính Sách Giao Hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Đổi Trả Hàng</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li>Hotline: 1800 1234</li>
              <li>Email: cskh@dienlanhstore.vn</li>
              <li>Địa chỉ: 123 Đường Điện Biên Phủ, TP.HCM</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          &copy; {new Date().getFullYear()} Điện Lạnh Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
