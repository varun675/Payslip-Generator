import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PayslipGenerator from "@/pages/payslip-generator";
import NotFound from "@/pages/not-found";

// Get base path from environment
const basePath = import.meta.env.PROD ? "/Payslip-Generator" : "";

function Router() {
  return (
    <WouterRouter base={basePath}>
      <Switch>
        <Route path="/" component={PayslipGenerator} />
        <Route path="/*" component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
