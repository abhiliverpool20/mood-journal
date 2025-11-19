import { Bell, Clock, Download, Trash2 } from "lucide-react";
import { useContext } from "react";
import { MoodContext } from "../context/MoodContext";

const Settings = () => {
  const { settings, setSettings, moods } = useContext(MoodContext);

  const handleReminderToggle = () => {
    setSettings((prev) => ({
      ...prev,
      reminderEnabled: !prev.reminderEnabled,
    }));
  };

  const handleTimeChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      reminderTime: e.target.value,
    }));
  };

  const handleRequestNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          alert(
            "Notifications enabled! You'll receive reminders to log your mood."
          );
        }
      });
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(moods, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mood-journal-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your mood entries? This cannot be undone."
      )
    ) {
      if (
        window.confirm(
          "This will permanently delete all your data. Are you absolutely sure?"
        )
      ) {
        localStorage.removeItem("moodEntries");
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences and data</p>
      </div>

      {/* Reminder Settings */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-purple-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Reminder Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">
                Enable Daily Reminders
              </p>
              <p className="text-sm text-gray-500">
                Get notified to log your mood each day
              </p>
            </div>
            <button
              onClick={handleReminderToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reminderEnabled ? "bg-purple-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reminderEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.reminderEnabled && (
            <div className="flex items-center gap-3">
              <Clock className="text-gray-400" size={20} />
              <label className="text-sm font-medium text-gray-700">
                Reminder Time:
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={handleTimeChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {settings.reminderEnabled && (
            <div>
              <button
                onClick={handleRequestNotification}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                {Notification.permission === "granted"
                  ? "✓ Notifications Enabled"
                  : "Enable Browser Notifications"}
              </button>
              {Notification.permission !== "granted" && (
                <p className="text-xs text-gray-500 mt-2">
                  Click to enable browser notifications for reminders
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-effect rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Data Management
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700">Export Data</p>
              <p className="text-sm text-gray-500">
                Download all your mood entries as JSON
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div>
              <p className="font-medium text-red-700">Clear All Data</p>
              <p className="text-sm text-red-600">
                Permanently delete all mood entries
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Total Entries:</strong> {moods.length}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Your data is stored locally in your browser. It's never sent to any
            server.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
