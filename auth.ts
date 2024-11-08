import NextAuth, { DefaultSession, NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById } from './data/user';
import { UserRole } from '@prisma/client';
import Gitee from '@/providers/gitee';
import Douyin from '@/providers/douyin';
import { NextRequest } from 'next/server';
// import Credentials from "next-auth/providers/credentials";
// import { LoginSchema } from './schemas';
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
    } & DefaultSession['user'];
  }
}

const config = (req: NextRequest | undefined): NextAuthConfig => {
  if (
    req?.method === 'GET' &&
    req?.headers.get('referer')?.includes('douyin')
  ) {
    const url = new URL(req?.url);
    tkCode = url.searchParams.get('code') as string;
    tkCallback = url.pathname;
  }
  return {
    basePath: '/api/auth',
    trustHost: true,
    callbacks: {
      async session({ token, session }) {
        // console.log({ sessionToken: token, session });
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }
        return session;
      },
      async jwt({ token, trigger, session }) {
        if (trigger === 'update' && session?.user) {
          // Note, that `session` can be any arbitrary object, remember to validate it!
          token.picture = session.user.image;
          token.email = session.user.email;
          token.name = session.user.name;
        }
        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;
        token.role = existingUser.role;
        return token;
      },
    },
    adapter: PrismaAdapter(db),
    session: {
      strategy: 'jwt',
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
      Douyin({
        clientId: process.env.DOUYIN_CLIENT_ID,
        clientSecret: process.env.DOUYIN_CLIENT_SECRET,
        token: {
          url: 'https://open.douyin.com/oauth/access_token',
          async conform(response: Response) {
            const resData = await fetch(response.url, {
              method: 'POST',
              headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_key: process.env.DOUYIN_CLIENT_ID!,
                client_secret: process.env.DOUYIN_CLIENT_SECRET!,
                code: tkCode!,
                grant_type: 'authorization_code',
              }),
            }).then(async (res) => await res.json());
            // console.log({
            //   client_key: process.env.DOUYIN_CLIENT_ID!,
            //   client_secret: process.env.DOUYIN_CLIENT_SECRET!,
            //   code: tkCode!,
            //   grant_type: "authorization_code",
            // });

            const { data } = resData;
            data.token_type = 'Bearer';
            // console.log("res data: ", data);
            const body = typeof data === 'string' ? data : JSON.stringify(data);
            const newResponse: Response = new Response(body, {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            });
            return newResponse;
          },
        },
      }),
      Gitee({
        clientId: process.env.GITEE_CLIENT_ID,
        clientSecret: process.env.GITEE_CLIENT_SECRET,
      }),
      // Credentials({
      //   async authorize(credentials) {
      //     const validatedFields = LoginSchema.safeParse(credentials);
      //     if (validatedFields.success) {
      //       const { email, password } = validatedFields.data;
      //       const user = await getUserByEmail(email);
      //       if (!user || !user.password) {
      //         return null;
      //       }
      //       const passwordMatch = await bcrypt.compare(password, user.password);
      //       if (passwordMatch) return user;
      //     }
      //     return null;
      //   },
      // }),
    ],
  };
};

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [GitHub],
// });
let tkCode: string | undefined;
let tkCallback: string | undefined;
export const { handlers, auth, signIn, signOut } = NextAuth(config);
