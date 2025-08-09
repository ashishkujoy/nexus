import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";

type Intern = {
    name: string;
    email: string;
    img_url: string;
}

type OnboardInternsRequest = {
    interns: Intern[];
}

export async function POST(
    req: Request,
    { params }: { params: { batchId: string } }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Validate batchId parameter
        const batchId = parseInt(params.batchId);
        if (isNaN(batchId)) {
            return new Response(JSON.stringify({ error: "Invalid batch ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Verify batch exists
        const batchExists = await sql`
            SELECT id FROM batches WHERE id = ${batchId}
        `;
        if (batchExists.length === 0) {
            return new Response(JSON.stringify({ error: "Batch not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Parse request body
        const body: OnboardInternsRequest = await req.json();
        
        // Validate request body
        if (!body.interns || !Array.isArray(body.interns) || body.interns.length === 0) {
            return new Response(JSON.stringify({ error: "Interns array is required and must not be empty" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Validate each intern
        for (const intern of body.interns) {
            if (!intern.name || !intern.email) {
                return new Response(JSON.stringify({ error: "Each intern must have a name and email" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // Insert interns
        for (const intern of body.interns) {
            await sql`
                INSERT INTO interns (batch_id, name, email, img_url) 
                VALUES (${batchId}, ${intern.name}, ${intern.email}, ${intern.img_url})
            `;
        }

        return new Response(JSON.stringify({ 
            message: `${body.interns.length} intern(s) onboarded successfully` 
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error onboarding interns:", error);
        return new Response(JSON.stringify({ error: "Failed to onboard interns" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// Optional: Add GET method to list interns in a batch
export async function GET(
    req: Request,
    { params }: { params: { batchId: string } }
) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Validate batchId parameter
        const batchId = parseInt(params.batchId);
        if (isNaN(batchId)) {
            return new Response(JSON.stringify({ error: "Invalid batch ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Fetch interns for the batch
        const interns = await sql`
            SELECT id, name, email, img_url, notice, color_code, terminated, created_at
            FROM interns 
            WHERE batch_id = ${batchId}
            ORDER BY created_at ASC
        `;

        return new Response(JSON.stringify(interns), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error fetching interns:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch interns" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
