import { useState } from "react";
import { Search, Loader2, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

export default function Warranty() {
  const [phoneInput, setPhoneInput] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [warranties, setWarranties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = phoneInput.trim();
    if (!phone) return;

    setSearchPhone(phone);
    setIsLoading(true);
    setIsError(false);
    
    try {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWarranties(data || []);
      setIsFetched(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600"><ShieldCheck className="w-3 h-3 mr-1"/> Còn bảo hành</Badge>;
      case "expired":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/> Hết bảo hành</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white"><Clock className="w-3 h-3 mr-1"/> Chờ kích hoạt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Kiểm Tra Bảo Hành</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nhập số điện thoại để tra cứu thông tin bảo hành sản phẩm của bạn
        </p>
      </div>

      <Card className="mb-8 border-primary/20 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <Input 
              type="tel" 
              placeholder="Nhập số điện thoại..." 
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!phoneInput.trim() || isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Tra cứu
            </Button>
          </form>
        </CardContent>
      </Card>

      {isFetched && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Kết quả tra cứu cho: {searchPhone}</h2>
          
          {isError || !warranties || warranties.length === 0 ? (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Không tìm thấy thông tin bảo hành nào cho số điện thoại này.</p>
                <p className="text-sm mt-1">Vui lòng kiểm tra lại số điện thoại hoặc liên hệ tổng đài 1800 1234 để được hỗ trợ.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {warranties.map((warranty) => (
                <Card key={warranty.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg leading-tight">{warranty.product_name}</CardTitle>
                      {getStatusBadge(warranty.status)}
                    </div>
                    {warranty.serial_number && (
                      <CardDescription className="font-mono mt-1">S/N: {warranty.serial_number}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Ngày mua:</div>
                      <div className="font-medium text-right">{formatDate(warranty.purchase_date)}</div>
                      <div className="text-muted-foreground">Hết hạn bảo hành:</div>
                      <div className="font-medium text-right">{formatDate(warranty.warranty_end_date)}</div>
                    </div>
                    {warranty.note && (
                      <div className="mt-4 pt-4 border-t text-sm">
                        <div className="text-muted-foreground mb-1">Ghi chú:</div>
                        <div>{warranty.note}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
