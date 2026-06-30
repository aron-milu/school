import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadMaterialMock } from '../services/onboardingService';
import type { CurriculumSubject } from '../types';

const Step1Schema = z.object({
  year: z.union([z.literal('2025'), z.literal('2026')]),
  term: z.union([z.literal('Term 1'), z.literal('Term 2'), z.literal('Term 3')]),
  combination: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
});

const Step2Schema = z.object({
  materialType: z.union([z.literal('PDF'), z.literal('Video'), z.literal('External Link')]),
  file: z.any().optional(),
  externalUrl: z.string().url().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export function useMaterialUpload(initialSubjects: CurriculumSubject[] = []){
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const step1 = useForm({ resolver: zodResolver(Step1Schema), defaultValues: { year: '2026', term: 'Term 1', combination: '', subject: '', topic: '' } });
  const step2 = useForm({ resolver: zodResolver(Step2Schema), defaultValues: { materialType: 'PDF', file: undefined, externalUrl: '', title: '', description: '' } });

  const next = async () => {
    const valid = await step1.trigger();
    if (!valid) return false;
    setStep(2); return true;
  };
  const back = () => setStep(s => Math.max(1, s-1));

  const validateFile = (file?: File) => {
    if (!file) return 'No file provided';
    const allowed = ['application/pdf','video/mp4','video/webm','image/png','image/jpeg'];
    if (!allowed.includes(file.type)) return 'Unsupported file type';
    if (file.size > 50_000_000) return 'File too large (max 50MB)';
    return null;
  };

  const handleUpload = async () => {
    setStatusMsg(null);
    const valid1 = await step1.trigger();
    const valid2 = await step2.trigger();
    if (!valid1 || !valid2) { setStatusMsg('Fix validation errors'); return { ok:false }; }

    const data = step1.getValues();
    const info = step2.getValues();

    // prepare FormData
    const formData = new FormData();
    formData.append('context', JSON.stringify(data));
    formData.append('meta', JSON.stringify({ title: info.title, description: info.description, materialType: info.materialType }));

    if (info.materialType === 'External Link') {
      formData.append('externalUrl', info.externalUrl || '');
    } else {
      const f: File | undefined = info.file && info.file[0] ? info.file[0] : undefined;
      const fileError = validateFile(f);
      if (fileError) { setStatusMsg(fileError); return { ok:false }; }
      if (f) formData.append('file', f, f.name);
    }

    try{
      setUploading(true); setProgress(0); setStatusMsg('Uploading...');
      const res = await uploadMaterialMock(formData, p => setProgress(p));
      if (res.ok) { setStatusMsg('Success'); step1.reset(); step2.reset(); setStep(1); setProgress(100); return { ok:true, url: res.url }; }
      setStatusMsg('Upload failed'); return { ok:false };
    }catch(err:any){ setStatusMsg(err?.message || 'Upload error'); return { ok:false }; }
    finally{ setUploading(false); }
  };

  return { step, next, back, step1, step2, handleUpload, uploading, progress, statusMsg };
}
