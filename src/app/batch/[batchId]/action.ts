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