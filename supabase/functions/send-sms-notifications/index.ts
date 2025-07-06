import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json().catch(() => ({}));
    const notificationType = requestBody.type;
    const memberId = requestBody.member_id;
    const daysBeforeExpiry = requestBody.days_before || 5;

    if (!notificationType || !memberId) {
      return new Response(JSON.stringify({ error: 'Missing notification type or member ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      return new Response(JSON.stringify({ error: 'SMS service not configured. Please contact administrator.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let members = [];
    let gyms = {};

    if ((notificationType === 'welcome' || notificationType === 'expiry') && memberId) {
      const { data: member, error: memberError } = await supabaseClient
        .from('members')
        .select('*')
        .eq('id', memberId)
        .eq('status', 'active')
        .single();

      if (memberError || !member) {
        return new Response(JSON.stringify({ error: 'Member not found or inactive' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      members = [member];
    } else if (notificationType === 'expiry_bulk') {
      const { data: expiringMembers, error: membersError } = await supabaseClient.rpc('get_expiring_members', {
        days_before: daysBeforeExpiry
      });

      if (membersError) {
        return new Response(JSON.stringify({ error: 'Failed to fetch expiring members' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      members = (expiringMembers || []).map((m) => ({
        id: m.member_id,
        name: m.member_name,
        phone: m.member_phone,
        gym_id: m.gym_id,
        plan: m.plan_name,
        plan_expiry_date: m.expiry_date,
        join_date: ''
      }));
    }

    if (members.length === 0) {
      return new Response(JSON.stringify({ message: 'No members found for notification', count: 0 }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const uniqueGymIds = [...new Set(members.map((m) => m.gym_id))];
    const { data: gymData } = await supabaseClient.from('gyms').select('id, name').in('id', uniqueGymIds);
    if (gymData) {
      gymData.forEach((gym) => {
        gyms[gym.id] = gym;
      });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const member of members) {
      try {
        const gymName = gyms[member.gym_id]?.name || 'Your Gym';

        let phoneNumber = member.phone.replace(/\D/g, '');
        if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
          phoneNumber = '+' + phoneNumber;
        } else if (phoneNumber.length === 10) {
          phoneNumber = '+91' + phoneNumber;
        } else if (phoneNumber.startsWith('1') && phoneNumber.length === 11) {
          phoneNumber = '+' + phoneNumber;
        } else if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+' + phoneNumber;
        }

        if (phoneNumber.length < 10) {
          errors.push(`Invalid phone number for ${member.name}`);
          errorCount++;
          continue;
        }

        let message;
        if (notificationType === 'welcome') {
          message = `Welcome to ${gymName}, ${member.name}! Your ${member.plan} plan is active. Let’s get started!`;
        } else {
          const expiryDate = member.plan_expiry_date
            ? new Date(member.plan_expiry_date).toLocaleDateString()
            : 'soon';
          message = `Hi ${member.name}, your ${member.plan} at ${gymName} expires on ${expiryDate}. Please renew soon to continue.`;
        }

        if (message.length > 150 && Deno.env.get('TWILIO_ACCOUNT_SID')?.startsWith('AC')) {
          message = message.slice(0, 150);
        }

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const twilioAuth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

        const twilioResponse = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${twilioAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: twilioPhoneNumber,
            To: phoneNumber,
            Body: message
          })
        });

        const responseData = await twilioResponse.text();
        if (twilioResponse.ok) {
          if (notificationType.includes('expiry')) {
            await supabaseClient.rpc('mark_notification_sent', { member_id: member.id });
          }
          successCount++;
        } else {
          errors.push(`Failed to send to ${member.name}: ${responseData}`);
          errorCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        errors.push(`Error processing ${member.name}: ${error.message}`);
        errorCount++;
      }
    }

    return new Response(JSON.stringify({
      message: `SMS notifications processed`,
      type: notificationType,
      total_members: members.length,
      successful_notifications: successCount,
      failed_notifications: errorCount,
      errors: errors.length > 0 ? errors : undefined
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
