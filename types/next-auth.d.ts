// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: number;
            name: string;
            email: string;
            isRoot: boolean;
            image: string;
        };
    }

    interface User {
        isRoot: boolean;
        id: number;
    }
}