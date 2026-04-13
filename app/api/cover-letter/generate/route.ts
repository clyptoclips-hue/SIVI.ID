import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, jobTitle, jobDescription, tone, language, length } =
      body;

    // Determine word count based on length
    const lengthMap: Record<string, string> = {
      pendek: "200-250",
      sedang: "300-400",
      panjang: "450-600",
    };
    const wordCount = lengthMap[length] || "300-400";

    // System prompt in Bahasa Indonesia
    const systemPrompt = `Kamu adalah expert career coach Indonesia yang sangat berpengalaman dalam menulis cover letter yang compelling, personal, dan ATS-friendly. 

Tugas kamu adalah membuat cover letter yang:
1. Menarik perhatian recruiter sejak paragraf pertama
2. Menunjukkan pemahaman mendalam tentang perusahaan dan posisi
3. Menghubungkan pengalaman kandidat dengan kebutuhan perusahaan
4. Menggunakan tone yang ${tone}
5. Panjang sekitar ${wordCount} kata
6. Format yang clean dan profesional
7. Closing yang kuat dengan call-to-action

${language === "id" ? "Tulis dalam Bahasa Indonesia yang baik dan profesional." : "Write in professional English."}

PENTING: Jangan gunakan placeholder seperti [Nama], [Alamat], dll. Langsung tulis cover letter yang siap pakai.`;

    const userPrompt = `Buat cover letter untuk:

Perusahaan: ${companyName}
Posisi: ${jobTitle}

Deskripsi Pekerjaan:
${jobDescription}

Buat cover letter yang menarik dan sesuai dengan deskripsi pekerjaan di atas.`;

    // Stream response using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return new Response("Error generating cover letter", { status: 500 });
  }
}
