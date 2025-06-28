import { neon } from "@neondatabase/serverless";

export const fetchBatch = async (batchId: number) => {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const rows = await sql`SELECT * FROM batches WHERE id = ${batchId} LIMIT 1`

    if (rows.length === 0) {
        throw new Error(`Batch with ID ${batchId} not found`);
    }
    return {
        id: batchId,
        name: rows[0].name,
        startDate: rows[0].start_date,
        endDate: rows[0].end_date
    };
}

export const fetchInterns = async (batchId: number) => {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const rows = await sql`
        SELECT  id, name, email, color_code as "colorCode", notice
        FROM interns
        WHERE batch_id = ${batchId}
        ORDER BY name ASC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        name: row.name as string,
        email: row.email as string,
        colorCode: row.colorCode as (string | undefined),
        notice: row.notice as boolean
    }));
}

export const fetchStats = async (batchId: number, mentorId: number) => {
    const [interns, pendingObservations] = await Promise.all([
        fetchInterns(batchId),
        countInternsWithoutRecentObservations(batchId, mentorId, 15),
    ]);
    return (
        {
            totalInterns: interns.length,
            pendingObservations,
            pendingFeedback: 3,
            activeNotices: 2,
        }
    )
}

export const countInternsWithoutRecentObservations = async (
    batchId: number,
    mentorId: number,
    days: number
): Promise<number> => {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const result = await sql`
        SELECT COUNT(*) as count
        FROM interns i
        WHERE i.batch_id = ${batchId}
        AND NOT EXISTS (
            SELECT 1 
            FROM observations o 
            WHERE o.intern_id = i.id 
            AND o.mentor_id = ${mentorId}
            AND o.batch_id = ${batchId}
            AND o.date >= CURRENT_DATE - INTERVAL '1 day' * ${days}
        )
    `;

    return result[0].count as number;
}