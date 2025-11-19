import { useState } from 'react'
import { Heart, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GratitudeSection = ({ gratitudeList = [], onGratitudeChange }) => {
  const [items, setItems] = useState(gratitudeList || [])
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)

  const prompts = [
    "What made you smile today?",
    "What are you grateful for right now?",
    "Who made a positive impact on your day?",
    "What's something good that happened?",
    "What's a small win you had today?",
  ]

  const addGratitude = () => {
    if (inputValue.trim() && items.length < 5) {
      const newItems = [...items, inputValue.trim()]
      setItems(newItems)
      onGratitudeChange(newItems)
      setInputValue('')
      setShowInput(false)
    }
  }

  const removeGratitude = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    onGratitudeChange(newItems)
  }

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="text-pink-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Gratitude Journal</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {randomPrompt} Taking time to appreciate the good things can improve your mood.
      </p>

      {items.length > 0 && (
        <div className="space-y-2 mb-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200"
              >
                <span className="text-xl">🙏</span>
                <span className="flex-1 text-gray-700">{item}</span>
                <button
                  onClick={() => removeGratitude(index)}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!showInput && items.length < 5 && (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-3 border-2 border-dashed border-pink-300 rounded-lg text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add gratitude ({items.length}/5)
        </button>
      )}

      {showInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={randomPrompt}
            rows="2"
            className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                addGratitude()
              }
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={addGratitude}
              className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowInput(false)
                setInputValue('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default GratitudeSection

