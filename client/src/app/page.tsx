"use client";

import { useState, useEffect } from "react";

// This is the main component of our application
export default function Home() {
  const PROD_URL = "https://lecturify-production.up.railway.app";
  const DEV_URL = "http://192.168.86.46:1337";
  const prod = false;

  const URL = prod ? PROD_URL : DEV_URL;
  // Define state variables for the result, recording status, and media recorder
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // This array will hold the audio data
  //TODO: Fix any type
  let chunks: Blob[] = [];
  // This useEffect hook sets up the media recorder when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = () => {
            //clear chunks
            chunks = [];
          };
          newMediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onerror = function (err) {
              console.error("Error playing audio:", err);
            };
            // audio.play();
            try {
              setLoading(true);
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async function () {
                const result = reader.result as string;
                if (!result) {
                  throw new Error("No result from reader");
                }
                const base64Audio = result.split(",")[1];

                //Transcribe
                const response = await fetch(
                  "https://lecturify-production.up.railway.app/transcribe",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ audio: base64Audio }),
                  }
                );
                const data = await response.json();
                if (response.status !== 200) {
                  throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                  );
                }

                //Summarize
                const summary = await fetch(
                  "https://lecturify-production.up.railway.app/transcribe",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: data.result }),
                  }
                );
                const summaryRes = await summary.json();
                if (response.status !== 200) {
                  throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                  );
                }

                console.log(summaryRes);

                formatResult(data.result);

                setLoading(false);
              };
            } catch (error: any) {
              console.error(error);
              alert(error.message);
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);
  // Function to start recording
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const formatResult = (text: string) => {
    // add a new line before each dash
    let formattedResult = text.replace(/-/g, "\n - ");
    console.log(formattedResult);
    setResult(formattedResult);
  };
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  // Render the component
  return (
    <main>
      <div>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        {loading && <p>Transcription in progress...</p>}
        <pre>{result}</pre>
      </div>
    </main>
  );
}
