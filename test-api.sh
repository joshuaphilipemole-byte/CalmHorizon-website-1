#!/bin/bash

# Test local API endpoints (requires running dev server)
# Usage: ./test-api.sh

BASE_URL="http://localhost:5173"
ADMIN_TOKEN="test-token-12345"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 CalmHorizon API Testing Script${NC}"
echo "===================================="
echo ""

# Check if server is running
echo "Checking if dev server is running at $BASE_URL..."
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${RED}✗ Dev server not running${NC}"
    echo "Start it with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Dev server is running${NC}"
echo ""

# Test 1: Create a submission
echo -e "${YELLOW}Test 1: POST /api/submissions${NC}"
SUBMISSION_DATA=$(cat <<EOF
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "notes": "Test submission",
  "date": "2024-06-20",
  "time": "3:00 PM"
}
EOF
)

RESPONSE=$(curl -s -X POST "$BASE_URL/api/submissions" \
  -H "Content-Type: application/json" \
  -d "$SUBMISSION_DATA")

SUBMISSION_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUBMISSION_ID" ]; then
    echo -e "${RED}✗ Failed to create submission${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${GREEN}✓ Submission created${NC}"
    echo "ID: $SUBMISSION_ID"
fi
echo ""

# Test 2: List submissions (admin)
echo -e "${YELLOW}Test 2: GET /api/submissions (admin)${NC}"
RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "$BASE_URL/api/submissions")

if echo "$RESPONSE" | grep -q "submissions"; then
    echo -e "${GREEN}✓ Retrieved submissions list${NC}"
    echo "Response: $RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${RED}✗ Failed to retrieve submissions${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 3: Get single submission (admin)
if [ -n "$SUBMISSION_ID" ]; then
    echo -e "${YELLOW}Test 3: GET /api/submissions/{id} (admin)${NC}"
    RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
      "$BASE_URL/api/submissions/$SUBMISSION_ID")
    
    if echo "$RESPONSE" | grep -q "$SUBMISSION_ID"; then
        echo -e "${GREEN}✓ Retrieved submission details${NC}"
        echo "Response: $RESPONSE" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ Failed to retrieve submission${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""

    # Test 4: Update submission status (admin)
    echo -e "${YELLOW}Test 4: PATCH /api/submissions/{id} (admin)${NC}"
    UPDATE_DATA='{"status": "confirmed"}'
    RESPONSE=$(curl -s -X PATCH \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$UPDATE_DATA" \
      "$BASE_URL/api/submissions/$SUBMISSION_ID")
    
    if echo "$RESPONSE" | grep -q "confirmed"; then
        echo -e "${GREEN}✓ Updated submission status${NC}"
        echo "Response: $RESPONSE"
    else
        echo -e "${RED}✗ Failed to update submission${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""

    # Test 5: Delete submission (admin)
    echo -e "${YELLOW}Test 5: DELETE /api/submissions/{id} (admin)${NC}"
    RESPONSE=$(curl -s -X DELETE \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      "$BASE_URL/api/submissions/$SUBMISSION_ID")
    
    if [ -z "$RESPONSE" ] || echo "$RESPONSE" | grep -q "204\|success"; then
        echo -e "${GREEN}✓ Deleted submission${NC}"
    else
        echo -e "${RED}✗ Failed to delete submission${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""
fi

# Test 6: Test validation
echo -e "${YELLOW}Test 6: Validation (invalid email)${NC}"
INVALID_DATA=$(cat <<EOF
{
  "name": "Jane Doe",
  "email": "invalid-email",
  "phone": "+1-555-0101",
  "date": "2024-06-21",
  "time": "4:00 PM"
}
EOF
)

RESPONSE=$(curl -s -X POST "$BASE_URL/api/submissions" \
  -H "Content-Type: application/json" \
  -d "$INVALID_DATA")

if echo "$RESPONSE" | grep -q "error\|invalid"; then
    echo -e "${GREEN}✓ Validation working (caught invalid email)${NC}"
    echo "Response: $RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${RED}✗ Validation not working${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 7: Unauthorized access
echo -e "${YELLOW}Test 7: Unauthorized access (no token)${NC}"
RESPONSE=$(curl -s -H "Authorization: Bearer wrong-token" \
  "$BASE_URL/api/submissions")

if echo "$RESPONSE" | grep -q "401\|Unauthorized"; then
    echo -e "${GREEN}✓ Authentication working (rejected invalid token)${NC}"
else
    echo -e "${RED}✗ Authentication not working${NC}"
fi
echo ""

echo -e "${BLUE}===================================${NC}"
echo -e "${GREEN}✓ Testing complete!${NC}"
echo ""
echo "Note: Update ADMIN_TOKEN in this script to test with your actual token"
