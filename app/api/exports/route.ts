import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const createdAt = Date.now();
    const userId = session?.user?.id || null;

    await db.execute({
      sql: "INSERT INTO exports (id, content, created_at, user_id) VALUES (?, ?, ?, ?)",
      args: [id, content, createdAt, userId],
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Failed to save export" },
      { status: 500 }
    );
  }
}
