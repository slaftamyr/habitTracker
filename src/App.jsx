import React, { useState } from "react";
import Timer from "./components/Timer";
import Stats from "./components/Stats";
import "./App.css";

function App() {
  const [showStats, setShowStats] = useState(false);
  const [statsRefresh, setStatsRefresh] = useState(0);

  const handleSessionEnd = () => {
    setStatsRefresh((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200/60 to-slate-300/70 dark:from-slate-900 dark:to-indigo-900 transition-colors">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 drop-shadow">
          habitTracker
        </h1>
        <button
          className="btn px-4 py-2 rounded-lg font-semibold bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow hover:bg-white/70 dark:hover:bg-gray-700/70 transition"
          onClick={() => setShowStats((v) => !v)}>
          {showStats ? "Hide Stats" : "Show Stats"}
        </button>
      </header>
      <main className="flex flex-col items-center justify-center py-10 px-2">
        <Timer onSessionEnd={handleSessionEnd} />
      </main>
      <Stats
        key={statsRefresh + (showStats ? 1000 : 0)}
        show={showStats}
        onClose={() => setShowStats(false)}
      />
      <footer className="text-center text-xs text-gray-500 py-4 opacity-80">
        &copy; {new Date().getFullYear()} habitTracker.
      </footer>
    </div>
  );
}

export default App;
