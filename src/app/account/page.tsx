import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import EditProfileForm from "../../components/EditProfileForm";
import { readFile } from "fs/promises";
import path from "path";

export default async function AccountPage() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch user details from users.json
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = await readFile(filePath, "utf-8");
  const users = JSON.parse(data);
  const user = users.find((u: any) => u.email === session.user!.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800/90 shadow-2xl rounded-2xl p-8 w-full max-w-xl border border-navy-900 text-center">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-navy-900 overflow-hidden mb-2 border-4 border-navy-700">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-navy-800">👤</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-1">{user.name}</h1>
          <div className="text-gray-300 text-base font-mono">@{user.username}</div>
        </div>
        {/* Profile Info */}
        <div className="mb-4 text-white font-sans text-left space-y-2">
          <div><span className="font-semibold text-gray-300">Email:</span> <span className="text-white">{user.email}</span></div>
          <div><span className="font-semibold text-gray-300">Bio:</span> <span className="text-white">{user.bio || <span className='text-gray-400'>No bio</span>}</span></div>
          <div><span className="font-semibold text-gray-300">Location:</span> <span className="text-white">{user.location || <span className='text-gray-400'>Not set</span>}</span></div>
          <div><span className="font-semibold text-gray-300">Joined:</span> <span className="text-white">{user.dateJoined || <span className='text-gray-400'>Unknown</span>}</span></div>
        </div>
        <SignOutButton />
        <div className="mt-8">
          <EditProfileForm user={user} />
        </div>
      </div>
    </div>
  );
} 