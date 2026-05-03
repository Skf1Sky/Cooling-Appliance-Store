import { Link } from "wouter";
import { ShoppingCart, Menu, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/products", label: "Sản Phẩm" },
  { href: "/dich-vu", label: "Dịch Vụ" },
  { href: "/warranty", label: "Kiểm Tra Bảo Hành" },
];

export function Header() {
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
            className="flex items-center gap-1.5 text-xs font-700 text-muted-foreground hover:text-primary transition-colors border-r pr-3 mr-1"
            style={{ fontWeight: 700, letterSpacing: "0.02em" }}
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">0898 234 048</span>
          </a>
          
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" title="Quản trị hệ thống">
              <Lock className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
