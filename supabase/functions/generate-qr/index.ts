// supabase/functions/generate-qr/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function generateQRImageBuffer(url: string): Promise<Uint8Array> {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=10&data=${encodeURIComponent(url)}`;
  const response = await fetch(qrApiUrl);
  if (!response.ok) throw new Error('QR API failed');
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const { plantId } = await req.json();

    if (!plantId || typeof plantId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'plantId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use automatically provided environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing environment variables: SUPABASE_URL or SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Build the plant's public URL
    const origin = req.headers.get('origin') ?? supabaseUrl;
    const plantUrl = `${origin}/plant/${plantId}`;

    // Generate QR image bytes
    const imageBytes = await generateQRImageBuffer(plantUrl);

    // Upload to Supabase Storage
    const storagePath = `qr-codes/${plantId}.png`;
    const { error: uploadError } = await supabase.storage
      .from('plant-images')
      .upload(storagePath, imageBytes, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload QR code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('plant-images')
      .getPublicUrl(storagePath);

    const qrUrl = publicUrlData.publicUrl;

    // Update plant row with qr_url
    await supabase
      .from('plants')
      .update({ qr_url: qrUrl })
      .eq('id', plantId);

    return new Response(
      JSON.stringify({ qrUrl }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Generate QR error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
