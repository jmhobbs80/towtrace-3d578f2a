
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { invoiceId } = await req.json();

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, organizations(name, billing_details)')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) throw invoiceError;

    // Generate HTML for PDF with watermark logo
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif;
              position: relative;
            }
            .invoice-header { 
              margin-bottom: 2em;
              position: relative;
              z-index: 2;
            }
            .invoice-items { 
              width: 100%;
              border-collapse: collapse;
              position: relative;
              z-index: 2;
            }
            .invoice-items th, .invoice-items td { 
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              opacity: 0.05;
              z-index: 1;
              width: 300px;
              height: auto;
            }
            .header-logo {
              width: 120px;
              height: auto;
              margin-bottom: 1em;
            }
          </style>
        </head>
        <body>
          <!-- Watermark Logo -->
          <img src="data:image/svg+xml,${encodeURIComponent(`<svg viewBox='0 0 512 128' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M400 64H100L150 32H450L400 64Z' fill='#9b87f5'/>
            <path d='M380 80H80L130 48H430L380 80Z' fill='#9b87f5' opacity='0.9'/>
            <path d='M360 96H60L110 64H410L360 96Z' fill='#9b87f5' opacity='0.8'/>
            <path d='M340 112H40L90 80H390L340 112Z' fill='#9b87f5' opacity='0.7'/>
            <path d='M90 80L130 48H150L110 80H90Z' fill='#4B5563'/>
            <path d='M110 64L150 32H170L130 64H110Z' fill='#4B5563'/>
            <path d='M130 48L170 16H190L150 48H130Z' fill='#4B5563'/>
            <path d='M150 32L190 0H210L170 32H150Z' fill='#4B5563'/>
          </svg>`)}" class="watermark" alt="TowTrace Watermark" />

          <div class="invoice-header">
            <!-- Header Logo -->
            <img src="data:image/svg+xml,${encodeURIComponent(`<svg viewBox='0 0 512 128' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M400 64H100L150 32H450L400 64Z' fill='#9b87f5'/>
              <path d='M380 80H80L130 48H430L380 80Z' fill='#9b87f5' opacity='0.9'/>
              <path d='M360 96H60L110 64H410L360 96Z' fill='#9b87f5' opacity='0.8'/>
              <path d='M340 112H40L90 80H390L340 112Z' fill='#9b87f5' opacity='0.7'/>
              <path d='M90 80L130 48H150L110 80H90Z' fill='#4B5563'/>
              <path d='M110 64L150 32H170L130 64H110Z' fill='#4B5563'/>
              <path d='M130 48L170 16H190L150 48H130Z' fill='#4B5563'/>
              <path d='M150 32L190 0H210L170 32H150Z' fill='#4B5563'/>
            </svg>`)}" class="header-logo" alt="TowTrace" />
            
            <h1>Invoice ${invoice.invoice_number}</h1>
            <p>Date: ${new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
          
          <table class="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>$${invoice.total_amount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    // Return the HTML with the watermark and header logo
    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
