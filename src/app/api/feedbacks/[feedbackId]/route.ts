import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, createErrorResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

const UpdateFeedbackRequestSchema = z.object({
    content: z.string().min(1, "Content is required"),
    notice: z.boolean().optional(),
    colorCode: z.string().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ feedbackId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        const mentorId = session.user.id;

        const { feedbackId } = await params;
        const feedbackIdValidation = validateNumericId(feedbackId, "Feedback ID");
        if (!feedbackIdValidation.success) {
            return feedbackIdValidation.response;
        }

        const rows = await sql`SELECT mentor_id FROM feedbacks WHERE id = ${feedbackIdValidation.id}`;
        if (rows.length === 0) {
            return ErrorResponses.notFound("Feedback not found");
        }
        if (rows[0].mentor_id !== mentorId) {
            return createErrorResponse("Only the author can edit this feedback", 403);
        }

        const rawBody = await req.json();
        const validation = validateRequest(rawBody, UpdateFeedbackRequestSchema);
        if (!validation.success) {
            return validation.response;
        }

        const body = validation.data;

        await sql`
            UPDATE feedbacks
            SET content = ${body.content},
                notice = ${body.notice ?? false},
                color_code = ${body.colorCode ?? null}
            WHERE id = ${feedbackIdValidation.id}
        `;

        return createSuccessResponse({ message: "Feedback updated successfully" });

    } catch (error) {
        console.error("Error updating feedback:", error);
        return ErrorResponses.internalServerError("Failed to update feedback");
    }
}
