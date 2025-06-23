import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface DownloadData {
  fileName: string;
  rowCount: number;
  columnCount: number;
  fileSize: number;
  ticketNumber: string;
  downloadType: 'free' | 'pro' | 'single';
}

function validateDownloadData(data: DownloadData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fileName || typeof data.fileName !== 'string' || data.fileName.trim().length === 0) {
    errors.push('fileName is required and must be a non-empty string');
  }

  if (!data.ticketNumber || typeof data.ticketNumber !== 'string' || data.ticketNumber.trim().length === 0) {
    errors.push('ticketNumber is required and must be a non-empty string');
  }

  if (typeof data.rowCount !== 'number' || data.rowCount < 0) {
    errors.push('rowCount must be a non-negative number');
  }

  if (typeof data.columnCount !== 'number' || data.columnCount < 0) {
    errors.push('columnCount must be a non-negative number');
  }

  if (typeof data.fileSize !== 'number' || data.fileSize < 0) {
    errors.push('fileSize must be a non-negative number');
  }

  if (!data.downloadType || !['free', 'pro', 'single'].includes(data.downloadType)) {
    errors.push('downloadType must be one of: free, pro, single');
  }

  return { isValid: errors.length === 0, errors };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body to get the intended method and data
    let requestBody: any = {};
    try {
      const bodyText = await req.text();
      if (bodyText) {
        requestBody = JSON.parse(bodyText);
      }
    } catch {
      // If body parsing fails, continue with empty object
    }

    // Determine the actual method - check _method field first, then fall back to req.method
    const method = requestBody._method || req.method;
    const url = new URL(req.url);

    switch (method) {
      case 'GET': {
        // Get download history with pagination
        const page = parseInt(requestBody.page || url.searchParams.get('page') || '1');
        const limit = parseInt(requestBody.limit || url.searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const { data: downloads, error: getError, count } = await supabaseClient
          .from('download_history')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (getError) {
          throw getError;
        }

        return new Response(
          JSON.stringify({ 
            downloads,
            pagination: {
              page,
              limit,
              total: count,
              totalPages: Math.ceil((count || 0) / limit)
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'POST': {
        // Record a new download
        const downloadData: DownloadData = requestBody;

        // Validate the download data
        const { isValid, errors } = validateDownloadData(downloadData);
        if (!isValid) {
          return new Response(
            JSON.stringify({ error: 'Validation failed', details: errors }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Record the download
        const { data: download, error: insertError } = await supabaseClient
          .from('download_history')
          .insert({
            user_id: user.id,
            file_name: downloadData.fileName.trim(),
            row_count: downloadData.rowCount,
            column_count: downloadData.columnCount,
            file_size: downloadData.fileSize,
            ticket_number: downloadData.ticketNumber.trim(),
            download_type: downloadData.downloadType,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return new Response(
          JSON.stringify({ download }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
  } catch {
    console.error('Error in download-history function');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});