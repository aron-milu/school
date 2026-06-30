import { supabase } from '../lib/supabaseClient';
import type { TeacherOnboardingPayload, FileMeta, StorageBucket } from '../types';
import { updateDocuments } from './studentRepository';

// Mock verification repository for student/class codes
const MOCK_CODES = {
  'CLASS-101': { institutionId: '550e8400-e29b-41d4-a716-446655440001', classId: 'class-101' },
  'INST-550': { institutionId: '550e8400-e29b-41d4-a716-446655440001' },
};

export async function verifyStudentCode(code: string): Promise<{ valid: boolean; institutionId?: string; classId?: string }>{
  await new Promise(r => setTimeout(r, 300));
  const entry = MOCK_CODES[code?.trim()?.toUpperCase()];
  return { valid: !!entry, institutionId: entry?.institutionId, classId: entry?.classId };
}

export async function submitTeacherOnboarding(payload: TeacherOnboardingPayload): Promise<{ ok: boolean; id?: string }>{
  await new Promise(r => setTimeout(r, 600));

  try {
    if (supabase) {
      const insert = await supabase.from('kyc_records').insert({
        profile: payload.profile,
        curriculum: payload.curriculum,
        files: payload.kyc,
      });
      if (insert.error) {
        console.warn('supabase insert failed', insert.error.message);
      }
    }
  } catch (err) {
    console.warn('submitTeacherOnboarding warning', err);
  }

  return { ok: true, id: `onboard-${Math.random().toString(36).slice(2,9)}` };
}

export async function uploadFileMock(file: File, onProgress?: (p: number)=>void): Promise<FileMeta> {
  return new Promise((resolve, reject) => {
    const total = file.size || 1000000;
    let uploaded = 0;
    const id = setInterval(() => {
      uploaded += Math.max(32768, Math.round(total * 0.1));
      const percent = Math.min(100, Math.round((uploaded / total) * 100));
      onProgress?.(percent);
      if (percent >= 100) {
        clearInterval(id);
        resolve({ bucket: 'kyc-documents' as any, path: `mock/${Date.now()}_${file.name}`, mimeType: file.type, size: file.size });
      }
    }, 150);
    setTimeout(() => { if (uploaded < total) { clearInterval(id); resolve({ bucket: 'kyc-documents' as any, path: `mock/${Date.now()}_${file.name}`, mimeType: file.type, size: file.size }); } }, 5000);
  });
}

export async function uploadMaterialMock(formData: FormData, onProgress?: (p:number)=>void): Promise<{ ok: boolean; url?: string }> {
  const total = 100;
  let progress = 0;
  return new Promise((resolve) => {
    const id = setInterval(() => {
      progress += 10;
      onProgress?.(progress);
      if (progress >= total) { clearInterval(id); resolve({ ok: true, url: 'https://cdn.soma365.mock/materials/' + Date.now() }); }
    }, 120);
  });
}

/**
 * Upload KYC document and store with proper bucket categorization.
 * Routes files through StorageBucket enum for organized storage.
 */
export async function uploadKYCDocument(
  studentId: string,
  file: File,
  bucket: StorageBucket,
  onProgress?: (p: number) => void
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    // Validate file
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
      return { ok: false, error: 'Unsupported file type. Use PDF or images.' };
    }
    if (file.size > 50_000_000) {
      return { ok: false, error: 'File too large (max 50MB)' };
    }

    // Simulate upload with progress
    const fileMeta = await uploadFileMock(file, onProgress);
    
    // Mock public URL
    const mockUrl = `https://storage.soma365.mock/${bucket}/${studentId}/${Date.now()}_${file.name}`;

    // Update student documents in repository
    await updateDocuments(studentId, bucket, 'kycDocumentUrl', mockUrl);

    return { ok: true, url: mockUrl };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
