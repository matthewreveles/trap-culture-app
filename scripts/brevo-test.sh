#!/usr/bin/env bash

set -euo pipefail

BASE_URL=${BASE_URL:-"http://localhost:3000"}
BREVO_TEST_KEY=${BREVO_TEST_KEY:-"brevo-test-123"}
TEST_EMAIL=${TEST_EMAIL:-"matt@greenpharms.com"}
TEST_NAME=${TEST_NAME:-"Trap Tester"}

echo "[brevo-test] Triggering Brevo test hook for $TEST_EMAIL"

curl -sS \
  -X POST \
  "$BASE_URL/api/brevo/test" \
  -H "Content-Type: application/json" \
  -H "x-brevo-test-key: $BREVO_TEST_KEY" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"$TEST_NAME\"
  }"
echo
