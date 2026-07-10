"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Bell, Filter, Check, AlertCircle, Inbox, Plus, X, Clock, Calendar,
  Repeat, MapPin, ChevronRight, Trash2, Archive, Search,
  BellRing, Mail, ListChecks, Pencil, Loader2, Link2, CalendarRange,
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
type Timeframe = "week" | "month" | "all";

export interface RoutineReminder {
  routineId: number;
  emailId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoutineTask {
  routineId: number;
  taskId: number;
}

export interface Email {
  id: number;
  to: string;
  subject: string;
  body: string;
  scheduleTime: string;
  jobId: string | null;
  status: "pending" | "sent" | "failed";
  createdAt?: string;
  updatedAt?: string;
  RoutineReminder?: RoutineReminder;
}

export interface TaskTimeEntry {
  stated?: string;
  started?: string;
  ended?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime: string | null;
  time: TaskTimeEntry[] | string[];
  priority: TaskPriority;
  RoutineTask?: RoutineTask;
}

export interface Routine {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  category: string | null;
  priority: RoutinePriority;
  color: string | null;
  icon: string | null;
  repeatType: RepeatType;
  repeatConfig: {
    days?: number[];
    day?: number;
    interval?: number;
    unit?: CustomUnit;
  } | null;
  dateMode: DateMode;
  startDate: string;
  endDate: string | null;
  skipDates: string[];
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  estimatedMinutes: number | null;
  location: string | null;
  notes: string | null;
  tags: string[];
  status: RoutineStatus;
  createdAt: string;
  updatedAt: string;
  Emails: Email[];
  Tasks: Task[];
}

export interface GetRoutinesResponse {
  routines: Routine[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

/* ============================================================================
   Constants
   ============================================================================ */

const API_BASE = "http://localhost:5001/api/v1";

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
const PAGE_LIMIT = 10;

const todayISO = () => new Date().toISOString().slice(0, 10);
const colorCfg = (c: string | null) => ROUTINE_COLORS.find(x => x.value === c) || ROUTINE_COLORS[0];
const routinePriorityCfg = (p: RoutinePriority) => ROUTINE_PRIORITIES.find(x => x.value === p)!;
const taskPriorityCfg = (p: TaskPriority) => TASK_PRIORITIES.find(x => x.value === p) || TASK_PRIORITIES[1];
const taskStatusCfg = (s: TaskStatus) => TASK_STATUSES.find(x => x.value === s) || TASK_STATUSES[0];
const reminderStatusCfg = (s: ReminderStatus) => REMINDER_STATUSES.find(x => x.value === s) || REMINDER_STATUSES[0];

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
  const cfg = r.repeatConfig || {};
  if (r.repeatType === "once") return `One time • ${formatDateShort(r.startDate)}`;
  if (r.repeatType === "daily") return "Every day";
  if (r.repeatType === "weekly") return `Weekly • ${(cfg.days || []).map(d => DAY_LABELS[d]).join(" ") || "no days set"}`;
  if (r.repeatType === "monthly") return `Monthly • day ${cfg.day ?? "—"}`;
  if (r.repeatType === "yearly") return "Yearly";
  return `Every ${cfg.interval ?? 1} ${cfg.unit ?? "days"}`;
}

/* ============================================================================
   API layer
   ============================================================================ */

function authHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return { "Content-Type": "application/json", "auth-token": user?.token || "" };
}

async function apiRequest(path: string, method: string = "GET", body?: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

/* ---- GET /api/v1/routine ---- */
type GetRoutinesParams = {
  page?: number;
  limit?: number;
  skip?: number;
  priority?: RoutinePriority;
  status?: RoutineStatus;
  repeatType?: RepeatType;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export async function getRoutines(params: GetRoutinesParams = {}): Promise<GetRoutinesResponse> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? PAGE_LIMIT));
  query.set("skip", String(params.skip ?? 0));
  if (params.priority) query.set("priority", params.priority);
  if (params.status) query.set("status", params.status);
  if (params.repeatType) query.set("repeatType", params.repeatType);
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  return apiRequest(`/routine?${query.toString()}`, "GET");
}

