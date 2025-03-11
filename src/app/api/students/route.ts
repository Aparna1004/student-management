import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { student } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Data:", body);

    if (!body.name || !body.email || !body.phone || !body.sem || !body.branch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insertedStudent = await db.insert(student).values(body).returning();
    console.log("Inserted Student:", insertedStudent);

    return NextResponse.json(insertedStudent[0], { status: 201 });
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
