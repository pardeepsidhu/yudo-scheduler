// src/components/EmailAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getAllReminders } from '../api/reminderService';

interface Email {
    _id: string;
    to: string;
    subject: string;
    body: string;
    scheduleTime: string;
    jobId?: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt: string;
    updatedAt: string;
  }
// Define color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  pending: '#FFBB28',
  sent: '#00C49F',
  failed: '#FF8042'
};

interface EmailAnalyticsProps {
  token: string;
}

const ReminderAnalytics: React.FC<EmailAnalyticsProps> = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('week');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all emails
        let user =localStorage.getItem("user")
        const response = await getAllReminders(user)
        
        if (response.error) {
          setError(response.error);
        } else {
          setEmails(response.emails);
        }
      } catch (err) {
        setError('Failed to fetch analytics data');
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Process data for charts
  const processEmailsByStatus = () => {
    const statusCount = { pending: 0, sent: 0, failed: 0 };
    
    emails.forEach(email => {
      statusCount[email.status] = (statusCount[email.status] || 0) + 1;
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status],
      color: STATUS_COLORS[status]
    }));
  };
  
  const processEmailsByDate = () => {
    const dateMap = new Map();
    const now = new Date();
    let startDate: Date;
    
    // Determine start date based on time range
    switch (timeRange) {
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
    
    // Initialize data structure with dates
    const current = new Date(startDate);
    while (current <= now) {
      const dateStr = current.toISOString().split('T')[0];
      dateMap.set(dateStr, { date: dateStr, sent: 0, pending: 0, failed: 0, total: 0 });
      current.setDate(current.getDate() + 1);
    }
    
    // Fill with actual data
    emails.forEach(email => {
      const createdAt = new Date(email.createdAt);
      if (createdAt >= startDate) {
        const dateStr = createdAt.toISOString().split('T')[0];
        if (dateMap.has(dateStr)) {
          const data = dateMap.get(dateStr);
          data[email.status]++;
          data.total++;
          dateMap.set(dateStr, data);
        }
      }
    });
    
    return Array.from(dateMap.values());
  };
  
  const processEmailsByHour = () => {
    const hourData = Array(24).fill(0).map((_, idx) => ({ hour: idx, count: 0 }));
    
    emails.forEach(email => {
      const scheduleTime = new Date(email.scheduleTime);
      const hour = scheduleTime.getHours();
      hourData[hour].count++;
    });
    
    return hourData;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const statusData = processEmailsByStatus();
  const timelineData = processEmailsByDate();
  const hourlyData = processEmailsByHour();
  
  return (
    <div className="space-y-6 mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reminder Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reminders</CardTitle>
            <CardDescription>All scheduled reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{emails.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sent Rate</CardTitle>
            <CardDescription>Successfully delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {emails.length ? Math.round((emails.filter(e => e.status === 'sent').length / emails.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending</CardTitle>
            <CardDescription>Scheduled but not sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{emails.filter(e => e.status === 'pending').length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Failed</CardTitle>
            <CardDescription>Delivery issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{emails.filter(e => e.status === 'failed').length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Reminder Activity Timeline</CardTitle>
            <CardDescription>Volume of emails over time by status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke={STATUS_COLORS.sent} name="Sent" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke={STATUS_COLORS.pending} name="Pending" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke={STATUS_COLORS.failed} name="Failed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Status Distribution & Hourly Distribution Side by Side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Status Distribution</CardTitle>
              <CardDescription>Breakdown by current status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hourly Reminder Distribution</CardTitle>
              <CardDescription>When reminders are scheduled throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Emails']}
                    labelFormatter={(hour) => `Time: ${hour}:00`}
                  />
                  <Bar dataKey="count" name="Emails" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default ReminderAnalytics;