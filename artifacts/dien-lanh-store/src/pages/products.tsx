import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const COMMON_BRANDS = ["Daikin", "LG", "Samsung", "Panasonic", "Toshiba", "Aqua", "Electrolux", "Casper", "Midea", "Sharp", "Bosch", "Mitsubishi"];

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("categoryId");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialCategoryId ? parseInt(initialCategoryId) : undefined
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [condition, setCondition] = useState<"" | "new" | "used">("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get("categoryId");
    setSelectedCategory(catId ? parseInt(catId) : undefined);
  }, [location]);

  const { data: categories } = useListCategories();

  const queryParams = {
    search: debouncedSearch || undefined,
    categoryId: selectedCategory,
    brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  };

  const { data: allProducts, isLoading } = useListProducts(queryParams);

  const products = condition
    ? allProducts?.filter((p) => (p as any).condition === condition)
    : allProducts;

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedBrands([]);
    setPriceRange({});
    setSearch("");
    setDebouncedSearch("");
    setCondition("");
  };

  const hasFilters = selectedCategory || selectedBrands.length > 0 || priceRange.min || priceRange.max || search || condition;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bộ Lọc</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground">
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Condition filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Tình trạng</h4>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCondition("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              condition === "" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/60"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setCondition("new")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              condition === "new" ? "bg-green-500 text-white border-green-500" : "border-border hover:border-green-400"
            }`}
          >
            Hàng Mới
          </button>
          <button
            onClick={() => setCondition("used")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              condition === "used" ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-400"
            }`}
          >
            Hàng Cũ
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Danh mục</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cat-all"
              checked={selectedCategory === undefined}
              onCheckedChange={() => setSelectedCategory(undefined)}
            />
            <Label htmlFor="cat-all" className="cursor-pointer">Tất cả</Label>
          </div>
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategory === cat.id}
                onCheckedChange={() => setSelectedCategory(cat.id)}
              />
              <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Thương hiệu</h4>
        <div className="space-y-2">
          {COMMON_BRANDS.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Khoảng giá</h4>
        <div className="space-y-2">
          {[
            { label: "Tất cả các mức giá", id: "price-all", value: {} },
            { label: "Dưới 3 triệu", id: "price-0", value: { max: 3000000 } },
            { label: "3 - 8 triệu", id: "price-1", value: { min: 3000000, max: 8000000 } },
            { label: "8 - 15 triệu", id: "price-2", value: { min: 8000000, max: 15000000 } },
            { label: "Trên 15 triệu", id: "price-3", value: { min: 15000000 } },
          ].map(({ label, id, value }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={
                  priceRange.min === value.min && priceRange.max === value.max &&
                  ((value.min === undefined) === (priceRange.min === undefined)) &&
                  ((value.max === undefined) === (priceRange.max === undefined))
                }
                onCheckedChange={() => setPriceRange(value)}
              />
              <Label htmlFor={id} className="cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8 px-4 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sản Phẩm</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick condition toggles on mobile */}
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => setCondition(condition === "new" ? "" : "new")}
                className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                  condition === "new" ? "bg-green-500 text-white border-green-500" : "border-border"
                }`}
              >
                Mới
              </button>
              <button
                onClick={() => setCondition(condition === "used" ? "" : "used")}
                className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                  condition === "used" ? "bg-amber-500 text-white border-amber-500" : "border-border"
                }`}
              >
                Cũ
              </button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden w-full sm:w-auto h-12">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Lọc Sản Phẩm
                  {hasFilters && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">!</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Lọc Sản Phẩm</SheetTitle>
                </SheetHeader>
                <FilterSidebar />
                <div className="mt-8 flex gap-2">
                  <SheetClose asChild>
                    <Button className="w-full">Áp dụng</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0 border-r pr-8">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3 mt-2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Hiển thị {products.length} sản phẩm
                </span>
                {condition === "new" && (
                  <Badge className="bg-green-500 text-white">Hàng Mới</Badge>
                )}
                {condition === "used" && (
                  <Badge className="bg-amber-500 text-white">Hàng Cũ</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Rất tiếc, không có sản phẩm nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các tiêu chí khác.
              </p>
              <Button onClick={clearFilters}>Xóa bộ lọc</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
