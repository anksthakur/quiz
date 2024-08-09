import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
 const handler =NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }), 
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
          return url.startsWith(baseUrl) ? url : `${baseUrl}/user`;
        },
      },
    });
export {handler as GET , handler as POST}