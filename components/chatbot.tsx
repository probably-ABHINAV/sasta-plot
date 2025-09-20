"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface ChatMessage {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const chatbotResponses = [
  {
    keywords: ["choose", "different", "why", "property dealers"],
    response: "Great question! At SastaPlots, we focus on affordability + trust. Every plot we list is legally verified, with clear title deeds, so there are no future disputes. We also ensure transparent pricing (no hidden fees), flexible payment plans, and plots in strategically chosen locations that hold long-term investment value. Our goal is not just to sell you land but to help you make a safe, smart investment for the future."
  },
  {
    keywords: ["safe", "legal", "government", "disputes"],
    response: "Yes, absolutely. Each plot undergoes a strict legal check before we list it. This includes ownership history, local authority approvals, and title verification. You can be 100% confident that the property is dispute-free and legally secure. Plus, our team shares all documents with you before purchase so that you can double-check for peace of mind."
  },
  {
    keywords: ["installments", "payment", "pay", "full"],
    response: "You don't have to pay all at once! We understand that property buying is a big decision, so we offer flexible installment options. Depending on the property, you can choose a payment schedule that suits your budget. Many clients prefer installments as it makes investment easier and stress-free."
  },
  {
    keywords: ["value", "increase", "investment", "appreciation"],
    response: "Land is one of the most reliable assets in India because its supply is limited and demand is rising. We carefully select plots in growth-ready areas — near upcoming infrastructure, residential demand zones, or future development corridors. This ensures that over time, your investment is likely to appreciate significantly, making it both safe and profitable."
  },
  {
    keywords: ["support", "after", "purchase", "help"],
    response: "Our relationship doesn't end after the sale. We provide after-sale assistance including help with registration, property tax, and even resale or construction guidance if needed. Many of our buyers stay connected with us for future investments because they trust our long-term support."
  }
]

const defaultResponse = "Thank you for your question! I'd be happy to help you learn more about our verified plots and transparent processes. For specific queries about plots, pricing, or documentation, please feel free to contact our experts directly or browse our FAQ section for detailed information."

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  for (const response of chatbotResponses) {
    if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return response.response
    }
  }
  
  return defaultResponse
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you with questions about Sasta Plots. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState("")

  const sendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText("")

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: findBestResponse(inputText),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]"
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Sasta Plots Assistant</CardTitle>
                      <p className="text-orange-100 text-sm">Always ready to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
                          message.isBot
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isBot ? 'text-gray-500' : 'text-orange-100'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about our plots..."
                      className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={1}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      size="icon"
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}