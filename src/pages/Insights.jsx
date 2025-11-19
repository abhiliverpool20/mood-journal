import { useContext, useMemo } from 'react'
import { MoodContext } from '../context/MoodContext'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Calendar, Tag, Award } from 'lucide-react'

const Insights = () => {
  const { moods } = useContext(MoodContext)

  // Calculate mood frequency
  const moodFrequency = useMemo(() => {
    const frequency = {}
    moods.forEach(mood => {
      frequency[mood.mood] = (frequency[mood.mood] || 0) + 1
    })
    return Object.entries(frequency)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
  }, [moods])

  // Calculate tag frequency
  const tagFrequency = useMemo(() => {
    const frequency = {}
    moods.forEach(mood => {
      mood.tags?.forEach(tag => {
        frequency[tag] = (frequency[tag] || 0) + 1
      })
    })
    return Object.entries(frequency)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [moods])

  // Weekly trend data
  const weeklyTrend = useMemo(() => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayMoods = moods.filter(m => {
        const moodDate = new Date(m.date)
        moodDate.setHours(0, 0, 0, 0)
        return moodDate.getTime() === date.getTime()
      })
      
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
      
      const avgValue = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + (moodValues[m.mood] || 4), 0) / dayMoods.length
        : null
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: avgValue !== null ? avgValue.toFixed(1) : null,
        count: dayMoods.length
      })
    }
    
    return last7Days
  }, [moods])

  // Monthly mood distribution
  const monthlyMoods = useMemo(() => {
    const now = new Date()
    const last30Days = moods.filter(m => {
      const moodDate = new Date(m.date)
      const daysDiff = (now - moodDate) / (1000 * 60 * 60 * 24)
      return daysDiff <= 30
    })
    
    const frequency = {}
    last30Days.forEach(mood => {
      frequency[mood.mood] = (frequency[mood.mood] || 0) + 1
    })
    
    return Object.entries(frequency).map(([name, value]) => ({ name, value }))
  }, [moods])

  const COLORS = ['#fbbf24', '#f59e0b', '#60a5fa', '#94a3b8', '#3b82f6', '#a855f7', '#ef4444', '#dc2626']

  const getMoodEmoji = (mood) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Insights</h1>
        <p className="text-gray-600">Discover patterns and trends in your mood journey</p>
      </div>

      {moods.length === 0 ? (
        <div className="glass-effect rounded-2xl p-12 text-center">
          <p className="text-lg text-gray-600 mb-2">No data yet</p>
          <p className="text-sm text-gray-500">Start logging your moods to see insights!</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-800">{moods.length}</p>
                </div>
                <Calendar className="text-purple-500" size={24} />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Most Common Mood</p>
                  <p className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {moodFrequency[0] ? (
                      <>
                        <span>{getMoodEmoji(moodFrequency[0].mood)}</span>
                        <span className="text-lg capitalize">{moodFrequency[0].mood}</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
                <TrendingUp className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Tags</p>
                  <p className="text-2xl font-bold text-gray-800">{tagFrequency.length}</p>
                </div>
                <Tag className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tracking Streak</p>
                  <p className="text-2xl font-bold text-gray-800">{calculateStreak(moods)}</p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <Award className="text-pink-500" size={24} />
              </div>
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="glass-effect rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7-Day Mood Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 8]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  name="Mood Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Mood Distribution Pie Chart */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Distribution (Last 30 Days)</h2>
              {monthlyMoods.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={monthlyMoods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {monthlyMoods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No data for the last 30 days
                </div>
              )}
            </div>

            {/* Mood Frequency Bar Chart */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Frequency</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodFrequency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mood" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Tags */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Used Tags</h2>
            {tagFrequency.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {tagFrequency.map((tag, index) => (
                  <div
                    key={tag.tag}
                    className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl"
                  >
                    <div className="text-3xl font-bold text-purple-600 mb-1">{tag.count}</div>
                    <div className="text-sm text-gray-700">#{tag.tag}</div>
                    {index === 0 && (
                      <div className="mt-2 text-xs text-orange-500 font-semibold">Most Used</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tags used yet</p>
            )}
          </div>
        </>
      )}
    </div>
  )
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

export default Insights

