interface MediaRecorderProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

interface RecordProps {
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

const PROD_URL = "https://lecturify-production.up.railway.app";
const DEV_URL = "http://192.168.86.246:1337";
const prod = process.env.NODE_ENV === "production";
const apiUrl = prod ? PROD_URL : DEV_URL;

let chunks: Blob[] = [];
let mediaRecorder: MediaRecorder | null = null;

export const setUpMediaRecorder = ({
  setLoading,
  setResult,
}: MediaRecorderProps) => {
  if (typeof window !== "undefined") {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newMediaRecorder = new MediaRecorder(stream);
        newMediaRecorder.onstart = () => {
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
              const response = await fetch(`${apiUrl}/transcribe`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ audio: base64Audio }),
              });
              if (response.status !== 200) {
                throw new Error(
                  `Request failed with status ${response.status}`
                );
              }

              const data = await response.json();
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
            alert(error.message);
          }
        };
        mediaRecorder = newMediaRecorder;
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  }
  return () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };
};

export const startRecording = ({ setRecording }: RecordProps) => {
  if (mediaRecorder) {
    mediaRecorder.start();
    setRecording(true);
  }
};

export const stopRecording = ({ setRecording }: RecordProps) => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setRecording(false);
  }
};
