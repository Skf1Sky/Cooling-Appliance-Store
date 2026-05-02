import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatVND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Wrench, 
  Truck 
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: { enabled: !!productId }
  });

  const addToCartMutation = useAddToCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCartMutation.mutate(
      { data: { productId: product.id, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Đã thêm vào giỏ hàng",
            description: `${product.name} (x${quantity}) đã được thêm.`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.",
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Skeleton className="h-4 w-16" /> <ChevronRight className="w-4 h-4" />
          <Skeleton className="h-4 w-20" /> <ChevronRight className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
        <p className="text-muted-foreground mb-8">Rất tiếc, chúng tôi không tìm thấy sản phẩm bạn yêu cầu.</p>
        <Link href="/products">
          <Button>Quay lại danh sách sản phẩm</Button>
        </Link>
      </div>
    );
  }

  const allImages = [product.imageUrl || "/images/category-ac.png", ...(product.images || [])];

  return (
    <div className="container py-8 px-4 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link href="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link href={`/products?categoryId=${product.categoryId}`} className="hover:text-foreground transition-colors">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-2xl border p-8 flex items-center justify-center relative overflow-hidden group">
            {product.discountPercent ? (
              <Badge variant="destructive" className="absolute top-4 left-4 text-sm px-3 py-1">
                Giảm {product.discountPercent}%
              </Badge>
            ) : null}
            <img 
              src={allImages[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center transition-all ${activeImage === idx ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating?.toFixed(1) || "5.0"}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount || 0} đánh giá)</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground leading-tight">
            {product.name}
          </h1>
          
          <div className="mb-8">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-bold text-primary">{formatVND(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through pb-1">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 mt-2">
                Còn hàng
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-2">
                Hết hàng
              </Badge>
            )}
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl mb-8 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Bảo hành chính hãng</p>
                <p className="text-sm text-muted-foreground">2 năm cho máy, 10 năm cho máy nén/động cơ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wrench className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Miễn phí công lắp đặt</p>
                <p className="text-sm text-muted-foreground">Áp dụng cho khu vực nội thành</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Giao hàng nhanh</p>
                <p className="text-sm text-muted-foreground">Trong vòng 24h kể từ khi đặt hàng</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border rounded-md h-12">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || !product.inStock}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-12 flex items-center justify-center font-medium">
                {quantity}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full rounded-l-none"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              className="flex-1 h-12 text-base" 
              onClick={handleAddToCart}
              disabled={!product.inStock || addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? (
                "Đang thêm..."
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào giỏ
                </>
              )}
            </Button>
          </div>
          
          {product.description && (
            <div className="text-muted-foreground leading-relaxed line-clamp-4">
              {product.description}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="w-full md:w-auto h-auto p-1 bg-slate-100 mb-8 border-b-0 rounded-lg overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="specs" className="text-base px-6 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger value="desc" className="text-base px-6 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Đặc điểm nổi bật
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="animate-in fade-in duration-500">
          <div className="bg-white border rounded-xl overflow-hidden max-w-3xl">
            <div className="p-6 bg-slate-50 border-b">
              <h3 className="font-semibold text-lg">Thông số kỹ thuật chi tiết</h3>
            </div>
            <div className="p-0">
              {product.specs ? (
                <div className="divide-y">
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row py-4 px-6 hover:bg-slate-50 transition-colors">
                      <div className="w-full sm:w-1/3 text-muted-foreground font-medium mb-1 sm:mb-0 pr-4">{key}</div>
                      <div className="w-full sm:w-2/3">{value as string}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Đang cập nhật thông số kỹ thuật
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="desc" className="animate-in fade-in duration-500">
          <div className="prose prose-slate max-w-4xl prose-p:leading-relaxed prose-headings:text-foreground">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>Đang cập nhật thông tin</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
