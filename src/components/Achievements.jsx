import { useContext, useMemo } from 'react'
import { MoodContext } from '../context/MoodContext'
import { Trophy, Flame, Calendar, Star, Target, Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Achievements = () => {
  const { moods } = useContext(MoodContext)

  const achievements = useMemo(() => {
    const unlocked = []
    
    // Streak achievements
    const streak = calculateStreak(moods)
    if (streak >= 7) unlocked.push({ id: 'week_streak', icon: Flame, title: 'Week Warrior', desc: '7 day streak', color: 'from-orange-500 to-red-500', emoji: '🔥' })
    if (streak >= 30) unlocked.push({ id: 'month_streak', icon: Flame, title: 'Month Master', desc: '30 day streak', color: 'from-red-500 to-pink-500', emoji: '🔥' })
    if (streak >= 100) unlocked.push({ id: 'century_streak', icon: Trophy, title: 'Century Club', desc: '100 day streak', color: 'from-yellow-400 to-orange-400', emoji: '🏆' })
    
    // Entry count achievements
    const entryCount = moods.length
    if (entryCount >= 10) unlocked.push({ id: 'first_10', icon: Star, title: 'Getting Started', desc: '10 entries', color: 'from-blue-400 to-cyan-400', emoji: '⭐' })
    if (entryCount >= 50) unlocked.push({ id: 'dedicated', icon: Heart, title: 'Dedicated Logger', desc: '50 entries', color: 'from-pink-400 to-purple-400', emoji: '❤️' })
    if (entryCount >= 100) unlocked.push({ id: 'century', icon: Target, title: 'Century Achiever', desc: '100 entries', color: 'from-purple-500 to-indigo-500', emoji: '🎯' })
    if (entryCount >= 365) unlocked.push({ id: 'year', icon: Calendar, title: 'Year Logger', desc: '365 entries', color: 'from-green-500 to-emerald-500', emoji: '📅' })
    
    // Mood variety achievements
    const uniqueMoods = new Set(moods.map(m => m.mood)).size
    if (uniqueMoods >= 5) unlocked.push({ id: 'mood_explorer', icon: Sparkles, title: 'Mood Explorer', desc: 'Logged 5+ mood types', color: 'from-purple-400 to-pink-400', emoji: '✨' })
    
    // Positive mood achievements
    const positiveMoods = moods.filter(m => ['happy', 'excited', 'calm'].includes(m.mood)).length
    if (positiveMoods >= 30) unlocked.push({ id: 'positive_vibes', icon: Star, title: 'Positive Vibes', desc: '30 positive moods', color: 'from-yellow-400 to-orange-400', emoji: '🌟' })
    
    // Tags achievement
    const allTags = new Set()
    moods.forEach(m => m.tags?.forEach(tag => allTags.add(tag)))
    if (allTags.size >= 10) unlocked.push({ id: 'tag_master', icon: Target, title: 'Tag Master', desc: 'Used 10+ unique tags', color: 'from-blue-500 to-purple-500', emoji: '🏷️' })
    
    return unlocked
  }, [moods])

  function calculateStreak(moods) {
    if (moods.length === 0) return 0
    
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date))
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < sortedMoods.length; i++) {
      const moodDate = new Date(sortedMoods[i].date)
      moodDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((currentDate - moodDate) / (1000 * 60 * 60 * 24))
      
      if (i === 0 && daysDiff > 1) return 0
      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
        <span className="text-sm text-gray-500">({achievements.length} unlocked)</span>
      </div>
      
      {achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No achievements yet. Keep logging your moods to unlock achievements! 🎯</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl bg-gradient-to-br ${achievement.color} text-white overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <Icon size={24} />
                    <span className="text-2xl">{achievement.emoji}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm opacity-90">{achievement.desc}</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Achievements

