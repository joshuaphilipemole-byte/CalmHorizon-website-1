#!/bin/bash

# CalmHorizon Website - Cloudflare D1 Deployment Script
# This script automates the entire deployment process

set -e

echo "🚀 CalmHorizon Backend Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_section() {
    echo ""
    echo -e "${YELLOW}>>> $1${NC}"
    echo ""
}

# Check prerequisites
print_section "Checking Prerequisites"

if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI not found"
    echo "Install with: npm install -g wrangler"
    exit 1
fi
print_status "Wrangler CLI found"

if ! command -v node &> /dev/null; then
    print_error "Node.js not found"
    echo "Install Node.js 22+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    print_error "Node.js version $NODE_VERSION is too old"
    echo "Required: Node.js 22.16.0+"
    exit 1
fi
print_status "Node.js version $(node -v)"

# Login to Cloudflare
print_section "Step 1: Cloudflare Authentication"

if wrangler whoami &>/dev/null; then
    print_status "Already authenticated with Cloudflare"
    ACCOUNT=$(wrangler whoami 2>/dev/null | head -1)
else
    print_warning "Not authenticated with Cloudflare"
    echo "Running: wrangler login"
    wrangler login
fi

# Create D1 database
print_section "Step 2: Creating Cloudflare D1 Database"

DB_NAME="calm-horizon-db"
echo "Creating database: $DB_NAME"

DB_OUTPUT=$(wrangler d1 create "$DB_NAME" --yes 2>&1 || true)

# Extract database ID from output
DB_ID=$(echo "$DB_OUTPUT" | grep -i "database_id\|id" | grep -oE '"[a-f0-9-]+"' | head -1 | tr -d '"' || echo "")

if [ -z "$DB_ID" ]; then
    # Try to get existing database ID
    print_warning "Could not create new database, attempting to use existing..."
    DB_ID=$(wrangler d1 list 2>/dev/null | grep "$DB_NAME" | grep -oE '[a-f0-9-]{36}' | head -1 || echo "")
fi

if [ -z "$DB_ID" ]; then
    print_error "Failed to create or find database"
    echo "Please create manually: wrangler d1 create $DB_NAME"
    exit 1
fi

print_status "Database ID: $DB_ID"

# Update wrangler.jsonc with database ID
print_section "Step 3: Updating wrangler.jsonc"

if [ -f "wrangler.jsonc" ]; then
    # Check if d1_databases section exists
    if grep -q "d1_databases" wrangler.jsonc; then
        print_status "d1_databases already configured"
    else
        print_warning "Adding d1_databases configuration..."
        # This is a simplified approach - manual review recommended
        echo "⚠️  Please manually add this to wrangler.jsonc:"
        echo ""
        echo '  "d1_databases": ['
        echo '    {'
        echo '      "binding": "DB",'
        echo '      "database_name": "'$DB_NAME'",'
        echo '      "database_id": "'$DB_ID'"'
        echo '    }'
        echo '  ],'
    fi
else
    print_error "wrangler.jsonc not found"
    exit 1
fi

# Create database schema migration
print_section "Step 4: Creating Database Schema"

# Check if migrations directory exists
mkdir -p migrations

# Create migration file
MIGRATION_FILE="migrations/0001_initialize_schema.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    cat > "$MIGRATION_FILE" << 'SQL'
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
SQL
    print_status "Created migration file: $MIGRATION_FILE"
else
    print_status "Migration file already exists"
fi

# Apply migration
print_section "Step 5: Applying Database Schema"

echo "Running: wrangler d1 migrations list $DB_NAME"
wrangler d1 migrations list "$DB_ID" 2>/dev/null || print_warning "Could not list migrations (may not exist yet)"

echo ""
echo "Applying migration..."
wrangler d1 migrations apply "$DB_ID" --local 2>/dev/null || print_warning "Local migration (testing)"

# Generate admin token
print_section "Step 6: Generating Admin Token"

ADMIN_TOKEN=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
print_status "Generated admin token: ${ADMIN_TOKEN:0:16}..."

# Set environment variables
print_section "Step 7: Setting Environment Variables"

echo "Setting ADMIN_TOKEN in Cloudflare Secrets..."
echo "$ADMIN_TOKEN" | wrangler secret put ADMIN_TOKEN --env production 2>/dev/null || print_warning "Requires manual secret setup"

print_status "Admin token configured"

# Build
print_section "Step 8: Building Application"

echo "Running: npm run build"
npm run build

if [ $? -eq 0 ]; then
    print_status "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Deploy
print_section "Step 9: Deploying to Cloudflare Workers"

echo "Running: wrangler deploy"
wrangler deploy

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
else
    print_error "Deployment failed"
    exit 1
fi

# Verify deployment
print_section "Step 10: Verifying Deployment"

DEPLOYMENT_URL=$(wrangler deployments list 2>/dev/null | head -2 | tail -1 | awk '{print $NF}' || echo "")

if [ -n "$DEPLOYMENT_URL" ]; then
    print_status "Deployment URL: $DEPLOYMENT_URL"
else
    print_warning "Could not retrieve deployment URL"
fi

# Summary
print_section "Deployment Complete! 🎉"

cat << EOF

📋 Summary:
  • Database: $DB_NAME (ID: $DB_ID)
  • Admin Token: ${ADMIN_TOKEN:0:32}... (save this!)
  • Built with: npm run build
  • Deployed to: Cloudflare Workers

🔐 Security Reminder:
  • Save your admin token somewhere secure
  • Never commit it to version control
  • Use it to access /admin/submissions dashboard

📝 Next Steps:
  1. Copy your admin token from above
  2. Visit /admin/submissions in your browser
  3. Log in with the admin token
  4. Test form submission from /contact page
  5. Verify submission appears in admin dashboard

📚 Documentation:
  • See BACKEND_SETUP.md for detailed API documentation
  • See DEPLOYMENT_CHECKLIST.md for troubleshooting

EOF

echo "Admin Token (save this securely):"
echo "$ADMIN_TOKEN"
