import { NextRequest } from "next/server";
import { proxyRequest } from "../../_proxy";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  cookies();
  return proxyRequest(req, "/api/auth/refresh");
}
