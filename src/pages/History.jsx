import { useState, useContext, useMemo } from 'react'
import { MoodContext } from '../context/MoodContext'
import Calendar from 'react-calendar'
import { format, isSameDay } from 'date-fns'
import { Search, Filter, X, Edit, Trash2 } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'

const History = () => {
  const { moods, deleteMood } = useContext(MoodContext)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMood, setSelectedMood] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedEntry, setSelectedEntry] = useState(null)

  // Get unique tags
  const allTags = useMemo(() => {
    const tags = new Set()
    moods.forEach(mood => {
      mood.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [moods])

  // Filter moods
  const filteredMoods = useMemo(() => {
    return moods.filter(mood => {
      const matchesSearch = searchTerm === '' || 
        mood.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mood.mood.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesMood = selectedMood === 'all' || mood.mood === selectedMood
      
      const matchesTag = selectedTag === 'all' || mood.tags?.includes(selectedTag)
      
      return matchesSearch && matchesMood && matchesTag
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [moods, searchTerm, selectedMood, selectedTag])

  // Get entries for selected date
  const dateEntries = useMemo(() => {
    return filteredMoods.filter(mood => 
      isSameDay(new Date(mood.date), selectedDate)
    )
  }, [filteredMoods, selectedDate])

  // Calendar tile content
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEntries = moods.filter(mood => 
        isSameDay(new Date(mood.date), date)
      )
      
      if (dayEntries.length > 0) {
        const mainMood = dayEntries[0].mood
        const emoji = getMoodEmoji(mainMood)
        return (
          <div className="flex items-center justify-center mt-1">
            <span className="text-lg">{emoji}</span>
          </div>
        )
      }
    }
    return null
  }

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

  const moodOptions = ['all', 'happy', 'excited', 'calm', 'neutral', 'sad', 'anxious', 'stressed', 'angry']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mood History</h1>
        <p className="text-gray-600">Browse and search through your past mood entries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={getTileContent}
              className="react-calendar w-full border-0 bg-transparent"
            />
          </div>

          {/* Filters */}
          <div className="glass-effect rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Mood Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isSameDay(selectedDate, new Date()) ? 'Today\'s Entries' : format(selectedDate, 'MMMM dd, yyyy')}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredMoods.length} total entries
              </span>
            </div>

            {dateEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No entries for this date</p>
                <p className="text-sm">Try selecting a different date or adjusting filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-white/70 rounded-xl hover:bg-white transition-colors cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{getMoodEmoji(entry.mood)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-800 capitalize text-lg">
                              {entry.mood}
                            </h3>
                            {entry.intensity && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Intensity: {entry.intensity}/10
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="text-gray-600 mb-2">{entry.notes}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {entry.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-md text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">
                            {format(new Date(entry.date), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEntry(entry)
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm('Are you sure you want to delete this entry?')) {
                              deleteMood(entry.id)
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="glass-effect rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Entry Details</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{getMoodEmoji(selectedEntry.mood)}</span>
                <div>
                  <h3 className="text-2xl font-semibold capitalize">{selectedEntry.mood}</h3>
                  <p className="text-gray-600">
                    {format(new Date(selectedEntry.date), 'EEEE, MMMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              {selectedEntry.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedEntry.notes}</p>
                </div>
              )}
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedEntry.intensity && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Intensity</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                        style={{ width: `${(selectedEntry.intensity / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedEntry.intensity}/10
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History

