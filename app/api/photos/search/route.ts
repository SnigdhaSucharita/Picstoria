import { NextRequest } from "next/server";
import { proxyRequest } from "../../_proxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return proxyRequest(req, "/api/photos/search");
}
