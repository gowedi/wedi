// import { getUserByEmail } from "@/actions/user"
// import bcryptjs from "bcryptjs"
// import type { NextAuthConfig } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import GitHubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google"
// import ResendProvider from "next-auth/providers/resend"

// import { axios } from "@/components/axios"

// import { resend } from "@/config/email"
// import { siteConfig } from "@/config/site"
// import { env } from "@/env.mjs"
// import { signInWithPasswordSchema } from "@/validations/auth"

// import { MagicLinkEmail } from "@/components/emails/magic-link-email"

// import { User } from "next-auth"

// export default {
//   providers: [
//     GoogleProvider({
//       clientId: env.GOOGLE_ID,
//       clientSecret: env.GOOGLE_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     GitHubProvider({
//       clientId: env.GITHUB_ID,
//       clientSecret: env.GITHUB_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       id: "SignIn",
//       async authorize(rawCredentials): Promise<User> {
//         if (!rawCredentials) return null;

//         const validatedCredentials =
//           signInWithPasswordSchema.safeParse(rawCredentials)

//         // Web2 Auth Flow
//         if (validatedCredentials.success) {
//           const user = await getUserByEmail({
//             email: validatedCredentials.data.email,
//           })
//           if (!user || !user.passwordHash) return null

//           const passwordIsValid = await bcryptjs.compare(
//             validatedCredentials.data.password,
//             user.passwordHash
//           )

//           // Web3 Auth Flow
//           const userInfo = await axios.post("/signin", {
//             password: validatedCredentials.data.password,
//             email: validatedCredentials.data.email,
//           });
//           if (userInfo && passwordIsValid) {
//             if (userInfo.status === 201) {
//               throw Error(
//                 "This email address has already been used, please sign in",
//               );
//             }
//             // Any object returned will be saved in `user` property of the JWT
//             const w3s_user = {
//               userId: userInfo.data.userId,
//               userToken: userInfo.data.userToken,
//               encryptionKey: userInfo.data.encryptionKey,
//               challengeId: userInfo.data?.challengeId,
//             };
//             return { ...user, userId: w3s_user.userId, userToken: w3s_user.userToken, encryptionKey: w3s_user.encryptionKey };
//           } 
//         }
//         return null
//       },
//     }),
//     CredentialsProvider({
//       id: "SignUp",
//       async authorize(rawCredentials):  Promise<User> {
//         if (!rawCredentials) return null;

//         const validatedCredentials =
//           signInWithPasswordSchema.safeParse(rawCredentials)

//         // Web2 Auth Flow
//         if (validatedCredentials.success) {
//           const user = await getUserByEmail({
//             email: validatedCredentials.data.email,
//           })
//           if (!user || !user.passwordHash) return null

//           const passwordIsValid = await bcryptjs.compare(
//             validatedCredentials.data.password,
//             user.passwordHash
//           )

//           // Web3 Auth Flow
//           const userInfo = await axios.post("/signup", {
//             password: validatedCredentials.data.password,
//             email: validatedCredentials.data.email,
//           });
//           if (userInfo && passwordIsValid) {
//             if (userInfo.status === 201) {
//               throw Error(
//                 "This email address has already been used, please sign in",
//               );
//             }
//             // Any object returned will be saved in `user` property of the JWT
//             const w3s_user = {
//               userId: userInfo.data.userId,
//               userToken: userInfo.data.userToken,
//               encryptionKey: userInfo.data.encryptionKey,
//               challengeId: userInfo.data?.challengeId,
//             };
//             return { ...user, userId: w3s_user.userId, userToken: w3s_user.userToken, encryptionKey: w3s_user.encryptionKey };
//           } 
//         }
//         return null
//       },
//     }),
//     ResendProvider({
//       server: {
//         host: env.RESEND_HOST,
//         port: Number(env.RESEND_PORT),
//         auth: {
//           user: env.RESEND_USERNAME,
//           pass: env.RESEND_API_KEY,
//         },
//       },
//       async sendVerificationRequest({
//         identifier,
//         url,
//       }: {
//         identifier: string
//         url: string
//       }) {
//         try {
//           await resend.emails.send({
//             from: env.RESEND_EMAIL_FROM,
//             to: [identifier],
//             subject: `${siteConfig.name} magic link sign in`,
//             react: MagicLinkEmail({ identifier, url }),
//           })

//           console.log("Verification email sent")
//         } catch (error) {
//           throw new Error("Failed to send verification email")
//         }
//       },
//     }),
//   ],
// } satisfies NextAuthConfig










import { getUserByEmail } from "@/actions/user";
import bcryptjs from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";

import { axios } from "@/components/axios";
// import { User } from "next-auth"

import { resend } from "@/config/email";
import { siteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { signInWithPasswordSchema } from "@/validations/auth";

import { MagicLinkEmail } from "@/components/emails/magic-link-email";

const authorizeUser = async (rawCredentials, url) => {
  if (!rawCredentials) return null;

  const validatedCredentials = signInWithPasswordSchema.safeParse(rawCredentials);

  if (validatedCredentials.success) {
    const user = await getUserByEmail({
      email: validatedCredentials.data.email,
    });
    if (!user || !user.passwordHash) return null;

    const passwordIsValid = await bcryptjs.compare(
      validatedCredentials.data.password,
      user.passwordHash
    );

    const userInfo = await axios.post(url, {
      password: validatedCredentials.data.password,
      email: validatedCredentials.data.email,
    });

    if (userInfo && passwordIsValid) {
      if (userInfo.status === 201) {
        throw new Error("This email address has already been used, please sign in");
      }

      const w3s_user = {
        userId: userInfo.data.userId,
        userToken: userInfo.data.userToken,
        encryptionKey: userInfo.data.encryptionKey,
        challengeId: userInfo.data?.challengeId,
      };
      return { ...user, userId: w3s_user.userId, userToken: w3s_user.userToken, encryptionKey: w3s_user.encryptionKey };
    }
  }
  return null;
};

export default {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "SignIn",
      async authorize(rawCredentials) {
        return authorizeUser(rawCredentials, "/signin");
      },
    }),
    CredentialsProvider({
      id: "SignUp",
      async authorize(rawCredentials) {
        return authorizeUser(rawCredentials, "/signup");
      },
    }),
    ResendProvider({
      server: {
        host: env.RESEND_HOST,
        port: Number(env.RESEND_PORT),
        auth: {
          user: env.RESEND_USERNAME,
          pass: env.RESEND_API_KEY,
        },
      },
      async sendVerificationRequest({ identifier, url }) {
        try {
          await resend.emails.send({
            from: env.RESEND_EMAIL_FROM,
            to: [identifier],
            subject: `${siteConfig.name} magic link sign in`,
            react: MagicLinkEmail({ identifier, url }),
          });

          console.log("Verification email sent");
        } catch (error) {
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

