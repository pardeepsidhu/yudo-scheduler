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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{editMode ? 'Edit Task' : 'Task Details'}</DialogTitle>
            <Button 
            className='mr-5'
              variant={editMode ? "default" : "outline"} 
              size="sm" 
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Discard Changes' : 'Edit'}
            </Button>
          </div>
          <DialogDescription>
            Created {
          task.createdAt &&  format(new Date(task.createdAt), 'PPP')
            } {"  "} • Last updated {" "}
            { 
          task.updatedAt && formatDistance(new Date(task.updatedAt), new Date(), { addSuffix: true })
            }
          </DialogDescription>
        </DialogHeader>
        
      
<Tabs defaultValue="details">
  <TabsList className="grid grid-cols-2  mx-auto sm:mx-0">
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="time">Time Tracking</TabsTrigger>
  </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            {/* Task Title */}
            {editMode ? (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={editedTask.title || task.title} 
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold">{task.title}</h2>
            )}
            
            {/* Task Status and Priority */}
            <div className="flex flex-wrap gap-2 items-center">
              {editMode ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={editedTask.status || task.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger className="w-32">
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={editedTask.priority || task.priority} 
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger className="w-32">
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
                <>
                  {renderStatusBadge(task.status)}
                  {renderPriorityBadge(task.priority)}
                </>
              )}
            </div>
            
            {/* Task Description */}
            <div className="space-y-2">
              {editMode ? (
                <>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={editedTask.description || task.description} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-32"
                  />
                </>
              ) : (
                <div className="prose dark:prose-invert">
                  <p className="whitespace-pre-wrap">{task.description}</p>
                </div>
              )}
            </div>
            
            {/* Estimated Time */}
            <div className="pt-2">
              <Label className="text-sm text-muted-foreground mb-1 block">Estimated Completion</Label>
              {editMode ? (
             <div className="flex gap-2">
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
               className="w-1/2"
             />
             <span className="self-center">hours</span>
             
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
               className="w-1/2"
             />
             <span className="self-center">minutes</span>
           </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {task.estimatedTime ? (
                    formatEstimatedTime(task.estimatedTime)
                  ) : (
                    <span className="text-muted-foreground">No estimated time set</span>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-2 sm:space-y-4 pt-1 sm:pt-4 ">
            <Card>
              <CardHeader className="pb-1 sm:pb-2">
                <CardTitle className="text-lg">Time Tracking</CardTitle>
                <CardDescription>
                  Total time: {formatTime(calculateTotalTime(task.time))}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 px-2 sm:px-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
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
                        className="flex items-center gap-1"
                      >
                        <Square className="w-4 h-4" /> Stop
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleStartTimer}
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" /> Start
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Time Entries</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2 p-1">
                    {task.time?.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No time entries yet</p>
                    ) : (
               [...task.time].reverse().map((entry, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-md p-2 ${!entry.ended ? 'border-primary bg-primary/5' : ''}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                Started: {format(new Date(entry.stated), 'PPp')}
                              </span>
                            </div>
                            {entry.ended && (
                              <span className="text-sm">
                                Duration: {formatTime(new Date(entry.ended).getTime() - new Date(entry.stated).getTime())}
                              </span>
                            )}
                          </div>
                          {entry.ended && (
                            <div className="flex items-center gap-2 mt-1 pl-6">
                              <span className="text-sm text-muted-foreground">
                                Ended: {format(new Date(entry.ended), 'PPp')}
                              </span>
                            </div>
                          )}
                          {!entry.ended && (
                            <div className="flex items-center gap-2 mt-1 pl-6">
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
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {/* ID: {task._id} */}
          </div>
          {editMode ? (
            <Button 
              variant="default" 
              onClick={async() => { await updateTask(task._id,editedTask); setEditMode(false); } }
              disabled={isLoading}
            >
              Save Changes
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}