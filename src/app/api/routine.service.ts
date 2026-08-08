// file: src/api/routineApi.ts
'use client'

import { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type RoutinePriority = 'critical' | 'high' | 'medium' | 'low' | 'optional';
export type RoutineRepeatType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type RoutineDateMode = 'single' | 'range' | 'until' | 'forever';
export type RoutineStatus = 'active' | 'paused' | 'archived';

export interface WeeklyRepeatConfig {
  days: number[]; // 0-6
}

export interface MonthlyRepeatConfig {
  day: number;
}

export interface CustomRepeatConfig {
  interval: number;
  unit: 'days' | 'weeks' | 'months';
}

export type RepeatConfig = WeeklyRepeatConfig | MonthlyRepeatConfig | CustomRepeatConfig | Record<string, unknown>;

export interface RoutineData {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority: RoutinePriority;
  color?: string;
  icon?: string;
  repeatType: RoutineRepeatType;
  repeatConfig: RepeatConfig;
  dateMode: RoutineDateMode;
  startDate: string;
  endDate?: string;
  skipDates: string[];
  allDay: boolean;
  startTime?: string | null;
  endTime?: string | null;
  estimatedMinutes?: number;
  location?: string;
  notes?: string;
  tags: string[];
  status: RoutineStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineTaskData {
  id: string;
  routineId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
  Task?: unknown;
}

export interface RoutineReminderData {
  id: string;
  routineId: string;
  emailId: string;
  createdAt: string;
  updatedAt: string;
  Email?: unknown;
}

export interface RoutinesResponse {
  routines: RoutineData[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface RoutineTasksResponse {
  tasks: RoutineTaskData[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface RoutineRemindersResponse {
  reminders: RoutineReminderData[];
  total: number;
  limit: number;
  skip: number;
  hasMore: boolean;
}

export interface CreateRoutinePayload {
  title: string;
  description?: string;
  category?: string;
  priority?: RoutinePriority;
  color?: string;
  icon?: string;
  repeatType?: RoutineRepeatType;
  repeatConfig?: RepeatConfig;
  dateMode?: RoutineDateMode;
  startDate: string;
  endDate?: string;
  skipDates?: string[];
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  estimatedMinutes?: number;
  location?: string;
  notes?: string;
  tags?: string[];
  status?: RoutineStatus;
}

export type UpdateRoutinePayload = Partial<CreateRoutinePayload>;

export interface FetchRoutinesOptions {
  limit?: number;
  skip?: number;
  page?: number;
  priority?: RoutinePriority;
  status?: RoutineStatus;
  repeatType?: RoutineRepeatType;
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchSubResourceOptions {
  limit?: number;
  skip?: number;
  page?: number;
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

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

const authHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    'Content-Type': 'application/json',
    'auth-token': token,
  };
};

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/routine`;

// ─────────────────────────────────────────────────────────
// Routine CRUD
// ─────────────────────────────────────────────────────────

export async function createRoutine(payload: CreateRoutinePayload): Promise<{ message: string; routine: RoutineData }> {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create routine');
  }

  return await response.json();
}

export async function fetchRoutines(options?: FetchRoutinesOptions): Promise<RoutinesResponse> {
  const query = buildQuery({
    limit: options?.limit,
    skip: options?.skip,
    page: options?.page,
    priority: options?.priority,
    status: options?.status,
    repeatType: options?.repeatType,
    category: options?.category,
    search: options?.search,
    startDate: options?.startDate,
    endDate: options?.endDate,
  });

  const response = await fetch(`${BASE_URL}${query}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch routines');
  }

  return await response.json();
}

export async function fetchRoutineById(id: string): Promise<RoutineData> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch routine');
  }

  return await response.json();
}

export async function updateRoutine(id: string, payload: UpdateRoutinePayload): Promise<{ message: string; routine: RoutineData }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update routine');
  }

  return await response.json();
}

export async function deleteRoutine(id: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete routine');
  }

  return await response.json();
}

// ─────────────────────────────────────────────────────────
// Routine <-> Task links
// ─────────────────────────────────────────────────────────

export async function addRoutineTask(routineId: string, taskId: string): Promise<{ message: string; routineTask: RoutineTaskData }> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ routineId, taskId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to attach task to routine');
  }

  return await response.json();
}

export async function fetchRoutineTasks(routineId: string, options?: FetchSubResourceOptions): Promise<RoutineTasksResponse> {
  const query = buildQuery({
    limit: options?.limit,
    skip: options?.skip,
    page: options?.page,
  });

  const response = await fetch(`${BASE_URL}/${routineId}/tasks${query}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch routine tasks');
  }

  return await response.json();
}

export async function removeRoutineTask(routineTaskId: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/tasks/${routineTaskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to remove task from routine');
  }

  return await response.json();
}

// ─────────────────────────────────────────────────────────
// Routine <-> Reminder (Email) links
// ─────────────────────────────────────────────────────────

export async function addRoutineReminder(routineId: string, emailId: string): Promise<{ message: string; routineReminder: RoutineReminderData }> {
  const response = await fetch(`${BASE_URL}/reminders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ routineId, emailId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to attach reminder to routine');
  }

  return await response.json();
}

export async function fetchRoutineReminders(routineId: string, options?: FetchSubResourceOptions): Promise<RoutineRemindersResponse> {
  const query = buildQuery({
    limit: options?.limit,
    skip: options?.skip,
    page: options?.page,
  });

  const response = await fetch(`${BASE_URL}/${routineId}/reminders${query}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch routine reminders');
  }

  return await response.json();
}

export async function removeRoutineReminder(routineReminderId: string): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/reminders/${routineReminderId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to remove reminder from routine');
  }

  return await response.json();
}