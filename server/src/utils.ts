import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const MAX_SIZE = 25 * 1024 * 1024; // 25 megabytes
export const openAITranscribe = async (base64Audio: string) => {
  const audioBuffer = Buffer.from(base64Audio, "base64");
  const numParts = Math.ceil(audioBuffer.length / MAX_SIZE);
  const transcripts = [];
  for (let i = 0; i < numParts; i++) {
    // Calculate start and end indices for slicing
    const start = i * MAX_SIZE;
    const end = Math.min((i + 1) * MAX_SIZE, audioBuffer.length);

    // Slice the buffer
    const slicedBuffer = audioBuffer.subarray(start, end);

    // Get the transcript for this part
    const transcript = await getTranscript(slicedBuffer);

    // Store the transcript
    transcripts.push(transcript);
    console.log(transcripts);
  }

  // Do something with the transcripts (e.g., concatenate, analyze, etc.)
  const text = transcripts.join(" ");
  return text;
};

const getTranscript = async (audioBuffer: Buffer) => {
  // Create a FormData object and append the buffer
  const form = new FormData();
  form.append("file", audioBuffer, {
    filename: "audio.wav",
    contentType: "audio/wav",
  });
  form.append("model", "whisper-1");

  // Get headers from the form-data object
  const formHeaders = form.getHeaders();

  try {
    // Make the API call
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          ...formHeaders,
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const transcription = response.data;
    const text = transcription.text;
    return text;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const openAISummarize = async (text: string) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You're an AI designed to help students digest college lectures. Using only the provided transcript, create HTML summaries in these four HTML sections: 
        Brief Summary: A concise overview.
        <div><h1>Brief Summary</h1><p>Summary</p></div>
        Notes: Bullet-pointed transcript.
        <div><h1>Notes</h1><p>- Bullet</p></div>
        Practice Questions: Quiz with several questions and answers.
        <div><h1>Practice Questions</h1><p><strong>Q1:</strong> Question?</p><p>A) A</p><p>B) B</p><p>C) C</p><p>D) D</p><p>Answer: D</p></div>
        Helpful Definitions: Definitions of key terms.
        <div><h1>Helpful Definitions</h1><p><strong>Word:</strong> Definition</p></div>
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
};
