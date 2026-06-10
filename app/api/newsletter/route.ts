import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"AeroPalma Newsletter" <${process.env.EMAIL_USER}>`,
      to: "imongo@aeropalma.aero",
      subject: "New Newsletter Subscription",
      html: `
        <h2>New Newsletter Subscriber</h2>
        <p><b>Email:</b> ${email}</p>
        <p>A new user has subscribed to the AeroPalma newsletter from the website.</p>
        <hr />
        <p><small>Received at: ${new Date().toLocaleString("pt-MZ")}</small></p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription successful",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
