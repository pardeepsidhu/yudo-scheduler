// components/TaskDialog.tsx
import { useState, useEffect } from 'react';
import { getTaskById, updateTask } from '../api/taskApi';
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
  ArrowDownCircle
} from 'lucide-react';

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
}

export function TaskDialog({ 
  taskId,
  open, 
  onOpenChange,
  onTaskUpdated
}: TaskDialogProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimeId, setCurrentTimeId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  

  // Calculate total time spent on task
  const calculateTotalTime = (timeEntries: TimeEntry[]): number => {
    if(!timeEntries) return 0;
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
    console.log("loaded show reminder")
    const fetchTask = async () => {
      if (open && taskId) {
        setIsLoading(true);
        try {
          const result = await getTaskById(taskId);
          if (result.success && result.task) {
            setTask(result.task);
            setEditedTask(result.task);
            
            // Check if there's an ongoing timer
            const currentTimer = result.task.time.find((t:TimeEntry) => t.stated && !t.ended);
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
          if(error)
          toast.error("An error occurred while fetching task");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTask();
  }, [open, taskId,editMode]);

  // Handle timer start
  const handleStartTimer = async () => {
    console.log("stardy")
    if (!task) return;
    console.log("endy")
    
    setIsLoading(true);
    try {
      // Add new time entry
      const now = new Date();
      const updatedTask = {
        ...task,
        status: 'in progress' as const,
        time: [...task.time, { stated: now }]
      };
      
      const result = await updateTask( task._id, updatedTask);
      
      if (result.success) {
        setTask(result.task);
        setIsTimerRunning(true);
        toast.success("Timer started");
      } else {
        toast.error(result.error || "Failed to start timer");
      }
    } catch (error) {
      if(error)
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
      
      const result = await updateTask( task._id, { 
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
    } catch (error:unknown) {
      if(error)
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
          const result = await updateTask( task._id, editedTask);
          
          if (result.success) {
            toast.success("Task updated successfully");
            if (onTaskUpdated) onTaskUpdated();
          } else {
            toast.error(result.error || "Failed to update task");
          }
        } catch (error) {
          if(error)
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
    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-lg border shadow-lg">
      <DialogHeader className="p-6 border-b bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">{editMode ? 'Edit Task' : 'Task Details'}</DialogTitle>
          <Button 
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            variant={editMode ? "default" : "outline"} 
            size="sm" 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Discard Changes' : 'Edit'}
          </Button>
        </div>
        <DialogDescription className="text-sm text-muted-foreground mt-1">
          Created {task.createdAt && format(new Date(task.createdAt), 'PPP')} • 
          Last updated {task.updatedAt && formatDistance(new Date(task.updatedAt), new Date(), { addSuffix: true })}
        </DialogDescription>
      </DialogHeader>
      
      <div className="p-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="details" className="font-medium">Details</TabsTrigger>
            <TabsTrigger value="time" className="font-medium">Time Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-5 pt-2">
            {/* Task Title */}
            {editMode ? (
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                <Input 
                  id="title" 
                  value={editedTask.title || task.title} 
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{task.title}</h2>
            )}
            
            {/* Task Status and Priority */}
            <div className="flex flex-wrap gap-4 items-center">
              {editMode ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                    <Select 
                      value={editedTask.status || task.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger className="w-40 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="to do">To Do</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                    <Select 
                      value={editedTask.priority || task.priority} 
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger className="w-40 border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  {renderStatusBadge(task.status)}
                  {renderPriorityBadge(task.priority)}
                </div>
              )}
            </div>
            
            {/* Task Description */}
            <div className="space-y-2 pt-2">
              {editMode ? (
                <>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea 
                    id="description" 
                    value={editedTask.description || task.description} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-32 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                  />
                </>
              ) : (
                <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{task.description}</p>
                </div>
              )}
            </div>
            
            {/* Estimated Time */}
            <div className="pt-3 pb-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Estimated Completion</Label>
              {editMode ? (
                <div className="flex gap-3 items-center">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex-1">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Hours"
                      value={editedTask.estimatedTime ? 
                        Math.floor(editedTask.estimatedTime / (1000 * 60 * 60)) : 
                        ''}
                      onChange={(e) => {
                        const hours = parseInt(e.target.value) || 0;
                        const minutes = editedTask.estimatedTime ? 
                          Math.floor((editedTask.estimatedTime % (1000 * 60 * 60)) / (1000 * 60)) : 
                          0;
                        const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
                        handleInputChange('estimatedTime', totalMilliseconds);
                      }}
                      className="border-gray-300 dark:border-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">hours</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-2 flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Minutes"
                      value={editedTask.estimatedTime ? 
                        Math.floor((editedTask.estimatedTime % (1000 * 60 * 60)) / (1000 * 60)) : 
                        ''}
                      onChange={(e) => {
                        const minutes = parseInt(e.target.value) || 0;
                        const hours = editedTask.estimatedTime ? 
                          Math.floor(editedTask.estimatedTime / (1000 * 60 * 60)) : 
                          0;
                        const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
                        handleInputChange('estimatedTime', totalMilliseconds);
                      }}
                      className="border-gray-300 dark:border-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">minutes</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  {task.estimatedTime ? (
                    <span className="font-medium">{formatEstimatedTime(task.estimatedTime)}</span>
                  ) : (
                    <span className="text-muted-foreground italic">No estimated time set</span>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-4 pt-2">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Time Tracking
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Total time: <span className="text-primary">{formatTime(calculateTotalTime(task.time))}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    {isTimerRunning ? (
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    ) : (
                      <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    )}
                    <span className="text-sm font-medium">
                      {isTimerRunning ? 'Timer Running' : 'Timer Stopped'}
                    </span>
                  </div>
                  <div>
                    {isTimerRunning ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleStopTimer}
                        disabled={isLoading}
                        className="flex items-center gap-1 shadow-sm hover:shadow transition-all"
                      >
                        <Square className="w-4 h-4" /> Stop
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleStartTimer}
                        disabled={isLoading}
                        className="flex items-center gap-1 shadow-sm hover:shadow transition-all"
                      >
                        <Play className="w-4 h-4" /> Start
                      </Button>
                    )}
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Entries</Label>
                  <div className="max-h-64 overflow-y-auto space-y-2 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                    {task.time?.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <p className="text-sm text-muted-foreground italic">No time entries yet</p>
                      </div>
                    ) : (
                      [...task.time].reverse().map((entry, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-md p-3 ${!entry.ended ? 'border-primary/30 bg-primary/5' : 'bg-gray-50 dark:bg-gray-900'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">
                                {format(new Date(entry.stated), 'PPp')}
                              </span>
                            </div>
                            {entry.ended && (
                              <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                                {formatTime(new Date(entry.ended).getTime() - new Date(entry.stated).getTime())}
                              </span>
                            )}
                          </div>
                          {entry.ended ? (
                            <div className="flex items-center gap-2 mt-2 pl-6">
                              <span className="text-sm text-muted-foreground">
                                Ended: {format(new Date(entry.ended), 'PPp')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2 pl-6">
                              <span className="text-sm text-green-500 font-medium animate-pulse">
                                Currently active
                              </span>
                            </div>
                          )}
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
      
      <DialogFooter className="flex justify-between items-center p-6 border-t bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-muted-foreground">
          {/* ID: {task._id} */}
        </div>
        {editMode ? (
          <Button 
            variant="default" 
            onClick={async() => { await updateTask(task._id, editedTask); setEditMode(false); }}
            disabled={isLoading}
            className="shadow-sm hover:shadow transition-all"
          >
            Save Changes
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}