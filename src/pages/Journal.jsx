import { useState, useContext, useEffect } from 'react'
import { MoodContext } from '../context/MoodContext'
import { useNavigate } from 'react-router-dom'
import MoodSelector from '../components/MoodSelector'
import TagInput from '../components/TagInput'
import { Save, Sparkles } from 'lucide-react'
import { format, isToday } from 'date-fns'

const Journal = () => {
  const { addMood, updateMood, moods } = useContext(MoodContext)
  const navigate = useNavigate()
  
  const todayEntry = moods.find(m => isToday(new Date(m.date)))
  
  const [selectedMood, setSelectedMood] = useState(todayEntry?.mood || null)
  const [notes, setNotes] = useState(todayEntry?.notes || '')
  const [tags, setTags] = useState(todayEntry?.tags || [])
  const [intensity, setIntensity] = useState(todayEntry?.intensity || 5)

  // Update form when todayEntry changes
  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood)
      setNotes(todayEntry.notes || '')
      setTags(todayEntry.tags || [])
      setIntensity(todayEntry.intensity || 5)
    }
  }, [todayEntry])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedMood) {
      alert('Please select a mood')
      return
    }

    const moodEntry = {
      id: todayEntry?.id || Date.now().toString(),
      mood: selectedMood,
      notes: notes.trim(),
      tags,
      intensity,
      date: todayEntry?.date || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (todayEntry) {
      updateMood(todayEntry.id, moodEntry)
    } else {
      addMood(moodEntry)
    }

    // Reset form
    setSelectedMood(null)
    setNotes('')
    setTags([])
    setIntensity(5)
    
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-effect rounded-2xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-500" size={24} />
            <h1 className="text-3xl font-bold text-gray-800">How are you feeling?</h1>
          </div>
          <p className="text-gray-600">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select your mood <span className="text-red-500">*</span>
            </label>
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
          </div>

          {/* Intensity Slider */}
          {selectedMood && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setNotes(e.target.value)
                }
              }}
              placeholder="What's influencing your mood today? What made you feel this way?"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <TagInput tags={tags} onTagsChange={setTags} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedMood}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {todayEntry ? 'Update Entry' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Journal

