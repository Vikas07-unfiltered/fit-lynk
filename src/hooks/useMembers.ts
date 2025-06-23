
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Member, NewMember } from '@/types/member';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
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
        user_id: '', // This will be overridden by the database trigger
        name: newMemberData.name,
        phone: newMemberData.phone,
        plan: newMemberData.plan,
        status: 'active',
        join_date: newMemberData.join_date || new Date().toISOString().split('T')[0],
        last_payment: newMemberData.first_payment_date || new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('members')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setMembers([data as Member, ...members]);
      
      toast({
        title: "Success",
        description: `Member added successfully with ID: ${data.user_id}`,
      });
      
      return true;
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
  }, []);

  return {
    members,
    loading,
    addMember,
    fetchMembers,
  };
};
