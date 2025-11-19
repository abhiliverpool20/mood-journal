import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { MoodContext } from "./context/MoodContext";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";

function App() {
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem("moodEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("moodSettings");
    return saved
      ? JSON.parse(saved)
      : {
          reminderEnabled: true,
          reminderTime: "20:00",
          theme: "light",
        };
  });

  useEffect(() => {
    localStorage.setItem("moodEntries", JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem("moodSettings", JSON.stringify(settings));
  }, [settings]);

  // Notification reminder
  useEffect(() => {
    if (!settings.reminderEnabled) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = settings.reminderTime.split(":");
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Check if it's time for reminder and user hasn't logged today
      const today = now.toDateString();
      const todayEntry = moods.find(
        (m) => new Date(m.date).toDateString() === today
      );

      if (
        now.getHours() === parseInt(hours) &&
        now.getMinutes() === parseInt(minutes) &&
        !todayEntry
      ) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Mood Journal Reminder", {
            body: "Don't forget to log your mood today! 📝",
            icon: "/vite.svg",
          });
        }
      }
    };

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings, moods]);

  const addMood = (mood) => {
    setMoods((prev) => [...prev, mood]);
  };

  const updateMood = (id, updatedMood) => {
    setMoods((prev) => prev.map((m) => (m.id === id ? updatedMood : m)));
  };

  const deleteMood = (id) => {
    setMoods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MoodContext.Provider
      value={{ moods, addMood, updateMood, deleteMood, settings, setSettings }}
    >
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </MoodContext.Provider>
  );
}

export default App;
