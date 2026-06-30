import { useState } from 'react';
import { z } from 'zod';
import type { Curriculum, FileMeta, TeacherOnboardingPayload } from '../types';
import { uploadFileMock } from '../services/onboardingService';

const Step1Schema = z.object({ full_name: z.string().min(2), email: z.string().email().optional(), phone: z.string().optional(), institutionId: z.string().min(1) });
const Step2Schema = z.object({ files: z.array(z.instanceof(File)).min(1) });
const Step3Schema = z.object({ curriculum: z.any() });

export function useTeacherOnboarding() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<{ full_name: string; email?: string; phone?: string; institutionId: string }>({ full_name: '', email: undefined, phone: undefined, institutionId: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [fileMetas, setFileMetas] = useState<FileMeta[]>([]);
  const [curriculum, setCurriculum] = useState<Curriculum>({ educationLevel: 'secondary', subjects: [] });
  const [errors, setErrors] = useState<string | null>(null);

  const validateStep = (s = step) => {
    try {
      setErrors(null);
      if (s === 1) Step1Schema.parse(profile);
      if (s === 2) Step2Schema.parse({ files });
      if (s === 3) Step3Schema.parse({ curriculum });
      return true;
    } catch (err) {
      setErrors(err instanceof Error ? err.message : String(err));
      return false;
    }
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(3, s+1)); };
  const back = () => setStep(s => Math.max(1, s-1));

  const addFile = (file: File) => setFiles(f => [...f, file]);
  const removeFileAt = (idx: number) => setFiles(f => f.filter((_,i) => i !== idx));

  const uploadFiles = async (onProgress?: (idx:number,p:number)=>void) => {
    const metas: FileMeta[] = [];
    for (let i=0;i<files.length;i++){
      const file = files[i];
      const meta = await uploadFileMock(file, p => onProgress?.(i,p));
      metas.push(meta);
      setFileMetas(prev => [...prev, meta]);
    }
    return metas;
  };

  const buildPayload = (): TeacherOnboardingPayload => ({ profile, kyc: fileMetas, curriculum });

  return { step, next, back, profile, setProfile, files, addFile, removeFileAt, uploadFiles, fileMetas, setCurriculum, curriculum, validateStep, buildPayload, errors, setErrors };
}
