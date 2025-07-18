import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { html, text } from "./lib/utils"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db/db"
import {
  account,
  user,
  verificationToken,
  session,
} from "@rahulsaamanth/mhp-schema"
import { eq } from "drizzle-orm"
import type { AdapterAccount } from "@auth/core/adapters"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "noreply@mail.rahulsaamanth.in",
      async sendVerificationRequest(params) {
        const {
          identifier: to,
          provider: { from },
          url,
          theme,
        } = params
        const { host } = new URL(url)
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: from,
            to,
            subject: `Sign in to Homeo South`,
            html: html({
              url,
              host,
              theme: {
                brandColor: "#139A43", // Homeo South brand color
                buttonText: "white",
              },
            }),
            text: text({ url, host }),
          }),
        })

        if (!res.ok)
          throw new Error("Resend error: " + JSON.stringify(await res.json()))
      },
    }),
  ],
  trustHost: true,
  // Add explicit URL configuration for production
  basePath: "/api/auth",
  callbacks: {
    async session({ session, user: _user }) {
      if (session.user) {
        session.user.id = _user.id
        session.user.name = _user.name || _user.email?.split("@")[0]
        session.user.email = _user.email
      }
      return session
    },
    async signIn({ user: _user, account: _account, profile }) {
      if (!_user.email) return false

      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, _user.email),
        with: {
          accounts: true,
        },
      })

      if (existingUser) {
        if (
          !existingUser.accounts?.some(
            (acc) => acc.provider === _account?.provider
          )
        ) {
          if (_account) {
            await db.insert(account).values({
              ..._account,
              type: _account.type as AdapterAccount["type"],
              userId: existingUser.id,
            })
          }
          return true
        }
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      // Ensure proper redirection by using the correct base URL
      const appUrl =
        process.env.NEXTAUTH_URL || baseUrl || "https://homeosouth.com"
      if (url.startsWith("/")) return `${appUrl}${url}`
      else if (new URL(url).origin === appUrl) return url
      return appUrl
    },
  },
  events: {
    async linkAccount({ user: _user, account, profile }) {
      console.log(
        `Linking account : ${account.provider} to user: ${_user.email}`
      )
      console.log("Profile", profile)
      console.log("Accont", account)
      console.log("user", _user)

      if (account.provider === "google" && _user.id) {
        await db
          .update(user)
          .set({
            name: profile.name || _user.name,
            image: profile.image || _user.image,
          })
          .where(eq(user.id, _user.id))
      }
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    verificationTokensTable: verificationToken,
    accountsTable: account,
    sessionsTable: session,
  }),
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/error",
  },
})
