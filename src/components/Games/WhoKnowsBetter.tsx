import { useState, useEffect } from 'react';
import { Trophy, Heart } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';

interface Question {
  question: string;
  category: string;
}

const questions: Question[] = [
  { question: "What is your partner's favorite color?", category: 'favorites' },
  { question: "What is your partner's dream vacation destination?", category: 'dreams' },
  { question: "What is your partner's favorite food?", category: 'favorites' },
  { question: "What makes your partner happiest?", category: 'feelings' },
  { question: "What is your partner's biggest fear?", category: 'feelings' },
  { question: "What is your partner's favorite movie?", category: 'favorites' },
  { question: "What is your partner's love language?", category: 'love' },
  { question: "What is your partner's favorite way to spend a day off?", category: 'lifestyle' },
  { question: "What is one thing your partner can't live without?", category: 'lifestyle' },
  { question: "What is your partner's favorite memory of you two together?", category: 'relationship' },
];

export function WhoKnowsBetter({ onBack }: { onBack: () => void }) {
  const { couple, isPartner1 } = useCouple();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswer, setMyAnswer] = useState('');
  const [partnerAnswer, setPartnerAnswer] = useState('');
  const [showPartnerInput, setShowPartnerInput] = useState(false);
  const [score, setScore] = useState({ me: 0, partner: 0 });
  const [gameFinished, setGameFinished] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (couple) {
      createGame();
    }
  }, [couple]);

  const createGame = async () => {
    if (!couple) return;

    const { data } = await supabase
      .from('games')
      .insert({
        couple_id: couple.id,
        game_type: 'who_knows_better',
        status: 'active',
        scores: { partner1: 0, partner2: 0 },
      })
      .select()
      .single();

    if (data) setGameId(data.id);
  };

  const handleSubmitMyAnswer = () => {
    if (myAnswer.trim()) {
      setShowPartnerInput(true);
    }
  };

  const handleSubmitPartnerAnswer = async () => {
    if (!partnerAnswer.trim() || !gameId) return;

    const similar = myAnswer.toLowerCase().trim() === partnerAnswer.toLowerCase().trim();

    if (similar) {
      setScore({ ...score, me: score.me + 1 });
    }

    await supabase.from('game_responses').insert({
      game_id: gameId,
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      question: questions[currentQuestion].question,
      answer: myAnswer,
      is_correct: similar,
      points: similar ? 1 : 0,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setMyAnswer('');
      setPartnerAnswer('');
      setShowPartnerInput(false);
    } else {
      setGameFinished(true);
      if (gameId) {
        await supabase
          .from('games')
          .update({
            status: 'completed',
            scores: { partner1: isPartner1 ? score.me : score.partner, partner2: isPartner1 ? score.partner : score.me },
          })
          .eq('id', gameId);
      }
    }
  };

  if (gameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text mb-2">
              {score.me} / {questions.length}
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          <p className="text-gray-600 mb-6">
            {score.me >= questions.length * 0.8
              ? "Amazing! You know your partner so well!"
              : score.me >= questions.length * 0.5
              ? "Good job! There's still more to learn about each other."
              : "Keep spending time together and you'll know each other better!"}
          </p>
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          ← Back to Games
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500 fill-pink-400" />
              <h2 className="text-2xl font-bold text-gray-800">Who Knows Better?</h2>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <div className="text-sm text-gray-600 mb-2">{questions[currentQuestion].category}</div>
            <div className="text-xl font-semibold text-gray-800">
              {questions[currentQuestion].question}
            </div>
          </div>

          {!showPartnerInput ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <input
                  type="text"
                  value={myAnswer}
                  onChange={(e) => setMyAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  placeholder="Type your answer..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitMyAnswer()}
                />
              </div>
              <button
                onClick={handleSubmitMyAnswer}
                disabled={!myAnswer.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-sm text-blue-800 font-medium mb-1">Your answer:</div>
                <div className="text-blue-900">{myAnswer}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would your partner answer?
                </label>
                <input
                  type="text"
                  value={partnerAnswer}
                  onChange={(e) => setPartnerAnswer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  placeholder="Type what you think they'd say..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitPartnerAnswer()}
                />
              </div>
              <button
                onClick={handleSubmitPartnerAnswer}
                disabled={!partnerAnswer.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-pink-100">
            <div className="flex justify-center gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < currentQuestion
                      ? 'bg-pink-500'
                      : index === currentQuestion
                      ? 'bg-pink-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
