import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

//   const user = await createUser(body);

  return NextResponse.json(user, { status: 201 });
}