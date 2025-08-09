import { sql } from "@/app/lib/db";

export const POST = async (req: Request) => {
    const { internId } = await req.json();
    try {
        await sql`UPDATE interns SET terminated = TRUE WHERE id = ${internId}`;
        return new Response(JSON.stringify({ message: "Intern terminated successfully." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: `${error}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}