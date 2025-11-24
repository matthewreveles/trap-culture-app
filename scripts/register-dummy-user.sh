#!/usr/bin/env bash

set -euo pipefail

BASE_URL=${BASE_URL:-"http://localhost:3000"}

echo "[register-dummy-user] Sending signup payload to $BASE_URL/api/auth/register"

curl -sS \
  -X POST \
  "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trap Culture Demo",
    "email": "matt@greenpharms.com",
    "password": "duder123"
  }'
echo # newline
