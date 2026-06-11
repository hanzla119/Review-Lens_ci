import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, ShoppingCart, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import CartDrawer from "@/components/CartDrawer";
import { readCart } from "@/lib/cartStorage";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show navbar when scrolling up
          if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }
          // Hide navbar when scrolling down (but keep it visible at the top)
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const syncCart = () => setCartCount(readCart().length);
    syncCart();
    window.addEventListener("cart-storage-updated", syncCart);
    return () => window.removeEventListener("cart-storage-updated", syncCart);
  }, []);

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 border-b border-border/80 bg-white/90 shadow-sm backdrop-blur-xl transition-transform duration-300 ease-in-out ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    }`}>
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
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)}>
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Button>
                <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold shadow-sm sm:flex">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <UserCircle className="h-5 w-5 text-primary" />
                  )}
                  <span className="max-w-[140px] truncate">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="lg" className="px-4" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" size="lg" className="px-5 sm:px-8" asChild>
                  <Link to="/signup">Signup</Link>
                </Button>
              </div>
            )}
          </div>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
