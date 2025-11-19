import { motion } from 'framer-motion'

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-400' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'from-orange-400 to-red-400' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-blue-400 to-cyan-400' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-gray-500' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-500 to-indigo-500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-purple-400 to-pink-400' },
  { id: 'stressed', emoji: '😓', label: 'Stressed', color: 'from-red-500 to-pink-500' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-600 to-orange-600' },
]

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {moods.map((mood, index) => (
        <motion.div
          key={mood.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectMood(mood.id)}
          className={`mood-card relative overflow-hidden rounded-2xl p-6 cursor-pointer ${
            selectedMood === mood.id
              ? `bg-gradient-to-br ${mood.color} text-white shadow-2xl scale-105`
              : 'bg-white/70 hover:bg-white text-gray-700 shadow-md'
          }`}
        >
          <div className="text-5xl mb-2 text-center">{mood.emoji}</div>
          <div className={`text-center font-semibold ${selectedMood === mood.id ? 'text-white' : 'text-gray-700'}`}>
            {mood.label}
          </div>
          {selectedMood === mood.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            >
              <span className="text-green-500 text-sm">✓</span>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default MoodSelector

