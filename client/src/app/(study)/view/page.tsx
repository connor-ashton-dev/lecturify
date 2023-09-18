"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import axios from "axios";
import { userStore } from "@/utils/store";
import Link from "next/link";

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
  const { user } = userStore((state) => {
    return {
      user: state.user,
    };
  });

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
    if (user) {
      getClasses();
    } else {
      window.location.href = "/";
    }
  }, [user]);

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
                <Link href={`/view/${c.id}`} key={c.id}>
                  <Card className="w-40 md:w-52 md:h-40 flex flex-col items-center justify-center text-center md:rounded-2xl">
                    <CardHeader>
                      <CardTitle>{c.title}</CardTitle>
                      <CardDescription>
                        {c.lectures.length} lecture(s)
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
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
