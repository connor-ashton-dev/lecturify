import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAITranscribe = async (
  base64Audio: string,
  seconds: number
) => {
  const audioBuffer = Buffer.from(base64Audio, "base64");

  // Generate a unique filename
  const filename = uuidv4() + ".wav";
  const filepath = path.join("/tmp", filename);

  // Write the buffer to a file
  fs.writeFileSync(filepath, audioBuffer);

  try {
    // Calculate the number of chunks needed (assuming each chunk is 10 seconds long)
    const chunkDuration = 20 * 60; // in seconds
    const numChunks = Math.ceil(seconds / chunkDuration);

    const transcriptions = [];

    if (seconds >= chunkDuration) {
      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkDuration;
        const outputFilename = uuidv4() + "_chunk.wav";
        const outputPath = path.join("/tmp", outputFilename);

        await new Promise((resolve, reject) => {
          ffmpeg(filepath)
            .setStartTime(start)
            .setDuration(chunkDuration)
            .output(outputPath)
            .on("end", resolve)
            .on("error", reject)
            .run();
        });
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(outputPath),
          model: "whisper-1",
          prompt: "Here is the previous audio" + transcriptions.join(" "),
        });

        transcriptions.push(transcription.text);
      }
      console.log(transcriptions);
    } else {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filepath),
        model: "whisper-1",
      });

      transcriptions.push(transcription.text);
    }

    fs.unlinkSync(filepath);
    return transcriptions.join(" ");
  } catch (error) {
    console.log(error);
    return "Something went wrong with your transcription. We're working on it!";
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
