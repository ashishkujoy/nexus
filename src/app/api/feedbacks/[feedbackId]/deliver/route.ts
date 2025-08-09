import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

// Zod schema for validation
const DeliverFeedbackRequestSchema = z.object({
    conversation: z.string().min(1, "Conversation content is required"),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ feedbackId: string }> }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        const mentorId = session.user.id;

        // Parse and validate feedback ID
        const { feedbackId } = await params;
        const feedbackIdValidation = validateNumericId(feedbackId, "Feedback ID");
        if (!feedbackIdValidation.success) {
            return feedbackIdValidation.response;
        }

        // Parse and validate request body
        const rawBody = await req.json();
        const validation = validateRequest(rawBody, DeliverFeedbackRequestSchema);
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;
        
        // Insert feedback conversation
        await sql`
            INSERT INTO feedback_conversations
            (feedback_id, mentor_id, content)
            VALUES (${feedbackIdValidation.id}, ${mentorId}, ${body.conversation})
        `;

        // Update feedback as delivered
        await sql`
            UPDATE feedbacks 
            SET delivered = true 
            WHERE id = ${feedbackIdValidation.id}
        `;
        
        return createSuccessResponse({ message: "Feedback delivered successfully" }, 200);

    } catch (error) {
        console.error("Error delivering feedback:", error);
        return ErrorResponses.internalServerError("Failed to deliver feedback");
    }
}
