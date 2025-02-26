
import { corsHeaders } from './cors.ts'

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  status: number;
}

export const createErrorResponse = (error: unknown, status = 400): Response => {
  const errorResponse: ErrorResponse = {
    error: error instanceof Error ? error.message : 'Unknown error occurred',
    status,
  }

  if (error instanceof Error && 'code' in error) {
    errorResponse.code = (error as { code: string }).code
  }

  console.error('Error:', errorResponse)

  return new Response(
    JSON.stringify(errorResponse),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  )
}
