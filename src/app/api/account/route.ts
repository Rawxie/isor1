import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function PATCH(req: Request) {
  try {
    const { id, name, username, email, bio, location, website, avatar } = await req.json();
    if (!id || !name || !username || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const filePath = path.join(process.cwd(), "data", "users.json");
    const data = await readFile(filePath, "utf-8");
    const users = JSON.parse(data);
    // Check for duplicate email/username (excluding self)
    if (users.some((u: any) => (u.email === email || u.username === username) && u.id !== id)) {
      return NextResponse.json({ error: "Email or username already in use" }, { status: 400 });
    }
    const userIdx = users.findIndex((u: any) => u.id === id);
    if (userIdx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    users[userIdx] = {
      ...users[userIdx],
      name,
      username,
      email,
      bio: bio || "",
      location: location || "",
      website: website || "",
      avatar: avatar || "",
    };
    await writeFile(filePath, JSON.stringify(users, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 