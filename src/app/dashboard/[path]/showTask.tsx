// components/TaskDialog.tsx
import { useState, useEffect } from 'react';
import { getTaskById, updateTask } from '../../api/taskApi';
import { formatDistance, format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Calendar,
  Timer,
  AlertCircle,
  CheckCircle,
  Play,
  Square,
  Hourglass,
  ArrowUpCircle,
  MinusCircle,
  ArrowDownCircle,
  Edit,
  X,
  ListTodo,
  Loader2,
  FileText
} from 'lucide-react';
import { Separator } from '@radix-ui/react-select';

// Define Task interface that matches your Mongoose schema
interface TimeEntry {
  stated: Date;
  ended?: Date;
  _id?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'to do' | 'in progress' | 'done';
  estimatedTime?: Date;
  time: TimeEntry[];
  priority: 'high' | 'normal' | 'low';
  createdAt: Date;
  updatedAt: Date;
  user: string;
}

interface TaskDialogProps {
  taskId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated?: () => void;
  loadTasks: () => void
}

export function TaskDialog({
  taskId,
  open,
  onOpenChange,
  onTaskUpdated,
  loadTasks
}: TaskDialogProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimeId, setCurrentTimeId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  // Calculate total time spent on task
  const calculateTotalTime = (timeEntries: TimeEntry[]): number => {
    if (!timeEntries) return 0;
    return timeEntries.reduce((total, entry) => {
      if (!entry.ended) return total;

      const start = new Date(entry.stated).getTime();
      const end = new Date(entry.ended).getTime();
      return total + (end - start);
    }, 0);
  };

  // Format milliseconds to hours, minutes, seconds
  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch task data when dialog opens
  useEffect(() => {

    const fetchTask = async () => {
      if (open && taskId) {
        setIsLoading(true);
        try {
          const result = await getTaskById(taskId);
          if (result.success && result.task) {
            setTask(result.task);
            setEditedTask(result.task);

            // Check if there's an ongoing timer
            const currentTimer = result.task.time.find((t: TimeEntry) => t.stated && !t.ended);
            if (currentTimer) {
              setIsTimerRunning(true);
              setCurrentTimeId(currentTimer._id || null);
            } else {
              setIsTimerRunning(false);
              setCurrentTimeId(null);
            }
          } else {
            toast.error(result.error || "Failed to fetch task details");
          }
        } catch (error) {
          if (error)
            toast.error("An error occurred while fetching task");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTask();
  }, [open, taskId, editMode]);

  // Handle timer start
  const handleStartTimer = async () => {

    if (!task) return;


    setIsLoading(true);
    try {
      // Add new time entry
      const now = new Date();
      const updatedTask = {
        ...task,
        status: 'in progress' as const,
        time: [...task.time, { stated: now }]
      };

      const result = await updateTask(task._id, updatedTask);

      if (result.success) {
        setTask(result.task);
        setIsTimerRunning(true);
        toast.success("Timer started");
      } else {
        toast.error(result.error || "Failed to start timer");
      }
    } catch (error) {
      if (error)
        toast.error("An error occurred while starting timer");
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false)
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

  const estimatedTimeValue = editedTask.estimatedTime;

  // Normalize: handle both Date string & number cases
  const timeMs =
    typeof estimatedTimeValue === "string"
      ? new Date(estimatedTimeValue).getUTCHours() * 60 * 60 * 1000 +
      new Date(estimatedTimeValue).getUTCMinutes() * 60 * 1000
      : estimatedTimeValue || 0;

  // Convert milliseconds into hours and minutes
  const hours = Math.floor(timeMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));


  // Handle timer stop
  const handleStopTimer = async () => {
    if (!task) return;

    setIsLoading(true);
    try {
      // Find the current active time entry and update it
      const updatedTime = task.time.map(entry => {
        if (entry.stated && !entry.ended) {
          return { ...entry, ended: new Date() };
        }
        return entry;
      });

      const result = await updateTask(task._id, {
        time: updatedTime
      });

      if (result.success) {
        setTask(result.task);
        setIsTimerRunning(false);
        setCurrentTimeId(null);
        toast.success("Timer stopped");
      } else {
        toast.error(result.error || "Failed to stop timer");
      }
    } catch (error: unknown) {
      if (error)
        toast.error("An error occurred while stopping timer");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task update when dialog is closed
  const handleDialogClose = async (open: boolean) => {
    if (!open && editMode && task) {
      // Compare if there are any changes
      let hasChanges = false;
      for (const key in editedTask) {
        if (JSON.stringify(editedTask[key]) !== JSON.stringify(task[key as keyof Task])) {
          hasChanges = true;
          break;
        }
      }

      if (hasChanges) {
        setIsLoading(true);
        try {
          const result = await updateTask(task._id, editedTask);

          if (result.success) {
            toast.success("Task updated successfully");
            if (onTaskUpdated) onTaskUpdated();
          } else {
            toast.error(result.error || "Failed to update task");
          }
        } catch (error) {
          if (error)
            toast.error("An error occurred while updating task");
        } finally {
          setIsLoading(false);
        }
      }

      setEditMode(false);
    }

    onOpenChange(open);
  };

  // Handle input changes in edit mode
  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  // Priority badge renderer
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1"><ArrowUpCircle className="w-3 h-3" /> High</Badge>;
      case 'low':
        return <Badge variant="outline" className="flex items-center gap-1"><ArrowDownCircle className="w-3 h-3" /> Low</Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1"><MinusCircle className="w-3 h-3" /> Normal</Badge>;
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Hourglass className="w-3 h-3" /> Pending</Badge>;
      case 'to do':
        return <Badge variant="secondary" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> To Do</Badge>;
      case 'in progress':
        return <Badge variant="default" className="flex items-center gap-1"><Play className="w-3 h-3" /> In Progress</Badge>;
      case 'done':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!task && open && isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 rounded-xl border-0 shadow-2xl bg-white dark:bg-gray-950">
        <DialogHeader className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex w-full  font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {editMode ? 'Edit Task' : 'Task Details'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {task.createdAt && format(new Date(task.createdAt), 'PPP')}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {task.updatedAt && formatDistance(new Date(task.updatedAt), new Date(), { addSuffix: true })}
                </span>
              </DialogDescription>
            </div>
            <div className="newyork flex justify-end flex-wrap gap-3">
              {/* Edit / Discard Button */}
              <Button
                onClick={() => setEditMode(!editMode)}
                size="sm"
                variant={editMode ? "default" : "outline"}
                className={`flex items-center justify-center gap-2 h-9 px-6 rounded-md font-semibold transition-all duration-300 
      ${editMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-md hover:shadow-lg"
                    : "border border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 shadow-sm hover:shadow-md"
                  }`}
              >
                {editMode ? (
                  <>
                    <X className="w-4 h-4" />
                    Discard
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Edit
                  </>
                )}
              </Button>

              {/* Save / Close Button */}
              {editMode ? (
                <Button
                  onClick={async () => {
                    await updateTask(task._id, editedTask);
                    setEditMode(false);
                    loadTasks();
                  }}
                  disabled={isLoading}
                  variant="default"
                  className="flex items-center justify-center gap-2 h-9 px-6 rounded-md font-semibold transition-all duration-300 
        bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </Button>
              ) : (
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-9 px-6 rounded-md font-semibold transition-all duration-300 
        border border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 shadow-sm hover:shadow-md"
                >
                  Close
                </Button>
              )}
            </div>


          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-full mx-auto mb-6 h-11 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                <TabsTrigger
                  value="details"
                  className="font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="time"
                  className="font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Time Tracking
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 pt-2">
                {/* Task Title */}
                {editMode ? (
                  <div className="space-y-2.5">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Task Title
                    </Label>
                    <Input
                      id="title"
                      value={editedTask.title || task.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="h-12 text-base font-medium border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 transition-all"
                      placeholder="Enter task title"
                    />
                  </div>
                ) : (
                  <div className="pb-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{task.title}</h2>
                  </div>
                )}

                {/* Task Status and Priority */}
                <div className="flex flex-wrap gap-5 items-start">
                  {editMode ? (
                    <>
                      <div className="space-y-2.5 flex-1 min-w-[180px]">
                        <Label htmlFor="status" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Status
                        </Label>
                        <Select
                          value={editedTask.status || task.status}
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
                          <SelectTrigger className="h-11 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                                  <Clock className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                                </div>
                                <span className="font-medium">Pending</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="to do">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                                  <ListTodo className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
                                </div>
                                <span className="font-medium">To Do</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="in progress">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                                  <Loader2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-500" />
                                </div>
                                <span className="font-medium">In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="done">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                                </div>
                                <span className="font-medium">Done</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2.5 flex-1 min-w-[180px]">
                        <Label htmlFor="priority" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Priority
                        </Label>
                        <Select
                          value={editedTask.priority || task.priority}
                          onValueChange={(value) => handleInputChange('priority', value)}
                        >
                          <SelectTrigger className="h-11 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                                  <ArrowUpCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                                </div>
                                <span className="font-medium">High</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="normal">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                                  <MinusCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
                                </div>
                                <span className="font-medium">Normal</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2.5">
                                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                                  <ArrowDownCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                                </div>
                                <span className="font-medium">Low</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-3">
                      {renderStatusBadge(task.status)}
                      {renderPriorityBadge(task.priority)}
                    </div>
                  )}
                </div>

                <Separator className="my-5 bg-gray-200 dark:bg-gray-800" />

                {/* Task Description */}
                <div className="space-y-3">
                  {editMode ? (
                    <>
                      <Label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={editedTask.description || task.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="min-h-36 text-base leading-relaxed border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 transition-all resize-none"
                        placeholder="Enter task description"
                      />
                    </>
                  ) : (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
                        Description
                      </Label>
                      <div className="prose dark:prose-invert max-w-none bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed m-0">{task.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-5 bg-gray-200 dark:bg-gray-800" />

                {/* Estimated Time */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                    Estimated Completion Time
                  </Label>
                  {editMode ? (
                    <div className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Hours</Label>
                        <div className="relative group">
                          {/* Hours Input */}
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={hours || ""}  // 👈 here’s your value attribute
                            onChange={(e) => {
                              const newHours = parseInt(e.target.value) || 0;
                              const totalMilliseconds = (newHours * 60 * 60 * 1000) + (minutes * 60 * 1000);
                              handleInputChange('estimatedTime', totalMilliseconds);
                            }}
                            className="h-12 text-base font-semibold border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 pr-14 transition-all"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-semibold pointer-events-none bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            hrs
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Minutes</Label>
                        <div className="relative group">
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="0"
                            value={minutes || ""}  // 👈 value attribute for minutes
                            onChange={(e) => {
                              const newMinutes = parseInt(e.target.value) || 0;
                              const totalMilliseconds = (hours * 60 * 60 * 1000) + (newMinutes * 60 * 1000);
                              handleInputChange('estimatedTime', totalMilliseconds);
                            }}
                            className="h-12 text-base font-semibold border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 pr-14 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 font-semibold pointer-events-none bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            min
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm">
                      <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                      </div>
                      {task.estimatedTime ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Duration</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{formatEstimatedTime(task.estimatedTime)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">No estimated time set</span>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="time" className="space-y-5 pt-2">
                <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Time Tracking
                          </CardTitle>
                          <CardDescription className="text-sm font-semibold mt-1 flex items-center gap-2">
                            Total time:
                            <span className="text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-full">
                              {formatTime(calculateTotalTime(task.time))}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center gap-3">
                        {isTimerRunning ? (
                          <>
                            <span className="relative flex h-4 w-4">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 shadow-lg"></span>
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Timer Running</span>
                              <span className="text-xs text-green-600 dark:text-green-500 font-medium">Active session in progress</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-700 shadow-inner"></span>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Timer Stopped</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ready to start</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        {isTimerRunning ? (
                          <Button
                            variant="destructive"
                            size="default"
                            onClick={handleStopTimer}
                            disabled={isLoading}
                            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                          >
                            <Square className="w-4 h-4" />
                            Stop Timer
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="default"
                            onClick={handleStartTimer}
                            disabled={isLoading}
                            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          >
                            <Play className="w-4 h-4" />
                            Start Timer
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                        Time Entries
                      </Label>
                      <div className="max-h-72 overflow-y-auto space-y-2.5 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        {task.time?.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-8">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                              <Timer className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium">No time entries yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start the timer to create your first entry</p>
                          </div>
                        ) : (
                          [...task.time].reverse().map((entry, index) => (
                            <div
                              key={index}
                              className={`
                            "border-2 rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
                            ${!entry.ended}
                              ? "border-green-300 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30" 
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" `
                              }
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`
                                "p-2 rounded-lg"
                                ${!entry.ended}
                                  ? "bg-green-100 dark:bg-green-900/50" 
                                  : "bg-blue-100 dark:bg-blue-900/50"
                              `}>
                                    <Timer className={`
                                  "w-4 h-4",
                                  ${!entry.ended}
                                    ? "text-green-600 dark:text-green-500" 
                                    : "text-blue-600 dark:text-blue-500"
                                `} />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                      {format(new Date(entry.stated), 'PPp')}
                                    </span>
                                    {entry.ended ? (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        Ended: {format(new Date(entry.ended), 'PPp')}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-green-600 dark:text-green-500 font-bold animate-pulse flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                                        Currently active
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {entry.ended && (
                                  <span className="text-sm font-bold px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                                    {formatTime(new Date(entry.ended).getTime() - new Date(entry.stated).getTime())}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}