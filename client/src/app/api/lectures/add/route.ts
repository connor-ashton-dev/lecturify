import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { classId, userId, transcript, title } = await req.json();

  // lecture to users class
  const lecture = await db.lecture.create({
    data: {
      title: title,
      content: transcript,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  });

  if (lecture) {
    const myClass = await db.class.update({
      where: {
        id: classId,
      },
      data: {
        lectures: {
          connect: {
            id: lecture.id,
          },
        },
      },
    });

    if (!myClass) {
      return new Response("Error connecting lecture to class");
    }

    return new Response("Success");
  } else {
    return new Response("Error creating lecture");
  }
}
