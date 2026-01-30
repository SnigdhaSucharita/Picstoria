import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function proxyRequest(req: NextRequest, backendPath: string) {
  const backendRes = await fetch(
    `${BACKEND}${backendPath}${req.nextUrl.search}`,
    {
      method: req.method,
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        "csrf-token": req.headers.get("csrf-token") ?? "",
        accept: req.headers.get("accept") ?? "*/*",
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
    if (key.toLowerCase() === "set-cookie") {
      res.headers.append("set-cookie", value);
    } else {
      res.headers.set(key, value);
    }
  });

  return res;
}
