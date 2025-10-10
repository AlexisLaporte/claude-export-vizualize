import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db.execute({
      sql: "SELECT content FROM exports WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Export not found" },
        { status: 404 }
      );
    }

    // Increment views
    await db.execute({
      sql: "UPDATE exports SET views = views + 1 WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({
      content: result.rows[0].content,
    });
  } catch (error) {
    console.error("Load error:", error);
    return NextResponse.json(
      { error: "Failed to load export" },
      { status: 500 }
    );
  }
}
