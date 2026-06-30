import { useState } from 'react';
import { z } from 'zod';
import { verifyStudentCode, uploadKYCDocument } from '../services/onboardingService';
import { updateDisabilityInfo } from '../services/studentRepository';
import type { DisabilityInfo, StorageBucket } from '../types';

const StudentStepSchema = z.object({ full_name: z.string().min(2), institutionId: z.string().min(1), classId: z.string().min(1) });
const DisabilitySchema = z.object({
  hasDisability: z.boolean(),
  disabilityType: z.string().optional(),
  accommodations: z.string().optional(),
  notes: z.string().optional(),
});

export function useStudentRegistration(){
  const [step, setStep] = useState(1); // 1=profile, 2=code, 3=documents, 4=disability
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string; email?: string; phone?: string; institutionId?: string; classId?: string }>({ full_name: '', email: undefined, phone: undefined, institutionId: undefined, classId: undefined });
  const [codeStatus, setCodeStatus] = useState<{ valid: boolean; checking?: boolean; msg?: string }>({ valid: false, checking: false });
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [disability, setDisability] = useState<DisabilityInfo>({ hasDisability: false });
  const [errors, setErrors] = useState<string | null>(null);

  const checkCode = async (code: string) => {
    setCodeStatus({ valid: false, checking: true });
    try{
      const res = await verifyStudentCode(code);
      if (!res.valid) {
        setCodeStatus({ valid: false, checking: false, msg: 'Code not found' });
        return false;
      }
      setProfile(p => ({ ...p, institutionId: res.institutionId, classId: res.classId }));
      setCodeStatus({ valid: true, checking: false, msg: 'Code valid' });
      return true;
    }catch(err){
      setCodeStatus({ valid: false, checking: false, msg: 'Verification failed' });
      return false;
    }
  };

  const validate = (s = step) => {
    try{
      setErrors(null);
      if (s === 1) {
        StudentStepSchema.parse({ full_name: profile.full_name, institutionId: profile.institutionId || '', classId: profile.classId || '' });
      }
      if (s === 4) {
        DisabilitySchema.parse(disability);
      }
      return true;
    }catch(err){ setErrors(err instanceof Error ? err.message : String(err)); return false; }
  };

  const next = () => { if (validate()) setStep(s => Math.min(4, s+1)); };
  const back = () => setStep(s => Math.max(1, s-1));

  const uploadKYC = async () => {
    if (!kycFile) { setErrors('No file selected'); return { ok: false }; }
    try {
      const studentId = `stud-${Math.random().toString(36).slice(2, 9)}`;
      const res = await uploadKYCDocument(
        studentId,
        kycFile,
        'kyc-documents' as StorageBucket,
        p => setUploadProgress(p)
      );
      if (!res.ok) { setErrors(res.error); return { ok: false }; }
      setUploadProgress(100);
      return { ok: true };
    } catch (err: any) {
      setErrors(err?.message || 'Upload failed');
      return { ok: false };
    }
  };

  const submitDisability = async (studentId: string) => {
    if (!validate(4)) return { ok: false };
    try {
      const res = await updateDisabilityInfo(studentId, disability);
      if (!res.ok) { setErrors(res.error); return { ok: false }; }
      return { ok: true };
    } catch (err: any) {
      setErrors(err?.message || 'Disability update failed');
      return { ok: false };
    }
  };

  const submit = async () => {
    if (!validate(1)) throw new Error('Invalid data');
    setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    setLoading(false);
    return { ok: true, id: `stud-${Math.random().toString(36).slice(2,9)}` };
  };

  return { 
    step, 
    next, 
    back, 
    profile, 
    setProfile, 
    checkCode, 
    codeStatus, 
    kycFile, 
    setKycFile, 
    uploadKYC, 
    uploadProgress,
    disability, 
    setDisability,
    submitDisability,
    validate, 
    submit, 
    loading, 
    errors 
  };
}
