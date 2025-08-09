import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

// Zod schema for validation
const CreateFeedbackRequestSchema = z.object({
    internId: z.number().positive("Intern ID must be a positive number"),
    content: z.string().min(1, "Content is required"),
    date: z.string().min(1, "Date is required"),
    notice: z.boolean().optional(),
    colorCode: z.string().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        const mentorId = session.user.id;

        // Parse and validate batch ID
        const { batchId } = await params;
        const batchIdValidation = validateNumericId(batchId, "Batch ID");
        if (!batchIdValidation.success) {
            return batchIdValidation.response;
        }

        // Parse and validate request body
        const rawBody = await req.json();
        const validation = validateRequest(rawBody, CreateFeedbackRequestSchema);
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;
        
        // Insert feedback
        await sql`
            INSERT INTO feedbacks
            (mentor_id, intern_id, batch_id, created_at, notice, content, color_code) 
            VALUES (${mentorId}, ${body.internId}, ${batchIdValidation.id}, ${body.date}, ${body.notice}, ${body.content}, ${body.colorCode})
        `;

        // Update intern fields if they are defined
        if (body.notice !== undefined || body.colorCode !== undefined) {
            await sql`
                UPDATE interns 
                SET 
                    notice = CASE 
                        WHEN ${body.notice !== undefined} THEN ${body.notice} 
                        ELSE notice 
                    END,
                    color_code = CASE 
                        WHEN ${body.colorCode !== undefined} THEN ${body.colorCode} 
                        ELSE color_code 
                    END
                WHERE id = ${body.internId}
            `;
        }
        
        return createSuccessResponse({ message: "Feedback recorded successfully" }, 201);

    } catch (error) {
        console.error("Error recording feedback:", error);
        return ErrorResponses.internalServerError("Failed to record feedback");
    }
}
