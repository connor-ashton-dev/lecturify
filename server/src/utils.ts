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
        content: `You are an advanced AI proficient in language comprehension and summarization.
                  Your primary role is to assist students by summarizing various topics. 
                  Each summary should consist of four main sections formatted in html. Keep the html exactly as it is in the examples below:

                  Brief Summary: Provide a concise overview of the topic in paragraph form.
                  Example: 
                  <div>
                    <h1>Brief Summary</h1>
                    <p>This is a summary</p>
                  </div>

                  Notes: Include well written notes that you think would be helpful for the student to know.
                  Example: 
                  <div>
                    <h1>Notes</h1>
                    <p>This is a bullet point</p>
                    <p>This is another bullet point</p>
                  </div>

                  Practice Questions: Include several practice questions with answers that test the student's knowledge of the topic.
                  Example:
                  <div>
                    <h1>Practice Questions</h1>
                    <p>Question 1</p>
                    <p>A) Answer choice A</p>
                    <p>B) Answer choice B</p>
                    <p>Answer: A</p>
                  </div>

                  Helpful Definitions: Include definitions of key terms that are relevant to the topic.
                  Example:
                  <div>
                    <h1>Helpful Definitions</h1>
                    <p>Word: This is a definition</p>
                    <p>Another word: This is another definition</p>
                  </div>
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
