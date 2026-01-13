import { performHealthCheck } from "@/features/healthcheck/perform-healthcheck-command";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await performHealthCheck();

  return NextResponse.json(result, { status: 200 });
}