import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/request";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }

  await destroySession();
  return new NextResponse(null, { status: 204 });
}