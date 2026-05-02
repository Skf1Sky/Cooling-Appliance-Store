import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, useCreateOrder, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatVND } from "@/lib/format";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  customerName: z.string().min(2, { message: "Vui lòng nhập họ tên" }),
  customerPhone: z.string().min(10, { message: "Vui lòng nhập số điện thoại hợp lệ" }),
  customerEmail: z.string().email({ message: "Vui lòng nhập email hợp lệ" }).optional().or(z.literal("")),
  shippingAddress: z.string().min(10, { message: "Vui lòng nhập địa chỉ giao hàng cụ thể" }),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading: isLoadingCart } = useGetCart();
  const createOrderMutation = useCreateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      shippingAddress: "",
      note: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    createOrderMutation.mutate(
      { data },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setOrderSuccess(order);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Lỗi đặt hàng",
            description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
          });
        }
      }
    );
  };

  if (isLoadingCart) {
    return <div className="container py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // Show success screen
  if (orderSuccess) {
    return (
      <div className="container py-16 px-4 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Cảm ơn bạn đã mua sắm tại Điện Lạnh Store. Mã đơn hàng của bạn là <strong className="text-foreground">#{orderSuccess.id}</strong>.
        </p>
        <div className="bg-slate-50 border rounded-xl p-6 w-full text-left mb-8 space-y-4">
          <div>
            <span className="text-muted-foreground text-sm">Họ tên:</span>
            <div className="font-medium">{orderSuccess.customerName}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Số điện thoại:</span>
            <div className="font-medium">{orderSuccess.customerPhone}</div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Địa chỉ giao hàng & lắp đặt:</span>
            <div className="font-medium">{orderSuccess.shippingAddress}</div>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Tổng thanh toán:</span>
            <span className="text-primary">{formatVND(orderSuccess.total)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Nhân viên của chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng và hẹn lịch giao hàng/lắp đặt.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8">Trở về trang chủ</Button>
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="container py-8 px-4 md:py-12">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại giỏ hàng
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span> 
              Thông tin giao hàng
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại *</FormLabel>
                        <FormControl>
                          <Input placeholder="0901234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Không bắt buộc)</FormLabel>
                      <FormControl>
                        <Input placeholder="nguyenvana@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ giao hàng & lắp đặt chi tiết *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" 
                          className="resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú cho đơn hàng (Không bắt buộc)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ghi chú về thời gian giao hàng, vị trí lắp đặt..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 hidden lg:block">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 text-base"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                    Hoàn Tất Đặt Hàng
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-slate-50 rounded-xl border p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h3>
            
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-white rounded border p-1 shrink-0">
                    <img 
                      src={item.productImageUrl || "/images/category-ac.png"} 
                      alt={item.productName}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="text-sm font-medium line-clamp-2 leading-tight">
                      {item.productName}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">SL: {item.quantity}</span>
                      <span className="text-sm font-semibold">{formatVND(item.subtotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="mb-4" />
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
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
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mb-6">
              <p className="font-medium mb-1">Thanh toán khi nhận hàng (COD)</p>
              <p className="opacity-80">Quý khách vui lòng thanh toán bằng tiền mặt hoặc chuyển khoản cho nhân viên giao hàng sau khi đã kiểm tra và lắp đặt xong.</p>
            </div>
            
            <div className="lg:hidden">
              <Button 
                onClick={() => form.handleSubmit(onSubmit)()} 
                size="lg" 
                className="w-full h-14 text-base"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                Hoàn Tất Đặt Hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
