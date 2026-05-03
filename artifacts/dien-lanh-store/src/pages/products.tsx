import { useState, useEffect } from "react";
import { useSearch } from "wouter/use-browser-location";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Package } from "lucide-react";

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryId = params.get("categoryId");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase.from("products").select("*").order("created_at", { ascending: false });
        
        if (categoryId) {
          query = query.eq("category_id", parseInt(categoryId));
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryId]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryTitle = () => {
    switch (categoryId) {
      case "1": return "Máy Lạnh";
      case "2": return "Máy Giặt";
      case "3": return "Tủ Lạnh";
      default: return "Tất Cả Sản Phẩm";
    }
  };

  return (
    <div className="container px-4 py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{getCategoryTitle()}</h1>
          <p className="text-muted-foreground">Khám phá danh sách thiết bị điện lạnh chất lượng cao.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm sản phẩm..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-slate-500">Thử tìm kiếm với từ khóa khác hoặc quay lại sau.</p>
        </div>
      )}
    </div>
  );
}
