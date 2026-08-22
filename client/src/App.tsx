import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Converter from "@/pages/Converter";
import FormatGuide from "@/pages/format-guide";
import AIGenerator from "@/pages/ai-generator";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Home} />
      <Route path="/converter" component={Converter} />
      <Route path="/format-guide" component={FormatGuide} />
      <Route path="/ai-generator" component={AIGenerator} />
      <Route path="/pricing" component={Pricing} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
