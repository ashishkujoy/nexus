import { authOptions } from "@/app/lib/auth";
import { neon } from "@neondatabase/serverless";
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
    interns: { name: string; email: string }[];
}

const onboardInterns = async (body: OnboardInternsReqBody) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        for (const intern of body.interns) {
            await sql`INSERT INTO interns (batch_id, name, email) VALUES (${body.batchId}, ${intern.name}, ${intern.email});`;
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
    console.log(body);
    const session = await getServerSession(authOptions);
    const mentorId = session?.user?.id;
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
        await sql`
        INSERT INTO observations 
        (mentor_id, intern_id, batch_id, date, watchout, content) 
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

export const POST = async (req: Request) => {
    const body = await req.json();
    switch (body.type) {
        case "CreateBatch": return createBatch(body);
        case "OnboardInterns": return onboardInterns(body);
        case "RecordObservation": return recordObservation(body);
    }
    return createBatch(body);
}