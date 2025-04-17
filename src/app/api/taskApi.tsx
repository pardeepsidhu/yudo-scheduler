// file: src/api/taskApi.ts
'use client'

import { useEffect, useState } from 'react';

// Define interfaces
export type TaskStatus = 'pending' | 'to do' | 'in progress' | 'done';
export type TaskPriority = 'high' | 'normal' | 'low';

export interface TimeEntry {
  started: Date;
  ended?: Date;
  _id?: string;
}

export interface TaskData {
  _id: string;
  user: string;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime?: Date;
  time: TimeEntry[];
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  estimatedTime?: Date;
  time: TimeEntry[];
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  user: string;
}

export interface TasksResponse {
  tasks: TaskData[];
  total: number;
}

// Helper function to safely get token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.token;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
  }
  return null;
};

export async function fetchTasks(options?: { 
  limit?: number;
  skip?: number;
  priority?: 'high' | 'normal' | 'low';
}): Promise<TasksResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const queryParams = new URLSearchParams();
  
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.skip) queryParams.append('skip', options.skip.toString());
  if (options?.priority) queryParams.append('priority', options.priority);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return await response.json();
}

export async function fetchTaskById(id: string): Promise<TaskData> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return await response.json();
}

export async function createTask(task: Omit<TaskData, '_id' | 'user' | 'createdAt' | 'updatedAt'>): Promise<{message: string; task: TaskData}> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify(task),
  });

  return await response.json();
}

export async function deleteTask(id: string): Promise<{message: string}> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
  });

  

  return await response.json();
}

/**
 * Fetches a single task by its ID
 * @param taskId The ID of the task to retrieve
 */
export const getTaskById = async (taskId: string) => {
  const token = getAuthToken();
  if (!token) {
    return { 
      error: "Authentication token not found",
      success: false
    };
  }

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task/${taskId}`;

    const response = await fetch(endpoint, {
      headers: {
        "auth-token": token
      }
    });
    
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error, success: false };
    }
    
    return {
      task: data,
      success: true
    };
  } catch (error) {
    return { 
      error: "Failed to fetch task details. Please try again.",
      success: false
    };
  }
};

/**
 * Updates a task's details
 * @param taskId The ID of the task to update
 * @param updatedTask Object containing the task fields to update
 */
export const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
  const token = getAuthToken();
  console.log('fuction run')
  if (!token) {
    return { 
      error: "Authentication token not found",
      success: false
    };
  }

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/task/${taskId}`;
   
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        "auth-token": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    });
    
    const data = await response.json();
    
    if (data.error) {
      return { 
        error: data.error,
        success: false
      };
    }
    console.log(data)
    return {
      task: data.task,
      success: true,
      message: "Task updated successfully"
    };
  } catch (error) {
    return { 
      error: "Failed to update task. Please try again.",
      success: false
    };
  }
};