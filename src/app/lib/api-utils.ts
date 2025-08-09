import { z } from "zod";

/**
 * Validates request body against a Zod schema and returns parsed data or error response
 */
export function validateRequest<T>(
    body: unknown,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: Response } {
    const validationResult = schema.safeParse(body);
    
    if (!validationResult.success) {
        const errors = validationResult.error.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
        ).join(', ');
        
        return {
            success: false,
            response: new Response(JSON.stringify({ 
                error: "Validation failed", 
                details: errors 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        };
    }
    
    return {
        success: true,
        data: validationResult.data
    };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
    message: string,
    status: number = 500,
    details?: string
): Response {
    const response: { error: string; details?: string } = { error: message };
    if (details) {
        response.details = details;
    }
    
    return new Response(JSON.stringify(response), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse(
    data: unknown,
    status: number = 200
): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}

/**
 * Validates and parses a numeric ID parameter from URL
 */
export function validateNumericId(
    id: string,
    paramName: string = "ID"
): { success: true; id: number } | { success: false; response: Response } {
    const parsedId = parseInt(id);
    
    if (isNaN(parsedId)) {
        return {
            success: false,
            response: createErrorResponse(`Invalid ${paramName}`, 400)
        };
    }
    
    return {
        success: true,
        id: parsedId
    };
}

/**
 * Common error responses
 */
export const ErrorResponses = {
    unauthorized: () => createErrorResponse("Unauthorized", 401),
    notFound: (resource: string = "Resource") => createErrorResponse(`${resource} not found`, 404),
    internalServerError: (message: string = "Internal server error") => createErrorResponse(message, 500),
    badRequest: (message: string = "Bad request") => createErrorResponse(message, 400),
} as const;
