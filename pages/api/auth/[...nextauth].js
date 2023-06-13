import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDatabase } from "@/helpers/db-utils";
import { compare } from "bcryptjs";

export default NextAuth({
  secret: "admincms88",
  callbacks: {
    async session({ session, token }) {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase();
        const usersCollection = client.db().collection("users");
        const result = await usersCollection.findOne({ email: token.email });

        session.user = {
            role: result.role
        }
        
        return session;
    }
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        // 1. Establish Connection to Database
        // 2. Use Collection Profiles
        const client = await connectDatabase();
        const usersCollection = client.db().collection("users");

        // check user existence
        const result = await usersCollection.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("No User Found with Email. Please Sign Up.");
        }

        // compare password
        const checkPassword = await compare(credentials.password, result.password);

        // incorrect password
        if (!checkPassword || result.email !== credentials.email) {
          throw new Error("Username or Password doesn't match.");
        }

        return result;
      },
    }),
  ],
});
