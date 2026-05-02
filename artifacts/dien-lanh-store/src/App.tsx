import { lazy, Suspense, useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Loader2, Phone, X } from "lucide-react";

const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const Cart = lazy(() => import("@/pages/cart"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Login = lazy(() => import("@/pages/login"));
const Warranty = lazy(() => import("@/pages/warranty"));
const Admin = lazy(() => import("@/pages/admin"));
const DichVu = lazy(() => import("@/pages/dich-vu"));
const GioiThieu = lazy(() => import("@/pages/gioi-thieu"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function FloatingCallButton() {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Expanded card */}
      {expanded && (
        <div className="animate-in slide-in-from-bottom-3 fade-in duration-200 bg-white rounded-2xl shadow-2xl border border-border p-4 w-56 mb-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Liên hệ ngay</span>
            <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <a
            href="tel:0898234048"
            className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Gọi ngay</div>
              <div className="text-sm font-black text-foreground tracking-tight">0898 234 048</div>
            </div>
          </a>
          <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
            Tư vấn miễn phí · 7:00 – 21:00 mỗi ngày
          </p>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-200"
        aria-label="Gọi điện tư vấn"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        <Phone className="w-6 h-6 relative z-10" />
      </button>

      {/* Label below button */}
      {!expanded && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground text-center w-14">
          Gọi tư vấn
        </span>
      )}
    </div>
  );
}

function Router() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:id" component={ProductDetail} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/login" component={Login} />
            <Route path="/warranty" component={Warranty} />
            <Route path="/dich-vu" component={DichVu} />
            <Route path="/gioi-thieu" component={GioiThieu} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
      <FloatingCallButton />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
