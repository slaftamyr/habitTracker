import React, { useState, useRef, useEffect } from "react";
import { saveSession, getTodayTotal, getTodaySessions } from "../utils/storage";

const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export default function Timer({ onSessionEnd }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState(getTodaySessions());

  useEffect(() => {
    setSessions(getTodaySessions());
  }, [showSaved]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setShowSaved(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (elapsed > 0) {
      saveSession(elapsed);
      setShowSaved(true);
      if (onSessionEnd) onSessionEnd();
    }
    setElapsed(0);
  };

  // Animated timer ring (SVG)
  const percent = Math.min((elapsed % 3600) / 3600, 1); // up to 1 hour
  const radius = 44;
  const stroke = 6;
  const circ = 2 * Math.PI * radius;
  const dash = circ * percent;

  return (
    <section className="w-full max-w-md mx-auto mb-8">
      <div className="glass p-8 rounded-3xl shadow-xl flex flex-col items-center relative">
        <div className="relative mb-5">
          <svg width="110" height="110">
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#6366f1"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={circ - dash}
              style={{ transition: "stroke-dashoffset 0.3s linear" }}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-mono select-none">
            {formatTime(elapsed)}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-2">
          {!isRunning && elapsed === 0 && (
            <button
              className="btn"
              onClick={handleStart}
              aria-label="Start reading session">
              Start
            </button>
          )}
          {isRunning && (
            <button
              className="btn"
              onClick={handlePause}
              aria-label="Pause timer">
              Pause
            </button>
          )}
          {!isRunning && elapsed > 0 && (
            <button
              className="btn"
              onClick={handleResume}
              aria-label="Resume timer">
              Resume
            </button>
          )}
          {elapsed > 0 && (
            <button
              className="btn"
              onClick={handleStop}
              aria-label="Stop and save session">
              Stop & Save
            </button>
          )}
        </div>
        {showSaved && (
          <div className="text-green-600 dark:text-green-400 font-semibold mt-2 animate-fade-in">
            Session saved!
          </div>
        )}
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Today's Sessions
          </h3>
          {sessions.length === 0 ? (
            <div className="text-gray-400 text-sm">No sessions yet.</div>
          ) : (
            <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {sessions.map((sec, i) => (
                <li
                  key={i}
                  className="text-gray-700 dark:text-gray-300 flex justify-between items-center">
                  <span>Session {i + 1}</span>
                  <span className="font-mono">{formatTime(sec)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
