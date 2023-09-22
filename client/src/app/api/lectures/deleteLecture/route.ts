import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lectureId, studentId } = await req.json();
  if (!lectureId) return new NextResponse("Missing classId", { status: 400 });
  if (!studentId) return new NextResponse("Missing studentId", { status: 400 });

  try {
    // find lecture
    const lectureDoc = await db.lecture.findFirst({
      where: {
        id: lectureId,
        Class: {
          userId: studentId,
        },
      },
    });

    if (!lectureDoc)
      return new NextResponse("Lecture not found", { status: 404 });

    // delete lecture
    await db.lecture.delete({
      where: {
        id: lectureId,
        Class: {
          userId: studentId,
        },
      },
    });
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occured in deleting class", {
      status: 500,
    });
  }
}
