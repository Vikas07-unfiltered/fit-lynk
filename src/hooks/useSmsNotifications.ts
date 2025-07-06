import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSmsNotifications = () => {
  const sendWelcomeSms = async (memberId: string) => {
    try {
      console.log('Sending welcome SMS for member:', memberId);
      
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'welcome',
          member_id: memberId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Welcome SMS response:', data);

      toast({
        title: "Welcome SMS Sent",
        description: `Welcome message sent successfully!`,
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending welcome SMS:', error);
      
      let errorMessage = "Failed to send welcome SMS";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "SMS Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const sendExpirySms = async (memberId: string) => {
    try {
      console.log('Sending expiry SMS for member:', memberId);
      
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'expiry',
          member_id: memberId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Expiry SMS response:', data);

      toast({
        title: "Expiry SMS Sent",
        description: `Expiry reminder sent successfully!`,
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending expiry SMS:', error);
      
      let errorMessage = "Failed to send expiry SMS";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "SMS Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const sendBulkExpirySms = async (daysBeforeExpiry: number = 5) => {
    try {
      console.log('Sending bulk expiry SMS for members expiring in', daysBeforeExpiry, 'days');
      
      const { data, error } = await supabase.functions.invoke('send-sms-notifications', {
        body: {
          type: 'expiry_bulk',
          days_before: daysBeforeExpiry
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Bulk expiry SMS response:', data);

      const successCount = data?.successful_notifications || 0;
      const failedCount = data?.failed_notifications || 0;
      
      if (successCount > 0) {
        toast({
          title: "Bulk SMS Sent",
          description: `Sent ${successCount} expiry reminders${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
        });
      } else {
        toast({
          title: "No SMS Sent",
          description: "No members found with expiring memberships or all sends failed",
          variant: "destructive",
        });
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Error sending bulk expiry SMS:', error);
      
      let errorMessage = "Failed to send bulk expiry SMS";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "SMS Error",
        description: errorMessage,
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