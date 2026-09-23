# AGENTS.md

## Core Development Principles

This project must remain simple, stable, scoped, and production-oriented.

### 1. Scope discipline
- Only implement features explicitly defined in PROJECT.md or the current task.
- Do not add adjacent features without approval.
- Do not silently expand scope.
- Do not introduce a database, authentication, CMS, dashboard, analytics, or account system unless explicitly requested.
- If an idea could improve the product but is outside scope, mention it separately and do not implement it.

### 2. Small changes
- Prefer small, additive, isolated changes.
- Avoid broad refactors.
- Do not rewrite working areas without a concrete reason.
- Do not combine unrelated UI, state, architecture, and backend changes in one task.
- One implementation goal per task whenever possible.

### 3. Stability over cleverness
- Prefer simple, boring, established solutions.
- Avoid unnecessary abstractions.
- Avoid premature architecture.
- Avoid custom implementations when a stable library solves the problem well.
- Optimize for maintainability and predictable behavior.

### 4. Understand before changing
Before modifying an existing area:
- inspect the relevant files
- inspect component dependencies
- inspect state dependencies
- inspect event handlers
- inspect CSS/layout dependencies
- inspect API or server dependencies
- identify the likely blast radius

Do not make assumptions about how an existing flow works.

### 5. Preserve working behavior
- Never remove working functionality unless explicitly requested.
- Do not change existing behavior as a side effect of another task.
- If a task could affect another working area, call that out before implementation.

### 6. UI responsiveness
- User interactions must feel immediate.
- Avoid blocking the entire interface for local operations.
- Loading states should be scoped to the affected component whenever possible.
- Expensive operations must not block rendering unnecessarily.
- Prefer optimistic/local UI behavior where safe.

### 7. Error isolation
- A failed upload, API request, export, or image-processing operation must not crash the app.
- Errors must remain local to the affected workflow.
- Every external request needs:
  - loading state
  - success state
  - user-friendly error state
  - retry path where appropriate

### 8. State discipline
- Keep state minimal.
- Avoid duplicated state.
- Avoid unnecessary global state.
- Prefer local component state unless data genuinely needs to be shared.
- Avoid hidden coupling between UI state and server state.

### 9. Secrets and APIs
- Never expose API secrets in client-side code.
- External paid APIs must be called server-side.
- Environment variables containing secrets must not use NEXT_PUBLIC_.
- Do not commit secrets.
- Include required variable names in .env.example without values.

### 10. Dependencies
- Do not add a dependency without a clear reason.
- Prefer mature and well-maintained libraries.
- Avoid large dependencies for small tasks.
- Explain why a new dependency is needed before or during implementation.

### 11. Design consistency
- Reuse existing design tokens, spacing, typography, buttons, inputs, and states.
- Do not invent a new visual style for each component.
- Keep interfaces visually simple.
- Avoid unnecessary text and controls.
- Product functionality should remain obvious without explanation.

### 12. Mobile first-class support
- Every meaningful UI change must work on mobile.
- Do not treat responsiveness as a final cleanup task.
- Touch interactions must remain usable.
- Avoid controls that depend only on hover.

### 13. Image workflow rules
For this product specifically:
- Image composition must be deterministic.
- Do not use generative AI for layout.
- Keep template positioning fixed.
- User editing must stay constrained.
- Portrait manipulation is limited to approved controls such as position and scale.
- Do not evolve the tool into a general-purpose image editor.

### 14. Performance
- Do not perform expensive work during every render.
- Avoid unnecessary rerenders.
- Large image operations should be handled carefully.
- Do not repeatedly process the same image unless necessary.
- Prefer browser-side composition where privacy and performance allow it.

### 15. Testing
Before considering a task complete:
- test the intended user flow
- test at least one failure case
- test replacement/reset behavior where relevant
- test mobile layout where relevant
- run lint/typecheck/build
- confirm no unrelated existing flow broke

Do not consider a feature complete only because the code compiles.

### 16. Real user testing over theoretical correctness
For image workflows test realistic inputs:
- normal JPEG
- PNG
- large phone photo
- portrait orientation
- landscape orientation
- long names
- long titles
- invalid file
- failed API response

### 17. Completion standard
A task is complete only when:
- requested behavior works
- UI state is clear
- errors are handled
- build passes
- no unnecessary changes were introduced
- implementation remains within scope

### 18. Working method
For every task:
1. inspect
2. explain intended change briefly
3. implement the smallest viable change
4. test
5. summarize changed files and behavior

Do not skip directly from request to broad implementation.
