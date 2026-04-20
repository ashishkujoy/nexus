import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses, validateNumericId, validateRequest } from "@/app/lib/api-utils";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const AssignMentorSchema = z.object({
    mentorId: z.number().int().positive("Mentor ID is required"),
    permissions: z.object({
        recordObservation: z.boolean(),
        recordFeedback: z.boolean(),
        programManager: z.boolean(),
    }),
});

export async function POST(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const { batchId } = await params;
        const batchIdResult = validateNumericId(batchId, "Batch ID");
        if (!batchIdResult.success) return batchIdResult.response;

        const rawBody = await req.json();
        const validation = validateRequest(rawBody, AssignMentorSchema);
        if (!validation.success) return validation.response;

        const { mentorId, permissions } = validation.data;

        const existing = await sql`
            SELECT id FROM mentorship_assignments
            WHERE mentor_id = ${mentorId} AND batch_id = ${batchIdResult.id}
            LIMIT 1
        `;
        if (existing.length > 0) {
            return ErrorResponses.badRequest("Mentor is already assigned to this batch");
        }

        const result = await sql`
            INSERT INTO mentorship_assignments (mentor_id, batch_id, permissions)
            VALUES (${mentorId}, ${batchIdResult.id}, ${JSON.stringify(permissions)})
            RETURNING id
        `;

        return createSuccessResponse({ id: result[0].id }, 201);
    } catch (error) {
        console.error("Error assigning mentor:", error);
        return ErrorResponses.internalServerError("Failed to assign mentor");
    }
}
