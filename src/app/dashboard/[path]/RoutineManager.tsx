"use client"
import { useState, useMemo } from "react";
import {
  Bell, Filter, Check, AlertCircle, Inbox, Plus, X, Clock, Calendar,
  Repeat, MapPin, FileText, ChevronRight, Trash2, Archive, Search,
  Sparkles, BellRing, Mail, ListChecks, Pencil, Send, Loader2
} from "lucide-react";

/* ============================================================================
   Types — mirrored from routine.model.ts / task.model.ts / reminder.model.ts
   ============================================================================ */

type RoutinePriority = "critical" | "high" | "medium" | "low" | "optional";
type RepeatType = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
type CustomUnit = "days" | "weeks" | "months";
type DateMode = "single" | "range" | "until" | "forever";
type RoutineStatus = "active" | "paused" | "archived";

type TaskStatus = "pending" | "to do" | "in progress" | "done";
type TaskPriority = "high" | "normal" | "low";

type ReminderStatus = "pending" | "sent" | "failed";

interface RoutineTask {
  id: string;
  routineId: string;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime: string | null; // ISO date
  time: string[]; // e.g. ["09:00", "10:30"]
  priority: TaskPriority;
}

interface RoutineReminder {
  id: string;
  routineId: string;
  to: string;
  subject: string;
  body: string;
  scheduleTime: string; // ISO datetime
  status: ReminderStatus;
}

interface Routine {
  id: string;
  user: number;
  title: string;
  description: string;
  category: string;
  priority: RoutinePriority;
  color: string;
  icon: string;
  repeatType: RepeatType;
  weeklyDays: number[];
  monthDay: number | null;
  customInterval: number | null;
  customUnit: CustomUnit | null;
  dateMode: DateMode;
  startDate: string;
  endDate: string | null;
  repeatUntil: string | null;
  skipDates: string[];
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  estimatedMinutes: number | null;
  location: string;
  notes: string;
  tags: string[];
  status: RoutineStatus;
  tasks: RoutineTask[];
  reminders: RoutineReminder[];
}

/* ============================================================================
   Constants
   ============================================================================ */

const CATEGORIES = ["Study", "Work", "Health", "Gym", "Meeting", "Coding", "Travel", "Shopping", "Meditation", "Reading", "Family", "Custom"];

