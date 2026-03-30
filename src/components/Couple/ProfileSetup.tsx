import { useState, useEffect } from 'react';
import { Heart, Calendar, Music, Film, Coffee, Smile } from 'lucide-react';
import { useCouple } from '../../hooks/useCouple';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type CoupleProfile = Database['public']['Tables']['couple_profiles']['Row'];

export function ProfileSetup() {
  const { couple, profile, isPartner1 } = useCouple();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    myName: '',
    partnerName: '',
    myPetName: '',
    partnerPetName: '',
    myLikes: '',
    partnerLikes: '',
    myDislikes: '',
    partnerDislikes: '',
    myFavMovies: '',
    partnerFavMovies: '',
    myFavSongs: '',
    partnerFavSongs: '',
    myFavFoods: '',
    partnerFavFoods: '',
    myBirthday: '',
    partnerBirthday: '',
    firstMeetingDate: '',
    firstDate: '',
    proposalDate: '',
    anniversaryDate: '',
    relationshipStartDate: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        myName: isPartner1 ? profile.partner1_name : profile.partner2_name,
        partnerName: isPartner1 ? profile.partner2_name : profile.partner1_name,
        myPetName: isPartner1 ? profile.partner1_pet_name : profile.partner2_pet_name,
        partnerPetName: isPartner1 ? profile.partner2_pet_name : profile.partner1_pet_name,
        myLikes: isPartner1 ? profile.partner1_likes.join(', ') : profile.partner2_likes.join(', '),
        partnerLikes: isPartner1 ? profile.partner2_likes.join(', ') : profile.partner1_likes.join(', '),
        myDislikes: isPartner1 ? profile.partner1_dislikes.join(', ') : profile.partner2_dislikes.join(', '),
        partnerDislikes: isPartner1 ? profile.partner2_dislikes.join(', ') : profile.partner1_dislikes.join(', '),
        myFavMovies: isPartner1 ? profile.partner1_fav_movies.join(', ') : profile.partner2_fav_movies.join(', '),
        partnerFavMovies: isPartner1 ? profile.partner2_fav_movies.join(', ') : profile.partner1_fav_movies.join(', '),
        myFavSongs: isPartner1 ? profile.partner1_fav_songs.join(', ') : profile.partner2_fav_songs.join(', '),
        partnerFavSongs: isPartner1 ? profile.partner2_fav_songs.join(', ') : profile.partner1_fav_songs.join(', '),
        myFavFoods: isPartner1 ? profile.partner1_fav_foods.join(', ') : profile.partner2_fav_foods.join(', '),
        partnerFavFoods: isPartner1 ? profile.partner2_fav_foods.join(', ') : profile.partner1_fav_foods.join(', '),
        myBirthday: isPartner1 ? (profile.partner1_birthday || '') : (profile.partner2_birthday || ''),
        partnerBirthday: isPartner1 ? (profile.partner2_birthday || '') : (profile.partner1_birthday || ''),
        firstMeetingDate: profile.first_meeting_date || '',
        firstDate: profile.first_date || '',
        proposalDate: profile.proposal_date || '',
        anniversaryDate: profile.anniversary_date || '',
        relationshipStartDate: profile.relationship_start_date || '',
      });
    }
  }, [profile, isPartner1]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couple) return;

    setLoading(true);

    const updateData: Partial<CoupleProfile> = {
      ...(isPartner1 ? {
        partner1_name: formData.myName,
        partner1_pet_name: formData.myPetName,
        partner1_likes: formData.myLikes.split(',').map(s => s.trim()).filter(Boolean),
        partner1_dislikes: formData.myDislikes.split(',').map(s => s.trim()).filter(Boolean),
        partner1_fav_movies: formData.myFavMovies.split(',').map(s => s.trim()).filter(Boolean),
        partner1_fav_songs: formData.myFavSongs.split(',').map(s => s.trim()).filter(Boolean),
        partner1_fav_foods: formData.myFavFoods.split(',').map(s => s.trim()).filter(Boolean),
        partner1_birthday: formData.myBirthday || null,
      } : {
        partner2_name: formData.myName,
        partner2_pet_name: formData.myPetName,
        partner2_likes: formData.myLikes.split(',').map(s => s.trim()).filter(Boolean),
        partner2_dislikes: formData.myDislikes.split(',').map(s => s.trim()).filter(Boolean),
        partner2_fav_movies: formData.myFavMovies.split(',').map(s => s.trim()).filter(Boolean),
        partner2_fav_songs: formData.myFavSongs.split(',').map(s => s.trim()).filter(Boolean),
        partner2_fav_foods: formData.myFavFoods.split(',').map(s => s.trim()).filter(Boolean),
        partner2_birthday: formData.myBirthday || null,
      }),
      first_meeting_date: formData.firstMeetingDate || null,
      first_date: formData.firstDate || null,
      proposal_date: formData.proposalDate || null,
      anniversary_date: formData.anniversaryDate || null,
      relationship_start_date: formData.relationshipStartDate || null,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from('couple_profiles')
      .update(updateData)
      .eq('couple_id', couple.id);

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Love Story
          </h1>
          <p className="text-gray-600">
            Share your story and preferences to make your space truly yours
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Smile className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-800">About You Two</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.myName}
                  onChange={(e) => setFormData({ ...formData, myName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  placeholder="Your beautiful name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Pet Name
                </label>
                <input
                  type="text"
                  value={formData.myPetName}
                  onChange={(e) => setFormData({ ...formData, myPetName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  placeholder="Baby, Sweetheart, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Birthday
                </label>
                <input
                  type="date"
                  value={formData.myBirthday}
                  onChange={(e) => setFormData({ ...formData, myBirthday: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner's Birthday
                </label>
                <input
                  type="date"
                  value={formData.partnerBirthday}
                  onChange={(e) => setFormData({ ...formData, partnerBirthday: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-800">Important Dates</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Meeting Date
                </label>
                <input
                  type="date"
                  value={formData.firstMeetingDate}
                  onChange={(e) => setFormData({ ...formData, firstMeetingDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Date
                </label>
                <input
                  type="date"
                  value={formData.firstDate}
                  onChange={(e) => setFormData({ ...formData, firstDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship Start Date
                </label>
                <input
                  type="date"
                  value={formData.relationshipStartDate}
                  onChange={(e) => setFormData({ ...formData, relationshipStartDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anniversary Date
                </label>
                <input
                  type="date"
                  value={formData.anniversaryDate}
                  onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal Date
                </label>
                <input
                  type="date"
                  value={formData.proposalDate}
                  onChange={(e) => setFormData({ ...formData, proposalDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Film className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-800">Favorites</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Favorite Movies
                  </label>
                  <input
                    type="text"
                    value={formData.myFavMovies}
                    onChange={(e) => setFormData({ ...formData, myFavMovies: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Titanic, The Notebook (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Favorite Songs
                  </label>
                  <input
                    type="text"
                    value={formData.myFavSongs}
                    onChange={(e) => setFormData({ ...formData, myFavSongs: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Perfect, All of Me (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Favorite Foods
                  </label>
                  <input
                    type="text"
                    value={formData.myFavFoods}
                    onChange={(e) => setFormData({ ...formData, myFavFoods: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Pizza, Chocolate (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Things You Like
                  </label>
                  <input
                    type="text"
                    value={formData.myLikes}
                    onChange={(e) => setFormData({ ...formData, myLikes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Reading, Travel, Music (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Things You Dislike
                  </label>
                  <input
                    type="text"
                    value={formData.myDislikes}
                    onChange={(e) => setFormData({ ...formData, myDislikes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="Spiders, Cold weather (comma separated)"
                  />
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center">
              Profile updated successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg text-lg"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
