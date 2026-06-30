import React, { useState } from 'react';
import { useTeacherOnboarding } from '../hooks/useTeacherOnboarding';
import { submitTeacherOnboarding } from '../services/onboardingService';

export default function TeacherOnboarding(){
  const h = useTeacherOnboarding();
  const [uploadProgress, setUploadProgress] = useState<Record<number,number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
    files.forEach(f => {
      if (f.size > 50_000_000) { 
        h.setErrors?.('File too large (max 50MB)'); 
        return;
      }
      if (h.files.length < 3) h.addFile(f);
    });
  };

  const doUpload = async () => {
    setStatus('uploading');
    setMessage('');
    await h.uploadFiles((idx,p)=> setUploadProgress(prev=>({ ...prev, [idx]: p })));
    setMessage('Documents uploaded successfully');
    setTimeout(() => { h.next(); setStatus('idle'); }, 1000);
  };

  const handleSubmit = async () => {
    try{
      if (!h.validateStep(1)) { setMessage('Please fill in all required fields'); return; }
      if (!h.validateStep(3)) { setMessage('Invalid curriculum format'); return; }
      setStatus('uploading');
      setSubmitting(true);
      const payload = h.buildPayload();
      const res = await submitTeacherOnboarding(payload);
      setStatus('done');
      setMessage(res.ok ? `Onboarding completed successfully (ID: ${res.id})` : 'Submission failed');
    }catch(err:any){ 
      setMessage(`Error: ${err?.message || 'Submission error'}`);
      setStatus('idle');
    }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand via-brand to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-2">Teacher Onboarding</h2>
        <p className="text-sm text-gray-500 mb-4">Complete your profile and upload required documents. Step {h.step} of 3</p>

        {status === 'done' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {message || 'Onboarding completed successfully!'}
          </div>
        ) : (
          <form className="space-y-4">
            {message && status !== 'uploading' && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>
            )}

            {h.step === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Full name</label>
                <input 
                  type="text"
                  value={h.profile.full_name} 
                  onChange={e=>h.setProfile({ ...h.profile, full_name: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Enter your full name"
                  required
                />
                
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input 
                  type="email"
                  value={h.profile.email || ''} 
                  onChange={e=>h.setProfile({ ...h.profile, email: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="your@email.com"
                />

                <label className="block text-sm font-medium text-gray-600">Institution ID</label>
                <input 
                  type="text"
                  value={h.profile.institutionId} 
                  onChange={e=>h.setProfile({ ...h.profile, institutionId: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Enter your institution ID"
                  required
                />

                <div className="flex items-center justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={h.next} 
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand/90"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {h.step === 2 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Upload KYC Documents</label>
                <p className="text-xs text-gray-500 mb-2">Upload up to 3 files (PDF, images, etc.). Maximum 50MB per file.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <input 
                    type="file" 
                    multiple
                    onChange={handleFile} 
                    className="w-full cursor-pointer"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                  <p className="text-xs text-gray-500 mt-2">Drag and drop or click to select files</p>
                </div>

                {h.files.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium text-gray-600">Selected files ({h.files.length}/3)</p>
                    {h.files.map((f,i)=> (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{f.name}</p>
                          <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex items-center gap-3 ml-2">
                          {uploadProgress[i] > 0 && uploadProgress[i] < 100 && (
                            <span className="text-xs font-medium text-brand">{uploadProgress[i]}%</span>
                          )}
                          <button 
                            type="button"
                            onClick={()=>h.removeFileAt(i)} 
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={h.back} 
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={doUpload}
                    disabled={h.files.length === 0 || status === 'uploading'}
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand/90 disabled:opacity-60"
                  >
                    {status === 'uploading' ? 'Uploading...' : 'Upload Documents'}
                  </button>
                </div>
              </>
            )}

            {h.step === 3 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Curriculum Overview</label>
                <p className="text-xs text-gray-500 mb-2">Provide curriculum structure as JSON (years, subjects, topics)</p>

                <textarea 
                  value={JSON.stringify(h.curriculum, null, 2)} 
                  onChange={e=>{
                    try{ 
                      h.setCurriculum(JSON.parse(e.target.value)); 
                      h.setErrors?.(null); 
                    }catch(err){ 
                      h.setErrors?.('Invalid JSON format'); 
                    }
                  }} 
                  rows={6} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500">Example: {`{"years":[{"year":2025,"subjects":["Math","Science"]}]}`}</p>

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={h.back} 
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={submitting} 
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Complete Onboarding'}
                  </button>
                </div>
              </>
            )}

            {h.errors && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{h.errors}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
