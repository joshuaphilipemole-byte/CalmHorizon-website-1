# Form Submission Backend Setup Guide

This guide explains how to set up and configure the backend form submission system for Calm Horizon.

## Overview

The backend system includes:
- **API Endpoints** (`/api/submissions`) for submitting and managing form submissions
- **Database** using Cloudflare D1 (SQLite) to store submissions
- **Admin Dashboard** (`/admin/submissions`) to view and manage submissions
- **Authentication** using admin tokens to protect the dashboard and API

## Prerequisites

- Cloudflare account with Workers and D1 enabled
- Node.js 22+ and npm 10+
- Git for version control

## 1. Database Setup

### Create Cloudflare D1 Database

```bash
# Install/update wrangler CLI
npm install -g wrangler

# Create a new D1 database
wrangler d1 create calm-horizon-db
```

The CLI will output a database ID - save this.

### Update wrangler.jsonc

Add the D1 binding to your `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "calm-horizon-db",
      "database_id": "YOUR_DATABASE_ID_HERE"
    }
  ]
}
```

### Initialize Database Schema

Create a migration file:

```bash
wrangler d1 migrations create calm-horizon-db initialize-schema
```

In the generated migration file (`migrations/0001_initialize_schema.sql`), add:

```sql
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
```

Apply migrations:

```bash
wrangler d1 migrations apply calm-horizon-db
```

## 2. Environment Variables Setup

### Local Development

Create a `.env.local` file:

```env
ADMIN_TOKEN=your-secure-admin-token-here
```

Generate a secure token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Cloudflare Production

Set environment variables in Cloudflare Workers:

```bash
wrangler secret put ADMIN_TOKEN
# Paste your secure token when prompted
```

## 3. API Endpoints

### POST /api/submissions

Submit a new appointment booking.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(516) 123-4567",
  "date": "2025-06-15",
  "time": "2:00 PM",
  "notes": "Optional notes about appointment"
}
```

**Response (201):**

```json
{
  "success": true,
  "id": "uuid-string"
}
```

**Response (400 - Validation Error):**

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "code": "invalid_string",
      "path": ["email"],
      "message": "Invalid email"
    }
  ]
}
```

### GET /api/submissions

List all submissions (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Query Parameters:**

- `status` - Filter by status (pending, confirmed, cancelled)
- `email` - Filter by email address
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset (default: 0)

**Response (200):**

```json
[
  {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(516) 123-4567",
    "date": "2025-06-15",
    "time": "2:00 PM",
    "notes": "Optional notes",
    "createdAt": "2025-05-28T10:30:00Z",
    "status": "pending"
  }
]
```

### GET /api/submissions/{id}

Get a specific submission (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response (200):**

```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(516) 123-4567",
  "date": "2025-06-15",
  "time": "2:00 PM",
  "notes": "Optional notes",
  "createdAt": "2025-05-28T10:30:00Z",
  "status": "pending"
}
```

### PATCH /api/submissions/{id}

Update submission status (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

**Request:**

```json
{
  "status": "confirmed"
}
```

**Response (200):**

```json
{
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(516) 123-4567",
  "date": "2025-06-15",
  "time": "2:00 PM",
  "notes": "Optional notes",
  "createdAt": "2025-05-28T10:30:00Z",
  "status": "confirmed"
}
```

### DELETE /api/submissions/{id}

Delete a submission (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response (200):**

```json
{
  "success": true
}
```

## 4. Admin Dashboard

The admin dashboard is available at `/admin/submissions`.

### Login

1. Navigate to `/admin/submissions`
2. Enter your admin token (set in environment variables)
3. Click "Login"

### Features

- **View Submissions**: See all form submissions in a table format
- **Filter**: Filter submissions by status (pending, confirmed, cancelled)
- **View Details**: Click "View" to see full submission details
- **Update Status**: Change submission status to pending, confirmed, or cancelled
- **Delete**: Remove submissions from the database

## 5. Testing

### Local Development

```bash
# Start the development server
npm run dev

# Submit a test form
curl -X POST http://localhost:5173/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "(555) 123-4567",
    "date": "2025-06-15",
    "time": "2:00 PM"
  }'

# Get submissions (admin)
curl -X GET http://localhost:5173/api/submissions \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Deployment

```bash
# Build the project
npm run build

# Deploy to Cloudflare
wrangler deploy
```

## 6. Email Notifications (Future Enhancement)

To add email notifications, integrate with:

- **SendGrid** - For transactional emails
- **Mailgun** - For email delivery
- **AWS SES** - For email sending via Amazon

Example integration point in `/src/routes/api/submissions.ts`:

```typescript
// TODO: Send confirmation email to user
// TODO: Send notification to admin
```

## 7. Security Considerations

- **Admin Token**: Keep your admin token secret. Use strong, random tokens.
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Consider adding rate limiting to the API endpoints
- **CORS**: Configure CORS appropriately for your domain
- **Input Validation**: All inputs are validated using Zod schema

## 8. Troubleshooting

### Database Connection Errors

Ensure D1 binding is configured correctly in `wrangler.jsonc` and the database exists.

### Admin Token Invalid

Verify the token in your environment variables matches what you're using for authentication.

### CORS Issues

The API should work same-origin. If you're accessing from a different domain, configure CORS headers.

### Form Submissions Not Saving

Check:
1. Network tab in browser DevTools
2. Cloudflare Worker logs
3. D1 database schema and migrations

## 9. File Structure

```
src/
├── server/
│   └── db.ts                          # Database functions
├── routes/
│   ├── api/
│   │   ├── submissions.ts             # POST/GET submissions
│   │   └── submissions/$id.ts         # GET/PATCH/DELETE submission
│   ├── admin/
│   │   └── submissions.tsx            # Admin dashboard
│   └── contact.tsx                    # Updated contact form
├── hooks/
│   └── use-form-submission.ts         # Form submission hook
└── server.ts                          # Server entry point
```

## 10. Next Steps

- Set up email notifications for new submissions
- Add calendar integration for availability checking
- Implement SMS notifications
- Add export functionality (CSV, PDF)
- Set up backup strategy for database

For questions or issues, contact your development team.
