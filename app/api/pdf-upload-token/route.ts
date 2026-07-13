import { handleUpload, type 
HandleUploadBody } from 
"@vercel/blob/client";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
/**
* Bu route faylni o'zi qabul qilmaydi — 
faqat brauzerga Blob'ga
* to'g'ridan-to'g'ri yuklash uchun 
"ruxsat" (token) beradi.
* Shu tarzda 15MB'lik PDF hech qachon 
bizning serverless funksiyamiz
* orqali o'tmaydi, shuning uchun 
Vercel'ning 4.5MB so'rov limiti
* muammo bo'lmaydi.
*/
export async function POST(request: 
Request): Promise<NextResponse> {
  const body = (await request.json()) as 
HandleUploadBody;
  try {
    const jsonResponse = await 
handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // TODO: bu yerda admin login/parol 
tekshiruvini qo'shing,
        // aks holda har kim vaqtinchalik 
PDF yuklay oladi.
        return {
          allowedContentTypes: 
["application/pdf"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ 
purpose: "chapter-pdf-temp" })
        };
      },
      onUploadCompleted: async () => {
        // Hech narsa qilish shart emas — 
asosiy qayta ishlash
        // /api/upload route'da, pdfUrl 
orqali amalga oshadi.
      }
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}