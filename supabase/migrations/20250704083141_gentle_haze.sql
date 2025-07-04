/*
  # Add SMS notification triggers

  1. Database Functions
    - Function to trigger SMS notifications for new members
    - Function to trigger SMS notifications for expiring memberships
  
  2. Triggers
    - Trigger on member insert to send welcome SMS
    - Scheduled function for expiry reminders (to be called by cron)
  
  3. Security
    - Functions are security definer to allow edge function access
*/

-- Function to trigger welcome SMS for new members
CREATE OR REPLACE FUNCTION public.trigger_welcome_sms()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the edge function to send welcome SMS
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-sms-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object(
        'type', 'welcome',
        'member_id', NEW.id
      )
    );
  
  RETURN NEW;
END;
$$;

-- Function to trigger expiry SMS notifications (to be called by cron)
CREATE OR REPLACE FUNCTION public.trigger_expiry_sms_batch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the edge function to send bulk expiry SMS
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/send-sms-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object(
        'type', 'expiry_bulk',
        'days_before', 5
      )
    );
END;
$$;

-- Trigger to send welcome SMS when new member is added
CREATE TRIGGER trigger_member_welcome_sms
  AFTER INSERT ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_welcome_sms();

-- Note: For expiry SMS, you would typically set up a cron job to call:
-- SELECT public.trigger_expiry_sms_batch();
-- This should be scheduled to run daily at a specific time.