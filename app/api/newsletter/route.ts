import { NextResponse } from "next/server";

const message =
  "Newsletter został wyłączony. W sprawach kontaktu napisz na tomasz.chromy@outlook.com.";

export async function POST() {
  return NextResponse.json({ error: message }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: message }, { status: 410 });
}
