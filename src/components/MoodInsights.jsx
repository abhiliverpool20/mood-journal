import { useContext, useMemo } from 'react'
import { MoodContext } from '../context/MoodContext'
import { Brain, TrendingDown, TrendingUp, Lightbulb, Clock } from 'lucide-react'
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'

const MoodInsights = () => {
  const { moods } = useContext(MoodContext)

  const insights = useMemo(() => {
    const insightsList = []
    
    if (moods.length < 5) return insightsList

    const moodValues = {
      happy: 7, excited: 8, calm: 6, neutral: 4,
      sad: 2, anxious: 3, stressed: 1, angry: 0,
    }

    // Weekly comparison
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    
    const thisWeekMoods = moods.filter(m => 
      isWithinInterval(new Date(m.date), { start: weekStart, end: weekEnd })
    )
    const lastWeekMoods = moods.filter(m => {
      const date = new Date(m.date)
      date.setDate(date.getDate() - 7)
      return isWithinInterval(date, { start: weekStart, end: weekEnd })
    })

    if (thisWeekMoods.length > 0 && lastWeekMoods.length > 0) {
      const thisWeekAvg = thisWeekMoods.reduce((sum, m) => sum + (moodValues[m.mood] || 4), 0) / thisWeekMoods.length
      const lastWeekAvg = lastWeekMoods.reduce((sum, m) => sum + (moodValues[m.mood] || 4), 0) / lastWeekMoods.length
      const diff = thisWeekAvg - lastWeekAvg

      if (Math.abs(diff) > 0.5) {
        insightsList.push({
          type: diff > 0 ? 'improvement' : 'decline',
          icon: diff > 0 ? TrendingUp : TrendingDown,
          title: diff > 0 ? 'Mood Improvement' : 'Mood Decline',
          message: `Your mood has ${diff > 0 ? 'improved' : 'declined'} this week compared to last week.`,
          color: diff > 0 ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500',
        })
      }
    }

    // Most common mood pattern
    const moodCounts = {}
    moods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1
    })
    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
    const percentage = ((mostCommonMood[1] / moods.length) * 100).toFixed(0)
    
    if (percentage > 40) {
      insightsList.push({
        type: 'pattern',
        icon: Brain,
        title: 'Mood Pattern Detected',
        message: `You tend to feel "${mostCommonMood[0]}" ${percentage}% of the time.`,
        color: 'from-purple-400 to-pink-500',
      })
    }

    // Best day of week
    const dayMoods = {}
    moods.forEach(m => {
      const day = format(new Date(m.date), 'EEEE')
      if (!dayMoods[day]) dayMoods[day] = []
      dayMoods[day].push(moodValues[m.mood] || 4)
    })
    
    const dayAverages = Object.entries(dayMoods).map(([day, values]) => ({
      day,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    })).filter(d => d.count >= 3)

    if (dayAverages.length > 0) {
      const bestDay = dayAverages.sort((a, b) => b.avg - a.avg)[0]
      if (bestDay.avg > 5) {
        insightsList.push({
          type: 'pattern',
          icon: Clock,
          title: 'Best Day Pattern',
          message: `${bestDay.day} tends to be your best mood day!`,
          color: 'from-blue-400 to-cyan-500',
        })
      }
    }

    // Tag correlation with positive moods
    const positiveMoods = ['happy', 'excited', 'calm']
    const tagCorrelations = {}
    
    moods.forEach(m => {
      if (positiveMoods.includes(m.mood) && m.tags) {
        m.tags.forEach(tag => {
          if (!tagCorrelations[tag]) {
            tagCorrelations[tag] = { positive: 0, total: 0 }
          }
          tagCorrelations[tag].positive++
          tagCorrelations[tag].total++
        })
      } else if (m.tags) {
        m.tags.forEach(tag => {
          if (!tagCorrelations[tag]) {
            tagCorrelations[tag] = { positive: 0, total: 0 }
          }
          tagCorrelations[tag].total++
        })
      }
    })

    const bestTag = Object.entries(tagCorrelations)
      .filter(([_, data]) => data.total >= 3)
      .map(([tag, data]) => ({
        tag,
        ratio: data.positive / data.total,
        total: data.total,
      }))
      .sort((a, b) => b.ratio - a.ratio)[0]

    if (bestTag && bestTag.ratio > 0.6) {
      insightsList.push({
        type: 'correlation',
        icon: Lightbulb,
        title: 'Positive Correlation',
        message: `The tag "${bestTag.tag}" is associated with ${(bestTag.ratio * 100).toFixed(0)}% positive moods!`,
        color: 'from-yellow-400 to-orange-400',
      })
    }

    return insightsList.slice(0, 3)
  }, [moods])

  if (insights.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-purple-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Smart Insights</h2>
        </div>
        <p className="text-gray-600 text-center py-8">
          Keep logging your moods for at least a week to unlock personalized insights!
        </p>
      </div>
    )
  }

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-purple-500" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Smart Insights</h2>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={index}
              className={`p-4 rounded-xl bg-gradient-to-br ${insight.color} text-white`}
            >
              <div className="flex items-start gap-3">
                <Icon size={24} className="mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                  <p className="text-sm opacity-90">{insight.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MoodInsights

