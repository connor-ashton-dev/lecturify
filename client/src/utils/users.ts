import { db } from "@/lib/db";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const profile = await db.user.findUnique({
    where: { id: user.id },
  });

  if (profile) return profile;

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
