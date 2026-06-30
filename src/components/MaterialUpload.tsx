import React, { useState } from 'react';
import { useMaterialUpload } from '../hooks/useMaterialUpload';

export default function MaterialUpload(){
  const { step, next, back, step1, step2, handleUpload, uploading, progress, statusMsg } = useMaterialUpload();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  const handleNext = () => {
    next();
  };

  const handleSubmit = async () => {
    setStatus('uploading');
    await handleUpload();
    setStatus(statusMsg?.includes('successfully') ? 'done' : 'idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand via-brand to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-2">Upload Study Material</h2>
        <p className="text-sm text-gray-500 mb-4">Share educational resources with your students. Step {step} of 2</p>

        {status === 'done' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {statusMsg || 'Material uploaded successfully!'}
          </div>
        ) : (
          <form className="space-y-4">
            {statusMsg && !status && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{statusMsg}</div>
            )}

            {step === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Academic Year</label>
                <select
                  {...step1.register('year')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>

                <label className="block text-sm font-medium text-gray-600">Term</label>
                <select
                  {...step1.register('term')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>

                <label className="block text-sm font-medium text-gray-600">Class / Combination</label>
                <input
                  {...step1.register('combination')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="e.g., Class 10A"
                />

                <label className="block text-sm font-medium text-gray-600">Subject</label>
                <input
                  {...step1.register('subject')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="e.g., Mathematics"
                />

                <label className="block text-sm font-medium text-gray-600">Topic</label>
                <input
                  {...step1.register('topic')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="e.g., Algebra Basics"
                />

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand/90"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <label className="block text-sm font-medium text-gray-600">Material Type</label>
                <select
                  {...step2.register('materialType')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Video">Video</option>
                  <option value="External Link">External Link</option>
                </select>

                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input
                  {...step2.register('title')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Material title"
                  required
                />

                <label className="block text-sm font-medium text-gray-600">Description (optional)</label>
                <textarea
                  {...step2.register('description')}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="Describe the material content"
                />

                {step2.watch('materialType') === 'External Link' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">URL</label>
                    <input
                      {...step2.register('externalUrl')}
                      type="url"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Upload File</label>
                    <p className="text-xs text-gray-500 mb-2">Maximum 50MB</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <input
                        type="file"
                        {...step2.register('file')}
                        className="w-full cursor-pointer"
                        accept=".pdf,.mp4,.webm,.png,.jpg,.jpeg"
                      />
                      <p className="text-xs text-gray-500 mt-2">Drag and drop or click to select file</p>
                    </div>
                  </div>
                )}

                {uploading && progress > 0 && progress < 100 && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-medium text-gray-600">Uploading...</p>
                      <p className="text-xs text-gray-600">{progress}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-brand h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={back}
                    className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {uploading ? 'Uploading...' : 'Upload Material'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
