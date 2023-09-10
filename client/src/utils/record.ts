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

export const setUpMediaRecorder = async ({
  setLoading,
  setResult,
}: MediaRecorderProps) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert(
      "Your browser does not support the MediaRecorder API. Please try another browser."
    );
  } else {
    const newStream = await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const newMediaRecorder = new MediaRecorder(stream);
        newMediaRecorder.onstart = () => {
          chunks = [];
        };
        newMediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
          console.log("Data available:", e.data.size);
        };
        newMediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(chunks, {
              type: "audio/wav; codecs=opus",
            });
            console.log("Audio Blob", audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log("Audio URL", audioUrl);
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
                body: JSON.stringify({ audio: base64Audio }),
              });
              if (response.status !== 200) {
                throw new Error(
                  `Request failed with status ${response.status}`
                );
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
        mediaRecorder = newMediaRecorder;
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  }
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
