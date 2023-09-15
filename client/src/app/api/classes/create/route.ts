import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, user } = await req.json();
  const myClass = await db.class.create({
    data: {
      title: title,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (myClass) {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        classes: {
          connect: {
            id: myClass.id,
          },
        },
      },
    });
  }
  return NextResponse.json({ result: myClass });
}
