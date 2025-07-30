const STORAGE_KEY = "habitTracker-sessions";

function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export function saveSession(seconds) {
  const key = getTodayKey();
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  if (!sessions[key]) sessions[key] = [];
  sessions[key].push(seconds);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getTodaySessions() {
  const key = getTodayKey();
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return sessions[key] || [];
}

export function getTodayTotal() {
  return getTodaySessions().reduce((a, b) => a + b, 0);
}

export function getLast7DaysData() {
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const total = (sessions[key] || []).reduce((a, b) => a + b, 0);
    days.push({ date: key.slice(5), minutes: Math.round(total / 60) });
  }
  return days;
}

export function getWeeklyData() {
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const weeks = [0, 0, 0, 0, 0, 0];
  Object.keys(sessions).forEach((dateStr) => {
    const d = new Date(dateStr);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const weekNum = Math.floor((d.getDate() - 1) / 7);
      weeks[weekNum] += sessions[dateStr].reduce((a, b) => a + b, 0);
    }
  });
  return weeks.map((total, i) => ({
    week: `Week ${i + 1}`,
    minutes: Math.round(total / 60),
  }));
}
