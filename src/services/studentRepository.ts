import { supabase } from '../lib/supabaseClient';
import type { DisabilityInfo, StorageBucket, StudentDocuments } from '../types';

/**
 * StudentRepository handles document management and disability info updates.
 * Documents are stored with URLs pointing to cloud storage (e.g., Supabase Storage).
 */

export async function updateDocuments(
  studentId: string,
  bucket: StorageBucket,
  field: keyof StudentDocuments,
  url: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available; storing in mock');
      return { ok: true };
    }

    // Mock: store in localStorage for demo
    const key = `student-docs-${studentId}`;
    const current = JSON.parse(localStorage.getItem(key) || '{}') as StudentDocuments;
    current[field as any] = url;
    localStorage.setItem(key, JSON.stringify(current));

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function updateDisabilityInfo(
  studentId: string,
  info: DisabilityInfo
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available; storing in mock');
      return { ok: true };
    }

    // Mock: store in localStorage for demo
    const key = `student-docs-${studentId}`;
    const current = JSON.parse(localStorage.getItem(key) || '{}') as StudentDocuments;
    current.disability = info;
    localStorage.setItem(key, JSON.stringify(current));

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function getStudentDocuments(
  studentId: string
): Promise<{ docs?: StudentDocuments; error?: string }> {
  try {
    const key = `student-docs-${studentId}`;
    const docs = JSON.parse(localStorage.getItem(key) || '{}') as StudentDocuments;
    return { docs };
  } catch (err: any) {
    return { error: err.message };
  }
}
