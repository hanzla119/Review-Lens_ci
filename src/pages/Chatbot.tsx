import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              AI Shopping <span className="text-gradient">Assistant</span>
            </h1>
            <p className="text-muted-foreground">
              Ask me anything about products, prices, or reviews. I'll help you make the best purchasing decisions.
            </p>
          </div>

          {/* Chat Interface */}
          <ChatInterface fullPage />
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
