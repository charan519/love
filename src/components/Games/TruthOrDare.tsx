import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const truths = [
  "What's your favorite memory of us together?",
  "What do you love most about our relationship?",
  "What's one thing you've never told me before?",
  "What's your idea of a perfect date?",
  "What song reminds you of me?",
  "What's your favorite thing I do for you?",
  "What was your first impression of me?",
  "What's something you want us to do together?",
  "What's your favorite physical feature of mine?",
  "What's one thing that always makes you think of me?",
];

const dares = [
  "Send me a voice message saying why you love me",
  "Share your favorite photo of us",
  "Write me a short love poem right now",
  "Tell me three things you appreciate about me today",
  "Send me a song that describes how you feel about me",
  "Share a compliment you've been meaning to give me",
  "Tell me about a moment when you knew you loved me",
  "Describe our relationship in three words",
  "Share what you're most looking forward to in our future",
  "Tell me something that made you smile today",
];

export function TruthOrDare({ onBack }: { onBack: () => void }) {
  const [currentMode, setCurrentMode] = useState<'choose' | 'truth' | 'dare'>('choose');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleChoice = (choice: 'truth' | 'dare') => {
    const prompts = choice === 'truth' ? truths : dares;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    setCurrentMode(choice);
  };

  const handleNext = () => {
    setCurrentMode('choose');
    setCurrentPrompt('');
  };

  if (currentMode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-pink-600 mb-6 transition-colors"
          >
            ← Back to Games
          </button>

          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-pink-500 fill-pink-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Truth or Dare
            </h1>
            <p className="text-gray-600">Romantic edition for couples</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleChoice('truth')}
              className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Truth</h2>
              <p className="text-gray-600">
                Answer a heartfelt question about your relationship
              </p>
            </button>

            <button
              onClick={() => handleChoice('dare')}
              className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Dare</h2>
              <p className="text-gray-600">
                Complete a sweet and romantic challenge
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => setCurrentMode('choose')}
          className="text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          ← Back to Choice
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 ${
                currentMode === 'truth'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-gradient-to-br from-pink-500 to-purple-600'
              } rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {currentMode === 'truth' ? (
                <Sparkles className="w-8 h-8 text-white" />
              ) : (
                <Heart className="w-8 h-8 text-white fill-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
              {currentMode}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
            <p className="text-xl text-gray-800 text-center leading-relaxed">
              {currentPrompt}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Next Round
            </button>
            <button
              onClick={() => setCurrentMode('choose')}
              className="w-full bg-white text-gray-700 py-4 rounded-xl font-medium border-2 border-gray-200 hover:border-pink-300 transition-all"
            >
              Choose Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
