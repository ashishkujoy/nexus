import { authOptions } from "@/app/lib/auth";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next";

type NewBatchReqBody = {
    name: string;
    startDate: string;
    endDate?: string;
}

const createBatch = async (body: NewBatchReqBody) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        await sql`INSERT INTO batches (name, start_date, end_date) VALUES (${body.name}, ${body.startDate}, ${body.endDate});`
    } catch (error) {
        console.error("Error creating batch:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify({ message: "Batch created successfully" }), {
        status: 201,
        headers: { "Content-Type": "application/json" }
    });
}

type OnboardInternsReqBody = {
    batchId: number;
    interns: { name: string; email: string; img_url: string }[];
}

const onboardInterns = async (body: OnboardInternsReqBody) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        for (const intern of body.interns) {
            await sql`INSERT INTO interns (batch_id, name, email, img_url) VALUES (${body.batchId}, ${intern.name}, ${intern.email}, ${intern.img_url});`;
        }
        return new Response(JSON.stringify({ message: "Interns onboarded successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error onboarding interns:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

type RecordObservationReqBody = {
    internId: number;
    batchId: number;
    date: string;
    watchOut: boolean;
    content: string;
}

const recordObservation = async (body: RecordObservationReqBody) => {
    const session = await getServerSession(authOptions);
    const mentorId = session?.user?.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        await sql`
        INSERT INTO observations 
        (mentor_id, intern_id, batch_id, created_at, watchout, content) 
        VALUES (${mentorId}, ${body.internId}, ${body.batchId}, ${body.date}, ${body.watchOut}, ${body.content});`;
        return new Response(JSON.stringify({ message: "Observation recorded successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error recording observation:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

type RecordFeedbackReqBody = {
    internId: number;
    batchId: number;
    content: string;
    date: string;
    notice?: boolean;
    colorCode?: string;
}

const updateInternFields = async (
    sql: NeonQueryFunction<false, false>,
    internId: number,
    notice?: boolean,
    colorCode?: string
) => {
    // Only execute if there are fields to update
    if (notice === undefined && colorCode === undefined) {
        return; // No updates needed
    }

    // Use CASE statements for conditional updates
    return sql`
        UPDATE interns 
        SET 
            notice = CASE 
                WHEN ${notice !== undefined} THEN ${notice} 
                ELSE notice 
            END,
            color_code = CASE 
                WHEN ${colorCode !== undefined} THEN ${colorCode} 
                ELSE color_code 
            END
        WHERE id = ${internId}
    `;
}

const recordFeedback = async (body: RecordFeedbackReqBody) => {
    const session = await getServerSession(authOptions);
    const mentorId = session?.user?.id;
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        // TODO: Add transaction handling for atomicity
        await sql`
        INSERT INTO feedbacks
        (mentor_id, intern_id, batch_id, created_at, notice, content, color_code) 
        VALUES (${mentorId}, ${body.internId}, ${body.batchId}, ${body.date}, ${body.notice}, ${body.content}, ${body.colorCode});`;

        // Update intern fields efficiently if they are defined
        await updateInternFields(sql, body.internId, body.notice, body.colorCode);

        return new Response(JSON.stringify({ message: "Feedback recorded successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error recording feedback:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

type DeliveryFeedbackReqBody = {
    feedbackId: number;
    conversation: string;
}

const deliverFeedback = async (body: DeliveryFeedbackReqBody) => {
    const session = await getServerSession(authOptions);
    const mentorId = session?.user?.id;

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        await sql`INSERT INTO feedback_conversations
            (feedback_id, mentor_id, content)
            VALUES (${body.feedbackId}, ${mentorId}, ${body.conversation});`

        await sql`UPDATE feedbacks SET delivered = true WHERE id = ${body.feedbackId};`;
        return new Response(JSON.stringify({ message: "Feedback delivered successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error delivering feedback:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

const getFeedbackConversation = async (body: { feedbackId: number }) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        const rows = await sql`
        SELECT fc.id, fc.content, fc.created_at as "createdAt", m.username as "mentorName"
        FROM feedback_conversations fc
        JOIN mentors m ON fc.mentor_id = m.id
        WHERE feedback_id = ${body.feedbackId} 
        LIMIT 1;`;
        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "No conversation found for this feedback" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        const conversation = {
            id: rows[0].id as number,
            feedbackId: body.feedbackId as number,
            deliveredBy: rows[0].mentorName as string,
            deliveredAt: new Date(rows[0].createdAt),
            content: rows[0].content as string,
        }

        return new Response(JSON.stringify(conversation), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching feedback conversation:", error);
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export const POST = async (req: Request) => {
    const body = await req.json();
    switch (body.type) {
        case "CreateBatch": return createBatch(body);
        case "OnboardInterns": return onboardInterns(body);
        case "RecordObservation": return recordObservation(body);
        case "RecordFeedback": return recordFeedback(body);
        case "DeliverFeedback": return deliverFeedback(body);
        case "GetFeedbackConversation": return getFeedbackConversation(body);
    }
    return createBatch(body);
}