import { MutableRefObject } from "react";

interface MediaRecorderProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
}

interface RecordProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  seconds: number;
}

const PROD_URL = "https://lecturify-production.up.railway.app";
const DEV_URL = "http://localhost:1337";

const prod = process.env.NODE_ENV === "production";
const apiUrl = prod ? PROD_URL : DEV_URL;

let duration = 0;

export const setUpMediaRecorder = async ({
  setLoading,
  setResult,
  mediaRecorderRef,
}: MediaRecorderProps) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(
      "Your browser does not support the MediaRecorder API. Please try another browser."
    );
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const newMediaRecorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];
      newMediaRecorder.onstart = () => {
        chunks = [];
      };
      newMediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      newMediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, {
            type: "audio/wav; codecs=opus",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);

          audio.onerror = function (err) {
            console.error("Failed to load audio:", err);
          };

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
            const response = await fetch(`${apiUrl}/transcribe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({ audio: base64Audio, seconds: duration }),
            });
            if (response.status !== 200) {
              throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log(data.result);
            setResult("Transcribed your lecture! Now summarizing it...");

            //Summarize
            const summary = await fetch(`${apiUrl}/summarize`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: data.result }),
            });

            if (summary.status !== 200) {
              throw new Error(`Request failed with status ${summary.status}`);
            }

            const summaryRes = await summary.json();
            const text: string = summaryRes.result;
            setResult(text);
            // formatResult({ text, setResult });

            setLoading(false);
          };
        } catch (error: any) {
          console.error(error);
        }
      };
      mediaRecorderRef.current = newMediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }
};

export const startRecording = async ({
  setRecording,
  setLoading,
  setResult,
  mediaRecorderRef,
}: RecordProps) => {
  setRecording(true);
  await setUpMediaRecorder({
    setLoading,
    setResult,
    mediaRecorderRef,
  });
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.start(500);
  }
};

export const stopRecording = ({
  setRecording,
  mediaRecorderRef,
  seconds,
}: RecordProps) => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setRecording(false);
    // Release the media stream
    duration = seconds;
    const stream = mediaRecorderRef.current.stream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
};
