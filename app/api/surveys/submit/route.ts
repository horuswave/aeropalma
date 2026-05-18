// app/api/surveys/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.ownerId || !body.lang) {
      return NextResponse.json(
        { error: "ownerId and lang are required" },
        { status: 400 },
      );
    }

    const survey = await prisma.surveyResponse.create({
      data: {
        ownerId: body.ownerId,
        lang: body.lang,
        ts: BigInt(Date.now()),
        firstTime: body.firstTime,
        checkinWaitTime: body.ratings?.["checkinWaitTime"],
        checkinEfficiency: body.ratings?.["checkinEfficiency"],
        securityWaitTime: body.ratings?.["securityWaitTime"],
        securityOrganization: body.ratings?.["securityOrganization"],
        staffProfessionalism: body.ratings?.["staffProfessionalism"],
        cleanlinessToilets: body.ratings?.["cleanlinessToilets"],
        cleanlinessTerminal: body.ratings?.["cleanlinessTerminal"],
        issues: body.issues || [],
        staffHelpful: body.staffHelpful,
        staffClear: body.staffClear,
        overallRating: body.overallRating,
        followUpEmail: body.followUpEmail || null,
      },
    });

    // -----------------------------
    // EMAIL NOTIFICATION
    // -----------------------------
    const receiver = process.env.SURVEY_RECEIVER_EMAIL;

    await transporter.sendMail({
      from: `"Survey System" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: "New Survey Submission",
      text: `
New survey submitted:

Language: ${body.lang}
Overall Rating: ${body.overallRating ?? "N/A"}
Issues: ${(body.issues || []).join(", ") || "None"}
Follow-up Email: ${body.followUpEmail || "None"}

Survey ID: ${survey.id}
      `,
    });

    return NextResponse.json(
      {
        success: true,
        survey: {
          id: survey.id,
          ts: survey.ts.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 },
    );
  }
}
