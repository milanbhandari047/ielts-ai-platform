import { PrismaClient } from "@prisma/client";

export async function seedListening(prisma: PrismaClient) {
  return prisma.listeningTest.create({
    data: {
      title: "Academic Listening Test 1",

      sections: {
        create: [
          {
            audioUrl:
              "https://cdnapisec.kaltura.com/p/5394802/embedPlaykitJs/uiconf_id/53315462?iframeembed=true&entry_id=1_p3x3lbo7&config%5Bprovider%5D=%7B%22widgetId%22%3A%221_bgzmga33%22%7D&config%5Bplayback%5D=%7B%22startTime%22%3A0%7D",

            questions: {
              create: [
                {
                  questionText: "What is the capital of France?",
                  correctAnswer: "Paris",
                },
                {
                  questionText: "Which planet is known as the Red Planet?",
                  correctAnswer: "Mars",
                },
                {
                  questionText: "What is the largest ocean on Earth?",
                  correctAnswer: "Pacific Ocean",
                },
                {
                  questionText: "How many days are there in a week?",
                  correctAnswer: "7",
                },
                {
                  questionText: "What is the chemical symbol for water?",
                  correctAnswer: "H2O",
                },
                {
                  questionText: "Which country is famous for the Eiffel Tower?",
                  correctAnswer: "France",
                },
                {
                  questionText: "What is the opposite of hot?",
                  correctAnswer: "Cold",
                },
                {
                  questionText: "How many hours are there in a day?",
                  correctAnswer: "24",
                },
                {
                  questionText: "What is the largest mammal in the world?",
                  correctAnswer: "Blue Whale",
                },
                {
                  questionText:
                    "Which language is primarily spoken in Australia?",
                  correctAnswer: "English",
                },
              ],
            },
          },
        ],
      },
    },
  });
}
