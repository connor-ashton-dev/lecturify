// Import necessary libraries
import OpenAI from "openai";
import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

// Promisify the exec function from child_process
// Configure the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// This function handles POST requests to the /api/speechToText route
export async function POST(request: Request) {
  // Check if the OpenAI API key is configured
  if (!openai.apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
      { status: 500 }
    );
  }
  // Parse the request body
  const req = await request.json();
  const base64Audio = req.audio;
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

    // const notes = await summarize(text);

    return NextResponse.json({ result: text }, { status: 200 });
  } catch (error: any) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: 500 });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json(
        { error: "An error occurred during your request." },
        { status: 500 }
      );
    }
  }
}

// chat completion
async function summarize(text: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a highly skilled AI trained in language comprehension and summarization. You will hear a lecture and summarize it. Include as much information as you can. The first section will be titled Notes and will include bullet points, then create a section called quiz and create a practice quiz for the notes. Finally, create a key words section with unfamiliar words and definitions",
      },
      {
        role: "user",
        content: text,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}
