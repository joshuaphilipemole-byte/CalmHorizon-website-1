import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  date: string;
  time: string;
  createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

const BASE_URL = "https://calmhorizon.health";

export const Route = createFileRoute("/admin/submissions")({
  head: () => ({
    meta: [
      { title: "Admin - Submissions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSubmissionsPage,
  errorComponent: AdminErrorComponent,
});

function AdminErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminSubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setAdminToken(token);
      setAuthenticated(true);
      fetchSubmissions(token);
    }
  }, []);

  const fetchSubmissions = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/api/submissions", BASE_URL);
      if (statusFilter) {
        url.searchParams.append("status", statusFilter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get("token") as string;

    if (!token) {
      setError("Please enter the admin token");
      return;
    }

    // Verify token by trying to fetch submissions
    try {
      const response = await fetch("/api/submissions", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Invalid admin token");
        return;
      }

      localStorage.setItem("admin_token", token);
      setAdminToken(token);
      setAuthenticated(true);
      await fetchSubmissions(token);
    } catch (err) {
      setError("Failed to verify token");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAdminToken("");
    setAuthenticated(false);
  };

  const updateStatus = async (
    id: string,
    newStatus: "pending" | "confirmed" | "cancelled"
  ) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${adminToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updated = await response.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
      setSelectedSubmission(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelectedSubmission(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete submission");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your admin token to access submissions
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="token" className="text-sm font-semibold text-primary">
                Admin Token
              </label>
              <Input
                id="token"
                name="token"
                type="password"
                placeholder="Enter your admin token"
                className="mt-2"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Appointment Submissions
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage booking requests from your website
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="mt-8 flex gap-4">
          <div>
            <label className="text-sm font-semibold text-primary">Filter by status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                if (adminToken) fetchSubmissions(adminToken);
              }}
              className="mt-2 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No submissions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-background/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Appointment
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-background/50">
                      <td className="px-6 py-4 font-semibold">{submission.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {submission.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(new Date(submission.date), "MMM d, yyyy")} at{" "}
                        {submission.time}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            submission.status === "confirmed"
                              ? "default"
                              : submission.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {format(new Date(submission.createdAt), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedSubmission && (
              <>
                <DialogHeader>
                  <DialogTitle>Submission Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-primary">Name</label>
                    <p className="mt-1 text-sm">{selectedSubmission.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-primary">Email</label>
                    <p className="mt-1 text-sm">{selectedSubmission.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-primary">Phone</label>
                    <p className="mt-1 text-sm">{selectedSubmission.phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-primary">
                      Requested Appointment
                    </label>
                    <p className="mt-1 text-sm">
                      {format(new Date(selectedSubmission.date), "EEEE, MMMM d, yyyy")} at{" "}
                      {selectedSubmission.time}
                    </p>
                  </div>

                  {selectedSubmission.notes && (
                    <div>
                      <label className="text-sm font-semibold text-primary">Notes</label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedSubmission.notes}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-primary">Status</label>
                    <div className="mt-2 flex gap-2">
                      {["pending", "confirmed", "cancelled"].map((status) => (
                        <Button
                          key={status}
                          variant={
                            selectedSubmission.status === status ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateStatus(
                              selectedSubmission.id,
                              status as "pending" | "confirmed" | "cancelled"
                            )
                          }
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
