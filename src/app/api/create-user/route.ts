import { NextResponse } from "next/server";
import { createUser } from "@/db/queries/insert";

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    await createUser(userData);
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
