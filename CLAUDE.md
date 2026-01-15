# Agentic Context for Bookish Octo Invention

## Project Snapshot
- **Primary runtime:** Node/Express (Vercel serverless) and Java/Spring Boot (local/full-stack).
- **Entry points:** `app/server.js` (Express), `api/index.js` (Vercel handler).
- **Core UI:** HTML templates under `app/src/templates`.

## Architectural Intent
- Keep the Express app deployable to Vercel without additional build steps.
- Maintain secure defaults (session handling, rate limiting, passport flows).
- Prefer small, composable modules over monolith updates.

## Operational Practices
1. **Preserve context in this file.** Update when architecture, entry points, or environments change.
2. **Use the Esc key for realtime intervention** if an automated change deviates from intent.
3. **Parallelize safely with sub-agents** by splitting work into non-overlapping areas (docs, routes, UI).

## Vercel Notes
- `vercel.json` routes all requests through `api/index.js`.
- Node runtime resolves the Express app from `app/server.js`.
- Prefer environment variables for secrets (`SESSION_SECRET`, OAuth keys).

## Commands
- **Node dev:** `node app/server.js`
- **Vercel local:** `vercel dev`
- **Spring Boot:** `mvn spring-boot:run`

## Guardrails
- Avoid coupling UI changes with auth logic unless necessary.
- Keep authentication routes behind `ensureAuthenticated`.
- Favor deterministic, documented changes over hidden magic.
