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