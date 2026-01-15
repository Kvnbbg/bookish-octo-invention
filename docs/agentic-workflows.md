# Agentic Workflow Templates

This document provides reusable templates aligned with Anthropic's recommended agentic coding workflows. Use them to keep context visible, enable human intervention, and distribute work safely.

## 1) CLAUDE.md Template
```md
# Project Context
- Product goal:
- Runtime stack:
- Entry points:
- Known risks:

# Active Work
- Current focus:
- Do/Don't list:

# Parallelization Plan
- Sub-agent A: UI
- Sub-agent B: Backend
- Sub-agent C: Docs
```

## 2) Esc-Key Intervention Checklist
```txt
[ ] Stop automated refactors that cross module boundaries
[ ] Verify routes before changing auth or session logic
[ ] Validate any change touching production secrets
```

## 3) Sub-Agent Task Matrix (YAML)
```yaml
sub_agents:
  ui:
    scope: "templates + static assets"
    constraints:
      - "Do not modify auth routes"
  backend:
    scope: "routes + middleware"
    constraints:
      - "Keep Express entrypoint stable"
  docs:
    scope: "README + docs"
    constraints:
      - "Document Vercel env vars"
```

## 4) Parallel Work Queue (JSON)
```json
{
  "lanes": [
    { "name": "UI polish", "owner": "sub-agent-ui" },
    { "name": "Deployment docs", "owner": "sub-agent-docs" },
    { "name": "API hardening", "owner": "sub-agent-backend" }
  ]
}
```

## 5) Vercel Easy Deploy Checklist
```txt
[ ] vercel.json present and routes configured
[ ] api/index.js exports app handler
[ ] SESSION_SECRET set in Vercel environment
[ ] OAuth callback URLs configured for /auth/google/callback and /auth/github/callback
```
