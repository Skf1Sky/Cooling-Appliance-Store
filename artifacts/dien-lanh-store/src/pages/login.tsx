import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    loginMutation.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation("/admin");
        },
        onError: () => {
          setError("Tài khoản hoặc mật khẩu không chính xác");
        }
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold text-primary tracking-tight">Điện Lạnh<span className="text-foreground">Store</span></span>
          </div>
          <CardTitle className="text-2xl font-bold">Đăng nhập quản trị</CardTitle>
          <CardDescription>
            Nhập thông tin tài khoản để truy cập hệ thống
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Tài khoản</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