/* ---- POST /api/v1/routine ---- */
export async function createRoutine(payload: Partial<Routine>) {
  return apiRequest("/routine", "POST", payload);
}

/* ---- POST /api/v1/routine/tasks — attach an existing task to a routine ---- */
export async function attachTaskToRoutine(routineId: number, taskId: number) {
  return apiRequest("/routine/tasks", "POST", { routineId, taskId });
}

/* ---- POST /api/v1/routine/reminders — attach an existing email/reminder to a routine ---- */
export async function attachReminderToRoutine(routineId: number, emailId: number) {
  return apiRequest("/routine/reminders", "POST", { routineId, emailId });
}

/* ---- GET /api/v1/email/getall — used by the "select a reminder" picker ---- */
type GetEmailsParams = { limit?: number; skip?: number; status?: "pending" | "sent" };

export async function getEmails(params: GetEmailsParams = {}): Promise<{ emails: Email[]; total?: number; hasMore?: boolean }> {
  const query = new URLSearchParams();
  query.set("limit", String(params.limit ?? PAGE_LIMIT));
  query.set("skip", String(params.skip ?? 0));
  if (params.status) query.set("status", params.status);
  const data = await apiRequest(`/email/getall?${query.toString()}`, "GET");
  // Response shape isn't fully specified beyond EmailListResponse, so read defensively.
  const emails: Email[] = data?.emails || data?.data || data?.results || [];
  return { emails, total: data?.total, hasMore: data?.hasMore };
}

/* ---- GET /api/v1/task/timeframe/{timeframe} — used by the "select a task" picker ---- */
type GetTasksByTimeframeParams = { limit?: number; page?: number; startDate?: string; endDate?: string };

export async function getTasksByTimeframe(timeframe: Timeframe, params: GetTasksByTimeframeParams = {}): Promise<{ tasks: Task[]; total?: number; hasMore?: boolean }> {
  const query = new URLSearchParams();
  query.set("limit", String(params.limit ?? PAGE_LIMIT));
  query.set("page", String(params.page ?? 1));
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  const data = await apiRequest(`/task/timeframe/${timeframe}?${query.toString()}`, "GET");
  const tasks: Task[] = data?.tasks || data?.data || data?.results || [];
  return { tasks, total: data?.total, hasMore: data?.hasMore };
}

/* ============================================================================
   Dummy APIs — no endpoint exists yet for these actions in the shared spec.
   Swap these out once the backend adds real routes; UI code already calls
   them by name so only the internals below need to change.
   ============================================================================ */

async function dummyUpdateRoutine(id: number, payload: Partial<Routine>) {
  await new Promise(r => setTimeout(r, 350));
  return { routine: { ...payload, id } };
}
async function dummyDeleteRoutine(id: number) {
  await new Promise(r => setTimeout(r, 250));
  return { success: true };
}
async function dummyArchiveRoutine(id: number) {
  await new Promise(r => setTimeout(r, 250));
  return { success: true };
}
async function dummyDetachTask(routineId: number, taskId: number) {
  await new Promise(r => setTimeout(r, 250));
  return { success: true };
}
async function dummyDetachReminder(routineId: number, emailId: number) {
  await new Promise(r => setTimeout(r, 250));
  return { success: true };
}
async function dummyUpdateTaskStatus(taskId: number, status: TaskStatus) {
  await new Promise(r => setTimeout(r, 200));
  return { success: true };
}

/* ============================================================================
   Small helpers
   ============================================================================ */

const uid = () => Math.floor(Math.random() * 1_000_000_000);

