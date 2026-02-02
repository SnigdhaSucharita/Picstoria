import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;
const FRONTEND = process.env.NEXT_PUBLIC_APP_URL!;

export async function proxyRequest(req: NextRequest, backendPath: string) {
  const backendRes = await fetch(
    `${BACKEND}${backendPath}${req.nextUrl.search}`,
    {
      method: req.method,
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        "csrf-token": req.headers.get("csrf-token") ?? "",
        "content-type": req.headers.get("content-type") ?? "",
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : await req.text(),
    },
  );

  const body = await backendRes.text();

  const res = new NextResponse(body, {
    status: backendRes.status,
  });

  backendRes.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey === "set-cookie") {
      res.headers.append("set-cookie", value);
      return;
    }

    if (lowerKey.startsWith("access-control-allow") || lowerKey === "vary") {
      return;
    }

    res.headers.set(key, value);
  });

  res.headers.set("Access-Control-Allow-Origin", FRONTEND);
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}
