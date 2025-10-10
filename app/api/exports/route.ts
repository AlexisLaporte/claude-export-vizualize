import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const createdAt = Date.now();

    await db.execute({
      sql: "INSERT INTO exports (id, content, created_at) VALUES (?, ?, ?)",
      args: [id, content, createdAt],
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
