import { NextResponse } from "next/server";

/**
 * Stub endpoint for password reset flow.
 * TODO: Implement token storage + email delivery via Resend.
 */
export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: "" }));

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  // Placeholder response until full reset flow is wired
  return NextResponse.json({
    status: "pending",
    message: "Password reset flow not yet fully implemented. Token email would be sent here.",
  });
}
