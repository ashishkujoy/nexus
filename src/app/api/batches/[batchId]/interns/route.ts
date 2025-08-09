import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, validateNumericId, createSuccessResponse, ErrorResponses } from "@/app/lib/api-utils";

// Zod schemas for validation
const InternSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    img_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

const OnboardInternsRequestSchema = z.object({
    interns: z.array(InternSchema).min(1, "At least one intern is required"),
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

        const { batchId: batchIdParam } = await params;
        
        // Validate batchId parameter
        const batchIdValidation = validateNumericId(batchIdParam, "batch ID");
        if (!batchIdValidation.success) {
            return batchIdValidation.response;
        }
        const batchId = batchIdValidation.id;

        // Verify batch exists
        const batchExists = await sql`
            SELECT id FROM batches WHERE id = ${batchId}
        `;
        if (batchExists.length === 0) {
            return ErrorResponses.notFound("Batch");
        }

        // Parse and validate request body
        const rawBody = await req.json();
        const validation = validateRequest(rawBody, OnboardInternsRequestSchema);
        
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;

        // Insert interns
        for (const intern of body.interns) {
            await sql`
                INSERT INTO interns (batch_id, name, email, img_url) 
                VALUES (${batchId}, ${intern.name}, ${intern.email}, ${intern.img_url})
            `;
        }

        return createSuccessResponse({ 
            message: `${body.interns.length} intern(s) onboarded successfully` 
        }, 201);

    } catch (error) {
        console.error("Error onboarding interns:", error);
        return ErrorResponses.internalServerError("Failed to onboard interns");
    }
}


