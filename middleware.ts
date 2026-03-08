import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/painel/:path*",
    "/extrato/:path*",
    "/cartao/:path*",
    "/dependentes/:path*",
    "/perfil/:path*",
  ],
};