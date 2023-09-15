import { db } from "@/lib/db";
import { User } from "@clerk/nextjs/server";

export const initialProfile = async (user: User | null) => {
  if (!user) {
    return null;
  }
  const profile = await db.user.findFirst({
    where: { id: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.user.create({
    data: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  });

  return newProfile;
};
