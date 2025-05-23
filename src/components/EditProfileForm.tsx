"use client";
import { useState, useRef } from "react";

interface EditProfileFormProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    dateJoined: string;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [form, setForm] = useState({ ...user });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    console.log('Submitting profile update:', form);
    // Defensive check for required fields
    if (!form.id || !form.name || !form.username || !form.email) {
      setError("Missing required fields. Please fill out all fields.");
      setLoading(false);
      return;
    }
    let avatarUrl = form.avatar;
    if (avatarFile) {
      const data = new FormData();
      data.append("avatar", avatarFile);
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        avatarUrl = json.url;
      } else {
        setError("Avatar upload failed");
        setLoading(false);
        return;
      }
    }
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, avatar: avatarUrl, website: undefined }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Profile updated!");
      setAvatarFile(null);
    } else {
      const data = await res.json();
      setError(data.error || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 text-left bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-white font-display">Edit Profile</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
          rows={2}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-300">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          ref={fileInputRef}
          className="w-full px-3 py-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-400 font-sans"
        />
        {form.avatar && !avatarFile && (
          <img src={form.avatar} alt="Avatar preview" className="mt-2 w-20 h-20 rounded-full object-cover border border-gray-700" />
        )}
        {avatarFile && (
          <div className="mt-2 text-sm text-gray-400">Selected: {avatarFile.name}</div>
        )}
      </div>
      {message && <div className="mb-4 text-green-400 text-sm font-semibold">{message}</div>}
      {error && <div className="mb-4 text-red-400 text-sm font-semibold">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition font-semibold font-sans"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
} 