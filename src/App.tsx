import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";

const Home = lazy(() => import("./pages/Home"));
const NewAssessment = lazy(() => import("./pages/NewAssessment"));
const Result = lazy(() => import("./pages/Result"));
const SharePage = lazy(() => import("./pages/SharePage"));
const Library = lazy(() => import("./pages/Library"));
const Compare = lazy(() => import("./pages/Compare"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <I18nProvider>
      <ViewModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/new" element={<NewAssessment />} />
                  <Route path="/result/:id" element={<Result />} />
                  <Route path="/share/:id" element={<SharePage />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
      </ViewModeProvider>
    </I18nProvider>
  </ThemeProvider>
);

export default App;
