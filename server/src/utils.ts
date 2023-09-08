// import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
//
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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
    console.log(error);
    return "error";
  }
};
