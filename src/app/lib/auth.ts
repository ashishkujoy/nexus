import NeonAdapter from '@auth/neon-adapter';
import { AuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { pool, sql } from './db';

export type User = {
    id: number;
    name: string;
    email: string;
    image: string;
    isRoot: boolean;
}

const getUserDetails = async (email: string): Promise<{ isRoot: boolean; id: number }> => {
    const rows = await sql`SELECT id, root FROM mentors WHERE email = ${email} LIMIT 1;`;
    if (!rows || rows.length === 0) throw new Error('User not found');

    return {
        isRoot: rows[0].root,
        id: rows[0].id,
    }
}

export const authOptions: AuthOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: NeonAdapter(pool as any) as any,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: 'database',
    },
    callbacks: {
        async session({ session, user }) {
            const { isRoot, id } = await getUserDetails(user?.email || '');

            if (session?.user) {
                session.user.id = id;
                session.user.isRoot = isRoot;
                session.user.image = user.image || '';
            }

            return session;
        },
    },
};