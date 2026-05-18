import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, company, email, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await transporter.sendMail({
      from: `"AeroPalma Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.SURVEY_RECEIVER_EMAIL,
      subject: `New Contact Form Submission - ${service || "General"}`,
      html: `
        <h2>New Contact Message</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Company:</b> ${company || "-"}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Service:</b> ${service || "-"}</p>

        <hr />

        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
