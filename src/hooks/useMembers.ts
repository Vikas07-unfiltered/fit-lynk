import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Member, NewMember } from '@/types/member';
import { useAuth } from '@/hooks/useAuth';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { gym } = useAuth();

  const fetchMembers = async () => {
    if (!gym?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('gym_id', gym.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (newMemberData: NewMember) => {
    if (!gym?.id) {
      toast({
        title: "Error",
        description: "No gym selected",
        variant: "destructive",
      });
      return false;
    }

    if (!newMemberData.name || !newMemberData.phone || !newMemberData.plan) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    try {
      const insertData = {
        gym_id: gym.id,
        user_id: '', // This will be overridden by the database trigger
        name: newMemberData.name,
        phone: newMemberData.phone,
        plan: newMemberData.plan,
        status: 'active',
        join_date: newMemberData.join_date || new Date().toISOString().split('T')[0],
        last_payment: newMemberData.first_payment_date || new Date().toISOString().split('T')[0]
      };

      console.log('Inserting member data:', insertData);

      const { data, error } = await supabase
        .from('members')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Member inserted successfully:', data);

      // Update local state immediately
      setMembers([data as Member, ...members]);
      
      toast({
        title: "Success",
        description: `Member added successfully with ID: ${data.user_id}`,
      });
      
      // Return the new member data for SMS sending
      return data;
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [gym?.id]);

  return {
    members,
    loading,
    addMember,
    fetchMembers,
  };
};