import { sql } from "../../lib/db";
import { Feedback, Observation } from "./types";

export const fetchBatch = async (mentorId: number, batchId: number, root: boolean) => {
    if (root) {
        const rows = await sql`SELECT b.id, b.name, b.start_date, b.end_date FROM batches b WHERE b.id = ${batchId} LIMIT 1`;
        if (rows.length === 0) {
            throw new Error(`Batch with ID ${batchId} not found`);
        }
        return {
            id: batchId,
            name: rows[0].name,
            startDate: rows[0].start_date,
            endDate: rows[0].end_date,
            permissions: {
                recordObservation: true,
                recordFeedback: true,
                programManager: true,
            },
        };
    }

    const rows = await sql`SELECT b.id, b.name, b.start_date, b.end_date, ma.permissions 
    FROM mentorship_assignments ma
    JOIN batches b ON ma.batch_id = b.id
    WHERE ma.mentor_id = ${mentorId} AND ma.batch_id = ${batchId} LIMIT 1`

    if (rows.length === 0) {
        throw new Error(`Batch with ID ${batchId} not found`);
    }
    return {
        id: batchId,
        name: rows[0].name,
        startDate: rows[0].start_date,
        endDate: rows[0].end_date,
        permissions: rows[0].permissions as {
            recordObservation: boolean;
            recordFeedback: boolean;
            programManager: boolean;
        },
    };
}

export const fetchInterns = async (batchId: number) => {
    const rows = await sql`
        SELECT  id, name, email, color_code as "colorCode", notice, img_url as "imgUrl", terminated
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
        notice: row.notice as boolean,
        terminated: row.terminated as boolean,
        imgUrl: row.imgUrl as string
    }));
}

export const fetchStats = async (batchId: number, mentorId: number) => {
    const result = await sql`
        WITH intern_stats AS (
            SELECT 
                COUNT(*) as total_interns,
                COUNT(*) FILTER (WHERE notice = true) as active_notices
            FROM interns 
            WHERE batch_id = ${batchId}
        ),
        observation_stats AS (
            SELECT COUNT(*) as pending_observations
            FROM interns i
            WHERE i.batch_id = ${batchId}
            AND NOT EXISTS (
                SELECT 1 FROM observations o 
                WHERE o.intern_id = i.id 
                AND o.mentor_id = ${mentorId}
                AND o.batch_id = ${batchId}
                AND o.created_at >= CURRENT_DATE - INTERVAL '15 days'
            )
        ),
        feedback_stats AS (
            SELECT COUNT(*) as pending_feedback
            FROM feedbacks
            WHERE batch_id = ${batchId} AND delivered = false
        )
        SELECT 
            i.total_interns,
            i.active_notices,
            o.pending_observations,
            f.pending_feedback
        FROM intern_stats i, observation_stats o, feedback_stats f
    `;
    
    return {
        totalInterns: result[0].total_interns,
        pendingObservations: result[0].pending_observations,
        pendingFeedback: result[0].pending_feedback,
        activeNotices: result[0].active_notices,
    };
}



export const countInternsWithoutRecentObservations = async (
    batchId: number,
    mentorId: number,
    days: number
): Promise<number> => {
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
            AND o.created_at >= CURRENT_DATE - INTERVAL '1 day' * ${days}
        )
    `;

    return result[0].count as number;
}

export const fetchObservations = async (batchId: number): Promise<Observation[]> => {
    const rows = await sql`
        SELECT o.id, i.name as "internName", m.username as "mentorName", o.created_at as "date", o.content, o.watchout
        FROM observations o
        JOIN interns i ON o.intern_id = i.id
        JOIN mentors m ON o.mentor_id = m.id
        WHERE o.batch_id = ${batchId} AND o.created_at >= CURRENT_DATE - INTERVAL '1 day' * 30
        ORDER BY o.created_at DESC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        internName: row.internName as string,
        mentorName: row.mentorName as string,
        date: new Date(row.date),
        content: row.content as string,
        watchout: row.watchout as boolean
    }));
}

export const fetchFeedbacks = async (batchId: number): Promise<Feedback[]> => {
    const rows = await sql`
        SELECT f.id, i.name as "internName", m.username as "mentorName", f.created_at as date, f.content, f.notice, f.delivered, f.color_code as "colorCode"
        FROM feedbacks f
        JOIN interns i ON f.intern_id = i.id
        JOIN mentors m ON f.mentor_id = m.id
        WHERE f.batch_id = ${batchId} AND f.created_at >= CURRENT_DATE - INTERVAL '1 day' * 30
        ORDER BY f.created_at DESC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        internName: row.internName as string,
        mentorName: row.mentorName as string,
        date: new Date(row.date),
        content: row.content as string,
        notice: row.notice as boolean,
        delivered: row.delivered as boolean,
        colorCode: row.colorCode as (string | undefined)
    }));
}