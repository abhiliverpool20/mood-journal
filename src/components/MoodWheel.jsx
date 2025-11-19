import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#fbbf24', angle: 0 },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: '#f59e0b', angle: 45 },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#60a5fa', angle: 90 },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#94a3b8', angle: 135 },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#3b82f6', angle: 180 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#a855f7', angle: 225 },
  { id: 'stressed', emoji: '😓', label: 'Stressed', color: '#ef4444', angle: 270 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#dc2626', angle: 315 },
]

const MoodWheel = ({ selectedMood, onSelectMood }) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)
  const centerRadius = 80
  const wheelRadius = 200

  const handleWheelClick = (e) => {
    if (isSpinning) return
    
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const clickX = e.clientX - rect.left - centerX
    const clickY = e.clientY - rect.top - centerY
    
    const distance = Math.sqrt(clickX * clickX + clickY * clickY)
    
    if (distance < centerRadius) {
      // Clicked center - spin wheel
      spinWheel()
      return
    }
    
    if (distance > wheelRadius + 40) return // Outside wheel
    
    const angle = (Math.atan2(clickY, clickX) * 180) / Math.PI
    const normalizedAngle = (angle - rotation + 360) % 360
    
    // Find closest mood
    let closestMood = moods[0]
    let minDiff = Math.abs(normalizedAngle - moods[0].angle)
    
    moods.forEach(mood => {
      const diff = Math.abs(normalizedAngle - mood.angle)
      if (diff < minDiff) {
        minDiff = diff
        closestMood = mood
      }
    })
    
    onSelectMood(closestMood.id)
  }

  const spinWheel = () => {
    setIsSpinning(true)
    const spinAmount = 360 * 3 + Math.random() * 360
    setRotation(prev => prev + spinAmount)
    
    setTimeout(() => {
      setIsSpinning(false)
      const finalAngle = rotation % 360
      const selected = moods.find(m => Math.abs(finalAngle - m.angle) < 22.5)
      if (selected) {
        onSelectMood(selected.id)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" ref={wheelRef} onClick={handleWheelClick}>
        <svg width="450" height="450" className="cursor-pointer">
          {/* Outer ring */}
          <circle
            cx="225"
            cy="225"
            r={wheelRadius}
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="2"
          />
          
          {/* Mood segments */}
          {moods.map((mood, index) => {
            const startAngle = (mood.angle - 22.5 + rotation) * (Math.PI / 180)
            const endAngle = (mood.angle + 22.5 + rotation) * (Math.PI / 180)
            const x1 = 225 + wheelRadius * Math.cos(startAngle)
            const y1 = 225 + wheelRadius * Math.sin(startAngle)
            const x2 = 225 + wheelRadius * Math.cos(endAngle)
            const y2 = 225 + wheelRadius * Math.sin(endAngle)
            
            const isSelected = selectedMood === mood.id
            
            return (
              <g key={mood.id}>
                <path
                  d={`M 225 225 L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 0 1 ${x2} ${y2} Z`}
                  fill={isSelected ? mood.color : `${mood.color}40`}
                  stroke={isSelected ? mood.color : 'transparent'}
                  strokeWidth={isSelected ? 3 : 0}
                  className="transition-all duration-300 hover:opacity-80"
                />
                <text
                  x={225 + (wheelRadius * 0.7) * Math.cos((mood.angle + rotation) * (Math.PI / 180))}
                  y={225 + (wheelRadius * 0.7) * Math.sin((mood.angle + rotation) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="32"
                  className="pointer-events-none select-none"
                >
                  {mood.emoji}
                </text>
              </g>
            )
          })}
          
          {/* Center circle */}
          <motion.circle
            cx="225"
            cy="225"
            r={centerRadius}
            fill={selectedMood ? moods.find(m => m.id === selectedMood)?.color || '#8b5cf6' : 'rgba(139, 92, 246, 0.1)'}
            className="transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          <text
            x="225"
            y="225"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="48"
            className="pointer-events-none select-none"
          >
            {selectedMood ? moods.find(m => m.id === selectedMood)?.emoji : '🎯'}
          </text>
        </svg>
        
        {/* Labels */}
        <div className="absolute inset-0 pointer-events-none">
          {moods.map((mood) => {
            const angle = ((mood.angle + rotation) * Math.PI) / 180
            const x = 225 + (wheelRadius + 30) * Math.cos(angle)
            const y = 225 + (wheelRadius + 30) * Math.sin(angle)
            const isSelected = selectedMood === mood.id
            
            return (
              <motion.div
                key={mood.id}
                className="absolute"
                style={{
                  left: x - 40,
                  top: y - 12,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/70 text-gray-700'
                }`}>
                  {mood.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Click a segment to select, or click center to spin! 🎡
        </p>
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? 'Spinning...' : '🎰 Spin the Wheel'}
        </button>
      </div>
    </div>
  )
}

export default MoodWheel

