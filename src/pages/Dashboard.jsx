import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { MoodContext } from '../context/MoodContext'
import { format, isToday } from 'date-fns'
import { Calendar, TrendingUp, Smile, Plus } from 'lucide-react'

const Dashboard = () => {
  const { moods } = useContext(MoodContext)
  
  const todayEntry = moods.find(m => isToday(new Date(m.date)))
  const recentMoods = moods.slice(-7).reverse()
  const currentStreak = calculateStreak(moods)
  const avgMood = calculateAverageMood(moods.slice(-7))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          {todayEntry
            ? "You've already logged your mood today. Great job! 🌟"
            : "Ready to log how you're feeling today?"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Mood</p>
              <p className="text-3xl font-bold text-gray-800">
                {todayEntry ? getMoodEmoji(todayEntry.mood) : '—'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {todayEntry ? todayEntry.mood : 'Not logged yet'}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Smile className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-gray-800">{currentStreak}</p>
              <p className="text-sm text-gray-500 mt-1">days in a row 🔥</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Weekly Average</p>
              <p className="text-3xl font-bold text-gray-800">{avgMood}</p>
              <p className="text-sm text-gray-500 mt-1">out of 8 moods</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Calendar className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus size={20} />
          {todayEntry ? 'Update Today\'s Entry' : 'Log Today\'s Mood'}
        </Link>
      </div>

      {/* Recent Entries */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Entries</h2>
        {recentMoods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No entries yet</p>
            <p className="text-sm">Start by logging your first mood!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMoods.map((mood) => (
              <div
                key={mood.id}
                className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{getMoodEmoji(mood.mood)}</div>
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">{mood.mood}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(mood.date), 'MMM dd, yyyy • h:mm a')}
                    </p>
                    {mood.notes && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{mood.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {mood.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getMoodEmoji(mood) {
  const emojis = {
    happy: '😊',
    excited: '🤩',
    calm: '😌',
    neutral: '😐',
    sad: '😢',
    anxious: '😰',
    stressed: '😓',
    angry: '😠',
  }
  return emojis[mood] || '😐'
}

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

function calculateAverageMood(moods) {
  if (moods.length === 0) return 0
  
  const moodValues = {
    happy: 7,
    excited: 8,
    calm: 6,
    neutral: 4,
    sad: 2,
    anxious: 3,
    stressed: 1,
    angry: 0,
  }
  
  const sum = moods.reduce((acc, mood) => acc + (moodValues[mood.mood] || 4), 0)
  return (sum / moods.length).toFixed(1)
}

export default Dashboard

