import { authOptions } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { createSuccessResponse, ErrorResponses, validateNumericId } from "@/app/lib/api-utils";
import { getServerSession } from "next-auth/next";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ batchId: string; mentorId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isRoot) {
            return ErrorResponses.unauthorized();
        }

        const { batchId, mentorId } = await params;

        const batchIdResult = validateNumericId(batchId, "Batch ID");
        if (!batchIdResult.success) return batchIdResult.response;

        const mentorIdResult = validateNumericId(mentorId, "Mentor ID");
        if (!mentorIdResult.success) return mentorIdResult.response;

        const result = await sql`
            DELETE FROM mentorship_assignments
            WHERE mentor_id = ${mentorIdResult.id} AND batch_id = ${batchIdResult.id}
            RETURNING id
        `;

        if (result.length === 0) {
            return ErrorResponses.notFound("Assignment");
        }

        return createSuccessResponse({ message: "Mentor unassigned successfully" });
    } catch (error) {
        console.error("Error unassigning mentor:", error);
        return ErrorResponses.internalServerError("Failed to unassign mentor");
    }
}
