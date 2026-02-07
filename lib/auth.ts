import NextAuth, { type NextAuthResult } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { env } from "./env";
import type { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

const providers: Provider[] = [];

if (env.googleClientId && env.googleClientSecret) {
  providers.push(
    Google({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    })
  );
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Hasło", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password || !prisma) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.password) {
        return null;
      }

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  })
);

type HandlerPair = NextAuthResult["handlers"];

const createDisabledAuth = () => {
  const empty = NextResponse.json({ user: null, expires: null });
  return {
    handlers: { GET: async () => empty, POST: async () => empty } as HandlerPair,
    auth: (async () => null) as NextAuthResult["auth"],
    signIn: (async () => null) as NextAuthResult["signIn"],
    signOut: (async () => null) as NextAuthResult["signOut"],
  };
};

const disabledAuth = createDisabledAuth();

let exportedHandlers: HandlerPair = disabledAuth.handlers;
let exportedAuth: NextAuthResult["auth"] | null = disabledAuth.auth;
let exportedSignIn: NextAuthResult["signIn"] | null = disabledAuth.signIn;
let exportedSignOut: NextAuthResult["signOut"] | null = disabledAuth.signOut;

if (env.databaseUrl) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    prisma = require("./prisma").prisma as PrismaClient;
  } catch (error) {
    console.error("[auth] Failed to load Prisma client:", error);
  }

  if (prisma) {
    const nextAuthExports = NextAuth({
      adapter: PrismaAdapter(prisma),
      session: { strategy: "jwt" },
      secret: env.authSecret,
      pages: {
        signIn: "/logowanie",
        error: "/logowanie",
      },
      providers,
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.id as string;
          }
          return session;
        },
      },
    });
    exportedHandlers = nextAuthExports.handlers;
    exportedAuth = nextAuthExports.auth;
    exportedSignIn = nextAuthExports.signIn;
    exportedSignOut = nextAuthExports.signOut;
  }
}

export const handlers = exportedHandlers;
export const auth = exportedAuth;
export const signIn = exportedSignIn;
export const signOut = exportedSignOut;
