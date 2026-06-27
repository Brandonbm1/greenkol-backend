import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.db.connection.db?.command({ ping: 1 })
    return NextResponse.json({ status: 'ok', db: 'ok' })
  } catch {
    return NextResponse.json({ status: 'ok', db: 'error' })
  }
}
