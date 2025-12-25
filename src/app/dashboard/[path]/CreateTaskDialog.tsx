// components/CreateTaskDialog.tsx
'use client'

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle, Plus, Trash2, ListTodo, Loader2, CheckCircle, ArrowUpCircle, MinusCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// API imports
import { createTask, deleteTask, TaskPriority, TaskStatus } from '../../api/taskApi';

// UI Components
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
  taskToEdit?: any; 
  isEditMode?: boolean;
 loadTasks: ()=>void
}

interface FormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  estimatedMinutes: number;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  loadTasks,
  onTaskCreated,
  taskToEdit,
  isEditMode = false,
}: CreateTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      title: taskToEdit?.title || '',
      description: taskToEdit?.description || '',
      status: taskToEdit?.status || 'pending',
      priority: taskToEdit?.priority || 'normal',
      estimatedHours: 0,
      estimatedMinutes: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Format data for API
      let formattedData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
      };
      
      // Only add estimatedTime if hours or minutes are not 0
      if (data.estimatedHours > 0 || data.estimatedMinutes > 0) {
        const estimated = new Date(0); // Epoch
        estimated.setUTCHours(data.estimatedHours);
        estimated.setUTCMinutes(data.estimatedMinutes);
        formattedData.estimatedTime = estimated;
      }
      
      if (isEditMode && taskToEdit?._id) {
        // Handle edit
        await createTask(formattedData);
        loadTasks()
      } else {
        // Handle create
        let response = await createTask(formattedData);
         loadTasks()
     
      }
    
      form.reset();
      onOpenChange(false);
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
  
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!taskToEdit?._id) return;
    
    try {
      await deleteTask(taskToEdit._id);
      loadTasks()
    //   toast({
    //     title: "Task deleted",
    //     description: "Your task has been successfully deleted.",
    //   });
      onOpenChange(false);
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Failed to delete task. Please try again.",
    //   });
      console.error(error);
    }
  };

  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[700px] p-0 gap-0 rounded-xl overflow-hidden bg-white shadow-2xl border-0">
    <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-1.5">
            {isEditMode 
              ? "Update your task details below" 
              : "Fill in the details below to create a new task. Fields marked with * are required."}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    <div className="px-8 overflow-y-auto max-h-[calc(85vh-180px)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 py-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  Task Title
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Complete project documentation"
                    {...field}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  Description
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of the task..."
                    rows={5}
                    {...field}
                    className="resize-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base leading-relaxed"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Priority and Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="h-1 w-1 rounded-full bg-gray-400"></div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Task Configuration</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Priority Field */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Priority Level
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-red-100 rounded-md">
                              <ArrowUpCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">High Priority</span>
                              <span className="text-xs text-gray-500">Urgent and important</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                              <MinusCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">Normal Priority</span>
                              <span className="text-xs text-gray-500">Standard workflow</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-green-100 rounded-md">
                              <ArrowDownCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">Low Priority</span>
                              <span className="text-xs text-gray-500">Can be deferred</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-gray-500 mt-1.5">
                      Set the importance level of this task
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Current Status
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full transition-all duration-200">
                          <SelectValue placeholder="Select task status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-yellow-100 rounded-md">
                              <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">Pending</span>
                              <span className="text-xs text-gray-500">Awaiting action</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="to do">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                              <ListTodo className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">To Do</span>
                              <span className="text-xs text-gray-500">Ready to start</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="in progress">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-purple-100 rounded-md">
                              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">In Progress</span>
                              <span className="text-xs text-gray-500">Currently working</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="done">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-green-100 rounded-md">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">Done</span>
                              <span className="text-xs text-gray-500">Completed</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-gray-500 mt-1.5">
                      Current progress state of this task
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Time Estimation Section */}
          <Card className="border-2 border-gray-200 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Time Estimation
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Estimate the duration required to complete this task
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-4 bg-gray-300" />
            
            <div className="grid grid-cols-2 gap-5">
              {/* Hours Field */}
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Hours
                      <span className="text-xs text-gray-500 font-normal px-2 py-0.5 bg-gray-100 rounded-full">optional</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="number"
                          min="0"
                          max="999"
                          value={field.value === 0 ? "" : field.value}
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : parseInt(value) || 0);
                          }}
                          className="h-13 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-4 pr-16 text-base font-semibold group-hover:border-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold pointer-events-none bg-gray-100 px-2 py-1 rounded">
                          hrs
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      Maximum 999 hours
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* Minutes Field */}
              <FormField
                control={form.control}
                name="estimatedMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Minutes
                      <span className="text-xs text-gray-500 font-normal px-2 py-0.5 bg-gray-100 rounded-full">optional</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={field.value === 0 ? "" : field.value}
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : parseInt(value) || 0);
                          }}
                          className="h-13 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-4 pr-16 text-base font-semibold group-hover:border-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold pointer-events-none bg-gray-100 px-2 py-1 rounded">
                          min
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      Maximum 59 minutes
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-xs text-blue-900 flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>
                  Time estimates help with planning and tracking progress. Leave blank if you're uncertain about the duration.
                </span>
              </p>
            </div>
          </Card>

          {/* Delete Confirmation Section */}
          {isEditMode && showDeleteConfirm ? (
            <Card className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-xl border-2 border-red-200 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-red-900 font-bold text-base">Confirm Deletion</h4>
                  <p className="text-red-700 text-sm mt-1">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-700 border-gray-300 hover:bg-white font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="default"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 shadow-md font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </Card>
          ) : null}
        </form>
      </Form>
    </div>

    <DialogFooter className="px-8 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-t-2 border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {isEditMode && !showDeleteConfirm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-medium transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Task
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="border-gray-300 hover:bg-gray-100 font-medium px-6 transition-all duration-200"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEditMode ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Task
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}