/** Attaches an infinite-scroll listener to a scrollable container. */
function useInfiniteScroll(containerRef: React.RefObject<HTMLDivElement>, onLoadMore: () => void, hasMore: boolean, loading: boolean) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      if (loading || !hasMore) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 96) onLoadMore();
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [containerRef, onLoadMore, hasMore, loading]);
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
  /* ---------- routines list (infinite scroll) ---------- */
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routinesSkip, setRoutinesSkip] = useState(0);
  const [routinesHasMore, setRoutinesHasMore] = useState(true);
  const [routinesLoading, setRoutinesLoading] = useState(false);
  const [routinesError, setRoutinesError] = useState("");
  const routineListRef = useRef<HTMLDivElement>(null);

  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" | "info" }[]>([]);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState<RoutinePriority | "">("");
  const [filterStatus, setFilterStatus] = useState<RoutineStatus | "">("active");

  const [taskPickerFor, setTaskPickerFor] = useState<number | null>(null);
  const [reminderPickerFor, setReminderPickerFor] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ---------------- fetch routines (resets on filter change, appends on scroll) ---------------- */
  const fetchRoutines = useCallback(async (reset: boolean) => {
    try {
      setRoutinesLoading(true);
      setRoutinesError("");
      const currentSkip = reset ? 0 : routinesSkip;
      const data = await getRoutines({
        limit: PAGE_LIMIT,
        skip: currentSkip,
        search: search || undefined,
        category: filterCategory || undefined,
        priority: (filterPriority as RoutinePriority) || undefined,
        status: (filterStatus as RoutineStatus) || undefined,
      });
      const fetched = data?.routines || [];
      setRoutines(prev => (reset ? fetched : [...prev, ...fetched]));
      setRoutinesSkip(currentSkip + fetched.length);
      setRoutinesHasMore(!!data?.hasMore);
    } catch (error: any) {
      setRoutinesError(error?.message || "Failed to fetch routines");
      showToast(error?.message || "Failed to fetch routines", "error");
    } finally {
      setRoutinesLoading(false);
    }
  }, [routinesSkip, search, filterCategory, filterPriority, filterStatus]);

  // Reset + refetch whenever filters change
  useEffect(() => {
    fetchRoutines(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterCategory, filterPriority, filterStatus]);

  useInfiniteScroll(routineListRef, () => fetchRoutines(false), routinesHasMore, routinesLoading);

  /* ---------------- stats (based on currently loaded routines) ---------------- */
  const stats = useMemo(() => {
    const active = routines.filter(r => r.status === "active");
    const allTasks = routines.flatMap(r => r.Tasks || []);
    const doneTasks = allTasks.filter(t => t.status === "done");
    const pendingReminders = routines.flatMap(r => r.Emails || []).filter(e => e.status === "pending");
    return { active: active.length, totalTasks: allTasks.length, doneTasks: doneTasks.length, pendingReminders: pendingReminders.length };
  }, [routines]);

  /* ---------------- routine create/edit ---------------- */
  const emptyRoutineDraft = (): Partial<Routine> => ({
    title: "", description: "", category: "Study", priority: "medium", color: "Blue", icon: "📚",
    repeatType: "daily", repeatConfig: { days: [1, 2, 3, 4, 5] },
    dateMode: "forever", startDate: todayISO(), endDate: null, skipDates: [],
    allDay: false, startTime: "09:00", endTime: "10:00", estimatedMinutes: 60,
    location: "", notes: "", tags: [], status: "active",
  });
  const [routineDraft, setRoutineDraft] = useState<Partial<Routine>>(emptyRoutineDraft());

  const openNewRoutineForm = () => { setEditingRoutineId(null); setRoutineDraft(emptyRoutineDraft()); setShowRoutineForm(true); };
  const openEditRoutineForm = (r: Routine) => { setEditingRoutineId(r.id); setRoutineDraft({ ...r }); setShowRoutineForm(true); };

  const saveRoutine = async () => {
    if (!routineDraft.title?.trim()) { showToast("Title is required", "error"); return; }
    setSaving(true);
    try {
      if (editingRoutineId) {
        // No PUT /routine/:id in the current spec — dummy call until backend adds it.
        await dummyUpdateRoutine(editingRoutineId, routineDraft);
        setRoutines(prev => prev.map(r => (r.id === editingRoutineId ? { ...r, ...routineDraft } as Routine : r)));
        showToast("Routine updated", "success");
      } else {
        const data = await createRoutine(routineDraft);
        const created: Routine = { ...(data?.routine || data?.data || data), Tasks: [], Emails: [] } as Routine;
        setRoutines(prev => [created, ...prev]);
        showToast("Routine created — add tasks & reminders below", "success");
        // Jump straight into the new routine so the user can attach existing tasks/reminders.
        setExpandedId(created.id);
      }
      setShowRoutineForm(false);
    } catch (error: any) {
      showToast(error?.message || "Something went wrong saving the routine", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoutine = async (id: number) => {
    try {
      await dummyDeleteRoutine(id); // no DELETE /routine/:id in the spec yet
      setRoutines(prev => prev.filter(r => r.id !== id));
      showToast("Routine deleted", "info");
    } catch {
      showToast("Failed to delete routine", "error");
    }
  };
  const archiveRoutine = async (id: number) => {
    try {
      await dummyArchiveRoutine(id); // no archive endpoint in the spec yet
      setRoutines(prev => prev.map(r => (r.id === id ? { ...r, status: "archived" } : r)));
      showToast("Routine archived", "info");
    } catch {
      showToast("Failed to archive routine", "error");
    }
  };

  /* ---------------- attach existing task / reminder to a routine ---------------- */
  const handleAttachTask = async (routineId: number, task: Task) => {
    try {
      await attachTaskToRoutine(routineId, task.id);
      setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, Tasks: [...(r.Tasks || []), task] } : r)));
      showToast("Task attached to routine", "success");
    } catch (error: any) {
      showToast(error?.message || "Failed to attach task", "error");
    } finally {
      setTaskPickerFor(null);
    }
  };
  const handleAttachReminder = async (routineId: number, email: Email) => {
    try {
      await attachReminderToRoutine(routineId, email.id);
      setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, Emails: [...(r.Emails || []), email] } : r)));
      showToast("Reminder attached to routine", "success");
    } catch (error: any) {
      showToast(error?.message || "Failed to attach reminder", "error");
    } finally {
      setReminderPickerFor(null);
    }
  };
  const handleDetachTask = async (routineId: number, taskId: number) => {
    try {
      await dummyDetachTask(routineId, taskId); // no DELETE /routine/tasks in the spec yet
      setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, Tasks: r.Tasks.filter(t => t.id !== taskId) } : r)));
      showToast("Task removed from routine", "info");
    } catch {
      showToast("Failed to remove task", "error");
    }
  };
  const handleDetachReminder = async (routineId: number, emailId: number) => {
    try {
      await dummyDetachReminder(routineId, emailId); // no DELETE /routine/reminders in the spec yet
      setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, Emails: r.Emails.filter(e => e.id !== emailId) } : r)));
      showToast("Reminder removed from routine", "info");
    } catch {
      showToast("Failed to remove reminder", "error");
    }
  };
  const cycleTaskStatus = async (routineId: number, task: Task) => {
    const order: TaskStatus[] = ["pending", "to do", "in progress", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    try {
      await dummyUpdateTaskStatus(task.id, next); // no PATCH /task/:id status endpoint in the spec yet
      setRoutines(prev => prev.map(r => {
        if (r.id !== routineId) return r;
        return { ...r, Tasks: r.Tasks.map(t => (t.id === task.id ? { ...t, status: next } : t)) };
      }));
    } catch {
      showToast("Failed to update task status", "error");
    }
  };

  const activeRoutines = routines.filter(r => r.status !== "archived" || filterStatus === "archived");

  return (
    <>
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
                  <p className="text-xs text-slate-500">Attach existing tasks &amp; reminders to each routine</p>
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
            <StatCard label="Active Routines (loaded)" value={stats.active} icon={<Repeat className="w-4 h-4" />} />
            <StatCard label="Total Tasks (loaded)" value={stats.totalTasks} icon={<ListChecks className="w-4 h-4" />} />
            <StatCard label="Tasks Done (loaded)" value={stats.doneTasks} icon={<Check className="w-4 h-4" />} />
            <StatCard label="Pending Reminders (loaded)" value={stats.pendingReminders} icon={<BellRing className="w-4 h-4" />} />
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
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as RoutinePriority | "")} className="w-full mt-1 mb-3 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option value="">All Priorities</option>
                  {ROUTINE_PRIORITIES.map(p => <option key={p.value} value={p.value} className="capitalize">{p.value}</option>)}
                </select>
                <label className="text-xs font-medium text-slate-500">Status</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as RoutineStatus | "")} className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                  <option value="">All Statuses</option>
                </select>
                {(filterCategory || filterPriority || search || filterStatus !== "active") && (
                  <button onClick={() => { setFilterCategory(""); setFilterPriority(""); setSearch(""); setFilterStatus("active"); }} className="w-full mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Routine list — infinite scroll */}
            <div className="lg:col-span-2">
              <div ref={routineListRef} className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {activeRoutines.length === 0 && !routinesLoading ? (
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
                  activeRoutines.map(routine => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      expanded={expandedId === routine.id}
                      onToggleExpand={() => setExpandedId(expandedId === routine.id ? null : routine.id)}
                      onEdit={() => openEditRoutineForm(routine)}
                      onArchive={() => archiveRoutine(routine.id)}
                      onDelete={() => deleteRoutine(routine.id)}
                      onOpenTaskPicker={() => setTaskPickerFor(routine.id)}
                      onOpenReminderPicker={() => setReminderPickerFor(routine.id)}
                      onDetachTask={(taskId) => handleDetachTask(routine.id, taskId)}
                      onDetachReminder={(emailId) => handleDetachReminder(routine.id, emailId)}
                      onCycleTaskStatus={(task) => cycleTaskStatus(routine.id, task)}
                    />
                  ))
                )}

                {routinesLoading && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading routines…
                  </div>
                )}
                {!routinesHasMore && activeRoutines.length > 0 && (
                  <p className="text-center text-xs text-slate-400 py-2">You&apos;ve reached the end of the list.</p>
                )}
                {routinesError && (
                  <p className="text-center text-xs text-red-500 py-2">{routinesError}</p>
                )}
              </div>
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

        {taskPickerFor !== null && (
          <SelectTaskModal
            excludeIds={(routines.find(r => r.id === taskPickerFor)?.Tasks || []).map(t => t.id)}
            onClose={() => setTaskPickerFor(null)}
            onSelect={(task) => handleAttachTask(taskPickerFor, task)}
          />
        )}

        {reminderPickerFor !== null && (
          <SelectReminderModal
            excludeIds={(routines.find(r => r.id === reminderPickerFor)?.Emails || []).map(e => e.id)}
            onClose={() => setReminderPickerFor(null)}
            onSelect={(email) => handleAttachReminder(reminderPickerFor, email)}
          />
        )}
      </div>
    </>
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
  onOpenTaskPicker, onOpenReminderPicker, onDetachTask, onDetachReminder, onCycleTaskStatus,
}: {
  routine: Routine;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onOpenTaskPicker: () => void;
  onOpenReminderPicker: () => void;
  onDetachTask: (taskId: number) => void;
  onDetachReminder: (emailId: number) => void;
  onCycleTaskStatus: (task: Task) => void;
}) {
  const color = colorCfg(routine.color);
  const priority = routinePriorityCfg(routine.priority);
  const tasks = routine.Tasks || [];
  const emails = routine.Emails || [];
  const doneCount = tasks.filter(t => t.status === "done").length;
  const progressPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

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
              {routine.category && <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md ${color.soft} ${color.text}`}>{routine.category}</span>}
              {(routine.tags || []).map(tag => <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600">{tag}</span>)}
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                <ListChecks className="w-3 h-3" />{tasks.length} tasks
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                <Mail className="w-3 h-3" />{emails.length} reminders
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
              <button onClick={(e) => { e.stopPropagation(); onOpenTaskPicker(); }} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Link2 className="w-3.5 h-3.5" />Attach Task
              </button>
            </div>
            <div className="space-y-1.5">
              {tasks.length === 0 && <p className="text-sm text-slate-400 italic">No tasks attached yet.</p>}
              {tasks.map(task => {
                const tp = taskPriorityCfg(task.priority);
                const ts = taskStatusCfg(task.status);
                return (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2 rounded-sm border border-slate-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); onCycleTaskStatus(task); }}
                      className={`flex-shrink-0 px-2 py-1 text-[11px] font-medium rounded-md capitalize ${ts.bg} ${ts.text} hover:opacity-75`}
                      title="Click to advance status"
                    >
                      {task.status}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-slate-400" : "text-slate-700"}`}>{task.title}</p>
                      {Array.isArray(task.time) && task.time.length === 2 && typeof task.time[0] === "string" && (
                        <p className="text-xs text-slate-400">{formatTime12(task.time[0] as string)} – {formatTime12(task.time[1] as string)}</p>
                      )}
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${tp.bg} ${tp.text}`}>{task.priority}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDetachTask(task.id); }} className="p-1 text-slate-400 hover:text-red-600" title="Remove from routine"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <button onClick={(e) => { e.stopPropagation(); onOpenReminderPicker(); }} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Link2 className="w-3.5 h-3.5" />Attach Reminder
              </button>
            </div>
            <div className="space-y-1.5">
              {emails.length === 0 && <p className="text-sm text-slate-400 italic">No reminders attached yet.</p>}
              {emails.map(email => {
                const rs = reminderStatusCfg(email.status);
                return (
                  <div key={email.id} className="flex items-center gap-3 px-3 py-2 rounded-sm border border-slate-200">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{email.subject}</p>
                      <p className="text-xs text-slate-400 truncate">to {email.to} • {new Date(email.scheduleTime).toLocaleString()}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${rs.bg} ${rs.text}`}>{email.status}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDetachReminder(email.id); }} className="p-1 text-slate-400 hover:text-red-600" title="Remove from routine"><Trash2 className="w-3.5 h-3.5" /></button>
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
   Routine form modal — create/edit routine fields only.
   Tasks & reminders are attached afterwards via the select pickers.
   ============================================================================ */

