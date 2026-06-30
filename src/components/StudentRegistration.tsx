import React, { useState } from 'react';
import { useStudentRegistration } from '../hooks/useStudentRegistration';

export default function StudentRegistration(){
  const s = useStudentRegistration();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'done'>('idle');

  const handleCheck = async () => {
    setStatus('checking');
    setMessage('');
    const ok = await s.checkCode(code);
    if (ok) { 
      setMessage('');
      s.next(); 
    } else {
      setMessage('Invalid registration code');
      setStatus('idle');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50_000_000) { setMessage('File too large (max 50MB)'); return; }
    s.setKycFile(file);
  };

  const handleUploadKYC = async () => {
    setStatus('uploading');
    setMessage('');
    const res = await s.uploadKYC();
    if (res.ok) { 
      setMessage('');
      s.next(); 
      setStatus('idle');
    } else { 
      setMessage('Upload failed');
      setStatus('idle');
    }
  };

  const handleDisabilitySubmit = async () => {
    const studentId = `stud-${Math.random().toString(36).slice(2, 9)}`;
    const res = await s.submitDisability(studentId);
    if (res.ok) { 
      setStatus('uploading');
      setSubmitting(true);
      const submitRes = await s.submit();
      setStatus('done');
      setMessage(submitRes.ok ? `Registration complete (ID: ${submitRes.id})` : 'Registration failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand via-brand to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-2">Student Registration</h2>
        <p className="text-sm text-gray-500 mb-4">Complete your profile and verify your enrollment. Step {s.step} of 4</p>

        {status === 'done' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {message || 'Registration completed successfully!'}
          </div>
        ) : (
          <form className="space-y-4">
            {message && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>
            )}

            {s.step === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Full name</label>
                <input
                  type="text"
                  value={s.profile.full_name}
                  onChange={e => s.setProfile({ ...s.profile, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Enter your full name"
                  required
                />

                <label className="block text-sm font-medium text-gray-600">Email (optional)</label>
                <input
                  type="email"
                  value={s.profile.email || ''}
                  onChange={e => s.setProfile({ ...s.profile, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="your@email.com"
                />

                <label className="block text-sm font-medium text-gray-600">Phone (optional)</label>
                <input
                  type="tel"
                  value={s.profile.phone || ''}
                  onChange={e => s.setProfile({ ...s.profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Phone number"
                />

                <p className="text-xs text-gray-500">Provide either email or phone</p>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={s.next}
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand/90"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {s.step === 2 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Registration / Classroom Code</label>
                <p className="text-xs text-gray-500 mb-2">Enter the enrollment code provided by your institution</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                    placeholder="e.g., CLASS-101"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleCheck}
                    disabled={!code || status === 'checking'}
                    className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 disabled:opacity-60"
                  >
                    {status === 'checking' ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {s.codeStatus.checking && <div className="text-sm text-gray-500">Verifying code...</div>}
                {s.codeStatus.msg && (
                  <div className={`text-sm ${s.codeStatus.valid ? 'text-green-700' : 'text-red-700'}`}>
                    {s.codeStatus.msg}
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={s.back}
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={s.next}
                    disabled={!s.codeStatus.valid}
                    className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {s.step === 3 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Upload KYC Document</label>
                <p className="text-xs text-gray-500 mb-2">Upload PDF, ID photo, or other identity documents. Maximum 50MB.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="w-full cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Drag and drop or click to select file</p>
                </div>

                {s.kycFile && (
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">{s.kycFile.name}</p>
                    <p className="text-xs text-gray-500">{(s.kycFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                {s.uploadProgress > 0 && s.uploadProgress < 100 && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium text-gray-600">Uploading...</p>
                      <p className="text-xs text-gray-600">{s.uploadProgress}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-brand h-2 rounded-full" style={{ width: `${s.uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={s.back}
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadKYC}
                    disabled={!s.kycFile || status === 'uploading'}
                    className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 disabled:opacity-60"
                  >
                    {status === 'uploading' ? 'Uploading...' : 'Upload & Next'}
                  </button>
                </div>
              </>
            )}

            {s.step === 4 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Disability Accommodation</label>
                <p className="text-xs text-gray-500 mb-3">Tell us if you need any learning accommodations</p>

                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.disability.hasDisability}
                      onChange={e => s.setDisability({ ...s.disability, hasDisability: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">I have a disability requiring accommodations</span>
                  </label>

                  {s.disability.hasDisability && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Disability type</label>
                        <select
                          value={s.disability.disabilityType || ''}
                          onChange={e => s.setDisability({ ...s.disability, disabilityType: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                        >
                          <option value="">Select a type...</option>
                          <option value="visual">Visual</option>
                          <option value="hearing">Hearing</option>
                          <option value="mobility">Mobility</option>
                          <option value="cognitive">Cognitive</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Required accommodations</label>
                        <textarea
                          value={s.disability.accommodations || ''}
                          onChange={e => s.setDisability({ ...s.disability, accommodations: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                          placeholder="e.g., Extended exam time, screen reader, large print"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Additional notes</label>
                        <textarea
                          value={s.disability.notes || ''}
                          onChange={e => s.setDisability({ ...s.disability, notes: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                          placeholder="Any other information we should know"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={s.back}
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleDisabilitySubmit}
                    disabled={submitting}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submitting ? 'Completing...' : 'Complete Registration'}
                  </button>
                </div>
              </>
            )}

            {s.errors && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{s.errors}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
