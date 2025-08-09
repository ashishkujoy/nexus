import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";

// Zod schema for updating intern fields
const UpdateInternRequestSchema = z.object({
    notice: z.boolean().optional(),
    colorCode: z.string().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ batchId: string; internId: string }> }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        // Parse and validate IDs
        const { batchId, internId } = await params;
        const batchIdValidation = validateNumericId(batchId, "Batch ID");
        if (!batchIdValidation.success) {
            return batchIdValidation.response;
        }
        const internIdValidation = validateNumericId(internId, "Intern ID");
        if (!internIdValidation.success) {
            return internIdValidation.response;
        }

        // Parse and validate request body
        const rawBody = await req.json();
        const validation = validateRequest(rawBody, UpdateInternRequestSchema);
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;
        
        // Only update if there are fields to update
        if (body.notice === undefined && body.colorCode === undefined) {
            return ErrorResponses.badRequest("No fields to update");
        }

        // Update intern fields
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
            WHERE id = ${internIdValidation.id} AND batch_id = ${batchIdValidation.id}
        `;
        
        return createSuccessResponse({ message: "Intern updated successfully" }, 200);

    } catch (error) {
        console.error("Error updating intern:", error);
        return ErrorResponses.internalServerError("Failed to update intern");
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ batchId: string; internId: string }> }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        // Parse and validate IDs
        const { batchId, internId } = await params;
        const batchIdValidation = validateNumericId(batchId, "Batch ID");
        if (!batchIdValidation.success) {
            return batchIdValidation.response;
        }
        const internIdValidation = validateNumericId(internId, "Intern ID");
        if (!internIdValidation.success) {
            return internIdValidation.response;
        }

        // Terminate intern
        await sql`
            UPDATE interns 
            SET terminated = TRUE 
            WHERE id = ${internIdValidation.id} AND batch_id = ${batchIdValidation.id}
        `;
        
        return createSuccessResponse({ message: "Intern terminated successfully" }, 200);

    } catch (error) {
        console.error("Error terminating intern:", error);
        return ErrorResponses.internalServerError("Failed to terminate intern");
    }
}
