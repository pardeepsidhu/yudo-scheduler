'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  ArrowUpDown,
  AlertCircle,
  Info,
  Trash2,
  Loader2,
  Loader
} from 'lucide-react';

import {
  deleteTask,
  fetchTasks,
  TaskData,
  TaskPriority
} from '../api/taskApi';

// shadcn components
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CreateTaskDialog } from './CreateTaskDialog';
import { TaskDialog } from './showTask';

const LIMIT = 10;

export default function TaskDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TaskPriority | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tab, setTab] = useState('all');
  const [deleteDialogOpen,setDeleteDialogOpen]=useState(false);
  const [deleteTaskData,setDeleteTaskData]=useState({});
  const [waiting,setWaiting]=useState(false);
  
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  // Load initial data
  useEffect(() => {
    loadTasks();
  }, [filter, tab]);

  // Infinite scroll logic
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreTasks();
    }
  }, [inView]);




  const confirmDelete =async()=>{
    setWaiting(true);
    try {
      let result = await deleteTask(deleteTaskData._id);
      if(result.error){ 
        setError(result.error || "some error accured while deleting");
      }
      else{
        await loadTasks()
      }
    } catch (error) {
      if(error) setError("some error accured while deleting task!")
    }
    finally{
      setWaiting(false)
      setDeleteDialogOpen(false)
    }
  }
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    setPage(0);
    
    try {
      let options: { limit: number; skip: number; priority?: TaskPriority } = {
        limit: LIMIT,
        skip: 0,
      };

      if (filter !== 'all') {
        options.priority = filter as TaskPriority;
      }

      const response = await fetchTasks(options);
      setTasks(response.tasks);
      setHasMore(response.tasks.length < response.total);
      setPage(prev => prev + 1);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTasks = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      let options: { limit: number; skip: number; priority?: TaskPriority } = {
        limit: LIMIT,
        skip: page * LIMIT,
      };

      if (filter !== 'all') {
        options.priority = filter as TaskPriority;
      }

      const response = await fetchTasks(options);
     
      setTasks(prev => [...prev, ...response.tasks]);
      setHasMore(tasks.length + response.tasks.length < response.total);
      setPage(prev => prev + 1);
    } catch (err) {
      setError('Failed to load more tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewTask = (task: TaskData) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };


  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = tab === 'all' || task.status === tab;
    
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'to do': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  function formatEstimatedTime(isoTimeString:any) {
    // Parse the ISO string to a Date object
    const date = new Date(isoTimeString);
    
    // Get total milliseconds (time since epoch)
    const milliseconds = date.getTime();
    
    // Convert to hours and minutes
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the string
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
  <div className="container mx-auto p-2 sm:p-4">
    {/* Premium Header */}
    <header className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm bg-white/95">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
              <ClipboardList className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Task Dashboard</h1>
            <p className="text-sm text-gray-600 font-medium mt-0.5">Manage your productivity</p>
          </div>
        </div>
        <Button 
          onClick={handleCreateTask} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-semibold px-6 py-5 rounded-xl"
        >
          <Plus size={18} strokeWidth={3} />
          Create Task
        </Button>
      </div>
    </header>


    {/* Premium Filters Section */}
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Search Tasks</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by title, description..."
              className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all rounded-xl font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 sm:flex-initial">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Priority</label>
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as TaskPriority | 'all')}
            >
              <SelectTrigger className="w-full sm:w-40 h-12 border-2 border-gray-200 hover:border-blue-400 transition-all rounded-xl font-semibold">
                <div className="flex items-center gap-2">
                  <Filter size={18} />
                  <span>Priority</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 sm:flex-initial">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block opacity-0">Reset</label>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
                setTab('all');
              }}
              className="w-full h-12 border-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-700 transition-all font-semibold rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Premium Tabs */}
    <Tabs value={tab} onValueChange={setTab} className="mb-6">
      <TabsList className="bg-white border-2 border-gray-200 p-1.5 rounded-xl shadow-md h-auto">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold px-6 py-2.5 rounded-lg transition-all"
        >
          All
        </TabsTrigger>
        <TabsTrigger 
          value="pending" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold px-6 py-2.5 rounded-lg transition-all"
        >
          Pending
        </TabsTrigger>
        <TabsTrigger 
          value="to do" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold px-6 py-2.5 rounded-lg transition-all"
        >
          To Do
        </TabsTrigger>
        <TabsTrigger 
          value="in progress" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold px-6 py-2.5 rounded-lg transition-all"
        >
          In Progress
        </TabsTrigger>
        <TabsTrigger 
          value="done" 
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md font-bold px-6 py-2.5 rounded-lg transition-all"
        >
          Done
        </TabsTrigger>
      </TabsList>
    </Tabs>

    {/* Premium Task Grid */}
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loading && tasks.length === 0 ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Card key={`skeleton-${index}`} className="shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100">
              <Skeleton className="h-6 w-4/5 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-20 w-full mb-4 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Card 
            key={task._id} 
            onClick={() => handleViewTask(task)} 
            className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:translate-y-[-8px] cursor-pointer bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl overflow-hidden group relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700"></div>
            
            <CardHeader className="pb-3 pt-6">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="line-clamp-1 text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors pr-2">
                  {task.title}
                </CardTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-all">
                    <Info size={16} className="text-blue-600" />
                  </div>
                  <div 
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTaskData(task);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </div>
                </div>
              </div>
              
              <CardDescription className="flex items-center gap-2 text-gray-600 font-semibold">
                <Clock size={14} />
                Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="line-clamp-2 text-sm text-gray-700 mb-5 min-h-[40px] leading-relaxed">{task.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(task.status)} border-2 font-bold px-3 py-1.5 text-xs rounded-full shadow-sm`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`${getPriorityColor(task.priority)} border-2 font-bold px-3 py-1.5 text-xs rounded-full shadow-sm`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                
                {task.estimatedTime && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    {formatEstimatedTime(task.estimatedTime)}
                  </div>
                )}
                
                {task.time && task.time.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold bg-gray-100 px-3 py-1.5 rounded-full">
                    <AlertCircle size={14} />
                    {task.time.length} entries
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
            <ClipboardList className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6 font-semibold max-w-md">
            {searchTerm || filter !== 'all' || tab !== 'all' 
              ? "Try adjusting your filters or search query"
              : "Click the 'Create Task' button to add your first task"}
          </p>
          <Button 
            onClick={handleCreateTask}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl font-bold px-8 py-6 rounded-xl"
          >
            <Plus size={20} className="mr-2" strokeWidth={3} />
            Create Your First Task
          </Button>
        </div>
      )}
    </div>

    {/* Loading More */}
    {hasMore && (
      <div ref={ref} className="flex justify-center p-6 mt-6">
        {loading && tasks.length > 0 && (
          <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <Loader size={40} className="animate-spin text-blue-600 mb-3" />
            <p className="text-gray-900 font-bold">Loading More Tasks...</p>
          </div>
        )}
      </div>
    )}

    {!hasMore && !loading && tasks.length > 0 && (
      <div className="flex justify-center p-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
          <p className="text-gray-700 font-bold text-center">You've reached the end</p>
        </div>
      </div>
    )}

    <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    <TaskDialog taskId={selectedTask?._id} open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />

    {/* Premium Delete Dialog */}
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="rounded-2xl shadow-2xl border-2 border-gray-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900">Delete Task</DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-700 font-semibold mb-3">Are you sure you want to delete this task?</p>
          {deleteTaskData && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border-2 border-gray-200">
              <p className="font-black text-gray-900">{deleteTaskData?.title}</p>
            </div>
          )}
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <p className="text-sm text-red-700 font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              This action cannot be undone.
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={waiting}
            className="border-2 border-gray-300 hover:bg-gray-100 font-bold px-6 py-5 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={confirmDelete}
            disabled={waiting}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg font-bold px-6 py-5 rounded-xl"
          >
            {waiting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete Task</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>
  );
}