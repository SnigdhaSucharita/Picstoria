import { NextRequest } from "next/server";
import { proxyRequest } from "../../../_proxy";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyRequest(req, `/api/photos/${params.id}/tag`);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyRequest(req, `/api/photos/${params.id}/tag`);
}
