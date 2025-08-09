import { ErrorResponses } from "@/app/lib/api-utils";

export const POST = async (req: Request) => {
    const body = await req.json();
    switch (body.type) {
        default:
            return ErrorResponses.badRequest(`Unknown operation type: ${body.type}. This operation may have been migrated to a RESTful API.`);
    }
}