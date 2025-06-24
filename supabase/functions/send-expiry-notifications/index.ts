
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExpiringMember {
  member_id: string;
  member_name: string;
  member_phone: string;
  gym_id: string;
  plan_name: string;
  expiry_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestBody = await req.json().catch(() => ({}))
    const isIndividualNotification = requestBody.individual_notification === true
    const specificMemberId = requestBody.member_id

    console.log('Starting notification process...', {
      isIndividual: isIndividualNotification,
      memberId: specificMemberId
    })

    let expiringMembers: ExpiringMember[] = []

    if (isIndividualNotification && specificMemberId) {
      // Get specific member for individual notification
      const { data: member, error: memberError } = await supabaseClient
        .from('members')
        .select('id, name, phone, gym_id, plan, plan_expiry_date')
        .eq('id', specificMemberId)
        .eq('status', 'active')
        .single()

      if (memberError) {
        console.error('Error fetching specific member:', memberError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch member' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (member) {
        expiringMembers = [{
          member_id: member.id,
          member_name: member.name,
          member_phone: member.phone,
          gym_id: member.gym_id,
          plan_name: member.plan,
          expiry_date: member.plan_expiry_date
        }]
      }
    } else {
      // Get all members whose plans expire in 5 days (existing functionality)
      const { data, error: membersError } = await supabaseClient
        .rpc('get_expiring_members', { days_before: 5 })

      if (membersError) {
        console.error('Error fetching expiring members:', membersError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch expiring members' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      expiringMembers = data || []
    }

    console.log(`Found ${expiringMembers?.length || 0} members to notify`)

    if (!expiringMembers || expiringMembers.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: isIndividualNotification ? 'Member not found or already notified' : 'No expiring memberships found', 
          count: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get WhatsApp API credentials from environment
    const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const whatsappPhoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

    if (!whatsappToken || !whatsappPhoneNumberId) {
      console.error('WhatsApp credentials not found')
      return new Response(
        JSON.stringify({ error: 'WhatsApp credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let successCount = 0
    let errorCount = 0

    // Send WhatsApp message to each member
    for (const member of expiringMembers as ExpiringMember[]) {
      try {
        // Get gym details for personalized message
        const { data: gym } = await supabaseClient
          .from('gyms')
          .select('name')
          .eq('id', member.gym_id)
          .single()

        const gymName = gym?.name || 'Your Gym'
        
        // Format phone number (remove any non-digits and add country code if needed)
        let phoneNumber = member.member_phone.replace(/\D/g, '')
        if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
          phoneNumber = '91' + phoneNumber // Add India country code
        }

        // Prepare different messages based on notification type
        let message: string
        if (isIndividualNotification) {
          message = `🏋️ Hi ${member.member_name}!\n\n` +
            `This is a friendly reminder from ${gymName}.\n\n` +
            `Your ${member.plan_name} membership ${member.expiry_date ? `expires on ${new Date(member.expiry_date).toLocaleDateString()}` : 'requires attention'}.\n\n` +
            `Please contact us if you need any assistance or have questions about your membership.\n\n` +
            `Thank you for being a valued member! 💪`
        } else {
          message = `🏋️ Hi ${member.member_name}!\n\n` +
            `Your ${member.plan_name} membership at ${gymName} is expiring on ${new Date(member.expiry_date).toLocaleDateString()}.\n\n` +
            `To continue enjoying our services, please renew your membership soon.\n\n` +
            `Contact us for renewal or any questions!\n\n` +
            `Thank you for being a valued member! 💪`
        }

        // Send WhatsApp message using Facebook Graph API
        const whatsappResponse = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phoneNumber,
              type: 'text',
              text: {
                body: message
              }
            })
          }
        )

        if (whatsappResponse.ok) {
          // For bulk notifications, mark as sent. For individual, don't mark to allow repeated sends
          if (!isIndividualNotification) {
            await supabaseClient.rpc('mark_notification_sent', { 
              member_id: member.member_id 
            })
          }
          
          successCount++
          console.log(`✅ Notification sent to ${member.member_name} (${phoneNumber})`)
        } else {
          const errorData = await whatsappResponse.text()
          console.error(`❌ Failed to send to ${member.member_name}: ${errorData}`)
          errorCount++
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        console.error(`❌ Error processing member ${member.member_name}:`, error)
        errorCount++
      }
    }

    console.log(`✅ Notification process completed. Success: ${successCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({
        message: isIndividualNotification ? 'Individual notification processed' : 'Expiry notifications processed',
        total_members: expiringMembers.length,
        successful_notifications: successCount,
        failed_notifications: errorCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