const ROUTINE_PRIORITIES: { value: RoutinePriority; dot: string; text: string; bg: string }[] = [
  { value: "critical", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  { value: "high", dot: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50" },
  { value: "medium", dot: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" },
  { value: "low", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { value: "optional", dot: "bg-slate-400", text: "text-slate-700", bg: "bg-slate-50" },
];

const TASK_PRIORITIES: { value: TaskPriority; dot: string; text: string; bg: string }[] = [
  { value: "high", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  { value: "normal", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  { value: "low", dot: "bg-slate-400", text: "text-slate-700", bg: "bg-slate-50" },
];

const TASK_STATUSES: { value: TaskStatus; text: string; bg: string }[] = [
  { value: "pending", text: "text-slate-600", bg: "bg-slate-100" },
  { value: "to do", text: "text-blue-700", bg: "bg-blue-50" },
  { value: "in progress", text: "text-amber-700", bg: "bg-amber-50" },
  { value: "done", text: "text-emerald-700", bg: "bg-emerald-50" },
];

const REMINDER_STATUSES: { value: ReminderStatus; text: string; bg: string }[] = [
  { value: "pending", text: "text-slate-600", bg: "bg-slate-100" },
  { value: "sent", text: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "failed", text: "text-red-700", bg: "bg-red-50" },
];

const ROUTINE_COLORS = [
  { value: "Blue", grad: "from-blue-500 to-indigo-600", chip: "bg-blue-500", text: "text-blue-700", soft: "bg-blue-50" },
  { value: "Green", grad: "from-emerald-500 to-teal-600", chip: "bg-emerald-500", text: "text-emerald-700", soft: "bg-emerald-50" },
  { value: "Pink", grad: "from-pink-500 to-rose-600", chip: "bg-pink-500", text: "text-pink-700", soft: "bg-pink-50" },
  { value: "Orange", grad: "from-amber-500 to-orange-600", chip: "bg-amber-500", text: "text-amber-700", soft: "bg-amber-50" },
  { value: "Purple", grad: "from-purple-500 to-fuchsia-600", chip: "bg-purple-500", text: "text-purple-700", soft: "bg-purple-50" },
];

const ICONS = ["💻", "📚", "🏃", "🍽", "🛏", "🚗", "📞", "🎮", "🧘", "👨‍👩‍👧", "🛒", "✨"];
const REPEAT_TYPES: RepeatType[] = ["once", "daily", "weekly", "monthly", "yearly", "custom"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const colorCfg = (c: string) => ROUTINE_COLORS.find(x => x.value === c) || ROUTINE_COLORS[0];
const routinePriorityCfg = (p: RoutinePriority) => ROUTINE_PRIORITIES.find(x => x.value === p)!;
const taskPriorityCfg = (p: TaskPriority) => TASK_PRIORITIES.find(x => x.value === p)!;
const taskStatusCfg = (s: TaskStatus) => TASK_STATUSES.find(x => x.value === s)!;
const reminderStatusCfg = (s: ReminderStatus) => REMINDER_STATUSES.find(x => x.value === s)!;

function formatTime12(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${period}`;
}
function formatDateShort(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}
function repeatSummary(r: Routine) {
  if (r.repeatType === "once") return `One time • ${formatDateShort(r.startDate)}`;
  if (r.repeatType === "daily") return "Every day";
  if (r.repeatType === "weekly") return `Weekly • ${r.weeklyDays.map(d => DAY_LABELS[d]).join(" ")}`;
  if (r.repeatType === "monthly") return `Monthly • day ${r.monthDay}`;
  if (r.repeatType === "yearly") return "Yearly";
  return `Every ${r.customInterval} ${r.customUnit}`;
}

/* ============================================================================
   Seed data (stand-in for GET /routines?include=tasks,reminders)
   ============================================================================ */

function seedRoutines(): Routine[] {
  const r1Id = uid(), r2Id = uid();
  return [
    {
      id: r1Id, user: 1, title: "DSA Practice", description: "Two problems from the current sheet.",
      category: "Coding", priority: "high", color: "Blue", icon: "💻",
      repeatType: "weekly", weeklyDays: [1, 2, 3, 4, 5], monthDay: null, customInterval: null, customUnit: null,
      dateMode: "forever", startDate: todayISO(), endDate: null, repeatUntil: null, skipDates: [],
      allDay: false, startTime: "20:00", endTime: "21:30", estimatedMinutes: 90,
      location: "Home", notes: "Focus on graphs this week.", tags: ["#DSA", "#Revision"], status: "active",
      tasks: [
        { id: uid(), routineId: r1Id, title: "Solve 2 graph problems", description: "LeetCode medium level", status: "in progress", estimatedTime: todayISO(), time: ["20:00", "21:00"], priority: "high" },
        { id: uid(), routineId: r1Id, title: "Review yesterday's mistakes", description: "Go through notes", status: "pending", estimatedTime: todayISO(), time: ["21:00", "21:30"], priority: "normal" },
      ],
      reminders: [
        { id: uid(), routineId: r1Id, to: "me@example.com", subject: "DSA Practice starting soon", body: "Time to solve today's problems.", scheduleTime: new Date(Date.now() + 30 * 60000).toISOString(), status: "pending" },
      ],
    },
    {
      id: r2Id, user: 1, title: "Exam: Operating Systems", description: "Semester exam.",
      category: "Study", priority: "critical", color: "Orange", icon: "📚",
      repeatType: "once", weeklyDays: [], monthDay: null, customInterval: null, customUnit: null,
      dateMode: "single", startDate: todayISO(), endDate: null, repeatUntil: null, skipDates: [],
      allDay: false, startTime: "09:00", endTime: "12:00", estimatedMinutes: 180,
      location: "Library", notes: "Bring calculator & ID card.", tags: ["#Exam", "#Urgent"], status: "active",
      tasks: [
        { id: uid(), routineId: r2Id, title: "Revise Chapter 5 - Deadlocks", description: "", status: "done", estimatedTime: todayISO(), time: ["06:00", "07:00"], priority: "high" },
        { id: uid(), routineId: r2Id, title: "Solve last year's paper", description: "", status: "to do", estimatedTime: todayISO(), time: ["07:00", "08:30"], priority: "high" },
      ],
      reminders: [
        { id: uid(), routineId: r2Id, to: "me@example.com", subject: "Exam tomorrow", body: "OS exam is scheduled for tomorrow 9 AM.", scheduleTime: new Date(Date.now() + 86400000).toISOString(), status: "pending" },
        { id: uid(), routineId: r2Id, to: "me@example.com", subject: "Exam in 1 hour", body: "Don't forget your ID card.", scheduleTime: new Date().toISOString(), status: "sent" },
      ],
    },
  ];
}

/* ============================================================================
   Toast
   ============================================================================ */

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-sm border shadow-sm text-sm font-medium ${styles[type]}`}>
      {type === "success" && <Check className="w-4 h-4 flex-shrink-0" />}
      {type === "error" && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {type === "info" && <Bell className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

/* ============================================================================
   Main component
   ============================================================================ */

export default function RoutineManager() {
  const [routines, setRoutines] = useState<Routine[]>(seedRoutines());
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [taskFormFor, setTaskFormFor] = useState<string | null>(null); // routineId
  const [editingTask, setEditingTask] = useState<{ routineId: string; task: RoutineTask } | null>(null);
  const [reminderFormFor, setReminderFormFor] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<{ routineId: string; reminder: RoutineReminder } | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ---------------- stats ---------------- */
  const stats = useMemo(() => {
    const active = routines.filter(r => r.status === "active");
    const allTasks = routines.flatMap(r => r.tasks);
    const doneTasks = allTasks.filter(t => t.status === "done");
    const pendingReminders = routines.flatMap(r => r.reminders).filter(rm => rm.status === "pending");
    return { active: active.length, totalTasks: allTasks.length, doneTasks: doneTasks.length, pendingReminders: pendingReminders.length };
  }, [routines]);

  /* ---------------- filtering ---------------- */
  const filteredRoutines = useMemo(() => {
    return routines.filter(r => {
      if (r.status === "archived") return false;
      if (filterCategory && r.category !== filterCategory) return false;
      if (filterPriority && r.priority !== filterPriority) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [r.title, r.category, r.description, ...r.tags].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [routines, filterCategory, filterPriority, search]);

  /* ---------------- routine CRUD ----------------
     Swap the setRoutines(...) calls below for real API calls, e.g.:
     await fetch("/api/routines", { method: "POST", body: JSON.stringify(data) })
  */
  const emptyRoutineDraft = (): Omit<Routine, "id" | "user"> => ({
    title: "", description: "", category: "Study", priority: "medium", color: "Blue", icon: "📚",
    repeatType: "daily", weeklyDays: [1, 2, 3, 4, 5], monthDay: 1, customInterval: 1, customUnit: "days",
    dateMode: "forever", startDate: todayISO(), endDate: null, repeatUntil: null, skipDates: [],
    allDay: false, startTime: "09:00", endTime: "10:00", estimatedMinutes: 60,
    location: "", notes: "", tags: [], status: "active",
    tasks: [], reminders: [],
  });
  const [routineDraft, setRoutineDraft] = useState(emptyRoutineDraft());

  const openNewRoutineForm = () => { setEditingRoutineId(null); setRoutineDraft(emptyRoutineDraft()); setShowRoutineForm(true); };
  const openEditRoutineForm = (r: Routine) => {
    setEditingRoutineId(r.id);
    setRoutineDraft({ ...r, tasks: r.tasks.map(t => ({ ...t })), reminders: r.reminders.map(rm => ({ ...rm })) });
    setShowRoutineForm(true);
  };

  const saveRoutine = async () => {
    if (!routineDraft.title.trim()) { showToast("Title is required", "error"); return; }
    setSaving(true);
    try {
      // await fetch(editingRoutineId ? `/api/routines/${editingRoutineId}` : "/api/routines", {
      //   method: editingRoutineId ? "PUT" : "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(routineDraft), // backend fans this out into Routine + Task[] + Reminder[] rows
      // });
      if (editingRoutineId) {
        const rId = editingRoutineId;
        setRoutines(prev => prev.map(r => (r.id === rId ? {
          ...r,
          ...routineDraft,
          tasks: routineDraft.tasks.map(t => ({ ...t, id: t.id || uid(), routineId: rId })),
          reminders: routineDraft.reminders.map(rm => ({ ...rm, id: rm.id || uid(), routineId: rId })),
        } : r)));
        showToast("Routine updated", "success");
      } else {
        const newId = uid();
        setRoutines(prev => [{
          ...routineDraft,
          id: newId,
          user: 1,
          tasks: routineDraft.tasks.map(t => ({ ...t, id: t.id || uid(), routineId: newId })),
          reminders: routineDraft.reminders.map(rm => ({ ...rm, id: rm.id || uid(), routineId: newId })),
        }, ...prev]);
        showToast(`Routine created with ${routineDraft.tasks.length} task(s) and ${routineDraft.reminders.length} reminder(s)`, "success");
      }
      setShowRoutineForm(false);
    } catch {
      showToast("Something went wrong saving the routine", "error");
    } finally {
      setSaving(false);
    }
  };
  const deleteRoutine = (id: string) => { setRoutines(prev => prev.filter(r => r.id !== id)); showToast("Routine deleted", "info"); };
  const archiveRoutine = (id: string) => { setRoutines(prev => prev.map(r => (r.id === id ? { ...r, status: "archived" } : r))); showToast("Routine archived", "info"); };

  /* ---------------- task CRUD (nested under a routine) ---------------- */
  const emptyTaskDraft = (routineId: string): Omit<RoutineTask, "id"> => ({
    routineId: routineId, title: "", description: "", status: "pending", estimatedTime: todayISO(), time: ["09:00", "10:00"], priority: "normal",
  });
  const [taskDraft, setTaskDraft] = useState<Omit<RoutineTask, "id">>(emptyTaskDraft(""));

  const openNewTaskForm = (routineId: string) => { setEditingTask(null); setTaskDraft(emptyTaskDraft(routineId)); setTaskFormFor(routineId); };
  const openEditTaskForm = (routineId: string, task: RoutineTask) => { setEditingTask({ routineId, task }); setTaskDraft({ ...task }); setTaskFormFor(routineId); };

  const saveTask = () => {
    if (!taskDraft.title.trim()) { showToast("Task title is required", "error"); return; }
    setRoutines(prev => prev.map(r => {
      if (r.id !== taskFormFor) return r;
      if (editingTask) {
        return { ...r, tasks: r.tasks.map(t => (t.id === editingTask.task.id ? { ...t, ...taskDraft } : t)) };
      }
      return { ...r, tasks: [...r.tasks, { ...taskDraft, id: uid() }] };
    }));
    showToast(editingTask ? "Task updated" : "Task added", "success");
    setTaskFormFor(null);
  };
  const deleteTask = (routineId: string, taskId: string) => {
    setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, tasks: r.tasks.filter(t => t.id !== taskId) } : r)));
    showToast("Task deleted", "info");
  };
  const cycleTaskStatus = (routineId: string, taskId: string) => {
    const order: TaskStatus[] = ["pending", "to do", "in progress", "done"];
    setRoutines(prev => prev.map(r => {
      if (r.id !== routineId) return r;
      return {
        ...r,
        tasks: r.tasks.map(t => {
          if (t.id !== taskId) return t;
          const next = order[(order.indexOf(t.status) + 1) % order.length];
          return { ...t, status: next };
        }),
      };
    }));
  };

  /* ---------------- reminder CRUD (nested under a routine) ---------------- */
  const emptyReminderDraft = (routineId: string): Omit<RoutineReminder, "id"> => ({
    routineId: routineId, to: "", subject: "", body: "", scheduleTime: new Date().toISOString().slice(0, 16), status: "pending",
  });
  const [reminderDraft, setReminderDraft] = useState<Omit<RoutineReminder, "id">>(emptyReminderDraft(""));

  const openNewReminderForm = (routineId: string) => { setEditingReminder(null); setReminderDraft(emptyReminderDraft(routineId)); setReminderFormFor(routineId); };
  const openEditReminderForm = (routineId: string, reminder: RoutineReminder) => {
    setEditingReminder({ routineId, reminder });
    setReminderDraft({ ...reminder, scheduleTime: reminder.scheduleTime.slice(0, 16) });
    setReminderFormFor(routineId);
  };

  const saveReminder = () => {
    if (!reminderDraft.to.trim() || !reminderDraft.subject.trim()) { showToast("Recipient and subject are required", "error"); return; }
    setRoutines(prev => prev.map(r => {
      if (r.id !== reminderFormFor) return r;
      if (editingReminder) {
        return { ...r, reminders: r.reminders.map(rm => (rm.id === editingReminder.reminder.id ? { ...rm, ...reminderDraft } : rm)) };
      }
      return { ...r, reminders: [...r.reminders, { ...reminderDraft, id: uid() }] };
    }));
    showToast(editingReminder ? "Reminder updated" : "Reminder scheduled", "success");
    setReminderFormFor(null);
  };
  const deleteReminder = (routineId: string, reminderId: string) => {
    setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, reminders: r.reminders.filter(rm => rm.id !== reminderId) } : r)));
    showToast("Reminder removed", "info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Routines</h1>
                <p className="text-xs text-slate-500">Each routine groups its own tasks and reminders</p>
              </div>
            </div>
            <button
              onClick={openNewRoutineForm}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Routine</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Active Routines" value={stats.active} icon={<Repeat className="w-4 h-4" />} />
          <StatCard label="Total Tasks" value={stats.totalTasks} icon={<ListChecks className="w-4 h-4" />} />
          <StatCard label="Tasks Done" value={stats.doneTasks} icon={<Check className="w-4 h-4" />} />
          <StatCard label="Pending Reminders" value={stats.pendingReminders} icon={<BellRing className="w-4 h-4" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-5">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search routines, tags..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <h2 className="font-semibold text-slate-900 text-sm">Filters</h2>
              </div>
              <label className="text-xs font-medium text-slate-500">Category</label>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="text-xs font-medium text-slate-500">Priority</label>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">All Priorities</option>
                {ROUTINE_PRIORITIES.map(p => <option key={p.value} value={p.value} className="capitalize">{p.value}</option>)}
              </select>
              {(filterCategory || filterPriority || search) && (
                <button onClick={() => { setFilterCategory(""); setFilterPriority(""); setSearch(""); }} className="w-full mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Routine list */}
          <div className="lg:col-span-2 space-y-3">
            {filteredRoutines.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No routines match</h3>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your filters, or create a new routine.</p>
                <button onClick={openNewRoutineForm} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-lg shadow-blue-500/30">
                  Create Routine
                </button>
              </div>
            ) : (
              filteredRoutines.map(routine => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  expanded={expandedId === routine.id}
                  onToggleExpand={() => setExpandedId(expandedId === routine.id ? null : routine.id)}
                  onEdit={() => openEditRoutineForm(routine)}
                  onArchive={() => archiveRoutine(routine.id)}
                  onDelete={() => deleteRoutine(routine.id)}
                  onAddTask={() => openNewTaskForm(routine.id)}
                  onEditTask={(t) => openEditTaskForm(routine.id, t)}
                  onDeleteTask={(taskId) => deleteTask(routine.id, taskId)}
                  onCycleTaskStatus={(taskId) => cycleTaskStatus(routine.id, taskId)}
                  onAddReminder={() => openNewReminderForm(routine.id)}
                  onEditReminder={(rm) => openEditReminderForm(routine.id, rm)}
                  onDeleteReminder={(rmId) => deleteReminder(routine.id, rmId)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {showRoutineForm && (
        <RoutineFormModal
          draft={routineDraft}
          setDraft={setRoutineDraft}
          isEditing={!!editingRoutineId}
          saving={saving}
          onCancel={() => setShowRoutineForm(false)}
          onSave={saveRoutine}
        />
      )}

      {taskFormFor && (
        <TaskFormModal
          draft={taskDraft}
          setDraft={setTaskDraft}
          isEditing={!!editingTask}
          onCancel={() => setTaskFormFor(null)}
          onSave={saveTask}
        />
      )}

      {reminderFormFor && (
        <ReminderFormModal
          draft={reminderDraft}
          setDraft={setReminderDraft}
          isEditing={!!editingReminder}
          onCancel={() => setReminderFormFor(null)}
          onSave={saveReminder}
        />
      )}
    </div>
  );
}

/* ============================================================================
   Stat card
   ============================================================================ */

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-slate-400 mb-1">{icon}<span className="text-xs font-medium text-slate-500">{label}</span></div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

/* ============================================================================
   Routine card (with nested Task list + Reminder list)
   ============================================================================ */

function RoutineCard({
  routine, expanded, onToggleExpand, onEdit, onArchive, onDelete,
  onAddTask, onEditTask, onDeleteTask, onCycleTaskStatus,
  onAddReminder, onEditReminder, onDeleteReminder,
}: {
  routine: Routine;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onEditTask: (t: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
  onCycleTaskStatus: (taskId: string) => void;
  onAddReminder: () => void;
  onEditReminder: (rm: RoutineReminder) => void;
  onDeleteReminder: (rmId: string) => void;
}) {
  const color = colorCfg(routine.color);
  const priority = routinePriorityCfg(routine.priority);
  const doneCount = routine.tasks.filter(t => t.status === "done").length;
  const progressPct = routine.tasks.length ? Math.round((doneCount / routine.tasks.length) * 100) : 0;

  return (
    <div className={`bg-white rounded-sm shadow-sm border transition-all ${expanded ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
      <div className="p-5 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-sm flex items-center justify-center text-xl bg-gradient-to-br ${color.grad} shadow-md`}>
            <span>{routine.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-semibold text-slate-900 truncate">{routine.title}</h3>
              <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium capitalize ${priority.text} ${priority.bg} rounded-lg`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.value}
              </span>
            </div>
            {routine.description && <p className="text-sm text-slate-600 line-clamp-1 mb-2">{routine.description}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5" />{repeatSummary(routine)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {routine.allDay ? "All day" : `${formatTime12(routine.startTime)} – ${formatTime12(routine.endTime)}`}
              </span>
              {routine.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{routine.location}</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${color.soft} ${color.text}`}>{routine.category}</span>
              {routine.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600">{tag}</span>)}
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                <ListChecks className="w-3 h-3" />{routine.tasks.length} tasks
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                <Mail className="w-3 h-3" />{routine.reminders.length} reminders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color.grad}`} style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs font-medium text-slate-500 flex-shrink-0">{progressPct}%</span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`} />
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
          <div className="flex items-center justify-end gap-1 -mt-1">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Edit routine">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onArchive(); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-colors" title="Archive routine">
              <Archive className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete routine">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {routine.notes && <div className="p-3 bg-slate-50 rounded-sm text-sm text-slate-600">{routine.notes}</div>}

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" />Tasks
              </h4>
              <button onClick={(e) => { e.stopPropagation(); onAddTask(); }} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Plus className="w-3.5 h-3.5" />Add Task
              </button>
            </div>
            <div className="space-y-1.5">
              {routine.tasks.length === 0 && <p className="text-sm text-slate-400 italic">No tasks yet.</p>}
              {routine.tasks.map(task => {
                const tp = taskPriorityCfg(task.priority);
                const ts = taskStatusCfg(task.status);
                return (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2 rounded-sm border border-slate-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCycleTaskStatus(task.id); }}
                      className={`flex-shrink-0 px-2 py-1 text-[11px] font-medium rounded-md capitalize ${ts.bg} ${ts.text} hover:opacity-75`}
                      title="Click to advance status"
                    >
                      {task.status}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-slate-400" : "text-slate-700"}`}>{task.title}</p>
                      {task.time?.length === 2 && <p className="text-xs text-slate-400">{formatTime12(task.time[0])} – {formatTime12(task.time[1])}</p>}
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${tp.bg} ${tp.text}`}>{task.priority}</span>
                    <button onClick={(e) => { e.stopPropagation(); onEditTask(task); }} className="p-1 text-slate-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />Reminders
              </h4>
              <button onClick={(e) => { e.stopPropagation(); onAddReminder(); }} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Plus className="w-3.5 h-3.5" />Add Reminder
              </button>
            </div>
            <div className="space-y-1.5">
              {routine.reminders.length === 0 && <p className="text-sm text-slate-400 italic">No reminders scheduled.</p>}
              {routine.reminders.map(rm => {
                const rs = reminderStatusCfg(rm.status);
                return (
                  <div key={rm.id} className="flex items-center gap-3 px-3 py-2 rounded-sm border border-slate-200">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{rm.subject}</p>
                      <p className="text-xs text-slate-400 truncate">to {rm.to} • {new Date(rm.scheduleTime).toLocaleString()}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${rs.bg} ${rs.text}`}>{rm.status}</span>
                    <button onClick={(e) => { e.stopPropagation(); onEditReminder(rm); }} className="p-1 text-slate-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteReminder(rm.id); }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   Routine form modal
   ============================================================================ */

function RoutineFormModal({
  draft, setDraft, isEditing, saving, onCancel, onSave,
}: {
  draft: any; setDraft: (d: any) => void; isEditing: boolean; saving: boolean; onCancel: () => void; onSave: () => void;
}) {
  const set = (patch: any) => setDraft((prev: any) => ({ ...prev, ...patch }));
  const toggleWeekday = (day: number) => {
    const days = draft.weeklyDays || [];
    set({ weeklyDays: days.includes(day) ? days.filter((d: number) => d !== day) : [...days, day].sort() });
  };
  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    const val = tagInput.trim().replace(/^#*/, "#");
    if (val.length > 1 && !(draft.tags || []).includes(val)) set({ tags: [...(draft.tags || []), val] });
    setTagInput("");
  };
  const removeTag = (t: string) => set({ tags: draft.tags.filter((x: string) => x !== t) });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Routine" : "New Routine"}</h2>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500">Title</label>
            <input value={draft.title} onChange={e => set({ title: e.target.value })} placeholder="e.g. Morning Study Block"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <input value={draft.description} onChange={e => set({ description: e.target.value })} placeholder="Optional short description"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Category</label>
              <select value={draft.category} onChange={e => set({ category: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Priority</label>
              <select value={draft.priority} onChange={e => set({ priority: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize">
                {ROUTINE_PRIORITIES.map(p => <option key={p.value} value={p.value} className="capitalize">{p.value}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Color</label>
              <div className="flex gap-2">
                {ROUTINE_COLORS.map(c => (
                  <button key={c.value} onClick={() => set({ color: c.value })} title={c.value}
                    className={`w-8 h-8 rounded-full ${c.chip} ${draft.color === c.value ? "ring-2 ring-offset-2 ring-slate-400" : ""}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Icon</label>
              <div className="flex gap-1.5 flex-wrap">
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => set({ icon: ic })}
                    className={`w-8 h-8 rounded-sm border flex items-center justify-center text-base ${draft.icon === ic ? "border-blue-400 bg-blue-50" : "border-slate-200"}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Repeat</label>
            <div className="flex flex-wrap gap-1.5">
              {REPEAT_TYPES.map(rt => (
                <button key={rt} onClick={() => set({ repeatType: rt })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize transition-colors ${draft.repeatType === rt ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {rt}
                </button>
              ))}
            </div>
          </div>

          {draft.repeatType === "weekly" && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Days</label>
              <div className="flex gap-1.5">
                {DAY_LABELS.map((lbl, idx) => (
                  <button key={idx} onClick={() => toggleWeekday(idx)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${(draft.weeklyDays || []).includes(idx) ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {draft.repeatType === "monthly" && (
            <div>
              <label className="text-xs font-semibold text-slate-500">Day of month</label>
              <input type="number" min={1} max={31} value={draft.monthDay} onChange={e => set({ monthDay: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          )}

          {draft.repeatType === "custom" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Every</span>
              <input type="number" min={1} value={draft.customInterval} onChange={e => set({ customInterval: Number(e.target.value) })}
                className="w-20 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <select value={draft.customUnit} onChange={e => set({ customUnit: e.target.value })}
                className="px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="days">Day(s)</option>
                <option value="weeks">Week(s)</option>
                <option value="months">Month(s)</option>
              </select>
            </div>
          )}

          {draft.repeatType !== "once" && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Ends</label>
              <div className="flex flex-wrap gap-1.5">
                {[["range", "On date"], ["until", "After a date"], ["forever", "Never"]].map(([val, lbl]) => (
                  <button key={val} onClick={() => set({ dateMode: val })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${draft.dateMode === val ? "bg-slate-900 text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Start Date</label>
              <input type="date" value={draft.startDate} onChange={e => set({ startDate: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            {draft.repeatType !== "once" && draft.dateMode === "range" && (
              <div>
                <label className="text-xs font-semibold text-slate-500">End Date</label>
                <input type="date" value={draft.endDate || ""} onChange={e => set({ endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
            )}
            {draft.repeatType !== "once" && draft.dateMode === "until" && (
              <div>
                <label className="text-xs font-semibold text-slate-500">Repeat Until</label>
                <input type="date" value={draft.repeatUntil || ""} onChange={e => set({ repeatUntil: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2 cursor-pointer">
              <input type="checkbox" checked={draft.allDay} onChange={e => set({ allDay: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              All Day
            </label>
            {!draft.allDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Start Time</label>
                  <input type="time" value={draft.startTime} onChange={e => set({ startTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">End Time</label>
                  <input type="time" value={draft.endTime} onChange={e => set({ endTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Location</label>
            <input value={draft.location} onChange={e => set({ location: e.target.value })} placeholder="e.g. Home, Office, Google Meet"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Tags</label>
            <div className="flex gap-2 mt-1">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type a tag and press Enter" className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <button onClick={addTag} className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-sm hover:bg-slate-200">Add</button>
            </div>
            {draft.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {draft.tags.map((t: string) => (
                  <span key={t} className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                    {t}<button onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Notes</label>
            <textarea value={draft.notes} onChange={e => set({ notes: e.target.value })} rows={3} placeholder="Anything you'd like to remember..."
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 px-6 py-4 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-sm hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Routine"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Task form modal — mirrors task.model.ts fields
   ============================================================================ */

function TaskFormModal({
  draft, setDraft, isEditing, onCancel, onSave,
}: {
  draft: Omit<RoutineTask, "id">; setDraft: (d: any) => void; isEditing: boolean; onCancel: () => void; onSave: () => void;
}) {
  const set = (patch: any) => setDraft((prev: any) => ({ ...prev, ...patch }));
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Task" : "New Task"}</h2>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Title</label>
            <input value={draft.title} onChange={e => set({ title: e.target.value })} placeholder="e.g. Solve 2 graph problems"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <textarea value={draft.description} onChange={e => set({ description: e.target.value })} rows={2}
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select value={draft.status} onChange={e => set({ status: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize">
                {TASK_STATUSES.map(s => <option key={s.value} value={s.value} className="capitalize">{s.value}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Priority</label>
              <select value={draft.priority} onChange={e => set({ priority: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize">
                {TASK_PRIORITIES.map(p => <option key={p.value} value={p.value} className="capitalize">{p.value}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Start Time</label>
              <input type="time" value={draft.time?.[0] || ""} onChange={e => set({ time: [e.target.value, draft.time?.[1] || ""] })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">End Time</label>
              <input type="time" value={draft.time?.[1] || ""} onChange={e => set({ time: [draft.time?.[0] || "", e.target.value] })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Date</label>
            <input type="date" value={draft.estimatedTime || ""} onChange={e => set({ estimatedTime: e.target.value })}
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-sm hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={onSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all">
            {isEditing ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Reminder form modal — mirrors reminder.model.ts (Email) fields
   ============================================================================ */

function ReminderFormModal({
  draft, setDraft, isEditing, onCancel, onSave,
}: {
  draft: Omit<RoutineReminder, "id">; setDraft: (d: any) => void; isEditing: boolean; onCancel: () => void; onSave: () => void;
}) {
  const set = (patch: any) => setDraft((prev: any) => ({ ...prev, ...patch }));
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Reminder" : "New Reminder"}</h2>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">To (email)</label>
            <input type="email" value={draft.to} onChange={e => set({ to: e.target.value })} placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Subject</label>
            <input value={draft.subject} onChange={e => set({ subject: e.target.value })} placeholder="e.g. Exam starting soon"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Body</label>
            <textarea value={draft.body} onChange={e => set({ body: e.target.value })} rows={3} placeholder="Reminder message..."
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Schedule Time</label>
            <input type="datetime-local" value={draft.scheduleTime} onChange={e => set({ scheduleTime: e.target.value })}
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          {isEditing && (
            <div>
              <label className="text-xs font-semibold text-slate-500">Status</label>
              <select value={draft.status} onChange={e => set({ status: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 capitalize">
                {REMINDER_STATUSES.map(s => <option key={s.value} value={s.value} className="capitalize">{s.value}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 px-6 py-4 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-sm hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all">
            <Send className="w-4 h-4" />{isEditing ? "Save Changes" : "Schedule Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}