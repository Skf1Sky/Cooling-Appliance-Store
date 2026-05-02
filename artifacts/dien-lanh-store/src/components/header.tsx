import { Link } from "wouter";
import { ShoppingCart, Menu, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetCart } from "@workspace/api-client-react";

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
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold text-primary">
                  Trang Chủ
                </Link>
                <Link href="/products" className="text-lg font-medium">
                  Sản Phẩm
                </Link>
                <Link href="/products?categoryId=1" className="text-lg font-medium text-muted-foreground">
                  Máy Lạnh
                </Link>
                <Link href="/products?categoryId=2" className="text-lg font-medium text-muted-foreground">
                  Máy Giặt
                </Link>
                <Link href="/warranty" className="text-lg font-medium text-muted-foreground">
                  Kiểm Tra Bảo Hành
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary tracking-tight">Điện Lạnh<span className="text-foreground">Store</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Sản Phẩm
            </Link>
            <Link href="/products?categoryId=1" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Máy Lạnh
            </Link>
            <Link href="/products?categoryId=2" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Máy Giặt
            </Link>
            <Link href="/warranty" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Kiểm Tra Bảo Hành
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground mr-4">
            <Phone className="h-4 w-4" />
            <span>1800 1234</span>
          </div>
          
          <Link href="/products" className="hidden sm:flex">
             <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
             </Button>
          </Link>
          
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
