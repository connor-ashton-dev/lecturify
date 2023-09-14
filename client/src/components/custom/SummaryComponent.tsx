import React, { useEffect } from "react";
import styles from "./summary.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Timer from "./Timer";
import { useLectureStore } from "@/utils/store";
import { useRouter } from "next/navigation";

interface SummaryProps {
  result: string;
  recording: boolean;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const Summary = ({ result, recording, seconds, setSeconds }: SummaryProps) => {
  const { title, className } = useLectureStore((state) => {
    return { title: state.title, className: state.class };
  });
  const router = useRouter();

  if (!title || !className) {
    router.push("/");
  }

  return (
    <div>
      <Card className="relative">
        {recording && <Timer seconds={seconds} setSeconds={setSeconds} />}
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-500 font-bold">
            {title}
          </CardTitle>
          <CardDescription>{className}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={styles.summaryDiv}
            dangerouslySetInnerHTML={{ __html: result }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
