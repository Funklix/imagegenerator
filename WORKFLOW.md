# WORKFLOW.md

## Development workflow

This project uses a controlled AI-assisted development workflow.

### Rule 1
Do not ask an AI coding agent to build the entire application in one request.

### Rule 2
Break development into small testable milestones.

### Rule 3
Each task must contain:
- goal
- allowed scope
- requirements
- explicit non-goals
- done criteria

### Standard task format

## Goal

Describe one concrete outcome.

## Inspect first

Specify what should be inspected before modification.

## Allowed changes

List files or areas that may reasonably change.

## Requirements

List functional requirements.

## Do not

List scope exclusions.

## Done when

List observable acceptance criteria.

## Verification

Require:
- lint
- typecheck
- production build
- relevant manual flow test

---

## Branch strategy

main = production-ready code

New functionality should normally use:
feature/<short-name>

Bug fixes:
fix/<short-name>

Workflow:

feature branch
→ implementation
→ Vercel preview
→ manual test
→ review
→ merge
→ production deployment

Avoid large batches of unrelated changes.

---

## Milestone order

Recommended build sequence:

1. project foundation
2. base layout
3. speaker form
4. local image upload
5. static event template
6. canvas composition
7. portrait positioning
8. portrait scaling
9. text fitting
10. image export
11. background removal
12. loading/error states
13. native sharing
14. mobile polish
15. realistic QA
16. production

Do not pull later milestones forward without a reason.

---

## Change review

After each implementation task, report:

- files changed
- behavior added
- dependencies added
- architecture changes
- known limitations
- verification performed

If the implementation required something outside the requested scope, stop and explain instead of silently expanding the task.
