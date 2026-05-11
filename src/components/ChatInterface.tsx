import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  fullPage?: boolean;
}

const ChatInterface = ({ fullPage = false }: ChatInterfaceProps) => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses = [
    "Based on the available products, I found 3 highly-rated laptops under PKR 150,000 with strong review sentiment. The ASUS VivoBook 15 is the best value option with 92% positive sentiment.",
    "I analyzed 2,847 reviews for the MacBook Pro M3. Sentiment is mostly positive at 85%, with users praising performance and battery life. The main concern is the premium price.",
    "For wireless headphones, the Sony WH-1000XM5 is a strong recommendation. It is listed at PKR 29,990 with 78% positive reviews and consistent praise for noise cancellation.",
    "Price drop detected: Samsung Galaxy S24 Ultra is down 15% on Amazon. Current price is PKR 184,999, which is the lowest point in the recent price history shown.",
    "For smartphones, Galaxy S24 is strongest for camera quality, iPhone 15 is strongest for battery consistency, and Pixel 8 offers strong value for AI features.",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
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
          <div
            key={message.id}
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

      <div className="border-t border-border bg-white p-4">
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
            placeholder="Ask about products, prices, or reviews..."
            className="flex-1"
          />
          <Button type="submit" variant="hero" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
