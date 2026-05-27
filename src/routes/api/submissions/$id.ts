import { createAPIFileRoute } from "@tanstack/react-start/api";
import { z } from "zod";
import {
  getSubmission,
  updateSubmissionStatus,
  deleteSubmission,
} from "../../../server/db";

const statusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export const Route = createAPIFileRoute("/api/submissions/$id").default(
  async (request: Request, { id }: { id: string }) => {
    const env = (globalThis as any).env || {};
    const db = env.DB;

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // Helper to verify admin token
    const getAdminToken = () => {
      const authHeader = request.headers.get("authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      const adminToken = env.ADMIN_TOKEN;
      return adminToken && token === adminToken;
    };

    if (request.method === "GET") {
      try {
        if (!getAdminToken()) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const submission = await getSubmission(db, id);

        if (!submission) {
          return new Response(JSON.stringify({ error: "Submission not found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify(submission), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("Get submission error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to get submission" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    if (request.method === "PATCH") {
      try {
        if (!getAdminToken()) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const body = await request.json();
        const { status } = statusSchema.parse(body);

        const submission = await updateSubmissionStatus(db, id, status);

        if (!submission) {
          return new Response(JSON.stringify({ error: "Submission not found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify(submission), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return new Response(
            JSON.stringify({ error: "Validation failed", issues: error.issues }),
            { status: 400, headers: { "content-type": "application/json" } }
          );
        }

        console.error("Update submission error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update submission" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    if (request.method === "DELETE") {
      try {
        if (!getAdminToken()) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const deleted = await deleteSubmission(db, id);

        if (!deleted) {
          return new Response(JSON.stringify({ error: "Submission not found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        console.error("Delete submission error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to delete submission" }),
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
