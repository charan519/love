import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

type Couple = Database['public']['Tables']['couples']['Row'];
type CoupleProfile = Database['public']['Tables']['couple_profiles']['Row'];

export function useCouple() {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPartner1, setIsPartner1] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadCoupleData();

    const channel = supabase
      .channel('couple-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couples',
          filter: `partner1_id=eq.${user.id},partner2_id=eq.${user.id}`,
        },
        () => {
          loadCoupleData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couple_profiles',
        },
        () => {
          loadCoupleData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadCoupleData = async () => {
    if (!user) return;

    const { data: coupleData } = await supabase
      .from('couples')
      .select('*')
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .maybeSingle();

    setCouple(coupleData);
    setIsPartner1(coupleData?.partner1_id === user.id);

    if (coupleData) {
      const { data: profileData } = await supabase
        .from('couple_profiles')
        .select('*')
        .eq('couple_id', coupleData.id)
        .maybeSingle();

      setProfile(profileData);
    }

    setLoading(false);
  };

  const createCouple = async (inviteCode: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('couples')
      .insert({
        invite_code: inviteCode,
        partner1_id: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (!error && data) {
      await supabase.from('couple_profiles').insert({
        couple_id: data.id,
      });
    }

    return { data, error };
  };

  const joinCouple = async (inviteCode: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { data: existingCouple, error: fetchError } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', inviteCode)
      .maybeSingle();

    if (fetchError) return { error: fetchError };
    if (!existingCouple) return { error: 'Invalid invite code' };
    if (existingCouple.partner2_id) return { error: 'Couple already complete' };
    if (existingCouple.partner1_id === user.id) return { error: 'Cannot join your own couple' };

    const { data, error } = await supabase
      .from('couples')
      .update({
        partner2_id: user.id,
        status: 'active',
        connected_at: new Date().toISOString(),
      })
      .eq('id', existingCouple.id)
      .select()
      .single();

    return { data, error };
  };

  return {
    couple,
    profile,
    loading,
    isPartner1,
    createCouple,
    joinCouple,
    refreshCouple: loadCoupleData,
  };
}
