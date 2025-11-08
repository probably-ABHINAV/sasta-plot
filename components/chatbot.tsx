'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, MessageCircle, Home, MapPin, IndianRupee, Send } from 'lucide-react'

const plotData: Record<string, any> = {
  'Zams Gardenia': {
    overview:
      '🏡 Zams Gardenia is a thoughtfully planned development in Bihta (Greater Patna). It features gated entry, street lighting, legal approval, and proximity to educational and transport hubs — ideal for smart investors.',
    Location: '📍 Bihta, Greater Patna, Bihar. Connected to Bihta Airport and Patna city.',
    Price: '💰 ₹1,550 per sq.ft. Transparent pricing with registry support.',
    'Plot Size': '📐 700–2000 sq.ft plots. Ideal for villas or compact duplexes.',
  },
  'Bajrang Vatika': {
    overview:
      '🌿 Bajrang Vatika is Uttarakhand’s first Hanuman-themed residential community. Set on the Shimla Bypass Road, it offers peace, Vastu compliance, and green open areas ideal for spiritual families.',
    Location: '📍 Shimla Bypass Road, near Dehradun city center. Surrounded by schools and wellness hubs.',
    Price: '💰 ₹16,800 per sq.yd. Gated plot enclave with themed design.',
    'Plot Size': '📐 1200–2400 sq.yd plots with garden-facing options.',
  },
  'Friends Colony Phase 1': {
    overview:
      '🚦 Friends Colony Phase 1 is a well-connected residential pocket near Delhi–Dehradun Expressway. With wide internal roads and drainage, it suits both living and investment.',
    Location: '📍 Near Delhi–Dehradun Expressway. Quick access to Dehradun Railway Station and ISBT.',
    Price: '💰 ₹16,800 per sq.yd. Price includes legal clearances and layout demarcation.',
    'Plot Size': '📐 1000–2000 sq.yd — suitable for duplex homes or rental units.',
  },
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<string[]>([
    '👋 Namaste! Welcome to SastaPlots — trusted plots at trusted prices. How can I assist you today?',
  ])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')

  const handleReset = () => {
    setSelectedProject(null)
    setSelectedDetail(null)
    setMessages([
      '👋 Namaste! Welcome to SastaPlots — trusted plots at trusted prices. How can I assist you today?',
    ])
  }

  const handleProject = (name: string) => {
    setSelectedProject(name)
    setMessages((prev) => [
      ...prev,
      `✅ You selected: ${name}`,
      plotData[name].overview,
      '👇 What would you like to explore next?'
    ])
  }

  const handleDetail = (key: string) => {
    if (selectedProject) {
      setSelectedDetail(key)
      setMessages((prev) => [
        ...prev,
        `${key === 'Location' ? '📍' : key === 'Price' ? '💰' : '📐'} ${key}: ${plotData[selectedProject][key]}`,
        'Would you like to explore another plot project?'
      ])
    }
  }

  const handleSend = () => {
    if (inputText.trim() !== '') {
      setMessages((prev) => [
        ...prev,
        `🧑‍💬 ${inputText}`,
        `🙏 Thank you for applying! Our team will reach out to you shortly. For faster assistance, you can also call us at 📞 +91-9876543210 or email 📧 support@sastaplots.in.`
      ])
      setInputText('')
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 h-[550px] w-[380px] max-w-[90vw] bg-white rounded-xl border shadow-2xl z-50 flex flex-col"
          >
            <div className="bg-orange-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
              <div className="font-semibold text-sm">SastaPlots Chat Assistant</div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <CardContent className="flex-1 p-3 space-y-3 overflow-y-auto bg-orange-50 text-sm">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="bg-white text-gray-800 p-3 rounded-xl shadow"
                >
                  {msg}
                </div>
              ))}
            </CardContent>

            <div className="border-t p-3 bg-white">
              {!selectedProject ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(plotData).map((name) => (
                    <Button
                      key={name}
                      variant="ghost"
                      className="bg-orange-100 text-orange-900 hover:bg-orange-200 text-xs"
                      onClick={() => handleProject(name)}
                    >
                      <Home className="inline w-4 h-4 mr-1" /> {name}
                    </Button>
                  ))}
                </div>
              ) : !selectedDetail ? (
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="text-xs" onClick={() => handleDetail('Location')}>
                    <MapPin className="w-4 h-4 inline mr-1" /> Location
                  </Button>
                  <Button variant="outline" className="text-xs" onClick={() => handleDetail('Price')}>
                    <IndianRupee className="w-4 h-4 inline mr-1" /> Price
                  </Button>
                  <Button variant="outline" className="text-xs" onClick={() => handleDetail('Plot Size')}>
                    📐 Plot Size
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-center">
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={handleReset}
                  >
                    🔁 Start Over
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t px-3 py-2 bg-orange-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 rounded-md px-3 py-2 text-sm text-white placeholder-white bg-orange-500 border border-orange-300 focus:outline-none"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="bg-white text-orange-600 hover:text-orange-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
