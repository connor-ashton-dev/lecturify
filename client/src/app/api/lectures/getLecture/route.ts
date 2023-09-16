import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lectureId } = await req.json();
  //get user's classes from db
  if (lectureId) {
    const myLecture = await db.lecture.findUnique({
      where: { id: lectureId },
      include: {
        Class: true,
      },
    });
    return NextResponse.json({ result: myLecture });
  } else {
    return new Response("No class ID provided");
  }
}
