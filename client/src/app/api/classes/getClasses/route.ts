import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  //get user's classes from db
  if (userId) {
    const classes = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        classes: {
          include: {
            lectures: true,
          },
        },
      },
    });
    return NextResponse.json({ result: classes });
  } else {
    return new Response("No user ID provided");
  }
}
