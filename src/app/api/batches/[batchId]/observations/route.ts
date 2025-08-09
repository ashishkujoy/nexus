import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

// Zod schema for validation
const CreateObservationsRequestSchema = z.object({
    observations: z.array(z.object({
        internId: z.number().positive("Intern ID must be a positive number"),
        date: z.string().min(1, "Date is required"),
        watchOut: z.boolean(),
        content: z.string().min(1, "Content is required"),
    })).min(1, "At least one observation is required"),
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
        const validation = validateRequest(rawBody, CreateObservationsRequestSchema);
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;
        
        // Record observations
        for (const observation of body.observations) {
            await sql`
                INSERT INTO observations 
                (mentor_id, intern_id, batch_id, created_at, watchout, content) 
                VALUES (${mentorId}, ${observation.internId}, ${batchIdValidation.id}, ${observation.date}, ${observation.watchOut}, ${observation.content})
            `;
        }
        
        const message = body.observations.length === 1 
            ? "Observation recorded successfully" 
            : "Observations recorded successfully";
        
        return createSuccessResponse({ message }, 201);

    } catch (error) {
        console.error("Error recording observation(s):", error);
        return ErrorResponses.internalServerError("Failed to record observation(s)");
    }
}
