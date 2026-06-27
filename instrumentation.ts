export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'http://localhost:3000'

  const ping = () =>
    fetch(`${baseUrl}/api/health`).catch((err) =>
      console.error('[keep-alive] ping failed:', err.message),
    )

  ping()
  setInterval(ping, 14 * 60 * 1000)
}