function RoutineFormModal({
  draft, setDraft, isEditing, saving, onCancel, onSave,
}: {
  draft: Partial<Routine>; setDraft: (updater: (prev: Partial<Routine>) => Partial<Routine>) => void;
  isEditing: boolean; saving: boolean; onCancel: () => void; onSave: () => void;
}) {
  const set = (patch: Partial<Routine>) => setDraft((prev) => ({ ...prev, ...patch }));
  const cfg = draft.repeatConfig || {};

  const handleRepeatTypeChange = (rt: RepeatType) => {
    let repeatConfig: Routine["repeatConfig"] = null;
    if (rt === "weekly") repeatConfig = { days: [1, 2, 3, 4, 5] };
    if (rt === "monthly") repeatConfig = { day: 1 };
    if (rt === "custom") repeatConfig = { interval: 1, unit: "days" };
    set({ repeatType: rt, repeatConfig });
  };
  const toggleWeekday = (day: number) => {
    const days = cfg.days || [];
    const nextDays = days.includes(day) ? days.filter(d => d !== day) : [...days, day].sort();
    set({ repeatConfig: { ...cfg, days: nextDays } });
  };

  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    const val = tagInput.trim().replace(/^#*/, "#");
    if (val.length > 1 && !(draft.tags || []).includes(val)) set({ tags: [...(draft.tags || []), val] });
    setTagInput("");
  };
  const removeTag = (t: string) => set({ tags: (draft.tags || []).filter(x => x !== t) });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Routine" : "New Routine"}</h2>
          <button onClick={onCancel} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>

        {!isEditing && (
          <div className="mx-6 mt-4 flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-sm text-xs text-blue-700">
            <Link2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>You&apos;ll attach existing tasks and reminders to this routine right after creating it.</span>
          </div>
        )}

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500">Title</label>
            <input value={draft.title || ""} onChange={e => set({ title: e.target.value })} placeholder="e.g. Morning Study Block"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Description</label>
            <input value={draft.description || ""} onChange={e => set({ description: e.target.value })} placeholder="Optional short description"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Category</label>
              <select value={draft.category || "Study"} onChange={e => set({ category: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Priority</label>
              <select value={draft.priority || "medium"} onChange={e => set({ priority: e.target.value as RoutinePriority })}
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
                <button key={rt} onClick={() => handleRepeatTypeChange(rt)}
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
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-colors ${(cfg.days || []).includes(idx) ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {draft.repeatType === "monthly" && (
            <div>
              <label className="text-xs font-semibold text-slate-500">Day of month</label>
              <input type="number" min={1} max={31} value={cfg.day ?? 1} onChange={e => set({ repeatConfig: { ...cfg, day: Number(e.target.value) } })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          )}

          {draft.repeatType === "custom" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Every</span>
              <input type="number" min={1} value={cfg.interval ?? 1} onChange={e => set({ repeatConfig: { ...cfg, interval: Number(e.target.value) } })}
                className="w-20 px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <select value={cfg.unit ?? "days"} onChange={e => set({ repeatConfig: { ...cfg, unit: e.target.value as CustomUnit } })}
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
                  <button key={val} onClick={() => set({ dateMode: val as DateMode })}
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
              <input type="date" value={draft.startDate || todayISO()} onChange={e => set({ startDate: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            {draft.repeatType !== "once" && draft.dateMode === "range" && (
              <div>
                <label className="text-xs font-semibold text-slate-500">End Date</label>
                <input type="date" value={draft.endDate || ""} onChange={e => set({ endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2 cursor-pointer">
              <input type="checkbox" checked={!!draft.allDay} onChange={e => set({ allDay: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
              All Day
            </label>
            {!draft.allDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Start Time</label>
                  <input type="time" value={draft.startTime || "09:00"} onChange={e => set({ startTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">End Time</label>
                  <input type="time" value={draft.endTime || "10:00"} onChange={e => set({ endTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Location</label>
            <input value={draft.location || ""} onChange={e => set({ location: e.target.value })} placeholder="e.g. Home, Office, Google Meet"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Tags</label>
            <div className="flex gap-2 mt-1">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type a tag and press Enter" className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <button onClick={addTag} className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-sm hover:bg-slate-200">Add</button>
            </div>
            {(draft.tags?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(draft.tags || []).map((t) => (
                  <span key={t} className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                    {t}<button onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">Notes</label>
            <textarea value={draft.notes || ""} onChange={e => set({ notes: e.target.value })} rows={3} placeholder="Anything you'd like to remember..."
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
   Select Task modal — GET /api/v1/task/timeframe/{timeframe}, infinite scroll
   ============================================================================ */

function SelectTaskModal({ onClose, onSelect, excludeIds }: {
  onClose: () => void; onSelect: (task: Task) => void; excludeIds: number[];
}) {
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const fetchTasks = useCallback(async (reset: boolean) => {
    try {
      setLoading(true);
      setError("");
      const targetPage = reset ? 1 : page + 1;
      const data = await getTasksByTimeframe(timeframe, {
        limit: PAGE_LIMIT,
        page: targetPage,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTasks(prev => (reset ? data.tasks : [...prev, ...data.tasks]));
      setPage(targetPage);
      setHasMore(data.hasMore ?? data.tasks.length === PAGE_LIMIT);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [timeframe, startDate, endDate, page]);

  useEffect(() => { fetchTasks(true); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [timeframe, startDate, endDate]);
  useInfiniteScroll(listRef, () => fetchTasks(false), hasMore, loading);

  const visibleTasks = useMemo(() => {
    return tasks.filter(t => {
      if (excludeIds.includes(t.id)) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, excludeIds, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-600" />Attach a Task</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter loaded tasks by title..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="flex items-center gap-1.5">
            {(["week", "month", "all"] as Timeframe[]).map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize transition-colors ${timeframe === tf ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {tf === "all" ? "All time" : `This ${tf}`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1"><CalendarRange className="w-3 h-3" />From</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 px-2 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1"><CalendarRange className="w-3 h-3" />To</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full mt-1 px-2 py-1.5 text-xs border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-3 space-y-1.5">
          {visibleTasks.length === 0 && !loading && (
            <p className="text-sm text-slate-400 italic text-center py-6">No tasks found for these filters.</p>
          )}
          {visibleTasks.map(task => {
            const tp = taskPriorityCfg(task.priority);
            const ts = taskStatusCfg(task.status);
            return (
              <button key={task.id} onClick={() => onSelect(task)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                  {task.description && <p className="text-xs text-slate-400 truncate">{task.description}</p>}
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${ts.bg} ${ts.text}`}>{task.status}</span>
                <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${tp.bg} ${tp.text}`}>{task.priority}</span>
              </button>
            );
          })}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading tasks…
            </div>
          )}
          {!hasMore && tasks.length > 0 && <p className="text-center text-xs text-slate-400 py-2">No more tasks.</p>}
          {error && <p className="text-center text-xs text-red-500 py-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Select Reminder modal — GET /api/v1/email/getall, infinite scroll
   ============================================================================ */

function SelectReminderModal({ onClose, onSelect, excludeIds }: {
  onClose: () => void; onSelect: (email: Email) => void; excludeIds: number[];
}) {
  const [status, setStatus] = useState<"" | "pending" | "sent">("pending");
  const [search, setSearch] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const fetchEmails = useCallback(async (reset: boolean) => {
    try {
      setLoading(true);
      setError("");
      const currentSkip = reset ? 0 : skip;
      const data = await getEmails({ limit: PAGE_LIMIT, skip: currentSkip, status: status || undefined });
      setEmails(prev => (reset ? data.emails : [...prev, ...data.emails]));
      setSkip(currentSkip + data.emails.length);
      setHasMore(data.hasMore ?? data.emails.length === PAGE_LIMIT);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  }, [status, skip]);

  useEffect(() => { fetchEmails(true); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [status]);
  useInfiniteScroll(listRef, () => fetchEmails(false), hasMore, loading);

  const visibleEmails = useMemo(() => {
    return emails.filter(e => {
      if (excludeIds.includes(e.id)) return false;
      if (search && !e.subject.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [emails, excludeIds, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-sm rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BellRing className="w-5 h-5 text-blue-600" />Attach a Reminder</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter loaded reminders by subject..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="flex items-center gap-1.5">
            {([["pending", "Pending"], ["sent", "Sent"], ["", "All"]] as [ "" | "pending" | "sent", string][]).map(([val, lbl]) => (
              <button key={lbl} onClick={() => setStatus(val)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${status === val ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-3 space-y-1.5">
          {visibleEmails.length === 0 && !loading && (
            <p className="text-sm text-slate-400 italic text-center py-6">No reminders found for these filters.</p>
          )}
          {visibleEmails.map(email => {
            const rs = reminderStatusCfg(email.status);
            return (
              <button key={email.id} onClick={() => onSelect(email)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{email.subject}</p>
                  <p className="text-xs text-slate-400 truncate">to {email.to} • {new Date(email.scheduleTime).toLocaleString()}</p>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md capitalize ${rs.bg} ${rs.text}`}>{email.status}</span>
              </button>
            );
          })}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading reminders…
            </div>
          )}
          {!hasMore && emails.length > 0 && <p className="text-center text-xs text-slate-400 py-2">No more reminders.</p>}
          {error && <p className="text-center text-xs text-red-500 py-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}