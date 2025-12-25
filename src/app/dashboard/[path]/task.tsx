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
} from '../../api/taskApi';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTaskData, setDeleteTaskData] = useState({});
  const [waiting, setWaiting] = useState(false);


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




  const confirmDelete = async () => {
    setWaiting(true);
    try {
      let result:any = await deleteTask(deleteTaskData._id);
      if (result.error) {
        setError(result.error || "some error accured while deleting");
      }
      else {
        await loadTasks()
      }
    } catch (error) {
      if (error) setError("some error accured while deleting task!")
    }
    finally {
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

  function formatEstimatedTime(isoTimeString: any) {
    const date = new Date(isoTimeString);
    const milliseconds = date.getTime();
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="bg-white shadow-sm overflow-hidden border border-slate-200 mb-1 sm:mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-4">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Task Dashboard</h1>
                  <p className="text-blue-100 text-sm">Manage your productivity</p>
                </div>
              </div>
              <Button
                onClick={handleCreateTask}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-sm hover:bg-blue-50 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className='hidden md:block'>Create Task</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm border border-slate-200 p-2 sm:p-6 mb-1 sm:mb-4 m-2 sm:m-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">Search Tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by title or description..."
                  className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all rounded-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 sm:flex-initial">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">Priority</label>
                <Select
                  value={filter}
                  onValueChange={(value) => setFilter(value as TaskPriority | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-40 h-10 border-slate-200 hover:border-blue-400 transition-all rounded-sm">
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      <span className="text-sm">Priority</span>
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
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block opacity-0">Reset</label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setTab('all');
                  }}
                  className="w-full h-10 border-slate-200 hover:bg-slate-50 transition-all rounded-sm text-sm"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-2 sm:mb-6 m-2 sm:m-4 m-[auto] w-[max-content]  ">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList
              className="
        bg-white border border-slate-200 p-1 rounded-sm shadow-sm h-auto inline-flex
        overflow-x-auto whitespace-nowrap
        max-w-full
        sm:overflow-visible
      "
            >
              <TabsTrigger
                value="all"
                className="
          px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-sm transition-all
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md
        "
              >
                All
              </TabsTrigger>

              <TabsTrigger
                value="pending"
                className="
          px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-sm transition-all
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md
        "
              >
                Pending
              </TabsTrigger>

              <TabsTrigger
                value="to do"
                className="
          px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-sm transition-all
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md
        "
              >
                To Do
              </TabsTrigger>

              <TabsTrigger
                value="in progress"
                className="
          px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-sm transition-all
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md
        "
              >
                In Progress
              </TabsTrigger>

              <TabsTrigger
                value="done"
                className="
          px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium rounded-sm transition-all
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md
        "
              >
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>


        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <Separator />
        {/* Task Grid */}
        <div className="grid gap-0 p-1 md:p-2 sm:gap-0 md:grid-cols-2 lg:grid-cols-3">
          {loading && tasks.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="shadow-md rounded-sm overflow-hidden border border-2 border-gray-200">
                <CardHeader className="bg-slate-50 pb-3">
                  <Skeleton className="h-6 w-4/5 mb-2 rounded-sm" />
                  <Skeleton className="h-4 w-1/2 rounded-sm" />
                </CardHeader>
                <CardContent className="pt-4">
                  <Skeleton className="h-16 w-full mb-4 rounded-sm" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-sm" />
                    <Skeleton className="h-6 w-20 rounded-sm" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task._id}
                onClick={() => handleViewTask(task)}
                className="md:shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white md:border border-slate-200 hover:border-blue-400 rounded-sm overflow-hidden group m-1 gap-1 py-4"
              >
                <CardHeader className="py-2 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-2">
                      {task.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="p-1.5 rounded-sm bg-blue-50 group-hover:bg-blue-100 transition-all">
                        <Info size={14} className="text-blue-600" />
                      </div>
                      <div
                        className="p-1.5 rounded-sm bg-red-50 hover:bg-red-100 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTaskData(task);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </div>
                    </div>
                  </div>

                  <CardDescription className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Clock size={12} />
                    Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <p className="line-clamp-2 text-sm text-slate-700 mb-4 min-h-[40px] leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(task.status)} font-medium px-2.5 py-0.5 text-xs rounded-sm`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`${getPriorityColor(task.priority)} font-medium px-2.5 py-0.5 text-xs rounded-sm`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>

                    {task.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-sm">
                        <Clock size={12} />
                        {formatEstimatedTime(task.estimatedTime)}
                      </div>
                    )}

                    {task.time && task.time.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-sm">
                        <AlertCircle size={12} />
                        {task.time.length} entries
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-sm flex items-center justify-center mb-6">
                <ClipboardList className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-600 mb-6 max-w-md">
                {searchTerm || filter !== 'all' || tab !== 'all'
                  ? "Try adjusting your filters or search query"
                  : "Click the 'Create Task' button to add your first task"}
              </p>
              <Button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-sm shadow-md hover:shadow-lg transition-all"
              >
                <Plus size={18} className="mr-2" />
                Create Your First Task
              </Button>
            </div>
          )}
        </div>

        {/* Loading More */}
        {hasMore && (
          <div ref={ref} className="flex justify-center p-6 mt-6">
            {loading && tasks.length > 0 && (
              <div className="flex flex-col items-center bg-white rounded-sm shadow-md p-6 border border-slate-200">
                <Loader size={32} className="animate-spin text-blue-600 mb-3" />
                <p className="text-slate-900 font-medium">Loading more tasks...</p>
              </div>
            )}
          </div>
        )}

        {!hasMore && !loading && tasks.length > 0 && (
          <div className="flex justify-center p-6 mt-6">
            <div className="bg-white rounded-sm shadow-md p-4 border border-slate-200">
              <p className="text-slate-700 font-medium text-center text-sm">You've reached the end</p>
            </div>
          </div>
        )}

        <CreateTaskDialog open={isCreateDialogOpen} loadTasks={loadTasks} onOpenChange={setIsCreateDialogOpen} />
        <TaskDialog taskId={selectedTask?._id} loadTasks={loadTasks}  open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="rounded-sm border gap-0 border-slate-200">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900">Delete Task</DialogTitle>
              </div>
            </DialogHeader>
            <div className="pb-2">
              <p className="text-slate-700 mb-1">Are you sure you want to delete this task?</p>
              {deleteTaskData && (
                <div className="bg-slate-50 rounded-sm p-3 py-2 mb-2 border border-slate-200">
                  <p className="font-semibold text-slate-900">{deleteTaskData?.title}</p>
                </div>
              )}
              <div className="p-3 py-2 bg-red-50 border-l-4 border-red-500 rounded-sm">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle size={14} />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={waiting}
                className="border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={waiting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm shadow-md"
              >
                {waiting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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