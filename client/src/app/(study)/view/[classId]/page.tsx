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

type classType = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  lectures: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    classId: string;
  }[];
};

const ClassPage = ({ params }: { params: { classId: string } }) => {
  const [data, setData] = React.useState<classType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  useEffect(() => {
    const getCurrentClass = async () => {
      setLoading(true);
      const myClass = await axios.post("/api/classes/getClass", {
        classId: params.classId,
      });
      setData(myClass.data.result);
      setLoading(false);
    };

    getCurrentClass();
  }, [params.classId]);
  return (
    <div className="flex flex-col items-center">
      {data ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold py-4">{data.title}:</h1>
          <div className="flex flex-row gap-4">
            {data?.lectures.map((l) => (
              <Link href={`/view/lecture/${l.id}`} key={l.id}>
                <Card className="w-40 md:w-52 md:h-40 flex flex-col items-center justify-center text-center md:rounded-2xl">
                  <CardHeader>
                    <CardTitle>{l.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
};

export default ClassPage;
