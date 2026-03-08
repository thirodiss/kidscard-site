import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  agency: z.string().min(1),
  account: z.string().min(1),
  cpf: z.string().min(1),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        agency: { label: "Agência", type: "text" },
        account: { label: "Conta", type: "text" },
        cpf: { label: "CPF", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const agency = parsed.data.agency.replace(/\D/g, "");
        const account = parsed.data.account.replace(/\D/g, "");
        const cpf = parsed.data.cpf.replace(/\D/g, "");
        const password = parsed.data.password;

        const user = await prisma.user.findFirst({
          where: {
            agency,
            accountNumber: account,
            cpf,
          },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
          cpf: user.cpf,
          agency: user.agency,
          accountNumber: user.accountNumber,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.cpf = (user as any).cpf;
        token.agency = (user as any).agency;
        token.accountNumber = (user as any).accountNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).cpf = token.cpf;
        (session.user as any).agency = token.agency;
        (session.user as any).accountNumber = token.accountNumber;
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}