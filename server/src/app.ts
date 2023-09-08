import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { openAISummarize, openAITranscribe } from "./utils";
dotenv.config();
const app = express();

//TODO: AUTH AND CORS
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
const port = process.env.PORT || 1337;

app.post("/transcribe", async (req, res) => {
  const audio = req.body.audio;
  const transcription = await openAITranscribe(audio);
  res.send(JSON.stringify({ result: transcription }));
});

app.post("/summarize", async (req, res) => {
  const text = req.body.text;
  const summary = await openAISummarize(text);

  res.send(JSON.stringify({ result: summary }));
});

app.listen(port, () => {
  return console.log(`Running on port:${port}`);
});
