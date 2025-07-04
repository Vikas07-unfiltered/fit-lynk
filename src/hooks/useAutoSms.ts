import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSmsNotifications } from '@/hooks/useSmsNotifications';

export const useAutoSms = () => {
  const { gym } = useAuth();
  const { sendWelcomeSms } = useSmsNotifications();

  useEffect(() => {
    if (!gym?.id) return;

    // Set up real-time subscription for new members
    const memberSubscription = supabase
      .channel('member-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'members',
          filter: `gym_id=eq.${gym.id}`
        },
        async (payload) => {
          console.log('New member added:', payload.new);
          
          // Send welcome SMS automatically
          if (payload.new && payload.new.id) {
            try {
              await sendWelcomeSms(payload.new.id);
              console.log('Welcome SMS sent for new member:', payload.new.name);
            } catch (error) {
              console.error('Failed to send welcome SMS:', error);
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(memberSubscription);
    };
  }, [gym?.id, sendWelcomeSms]);

  // Set up daily check for expiring memberships
  useEffect(() => {
    if (!gym?.id) return;

    const checkExpiringMemberships = async () => {
      try {
        // This would typically be handled by a cron job or scheduled function
        // For now, we'll check when the component mounts
        const { data: expiringMembers } = await supabase.rpc('get_expiring_members', {
          days_before: 5
        });

        if (expiringMembers && expiringMembers.length > 0) {
          console.log(`Found ${expiringMembers.length} members with expiring memberships`);
          // The actual SMS sending would be handled by a scheduled function
        }
      } catch (error) {
        console.error('Error checking expiring memberships:', error);
      }
    };

    // Check immediately and then set up interval (optional - mainly for demo)
    checkExpiringMemberships();
    
    // Check every hour (in production, this would be a server-side cron job)
    const interval = setInterval(checkExpiringMemberships, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [gym?.id]);
};