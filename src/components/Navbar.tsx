import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, BarChart3 } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-gradient">Review Lens</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/chatbot" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Assistant
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/chatbot">
                <MessageSquare className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <BarChart3 className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
