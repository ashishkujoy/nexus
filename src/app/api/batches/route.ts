import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";

type CreateBatchRequest = {
    name: string;
    startDate: string;
    endDate?: string;
}

export async function POST(req: Request) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Parse request body
        const body: CreateBatchRequest = await req.json();
        
        // Validate required fields
        if (!body.name || !body.startDate) {
            return new Response(JSON.stringify({ error: "Name and startDate are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Create the batch
        await sql`
            INSERT INTO batches (name, start_date, end_date) 
            VALUES (${body.name}, ${body.startDate}, ${body.endDate})
        `;

        return new Response(JSON.stringify({ message: "Batch created successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error creating batch:", error);
        return new Response(JSON.stringify({ error: "Failed to create batch" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}


