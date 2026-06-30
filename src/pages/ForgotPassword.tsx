import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand via-brand to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-brand mb-2">Reset your password</h2>
        <p className="text-sm text-gray-500 mb-4">Enter the email associated with your account and we'll send instructions.</p>

        {status === 'sent' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Check your inbox for password reset instructions.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
            />

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-brand text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send reset email'}
              </button>
              <Link to="/login" className="text-sm text-gray-500 hover:underline">Back to sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
