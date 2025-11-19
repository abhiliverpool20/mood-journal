import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const commonTags = ['work', 'family', 'health', 'exercise', 'social', 'hobby', 'weather', 'food']

const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = (tag) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < 10) {
      onTagsChange([...tags, normalizedTag])
    }
    setInputValue('')
  }

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      handleAddTag(inputValue)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Tags</label>
      
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-purple-900 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag (press Enter)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
        <button
          onClick={() => handleAddTag(inputValue)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Common tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Quick add:</span>
        {commonTags
          .filter(tag => !tags.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              onClick={() => handleAddTag(tag)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              + {tag}
            </button>
          ))}
      </div>
    </div>
  )
}

export default TagInput

