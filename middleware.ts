import { NextRequest, NextResponse } from "next/server";

// Qaysi yo'llar himoyalanadi
export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/admin/:path*"]
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Agar env o'zgaruvchilar sozlanmagan bo'lsa, xato haqida ogohlantiramiz
  // (production'da bu bo'lmasligi kerak)
  if (!expectedUser || !expectedPassword) {
    console.error("ADMIN_USER yoki ADMIN_PASSWORD environment variable sozlanmagan!");
    return new NextResponse("Server konfiguratsiya xatosi.", { status: 500 });
  }

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]; // "Basic base64string" -> base64string
    const [user, password] = Buffer.from(authValue, "base64").toString().split(":");

    if (user === expectedUser && password === expectedPassword) {
      return NextResponse.next();
    }
  }

  // Login so'ralmagan yoki noto'g'ri bo'lsa -> brauzerda login oynasini chiqaramiz
  return new NextResponse("Ruxsat yo'q.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin panel"'
    }
  });
}