import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields required." }, { status: 400 });
  }

  // Resend email delivery — add RESEND_API_KEY to .env.local to enable
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Log to console in dev until key is configured
    console.log("Contact form submission:", { name, email, message });
    return NextResponse.json({ success: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "paytonwallace.com <noreply@paytonwallace.com>",
      to: "payton@paytonwallace.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
