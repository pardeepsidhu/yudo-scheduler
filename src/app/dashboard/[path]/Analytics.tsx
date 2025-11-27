import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, Download, RefreshCw, Loader2, Loader } from 'lucide-react';
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

interface Stats {
  total: number;
  pending: number;
  todo: number;
  inProgress: number;
  done: number;
}

const TimesheetAnalytics = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasksData, setTasksData] = useState<{ tasks: Task[]; stats: Stats }>({
    tasks: [],
    stats: { total: 0, pending: 0, todo: 0, inProgress: 0, done: 0 }
  });
  const [totalTime, setTotalTime] = useState(0);
  const [chartData, setChartData] = useState<any>({
    daily: [],
    hoursByCategory: [],
    priorityDistribution: []
  });

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
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
    
    return { startDate, endDate };
  };

  const processTaskData = (tasks: Task[]) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setTotalTime(0);
      setChartData({
        daily: [],
        hoursByCategory: [],
        priorityDistribution: []
      });
      return;
    }
    
    let totalMinutes = 0;
    const dailyMap: any = {};
    const categoryMap: any = {};
    const priorityMap: any = { high: 0, normal: 0, low: 0 };
    
    tasks.forEach(task => {
      if (!task.time || !Array.isArray(task.time)) return;
      
      task.time.forEach(timeEntry => {
        if (!timeEntry.stated || !timeEntry.ended) return;
        
        const minutes = calculateTimeDifference(timeEntry.stated, timeEntry.ended);
        totalMinutes += minutes;
        
        const date = new Date(timeEntry.stated);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { date: dateKey, hours: 0, tasks: 0 };
        }
        dailyMap[dateKey].hours += minutes / 60;
        dailyMap[dateKey].tasks += 1;
        
        const priority = task.priority || 'normal';
        if (!categoryMap[priority]) {
          categoryMap[priority] = 0;
        }
        categoryMap[priority] += minutes;
        priorityMap[priority]++;
      });
    });
    
    setTotalTime(totalMinutes);
    
    const dailyData = Object.values(dailyMap)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item: any) => ({
        ...item,
        day: getDayName(new Date(item.date)),
        hours: Math.round(item.hours * 10) / 10
      }));
    
    const hoursByCategory = Object.keys(categoryMap).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round((categoryMap[key] / 60) * 10) / 10
    }));
    
    setChartData({
      daily: dailyData,
      hoursByCategory,
      priorityDistribution: Object.keys(priorityMap).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: priorityMap[key]
      }))
    });
  };

  const fetchTasksByTimeframe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let options: any = {};
      
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
      
      const data = await getTaskByTimeFrames(timeframe, options);
      
      if (data.error || !data.success) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
      
      setTasksData({
        tasks: data.tasks || [],
        stats: data.stats || { total: 0, pending: 0, todo: 0, inProgress: 0, done: 0 }
      });
      processTaskData(data.tasks || []);
    } catch (err) {
      console.error(`Error fetching ${timeframe} tasks:`, err);
      setError(`Failed to load analytics data. Please try again.`);
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
      fetchTasksByTimeframe();
    }
  };

  const getPeriodRangeString = (): string => {
    if (customStartDate && customEndDate) {
      return `${formatDate(new Date(customStartDate))} - ${formatDate(new Date(customEndDate))}`;
    }
    if (!startDate || timeframe === 'all') return 'All Time';
    if (timeframe === 'week') {
      const end = new Date(startDate);
      end.setDate(end.getDate() + 6);
      return `${formatDate(startDate)} - ${formatDate(end)}`;
    }
    return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Task', 'Duration', 'Status', 'Priority'];
    let csvContent = headers.join(',') + '\n';
    
    tasksData.tasks.forEach(task => {
      if (task.time && task.time.length > 0) {
        task.time.forEach(entry => {
          const duration = calculateTimeDifference(entry.stated, entry.ended);
          const row = [
            new Date(entry.stated).toLocaleDateString(),
            `"${task.title.replace(/"/g, '""')}"`,
            formatDuration(duration),
            task.status,
            task.priority
          ];
          csvContent += row.join(',') + '\n';
        });
      }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${timeframe}-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const STATUS_COLORS = {
    'to do': '#3b82f6',
    'in progress': '#f97316',
    'done': '#22c55e',
    'pending': '#a855f7'
  };

  useEffect(() => {
    fetchTasksByTimeframe();
  }, [timeframe, currentDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 pt-0  ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-sm overflow-hidden border border-slate-200 mb-2 ">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 ">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Analytics</h1>
                  <p className="text-xs sm:text-sm text-blue-100">{getPeriodRangeString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchTasksByTimeframe}
                  disabled={isLoading}
                  className="p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-sm transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 rounded-sm hover:bg-blue-50 transition-all font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-2 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col gap-4">
              <div className="flex  items-center gap-1 sm:gap-2">
                <div className="inline-flex bg-white rounded-sm p-1 border border-slate-200 shadow-sm">
                  {(['all', 'week', 'month'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => handleTimeframeChange(tf)}
                      className={`px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-all ${
                        timeframe === tf
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                  ))}
                </div>
                
                {timeframe !== 'all' && (
                  <div className="inline-flex items-center bg-white rounded-sm border border-slate-200 shadow-sm">
                    <button
                      onClick={goToPrevious}
                      className="px-1 sm:p-2 hover:bg-slate-50 transition-colors rounded-l-lg"
                    >
                      <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
                    </button>
                    <div className="px-1  sm:px-4 py-2 border-x border-slate-200 min-w-[120px] sm:min-w-[180px] text-center">
                      <span className="text-xs sm:text-sm font-medium text-slate-700">
                        {getPeriodRangeString()}
                      </span>
                    </div>
                    <button
                      onClick={goToNext}
                      className="px-1 sm:p-2 hover:bg-slate-50 transition-colors rounded-r-lg"
                    >
                      <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-slate-600" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-row gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 px-1 sm:px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 px-1 sm:px-3 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 sm:p-4 rounded-sm mb-6 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
                <Loader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <span className="text-slate-600 font-medium">Loading Analytics...</span>
              </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1  mb-2 px-2 ">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm sm:rounded-sm p-4 sm:p-6 text-white shadow-lg">
                <h3 className="text-xs sm:text-sm font-medium mb-1 text-blue-100">Total Hours</h3>
                <p className="text-2xl sm:text-3xl font-bold">{Math.round((totalTime / 60) * 10) / 10}</p>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">{formatDuration(totalTime)}</p>
              </div>
              
              <div className="bg-white rounded-sm sm:rounded-sm p-4 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-xs sm:text-sm text-slate-600 font-medium mb-1">Completed</h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{tasksData.stats.done}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">of {tasksData.stats.total}</p>
              </div>
              
              <div className="bg-white rounded-sm sm:rounded-sm p-4 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-xs sm:text-sm text-slate-600 font-medium mb-1">In Progress</h3>
                <p className="text-2xl sm:text-3xl font-bold text-orange-500">{tasksData.stats.inProgress}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {Math.round((tasksData.stats.inProgress / Math.max(tasksData.stats.total, 1)) * 100)}%
                </p>
              </div>
              
              <div className="bg-white rounded-sm sm:rounded-sm p-4 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-xs sm:text-sm text-slate-600 font-medium mb-1">Pending</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-500">{tasksData.stats.pending + tasksData.stats.todo}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {Math.round(((tasksData.stats.pending + tasksData.stats.todo) / Math.max(tasksData.stats.total, 1)) * 100)}%
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2  mb-2 px-2 ">
              <div className="bg-white rounded-sm sm:rounded-sm p-2 sm:p-6 shadow-sm border border-slate-200 lg:col-span-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Hours Logged by Day</h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.daily}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: any) => [`${value} hours`, 'Hours']} />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-sm sm:rounded-sm p-2 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Task Status</h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'To Do', value: tasksData.stats.todo },
                          { name: 'In Progress', value: tasksData.stats.inProgress },
                          { name: 'Done', value: tasksData.stats.done },
                          { name: 'Pending', value: tasksData.stats.pending }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={window.innerWidth < 640 ? 60 : 80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {['#3b82f6', '#f97316', '#22c55e', '#a855f7'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2 px-2">
              <div className="bg-white rounded-sm sm:rounded-sm p-2 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Task Trend</h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.daily}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-sm sm:rounded-sm p-2 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Time by Priority</h3>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.hoursByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={window.innerWidth < 640 ? 60 : 80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}h`}
                      >
                        {chartData.hoursByCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} hours`, 'Time']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white  p-4 sm:p-6 shadow-sm border border-slate-200">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Recent Tasks</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-1 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                      <th className="px-1 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                      <th className="px-1 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-1 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasksData.tasks.slice(0, 5).map((task, index) => {
                      const timeEntry = task.time?.[0];
                      const duration = timeEntry ? calculateTimeDifference(timeEntry.stated, timeEntry.ended) : 0;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-1 sm:px-6 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                          <td className="px-1 sm:px-6 py-3 text-sm text-gray-500 hidden sm:table-cell">
                            {timeEntry ? new Date(timeEntry.stated).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-1 sm:px-6 py-3 text-sm text-gray-500">{formatDuration(duration)}</td>
                          <td className="px-1 sm:px-6 py-3 hidden md:table-cell">
                            <span className={`px-2 py-1 text-xs font-medium rounded-sm ${
                              task.status === 'done' ? 'bg-green-100 text-green-800' :
                              task.status === 'in progress' ? 'bg-orange-100 text-orange-800' :
                              task.status === 'to do' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {tasksData.tasks.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No tasks found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TimesheetAnalytics;