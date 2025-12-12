import { ApiResponseStatuses } from './ApiResponseStatuses'

export const ApiResponse = (content: Record<string, unknown>, status: ApiResponseStatuses) => {
  return new Response(
    JSON.stringify({
      ...content,
    }),
    { status },
  )
}
