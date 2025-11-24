# Brevo Connectivity Test

This project now ships with a small authenticated endpoint that lets you verify
Brevo connectivity without touching production data.

## 1. Configure environment

Add the following variables to `.env.local` (already scaffolded with default
placeholders):

```
BREVO_TEST_KEY="some-long-random-string"
BREVO_TEST_EMAIL="your+brevo-test@trapculture.com"
```

`BREVO_TEST_EMAIL` is optional when you POST a custom email body.

## 2. Start the dev server

```
npm run dev
```

## 3. Create the dummy account

Run the helper script (requires the dev server running):

```
./scripts/register-dummy-user.sh
```

This calls `/api/auth/register` with:

- Email: `matt@greenpharms.com`
- Password: `duder123`
- Name: `Trap Culture Demo`

The Brevo sync hooks on that endpoint will immediately attempt to add the
contact + send the welcome template.

## 4. Trigger the direct Brevo test hook

Either run the wrapper script:

```
./scripts/brevo-test.sh
```

or issue the curl command manually:

```
curl -X POST \
  http://localhost:3000/api/brevo/test \
  -H "Content-Type: application/json" \
  -H "x-brevo-test-key: ${BREVO_TEST_KEY}" \
  -d '{"email":"matt@greenpharms.com","name":"Trap Tester"}'
```

If everything is wired correctly Brevo will upsert the contact and fire the
welcome template configured via `BREVO_WELCOME_TEMPLATE_ID`. You can omit the
`email`/`name` payload to fall back to the `.env` defaults.

## 5. Expected response

Successful calls return:

```
{ "ok": true }
```

Failures will surface JSON describing the missing configuration (no API key, no
test email, bad auth header, etc.). Consult the server logs for the detailed
Brevo API responses when debugging.
