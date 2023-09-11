"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  setUpMediaRecorder,
  stopRecording,
  startRecording,
} from "@/utils/record";
import Summary from "@/components/custom/summary";
import Navbar from "@/components/custom/navbar";

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [micState, setMicState] = useState<any>("inactive");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  null;

  useEffect(() => {
    setUpMediaRecorder({
      mediaRecorderRef,
      setLoading,
      setResult,
    });
  }, []);
  return (
    <main className="w-screen h-screen bg-[#FAF9F6]">
      <Navbar />
      {/* <div> */}
      {/*   <p>Mic State: {micState}</p> */}
      {/* </div> */}
      <div className="m-8">
        <Summary result={result} />

        <div className="mt-10">
          {!loading && (
            <Button
              onClick={
                recording
                  ? () => stopRecording({ setRecording, mediaRecorderRef })
                  : () => startRecording({ setRecording, mediaRecorderRef })
              }
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </Button>
          )}
          {loading && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading ...
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
