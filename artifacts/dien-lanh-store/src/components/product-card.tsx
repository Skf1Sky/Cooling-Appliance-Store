import { Link } from "wouter";
import { formatVND } from "@/lib/format";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isUsed = product.condition === "used";

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-transparent hover:border-primary/20 flex flex-col">
        <CardHeader className="p-0 relative aspect-square bg-white">
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isUsed ? (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                Hàng Cũ
              </Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-500 text-white text-[10px] px-1.5 py-0.5">
                Hàng Mới
              </Badge>
            )}
            {product.discountPercent ? (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                -{product.discountPercent}%
              </Badge>
            ) : null}
          </div>
          {product.isFeatured && (
            <Badge variant="secondary" className="absolute top-2 right-2 z-10 text-[10px] px-1.5 py-0.5">
              Nổi bật
            </Badge>
          )}
          <img
            src={product.imageUrl || "/images/category-ac.png"}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="text-xs text-muted-foreground mb-1 font-medium">{product.brand}</div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {!isUsed && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating?.toFixed(1) || "5.0"}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
            </div>
          )}
          {isUsed && (
            <p className="text-xs text-amber-600 mb-3 font-medium">Bảo hành cửa hàng</p>
          )}
          <div className="mt-auto">
            <div className="text-lg font-bold text-primary">{formatVND(product.price)}</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-xs text-muted-foreground line-through">
                {formatVND(product.originalPrice)}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Xem Chi Tiết
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
