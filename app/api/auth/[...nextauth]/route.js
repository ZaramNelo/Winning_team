// Can also intialize Google Auth deirectly from endpoint
import { createUser, getUser } from "@/app/_lib/database-actions";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_AUTH_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // async jwt({ token, user }) {
    //   return token;
    // },

    authorized({ auth, request }) {
      // If true is returned, then user is authorized to access route otherwise user is redirected to signin page
      return !!auth?.user;
    },

    // Callback gets called when user attempts to sign in, different from signIn function exported below (this acts like middleware)
    async signIn({ user, account, profile }) {
      // user object gets access to authenticated user object. name, email etc.
      // If the user doesn't exist in the databse, create a new user, if not don't do anything
      try {
        const existingUser = await getUser(user.email);
        if (!existingUser)
          await createUser({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },
    // Adding the user's id to the session object for easy access throughout application. It runs after the user successfully authenticates.
    async session({ session }) {
      // console.log(session);
      const userData = await getUser(session.user.email);
      session.user.userId = userData.id;
      // Fetch and store the user's subscription status in the session
      // const subscription = await fetchUserSubscription(userData.id);
      // session.user.subscription = subscription;
      console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
// export { GET, POST } from "@/app/_lib/auth";
