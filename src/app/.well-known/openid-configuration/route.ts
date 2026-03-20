import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return NextResponse.json({
    issuer: url,
    jwks_uri: `${url}/.well-known/jwks.json`,
  })
}
