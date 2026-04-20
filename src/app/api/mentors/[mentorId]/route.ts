import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses, validateNumericId, validateRequest } from "@/app/lib/api-utils";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const UpdateMentorSchema = z.object({
    username: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    root: z.boolean(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ mentorId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const { mentorId } = await params;
        const mentorIdResult = validateNumericId(mentorId, "Mentor ID");
        if (!mentorIdResult.success) return mentorIdResult.response;

        const rawBody = await req.json();
        const validation = validateRequest(rawBody, UpdateMentorSchema);
        if (!validation.success) return validation.response;

        const { username, email, root } = validation.data;

        const existing = await sql`
            SELECT id FROM mentors WHERE email = ${email} AND id != ${mentorIdResult.id} LIMIT 1
        `;
        if (existing.length > 0) {
            return ErrorResponses.badRequest("A mentor with this email already exists");
        }

        const result = await sql`
            UPDATE mentors SET username = ${username}, email = ${email}, root = ${root}
            WHERE id = ${mentorIdResult.id}
            RETURNING id, username, email, root
        `;

        if (result.length === 0) {
            return ErrorResponses.notFound("Mentor");
        }

        return createSuccessResponse(result[0]);
    } catch (error) {
        console.error("Error updating mentor:", error);
        return ErrorResponses.internalServerError("Failed to update mentor");
    }
}
