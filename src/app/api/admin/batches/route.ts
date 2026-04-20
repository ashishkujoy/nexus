import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses } from "@/app/lib/api-utils";
import { getServerSession } from "next-auth/next";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const batchRows = await sql`SELECT id, name, start_date FROM batches ORDER BY start_date DESC`;

        const batches = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            batchRows.map(async (batch: any) => {
                const assignmentRows = await sql`
                    SELECT ma.id, ma.mentor_id as "mentorId", m.username as "mentorName", m.email as "mentorEmail", ma.permissions
                    FROM mentorship_assignments ma
                    JOIN mentors m ON ma.mentor_id = m.id
                    WHERE ma.batch_id = ${batch.id}
                    ORDER BY m.username ASC
                `;

                return {
                    id: batch.id,
                    name: batch.name,
                    startDate: batch.start_date,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    assignments: assignmentRows.map((a: any) => ({
                        id: a.id,
                        mentorId: a.mentorId,
                        mentorName: a.mentorName,
                        mentorEmail: a.mentorEmail,
                        permissions: a.permissions,
                    })),
                };
            })
        );

        return createSuccessResponse(batches);
    } catch (error) {
        console.error("Error fetching admin batches:", error);
        return ErrorResponses.internalServerError("Failed to fetch batches");
    }
}
