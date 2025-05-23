"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const defaultAvatar = "/gallery/1.jpeg";

export default function CommunityPage() {
  const [tab, setTab] = useState("creation");
  const [posts, setPosts] = useState<any[]>([]);
  const [commentModal, setCommentModal] = useState<{ open: boolean; postId: number | null }>({ open: false, postId: null });
  const [commentInput, setCommentInput] = useState("");
  const [newPost, setNewPost] = useState({ image: "", caption: "", tags: "" });
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: "", tags: "" });
  const [shareMsg, setShareMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [blogPreview, setBlogPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Fetched posts:', data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  // Like
  const handleLike = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const updated = { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
    await fetch("/api/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, liked: updated.liked, likes: updated.likes }) });
    setPosts(posts => posts.map(p => p.id === id ? updated : p));
  };

  // Comment Modal
  const openCommentModal = (id: number) => setCommentModal({ open: true, postId: id });
  const closeCommentModal = () => { setCommentModal({ open: false, postId: null }); setCommentInput(""); };
  const handleAddComment = async () => {
    if (!commentInput.trim() || commentModal.postId == null) return;
    const post = posts.find(p => p.id === commentModal.postId);
    if (!post) return;
    const updated = { ...post, comments: [...post.comments, { user: "You", text: commentInput }] };
    await fetch("/api/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, comments: updated.comments }) });
    setPosts(posts => posts.map(p => p.id === post.id ? updated : p));
    setCommentInput("");
  };

  // Share (simulate)
  const handleShare = async (id: number) => {
    setShareMsg("Link copied to clipboard! (simulated)");
    setTimeout(() => setShareMsg(""), 2000);
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const updated = { ...post, shares: post.shares + 1 };
    await fetch("/api/posts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, shares: updated.shares }) });
    setPosts(posts => posts.map(p => p.id === id ? updated : p));
  };

  // Handle file input for post
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isBlog = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isBlog) setBlogPreview(reader.result as string);
      else setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (isBlog) setNewBlog(blog => ({ ...blog, image: data.url }));
    else setNewPost(post => ({ ...post, image: data.url }));
    setUploading(false);
  };

  // New Post
  const handleNewPost = async (e: any) => {
    e.preventDefault();
    if (!newPost.caption.trim()) return;
    const post = {
      user: { name: "You", avatar: defaultAvatar },
      type: "creation",
      image: newPost.image,
      caption: newPost.caption,
      tags: newPost.tags.split(/[, ]+/).filter(Boolean).map((t: string) => t.startsWith("#") ? t : `#${t}`),
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      timestamp: "now",
    };
    const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) });
    const saved = await res.json();
    setPosts(posts => [saved, ...posts]);
    setNewPost({ image: "", caption: "", tags: "" });
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // New Blog
  const handleNewBlog = async (e: any) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.content.trim()) return;
    const post = {
      user: { name: "You", avatar: defaultAvatar },
      type: "blog",
      title: newBlog.title,
      content: newBlog.content,
      excerpt: newBlog.content.slice(0, 100) + (newBlog.content.length > 100 ? "..." : ""),
      image: newBlog.image,
      tags: newBlog.tags.split(/[, ]+/).filter(Boolean).map((t: string) => t.startsWith("#") ? t : `#${t}`),
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      timestamp: "now",
    };
    const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) });
    const saved = await res.json();
    setPosts(posts => [saved, ...posts]);
    setNewBlog({ title: "", content: "", image: "", tags: "" });
    setBlogPreview("");
    if (blogFileInputRef.current) blogFileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen w-full bg-gray-100 text-navy-900 pb-12">
      {/* Header */}
      <header className="w-full py-16 px-4 bg-gradient-to-br from-navy-50 via-white to-navy-100 text-center shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-navy-800 mb-2">IsoR-1 Community</h1>
        <p className="text-lg text-navy-700 font-sans">Share, discover, and discuss AI isometric art</p>
      </header>

      {/* Post Creation Tabs */}
      <section className="max-w-2xl mx-auto mt-10 mb-12 bg-white/80 rounded-2xl shadow-lg border border-navy-100 p-6">
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${tab === "creation" ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-800"}`}
            onClick={() => setTab("creation")}
          >
            Share Creation
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-bold transition-colors ${tab === "blog" ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-800"}`}
            onClick={() => setTab("blog")}
          >
            Write Blog
          </button>
        </div>
        {/* Creation Form */}
        {tab === "creation" ? (
          <form onSubmit={handleNewPost} className="flex flex-col gap-4">
            <label className="block text-left font-semibold text-navy-700">Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="px-2 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              onChange={e => handleFileChange(e)}
              disabled={uploading}
            />
            {preview && (
              <div className="w-full flex justify-center mb-2">
                <img src={preview} alt="Preview" className="max-h-48 rounded-xl border border-navy-200 shadow" />
              </div>
            )}
            <textarea
              placeholder="Caption"
              className="px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              value={newPost.caption}
              onChange={e => setNewPost({ ...newPost, caption: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma or space separated)"
              className="px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              value={newPost.tags}
              onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
            />
            <button type="submit" className="bg-navy-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-navy-700 transition-colors" disabled={uploading}>{uploading ? "Uploading..." : "Share"}</button>
          </form>
        ) : (
          <form onSubmit={handleNewBlog} className="flex flex-col gap-4">
            <label className="block text-left font-semibold text-navy-700">Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              ref={blogFileInputRef}
              className="px-2 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              onChange={e => handleFileChange(e, true)}
              disabled={uploading}
            />
            {blogPreview && (
              <div className="w-full flex justify-center mb-2">
                <img src={blogPreview} alt="Preview" className="max-h-48 rounded-xl border border-navy-200 shadow" />
              </div>
            )}
            <input
              type="text"
              placeholder="Blog Title"
              className="px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              value={newBlog.title}
              onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Blog Content"
              className="px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans min-h-[120px]"
              value={newBlog.content}
              onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma or space separated)"
              className="px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
              value={newBlog.tags}
              onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })}
            />
            <button type="submit" className="bg-navy-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-navy-700 transition-colors" disabled={uploading}>{uploading ? "Uploading..." : "Publish"}</button>
          </form>
        )}
      </section>

      {/* Share message */}
      {shareMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-navy-800 text-white px-6 py-2 rounded-lg shadow-lg z-50 font-sans">{shareMsg}</div>
      )}

      {/* Feed */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white/90 rounded-2xl shadow border border-navy-100 p-6 flex flex-col md:flex-row gap-6">
              {/* User Info */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start w-24">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-navy-200 mb-2">
                  <Image src={post.user.avatar || defaultAvatar} alt={post.user.name} fill className="object-cover" />
                </div>
                <span className="text-navy-700 font-bold text-sm">{post.user.name}</span>
                <span className="text-navy-500 text-xs">{post.timestamp}</span>
              </div>
              {/* Post Content */}
              <div className="flex-1">
                {post.type === "creation" ? (
                  <>
                    {post.image && (
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-navy-50">
                        <Image src={post.image} alt="User creation" fill className="object-cover" />
                      </div>
                    )}
                    <p className="text-navy-800 font-sans mb-2">{post.caption}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-navy-800 mb-2 font-display">{post.title}</h3>
                    {post.image && (
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-navy-50">
                        <Image src={post.image} alt="Blog visual" fill className="object-cover" />
                      </div>
                    )}
                    <p className="text-navy-700 font-sans mb-2">{post.excerpt}</p>
                  </>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags && post.tags.map((tag: string) => (
                    <span key={tag} className="bg-navy-50 text-navy-700 px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-6 items-center mt-2">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 font-bold ${post.liked ? "text-navy-800" : "text-navy-700 hover:text-navy-900"}`}>
                    <span>👍</span> {post.likes}
                  </button>
                  <button onClick={() => openCommentModal(post.id)} className="flex items-center gap-1 text-navy-700 hover:text-navy-900 font-bold">
                    <span>💬</span> {post.comments.length}
                  </button>
                  <button onClick={() => handleShare(post.id)} className="flex items-center gap-1 text-navy-700 hover:text-navy-900 font-bold">
                    <span>🔗</span> {post.shares}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment Modal */}
      {commentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <button onClick={closeCommentModal} className="absolute top-4 right-4 text-navy-700 hover:text-navy-900 text-2xl">×</button>
            <h3 className="text-xl font-bold mb-4 text-navy-800 font-display">Comments</h3>
            <div className="max-h-60 overflow-y-auto mb-4">
              {posts.find(p => p.id === commentModal.postId)?.comments.map((c: any, i: number) => (
                <div key={i} className="mb-2">
                  <span className="font-bold text-navy-700 mr-2">{c.user}:</span>
                  <span className="text-navy-600">{c.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg border border-navy-200 bg-white/80 text-navy-800 font-sans"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
              />
              <button onClick={handleAddComment} className="bg-navy-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-navy-700 transition-colors">Post</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 