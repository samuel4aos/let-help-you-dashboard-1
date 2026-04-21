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

    console.log(`Sending confirmation email to ${booking.guestEmail} for booking ${booking.id}`)

    const emailHtml = `
      <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h1 style="color: #0f172a; text-align: center;">REGENCY</h1>
        <h2 style="color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Booking Confirmation</h2>
        <p>Dear ${booking.fullName || booking.guestName},</p>
        <p>Your reservation at The Grand Regency has been confirmed. We are excited to host you!</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking Reference:</strong> ${booking.id}</p>
            <p><strong>Suite:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Expected Arrival:</strong> ${booking.expectedArrivalTime || 'Not specified'}</p>
            <p><strong>Total Paid:</strong> $${booking.totalPrice}</p>
        </div>

        <p><strong>Guest Profile:</strong></p>
        <ul>
            <li><strong>Occupation:</strong> ${booking.occupation || 'N/A'}</li>
            <li><strong>Email:</strong> ${booking.guestEmail}</li>
            <li><strong>Phone:</strong> ${booking.guestPhone || 'N/A'}</li>
        </ul>

        <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
            <p>123 Luxury Ave, Victoria Island, Lagos, Nigeria</p>
            <p>If you have any questions, please contact our global concierge at +234 800 REGENCY.</p>
        </div>
      </div>
    `

    // Mocking email success - in production you'd use a provider like Resend
    // await resend.emails.send({ ... })

    return new Response(
      JSON.stringify({ 
        message: 'Confirmation email sent successfully',
        preview: emailHtml // For testing/simulation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})