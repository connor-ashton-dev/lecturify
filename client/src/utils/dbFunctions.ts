import { db } from "@/lib/db";
import { User } from "@prisma/client";

export const createClass = async (classTitle: string, user: User) => {
  try {
    const myClass = await db.class.create({
      data: {
        title: classTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

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

    return myClass;
  } catch (error) {
    console.log("Error occured when creating class: ", error);
  }
};
