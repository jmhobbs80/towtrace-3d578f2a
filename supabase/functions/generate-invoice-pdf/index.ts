
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

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .invoice-header { margin-bottom: 2em; }
            .invoice-items { width: 100%; border-collapse: collapse; }
            .invoice-items th, .invoice-items td { padding: 8px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
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

    // For this example, we'll return the HTML directly
    // In a production environment, you'd want to convert this to PDF
    // using a service like Puppeteer or a PDF generation API
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
