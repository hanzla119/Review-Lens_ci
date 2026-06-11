import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { CartItem, clearCart, readCart, removeCartItem } from "@/lib/cartStorage";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setItems(readCart());

    const handleUpdate = () => setItems(readCart());
    window.addEventListener("cart-storage-updated", handleUpdate);
    return () => window.removeEventListener("cart-storage-updated", handleUpdate);
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`absolute right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <ShoppingCart className="h-5 w-5" />
            My Cart
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Card className="h-full border-none shadow-none">
          <CardHeader className="border-b border-border px-4 py-4">
            <CardTitle className="text-base">Saved Products</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tap a product to review it again any time after login.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-muted/60 p-6 text-center text-sm text-muted-foreground">
                Your saved items will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-border bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                            <p className="text-xs uppercase text-muted-foreground">{item.platform} • {item.category}</p>
                          </div>
                          <Badge variant="secondary">{new Intl.NumberFormat("en-PK", { style: "currency", currency: item.currency || "PKR", minimumFractionDigits: 0 }).format(item.price)}</Badge>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {item.productUrl ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.productUrl} target="_blank" rel="noreferrer">
                            View product
                          </a>
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" onClick={() => setItems(removeCartItem(item.id))}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {items.length > 0 && (
          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full" onClick={() => { clearCart(); setItems([]); }}>
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
