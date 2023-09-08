import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { openAITranscribe } from "./utils";
dotenv.config();
const app = express();
app.use(cors());

app.use(bodyParser.json());
const port = process.env.PORT || 1337;

app.get("/hello", (req, res) => {
  res.send({ result: "Hello World!" });
});

app.post("/transcribe", async (req, res) => {
  const audio = req.body.audio;
  const transcription = await openAITranscribe(audio);
  res.send(JSON.stringify({ result: transcription }));
});

app.listen(port, () => {
  return console.log(`Running on port:${port}`);
});
