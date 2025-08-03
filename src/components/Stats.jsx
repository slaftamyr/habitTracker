import React, { useMemo } from "react";
import { getLast7DaysData, getWeeklyData } from "../utils/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import PropTypes from "prop-types";

export default function Stats({ show, onClose }) {
  const last7Days = useMemo(() => getLast7DaysData(), []);

  const allSessions = JSON.parse(
    localStorage.getItem("habitTracker-sessions") || "{}"
  );
  const allTimes = Object.values(allSessions).flat();
  const allMinutes = allTimes.reduce((a, b) => a + b, 0);
  const longestSession = allTimes.length ? Math.max(...allTimes) : 0;
  const totalDays = Object.keys(allSessions).length;
  const totalSessions = allTimes.length;
  const totalMinutes = last7Days.reduce((a, b) => a + b.minutes, 0);
  const avgMinutes = last7Days.length
    ? Math.round(totalMinutes / last7Days.length)
    : 0;
  const maxDay = last7Days.reduce(
    (max, d) => (d.minutes > max ? d.minutes : max),
    0
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const total = (allSessions[key] || []).reduce((a, b) => a + b, 0);
    return { day: String(day), minutes: Math.round(total / 60) };
  });

  let streak = 0;
  for (let i = last7Days.length - 1; i >= 0; i--) {
    if (last7Days[i].minutes > 0) streak++;
    else break;
  }
  if (!show) return null;
  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all reading data?")) {
      localStorage.removeItem("habitTracker-sessions");
      window.location.reload();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-2 sm:px-0">
      <div className="relative bg-white/95 dark:bg-gray-900/95 glass p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-full sm:max-w-2xl w-full border border-white/30 dark:border-gray-800/30 overflow-y-auto max-h-[95vh]">
        <button
          className="absolute top-4 right-4 btn bg-red-400/70 dark:bg-red-800/70 hover:bg-red-500/80 dark:hover:bg-red-900/80 text-white px-3 py-1 text-lg rounded-full"
          onClick={onClose}
          aria-label="Close stats">
          ✕
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center tracking-tight bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          Statistics
        </h2>
        <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-xl font-bold">
              {allMinutes ? Math.round(allMinutes / 60) : 0} min
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              All-time Total
            </div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-xl font-bold">{totalSessions}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Total Sessions
            </div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-xl font-bold">{totalDays}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Active Days
            </div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-xl font-bold">
              {longestSession ? Math.round(longestSession / 60) : 0} min
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Longest Session
            </div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="text-xl font-bold">{maxDay} min</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Best Day (7d)
            </div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-lg sm:rounded-xl col-span-1 xs:col-span-2 md:col-span-3">
            <div className="text-xl font-bold">{streak} days</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Current Streak
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-4">
          <button
            className="btn bg-gray-300/80 dark:bg-gray-800/80 hover:bg-gray-400/90 dark:hover:bg-gray-700/90 text-gray-900 dark:text-gray-100 px-4 py-2"
            onClick={handleReset}
            aria-label="Reset data">
            Reset Data
          </button>
        </div>
        <div className="mb-8">
          <h3 className="mb-1 sm:mb-2 font-semibold text-base sm:text-lg text-indigo-700 dark:text-indigo-300">
            Daily Reading (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={last7Days}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => `${v} min`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="minutes"
                fill="#6366f1"
                name="Minutes"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="mb-1 sm:mb-2 font-semibold text-base sm:text-lg text-orange-700 dark:text-orange-300">
            Daily Reading (This Month)
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={monthData}>
              <XAxis
                dataKey="day"
                label={{ value: "Day", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip formatter={(v) => `${v} min`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="minutes"
                fill="#f59e42"
                name="Minutes"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
