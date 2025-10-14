import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID|| (() => { throw new Error('Missing GOOGLE_CLIENT_ID') })(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET|| (() => { throw new Error('Missing GOOGLE_CLIENT_SECRET') })(),
        }),
    ],

    callbacks: {

        async jwt({token, account, profile}){

            if(account && profile) {
                token.id = profile.sub ?? ''
                token.email = profile.email ?? ''
                token.name = profile.name ?? ''
                token.picture = profile.image ?? ''
            }

            return token
        },

        async session({session, token}) {
            
            if(session.user){
                session.user.id = token.id as string 
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            } 
            return session
        },

        
    },
    pages: {
        signIn: '/auth/signin',
    },
})

export { handler as GET, handler as POST}