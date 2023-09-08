import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAITranscribe = async (base64Audio: string) => {
  const audioBuffer = Buffer.from(base64Audio, "base64");
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
        content: `You are a highly skilled AI trained in language comprehension and summarization. 
          You will hear a lecture and summarize it. Include as much information as you can. 
          You will write this summmary in the form of notes, following all the best practicecs.
          For the format, use ! instead of dashes for bullet points, not dashes. No dashes.
          There will be 4 sections.
          Brief summary
          Notes
          Practice quiz
          Word definitions
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
