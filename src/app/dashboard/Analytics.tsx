import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../api/taskApi';
import { Loader, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReminderAnalytics from './ReminderAnalytics';


// Define interfaces - these would normally be imported from @/interface
interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'to do' | 'in progress' | 'done';
  estimatedTime?: Date;
  time: Array<{ stated: Date; ended: string }>;
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  tasks: Task[];
  total: number;
}

interface TimeFrame {
  value: string;
  label: string;
}

const timeFrames: TimeFrame[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  'pending': '#FFBB28',
  'to do': '#0088FE',
  'in progress': '#00C49F',
  'done': '#FF8042'
};

const PRIORITY_COLORS = {
  'high': '#ef4444',
  'normal': '#3b82f6',
  'low': '#22c55e'
};

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>('week');
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    toDo: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response: TasksResponse = await fetchTasks();
        setTasks(response.tasks);
        
        // Calculate stats
        const total = response.tasks.length;
        const completed = response.tasks.filter(task => task.status === 'done').length;
        const inProgress = response.tasks.filter(task => task.status === 'in progress').length;
        const pending = response.tasks.filter(task => task.status === 'pending').length;
        const toDo = response.tasks.filter(task => task.status === 'to do').length;
        
        setTaskStats({
          total,
          completed,
          inProgress,
          pending,
          toDo
        });
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedTimeFrame]);

  // Prepare data for charts
  const statusData = [
    { name: 'Done', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.inProgress },
    { name: 'To Do', value: taskStats.toDo },
    { name: 'Pending', value: taskStats.pending }
  ];

  const priorityData = [
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Normal', value: tasks.filter(task => task.priority === 'normal').length },
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length }
  ];

  // Generate trend data based on timestamps
  const getTrendData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedTimeFrame) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const filteredTasks = tasks.filter(task => new Date(task.createdAt) >= startDate);
    
    const dataMap = new Map();
    
    if (selectedTimeFrame === 'day') {
      // Hourly intervals for day view
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}:00` : `${i}:00`;
        dataMap.set(hour, { name: hour, tasks: 0 });
      }
      
      filteredTasks.forEach(task => {
        const hour = new Date(task.createdAt).getHours();
        const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        if (dataMap.has(hourStr)) {
          const data = dataMap.get(hourStr);
          data.tasks += 1;
          dataMap.set(hourStr, data);
        }
      });
    } else if (selectedTimeFrame === 'week') {
      // Daily intervals for week view
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.forEach(day => dataMap.set(day, { name: day, tasks: 0 }));
      
      filteredTasks.forEach(task => {
        const day = days[new Date(task.createdAt).getDay()];
        if (dataMap.has(day)) {
          const data = dataMap.get(day);
          data.tasks += 1;
          dataMap.set(day, data);
        }
      });
    } else if (selectedTimeFrame === 'month') {
      // Weekly intervals for month view
      for (let i = 1; i <= 4; i++) {
        dataMap.set(`Week ${i}`, { name: `Week ${i}`, tasks: 0 });
      }
      
      filteredTasks.forEach(task => {
        const date = new Date(task.createdAt);
        const dayOfMonth = date.getDate();
        let weekOfMonth;
        
        if (dayOfMonth <= 7) weekOfMonth = 1;
        else if (dayOfMonth <= 14) weekOfMonth = 2;
        else if (dayOfMonth <= 21) weekOfMonth = 3;
        else weekOfMonth = 4;
        
        const key = `Week ${weekOfMonth}`;
        if (dataMap.has(key)) {
          const data = dataMap.get(key);
          data.tasks += 1;
          dataMap.set(key, data);
        }
      });
    } else {
      // Monthly intervals for year view
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months.forEach(month => dataMap.set(month, { name: month, tasks: 0 }));
      
      filteredTasks.forEach(task => {
        const month = months[new Date(task.createdAt).getMonth()];
        if (dataMap.has(month)) {
          const data = dataMap.get(month);
          data.tasks += 1;
          dataMap.set(month, data);
        }
      });
    }
    
    return Array.from(dataMap.values());
  };

  const trendData = getTrendData();

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-700">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your tasks and reminders performance</p>
      </div>

  
     
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Task Performance Metrics</h2>
            <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeFrames.map((timeFrame) => (
                  <SelectItem key={timeFrame.value} value={timeFrame.value}>
                    {timeFrame.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-600">Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{taskStats.total}</div>
                    <p className="text-sm text-gray-500">
                     100%
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-600">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{taskStats.completed}</div>
                    <p className="text-sm text-gray-500">
                      {taskStats.total > 0
                        ? `${Math.round((taskStats.completed / taskStats.total) * 100)}%`
                        : '0%'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-600">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{taskStats.inProgress}</div>
                    <p className="text-sm text-gray-500">
                      {taskStats.total > 0
                        ? `${Math.round((taskStats.inProgress / taskStats.total) * 100)}%`
                        : '0%'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-600">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-500">{taskStats.pending + taskStats.toDo}</div>
                    <p className="text-sm text-gray-500">
                      {taskStats.total > 0
                        ? `${Math.round(((taskStats.pending + taskStats.toDo) / taskStats.total) * 100)}%`
                        : '0%'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Task Status Distribution */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChartIcon className="mr-2 h-5 w-5 text-gray-600" />
                      Task Status Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of tasks by current status</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                stroke="#fff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Creation Trend */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChartIcon className="mr-2 h-5 w-5 text-gray-600" />
                      Task Creation Trend
                    </CardTitle>
                    <CardDescription>Number of tasks created over time</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={trendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip content={<CustomTooltip />} />
                          <Area 
                            type="monotone" 
                            dataKey="tasks" 
                            name="Tasks Created"
                            stroke="#3b82f6" 
                            fill="#93c5fd" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Priority */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChartIcon className="mr-2 h-5 w-5 text-gray-600" />
                      Tasks by Priority
                    </CardTitle>
                    <CardDescription>Distribution of tasks across priority levels</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={priorityData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="value" 
                            name="Tasks" 
                            radius={[4, 4, 0, 0]}
                          >
                            {priorityData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  entry.name === 'High' 
                                    ? PRIORITY_COLORS.high 
                                    : entry.name === 'Normal' 
                                      ? PRIORITY_COLORS.normal 
                                      : PRIORITY_COLORS.low
                                } 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Comparison */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChartIcon className="mr-2 h-5 w-5 text-gray-600" />
                      Status Breakdown by Priority
                    </CardTitle>
                    <CardDescription>How different priority tasks progress through statuses</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: 'High',
                              pending: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length,
                              todo: tasks.filter(t => t.priority === 'high' && t.status === 'to do').length,
                              inProgress: tasks.filter(t => t.priority === 'high' && t.status === 'in progress').length,
                              done: tasks.filter(t => t.priority === 'high' && t.status === 'done').length,
                            },
                            {
                              name: 'Normal',
                              pending: tasks.filter(t => t.priority === 'normal' && t.status === 'pending').length,
                              todo: tasks.filter(t => t.priority === 'normal' && t.status === 'to do').length,
                              inProgress: tasks.filter(t => t.priority === 'normal' && t.status === 'in progress').length,
                              done: tasks.filter(t => t.priority === 'normal' && t.status === 'done').length,
                            },
                            {
                              name: 'Low',
                              pending: tasks.filter(t => t.priority === 'low' && t.status === 'pending').length,
                              todo: tasks.filter(t => t.priority === 'low' && t.status === 'to do').length,
                              inProgress: tasks.filter(t => t.priority === 'low' && t.status === 'in progress').length,
                              done: tasks.filter(t => t.priority === 'low' && t.status === 'done').length,
                            }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="pending" name="Pending" fill={STATUS_COLORS.pending} radius={[4, 0, 0, 0]} />
                          <Bar dataKey="todo" name="To Do" fill={STATUS_COLORS['to do']} />
                          <Bar dataKey="inProgress" name="In Progress" fill={STATUS_COLORS['in progress']} />
                          <Bar dataKey="done" name="Done" fill={STATUS_COLORS.done} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}


   
         <ReminderAnalytics />

     
    </div>
  );
}