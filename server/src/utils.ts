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
                  Each summary should consist of four main sections:
                  (Brief Summary: Provide a concise overview of the topic in paragraph form.)
                  (Notes: Include well written notes based off the transcript. Do not include information not in the transcript.)
                  (Practice Questions: Include several practice questions with answers that test the student's knowledge of the topic.)
                  (Helpful Definitions: Include definitions of key terms that are relevant to the topic.)

                  I want you to format it in html. Here is a perfect example:
  <div>
    <h1>Brief Summary</h1>
    <p>Whales are large, ocean-dwelling mammals that are known for their size and unique blue coloration. They are considered to be one of the largest animal hunters in the world.</p>
  </div>

  <div>
    <h1>Notes</h1>
    <p>- Whales belong to the group of marine mammals, which means they give birth to live young and nurse their offspring with milk.</p>
    <p>- There are different species of whales, including the blue whale, which is the largest animal on Earth.</p>
    <p>- Whales are known to have a complex social structure and communicate with each other using a variety of sounds.</p>
    <p>- Some whale species, such as the killer whale, feed on other animals, while others, like the blue whale, filter-feed on tiny organisms such as krill.</p>
  </div>

  <div>
    <h1>Practice Questions</h1>
    <p>Question 1: What are some characteristic features of whales?</p>
    <p>A) They are small in size</p>
    <p>B) They are orange in color</p>
    <p>C) They are large and live in the ocean</p>
    <p>D) They are herbivores</p>
    <p>Answer: C</p>
  </div>

  <div>
    <p>Question 2: Which species of whale is the largest animal on Earth?</p>
    <p>A) Killer Whale</p>
    <p>B) Blue Whale</p>
    <p>C) Humpback Whale</p>
    <p>D) Sperm Whale</p>
    <p>Answer: B</p>
  </div>

  <div>
    <h1>Helpful Definitions</h1>
    <p>Whales: Large marine mammals that live in the ocean and are known for their size and blue coloration.</p>
    <p>Filter-feeding: A feeding method where an animal, such as a whale, filters small organisms or particles from water or other medium.</p>
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
