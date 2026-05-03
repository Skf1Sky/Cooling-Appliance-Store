import { Link } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatVND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { data: cart, isLoading } = useGetCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateItemMutation.mutate(
      { itemId, data: { quantity: newQuantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
      }
    );
  };

  const handleRemoveItem = (itemId: number, productName: string) => {
    removeItemMutation.mutate(
      { itemId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            description: `Đã xóa ${productName} khỏi giỏ hàng`,
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container py-12 px-4">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="container py-24 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Bạn chưa chọn sản phẩm nào. Hãy dạo quanh cửa hàng và chọn những sản phẩm tốt nhất cho gia đình nhé.
        </p>
        <Link href="/products">
          <Button size="lg" className="h-12 px-8 text-base">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Giỏ Hàng <span className="text-muted-foreground text-xl font-normal">({cart.itemCount} sản phẩm)</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>
            
            {/* Items */}
            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
                  <div className="col-span-6 flex gap-4 w-full">
                    <Link href={`/products/${item.productId}`} className="shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-lg border p-2 flex items-center justify-center">
                        <img 
                          src={item.productImageUrl || "/images/category-ac.png"} 
                          alt={item.productName} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <Link href={`/products/${item.productId}`} className="font-semibold text-base hover:text-primary transition-colors line-clamp-2">
                        {item.productName}
                      </Link>
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.productName)}
                        className="text-sm text-destructive hover:underline self-start mt-2 flex items-center gap-1"
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center font-medium w-full md:w-auto flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground">Đơn giá:</span>
                    {formatVND(item.price)}
                  </div>
                  
                  <div className="col-span-2 flex justify-center w-full md:w-auto">
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-slate-50 transition-colors"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItemMutation.isPending}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </div>
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-slate-50 transition-colors"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updateItemMutation.isPending}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right font-bold text-primary w-full md:w-auto flex justify-between md:block">
                    <span className="md:hidden text-muted-foreground font-normal">Thành tiền:</span>
                    {formatVND(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/products">
              <Button variant="outline" className="flex items-center">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-xl border p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính ({cart.itemCount} sản phẩm)</span>
                <span>{formatVND(cart.total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí giao hàng</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Công lắp đặt</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary">{formatVND(cart.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-right">(Đã bao gồm VAT nếu có)</p>
            </div>
            
            <Link href="/checkout">
              <Button className="w-full h-14 text-base" size="lg">
                Tiến Hành Đặt Hàng <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" /> Thanh toán an toàn và bảo mật
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
