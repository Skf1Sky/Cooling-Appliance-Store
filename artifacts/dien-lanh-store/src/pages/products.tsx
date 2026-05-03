import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategoryId = searchParams.get("categoryId");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest");

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (selectedCategoryId) {
      result = result.filter(p => p.categoryId === Number(selectedCategoryId));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [searchQuery, selectedCategoryId, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản Phẩm</h1>
          <p className="text-muted-foreground mt-1">Tìm kiếm thiết bị phù hợp với gia đình bạn</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm sản phẩm..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button 
          variant={selectedCategoryId === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategoryId(null)}
        >
          Tất cả
        </Button>
        {MOCK_CATEGORIES.map((cat) => (
          <Button 
            key={cat.id}
            variant={selectedCategoryId === String(cat.id) ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategoryId(String(cat.id))}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
        </div>
      )}
    </div>
  );
}
