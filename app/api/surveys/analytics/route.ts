// app/api/surveys/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - no token" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized - invalid token" },
        { status: 401 },
      );
    }

    const surveys = await prisma.surveyResponse.findMany({
      where: { ownerId: payload.ownerId },
      orderBy: { ts: "desc" },
    });

    const total = surveys.length;
    const langEn = surveys.filter((s) => s.lang === "en").length;
    const langPt = surveys.filter((s) => s.lang === "pt").length;
    const firstTimers = surveys.filter((s) => s.firstTime === "yes").length;

    // Ratings averages (same as before, unchanged)
    const ratings = {
      checkinWaitTime: surveys
        .map((s) => s.checkinWaitTime)
        .filter((r): r is number => r !== null),
      checkinEfficiency: surveys
        .map((s) => s.checkinEfficiency)
        .filter((r): r is number => r !== null),
      securityWaitTime: surveys
        .map((s) => s.securityWaitTime)
        .filter((r): r is number => r !== null),
      securityOrganization: surveys
        .map((s) => s.securityOrganization)
        .filter((r): r is number => r !== null),
      staffProfessionalism: surveys
        .map((s) => s.staffProfessionalism)
        .filter((r): r is number => r !== null),
      cleanlinessToilets: surveys
        .map((s) => s.cleanlinessToilets)
        .filter((r): r is number => r !== null),
      cleanlinessTerminal: surveys
        .map((s) => s.cleanlinessTerminal)
        .filter((r): r is number => r !== null),
    };

    const staffHelpful = surveys
      .map((s) => s.staffHelpful)
      .filter((r): r is number => r !== null);
    const staffClear = surveys
      .map((s) => s.staffClear)
      .filter((r): r is number => r !== null);
    const overallRating = surveys
      .map((s) => s.overallRating)
      .filter((r): r is number => r !== null);

    // Issue frequency
    const issueCounts: Record<string, number> = {};
    surveys.forEach((s) => {
      s.issues.forEach((issue) => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
      });
    });

    // ❌ REMOVE recentFeedback block entirely
    // No free‑text fields exist in the survey, so we don't return any feedback array.

    return NextResponse.json(
      {
        total,
        langEn,
        langPt,
        firstTimers,
        ratings: {
          checkinWaitTime:
            ratings.checkinWaitTime.length > 0
              ? ratings.checkinWaitTime.reduce((a, b) => a + b, 0) /
                ratings.checkinWaitTime.length
              : 0,
          checkinEfficiency:
            ratings.checkinEfficiency.length > 0
              ? ratings.checkinEfficiency.reduce((a, b) => a + b, 0) /
                ratings.checkinEfficiency.length
              : 0,
          securityWaitTime:
            ratings.securityWaitTime.length > 0
              ? ratings.securityWaitTime.reduce((a, b) => a + b, 0) /
                ratings.securityWaitTime.length
              : 0,
          securityOrganization:
            ratings.securityOrganization.length > 0
              ? ratings.securityOrganization.reduce((a, b) => a + b, 0) /
                ratings.securityOrganization.length
              : 0,
          staffProfessionalism:
            ratings.staffProfessionalism.length > 0
              ? ratings.staffProfessionalism.reduce((a, b) => a + b, 0) /
                ratings.staffProfessionalism.length
              : 0,
          cleanlinessToilets:
            ratings.cleanlinessToilets.length > 0
              ? ratings.cleanlinessToilets.reduce((a, b) => a + b, 0) /
                ratings.cleanlinessToilets.length
              : 0,
          cleanlinessTerminal:
            ratings.cleanlinessTerminal.length > 0
              ? ratings.cleanlinessTerminal.reduce((a, b) => a + b, 0) /
                ratings.cleanlinessTerminal.length
              : 0,
        },
        staffHelpful:
          staffHelpful.length > 0
            ? staffHelpful.reduce((a, b) => a + b, 0) / staffHelpful.length
            : 0,
        staffClear:
          staffClear.length > 0
            ? staffClear.reduce((a, b) => a + b, 0) / staffClear.length
            : 0,
        overallRating:
          overallRating.length > 0
            ? overallRating.reduce((a, b) => a + b, 0) / overallRating.length
            : 0,
        issueCounts,
        // ❌ recentFeedback removed
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
