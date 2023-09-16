import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { classId } = await req.json();
  //get user's classes from db
  if (classId) {
    const myClass = await db.class.findFirst({
      where: { id: classId },
      include: { lectures: true },
    });
    return NextResponse.json({ result: myClass });
  } else {
    return new Response("No class ID provided");
  }
}
