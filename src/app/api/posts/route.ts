import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const postsFile = path.join(process.cwd(), 'data', 'posts.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(postsFile))) {
  fs.mkdirSync(path.dirname(postsFile), { recursive: true });
}

// Initialize posts file if it doesn't exist
if (!fs.existsSync(postsFile)) {
  const samplePosts = [
    {
      id: 1,
      user: { name: "Alex Kim", avatar: "/gallery/1.jpeg" },
      type: "creation",
      image: "/gallery/2.jpeg",
      caption: "Exploring ancient temples with AI isometric art!",
      tags: ["#isometric", "#aiart", "#temple"],
      likes: 24,
      liked: false,
      comments: [
        { user: "Priya", text: "Love this!" },
        { user: "Sara", text: "Amazing work." },
      ],
      shares: 2,
      timestamp: "2h ago",
    },
    {
      id: 2,
      user: { name: "Priya Singh", avatar: "/gallery/3.jpeg" },
      type: "blog",
      title: "How I Use IsoR-1 for Cultural Storytelling",
      content: "IsoR-1 lets me bring history to life with just a prompt. Here's how I use it for my digital art projects...",
      excerpt: "IsoR-1 lets me bring history to life with just a prompt. Here's how I use it for my digital art projects...",
      tags: ["#blog", "#storytelling"],
      likes: 12,
      liked: false,
      comments: [
        { user: "Alex", text: "Great insights!" },
      ],
      shares: 1,
      timestamp: "5h ago",
    },
  ];
  fs.writeFileSync(postsFile, JSON.stringify(samplePosts, null, 2));
}

export async function GET() {
  try {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const newPost = await request.json();
    newPost.id = Date.now();
    posts.push(newPost);
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const { id, ...update } = await request.json();
    const index = posts.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    posts[index] = { ...posts[index], ...update };
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    return NextResponse.json(posts[index]);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
} 