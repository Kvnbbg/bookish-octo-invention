# Branch Protection Rules

Apply the following protections to the `main` branch:

1. **Require pull request reviews**
   - Minimum of 2 approving reviews, with at least one from `@security-champions` for security-sensitive changes.
   - Dismiss stale reviews when new commits are pushed.

2. **Status checks**
   - Require GitHub Actions workflow `CI` to succeed (build, tests, CodeQL, Trivy).
   - Enforce branch to be up-to-date with `main` before merging.

3. **Signed commits & verified authors**
   - Enforce signature verification for all commits.
   - Require linear history by enabling "Require merge queue" or "Allow squash merges only".

4. **Secret scanning & Dependabot alerts**
   - Enable GitHub advanced security: secret scanning, push protection, and Dependabot alerts/blocking.

5. **Deployment protection rules**
   - Use environment protection for `production` with mandatory manual approval from `@platform-team`.
   - Require passing security gates (SAST/DAST) before promoting builds.

6. **Branch naming policy**
   - Enforce regex `^(feature|bugfix|hotfix|chore|security)/[a-z0-9._-]+$` via server-side hook or GitHub App.
