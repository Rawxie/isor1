import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { readFile } from "fs/promises";
import path from "path";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
}

interface Credentials {
  email?: string;
  password?: string;
}

const getUsers = async (): Promise<User[]> => {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) return null;
        const users = await getUsers();
        const user = users.find(
          (u: User) => u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "devsecret",
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
  },
}; 