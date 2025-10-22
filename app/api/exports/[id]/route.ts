import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership
    const result = await db.execute({
      sql: "SELECT user_id FROM exports WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Export not found" },
        { status: 404 }
      );
    }

    if (result.rows[0].user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete export
    await db.execute({
      sql: "DELETE FROM exports WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete export" },
      { status: 500 }
    );
  }
}
