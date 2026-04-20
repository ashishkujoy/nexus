import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, createErrorResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

const UpdateObservationRequestSchema = z.object({
    content: z.string().min(1, "Content is required"),
    watchout: z.boolean().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ observationId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        const mentorId = session.user.id;

        const { observationId } = await params;
        const observationIdValidation = validateNumericId(observationId, "Observation ID");
        if (!observationIdValidation.success) {
            return observationIdValidation.response;
        }

        const rows = await sql`SELECT mentor_id FROM observations WHERE id = ${observationIdValidation.id}`;
        if (rows.length === 0) {
            return ErrorResponses.notFound("Observation not found");
        }
        if (rows[0].mentor_id !== mentorId) {
            return createErrorResponse("Only the author can edit this observation", 403);
        }

        const rawBody = await req.json();
        const validation = validateRequest(rawBody, UpdateObservationRequestSchema);
        if (!validation.success) {
            return validation.response;
        }

        const body = validation.data;

        await sql`
            UPDATE observations
            SET content = ${body.content},
                watchout = ${body.watchout ?? false}
            WHERE id = ${observationIdValidation.id}
        `;

        return createSuccessResponse({ message: "Observation updated successfully" });

    } catch (error) {
        console.error("Error updating observation:", error);
        return ErrorResponses.internalServerError("Failed to update observation");
    }
}
