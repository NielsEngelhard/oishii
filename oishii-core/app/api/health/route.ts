import { performHealthCheck } from "@/features/healthcheck/perform-healthcheck-command";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await performHealthCheck();
  const statusCode = result.status === "healthy" ? 200 : 503;

  return NextResponse.json(result, { status: statusCode });
}