"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, User, ShoppingCart, Tag, CheckCircle2, Plus } from "lucide-react"

export default function TestWidget() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today? I'd love to help you find the perfect item." }
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Error fetching response." }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error." }])
    } finally {
      setLoading(false)
    }
  }

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[ACTION:.*?\])/g);
    
    return parts.map((part, index) => {
      const actionMatch = part.match(/\[ACTION:\s*([^|\]]+)(?:\|\s*([^\]]+))?\]/);
      
      if (actionMatch) {
        const command = actionMatch[1].trim();
        const args = actionMatch[2] ? actionMatch[2].split("|").map(s => s.trim()) : [];
        
        if (command === "ADD_TO_CART") {
          return (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              key={index} className="mt-3 p-3 bg-white/[0.04] border border-[#34d399]/20 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#34d399]/15 text-[#34d399] flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Added to Cart</p>
                  <p className="text-[11px] text-white/50">{args[0] || "Item"} {args[1] ? `(Qty: ${args[1]})` : ""}</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            </motion.div>
          )
        }
        
        if (command === "APPLY_DISCOUNT") {
          return (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              key={index} className="mt-3 p-3 bg-gradient-to-r from-[#8b5cf6]/20 to-[#6366f1]/10 border border-[#8b5cf6]/30 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#8b5cf6]/20 text-[#c084fc] flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Discount Applied</p>
                  <p className="text-[11px] text-white/50">Code: <span className="font-mono text-[#c084fc] font-bold">{args[0] || "SALE"}</span></p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            </motion.div>
          )
        }
        
        return null;
      }
      
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Agent Simulator</h1>
          <p className="text-sm text-white/40 mt-1">Chat fully autonomously. Try asking for a discount or to add an item to your cart.</p>
        </div>
        <button className="btn-ghost py-1.5 px-4 text-xs" onClick={() => setMessages([{ role: "assistant", content: "Hi! New session started. How can I help?" }])}>
          <Plus className="w-3.5 h-3.5" /> New Chat
        </button>
      </div>

      <div className="flex-1 glass shadow-2xl rounded-3xl border border-white/[0.08] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#08080f]/80 px-6 py-4 border-b border-white/[0.06] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center shrink-0 relative shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#34d399] border-2 border-[#08080f] rounded-full"></span>
            </div>
            <div>
                <h3 className="text-sm text-white font-semibold flex items-center gap-2">
                  ShopMind Sales Agent <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded-full text-white/40 border border-white/10">v3.0.2</span>
                </h3>
                <p className="text-xs text-[#34d399] font-medium mt-0.5">Autonomous Mode Active</p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#04040a]/40">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                  <motion.div 
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                      key={i} 
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                          msg.role === "assistant" ? "bg-white/[0.06] border border-white/[0.08] relative overflow-hidden" : "bg-gradient-to-br from-[#6366f1] to-[#c084fc]"
                      }`}>
                          {msg.role === "assistant" ? (
                            <>
                              <Bot className="w-4 h-4 text-white/70 relative z-10" />
                            </>
                          ) : <User className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[14px] leading-relaxed ${
                            msg.role === "user" 
                                ? "bg-[#6366f1] text-white rounded-tr-sm" 
                                : "glass border border-white/[0.08] text-white/80 rounded-tl-sm"
                        }`}>
                            <div>
                              {renderMessageContent(msg.content)}
                            </div>
                        </div>
                      </div>
                  </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="glass border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 h-12">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-dot-pulse"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-dot-pulse" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] animate-dot-pulse" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                </motion.div>
            )}
        </div>

        {/* Input */}
        <div className="p-4 bg-[#08080f]/80 border-t border-white/[0.06] backdrop-blur-md">
            <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message ShopMind..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all placeholder:text-white/25 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-[42px] rounded-full bg-[#6366f1] flex items-center justify-center text-white disabled:opacity-50 disabled:bg-white/10 transition-all hover:bg-[#5557e0]"
                >
                    <Send className="w-4 h-4 pl-0.5" />
                </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-white/20">AI responses may be inaccurate. Test thoroughly before deploying.</span>
            </div>
        </div>
      </div>
    </div>
  )
}
