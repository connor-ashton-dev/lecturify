"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import styles from "./lecture.module.css";
import React, { useEffect } from "react";
import axios from "axios";

type LectureType = {
  Class: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  classId: string;
};

const LecturePage = ({ params }: { params: { lectureId: string } }) => {
  const [result, setResult] = React.useState<LectureType | null>(null);
  useEffect(() => {
    const fetchLecture = async () => {
      const myLecture = await axios.post("/api/lectures/getLecture", {
        lectureId: params.lectureId,
      });
      console.log(myLecture.data.result);
      setResult(myLecture.data.result);
    };
    fetchLecture();
  }, [params.lectureId]);
  return (
    <>
      {result ? (
        <div className="mt-8 mx-8">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-500 font-bold">
                {result.title}
              </CardTitle>
              <CardDescription>{result.Class.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={styles.summaryDiv}
                dangerouslySetInnerHTML={{ __html: result?.content }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-row justify-center">loading...</div>
      )}
    </>
  );
};

export default LecturePage;
