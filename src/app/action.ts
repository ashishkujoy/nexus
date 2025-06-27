import { neon } from '@neondatabase/serverless';

export const fetchBatchesAssigned = async (userId: number, isRoot: boolean) => {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const rows = await (isRoot ? sql`SELECT * FROM batches` : sql`
    SELECT b.id, b.name, b.start_date, ma.permissions
    FROM mentorship_assignments ma
    JOIN batches b ON ma.mentor_id = ${userId}
    ORDER BY b.start_date DESC
  `);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        startDate: row.start_date,
        permissions: row.permissions || ["recordObservation", "recordFeedback", "programManager"],
        root: isRoot
    }));
}