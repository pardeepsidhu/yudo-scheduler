import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Loader,
  AlertCircle
} from 'lucide-react';
import { getTaskByTimeFrames } from '../../api/taskApi';

interface TimeEntry {
  stated: string;
  ended: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'to do' | 'in progress' | 'done';
  priority: 'high' | 'normal' | 'low';
  time?: TimeEntry[];
}

interface TaskWithTime extends Task {
  timeEntry: {
    started: string;
    ended: string;
    minutes: number;
  };
}

interface Stats {
  total: number;
  pending: number;
  todo: number;
  inProgress: number;
  done: number;
}

interface TasksData {
  tasks: Task[];
  stats: Stats;
}

interface DailyTasks {
  [key: string]: TaskWithTime[];
}

interface DailyTotals {
  [key: string]: number;
}

const ProfessionalTimesheet = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<TasksData>({
    tasks: [],
    stats: { total: 0, pending: 0, todo: 0, inProgress: 0, done: 0 }
  });
  const [dailyTasks, setDailyTasks] = useState<DailyTasks>({});
  const [dailyTotals, setDailyTotals] = useState<DailyTotals>({});
  const [totalTime, setTotalTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);

  function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  }

  function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;
  }

  function calculateTimeDifference(start: string, end: string): number {
    if (!start || !end) return 0;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.round((endTime - startTime) / (1000 * 60));
  }

  function getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  const calculateDatePeriod = (baseDate: Date, periodType: 'week' | 'month' | 'all') => {
    const date = new Date(baseDate);
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (periodType === 'week') {
      const day = date.getDay();
      startDate = new Date(date);
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (periodType === 'month') {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    // For 'all', both dates remain null

    return { startDate, endDate };
  };

  const processTaskData = (tasks: Task[], activeTimeframe: 'week' | 'month' | 'all') => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setDailyTasks({});
      setDailyTotals({});
      setTotalTime(0);
      return;
    }

    const dailyTasksMap: DailyTasks = {};
    const dailyTotalsMap: DailyTotals = {};
    let totalMinutes = 0;

    // For 'all' timeframe, we don't initialize a specific range
    if (activeTimeframe !== 'all') {
      const daysInRange = activeTimeframe === 'week' ? 7 :
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

      const periodStart = activeTimeframe === 'week' ?
        getStartOfWeek(currentDate) :
        getStartOfMonth(currentDate);

      for (let i = 0; i < daysInRange; i++) {
        const day = new Date(periodStart);
        day.setDate(day.getDate() + i);
        const dateKey = day.toISOString().split('T')[0];
        dailyTasksMap[dateKey] = [];
        dailyTotalsMap[dateKey] = 0;
      }
    }

    tasks.forEach(task => {
      if (!task.time || !Array.isArray(task.time)) return;

      task.time.forEach(timeEntry => {
        if (!timeEntry.stated || !timeEntry.ended) return;

        const startDate = new Date(timeEntry.stated);
        const dateKey = startDate.toISOString().split('T')[0];

        // For 'all' timeframe, add all tasks without date filtering
        if (activeTimeframe === 'all' || dailyTasksMap[dateKey] !== undefined) {
          // Initialize the day if it doesn't exist (for 'all' timeframe)
          if (!dailyTasksMap[dateKey]) {
            dailyTasksMap[dateKey] = [];
            dailyTotalsMap[dateKey] = 0;
          }

          const minutes = calculateTimeDifference(timeEntry.stated, timeEntry.ended);

          dailyTasksMap[dateKey].push({
            ...task,
            timeEntry: {
              started: timeEntry.stated,
              ended: timeEntry.ended,
              minutes: minutes
            }
          });

          dailyTotalsMap[dateKey] += minutes;
          totalMinutes += minutes;
        }
      });
    });

    setDailyTasks(dailyTasksMap);
    setDailyTotals(dailyTotalsMap);
    setTotalTime(totalMinutes);
  };

  const fetchTasksByTimeframe = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      let options: any = {
        page: page,
        limit: 20
      };

      // Use custom dates if provided
      if (customStartDate && customEndDate) {
        options.startDate = new Date(customStartDate);
        options.endDate = new Date(customEndDate);
        setStartDate(options.startDate);
        setEndDate(options.endDate);
      } else if (timeframe !== 'all') {
        // Calculate dates based on timeframe
        const { startDate: start, endDate: end } = calculateDatePeriod(currentDate, timeframe);
        if (start && end) {
          options.startDate = start;
          options.endDate = end;
          setStartDate(start);
          setEndDate(end);
        }
      } else {
        // For 'all' timeframe with no custom dates
        setStartDate(null);
        setEndDate(null);
      }

      const data = await getTaskByTimeFrames(timeframe, options);

      if (data.error || !data.success) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      setTasksData({
        tasks: data.tasks || [],
        stats: data.stats || { total: 0, pending: 0, todo: 0, inProgress: 0, done: 0 }
      });

      // Set pagination info
      if (data.pagination) {
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setHasMorePages(data.pagination.hasMore);
      }

      processTaskData(data.tasks || [], timeframe);
    } catch (err) {
      console.error(`Error fetching ${timeframe} tasks:`, err);
      setError(`Failed to load timesheet data. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'all') => {
    setTimeframe(newTimeframe);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const handleCustomDateSearch = () => {
    if (customStartDate && customEndDate) {
      setCurrentPage(1);
      fetchTasksByTimeframe(1);
    }
  };



  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTasksByTimeframe(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportToCSV = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 🧠 Step 1: Build options exactly like fetchTasksByTimeframe
      let options: any = { page: 1, limit: 20 };

      if (customStartDate && customEndDate) {
        options.startDate = new Date(customStartDate);
        options.endDate = new Date(customEndDate);
        setStartDate(options.startDate);
        setEndDate(options.endDate);
      } else if (timeframe !== 'all') {
        const { startDate: start, endDate: end } = calculateDatePeriod(currentDate, timeframe);
        if (start && end) {
          options.startDate = start;
          options.endDate = end;
          setStartDate(start);
          setEndDate(end);
        }
      } else {
        setStartDate(null);
        setEndDate(null);
      }

      // 🧩 Step 2: Initial fetch (to get total tasks)
      const firstFetch = await getTaskByTimeFrames(timeframe, options);

      if (!firstFetch?.success) {
        throw new Error(firstFetch.error || 'Failed to fetch task summary.');
      }

      const totalTasks = firstFetch?.stats?.total || 0;
      if (totalTasks === 0) {
        alert('No tasks found to export.');
        return;
      }

      // 🧩 Step 3: Fetch all tasks
      const fullFetch = await getTaskByTimeFrames(timeframe, {
        ...options,
        page: 1,
        limit: totalTasks,
      });

      if (!fullFetch?.success || !fullFetch.tasks?.length) {
        alert('No tasks found to export.');
        return;
      }



      // 🧾 Step 4: Build CSV
      const headers = [
        'Date', 'Task Title', 'Description', 'Start Time', 'End Time', 'Duration', 'Status', 'Priority'
      ];
      let csvContent = headers.join(',') + '\n';

      Object.entries(dailyTasks).forEach(([dateStr, dayTasks]: any) => {
        dayTasks.forEach((task: any) => {
          const startTime = task.timeEntry?.started ? new Date(task.timeEntry.started) : null;
          const endTime = task.timeEntry?.ended ? new Date(task.timeEntry.ended) : null;

          const row = [
            dateStr || '',
            `"${(task.title || '').replace(/"/g, '""')}"`,
            `"${(task.description || '').replace(/"/g, '""')}"`,
            startTime ? formatTime(startTime) : '',
            endTime ? formatTime(endTime) : '',
            formatDuration(task.timeEntry?.minutes || 0),
            task.status || '',
            task.priority || ''
          ];

          csvContent += row.join(',') + '\n';
        });
      });

      // 🧩 Step 5: Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const safeTimeframe = timeframe || 'custom';
      const safeDate =
        startDate
          ? formatDate(startDate)
          : customStartDate
            ? formatDate(new Date(customStartDate))
            : new Date().toISOString().split('T')[0];

      link.href = url;
      link.download = `timesheet-${safeTimeframe}-${safeDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV Export Error:', err);
      setError('Failed to export CSV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const getPeriodRangeString = (): string => {
    if (customStartDate && customEndDate) {
      return `${formatDate(new Date(customStartDate))} - ${formatDate(new Date(customEndDate))}`;
    }

    if (!startDate || timeframe === 'all') return 'All Time';

    if (timeframe === 'week') {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
      return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchTasksByTimeframe(1);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTasksByTimeframe(1);
  }, [timeframe, currentDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg  overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-4">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Time Sheet</h1>
                  <p className="text-blue-100 text-sm">{getPeriodRangeString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-sm transition-all disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={exportToCSV}
                  disabled={isLoading || Object.values(dailyTasks).every(tasks => tasks.length === 0)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-sm hover:bg-blue-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-2 sm:p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              {/* Timeframe Toggle */}
              <div className="flex  gap-1 sm:gap-2 justify-between ">
                <div className="inline-flex bg-white rounded-sm p-1 border border-slate-200 shadow-sm">
                  <button
                    onClick={() => handleTimeframeChange('all')}
                    className={`px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-all ${timeframe === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleTimeframeChange('week')}
                    className={`px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-all ${timeframe === 'week'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => handleTimeframeChange('month')}
                    className={`px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-all ${timeframe === 'month'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    Month
                  </button>
                </div>

                {/* Navigation - Only show for week/month */}
                {timeframe !== 'all' && (
                  <div className="inline-flex items-center bg-white rounded-sm border border-slate-200 shadow-sm">
                    <button
                      onClick={goToPrevious}
                      className="px-1 sm:px-2 p-2 hover:bg-slate-50 transition-colors rounded-l-lg"
                      title="Previous period"
                    >
                      <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
                    </button>

                    <div className="px-0 mx-0  sm:px-4 py-2 border-x border-slate-200 min-w-[140px] sm:min-w-[200px] text-center">
                      <span className="text-xs sm:text-sm font-medium text-slate-700 mx-0">
                        {getPeriodRangeString()}
                      </span>
                    </div>

                    <button
                      onClick={goToNext}
                      className="px-1 sm:px-2 p-2 hover:bg-slate-50 transition-colors rounded-r-lg"
                      title="Next period"
                    >
                      <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Date Range */}
              <div className="flex flex-col sm:flex-row gap-none gap-0 gap-1 sm:gap-2 items-stretch sm:items-center">
                <div className="flex-1 sm:flex-initial">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start Date"
                  />
                </div>
                <div className="flex-1 sm:flex-initial">
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="End Date"
                  />
                </div>
                <button
                  onClick={handleCustomDateSearch}
                  disabled={!customStartDate || !customEndDate}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-2 sm:p-4 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">


              <div className="bg-white rounded-sm p-6 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-slate-700 text-sm font-semibold tracking-wide">
                    TASKS BY STATUS
                  </p>
                  <div className="h-[3px] w-10 bg-gradient-to-r from-blue-500 to-sky-400 rounded-sm" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* To Do */}
                  <div className="flex flex-col items-start justify-center p-4 rounded-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 shadow-inner">
                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                      To Do
                    </p>
                    <p className="text-3xl font-bold text-yellow-900 mt-1">
                      {tasksData.stats.todo}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-yellow-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-yellow-500 w-3/4 rounded-sm" />
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="flex flex-col items-start justify-center p-4 rounded-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-inner">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">
                      {tasksData.stats.inProgress}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-blue-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-blue-500 w-2/3 rounded-sm" />
                    </div>
                  </div>

                  {/* Pending */}
                  <div className="flex flex-col items-start justify-center p-4 rounded-sm bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-inner">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Pending
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {tasksData.stats.pending}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-slate-600 w-1/2 rounded-sm" />
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex flex-col items-start justify-center p-4 rounded-sm bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-inner">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-green-900 mt-1">
                      {tasksData.stats.done}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-green-200 rounded-sm overflow-hidden">
                      <div className="h-full bg-green-500 w-full rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm p-6 text-white shadow-lg flex flex-col gap-2">
                <div className="bg-white rounded-sm p-3 border border-slate-200 shadow-sm">
                  <p className="text-slate-600 text-sm font-semibold mb-2">COMPLETION RATE</p>
                  <p className="text-3xl font-bold text-slate-900 mb-3">
                    {tasksData.stats.total > 0
                      ? Math.round((tasksData.stats.done / tasksData.stats.total) * 100)
                      : 0}%
                  </p>
                  <div className="w-full bg-slate-200 rounded-sm h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-sm transition-all duration-500"
                      style={{
                        width: `${tasksData.stats.total > 0
                          ? Math.round((tasksData.stats.done / tasksData.stats.total) * 100)
                          : 0}%`
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">TOTAL TIME</p>
                    <p className="text-3xl font-bold">{formatDuration(totalTime)}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center">
                    <Clock className="w-7 h-7" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="p-2 sm:p-4">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <Loader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <span className="text-slate-600 font-medium">Loading timesheet data...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-sm flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(dailyTasks).map(([dateStr, tasks]) => {
                  if (tasks.length === 0) return null;

                  const date = new Date(dateStr);

                  return (
                    <div key={dateStr} className="border-b pb-1 sm:pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-1 sm:mb-2  px-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {getDayName(date)}, {formatDate(date)}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="font-medium">
                            {formatDuration(dailyTotals[dateStr] || 0)}
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Task
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                Time
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Status
                              </th>
                              <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Priority
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map((task, idx) => {
                              const startTime = new Date(task.timeEntry.started);
                              const endTime = new Date(task.timeEntry.ended);

                              return (
                                <tr key={`${task._id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex flex-col">
                                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                      <div className="text-xs text-gray-500 sm:hidden mt-1">
                                        {formatTime(startTime)} - {formatTime(endTime)}
                                      </div>
                                      <div className="flex gap-2 mt-1 md:hidden">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium
                                          ${task.status === 'done' ? 'bg-green-100 text-green-800' :
                                            task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                              task.status === 'to do' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                          {task.status}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium
                                          ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                              'bg-green-100 text-green-800'}`}>
                                          {task.priority}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 hidden sm:table-cell">
                                    {formatTime(startTime)} - {formatTime(endTime)}
                                  </td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900 font-medium">
                                    {formatDuration(task.timeEntry.minutes)}
                                  </td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium
                                      ${task.status === 'done' ? 'bg-green-100 text-green-800' :
                                        task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                          task.status === 'to do' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                      {task.status}
                                    </span>
                                  </td>
                                  <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium
                                      ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        task.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                          'bg-green-100 text-green-800'}`}>
                                      {task.priority}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {Object.values(dailyTasks).every(tasks => tasks.length === 0) && (
                  <div className="flex flex-col items-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-sm flex items-center justify-center mb-4">
                      <Calendar className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No time entries found</h3>
                    <p className="text-slate-500">There are no time entries recorded for this period.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-6 bg-white border-t border-slate-200 mt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasMorePages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-700">
                          Page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-sm shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = idx + 1;
                            } else if (currentPage <= 3) {
                              pageNum = idx + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + idx;
                            } else {
                              pageNum = currentPage - 2 + idx;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasMorePages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTimesheet;