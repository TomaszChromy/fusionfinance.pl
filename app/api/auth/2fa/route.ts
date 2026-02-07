import { NextResponse } from "next/server";

/**
 * Stub endpoint for TOTP-based 2FA enable/verify.
 * TODO: Add secret generation, QR code, and verification using a stable storage.
 */
export async function POST(request: Request) {
  const { action } = await request.json().catch(() => ({ action: "status" }));

  return NextResponse.json({
    status: "pending",
    action,
    message: "2FA is not yet fully implemented. This endpoint is a placeholder.",
  });
}
