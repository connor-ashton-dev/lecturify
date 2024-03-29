import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAITranscribe = async (
  base64Audio: string,
  seconds: number
) => {
  // const audioBuffer = Buffer.from(base64Audio, "base64");
  //
  // // Generate a unique filename
  // const filename = uuidv4() + ".wav";
  // const filepath = path.join("/tmp", filename);
  const filepath = path.join(__dirname, "testLecture.mp3");
  seconds = 4642;
  //
  // // Write the buffer to a file
  // fs.writeFileSync(filepath, audioBuffer);

  try {
    const chunkDuration = 2 * 60; // in seconds
    const numChunks = Math.ceil(seconds / chunkDuration);
    console.log("numChunks", numChunks);

    const transcriptions = [];

    // if (seconds >= chunkDuration) {
    for (let i = 0; i < numChunks; i++) {
      console.log("chunk", i);
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
      });

      transcriptions.push(transcription.text);
    }
    console.log(transcriptions);
    // } else {
    //   const transcription = await openai.audio.transcriptions.create({
    //     file: fs.createReadStream(filepath),
    //     model: "whisper-1",
    //   });
    //
    // transcriptions.push(transcription.text);
    // }

    // fs.unlinkSync(filepath);
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
