import Fastify from "fastify";
import cors from "@fastify/cors";
import { openAISummarize, openAITranscribe } from "./utils";
import type { FastifyRequest } from "fastify";

interface TranscribeTypes {
  audio: string;
  seconds: number;
}

interface SummarizeTypes {
  text: string;
}

const fastify = Fastify({
  logger: true,
  bodyLimit: 100 * 1024 * 1024, // Default Limit set to 30MB
});

fastify.register(cors, {
  //FIXME: This is a security risk
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

const PORT = process.env.PORT || 1337;

fastify.post(
  "/transcribe",
  async (req: FastifyRequest<{ Body: TranscribeTypes }>, res) => {
    const audio = req.body.audio;
    const seconds = req.body.seconds;
    const transcription = await openAITranscribe(audio, seconds);
    res.send(JSON.stringify({ result: transcription }));
  }
);

fastify.post(
  "/summarize",
  async (req: FastifyRequest<{ Body: SummarizeTypes }>, res) => {
    const text = req.body.text;
    const summary = await openAISummarize(text);
    res.send(JSON.stringify({ result: summary }));
  }
);

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
