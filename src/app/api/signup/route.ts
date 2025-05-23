import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "data", "users.json");
    const data = await readFile(filePath, "utf-8");
    const users = JSON.parse(data);
    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const newUser = {
      id: randomUUID(),
      name,
      email,
      password, // In production, hash the password!
    };
    users.push(newUser);
    await writeFile(filePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 