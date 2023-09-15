import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  //get params from request
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  //get user's classes from db
  if (userId) {
    const classes = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        classes: true,
      },
    });
    return NextResponse.json({ result: classes });
  } else {
    return new Response("No user ID provided");
  }
}
