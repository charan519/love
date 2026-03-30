import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Heart, Sparkles } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { WhoKnowsBetter } from './WhoKnowsBetter';
import { TruthOrDare } from './TruthOrDare';

type Game = Database['public']['Tables']['games']['Row'];

export function GamesHub() {
  const { couple } = useCouple();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);

  useEffect(() => {
    if (couple) {
      loadRecentGames();
    }
  }, [couple]);

  const loadRecentGames = async () => {
    if (!couple) return;

    const { data } = await supabase
      .from('games')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setRecentGames(data);
  };

  if (activeGame === 'who_knows_better') {
    return <WhoKnowsBetter onBack={() => { setActiveGame(null); loadRecentGames(); }} />;
  }

  if (activeGame === 'truth_or_dare') {
    return <TruthOrDare onBack={() => { setActiveGame(null); loadRecentGames(); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Gamepad2 className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Couple Games
          </h1>
          <p className="text-gray-600">
            Have fun and learn more about each other
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setActiveGame('who_knows_better')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Who Knows Better?
            </h3>
            <p className="text-gray-600 text-sm">
              Answer questions about each other and see who knows their partner better!
            </p>
          </button>

          <button
            onClick={() => setActiveGame('truth_or_dare')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Truth or Dare
            </h3>
            <p className="text-gray-600 text-sm">
              Romantic edition with fun questions and sweet dares for couples!
            </p>
          </button>

          <button
            className="bg-white rounded-2xl p-8 shadow-lg opacity-50 cursor-not-allowed text-left"
            disabled
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Guess My Favorite
            </h3>
            <p className="text-gray-600 text-sm">
              Coming soon! Guess your partner's favorite things.
            </p>
          </button>
        </div>

        {recentGames.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Games</h3>
            <div className="space-y-4">
              {recentGames.map((game) => (
                <div key={game.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800 capitalize">
                      {game.game_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(game.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-purple-600">
                    {game.status === 'completed' ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
