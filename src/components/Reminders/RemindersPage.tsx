import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X, Calendar } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Reminder = Database['public']['Tables']['reminders']['Row'];

export function RemindersPage() {
  const { couple } = useCouple();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'custom' as const,
    title: '',
    message: '',
    reminder_date: new Date().toISOString().split('T')[0],
    reminder_time: '09:00',
    is_recurring: false,
    recurrence_pattern: null as string | null,
  });

  useEffect(() => {
    if (couple) {
      loadReminders();

      const channel = supabase
        .channel('reminders-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reminders',
            filter: `couple_id=eq.${couple.id}`,
          },
          () => {
            loadReminders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [couple]);

  const loadReminders = async () => {
    if (!couple) return;

    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('couple_id', couple.id)
      .order('reminder_date', { ascending: true });

    if (data) setReminders(data);
  };

  const handleAddReminder = async () => {
    if (!couple || !newReminder.title) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('reminders').insert({
      couple_id: couple.id,
      created_by: user.id,
      type: newReminder.type,
      title: newReminder.title,
      message: newReminder.message,
      reminder_date: newReminder.reminder_date,
      reminder_time: newReminder.reminder_time,
      is_recurring: newReminder.is_recurring,
      recurrence_pattern: newReminder.is_recurring ? newReminder.recurrence_pattern : null,
      is_enabled: true,
    });

    setNewReminder({
      type: 'custom',
      title: '',
      message: '',
      reminder_date: new Date().toISOString().split('T')[0],
      reminder_time: '09:00',
      is_recurring: false,
      recurrence_pattern: null,
    });
    setShowAddReminder(false);
  };

  const handleToggleEnabled = async (id: string, isEnabled: boolean) => {
    await supabase
      .from('reminders')
      .update({ is_enabled: !isEnabled })
      .eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await supabase.from('reminders').delete().eq('id', id);
    }
  };

  const upcomingReminders = reminders.filter(r =>
    new Date(r.reminder_date) >= new Date() && r.is_enabled
  );

  const pastReminders = reminders.filter(r =>
    new Date(r.reminder_date) < new Date() || !r.is_enabled
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Bell className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Reminders
          </h1>
          <p className="text-gray-600">
            Never miss a special moment or important date
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddReminder(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Reminder
          </button>
        </div>

        {showAddReminder && (
          <div className="mb-6 bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">New Reminder</h3>
              <button
                onClick={() => setShowAddReminder(false)}
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
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                >
                  <option value="custom">Custom</option>
                  <option value="daily_prompt">Daily Prompt</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="birthday">Birthday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="e.g., Send morning kiss"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  placeholder="Reminder message..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.reminder_date}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminder.is_recurring}
                    onChange={(e) => setNewReminder({
                      ...newReminder,
                      is_recurring: e.target.checked,
                      recurrence_pattern: e.target.checked ? 'daily' : null
                    })}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Recurring reminder</span>
                </label>
              </div>

              {newReminder.is_recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurrence Pattern
                  </label>
                  <select
                    value={newReminder.recurrence_pattern || 'daily'}
                    onChange={(e) => setNewReminder({ ...newReminder, recurrence_pattern: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddReminder}
                  disabled={!newReminder.title}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  Create Reminder
                </button>
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {upcomingReminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Reminders</h2>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(reminder.reminder_date).toLocaleDateString()}
                          {reminder.reminder_time && ` at ${reminder.reminder_time}`}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {reminder.title}
                      </h3>
                      {reminder.message && (
                        <p className="text-gray-600 text-sm mb-2">{reminder.message}</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium capitalize">
                          {reminder.type.replace('_', ' ')}
                        </span>
                        {reminder.is_recurring && (
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium capitalize">
                            {reminder.recurrence_pattern}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleToggleEnabled(reminder.id, reminder.is_enabled)}
                        className={`p-2 rounded-lg transition-colors ${
                          reminder.is_enabled
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastReminders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Reminders</h2>
            <div className="space-y-4">
              {pastReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-2xl p-6 shadow-lg opacity-60"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(reminder.reminder_date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-600 mb-1">
                        {reminder.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reminders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            No reminders yet. Create one to never miss a special moment!
          </div>
        )}
      </div>
    </div>
  );
}
