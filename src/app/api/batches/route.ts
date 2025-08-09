import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { validateRequest, createSuccessResponse, ErrorResponses } from "@/app/lib/api-utils";

// Zod schema for validation
const CreateBatchRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
});



export async function POST(req: Request) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return ErrorResponses.unauthorized();
        }

        // Parse and validate request body
        const rawBody = await req.json();
        const validation = validateRequest(rawBody, CreateBatchRequestSchema);
        
        if (!validation.success) {
            return validation.response;
        }
        
        const body = validation.data;

        // Create the batch
        await sql`
            INSERT INTO batches (name, start_date, end_date) 
            VALUES (${body.name}, ${body.startDate}, ${body.endDate})
        `;

        return createSuccessResponse({ message: "Batch created successfully" }, 201);

    } catch (error) {
        console.error("Error creating batch:", error);
        return ErrorResponses.internalServerError("Failed to create batch");
    }
}


