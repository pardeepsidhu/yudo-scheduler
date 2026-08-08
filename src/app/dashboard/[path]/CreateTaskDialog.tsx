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
import { Checkbox } from '@/components/ui/checkbox';
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
  isPartOfRoutine :boolean
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
        isPartOfRoutine:data?.isPartOfRoutine
      };
      
      // Only add estimatedTime if hours or minutes are not 0
      if (data.estimatedHours > 0 || data.estimatedMinutes > 0) {
        const estimated = new Date(0); // Epoch
        estimated.setUTCHours(data.estimatedHours);
        estimated.setUTCMinutes(data.estimatedMinutes);
        formattedData.estimatedTime = estimated;
      }
      
      if (isEditMode && taskToEdit?.id) {
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
    if (!taskToEdit?.id) return;
    
    try {
      await deleteTask(taskToEdit.id);
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
  <DialogContent className="sm:max-w-[700px] p-0 gap-0 rounded-sm overflow-hidden bg-white shadow-2xl border-0">
    <DialogHeader className="px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        <div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-0.5">
            {isEditMode
              ? "Update your task details below"
              : "Fill in the details below to create a new task. Fields marked with * are required."}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    <div className="px-6 overflow-y-auto max-h-[calc(85vh-180px)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-5">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  Task Title
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Complete project documentation"
                    {...field}
                    className="h-11 border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors text-sm"
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
                <FormLabel className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  Description
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a detailed description of the task..."
                    rows={5}
                    {...field}
                    className="resize-none border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors text-sm leading-relaxed"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Priority and Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-400"></div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Task Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Field */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Priority Level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-200 w-full transition-colors">
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-red-50 rounded-sm">
                              <ArrowUpCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">High Priority</span>
                              <span className="text-xs text-slate-400">Urgent and important</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-blue-50 rounded-sm">
                              <MinusCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">Normal Priority</span>
                              <span className="text-xs text-slate-400">Standard workflow</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-green-50 rounded-sm">
                              <ArrowDownCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">Low Priority</span>
                              <span className="text-xs text-slate-400">Can be deferred</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-slate-400 mt-1.5">
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
                    <FormLabel className="text-sm font-semibold text-slate-900">
                      Current Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-200 w-full transition-colors">
                          <SelectValue placeholder="Select task status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-yellow-50 rounded-sm">
                              <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">Pending</span>
                              <span className="text-xs text-slate-400">Awaiting action</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="to do">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-blue-50 rounded-sm">
                              <ListTodo className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">To Do</span>
                              <span className="text-xs text-slate-400">Ready to start</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="in progress">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-purple-50 rounded-sm">
                              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">In Progress</span>
                              <span className="text-xs text-slate-400">Currently working</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="done">
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="p-1.5 bg-green-50 rounded-sm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 text-sm">Done</span>
                              <span className="text-xs text-slate-400">Completed</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-slate-400 mt-1.5">
                      Current progress state of this task
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Time Estimation Section */}
          <div className="border border-slate-200 p-5 rounded-sm bg-slate-50/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-sm">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Time Estimation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estimate the duration required to complete this task
                </p>
              </div>
            </div>

            <Separator className="my-4 bg-slate-200" />

            <div className="grid grid-cols-2 gap-4">
              {/* Hours Field */}
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      Hours
                      <span className="text-[11px] text-slate-500 font-normal px-2 py-0.5 bg-slate-100 rounded-full">optional</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
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
                          className="h-11 border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors pl-4 pr-14 text-sm font-semibold"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none bg-slate-100 px-2 py-1 rounded-sm">
                          hrs
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 mt-1.5">
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
                    <FormLabel className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      Minutes
                      <span className="text-[11px] text-slate-500 font-normal px-2 py-0.5 bg-slate-100 rounded-full">optional</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
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
                          className="h-11 border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors pl-4 pr-14 text-sm font-semibold"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold pointer-events-none bg-slate-100 px-2 py-1 rounded-sm">
                          min
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 mt-1.5">
                      Maximum 59 minutes
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-sm">
              <p className="text-xs text-blue-900 flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>
                  Time estimates help with planning and tracking progress. Leave blank if you're uncertain about the duration.
                </span>
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="isPartOfRoutine"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-sm border border-slate-200 p-4">
                <div className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-slate-900">
                    Part of Routine
                  </FormLabel>
                  <FormDescription className="text-xs text-slate-500">
                    Mark this task if it is part of a routine.
                  </FormDescription>
                </div>

                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Delete Confirmation Section */}
          {isEditMode && showDeleteConfirm ? (
            <div className="bg-red-50 p-4 rounded-sm border border-red-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-1.5 bg-red-100 rounded-sm">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="text-red-900 font-bold text-sm">Confirm Deletion</h4>
                  <p className="text-red-700 text-xs mt-1">
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
                  className="text-slate-700 border-slate-200 hover:bg-white rounded-sm font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="default"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 rounded-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </Button>
              </div>
            </div>
          ) : null}
        </form>
      </Form>
    </div>

    <DialogFooter className="px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {isEditMode && !showDeleteConfirm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-sm font-medium transition-colors"
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
          className="border-slate-200 hover:bg-slate-50 rounded-sm font-medium px-5 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-sm font-semibold px-6 transition-colors border-transparent"
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