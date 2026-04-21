import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking, roomName } = await req.json()

    // Here you would integrate with an email provider like Resend, SendGrid, or Mailgun
    // Example using a simple fetch to an external API or just logging for now
    
    console.log(`Sending confirmation email to ${booking.guest_email} for booking ${booking.id}`)

    const emailHtml = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${booking.guest_name},</p>
      <p>Thank you for your booking at our hotel.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Room: ${roomName}</li>
        <li>Check-in: ${booking.check_in}</li>
        <li>Check-out: ${booking.check_out}</li>
        <li>Total Price: $${booking.total_price}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `

    // Mocking email success
    return new Response(
      JSON.stringify({ message: 'Confirmation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})