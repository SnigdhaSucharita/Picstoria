import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function proxyRequest(req: NextRequest, backendPath: string) {
  const backendRes = await fetch(`${BACKEND}${backendPath}`, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
      cookie: req.headers.get("cookie") ?? "",
      "csrf-token": req.headers.get("csrf-token") ?? "",
    },
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
  });

  const res = new NextResponse(await backendRes.text(), {
    status: backendRes.status,
  });

  backendRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      res.headers.append("set-cookie", value);
    }
  });

  return res;
}
