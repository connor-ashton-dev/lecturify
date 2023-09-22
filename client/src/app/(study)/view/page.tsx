"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

import axios from "axios";
import { userStore } from "@/utils/store";
import Link from "next/link";
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

const url =
  process.env.NODE_ENV === "production"
    ? "https://lecturify.vercel.app"
    : "http://localhost:3000";

type classType = {
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
  userId: string;
  lectures: {
    id: string;
  }[];
};

const ViewClasses = () => {
  const [classes, setClasses] = useState<classType[]>([]);
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [changeLoading, setChangeLoading] = useState("");
  const [newName, setNewName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getClasses = async () => {
      if (user) {
        setLoading(true);
        const res = await axios.post("/api/classes/getClasses", {
          userId: user.id,
        });
        setClasses(res.data.result.classes);
        setLoading(false);
      }
    };
    getClasses();
  }, [user]);

  const deleteClass = async (classId: string) => {
    try {
      setChangeLoading(classId);
      await axios.post("/api/classes/deleteClass", {
        classId,
        studentId: user?.id,
      });
      const newClasses = classes.filter((c) => c.id !== classId);
      setClasses(newClasses);
    } catch (error) {
      console.log(error);
    } finally {
      setChangeLoading("");
    }
  };

  const renameClass = async (classId: string) => {
    try {
      //TODO: Handle this better
      if (!newName) throw new Error("Please enter a new name");
      setChangeLoading(classId);
      await axios.post("/api/classes/renameClass", {
        classId,
        studentId: user?.id,
        newName: newName,
      });
      // change title in classes state
      const newClasses = classes.map((c) => {
        if (c.id === classId) {
          c.title = newName;
        }
        return c;
      });
      setClasses(newClasses);
    } catch (error) {
      console.log(error);
    } finally {
      setChangeLoading("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold py-4">My Classes:</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {classes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {classes.map((c) => (
                <Card
                  className="relative w-40 md:w-52 md:h-40 flex flex-col items-center justify-center text-center md:rounded-2xl"
                  key={c.id}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="absolute top-0 right-0 m-3 w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col">
                      <DropdownMenuLabel>Edit Class</DropdownMenuLabel>
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
                              Are you absolutely sure you want to change the
                              name?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                            <Input
                              placeholder="New Class Name"
                              onChange={(e) => setNewName(e.target.value)}
                            />
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <DropdownMenuTrigger>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </DropdownMenuTrigger>
                            <DropdownMenuTrigger>
                              <AlertDialogAction
                                onClick={() => renameClass(c.id)}
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
                          Delete Class
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure you want to delete this
                              class?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this class and remove its data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <DropdownMenuTrigger>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </DropdownMenuTrigger>

                            <DropdownMenuTrigger>
                              <AlertDialogAction
                                onClick={() => deleteClass(c.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </DropdownMenuTrigger>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link href={`/view/${c.id}`}>
                    <CardHeader>
                      <CardTitle className="flex flex-row">
                        {c.title}
                        {/* show loader if matches changeLoading*/}
                        {changeLoading === c.id && (
                          <Loader2 className="animate-spin w-4 h-4 ml-2" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {c.lectures.length} lecture(s)
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center">No classes yet</p>
          )}
        </>
      )}
    </div>
  );
};

export default ViewClasses;
