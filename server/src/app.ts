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
});

fastify.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      //  Request from localhost will pass
      cb(new Error("Not allowed"), false);
      return;
    }
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost" || hostname === "lecturify.vercel.app") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
    return;
  },

  methods: ["GET", "POST"],
});
//
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
