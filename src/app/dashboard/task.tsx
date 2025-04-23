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
      console.log(response)
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

  function formatEstimatedTime(isoTimeString) {
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
    <div className="container mx-auto p-1 sm:p-4 m-1 border border-gray-200 rounded-2xl bg-gray-50">
      <header className="flex items-center justify-between p-3 sm:p-4 my-1 sm:my-2 rounded-xl rounded-b-none sticky  bg-white  border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl md:text-2xl md:text-3xl font-bold text-gray-800">Task Dashboard</h1>
        </div>
        <Button 
          onClick={handleCreateTask} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Create Task
        </Button>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex flex-1 items-center max-w-md">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as TaskPriority | 'all')}
          >
            <SelectTrigger className="w-45 border-gray-300">
              <div className="flex items-center gap-2">
                <Filter size={16} />
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
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
              setTab('all');
            }}
            className="border-gray-300 hover:bg-gray-100 transition-colors w-40"
          >
            Reset Filters
          </Button>
        </div>
      </div>
      <Separator className="mb-2" />
      <Tabs value={tab} onValueChange={setTab} className="mb-6flex  items-center sm:items-start mb-2">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white">Pending</TabsTrigger>
          <TabsTrigger value="to do" className="data-[state=active]:bg-white">To Do</TabsTrigger>
          <TabsTrigger value="in progress" className="data-[state=active]:bg-white">In Progress</TabsTrigger>
          <TabsTrigger value="done" className="data-[state=active]:bg-white">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && tasks.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-5 w-4/5 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
          // <div className="h-[40vh] bg-gray-50 flex items-center justify-center">
        // <div className="flex flex-col items-center">
        //   <div className="rounded-full bg-blue-50 p-4 mb-3">
        //     <Loader size={32} className="animate-spin text-blue-600" />
        //   </div>
        //   <p className="text-gray-600 font-medium">Loading dashboard...</p>
        // </div>
      // </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task._id} onClick={()=>handleViewTask(task)} className="shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] cursor-pointer bg-white border border-gray-200 gap-1 sm:gap-2 py-4 sm:py-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1 text-lg font-semibold text-gray-800">{task.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-gray-400 hover:text-blue-500 transition-colors" />
                  <Trash2 
                    size={16} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                     setDeleteTaskData(task);
                     setDeleteDialogOpen(true)
                    }}
                  />
                </div>
              </div>
              
              <CardDescription className="line-clamp-1 text-gray-500">
                Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="line-clamp-2 text-sm text-gray-600 mb-4 min-h-[40px]">{task.description}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-auto">
                <Badge variant="outline" className={`${getStatusColor(task.status)} transition-colors`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
                
                <Badge variant="outline" className={`${getPriorityColor(task.priority)} transition-colors`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                
                {task.estimatedTime && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    {formatEstimatedTime(task.estimatedTime)}
                  </div>
                )}
                
                {task.time && task.time.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <AlertCircle size={14} />
                    {task.time.length} time entries
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'all' || tab !== 'all' 
                ? "Try adjusting your filters or search query"
                : "Click the 'Create Task' button to add your first task"}
            </p>
            <Button 
              onClick={handleCreateTask}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Task
            </Button>
          </div>
        )}
      </div>

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div 
          ref={ref}
          className="flex justify-center p-4 mt-4"
        >
          {loading && tasks.length > 0 && (
            <div className="flex flex-col items-center">
              
            <Loader size={32} className="animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600">Loading More Tasks...</p>
          </div>
          )}
          
        </div>
      )}
{!hasMore && !loading &&
 <div 
          ref={ref}
          className="flex justify-center p-4 mt-4"
        >
          {loading && tasks.length > 0 && (
            <div className="flex flex-col items-center">
              
            <Loader size={32} className="animate-spin text-blue-600 mb-2" />
            <p className="text-gray-600">Loading More Tasks...</p>
          </div>
          )}
          
        </div>
          }
     
   
      {/* Create Task Dialog */}
    
      <CreateTaskDialog open={isCreateDialogOpen}  onOpenChange={setIsCreateDialogOpen} />

      {/* view dialog */}
      <TaskDialog taskId={selectedTask?._id} open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />

      {/* delete conformatin dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p>Are you sure you want to delete this Task?</p>
            {deleteTaskData && (
              <p className="mt-2 font-medium">{deleteTaskData?.title}</p>
            )}
            <p className="mt-4 text-sm text-red-600">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={waiting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={waiting}
            >
              {waiting ? (
                <>
                
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}