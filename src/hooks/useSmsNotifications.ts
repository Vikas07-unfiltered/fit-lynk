import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSmsNotifications = () => {
  const sendWelcomeSms = async (memberId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'welcome',
          member_id: memberId
        }
      });

      if (error) throw error;

      toast({
        title: "Welcome SMS Sent",
        description: `Welcome message sent successfully!`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
      toast({
        title: "SMS Error",
        description: "Failed to send welcome SMS",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const sendExpirySms = async (memberId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'expiry',
          member_id: memberId
        }
      });

      if (error) throw error;

      toast({
        title: "Expiry SMS Sent",
        description: `Expiry reminder sent successfully!`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error sending expiry SMS:', error);
      toast({
        title: "SMS Error",
        description: "Failed to send expiry SMS",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const sendBulkExpirySms = async (daysBeforeExpiry: number = 5) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'expiry_bulk',
          days_before: daysBeforeExpiry
        }
      });

      if (error) throw error;

      toast({
        title: "Bulk SMS Sent",
        description: `Sent ${data?.successful_notifications || 0} expiry reminders`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error sending bulk expiry SMS:', error);
      toast({
        title: "SMS Error",
        description: "Failed to send bulk expiry SMS",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    sendWelcomeSms,
    sendExpirySms,
    sendBulkExpirySms
  };
};