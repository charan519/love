import { useState, useEffect } from 'react';
import { Film, Plus, Check, Star, Trash2 } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type WatchlistItem = Database['public']['Tables']['watchlist']['Row'];

const movieSuggestions = [
  { title: 'The Notebook', genre: 'Romance', mood: 'romantic', description: 'A timeless love story that will make you cry' },
  { title: 'La La Land', genre: 'Musical Romance', mood: 'romantic', description: 'A modern musical about love and dreams' },
  { title: 'Crazy, Stupid, Love', genre: 'Romantic Comedy', mood: 'comedy', description: 'Funny and heartwarming love stories' },
  { title: 'About Time', genre: 'Romance', mood: 'emotional', description: 'Time travel meets true love' },
  { title: 'The Proposal', genre: 'Romantic Comedy', mood: 'comedy', description: 'Hilarious fake relationship turns real' },
  { title: '10 Things I Hate About You', genre: 'Romantic Comedy', mood: 'comedy', description: 'Classic teen romance with humor' },
  { title: 'Pride and Prejudice', genre: 'Period Romance', mood: 'romantic', description: 'Elegant and timeless love story' },
  { title: 'Silver Linings Playbook', genre: 'Romantic Drama', mood: 'emotional', description: 'Unexpected love and healing' },
];

export function WatchlistPage() {
  const { couple } = useCouple();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    mood: 'romantic' as const,
    description: '',
  });

  useEffect(() => {
    if (couple) {
      loadWatchlist();

      const channel = supabase
        .channel('watchlist-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'watchlist',
            filter: `couple_id=eq.${couple.id}`,
          },
          () => {
            loadWatchlist();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [couple]);

  const loadWatchlist = async () => {
    if (!couple) return;

    const { data } = await supabase
      .from('watchlist')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: false });

    if (data) setWatchlist(data);
  };

  const handleAddMovie = async (movie: typeof newMovie) => {
    if (!couple || !movie.title) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('watchlist').insert({
      couple_id: couple.id,
      added_by: user.id,
      movie_title: movie.title,
      genre: movie.genre,
      mood: movie.mood,
      description: movie.description,
      watched: false,
    });

    setNewMovie({ title: '', genre: '', mood: 'romantic', description: '' });
    setShowAddMovie(false);
  };

  const handleToggleWatched = async (id: string, watched: boolean) => {
    await supabase
      .from('watchlist')
      .update({
        watched: !watched,
        watched_date: !watched ? new Date().toISOString().split('T')[0] : null,
      })
      .eq('id', id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('watchlist').delete().eq('id', id);
  };

  const handleAddSuggestion = async (movie: typeof movieSuggestions[0]) => {
    if (!couple) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('watchlist').insert({
      couple_id: couple.id,
      added_by: user.id,
      movie_title: movie.title,
      genre: movie.genre,
      mood: movie.mood,
      description: movie.description,
      watched: false,
    });
  };

  const filteredList = selectedMood === 'all'
    ? watchlist
    : watchlist.filter(item => item.mood === selectedMood);

  const filteredSuggestions = selectedMood === 'all'
    ? movieSuggestions
    : movieSuggestions.filter(movie => movie.mood === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Film className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Movie Night
          </h1>
          <p className="text-gray-600">
            Find perfect movies to watch together
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {['all', 'romantic', 'comedy', 'emotional'].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedMood === mood
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Watchlist</h2>
              <button
                onClick={() => setShowAddMovie(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Movie
              </button>
            </div>

            {showAddMovie && (
              <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4">Add Custom Movie</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    placeholder="Movie title"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    placeholder="Genre"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                  <select
                    value={newMovie.mood}
                    onChange={(e) => setNewMovie({ ...newMovie, mood: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  >
                    <option value="romantic">Romantic</option>
                    <option value="comedy">Comedy</option>
                    <option value="emotional">Emotional</option>
                  </select>
                  <textarea
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    placeholder="Description (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddMovie(newMovie)}
                      className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddMovie(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredList.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
                  No movies in your watchlist yet. Add some from suggestions!
                </div>
              ) : (
                filteredList.map((movie) => (
                  <div
                    key={movie.id}
                    className={`bg-white rounded-2xl p-6 shadow-lg transition-all ${
                      movie.watched ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${movie.watched ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {movie.movie_title}
                        </h3>
                        {movie.genre && (
                          <div className="text-sm text-gray-600">{movie.genre}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleWatched(movie.id, movie.watched)}
                          className={`p-2 rounded-lg transition-colors ${
                            movie.watched
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {movie.description && (
                      <p className="text-sm text-gray-600 mt-2">{movie.description}</p>
                    )}
                    {movie.watched && movie.watched_date && (
                      <div className="text-xs text-gray-500 mt-2">
                        Watched on {new Date(movie.watched_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
            <div className="space-y-4">
              {filteredSuggestions.map((movie, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{movie.title}</h3>
                      <div className="text-sm text-gray-600">{movie.genre}</div>
                    </div>
                    <button
                      onClick={() => handleAddSuggestion(movie)}
                      className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{movie.description}</p>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium capitalize">
                      {movie.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
