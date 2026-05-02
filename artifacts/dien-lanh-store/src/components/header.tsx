import { Link } from "wouter";
import { ShoppingCart, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetCart } from "@workspace/api-client-react";

const NAV_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/products?categoryId=1", label: "Máy Lạnh" },
  { href: "/products?categoryId=2", label: "Máy Giặt" },
  { href: "/products?categoryId=3", label: "Tủ Lạnh" },
  { href: "/dich-vu", label: "Dịch Vụ" },
  { href: "/warranty", label: "Kiểm Tra Bảo Hành" },
];

export function Header() {
  const { data: cart } = useGetCart();
  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <div className="mb-8 mt-2">
                <span className="text-lg font-900 text-primary tracking-tight" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
                  ĐIỆN LẠNH
                </span>
                <span className="text-lg tracking-tight" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
                  {" "}MINH HOÀNG
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-label py-3 px-3 rounded-lg hover:bg-muted hover:text-primary transition-colors block"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <span className="text-base text-primary" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
              ĐIỆN LẠNH
            </span>
            <span className="text-base ml-1.5" style={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
              MINH HOÀNG
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-label px-3 py-1.5 rounded-md hover:bg-muted hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:0898234048"
            className="hidden lg:flex items-center gap-1.5 text-xs font-700 text-muted-foreground hover:text-primary transition-colors"
            style={{ fontWeight: 700, letterSpacing: "0.02em" }}
          >
            <Phone className="h-3.5 w-3.5" />
            <span>0898 234 048</span>
          </a>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-4.5 w-4.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center" style={{ fontWeight: 800 }}>
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
