'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Circle,
  Mail,
  ListTodo,
  X,
  LayoutGrid,
  CalendarDays,
  CalendarRange,
  RefreshCw,
  AlertCircle,
  LogIn,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Auth + API — same pattern as the rest of the app.
// ---------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const getToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  } catch {
    return null;
  }
};

async function apiGet<T>(path: string, token: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}?${qs}`, { headers: { 'Auth-token': token } });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error('Your session has expired. Please sign in again.');
    throw new Error(`Request failed with status ${res.status}.`);
  }
  return res.json();
}

async function fetchTasks(token: string, startDate: string, endDate: string): Promise<TaskData[]> {
  const data = await apiGet<{ tasks: TaskData[] }>('/api/v1/task/date-range', token, { startDate, endDate });
  return data.tasks || [];
}

async function fetchReminders(token: string, startDate: string, endDate: string): Promise<Reminder[]> {
  const data = await apiGet<{ emails: Reminder[] }>('/api/v1/email/date-range', token, { startDate, endDate });
  return data.emails || [];
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TaskStatus = 'pending' | 'to do' | 'in progress' | 'done';
type TaskPriority = 'high' | 'normal' | 'low';

interface TimeEntry {
  started?: string;
  stated?: string; // defensive: current API responses use this key
  ended?: string;
  id?: string;
}

interface TaskData {
  id: string | number;
  user?: string | number;
  title: string;
  description: string;
  status: TaskStatus | string;
  estimatedTime?: string;
  time: TimeEntry[];
  priority: TaskPriority | string;
  createdAt: string;
  updatedAt?: string;
}

interface Reminder {
  status: string;
  id: string | number;
  to: string;
  subject: string;
  body: string;
  scheduleTime: string;
  jobId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CalendarEvent {
  id: string;
  type: 'task' | 'email';
  title: string;
  description: string;
  status: string;
  priority: string;
  start: Date;
  end: Date;
}

type ViewMode = 'month' | 'week' | 'day';
type Status = 'unauthenticated' | 'loading' | 'connected' | 'error';
type FilterType = 'all' | 'task' | 'email';

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_HEIGHT = 56;
const GRID_TOTAL_HEIGHT = HOUR_HEIGHT * 24;
const DEFAULT_DURATION_MIN = 45;

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}
function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toDateParam(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function getMonthGrid(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}
function getRangeForView(viewMode: ViewMode, date: Date) {
  let start: Date, end: Date;
  if (viewMode === 'month') {
    const grid = getMonthGrid(date);
    start = grid[0];
    end = grid[grid.length - 1];
  } else if (viewMode === 'week') {
    start = startOfWeek(date);
    end = addDays(start, 6);
  } else {
    start = date;
    end = date;
  }
  return { startDate: toDateParam(start), endDate: toDateParam(end) };
}
function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}
function formatWeekLabel(date: Date) {
  const start = startOfWeek(date);
  const end = addDays(start, 6);
  const startFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start);
  const endFmt = new Intl.DateTimeFormat('en-US', {
    month: start.getMonth() === end.getMonth() ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(end);
  return `${startFmt} – ${endFmt}`;
}
function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}
function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
}
function formatHourLabel(hour: number) {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}
function formatUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
}

// ---------------------------------------------------------------------------
// Event shaping
// ---------------------------------------------------------------------------

function buildEvents(tasks: TaskData[], reminders: Reminder[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  tasks.forEach((task) => {
    const entries = Array.isArray(task.time) ? task.time : [];
    if (entries.length > 0) {
      entries.forEach((entry, idx) => {
        const startRaw = entry.started || entry.stated;
        if (!startRaw) return;
        const start = new Date(startRaw);
        const end = entry.ended ? new Date(entry.ended) : new Date(start.getTime() + DEFAULT_DURATION_MIN * 60000);
        events.push({
          id: `task-${task.id}-${idx}`, type: 'task', title: task.title || 'Untitled task',
          description: task.description || '', status: task.status || 'pending',
          priority: task.priority || 'normal', start, end,
        });
      });
    } else if (task.createdAt) {
      const start = new Date(task.createdAt);
      events.push({
        id: `task-${task.id}-0`, type: 'task', title: task.title || 'Untitled task',
        description: task.description || '', status: task.status || 'pending',
        priority: task.priority || 'normal', start,
        end: new Date(start.getTime() + DEFAULT_DURATION_MIN * 60000),
      });
    }
  });

  reminders.forEach((r) => {
    if (!r.scheduleTime) return;
    const start = new Date(r.scheduleTime);
    events.push({
      id: `email-${r.id}`, type: 'email', title: r.subject || 'Reminder',
      description: r.body || '', status: r.status || 'pending', priority: 'normal',
      start, end: new Date(start.getTime() + 30 * 60000),
    });
  });

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

interface LaidOutEvent extends CalendarEvent {
  col: number;
  totalCols: number;
}

// Cluster-based overlap layout: events only share column-width with events
// they actually overlap, instead of the whole day's max concurrency.
function layoutDayEvents(dayEvents: CalendarEvent[]): LaidOutEvent[] {
  const sorted = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime());
  const n = sorted.length;
  const clusterOf: number[] = new Array(n).fill(-1);
  const clusters: { indices: number[]; maxCol: number }[] = [];
  let clusterEnd = -Infinity;

  for (let i = 0; i < n; i++) {
    const ev = sorted[i];
    if (ev.start.getTime() >= clusterEnd) {
      clusters.push({ indices: [], maxCol: 0 });
      clusterEnd = ev.end.getTime();
    } else {
      clusterEnd = Math.max(clusterEnd, ev.end.getTime());
    }
    clusterOf[i] = clusters.length - 1;
    clusters[clusters.length - 1].indices.push(i);
  }

  const assignedCol: number[] = new Array(n);
  clusters.forEach((cluster) => {
    const colEnds: number[] = [];
    cluster.indices.forEach((i) => {
      const ev = sorted[i];
      let col = colEnds.findIndex((end) => end <= ev.start.getTime());
      if (col === -1) { col = colEnds.length; colEnds.push(ev.end.getTime()); } else colEnds[col] = ev.end.getTime();
      assignedCol[i] = col;
    });
    cluster.maxCol = colEnds.length;
  });

  return sorted.map((ev, i) => ({ ...ev, col: assignedCol[i], totalCols: clusters[clusterOf[i]].maxCol }));
}

function typeStyles(type: 'task' | 'email') {
  return type === 'task'
    ? { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500', iconBg: 'bg-blue-100' }
    : { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500', iconBg: 'bg-purple-100' };
}
function priorityColor(priority: string) {
  if (priority === 'high') return 'border-l-rose-500';
  if (priority === 'low') return 'border-l-slate-300';
  return 'border-l-blue-400';
}
function statusIcon(status: string) {
  const done = status === 'done' || status === 'sent';
  const active = status === 'in progress';
  if (done) return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (active) return <Clock className="w-3.5 h-3.5" />;
  return <Circle className="w-3.5 h-3.5" />;
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

interface ToastMessage { id: string; message: string; type: 'success' | 'error' | 'info'; }

function Toast({ message, type, onClose }: { message: string; type: ToastMessage['type']; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const styles = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-slate-800' };
  return (
    <div className={`${styles[type]} text-white text-sm font-medium px-4 py-3 rounded-sm shadow-lg flex items-center gap-2 animate-in slide-in-from-right`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export  function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const loadData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }
    setStatus('loading');
    setErrorMessage(null);
    try {
      const { startDate, endDate } = getRangeForView(viewMode, currentDate);
      const [taskRes, reminderRes] = await Promise.all([
        fetchTasks(token, startDate, endDate),
        fetchReminders(token, startDate, endDate),
      ]);
      setTasks(taskRes);
      setReminders(reminderRes);
      setStatus('connected');
      setLastUpdated(new Date());
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to load calendar data.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  }, [viewMode, currentDate]);

  useEffect(() => { loadData(); }, [loadData]);

  const allEvents = useMemo(() => buildEvents(tasks, reminders), [tasks, reminders]);
  const events = useMemo(
    () => (filterType === 'all' ? allEvents : allEvents.filter((e) => e.type === filterType)),
    [allEvents, filterType]
  );
  const taskCount = allEvents.filter((e) => e.type === 'task').length;
  const emailCount = allEvents.filter((e) => e.type === 'email').length;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ((viewMode === 'week' || viewMode === 'day') && scrollRef.current) {
      const now = new Date();
      const anchorHour = Math.max(now.getHours() - 2, 0);
      scrollRef.current.scrollTop = anchorHour * HOUR_HEIGHT;
    }
  }, [viewMode, currentDate]);

  const navigate = (dir: 1 | -1) => {
    if (viewMode === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, dir * 7));
    else setCurrentDate((d) => addDays(d, dir));
  };
  const goToday = () => setCurrentDate(new Date());

  const periodLabel =
    viewMode === 'month' ? formatMonthLabel(currentDate)
    : viewMode === 'week' ? formatWeekLabel(currentDate)
    : formatDayLabel(currentDate);

  const viewOptions: { value: ViewMode; label: string; icon: JSX.Element }[] = [
    { value: 'month', label: 'Month', icon: <LayoutGrid className="w-4 h-4" /> },
    { value: 'week', label: 'Week', icon: <CalendarRange className="w-4 h-4" /> },
    { value: 'day', label: 'Day', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const statusPill: Record<Status, { text: string; dot: string }> = {
    unauthenticated: { text: 'Signed out', dot: 'bg-slate-300' },
    loading: { text: 'Syncing…', dot: 'bg-amber-400 animate-pulse' },
    connected: { text: lastUpdated ? `Updated ${formatUpdatedAt(lastUpdated)}` : 'Connected', dot: 'bg-emerald-500' },
    error: { text: 'Connection error', dot: 'bg-rose-500' },
  };
  const pill = statusPill[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase leading-none mb-1">Calendar</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />
                  <p className="text-xs text-slate-500 tabular-nums">{pill.text}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 rounded-sm p-1">
                {viewOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setViewMode(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                      viewMode === opt.value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={loadData}
                disabled={status === 'loading'}
                aria-label="Refresh"
                className="w-9 h-9 flex items-center justify-center rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between gap-3 pb-3">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} aria-label="Previous" className="w-8 h-8 flex items-center justify-center rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => navigate(1)} aria-label="Next" className="w-8 h-8 flex items-center justify-center rounded-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={goToday} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                Today
              </button>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 text-right sm:text-left truncate tabular-nums">
              {periodLabel}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto">
            {([
              { value: 'all', label: 'All', count: allEvents.length, dot: 'bg-slate-400' },
              { value: 'task', label: 'Tasks', count: taskCount, dot: 'bg-blue-500' },
              { value: 'email', label: 'Reminders', count: emailCount, dot: 'bg-purple-500' },
            ] as { value: FilterType; label: string; count: number; dot: string }[]).map((f) => {
              const active = filterType === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilterType(f.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                    active ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : f.dot}`} />
                  {f.label}
                  <span className={active ? 'opacity-90' : 'text-slate-400'}>· {f.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto !rounded-[0px] ">
        {status === 'error' && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-rose-700 font-medium">{errorMessage}</p>
              <button onClick={loadData} className="text-xs font-semibold text-rose-700 underline mt-1">Try again</button>
            </div>
          </div>
        )}

        {status === 'unauthenticated' ? (
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-14 h-14 bg-blue-50 rounded-sm flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sign in to view your calendar</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
              We couldn't find an active session. Sign in, then check again to load your tasks and reminders.
            </p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all"
            >
              Check again
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                events={events}
                loading={status === 'loading'}
                onSelectDay={(d) => { setCurrentDate(d); setViewMode('day'); }}
                onSelectEvent={setSelectedEvent}
              />
            )}
            {viewMode === 'week' && (
              <TimeGridView days={Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i))} events={events} loading={status === 'loading'} onSelectEvent={setSelectedEvent} gridRef={scrollRef} />
            )}
            {viewMode === 'day' && (
              <TimeGridView days={[currentDate]} events={events} loading={status === 'loading'} onSelectEvent={setSelectedEvent} gridRef={scrollRef} />
            )}
          </>
        )}
      </main>

      {/* Event detail modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div className="bg-white rounded-t-3xl sm:rounded-sm shadow-2xl w-full sm:max-w-md p-6 animate-in slide-in-from-bottom sm:zoom-in duration-200">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6 sm:hidden" />
              {(() => {
                const style = typeStyles(selectedEvent.type);
                return (
                  <>
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`flex-shrink-0 w-14 h-14 ${style.iconBg} rounded-sm flex items-center justify-center ${style.text}`}>
                        {selectedEvent.type === 'task' ? <ListTodo className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium ${style.text} ${style.bg} rounded-lg mb-2`}>
                          {statusIcon(selectedEvent.status)}
                          {selectedEvent.status}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 mb-1 break-words">{selectedEvent.title}</h2>
                        <p className="text-sm text-slate-500 tabular-nums">
                          {formatTime(selectedEvent.start)} – {formatTime(selectedEvent.end)}
                        </p>
                      </div>
                      <button onClick={() => setSelectedEvent(null)} className="hidden sm:flex w-8 h-8 items-center justify-center rounded-sm text-slate-400 hover:bg-slate-100 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedEvent.description && (
                      <p className="text-slate-700 leading-relaxed mb-6 break-words">{selectedEvent.description}</p>
                    )}
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className={`w-full py-3 bg-gradient-to-r ${style.gradient} text-white font-semibold rounded-sm shadow-lg hover:shadow-xl transition-all`}
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Month view
// ---------------------------------------------------------------------------

function MonthView({
  currentDate, events, loading, onSelectDay, onSelectEvent,
}: {
  currentDate: Date; events: CalendarEvent[]; loading: boolean;
  onSelectDay: (d: Date) => void; onSelectEvent: (e: CalendarEvent) => void;
}) {
  const grid = useMemo(() => getMonthGrid(currentDate), [currentDate]);
  const today = new Date();

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((ev) => {
      const key = ev.start.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [events]);

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {DAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-slate-500">
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d[0]}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map((day, i) => {
          const inMonth = day.getMonth() === currentDate.getMonth();
          const isToday = sameDay(day, today);
          const dayEvents = eventsByDay.get(day.toDateString()) || [];
          const visible = dayEvents.slice(0, 3);
          const overflow = dayEvents.length - visible.length;

          return (
            <button
              key={i}
              onClick={() => onSelectDay(day)}
              className={`min-h-[76px] sm:min-h-[110px] p-1.5 sm:p-2 border-b border-r border-slate-100 text-left flex flex-col gap-1 hover:bg-slate-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:z-10 relative ${
                inMonth ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : inMonth ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {day.getDate()}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {loading ? (
                  <>
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse w-2/3" />
                  </>
                ) : (
                  <>
                    {visible.map((ev) => {
                      const style = typeStyles(ev.type);
                      return (
                        <div
                          key={ev.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                          className={`flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium truncate ${style.bg} ${style.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                          <span className="truncate hidden sm:inline">{ev.title}</span>
                        </div>
                      );
                    })}
                    {overflow > 0 && <span className="text-[10px] text-slate-400 pl-1">+{overflow} more</span>}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Week / Day time-grid view — sticky header row + sticky hour column so
// scrolling in either direction never loses the labels.
// ---------------------------------------------------------------------------

function TimeGridView({
  days, events, loading, onSelectEvent, gridRef,
}: {
  days: Date[]; events: CalendarEvent[]; loading: boolean;
  onSelectEvent: (e: CalendarEvent) => void; gridRef: React.RefObject<HTMLDivElement>;
}) {
  const today = new Date();
  const now = new Date();
  const nowTop = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT;

  const eventsByDay = useMemo(
    () => days.map((day) => layoutDayEvents(events.filter((ev) => sameDay(ev.start, day)))),
    [days, events]
  );

  const colMinWidth = days.length > 1 ? 120 : 220;

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
      <div ref={gridRef} className="overflow-auto" style={{ maxHeight: '68vh' }}>
        <div style={{ minWidth: 56 + days.length * colMinWidth }}>
          {/* Sticky header row */}
          <div className="flex sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200">
            <div className="sticky left-0 z-30 w-14 flex-shrink-0 bg-white border-r border-slate-100" />
            {days.map((day, i) => {
              const isToday = sameDay(day, today);
              return (
                <div key={i} className="flex-1 px-2 py-2 text-center border-l border-slate-100 first:border-l-0" style={{ minWidth: colMinWidth }}>
                  <div className="text-xs font-medium text-slate-500">{DAY_LABELS[day.getDay()]}</div>
                  <div className={`text-sm font-semibold w-7 h-7 mx-auto mt-0.5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'text-slate-800'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div className="flex relative" style={{ height: GRID_TOTAL_HEIGHT }}>
            {/* Sticky hour column */}
            <div className="sticky left-0 z-10 w-14 flex-shrink-0 bg-white border-r border-slate-100 relative">
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="absolute left-0 right-0 text-right pr-2 text-[11px] text-slate-400 -translate-y-1/2 tabular-nums" style={{ top: h * HOUR_HEIGHT }}>
                  {formatHourLabel(h)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((day, dayIdx) => {
              const isToday = sameDay(day, today);
              return (
                <div key={dayIdx} className="relative border-l border-slate-100 first:border-l-0" style={{ minWidth: colMinWidth, flex: '1 1 0%', height: GRID_TOTAL_HEIGHT }}>
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="absolute left-0 right-0 border-t border-slate-100" style={{ top: h * HOUR_HEIGHT }} />
                  ))}

                  {isToday && (
                    <div className="absolute left-0 right-0 z-10 flex items-center pointer-events-none" style={{ top: nowTop }}>
                      <span className="w-2 h-2 rounded-full bg-rose-500 -ml-1 flex-shrink-0" />
                      <span className="flex-1 h-px bg-rose-500" />
                    </div>
                  )}

                  {loading ? (
                    <div className="absolute inset-x-1 top-4 space-y-2">
                      <div className="h-10 bg-slate-100 rounded-sm animate-pulse" />
                      <div className="h-14 bg-slate-100 rounded-sm animate-pulse" />
                    </div>
                  ) : (
                    eventsByDay[dayIdx].map((ev) => {
                      const startMin = ev.start.getHours() * 60 + ev.start.getMinutes();
                      const durMin = Math.max((ev.end.getTime() - ev.start.getTime()) / 60000, 20);
                      const top = (startMin / 60) * HOUR_HEIGHT;
                      const height = (durMin / 60) * HOUR_HEIGHT;
                      const widthPct = 100 / ev.totalCols;
                      const style = typeStyles(ev.type);

                      return (
                        <button
                          key={ev.id}
                          onClick={() => onSelectEvent(ev)}
                          className={`absolute rounded-sm border-l-[3px] ${priorityColor(ev.priority)} ${style.bg} ${style.text} px-1.5 py-1 text-left overflow-hidden shadow-sm hover:shadow-md hover:z-20 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500`}
                          style={{ top, height: Math.max(height, 22), left: `calc(${ev.col * widthPct}% + 2px)`, width: `calc(${widthPct}% - 4px)` }}
                        >
                          <div className="text-[10px] sm:text-xs font-semibold truncate leading-tight">{ev.title}</div>
                          {height > 32 && <div className="text-[9px] sm:text-[10px] opacity-75 truncate leading-tight tabular-nums">{formatTime(ev.start)}</div>}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!loading && events.length === 0 && (
        <div className="p-8 text-center text-sm text-slate-400 border-t border-slate-100">Nothing scheduled here.</div>
      )}
    </div>
  );
}