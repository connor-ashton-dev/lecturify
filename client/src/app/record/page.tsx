"use client";
import React, { useState, useRef, useEffect } from "react";
import Summary from "@/components/custom/SummaryComponent";
import { Button } from "@/components/ui/button";
import { stopRecording, startRecording } from "@/utils/record";
import { Loader2 } from "lucide-react";
import { useLectureStore, userStore } from "@/utils/store";

const RecordPage = () => {
  const [result, setResult] = useState<string>(
    "No data yet! Press record to start transcribing 🔥"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [micState, setMicState] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { user } = userStore((state) => {
    return {
      user: state.user,
    };
  });

  const { classTitle, classId } = useLectureStore((state) => {
    return { classTitle: state.title, classId: state.classId };
  });

  const checkMic = async () => {
    let myBool = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      myBool = true;
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      myBool = false;
    }
    setMicState(myBool);
  };

  useEffect(() => {
    const setStuffUp = async () => {
      await checkMic();
    };
    setStuffUp();
  }, []);

  return (
    <div className="mx-8">
      <Summary
        result={result}
        recording={recording}
        seconds={seconds}
        setSeconds={setSeconds}
      />
      <div className="mt-10">
        {!loading && (
          <Button
            size="lg"
            className="text-lg"
            variant="default"
            onClick={
              // FIX: This is soooo ugly idk man
              recording
                ? () =>
                    stopRecording({
                      setRecording,
                      mediaRecorderRef,
                      setResult,
                      setLoading,
                      seconds,
                      user,
                      classId,
                      classTitle,
                    })
                : () =>
                    micState
                      ? startRecording({
                          setRecording,
                          seconds,
                          mediaRecorderRef,
                          setResult,
                          setLoading,
                          user,
                          classId,
                          classTitle,
                        })
                      : alert("Please enable your microphone to use this app.")
            }
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        )}
        {loading && (
          <Button disabled size="lg" className="text-lg">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait ...
          </Button>
        )}
      </div>
      {!micState && (
        <button
          className="absolute bottom-0 right-0 m-4 font-bold bg-white shadow-lg p-4 rounded-lg"
          onClick={checkMic}
        >
          <span className="text-yellow-500">⚠️</span> Mic is off. Click to
          enable.
        </button>
      )}
    </div>
  );
};

export default RecordPage;
