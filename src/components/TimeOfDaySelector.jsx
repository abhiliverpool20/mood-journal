import { Sunrise, Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

const timeOptions = [
  { id: 'morning', label: 'Morning', icon: Sunrise, color: 'from-yellow-400 to-orange-400', time: '6:00 AM - 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, color: 'from-orange-400 to-red-400', time: '12:00 PM - 6:00 PM' },
  { id: 'evening', label: 'Evening', icon: Moon, color: 'from-purple-500 to-indigo-500', time: '6:00 PM - 12:00 AM' },
]

const TimeOfDaySelector = ({ selectedTime, onSelectTime }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Time of Day (optional)
      </label>
      <div className="grid grid-cols-3 gap-3">
        {timeOptions.map((option, index) => {
          const Icon = option.icon
          const isSelected = selectedTime === option.id
          
          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectTime(option.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${option.color} border-transparent text-white shadow-lg`
                  : 'bg-white/70 border-gray-200 text-gray-700 hover:border-purple-300'
              }`}
            >
              <Icon size={24} className="mx-auto mb-2" />
              <div className="text-sm font-semibold">{option.label}</div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                {option.time}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default TimeOfDaySelector

