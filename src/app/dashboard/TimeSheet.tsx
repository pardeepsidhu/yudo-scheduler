import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Loader
} from 'lucide-react';
import { getTaskByTimeFrames } from '../api/taskApi';

const ProfessionalTimesheet = () => {
  // State management
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

  // Utility functions
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
    
  // Process and organize task data by day
  const processTaskData = (tasks, activeTimeframe) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setDailyTasks({});
      setDailyTotals({});
      setTotalTime(0);
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
    // fetchTasksByTimeframe will be called in useEffect when currentDate changes
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
    // fetchTasksByTimeframe will be called in useEffect when currentDate changes
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // fetchTasksByTimeframe will be called in useEffect when timeframe changes
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

  // Fetch data when timeframe/date changes
  useEffect(() => {
    fetchTasksByTimeframe();
  }, [timeframe, currentDate]);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-white border-b px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
        {/* Title - Always at top on mobile, left on desktop */}
        <div className="flex items-center">
          <Calendar className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Time Sheet</h1>
        </div>
        
        {/* Controls - Stack on mobile, inline on desktop */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
          {/* Week/Month Toggle - Full width on xs, normal on sm+ */}
          <div className="bg-gray-100 rounded-lg p-1 flex justify-center sm:justify-start">
            <button
              onClick={() => handleTimeframeChange('week')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-md text-sm ${
                timeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeframeChange('month')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded-md text-sm ${
                timeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
          
          {/* Date Navigation - Full width on xs, normal on sm+ */}
          <div className="flex items-center justify-between sm:justify-start bg-gray-100 rounded-lg p-1">
            <button
              onClick={goToPrevious}
              className="p-1 rounded-md hover:bg-gray-200"
              title="Previous period"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="px-2 text-sm font-medium text-gray-700 truncate">
              {getPeriodRangeString()}
            </span>
            
            <button
              onClick={goToNext}
              className="p-1 rounded-md hover:bg-gray-200"
              title="Next period"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Action Buttons - Row on all sizes */}
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title="Refresh"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            
            <button
              onClick={exportToCSV}
              className="flex items-center px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="text-xs sm:text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
      
      {/* Summary Stats */}
      <div className="bg-gray-50 px-1 sm:px-6 py-2 sm:py-4 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">TOTAL TIME</div>
            <div className="text-2xl font-bold text-gray-800">{formatDuration(totalTime)}</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 font-medium mb-2">TASKS BY STATUS</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-500">To Do</div>
              <div className="font-semibold">{tasksData.stats.todo}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">In Progress</div>
              <div className="font-semibold">{tasksData.stats.inProgress}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Pending</div>
              <div className="font-semibold">{tasksData.stats.pending}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Completed</div>
              <div className="font-semibold">{tasksData.stats.done}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 font-medium mb-1">COMPLETION RATE</div>
          <div className="text-2xl font-bold text-gray-800">
            {tasksData.stats.total > 0 
              ? Math.round((tasksData.stats.done / tasksData.stats.total) * 100)
              : 0}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ 
                width: `${tasksData.stats.total > 0 
                  ? Math.round((tasksData.stats.done / tasksData.stats.total) * 100)
                  : 0}%`
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Timesheet */}
      <div className="px-1 py-6 md:px-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading timesheet data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(dailyTasks).map(([dateStr, tasks]) => {
              if (tasks.length === 0) return null;
              
              const date = new Date(dateStr);
              
              return (
                <div key={dateStr} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-4 px-3">
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Task
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Time
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Status
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
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
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                  <div className="text-xs text-gray-500 sm:hidden">
                                    {formatTime(startTime)} - {formatTime(endTime)}
                                  </div>
                                  <div className="text-xs text-gray-500 md:hidden mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                      ${task.status === 'done' ? 'bg-green-100 text-green-800' : 
                                        task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                        task.status === 'to do' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                                {formatTime(startTime)} - {formatTime(endTime)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                {formatDuration(task.timeEntry.minutes)}
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                  ${task.status === 'done' ? 'bg-green-100 text-green-800' : 
                                    task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                    task.status === 'to do' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
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
            
            {/* Empty state when no tasks */}
            {Object.values(dailyTasks).every(tasks => tasks.length === 0) && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Calendar className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No time entries found</h3>
                <p className="text-gray-500">There are no time entries recorded for this period.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTimesheet;