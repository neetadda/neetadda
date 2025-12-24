import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all pending messages that should be sent now
    const now = new Date().toISOString();
    
    const { data: messages, error: messagesError } = await supabaseClient
      .from('admin_messages')
      .select('*')
      .eq('sent', false)
      .lte('scheduled_at', now);

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      throw messagesError;
    }

    console.log(`Found ${messages?.length || 0} messages to send`);

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No pending messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all push subscriptions
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('push_subscriptions')
      .select('*');

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
    }

    console.log(`Found ${subscriptions?.length || 0} subscriptions`);

    // For each message, send to all subscriptions
    for (const message of messages) {
      console.log(`Processing message: ${message.id}`);
      
      // Mark message as sent
      const { error: updateError } = await supabaseClient
        .from('admin_messages')
        .update({ sent: true })
        .eq('id', message.id);

      if (updateError) {
        console.error('Error updating message:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messagesSent: messages.length,
        subscriptionsNotified: subscriptions?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in send-notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
