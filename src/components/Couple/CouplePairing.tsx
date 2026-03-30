import { useState } from 'react';
import { Heart, Copy, Check, Users } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';

export function CouplePairing() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [inviteCode, setInviteCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createCouple, joinCouple } = useCouple();

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateCouple = async () => {
    setLoading(true);
    setError('');

    const code = generateCode();
    const { error: createError } = await createCouple(code);

    if (createError) {
      if (createError.message?.includes('duplicate')) {
        handleCreateCouple();
      } else {
        setError(createError.message || 'Failed to create couple');
      }
    } else {
      setGeneratedCode(code);
    }

    setLoading(false);
  };

  const handleJoinCouple = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');

    const { error: joinError } = await joinCouple(inviteCode.toUpperCase());

    if (joinError) {
      setError(joinError.message || 'Failed to join couple');
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-20 h-20 text-pink-500 fill-pink-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Connect With Your Partner
            </h1>
            <p className="text-gray-600">
              Create a shared space for you and your loved one
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('create')}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Start a Couple
              </h3>
              <p className="text-gray-600">
                Get an invite code to share with your partner
              </p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Join Your Partner
              </h3>
              <p className="text-gray-600">
                Enter the invite code from your partner
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <button
            onClick={() => setMode('choose')}
            className="text-sm text-gray-600 hover:text-pink-600 mb-6 transition-colors"
          >
            ← Back
          </button>

          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Create Your Couple Space
            </h2>
            <p className="text-gray-600 text-sm">
              Generate a unique invite code for your partner
            </p>
          </div>

          {!generatedCode ? (
            <button
              onClick={handleCreateCouple}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate Invite Code'}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Your Invite Code</p>
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text tracking-wider mb-4">
                  {generatedCode}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  Share this code with your partner so they can join your couple space.
                  Waiting for them to connect...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
        <button
          onClick={() => setMode('choose')}
          className="text-sm text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Join Your Partner
          </h2>
          <p className="text-gray-600 text-sm">
            Enter the invite code your partner shared with you
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-4 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-center text-2xl font-bold tracking-wider uppercase"
              placeholder="XXXXXXXX"
              maxLength={8}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleJoinCouple}
            disabled={loading || inviteCode.length !== 8}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Joining...' : 'Join Couple'}
          </button>
        </div>
      </div>
    </div>
  );
}
