import { neon } from "@neondatabase/serverless";
import { Permissions } from "../../types";

export const fetchPermissions = async (mentorId: number, batchId: number, root: boolean) => {
    if (root) {
        return {
            recordObservation: true,
            recordFeedback: true,
            programManager: true,
        };
    }
    const sql = neon(`${process.env.DATABASE_URL}`);
    const rows = await sql`SELECT permissions FROM mentorship_assignments WHERE mentor_id = ${mentorId} AND batch_id = ${batchId} LIMIT 1`;
    if (rows.length === 0) {
        throw new Error("Permissions not found for the given mentor and batch");
    }
    return rows[0].permissions as Permissions;
}

export const fetchFeedbacks = async (internId: number) => {
    console.log("Fetching feedbacks for internId:", internId);
    const sql = neon(`${process.env.DATABASE_URL}`);

    const rows = await sql`
        SELECT f.id, f.content, f.date, f.mentor_id as "mentorId", m.username as "mentorName", f.delivered, f.delivered_at, f.notice, f.color_code as "colorCode"
        FROM feedback f
        JOIN mentors m ON f.mentor_id = m.id
        WHERE intern_id = ${internId}
        ORDER BY date DESC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        content: row.content as string,
        date: row.date as Date,
        mentorId: row.mentorId as number,
        mentorName: row.mentorName as string,
        delivered: row.delivered as boolean,
        deliveredAt: row.delivered_at ? new Date(row.delivered_at) : null,
        colorCode: row.colorCode as string,
        notice: row.notice as boolean,
        internName: row.intern_name as string,
    }));
}

export const fetchObservations = async (internId: number) => {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const rows = await sql`
        SELECT o.id, o.content, o.date, o.mentor_id as "mentorId", m.username as "mentorName", o.watchout
        FROM observations o
        JOIN mentors m ON o.mentor_id = m.id
        WHERE intern_id = ${internId}
        ORDER BY date DESC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        content: row.content as string,
        date: row.date as Date,
        mentorId: row.mentorId as number,
        mentorName: row.mentorName as string,
        internName: row.intern_name as string,
        watchout: row.watchout as boolean
    }));
}

export const fetchIntern = async (internId: number) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const rows = await sql`
        SELECT id, name, color_code as "colorCode", notice, email, img_url as "imgUrl"
        FROM interns
        WHERE id = ${internId}
        LIMIT 1
    `;
    if (!rows || rows.length === 0) {
        throw new Error("Intern not found");
    }

    return {
        id: rows[0].id as number,
        name: rows[0].name as string,
        colorCode: rows[0].colorCode as string,
        notice: rows[0].notice as boolean,
        email: rows[0].email as string,
        imgUrl: rows[0].imgUrl as string,
    }
}