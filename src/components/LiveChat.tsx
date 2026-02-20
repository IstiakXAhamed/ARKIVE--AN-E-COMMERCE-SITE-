'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner' // Using Sonner as it is in package.json

interface Message {
  id: string
  message: string
  senderType: 'customer' | 'admin' | 'support' | 'system'
  senderName: string
  createdAt: string
}

const getSessionId = () => {
  if (typeof window === 'undefined') return ''
  let sessionId = sessionStorage.getItem('chat_session_id')
  if (!sessionId) {
    sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`
    sessionStorage.setItem('chat_session_id', sessionId)
  }
  return sessionId
}

export function LiveChat() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [chatStatus, setChatStatus] = useState<'online' | 'away' | 'offline'>('online')
  const [sessionId, setSessionId] = useState('')
  const [customerName, setCustomerName] = useState('Guest')
  const [customerEmail, setCustomerEmail] = useState('')
  const [lastMessageTime, setLastMessageTime] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [hasChatStarted, setHasChatStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const isAdminRoute = pathname?.startsWith('/admin')
  const isUserAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN'

  // Initialize
  useEffect(() => {
    const init = async () => {
      // Admin check
      if (isUserAdmin) return

      // Set user details from session
      if (session?.user) {
        setCustomerName(session.user.name || 'Customer')
        setCustomerEmail(session.user.email || '')
      }

      const sid = getSessionId()
      setSessionId(sid)

      // Fetch Settings (Chat Status)
      try {
        const res = await fetch('/api/settings') // Assume this might fail if not created, default to online
        if (res.ok) {
            const data = await res.json()
            if (data.chatStatus) setChatStatus(data.chatStatus)
        }
      } catch (e) {}

      // Initial Welcome Message
      setMessages([{
        id: 'welcome',
        message: 'Hello! 👋 Welcome to Arkive. How can we help you today?',
        senderType: 'support',
        senderName: 'Support',
        createdAt: new Date().toISOString()
      }])

      setInitialized(true)
    }
    init()
  }, [session, isUserAdmin])

  // Custom Event Listener (from AI) - e.g. "Talk to Human"
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true)
      setIsMinimized(false)
      if (e.detail?.context) {
        setHasChatStarted(true)
        setMessages(prev => [...prev, {
          id: `ai_context_${Date.now()}`,
          message: e.detail.context,
          senderType: 'system',
          senderName: 'Assistant',
          createdAt: new Date().toISOString()
        }])
      }
    }
    window.addEventListener('open-internal-chat', handleOpenChat as EventListener)
    return () => window.removeEventListener('open-internal-chat', handleOpenChat as EventListener)
  }, [])

  // Poll for Messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId || isUserAdmin) return
    
    try {
      const url = lastMessageTime 
        ? `/api/chat/${sessionId}?after=${encodeURIComponent(lastMessageTime)}`
        : `/api/chat/${sessionId}`
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(prev => {
             const existing = new Set(prev.map(m => m.id))
             const newMsgs = data.messages.filter((m: Message) => !existing.has(m.id))
             
             if (newMsgs.length > 0) {
               // Update last message time from the NEWEST message (which is last in array)
               setLastMessageTime(newMsgs[newMsgs.length-1].createdAt)
               return [...prev, ...newMsgs]
             }
             return prev
          })
        }
      }
    } catch (e) {
      console.error("Polling error", e)
    }
  }, [sessionId, lastMessageTime, isUserAdmin])

  // Timer for Polling
  useEffect(() => {
    if (!initialized || isUserAdmin || !hasChatStarted) return
    
    // Poll every 3s
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [initialized, isUserAdmin, hasChatStarted, fetchMessages])

  // Auto-Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId) return
    
    const text = inputValue
    setInputValue('')
    setHasChatStarted(true)
    setIsTyping(true)

    // Optimistic UI
    const tempId = `temp_${Date.now()}`
    setMessages(prev => [...prev, {
      id: tempId,
      message: text,
      senderType: 'customer',
      senderName: customerName,
      createdAt: new Date().toISOString()
    }])

    // FIRST: Check AI (The Brain)
    try {
      const context = messages.slice(-5).map(m => `${m.senderName}: ${m.message}`).join('\n')
      
      const aiRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      })

      const aiData = await aiRes.json()
      setIsTyping(false)

      if (aiData.response) {
         // AI Responded!
         setMessages(prev => [...prev, {
           id: `ai_${Date.now()}`,
           message: aiData.response,
           senderType: 'support',
           senderName: 'Arkive AI',
           createdAt: new Date().toISOString()
         }])

         // Handle Actions
         if (aiData.actions) {
           aiData.actions.forEach((action: any) => {
             if (action.type === 'show_product') {
               // Ideally show a product card in chat - for now just text or toast
                toast.success(`Checking product: ${action.payload.name}`)
             }
             if (action.type === 'open_live_chat') {
                // This means AI gave up -> "Handoff". 
                // We should flag this session as needing human.
                // The backend AI route already notifies Admin.
                toast("Connecting you to a human agent...")
             }
           })
         }
         
         // Also save this interaction to DB so Admins can see the AI history
         // Note: We are NOT sending the user message to /api/chat/[id] first to save DB calls? 
         // NO! We MUST save the user message to DB for admin to see it.
         // Calling save now.
         await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify({ 
              message: text, 
              senderType: 'customer', 
              senderName: customerName, 
              customerEmail 
            })
         })
         
         // Save AI response to DB too
          await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify({ 
              message: aiData.response, 
              senderType: 'system', // or 'admin' / 'support'
              senderName: 'Arkive AI'
            })
         })

      } else {
         // Fallback to Human Logic (Save to DB)
         await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify({ 
              message: text, 
              senderType: 'customer', 
              senderName: customerName, 
              customerEmail 
            })
         })
      }

    } catch (e) {
      console.error("Chat Error", e)
      setIsTyping(false)
      // Fallback save
       await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            body: JSON.stringify({ 
              message: text, 
              senderType: 'customer', 
              senderName: customerName, 
              customerEmail 
            })
       })
    }
  }

  if ((isUserAdmin && !hasChatStarted) || isAdminRoute || chatStatus === 'offline') return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: isMinimized ? 'auto' : '500px' }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
            style={{ height: isMinimized ? 'auto' : '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="bg-white/10 p-2 rounded-full"><MessageCircle className="w-5 h-5"/></div>
                 <div>
                   <h3 className="font-semibold text-sm">Arkive Support</h3>
                   <span className="flex items-center gap-1 text-[10px] text-white/70">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full"/> Online with AI
                   </span>
                 </div>
               </div>
               <div className="flex gap-1">
                 <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded"><Minimize2 className="w-4 h-4"/></button>
                 <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-4 h-4"/></button>
               </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.senderType === 'customer' 
                          ? 'bg-black text-white rounded-br-none' 
                          : 'bg-white border shadow-sm rounded-bl-none text-gray-800'
                      }`}>
                        {msg.senderType !== 'customer' && <p className="text-[10px] font-bold text-gray-500 mb-1">{msg.senderName}</p>}
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white border p-3 rounded-2xl rounded-bl-none"><Loader2 className="w-4 h-4 animate-spin text-gray-400"/></div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 bg-white border-t flex gap-2">
                  <Input 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="rounded-full"
                  />
                  <Button onClick={handleSend} size="icon" className="rounded-full shrink-0"><Send className="w-4 h-4"/></Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && !isAdminRoute && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      )}
    </>
  )
}
