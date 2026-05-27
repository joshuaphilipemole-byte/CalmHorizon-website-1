/**
 * Database initialization and helpers for Cloudflare D1
 * This will be used to store form submissions
 */

export interface Submission {
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

export type SubmissionInput = Omit<Submission, "id" | "createdAt" | "status">;

// Initialize database schema (run this once when deploying)
export async function initializeDatabase(db: any) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        notes TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        UNIQUE(email, date, time)
      );
      
      CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
      CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
      CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
      CREATE INDEX IF NOT EXISTS idx_submissions_createdAt ON submissions(createdAt);
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

export async function createSubmission(
  db: any,
  submission: SubmissionInput
): Promise<Submission> {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const status = "pending";

  await db
    .prepare(
      `
    INSERT INTO submissions (id, name, email, phone, notes, date, time, createdAt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
    )
    .bind(
      id,
      submission.name,
      submission.email,
      submission.phone,
      submission.notes || null,
      submission.date,
      submission.time,
      createdAt,
      status
    )
    .run();

  return {
    id,
    ...submission,
    createdAt,
    status,
  };
}

export async function getSubmission(db: any, id: string): Promise<Submission | null> {
  const result = await db
    .prepare("SELECT * FROM submissions WHERE id = ?")
    .bind(id)
    .first();

  return result || null;
}

export async function listSubmissions(
  db: any,
  {
    status,
    email,
    limit = 100,
    offset = 0,
  }: {
    status?: string;
    email?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<Submission[]> {
  let query = "SELECT * FROM submissions WHERE 1=1";
  const params: any[] = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (email) {
    query += " AND email = ?";
    params.push(email);
  }

  query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const results = await db.prepare(query).bind(...params).all();

  return results.results || [];
}

export async function updateSubmissionStatus(
  db: any,
  id: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<Submission | null> {
  await db
    .prepare("UPDATE submissions SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();

  return getSubmission(db, id);
}

export async function deleteSubmission(db: any, id: string): Promise<boolean> {
  const result = await db
    .prepare("DELETE FROM submissions WHERE id = ?")
    .bind(id)
    .run();

  return result.success === true;
}
