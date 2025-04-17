// components/CreateTaskDialog.tsx
'use client'

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, Clock, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// API imports
import { createTask, deleteTask, TaskPriority, TaskStatus } from '../api/taskApi';

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
      estimatedMinutes: 30,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Format data for API
      const estimated = new Date(0); // Epoch
estimated.setUTCHours(data.estimatedHours);
estimated.setUTCMinutes(data.estimatedMinutes);
      const formattedData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        estimatedTime: estimated,
      };

      if (isEditMode && taskToEdit?._id) {
        // Handle edit
        await createTask(formattedData); 
      } else {
        // Handle create
       let response = await createTask(formattedData);
       console.log(response)
      }

    //   toast({
    //     title: isEditMode ? "Task updated" : "Task created",
    //     description: isEditMode 
    //       ? "Your task has been successfully updated." 
    //       : "Your task has been successfully created.",
    //   });
      form.reset();
      onOpenChange(false);
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`,
    //   });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!taskToEdit?._id) return;
    
    try {
      await deleteTask(taskToEdit._id);
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
      <DialogContent className="sm:max-w-[650px] p-0 gap-0 rounded-lg overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-100">
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-600" />
            {isEditMode ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditMode 
              ? "Update your task details below" 
              : "Fill in the details below to create a new task. Fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 overflow-y-auto max-h-[calc(85vh-150px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="space-y-5">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task title"
                          {...field}
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="text-base font-medium">Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter task description"
                          rows={4}
                          {...field}
                          className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Priority and Status in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority Field */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high" className="text-red-600">
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                High
                              </div>
                            </SelectItem>
                            <SelectItem value="normal" className="text-blue-600">
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                                Normal
                              </div>
                            </SelectItem>
                            <SelectItem value="low" className="text-green-600">
                              <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                Low
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-gray-500">
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
                        <FormLabel className="text-base font-medium">Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="to do">To Do</SelectItem>
                            <SelectItem value="in progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-gray-500">
                          Current status of this task
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Card className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Time Estimation
                  </h3>
                  
                  {/* Estimated Time in Hours and Minutes */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Hours</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="999"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Minutes</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    How much time do you expect this task to take?
                  </FormDescription>
                </Card>

               
              </div>

              {isEditMode && showDeleteConfirm ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-6">
                  <h4 className="text-red-700 font-medium">Confirm Deletion</h4>
                  <p className="text-red-600 text-sm mt-1 mb-3">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-gray-700 border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : null}
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 pt-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="flex items-center gap-2">
            {isEditMode && !showDeleteConfirm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}