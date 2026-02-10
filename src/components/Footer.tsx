import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-display text-gradient">Review Lens</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              AI-powered shopping insights platform that helps you compare prices, analyze reviews, 
              and make confident purchasing decisions across multiple e-commerce platforms.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">GitHub</Button>
              <Button variant="outline" size="sm">Documentation</Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold font-display mb-4">Platform</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/chatbot" className="hover:text-foreground transition-colors">AI Assistant</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Price Tracking</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Sentiment Analysis</a></li>
            </ul>
          </div>

         
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Review Lens. Built with React, Tailwind CSS & AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
