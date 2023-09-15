import HomeUI from "@/components/custom/homeUI";
import { initialProfile } from "@/utils/users";
import { currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";

export default async function Home() {
  const user = await currentUser();
  const prismaUser: User | null = await initialProfile(user);
  return <HomeUI user={prismaUser} />;
}
