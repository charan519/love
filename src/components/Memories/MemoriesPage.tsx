import { useState, useEffect } from 'react';
import { Heart, Plus, Star, Trash2, CreditCard as Edit2, X } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Memory = Database['public']['Tables']['memories']['Row'];

export function MemoriesPage() {
  const { couple } = useCouple();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [newMemory, setNewMemory] = useState({
    type: 'note' as const,
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (couple) {
      loadMemories();

      const channel = supabase
        .channel('memories-updates')
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
      .order('created_at', { ascending: false });

    if (data) setMemories(data);
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
      date: newMemory.date,
      is_favorite: false,
    });

    setNewMemory({
      type: 'note',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowAddMemory(false);
  };

  const handleUpdateMemory = async () => {
    if (!editingMemory) return;

    await supabase
      .from('memories')
      .update({
        title: editingMemory.title,
        content: editingMemory.content,
        date: editingMemory.date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingMemory.id);

    setEditingMemory(null);
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await supabase
      .from('memories')
      .update({ is_favorite: !isFavorite })
      .eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      await supabase.from('memories').delete().eq('id', id);
    }
  };

  const filteredMemories = filterType === 'all'
    ? memories
    : memories.filter(m => m.type === filterType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Our Memories
          </h1>
          <p className="text-gray-600">
            Keep your special moments and love letters safe
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {['all', 'note', 'letter', 'memory'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                filterType === type
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddMemory(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Memory
          </button>
        </div>

        {showAddMemory && (
          <div className="mb-6 bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">New Memory</h3>
              <button
                onClick={() => setShowAddMemory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newMemory.type}
                  onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                >
                  <option value="note">Note</option>
                  <option value="letter">Love Letter</option>
                  <option value="memory">Special Memory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  placeholder="Give it a title..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newMemory.date}
                  onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  placeholder="Write your thoughts, feelings, or memories..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddMemory}
                  disabled={!newMemory.content}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  Save Memory
                </button>
                <button
                  onClick={() => setShowAddMemory(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {editingMemory && (
          <div className="mb-6 bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Edit Memory</h3>
              <button
                onClick={() => setEditingMemory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={editingMemory.title}
                onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                placeholder="Title"
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
              />
              <input
                type="date"
                value={editingMemory.date || ''}
                onChange={(e) => setEditingMemory({ ...editingMemory, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
              />
              <textarea
                value={editingMemory.content}
                onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                rows={6}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateMemory}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingMemory(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredMemories.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              No memories yet. Start creating beautiful moments together!
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium capitalize">
                        {memory.type}
                      </span>
                      {memory.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {memory.title && (
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {memory.title}
                      </h3>
                    )}
                    {memory.date && (
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(memory.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFavorite(memory.id, memory.is_favorite)}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <Star className={`w-5 h-5 ${memory.is_favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={() => setEditingMemory(memory)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{memory.content}</p>
                <div className="text-xs text-gray-400 mt-3">
                  Created {new Date(memory.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
