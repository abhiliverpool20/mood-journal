import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wind } from 'lucide-react'

const BreathingExercise = ({ onClose, triggerMood }) => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale, pause
  const [cycle, setCycle] = useState(0)
  const [size, setSize] = useState(100)
  const intervalRef = useRef(null)
  
  const durations = {
    inhale: 4000,
    hold: 2000,
    exhale: 4000,
    pause: 2000,
  }

  const phaseTexts = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Relax',
  }

  const phaseColors = {
    inhale: 'from-blue-400 to-cyan-400',
    hold: 'from-purple-400 to-pink-400',
    exhale: 'from-orange-400 to-red-400',
    pause: 'from-gray-300 to-gray-400',
  }

  const startExercise = () => {
    setIsActive(true)
    setCycle(0)
    setPhase('inhale')
    setSize(100)
  }

  const stopExercise = () => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    if (!isActive) return

    const phases = ['inhale', 'hold', 'exhale', 'pause']
    let currentPhaseIndex = 0

    const updatePhase = () => {
      const currentPhase = phases[currentPhaseIndex]
      setPhase(currentPhase)
      
      if (currentPhase === 'inhale') {
        setSize(200)
      } else if (currentPhase === 'exhale') {
        setSize(100)
      }

      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
      
      if (currentPhaseIndex === 0) {
        setCycle(prev => prev + 1)
      }
    }

    updatePhase()
    
    const phaseInterval = setInterval(() => {
      updatePhase()
    }, durations.inhale + durations.hold + durations.exhale + durations.pause)

    intervalRef.current = phaseInterval

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  // Animate size based on phase
  useEffect(() => {
    if (!isActive) return
    
    const targetSize = phase === 'inhale' ? 200 : phase === 'exhale' ? 100 : size
    const duration = durations[phase]
    
    setSize(targetSize)
  }, [phase, isActive])

  const shouldShow = triggerMood && ['sad', 'anxious', 'stressed', 'angry'].includes(triggerMood)

  if (!shouldShow) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-effect rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wind className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Breathing Exercise</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 mb-6">
            {/* Breathing circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                className={`absolute rounded-full bg-gradient-to-br ${phaseColors[phase]} opacity-20`}
                animate={{
                  width: size,
                  height: size,
                }}
                transition={{
                  duration: durations[phase] / 1000,
                  ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'linear',
                }}
              />
              <motion.div
                className={`relative rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center shadow-2xl`}
                animate={{
                  width: size,
                  height: size,
                }}
                transition={{
                  duration: durations[phase] / 1000,
                  ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'linear',
                }}
              >
                <span className="text-white font-bold text-xl">{phaseTexts[phase]}</span>
              </motion.div>
            </div>

            {isActive && (
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {phaseTexts[phase]}
                </p>
                <p className="text-gray-600">Cycle {cycle + 1}</p>
              </div>
            )}

            {!isActive && (
              <div className="text-center text-gray-600">
                <p className="mb-4">
                  This breathing exercise can help you feel more calm and centered.
                </p>
                <p className="text-sm">
                  Follow the circle: Breathe in as it expands, breathe out as it contracts.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Exercise
              </button>
            ) : (
              <button
                onClick={stopExercise}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                Stop
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BreathingExercise

