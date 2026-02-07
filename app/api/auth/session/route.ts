import { NextResponse } from "next/server";

// Lightweight session stub to avoid NextAuth client fetch errors when auth is not configured
export async function GET() {
  return NextResponse.json({ user: null, expires: null });
}
