import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authStorage } from "@/lib/authApi";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  products?: Product[];
}

interface ChatInterfaceProps {
  fullPage?: boolean;
}

const ChatInterface = ({ fullPage = false }: ChatInterfaceProps) => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I can help you discover products, compare prices, and understand review sentiment across multiple e-commerce platforms. What are you shopping for today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !isAuthenticated) {
      console.warn("Cannot send message - input empty or not authenticated", { 
        inputEmpty: !input.trim(), 
        isAuthenticated 
      });
      return;
    }

    const token = authStorage.getToken();
    if (!token) {
      console.warn("No auth token found");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      console.log("Sending chat message to:", `${API_BASE_URL}/chatbot`);
      
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat response:", data);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message?.content || "Sorry, I couldn't process that.",
        timestamp: new Date(),
        products: data.message?.products || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    "Find laptops under PKR 150,000",
    "Best wireless headphones",
    "Compare iPhone 15 vs Samsung S24",
    "Price trends for MacBook Pro",
  ];

  const containerClass = fullPage 
    ? "h-[calc(100vh-120px)]" 
    : "h-[500px]";

  // Debug: Show authentication status
  useEffect(() => {
    console.log("ChatInterface Auth Status:", {
      isAuthenticated,
      user: user?.email,
      token: authStorage.getToken() ? "exists" : "missing",
      hasDOMReady: true,
    });
  }, [isAuthenticated, user]);

  return (
    <Card variant="default" className={`flex flex-col overflow-hidden ${containerClass}`}>
      <CardHeader className="border-b border-border bg-white pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Shopping Assistant</CardTitle>
            <p className="text-xs text-muted-foreground">Powered by NLP & Sentiment Analysis</p>
          </div>
          <Badge variant="success" className="ml-auto">Online</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" ? "bg-primary" : "bg-secondary text-primary"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-white shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-60 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
            
            {message.role === "assistant" && message.products && message.products.length > 0 && (
              <div className="mt-4 ml-11">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {message.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {messages.length === 1 && (
        <div className="bg-white px-4 pb-4">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => setInput(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <div className="border-t border-border bg-white p-4">
        {!isAuthenticated && (
          <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Not logged in</strong> - Please log in to use the chat assistant.
            </p>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAuthenticated ? "Ask about products, prices, or reviews..." : "Please log in first..."}
            className="flex-1"
            disabled={!isAuthenticated}
          />
          <Button 
            type="submit" 
            variant="hero" 
            size="icon" 
            disabled={!input.trim() || isLoading || !isAuthenticated}
            title={!isAuthenticated ? "Please log in first" : "Send message"}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
