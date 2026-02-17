"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  Minimize2,
  ArrowLeft,
  Bot,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { usePathname, useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isAction?: boolean;
  actions?: {
    type:
      | "show_product"
      | "show_category"
      | "open_live_chat"
      | "compare_products"
      | "order_progress";
    payload: any;
  }[];
}

const ActionCarousel = ({ actions }: { actions: Message["actions"] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [actions]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  if (!actions) return null;

  return (
    <div className="relative group/carousel w-full mt-4">
      {/* Arrows (PC only) */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-full hidden md:flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:bg-emerald-600 hover:text-white transition-all -ml-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
        {showRightArrow && actions.length > 1 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-full hidden md:flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:bg-emerald-600 hover:text-white transition-all -mr-3"
          >
            <div className="rotate-180">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar flex gap-4 pb-2 -mx-2 px-2 snap-x scroll-smooth"
      >
        {actions.map((act, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="snap-center shrink-0"
          >
            {act.type === "show_product" && (
              <div className="p-4 bg-white/90 dark:bg-gray-800/90 border border-white dark:border-gray-700 rounded-[2rem] shadow-xl w-[260px] group transition-all hover:shadow-2xl">
                {act.payload.images && (
                  <div className="w-full h-36 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-4 overflow-hidden relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        typeof act.payload.images === "string"
                          ? JSON.parse(act.payload.images)[0]
                          : act.payload.images[0] || "/placeholder.png"
                      }
                      alt={act.payload.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-black shadow-sm text-emerald-600 dark:text-emerald-400">
                      ৳{act.payload.salePrice || act.payload.basePrice}
                    </div>
                  </div>
                )}
                <div className="px-1">
                  <h4 className="font-bold text-sm truncate dark:text-white">
                    {act.payload.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-bold uppercase tracking-widest">
                    Featured Item
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-4 text-[12px] font-black h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    onClick={() => router.push(`/product/${act.payload.slug}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}

            {act.type === "show_category" && (
              <div className="p-2 bg-white/90 dark:bg-gray-800/90 border border-white dark:border-gray-700 rounded-[2rem] shadow-xl w-[240px] overflow-hidden group hover:shadow-2xl transition-all">
                {act.payload.image && (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded-[1.5rem] mb-2 overflow-hidden relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.payload.image}
                      alt={act.payload.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                      <span className="text-white font-black text-base drop-shadow-lg tracking-tight">
                        {act.payload.name}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[11px] font-black h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all active:scale-95"
                    onClick={() =>
                      router.push(`/shop?category=${act.payload.slug}`)
                    }
                  >
                    Explore Helper
                  </Button>
                </div>
              </div>
            )}

            {act.type === "compare_products" && (
              <div className="p-5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2.5rem] shadow-2xl w-[280px] text-white overflow-hidden relative group">
                <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                <h4 className="font-black text-sm uppercase tracking-widest opacity-80 mb-4">
                  Smart Comparison
                </h4>
                <div className="grid grid-cols-2 gap-3 items-center relative">
                  {act.payload.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-full aspect-square bg-white/20 rounded-2xl overflow-hidden border border-white/30 backdrop-blur-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-black truncate w-full text-center">
                        {p.name}
                      </span>
                    </div>
                  ))}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center font-black text-xs shadow-xl ring-2 ring-emerald-400">
                    VS
                  </div>
                </div>
                <Button
                  className="w-full mt-5 bg-white text-emerald-600 hover:bg-gray-100 font-black rounded-2xl h-11"
                  onClick={() => router.push(`/product/${act.payload[0].slug}`)}
                >
                  Decide Now
                </Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();
  const cart = useCartStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm ARKIVE AI. How can I help you find something wonderful today?",
      timestamp: Date.now(),
    },
  ]);

  // Hide on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  const isLoaded = useRef(false);

  // Load persistence
  useEffect(() => {
    const saved = sessionStorage.getItem("ai_chat_messages");
    const savedOpen = sessionStorage.getItem("ai_chat_is_open");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved AI messages");
      }
    }
    if (savedOpen === "true") setIsOpen(true);
    isLoaded.current = true;
  }, []);

  // Save persistence
  useEffect(() => {
    if (!isLoaded.current) return;

    sessionStorage.setItem("ai_chat_messages", JSON.stringify(messages));
    sessionStorage.setItem("ai_chat_is_open", isOpen.toString());
  }, [messages, isOpen]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftChipArrow, setShowLeftChipArrow] = useState(false);
  const [showRightChipArrow, setShowRightChipArrow] = useState(true);

  const checkChipScroll = () => {
    if (chipScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipScrollRef.current;
      setShowLeftChipArrow(scrollLeft > 10);
      setShowRightChipArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkChipScroll();
    const el = chipScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkChipScroll);
      window.addEventListener("resize", checkChipScroll);
      return () => {
        el.removeEventListener("scroll", checkChipScroll);
        window.removeEventListener("resize", checkChipScroll);
      };
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const formattedCart = cart.items ? cart.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })) : [];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          cartItems: formattedCart,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
          actions: data.actions,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorData = await res.json().catch(() => ({}));
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ Assistant encountered a temporary hiccup: ${
            errorData.error || res.statusText || "Connection failed"
          }.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Chat error", error);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having a little trouble connecting to my central brain. Please try again in a moment!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const scrollChips = (direction: "left" | "right") => {
    if (chipScrollRef.current) {
      const amount = 200;
      chipScrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Don't render on admin pages
  if (isAdminPage) return null;

  return (
    <div className="fixed z-[100] flex flex-col items-end font-sans bottom-6 right-4 md:bottom-8 md:right-6">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
            className="pointer-events-auto w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] max-h-[800px] rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl border border-white/30 dark:border-gray-800/30 overflow-hidden flex flex-col mb-4 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="pt-6 px-6 pb-4 flex items-center justify-between bg-white/10 relative">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/50 shadow-sm transition-transform group-hover:scale-105 duration-500">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-[2.5px] border-white dark:border-gray-900 rounded-full shadow-sm">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-none">
                    ARKIVE AI
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-[0.1em]">
                      Online & Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-90"
                >
                  <Minimize2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 group transition-all active:scale-90"
                >
                  <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-7 scroll-smooth custom-scrollbar bg-transparent">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={cn(
                    "flex flex-col w-full",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[88%] rounded-3xl px-5 py-3.5 text-[14px] leading-relaxed shadow-sm transition-all duration-300",
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-emerald-500/10"
                        : "bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 rounded-tl-none"
                    )}
                  >
                    <span className="whitespace-pre-wrap font-medium tracking-tight inline-block">
                      {msg.content}
                    </span>
                    <div
                      className={cn(
                        "text-[9px] font-bold mt-2 opacity-40 select-none",
                        msg.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Actions (Carousel / Multi-Card) */}
                  {msg.actions && msg.actions.length > 0 && (
                    <ActionCarousel actions={msg.actions} />
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-3xl rounded-tl-none px-5 py-4 shadow-sm backdrop-blur-md">
                    <div className="flex gap-2 items-center">
                      {[0, 2, 4].map((delay) => (
                        <motion.span
                          key={delay}
                          animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            delay: delay * 0.1,
                          }}
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Elegant Input Area */}
            <div className="p-6 pb-8 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent">
              {/* Quick Chips - Floating Style */}
              <div className="relative group/chips">
                <AnimatePresence>
                  {showLeftChipArrow && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      type="button"
                      onClick={() => scrollChips("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 dark:bg-gray-800/90 shadow-md rounded-full hidden md:flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:bg-emerald-600 hover:text-white transition-all -ml-2"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </motion.button>
                  )}
                  {showRightChipArrow && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      type="button"
                      onClick={() => scrollChips("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/90 dark:bg-gray-800/90 shadow-md rounded-full hidden md:flex items-center justify-center border border-gray-100 dark:border-gray-700 hover:bg-emerald-600 hover:text-white transition-all -mr-2"
                    >
                      <div className="rotate-180">
                        <ArrowLeft className="w-3 h-3" />
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>

                <div
                  ref={chipScrollRef}
                  className="flex gap-2 overflow-x-auto no-scrollbar pb-5 -mx-2 px-2 snap-x scroll-smooth"
                >
                  {[
                    { label: "📦 Track", text: "Where is my order?" },
                    { label: "🔥 Deals", text: "Show me active offers" },
                    {
                      label: "💎 Best Sellers",
                      text: "What are your top products?",
                    },
                    { label: "✨ New", text: "What's new in store?" },
                    { label: "👔 Men", text: "Show me men collection" },
                    { label: "👗 Women", text: "Show me women collection" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => {
                        setInput(chip.text);
                        handleSend();
                      }}
                      className="flex-shrink-0 snap-start text-[11px] font-bold px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                <div className="relative flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 p-1.5 rounded-[2rem] border border-gray-200 dark:border-gray-700 group-focus-within:border-emerald-500/50 group-focus-within:ring-4 group-focus-within:ring-emerald-500/5 transition-all duration-500 shadow-inner">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask ARKIVE AI..."
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] h-11 px-4 placeholder:text-gray-400 placeholder:font-medium font-medium tracking-tight"
                  />
                  <div className="flex items-center gap-1.5 mr-1">
                    <button
                      type="button"
                      onClick={startVoiceRecognition}
                      className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90",
                        isListening
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-emerald-600"
                      )}
                    >
                      <Mic
                        className={cn("w-4 h-4", isListening && "animate-bounce")}
                      />
                    </button>
                    <Button
                      type="submit"
                      size="icon"
                      className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-teal-600 text-white shrink-0 shadow-lg shadow-emerald-500/30 active:scale-90 transition-all duration-300"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Toggle Button */}
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {!isOpen || isMinimized ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[1.75rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center relative group backdrop-blur-md ring-1 ring-black/5"
            >
              <div className="absolute inset-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl opacity-[0.08] group-hover:opacity-20 transition-opacity duration-500" />
              <Bot className="w-7 h-7 text-emerald-600 dark:text-emerald-400 relative z-10 transition-transform group-hover:scale-110 duration-500" />

              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-900 shadow-sm"></span>
              </div>

              {/* Tooltip */}
              <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 flex items-center group-hover:opacity-100 opacity-0 translate-x-3 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-gray-900 dark:text-white text-[12px] font-black px-5 py-2.5 rounded-2xl shadow-xl whitespace-nowrap border border-white dark:border-gray-800 ring-1 ring-black/5">
                  Chat with ARKIVE AI
                </div>
                <div className="w-2.5 h-2.5 bg-white/90 dark:bg-gray-900/90 rotate-45 -ml-1 border-r border-t border-white dark:border-gray-800" />
              </div>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
