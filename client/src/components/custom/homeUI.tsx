"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useLectureStore, userStore } from "@/utils/store";
import { useRouter } from "next/navigation";
import { ComboBox } from "./comboBox";
import { User } from "@prisma/client";

interface HomeUIProps {
  user: User | null;
}

const HomeUI = ({ user }: HomeUIProps) => {
  const [noteTitle, setNoteTitle] = React.useState<string>("");
  const { changeClass, changeTitle } = useLectureStore((state) => state);
  const router = useRouter();
  const { setUser } = userStore((state) => {
    return {
      setUser: state.setUser,
    };
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);

  const handleCreateLecture = async () => {
    changeTitle(noteTitle);
    router.push(`/record`);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-8 ">
      {/* LINKS */}
      <div className="flex flex-col md:flex-row gap-8 mt-36">
        {/* TRANSCRIBE */}
        <Dialog>
          <DialogTrigger>
            <Card className="w-80 md:w-96 md:h-80 flex flex-col items-center justify-center text-center md:rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-500">
                  Transcribe a lecture ✍️
                </CardTitle>
                <CardDescription>
                  Take your hands off the keyboard and let us do the work for
                  you.
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a lecture</DialogTitle>
              <DialogDescription>
                Fill in some info about your lecture
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Class (click to select)</Label>
              <ComboBox />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Note Title</Label>
              <Input
                type="text"
                placeholder="Title here..."
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <div className="w-full flex justify-start">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleCreateLecture}
                >
                  Create
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* VIEW */}
        <Link href={"/view"}>
          <Card className="w-80 md:w-96 md:h-80 flex flex-col items-center justify-center text-center md:rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-500">
                View your lectures 👀
              </CardTitle>
              <CardDescription>
                Use AI to your advantage. Get help and understand exactly what
                your teachers are telling you.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default HomeUI;
