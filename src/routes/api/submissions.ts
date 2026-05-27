import { createAPIFileRoute } from "@tanstack/react-start/api";
import { z } from "zod";
import { createSubmission, listSubmissions } from "../../server/db";

// Validation schema for form submissions
const submissionSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().trim().min(7, "Valid phone is required").max(30),
  notes: z.string().trim().max(1000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/, "Invalid time format"),
});

export type SubmissionPayload = z.infer<typeof submissionSchema>;

export const Route = createAPIFileRoute("/api/submissions").default(
  async (request: Request) => {
    // Get database from environment
    const env = (globalThis as any).env || {};
    const db = env.DB;

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();
        const validated = submissionSchema.parse(body);

        const submission = await createSubmission(db, validated);

        // TODO: Send confirmation email to user
        // TODO: Send notification to admin

        return new Response(JSON.stringify({ success: true, id: submission.id }), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return new Response(
            JSON.stringify({
              error: "Validation failed",
              issues: error.issues,
            }),
            { status: 400, headers: { "content-type": "application/json" } }
          );
        }

        console.error("Submission error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create submission" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    if (request.method === "GET") {
      try {
        // Check for admin authorization
        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.replace("Bearer ", "");
        const adminToken = env.ADMIN_TOKEN;

        if (!adminToken || token !== adminToken) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const url = new URL(request.url);
        const status = url.searchParams.get("status") || undefined;
        const email = url.searchParams.get("email") || undefined;
        const limit = parseInt(url.searchParams.get("limit") || "100");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        const submissions = await listSubmissions(db, {
          status,
          email,
          limit,
          offset,
        });

        return new Response(JSON.stringify(submissions), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("List submissions error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to list submissions" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }
);
