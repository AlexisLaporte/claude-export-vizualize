import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db.execute({
      sql: "SELECT id, created_at, views FROM exports WHERE user_id = ? ORDER BY created_at DESC",
      args: [session.user.id],
    });

    return NextResponse.json({
      exports: result.rows,
    });
  } catch (error) {
    console.error("Fetch exports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exports" },
      { status: 500 }
    );
  }
}
