import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    res.status(200).json(posts);
  } else if (req.method === 'POST') {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const newPost = { ...req.body, id: Date.now() };
    posts.push(newPost);
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.status(201).json(newPost);
  } else if (req.method === 'PATCH') {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    const { id, ...update } = req.body;
    const index = posts.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    posts[index] = { ...posts[index], ...update };
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    res.status(200).json(posts[index]);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 