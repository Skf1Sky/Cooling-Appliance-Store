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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="text-xl font-bold text-primary tracking-tight mb-6 mt-2">
                Điện Lạnh<span className="text-foreground"> Minh Hoàng</span>
              </div>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary tracking-tight">
              Điện Lạnh<span className="text-foreground"> Minh Hoàng</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
            <Phone className="h-4 w-4" />
            <span>0898 234 048</span>
          </div>

          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative group">
              <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
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
