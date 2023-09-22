"use client";
import React, { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

type lectureType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  classId: string;
};

type classType = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lectures: lectureType[];
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [data, setData] = React.useState<classType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [changeLoading, setChangeLoading] = React.useState<string>("");
  const [lectures, setLectures] = React.useState<lectureType[]>([]);
  const [newName, setNewName] = React.useState<string>("");
  useEffect(() => {
    const getCurrentClass = async () => {
      setLoading(true);
      const myClass = await axios.post("/api/classes/getClass", {
        classId: params.classId,
      });
      setData(myClass.data.result);
      setLectures(myClass.data.result.lectures);
      setLoading(false);
    };

    getCurrentClass();
  }, [params.classId]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const deleteLecture = async (lectureId: string) => {
    try {
      setChangeLoading(lectureId);
      await axios.post("/api/lectures/deleteLecture", {
        lectureId,
        studentId: user?.id,
      });
      const newLectures = lectures.filter((l) => l.id !== lectureId);
      setLectures(newLectures);
    } catch (error) {
      console.log(error);
    } finally {
      setChangeLoading("");
    }
  };

  const renameLecture = async (lectureId: string) => {
    try {
      //TODO: Handle this better
      if (!newName) throw new Error("Please enter a new name");
      setChangeLoading(lectureId);
      await axios.post("/api/lectures/renameLecture", {
        lectureId,
        studentId: user?.id,
        newName,
      });
      // change title in classes state
      const newLectures = lectures.map((l) => {
        if (l.id === lectureId) {
          l.title = newName;
        }
        return l;
      });
      setLectures(newLectures);
    } catch (error) {
      console.log(error);
    } finally {
      setChangeLoading("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {loading && <p className="text-center">Loading...</p>}
      {!loading && data && (
        <h1 className="text-2xl font-bold py-4">{data.title}:</h1>
      )}
      {!loading && data && lectures.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-4">
            {lectures.map((l) => (
              <Card
                className="relative w-40 md:w-52 md:h-40 flex flex-col items-center justify-center text-center md:rounded-2xl"
                key={l.id}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="absolute top-0 right-0 m-3 w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col">
                    <DropdownMenuLabel>Edit Lecture</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* CHANGE NAME TRIGGER */}
                    <AlertDialog>
                      <AlertDialogTrigger className="flex flex-row items-center text-sm hover:bg-gray-100 rounded-lg p-3">
                        <Pencil className="w-4 h-4 mr-2" />
                        Change Name
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure you want to change the name?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                          <Input
                            placeholder="New Lecture Name"
                            onChange={(e) => setNewName(e.target.value)}
                          />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <DropdownMenuTrigger>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </DropdownMenuTrigger>
                          <DropdownMenuTrigger>
                            <AlertDialogAction
                              onClick={() => renameLecture(l.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </DropdownMenuTrigger>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* DELETE TRIGGER*/}
                    <AlertDialog>
                      <AlertDialogTrigger className="flex flex-row items-center text-sm hover:bg-gray-100 rounded-lg p-3">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Lecture
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure you want to delete this
                            lecture?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your lecture and remove its data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <DropdownMenuTrigger>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </DropdownMenuTrigger>

                          <DropdownMenuTrigger>
                            <AlertDialogAction
                              onClick={() => deleteLecture(l.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </DropdownMenuTrigger>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href={`/view/lecture/${l.id}`} key={l.id}>
                  <CardHeader>
                    <CardTitle className="flex flex-row">
                      {l.title}
                      {/* show loader if matches changeLoading*/}
                      {changeLoading === l.id && (
                        <Loader2 className="animate-spin w-4 h-4 ml-2" />
                      )}
                    </CardTitle>
                    <CardDescription>{formatDate(l.createdAt)}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
      {!data ||
        (data.lectures.length == 0 && !loading && (
          <p className="text-center">No lectures found for this class</p>
        ))}
    </div>
  );
};

export default ClassPage;
