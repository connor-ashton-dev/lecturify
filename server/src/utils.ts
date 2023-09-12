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
                  Your sole role is to assist students by summarizing various topics. 
                  Do not answer questions or provide any information that is not part summarizing lectures.
                  Each summary should consist of four main sections formatted in html. 
                  Do not include any other text except the html and all text should be in html:

                  (Brief Summary: Provide a concise overview of the topic in paragraph form.)
                  <div>
                    <h1>Brief Summary</h1>
                    <p>This is a summary</p>
                  </div>

                  (Notes: Turn transcript into bullet points. Do not include any text that is not in the transcript.)
                  <div>
                    <h1>Notes</h1>
                    <p>- This is a bullet point</p>
                    <p>- This is another bullet point</p>
                    <p>- This is also another bullet point</p>
                  </div>

                  (Practice Questions: Generate a practice quiz with several questions and answers. There will be a question, 4 answer choices, and 1 right answer 
                  <div>
                    <h1>Practice Questions</h1>
                    <p><strong>Question 1:</strong> What is the answer to this question?</p>
                    <p>A) Answer choice A </p>
                    <p>B) Answer choice B</p>
                    <p>C) Answer choice C</p>
                    <p>D) Answer choice D</p>
                    <p>Answer: D</p>

                    <p><strong>Question 2:</strong> What is the answer to this question?</p>
                    <p>A) Answer choice A </p>
                    <p>B) Answer choice B</p>
                    <p>C) Answer choice C</p>
                    <p>D) Answer choice D</p>
                    <p>Answer: C</p>
                  </div>

                  (Helpful Definitions: Include definitions of key terms that are relevant to the topic.)
                  <div>
                    <h1>Helpful Definitions</h1>
                    <p><strong>Word:</strong> This is a definition</p>
                    <p><strong>Another word:</strong> This is another definition</p>
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
