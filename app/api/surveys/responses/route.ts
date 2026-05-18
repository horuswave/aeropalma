import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractToken, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    // Optional query params: limit, offset, sort
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") || "desc"; // ts desc

    const surveys = await prisma.surveyResponse.findMany({
      where: { ownerId: payload.ownerId },
      orderBy: { ts: sort === "asc" ? "asc" : "desc" },
      skip: offset,
      take: Math.min(limit, 500),
    });

    // Convert BigInt ts to string for JSON serialization
    const formatted = surveys.map((s) => ({
      id: s.id,
      ts: s.ts.toString(),
      lang: s.lang,
      firstTime: s.firstTime,
      checkinWaitTime: s.checkinWaitTime,
      checkinEfficiency: s.checkinEfficiency,
      securityWaitTime: s.securityWaitTime,
      securityOrganization: s.securityOrganization,
      staffProfessionalism: s.staffProfessionalism,
      cleanlinessToilets: s.cleanlinessToilets,
      cleanlinessTerminal: s.cleanlinessTerminal,
      issues: s.issues,
      staffHelpful: s.staffHelpful,
      staffClear: s.staffClear,
      overallRating: s.overallRating,
      followUpEmail: s.followUpEmail,
      createdAt: s.createdAt.toISOString(),
    }));

    const total = await prisma.surveyResponse.count({
      where: { ownerId: payload.ownerId },
    });

    return NextResponse.json({
      responses: formatted,
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 },
    );
  }
}
