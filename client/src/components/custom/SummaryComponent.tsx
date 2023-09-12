import React from "react";
import styles from "./summary.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Timer from "./Timer";

interface SummaryProps {
  result: string;
  recording: boolean;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const Summary = ({ result, recording, seconds, setSeconds }: SummaryProps) => {
  return (
    <div>
      <Card className="relative">
        {recording && <Timer seconds={seconds} setSeconds={setSeconds} />}
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-500 font-bold">
            Note Title
          </CardTitle>
          <CardDescription>Class Name</CardDescription>
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
