import Fastify from "fastify";
import cors from "@fastify/cors";
import { openAISummarize, openAITranscribe } from "./utils";
import type { FastifyRequest } from "fastify";
import { db } from "./db";

interface TranscribeTypes {
  seconds: number;
  audio: string;
  transcript: string;
  title: string;
  classId: string;
}

const urls = [
  "https://www.lecturify.vercel.app/*",
  "https://www.lecturify.vercel.app",
  "https://lecturify.vercel.app/*",
  "https://lecturify.vercel.app",
  "http://localhost:3000",
  "http://localhost:3000/*",
];

const fastify = Fastify({
  // logger: true,
  bodyLimit: 100 * 1024 * 1024, // Default Limit set to 30MB
});

fastify.register(cors, {
  origin: urls,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

const PORT = process.env.PORT || 1337;

fastify.post(
  "/transcribe",
  async (req: FastifyRequest<{ Body: TranscribeTypes }>, res) => {
    const text = req.body.transcript;
    const title = req.body.title;
    const classId = req.body.classId;
    const summary = await summarizeEverything(text, title, classId);
    res.send(JSON.stringify({ result: summary }));
  }
);

const summarizeEverything = async (
  text: string,
  title: string,
  classId: string
) => {
  const summary = await openAISummarize(text);
  if (summary) {
    const upload = await uploadWithoutClient(summary, title, classId);
    if (!upload) {
      return "error uploading lecture";
    }
  }
  return summary;
};

const uploadWithoutClient = async (
  transcript: string,
  title: string,
  classId: string
) => {
  // lecture to users class
  const lecture = await db.lecture.create({
    data: {
      title: title,
      content: transcript,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  });

  if (lecture) {
    const myClass = await db.class.update({
      where: {
        id: classId,
      },
      data: {
        lectures: {
          connect: {
            id: lecture.id,
          },
        },
      },
    });

    if (!myClass) {
      return false;
    }
    return true;
  }
};

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
