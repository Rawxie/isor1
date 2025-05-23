import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const avatarsDir = path.join(process.cwd(), "public", "avatars");
    await mkdir(avatarsDir, { recursive: true });
    const filePath = path.join(avatarsDir, fileName);
    await writeFile(filePath, buffer);
    const url = `/avatars/${fileName}`;
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
} 