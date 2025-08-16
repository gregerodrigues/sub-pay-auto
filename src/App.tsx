import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NetflixCheckout from "./pages/NetflixCheckout";
import PayIntent from "./pages/PayIntent";
import Connect from "./pages/Connect";
import CreatePlan from "./pages/CreatePlan";
import TopUp from "./pages/TopUp";
import Allocate from "./pages/Allocate";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";
import SubscriptionDetail from "./pages/SubscriptionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo/netflix-checkout" element={<NetflixCheckout />} />
          <Route path="/pay-intent" element={<PayIntent />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/create-plan" element={<CreatePlan />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/allocate" element={<Allocate />} />
          <Route path="/success" element={<Success />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/sub/:id" element={<SubscriptionDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
