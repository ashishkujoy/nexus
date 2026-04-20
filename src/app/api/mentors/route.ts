import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses, validateRequest } from "@/app/lib/api-utils";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const CreateMentorSchema = z.object({
    username: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const rows = await sql`SELECT id, username, email, root FROM mentors ORDER BY username ASC`;
        return createSuccessResponse(rows);
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return ErrorResponses.internalServerError("Failed to fetch mentors");
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const rawBody = await req.json();
        const validation = validateRequest(rawBody, CreateMentorSchema);
        if (!validation.success) return validation.response;

        const { username, email } = validation.data;

        const existing = await sql`SELECT id FROM mentors WHERE email = ${email} LIMIT 1`;
        if (existing.length > 0) {
            return ErrorResponses.badRequest("A mentor with this email already exists");
        }

        const result = await sql`
            INSERT INTO mentors (username, email, root)
            VALUES (${username}, ${email}, false)
            RETURNING id, username, email, root
        `;

        return createSuccessResponse(result[0], 201);
    } catch (error) {
        console.error("Error creating mentor:", error);
        return ErrorResponses.internalServerError("Failed to create mentor");
    }
}
