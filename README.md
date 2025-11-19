# Mood Journal 📝

A beautiful, modern mood tracking application built with React. Track your emotions, discover patterns, and gain insights into your mental well-being.

## Features ✨

### Core Features
- **Daily Mood Entry**: Choose from 8 different moods with emoji representations
- **Notes & Tags**: Add detailed notes and custom tags to each entry
- **Mood Intensity**: Rate the intensity of your mood on a scale of 1-10
- **Calendar View**: Browse your mood history with an interactive calendar
- **Mood Trends**: Visualize your mood patterns with charts and graphs
- **Personal Insights**: Get statistics about your most common moods and tags
- **Daily Reminders**: Set up notifications to remind you to log your mood
- **Data Export**: Export all your entries as JSON

### Unique Features
- 🎨 Beautiful gradient UI with glass morphism effects
- 📊 Interactive charts using Recharts
- 🔥 Streak tracking to motivate consistent logging
- 📱 Fully responsive design for mobile and desktop
- 🌈 Color-coded mood visualizations
- ⚡ Smooth animations using Framer Motion
- 💾 Local storage - all data stays on your device
- 🔍 Advanced filtering and search capabilities

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack 🛠️

- **React 18** - UI library
- **React Router** - Navigation
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Calendar** - Calendar component
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Project Structure 📁

```
mood-journal/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── MoodSelector.jsx
│   │   └── TagInput.jsx
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Journal.jsx
│   │   ├── History.jsx
│   │   ├── Insights.jsx
│   │   └── Settings.jsx
│   ├── context/        # React Context
│   │   └── MoodContext.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Usage Guide 📖

### Logging Your Mood
1. Navigate to the "Journal" page
2. Select your current mood from the 8 options
3. Adjust the intensity slider (optional)
4. Add notes about what influenced your mood (optional)
5. Add tags to categorize your entry (optional)
6. Click "Save Entry"

### Viewing History
1. Go to the "History" page
2. Click on any date in the calendar to view entries
3. Use filters to search by mood, tag, or keyword
4. Click on an entry to view full details

### Insights
1. Visit the "Insights" page to see:
   - Your most common moods
   - Weekly mood trends
   - Mood distribution charts
   - Most used tags
   - Current streak

### Settings
1. Enable/disable daily reminders
2. Set your preferred reminder time
3. Enable browser notifications
4. Export your data as JSON
5. Clear all data (use with caution!)

## Data Privacy 🔒

All your mood entries are stored locally in your browser's localStorage. Your data never leaves your device and is not sent to any server. This ensures complete privacy and security.

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License 📄

This project is open source and available for personal use.

## Contributing 🤝

Feel free to fork this project and customize it to your needs!

---


