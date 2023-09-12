"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { stopRecording, startRecording } from "@/utils/record";
import Summary from "@/components/custom/SummaryComponent";
import Navbar from "@/components/custom/navbar";

export default function Home() {
  const [result, setResult] = useState<string>(
    "No data yet! Press record to start transcribing🔥"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  //TODO: Make mic state
  const [micState, setMicState] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const checkMic = async () => {
    let myBool = false;
    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => (myBool = true))
      .catch(() => (myBool = false));
    setMicState(myBool);
  };
  // see if system mic is on
  useEffect(() => {
    checkMic();
  }, []);

  return (
    <main className="w-screen h-screen bg-[#FAF9F6]">
      <Navbar />
      <div className="mx-8 mt-8">
        <Summary result={result} />

        <div className="mt-10">
          {!loading && (
            <Button
              onClick={
                // FIX: This is soooo ugly idk man
                recording
                  ? () =>
                      stopRecording({
                        setRecording,
                        mediaRecorderRef,
                        setResult,
                        setLoading,
                      })
                  : () =>
                      micState
                        ? startRecording({
                            setRecording,
                            mediaRecorderRef,
                            setResult,
                            setLoading,
                          })
                        : alert(
                            "Please enable your microphone to use this app."
                          )
              }
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </Button>
          )}
          {loading && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait ...
            </Button>
          )}
        </div>
      </div>

      {micState ? (
        <p className="absolute bottom-0 right-0 m-4 font-bold bg-white shadow-lg p-4 rounded-lg">
          ✅ Mic is on
        </p>
      ) : (
        <p className="absolute bottom-0 right-0 m-4 font-bold bg-white shadow-lg p-4 rounded-lg">
          ⚠️ Mic is off
        </p>
      )}
    </main>
  );
}
