Context:

You are working on Story 5: Split Monolithic API Route from the Nexus Performance Improvement Stories. We've successfully migrated 2 APIs and created utility functions. The project builds successfully and all refactored APIs are working.

Current Status:

Completed APIs:
/api/batches/route.ts - Batch creation (POST)
/api/batches/[batchId]/interns/route.ts - Intern onboarding (POST)
/api/batches/[batchId]/observations/route.ts - Observations (POST - always expects array of observations)

Created Utilities:
/src/app/lib/api-utils.ts - Common validation and response functions

Remaining API's
1. Feedbacks API - /api/batches/[batchId]/feedbacks/route.ts
2. Feedback Delivery API - /api/feedbacks/[feedbackId]/deliver/route.ts
3. Feedback Conversation API - /api/feedbacks/[feedbackId]/conversation/route.ts
4. Individual Intern API - /api/batches/[batchId]/interns/[internId]/route.ts ( Update intern fields, terminate intern)
5. Refactor Terminate API - /api/batch/intern/terminate/route.ts

Step by Step process to follow:
For each API migration
1. Create the new RESTful API route
    - Use the utility functions from /src/app/lib/api-utils.ts
    - Implement Zod validation schemas
    - Follow the established patterns from completed APIs
2. Update client-side code
    - Find where the old API is being called
    - Update to use the new RESTful endpoint
3. Clean up the monolithic API
4. Build and test

Important Notes
- Next.js 15: Use { params: Promise<{ batchId: string }> } and await params
- Zod Validation: Always create schemas for request validation
- Utility Functions: Use the established patterns from api-utils.ts
- Error Handling: Use ErrorResponses for consistent error messages
- Build Testing: Run npm run build after each API migration
- One at a time: Complete one API fully before moving to the next

Files to Reference
- /src/app/lib/api-utils.ts - Utility functions
- /src/app/api/batches/route.ts - Completed batch API (reference)
- /src/app/api/batches/[batchId]/interns/route.ts - Completed interns API (reference)
- /src/app/api/batch/route.ts - Monolithic API (source to extract from)

Start With
Begin with Feedbacks API (/api/batches/[batchId]/feedbacks/route.ts) as it's the next logical step and has clear operations to migrate.