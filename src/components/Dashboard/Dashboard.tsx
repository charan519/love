import { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Film, Gamepad2, Bell, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import { ProfileSetup } from '../Couple/ProfileSetup';
import { GamesHub } from '../Games/GamesHub';
import { WatchlistPage } from '../Watchlist/WatchlistPage';
import { MemoriesPage } from '../Memories/MemoriesPage';
import { RemindersPage } from '../Reminders/RemindersPage';

type Memory = Database['public']['Tables']['memories']['Row'];

export function Dashboard() {
  const { signOut } = useAuth();
  const { couple, profile } = useCouple();
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'games' | 'movies' | 'memories' | 'reminders'>('home');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: '', content: '', type: 'note' as const });

  useEffect(() => {
    if (couple) {
      loadMemories();

      const channel = supabase
        .channel('memories-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'memories',
            filter: `couple_id=eq.${couple.id}`,
          },
          () => {
            loadMemories();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [couple]);

  const loadMemories = async () => {
    if (!couple) return;

    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) setMemories(data);
  };

  const calculateDaysTogether = () => {
    if (!profile?.relationship_start_date) return 0;
    const start = new Date(profile.relationship_start_date);
    const today = new Date();
    const diff = today.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getNextSpecialDate = () => {
    if (!profile) return null;

    const dates = [
      { name: 'Anniversary', date: profile.anniversary_date },
      { name: `${profile.partner1_name}'s Birthday`, date: profile.partner1_birthday },
      { name: `${profile.partner2_name}'s Birthday`, date: profile.partner2_birthday },
      { name: 'First Date Anniversary', date: profile.first_date },
    ].filter(d => d.date);

    if (dates.length === 0) return null;

    const today = new Date();
    const upcomingDates = dates.map(d => {
      const date = new Date(d.date!);
      date.setFullYear(today.getFullYear());
      if (date < today) {
        date.setFullYear(today.getFullYear() + 1);
      }
      return { ...d, nextDate: date };
    }).sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

    const next = upcomingDates[0];
    const daysUntil = Math.ceil((next.nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { name: next.name, days: daysUntil };
  };

  const handleAddMemory = async () => {
    if (!couple || !newMemory.content) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('memories').insert({
      couple_id: couple.id,
      author_id: user.id,
      type: newMemory.type,
      title: newMemory.title,
      content: newMemory.content,
      date: new Date().toISOString().split('T')[0],
    });

    setNewMemory({ title: '', content: '', type: 'note' });
    setShowAddMemory(false);
  };

  if (currentView === 'profile') {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <ProfileSetup />
      </div>
    );
  }

  if (currentView === 'games') {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <GamesHub />
      </div>
    );
  }

  if (currentView === 'movies') {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <WatchlistPage />
      </div>
    );
  }

  if (currentView === 'memories') {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <MemoriesPage />
      </div>
    );
  }

  if (currentView === 'reminders') {
    return (
      <div>
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
        <RemindersPage />
      </div>
    );
  }

  const nextDate = getNextSpecialDate();
  const daysTogether = calculateDaysTogether();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Love Connect
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('profile')}
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
              title="Edit Profile"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={signOut}
              className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back! {profile?.partner1_name && profile?.partner2_name && `${profile.partner1_name} & ${profile.partner2_name}`}
          </h2>
          <p className="text-gray-600">Your shared space for love and memories</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <Clock className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-4xl font-bold mb-1">{daysTogether}</div>
            <div className="text-pink-100">Days Together</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <Calendar className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-4xl font-bold mb-1">{nextDate?.days || '?'}</div>
            <div className="text-blue-100">Days Until {nextDate?.name || 'Next Event'}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <Heart className="w-10 h-10 mb-3 opacity-90 fill-white" />
            <div className="text-4xl font-bold mb-1">{memories.length}</div>
            <div className="text-purple-100">Shared Memories</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setCurrentView('games')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Play Games</h3>
            <p className="text-sm text-gray-600">Fun couple games together</p>
          </button>

          <button
            onClick={() => setCurrentView('movies')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Movie Night</h3>
            <p className="text-sm text-gray-600">Find movies to watch</p>
          </button>

          <button
            onClick={() => setCurrentView('memories')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Memories</h3>
            <p className="text-sm text-gray-600">Notes and love letters</p>
          </button>

          <button
            onClick={() => setCurrentView('reminders')}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Reminders</h3>
            <p className="text-sm text-gray-600">Special date alerts</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Recent Memories</h3>
            <button
              onClick={() => setShowAddMemory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Memory
            </button>
          </div>

          {showAddMemory && (
            <div className="mb-6 p-4 bg-pink-50 rounded-xl">
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                placeholder="Title (optional)"
                className="w-full px-4 py-2 mb-3 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
              />
              <textarea
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                placeholder="Write your memory or love note..."
                className="w-full px-4 py-3 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleAddMemory}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddMemory(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {memories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No memories yet. Start creating beautiful moments together!
            </div>
          ) : (
            <div className="space-y-4">
              {memories.map((memory) => (
                <div key={memory.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                  {memory.title && (
                    <h4 className="font-semibold text-gray-800 mb-1">{memory.title}</h4>
                  )}
                  <p className="text-gray-700 mb-2">{memory.content}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(memory.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
