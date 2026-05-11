import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, MessageSquare, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="block text-xl font-bold font-display text-foreground">Review Lens</span>
              <span className="hidden text-xs font-medium text-muted-foreground sm:block">AI shopping insights</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link to="/chatbot" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
              AI Assistant
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
              <Link to="/dashboard">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
              <Link to="/chatbot">
                <MessageSquare className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
              <Link to="/dashboard">
                <BarChart3 className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero" size="lg" className="px-5 sm:px-8" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
