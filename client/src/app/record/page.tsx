"use client";
import React, { useState, useRef, useEffect } from "react";
import Summary from "@/components/custom/SummaryComponent";
import { Button } from "@/components/ui/button";
import { useLectureStore } from "@/utils/store";

import { apiUrl } from "@/utils/api";
import axios from "axios";

const RecordPage = () => {
  const [result, setResult] = useState<string>(
    "No data yet! Press record to start transcribing 🔥"
  );

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const transcriptRef = useRef<string>("");

  const { classTitle, classId } = useLectureStore((state) => {
    return { classTitle: state.title, classId: state.classId };
  });

  useEffect(() => {
    const mySpeechRecognition = new SpeechRecognition();
    mySpeechRecognition.continuous = true;
    mySpeechRecognition.interimResults = true;
    mySpeechRecognition.lang = "en-US";
    mySpeechRecognition.maxAlternatives = 1;

    setRecognition(mySpeechRecognition);

    mySpeechRecognition.onresult = (event) => {
      const myResult = event.results[0][0].transcript;
      transcriptRef.current = myResult;
    };

    mySpeechRecognition.onstart = () => {
      console.log("Speech recognition started");
      setResult("Recording your lecture. Press stop when you're done!");
    };

    mySpeechRecognition.onerror = (event) => {
      console.log("Speech recognition error:", event);
      setResult("Error occurred in recording. Please try again!");
    };

    mySpeechRecognition.onend = () => {
      console.log("Speech recognition ended");
    };
  }, [SpeechRecognition]);

  const transcribe = async () => {
    if (!recording) {
      setRecording(true);
      recognition?.start();
    } else {
      setRecording(false);
      recognition?.stop();
      setResult("Transcribing your lecture. Please wait...");
      console.log("Transcript:", transcriptRef.current);

      const response = await axios.post(`${apiUrl}/transcribe`, {
        transcript: transcriptRef.current,
        title: classTitle,
        classId,
      });

      const data = await response.data;
      setResult(data.result);
    }
  };
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
            onClick={transcribe}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
