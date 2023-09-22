import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { classId, studentId, newName } = await req.json();
  if (!classId) return new NextResponse("Missing classId", { status: 400 });
  if (!studentId) return new NextResponse("Missing studentId", { status: 400 });
  if (!newName) return new NextResponse("Missing newName", { status: 400 });

  try {
    // find class
    const classDoc = await db.class.findFirst({
      where: {
        id: classId,
        userId: studentId,
      },
    });

    if (!classDoc) return new NextResponse("Class not found", { status: 404 });

    // rename class
    await db.class.update({
      where: {
        id: classId,
        userId: studentId,
      },
      data: {
        title: newName,
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
