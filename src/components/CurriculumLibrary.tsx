import React from 'react';
import type { CurriculumSubject } from '../types';

const MOCK_LIBRARY: CurriculumSubject[] = [
  { id: 's1', title: 'Mathematics', topics: [{ id: 't1', title: 'Quadratics' }, { id: 't2', title: 'Trigonometry' }] },
  { id: 's2', title: 'Physics', topics: [{ id: 't3', title: 'Newtonian Mechanics' }, { id: 't4', title: 'Waves' }] },
  { id: 's3', title: 'Biology', topics: [{ id: 't5', title: 'Cell Biology' }, { id: 't6', title: 'Genetics' }] },
];

export default function CurriculumLibrary({ subjects = MOCK_LIBRARY }: { subjects?: CurriculumSubject[] }){
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Curriculum Library</h1>
          <p className="text-gray-600">Explore available subjects and learning materials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-brand to-brand/80 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{s.title}</h2>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Topics</p>
                  <ul className="space-y-2">
                    {s.topics.map(t => (
                      <li key={t.id} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-brand rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-gray-700">{t.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full px-4 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-colors">
                  View Resources
                </button>
              </div>
            </div>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No curriculum subjects available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
