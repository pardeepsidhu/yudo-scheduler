import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
  Label
} from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, Download, RefreshCw, Loader2 } from 'lucide-react';
import { getTaskByTimeFrames } from '../api/taskApi';

// Note: This component assumes getTaskByTimeFrames API function is available from your application context
const TimesheetAnalytics = () => {
  // State management from your provided code
  const [timeframe, setTimeframe] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasksData, setTasksData] = useState({
    tasks: [],
    stats: { total: 0, pending: 0, todo: 0, inProgress: 0, done: 0 }
  });
  const [dailyTasks, setDailyTasks] = useState({});
  const [dailyTotals, setDailyTotals] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  const [chartData, setChartData] = useState({
    daily: [],
    hoursByCategory: [],
    priorityDistribution: []
  });

  // Utility functions from your provided code
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    return new Date(d.setDate(diff));
  }

  function getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;
  }

  function calculateTimeDifference(start, end) {
    if (!start || !end) return 0;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.round((endTime - startTime) / (1000 * 60));
  }

  function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Calculate date periods when navigating or changing timeframe
  const calculateDatePeriod = (baseDate, periodType) => {
    const date = new Date(baseDate);
    let startDate, endDate;
    
    if (periodType === 'week') {
      // Calculate start of week (Monday)
      const day = date.getDay();
      startDate = new Date(date);
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
      
      // End date is Sunday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (periodType === 'month') {
      // Start of month
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      
      // End of month
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    
    return { startDate, endDate };
  };

  // Process task data and create chart data
  const processTaskData = (tasks, activeTimeframe) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setDailyTasks({});
      setDailyTotals({});
      setTotalTime(0);
      setChartData({
        daily: [],
        hoursByCategory: [],
        priorityDistribution: []
      });
      return;
    }
    
    const dailyTasksMap = {};
    const dailyTotalsMap = {};
    let totalMinutes = 0;
    
    // Create date range based on timeframe
    const daysInRange = activeTimeframe === 'week' ? 7 : 
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const periodStart = activeTimeframe === 'week' ? 
      getStartOfWeek(currentDate) : 
      getStartOfMonth(currentDate);
      
    // Initialize all days in range
    for (let i = 0; i < daysInRange; i++) {
      const day = new Date(periodStart);
      day.setDate(day.getDate() + i);
      const dateKey = day.toISOString().split('T')[0];
      dailyTasksMap[dateKey] = [];
      dailyTotalsMap[dateKey] = 0;
    }
    
    // Organize tasks by day
    tasks.forEach(task => {
      if (!task.time || !Array.isArray(task.time)) return;
      
      task.time.forEach(timeEntry => {
        if (!timeEntry.stated || !timeEntry.ended) return;
        
        const startDate = new Date(timeEntry.stated);
        const dateKey = startDate.toISOString().split('T')[0];
        
        // Only include if date is in our range
        if (dailyTasksMap[dateKey] !== undefined) {
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

    // Generate chart data
    prepareDailyChartData(dailyTasksMap, dailyTotalsMap);
    prepareTaskDistributionData(tasks);
  };

  // Prepare daily chart data
  const prepareDailyChartData = (dailyTasksMap, dailyTotalsMap) => {
    const dailyData = Object.keys(dailyTotalsMap).map(dateKey => {
      const date = new Date(dateKey);
      return {
        date: dateKey,
        day: getDayName(date),
        hours: Math.round((dailyTotalsMap[dateKey] / 60) * 10) / 10,
        tasks: dailyTasksMap[dateKey].length
      };
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(prevData => ({
      ...prevData,
      daily: dailyData
    }));
  };

  // Prepare task distribution data
  const prepareTaskDistributionData = (tasks) => {
    // Calculate tasks by category
    const categories = {};
    const priorities = { High: 0, Medium: 0, Low: 0 };

    tasks.forEach(task => {
      // Calculate total time for each task
      let taskMinutes = 0;
      if (task.time && Array.isArray(task.time)) {
        task.time.forEach(timeEntry => {
          if (timeEntry.stated && timeEntry.ended) {
            taskMinutes += calculateTimeDifference(timeEntry.stated, timeEntry.ended);
          }
        });
      }

      // Group by category
      const category = task.priority || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += taskMinutes;

      // Group by priority
      const priority = task.priority || 'Medium';
      if (priorities[priority] !== undefined) {
        priorities[priority]++;
      }
    });

    // Convert to array format for charts
    const hoursByCategory = Object.keys(categories).map(key => ({
      name: key,
      value: Math.round((categories[key] / 60) * 10) / 10
    }));

    const priorityDistribution = Object.keys(priorities).map(key => ({
      name: key,
      value: priorities[key]
    }));

    setChartData(prevData => ({
      ...prevData,
      hoursByCategory,
      priorityDistribution
    }));
  };
  
  // Fetch tasks with explicit date range
  const fetchTasksByTimeframe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate proper date range based on current date and timeframe
      const { startDate: start, endDate: end } = calculateDatePeriod(currentDate, timeframe);
      
      // Update visible date range in UI
      setStartDate(start);
      
      // Fetch data with explicit date range
      
      const data = await getTaskByTimeFrames(timeframe, start, end);
   
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTasksData(data);
      processTaskData(data.tasks, timeframe);
    } catch (err) {
      console.error(`Error fetching ${timeframe} tasks:`, err);
      setError(`Failed to load timesheet data. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to previous period
  const goToPrevious = () => {
    let newDate;
    if (timeframe === 'week') {
      newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const goToNext = () => {
    let newDate;
    if (timeframe === 'week') {
      newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
    
  // Export timesheet data to CSV
  const exportToCSV = () => {
    const headers = [
      'Date', 'Task Title', 'Description', 'Start Time', 'End Time', 'Duration', 'Status', 'Priority'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    Object.entries(dailyTasks).forEach(([dateStr, dayTasks]) => {
      dayTasks.forEach(task => {
        const startTime = new Date(task.timeEntry.started);
        const endTime = new Date(task.timeEntry.ended);
        
        const row = [
          dateStr,
          `"${task.title.replace(/"/g, '""')}"`,
          `"${(task.description || '').replace(/"/g, '""')}"`,
          formatTime(startTime),
          formatTime(endTime),
          formatDuration(task.timeEntry.minutes),
          task.status,
          task.priority
        ];
        
        csvContent += row.join(',') + '\n';
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet-${timeframe}-${formatDate(startDate)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get period range string for display
  const getPeriodRangeString = () => {
    if (!startDate) return '';
    
    if (timeframe === 'week') {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
      return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Reload data
  const handleRefresh = () => {
    fetchTasksByTimeframe();
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const STATUS_COLORS = {
    'todo': '#3b82f6',
    'inProgress': '#f97316',
    'done': '#22c55e',
    'pending': '#a855f7'
  };

  // Fetch data when timeframe/date changes
  useEffect(() => {
    fetchTasksByTimeframe();
  }, [timeframe, currentDate]);

  console.log(chartData)
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-1 sm:px-4 py-2 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 bg-white border-b border-gray-200 mb-3 sm:mb-6">
      <div className="flex items-center">
        <div className="mr-4 p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Timesheet Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">{getPeriodRangeString()}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Refresh data"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-5 h-5 text-gray-700 mr-2" />
              <span className="text-sm font-medium text-gray-700">Refresh</span>
            </>
          )}
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
          aria-label="Export to CSV"
        >
          <Download className="w-5 h-5 text-white mr-2" />
          <span className="text-sm font-medium text-white">Export</span>
        </button>
      </div>
    </div>
        
        {/* Period Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-8 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <span className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-100">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">{getPeriodRangeString()}</span>
              </span>
              
              <button
                onClick={goToNext}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Next period"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => handleTimeframeChange('week')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === 'week' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => handleTimeframeChange('month')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === 'month' ? 'bg-white shadow-sm font-medium' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 sm:mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm text-gray-500 font-medium mb-1">Total Hours</h3>
                <p className="text-3xl font-bold text-gray-900">{Math.round((totalTime / 60) * 10) / 10}</p>
                <p className="text-sm text-gray-500 mt-1">{formatDuration(totalTime)}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm text-gray-500 font-medium mb-1">Tasks Completed</h3>
                <p className="text-3xl font-bold text-green-600">{tasksData.stats.done}</p>
                <p className="text-sm text-gray-500 mt-1">of {tasksData.stats.total} tasks</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm text-gray-500 font-medium mb-1">In Progress</h3>
                <p className="text-3xl font-bold text-orange-500">{tasksData.stats.inProgress}</p>
                <p className="text-sm text-gray-500 mt-1">{Math.round((tasksData.stats.inProgress / Math.max(tasksData.stats.total, 1)) * 100)}% of total</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm text-gray-500 font-medium mb-1">Pending/Todo</h3>
                <p className="text-3xl font-bold text-blue-500">{tasksData.stats.pending + tasksData.stats.todo}</p>
                <p className="text-sm text-gray-500 mt-1">{Math.round(((tasksData.stats.pending + tasksData.stats.todo) / Math.max(tasksData.stats.total, 1)) * 100)}% of total</p>
              </div>
            </div>
            
            {/* Charts - First Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 sm:gap-8 mb-2 sm:mb-8">
              {/* Daily Hours */}
              <div className="bg-white rounded-lg shadow-sm p-6 col-span-1 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hours Logged by Day</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.daily}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} hours`, 'Time Logged']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Task Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'To Do', value: tasksData.stats.todo || 0 },
                          { name: 'In Progress', value: tasksData.stats.inProgress || 0 },
                          { name: 'Done', value: tasksData.stats.done || 0 },
                          { name: 'Pending', value: tasksData.stats.pending || 0 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell key="todo" fill={STATUS_COLORS.todo} />
                        <Cell key="inProgress" fill={STATUS_COLORS.inProgress} />
                        <Cell key="done" fill={STATUS_COLORS.done} />
                        <Cell key="pending" fill={STATUS_COLORS.pending} />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Charts - Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-8 mb-2 sm:mb-8">
              {/* Daily Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={chartData.daily}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        yAxisId="left"
                        label={{ value: 'Tasks', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fontSize: 12 }}
                      />
                      <Tooltip formatter={(value, name) => [value, name === 'tasks' ? 'Tasks' : 'Hours']} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                        name="Tasks Completed"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Hours By Category (if category data available) */}
              <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Time Spent</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width={300} height={300}>
        <Pie
          data={chartData.hoursByCategory}
          cx="50%"
          cy="40%"
          innerRadius={30}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {chartData.hoursByCategory.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
        </ResponsiveContainer>
      </div>
  
    </div>
            </div>
            
            {/* Top Tasks Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasksData.tasks.slice(0, 5).map((task, index) => {
                      const timeEntry = task.time && task.time.length > 0 ? task.time[task.time.length - 1] : null;
                      const startTime = timeEntry?.stated ? new Date(timeEntry.stated) : null;
                      const endTime = timeEntry?.ended ? new Date(timeEntry.ended) : null;
                      const duration = timeEntry ? calculateTimeDifference(timeEntry.stated, timeEntry.ended) : 0;
                      
                      return (
                        <tr key={`task-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.title || 'Untitled Task'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {startTime ? startTime.toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {startTime ? formatTime(startTime) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDuration(duration)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.status === 'done' ? 'bg-green-100 text-green-800' : ''}
                              ${task.status === 'inProgress' ? 'bg-orange-100 text-orange-800' : ''}
                              ${task.status === 'todo' ? 'bg-blue-100 text-blue-800' : ''}
                              ${task.status === 'pending' ? 'bg-purple-100 text-purple-800' : ''}
                              ${!task.status ? 'bg-gray-100 text-gray-800' : ''}
                            `}>
                              {task.status || 'No Status'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    
                    {tasksData.tasks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No tasks found for this period.
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