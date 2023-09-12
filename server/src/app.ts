import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { openAISummarize, openAITranscribe } from "./utils";
dotenv.config();
const app = express();

//TODO: AUTH AND CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
const port = process.env.PORT || 1337;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/transcribe", async (req, res) => {
  const audio = req.body.audio;
  const seconds = req.body.seconds;
  const transcription = await openAITranscribe(audio, seconds);
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
