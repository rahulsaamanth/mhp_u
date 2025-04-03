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
            subject: `Sign in to ${host} your App`,
            html: html({
              url,
              host,
              theme: {
                brandColor: "green",
                buttonText: "black",
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
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default redirect handling
      if (url.startsWith("login")) return `${baseUrl}/`
      if (url.startsWith("logout")) return `${baseUrl}/login`
      return baseUrl
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
})
