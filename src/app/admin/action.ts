"use server";
import { sql } from "../lib/db";

export type Mentor = {
    id: number;
    username: string;
    email: string;
    root: boolean;
}

export type BatchAssignment = {
    id: number;
    mentorId: number;
    mentorName: string;
    mentorEmail: string;
    permissions: {
        recordObservation: boolean;
        recordFeedback: boolean;
        programManager: boolean;
    };
}

export type BatchWithAssignments = {
    id: number;
    name: string;
    startDate: Date;
    assignments: BatchAssignment[];
}

export const fetchMentors = async (): Promise<Mentor[]> => {
    const rows = await sql`SELECT id, username, email, root FROM mentors ORDER BY username ASC`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        id: row.id as number,
        username: row.username as string,
        email: row.email as string,
        root: row.root as boolean,
    }));
}

export const fetchBatchesWithAssignments = async (): Promise<BatchWithAssignments[]> => {
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
                id: batch.id as number,
                name: batch.name as string,
                startDate: batch.start_date as Date,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                assignments: assignmentRows.map((a: any) => ({
                    id: a.id as number,
                    mentorId: a.mentorId as number,
                    mentorName: a.mentorName as string,
                    mentorEmail: a.mentorEmail as string,
                    permissions: a.permissions as {
                        recordObservation: boolean;
                        recordFeedback: boolean;
                        programManager: boolean;
                    },
                })),
            };
        })
    );

    return batches;
}
