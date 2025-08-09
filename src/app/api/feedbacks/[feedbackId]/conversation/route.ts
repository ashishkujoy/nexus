import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ feedbackId: string }> }
) {
    try {
        // Parse and validate feedback ID
        const { feedbackId } = await params;
        const feedbackIdValidation = validateNumericId(feedbackId, "Feedback ID");
        if (!feedbackIdValidation.success) {
            return feedbackIdValidation.response;
        }

        // Fetch feedback conversation
        const rows = await sql`
            SELECT fc.id, fc.content, fc.created_at as "createdAt", m.username as "mentorName"
            FROM feedback_conversations fc
            JOIN mentors m ON fc.mentor_id = m.id
            WHERE feedback_id = ${feedbackIdValidation.id} 
            LIMIT 1
        `;

        if (rows.length === 0) {
            return ErrorResponses.notFound("No conversation found for this feedback");
        }

        const conversation = {
            id: rows[0].id as number,
            feedbackId: feedbackIdValidation.id,
            deliveredBy: rows[0].mentorName as string,
            deliveredAt: new Date(rows[0].createdAt),
            content: rows[0].content as string,
        };

        return createSuccessResponse(conversation, 200);

    } catch (error) {
        console.error("Error fetching feedback conversation:", error);
        return ErrorResponses.internalServerError("Failed to fetch feedback conversation");
    }
}
