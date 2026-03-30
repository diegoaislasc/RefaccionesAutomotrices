---
name: phase-runner
description: >-
  Orchestrates the start, execution, and completion of project phases for the
  Refacciones Automotrices MVP. Use when the user says "start phase X",
  "begin fase X", "run phase", "close phase", "finish fase", or asks about
  phase status, phase prerequisites, or what to work on next.
---

# Phase Runner

Skill para arrancar, ejecutar y cerrar cualquier fase del proyecto Refacciones Automotrices MVP.

## Phase Lifecycle

Every phase follows three stages: **Start**, **Execute**, **Close**.

---

## 1. START PHASE

When the user says "start phase N" or "begin fase N":

### 1.1 Read the plan

```
Read file: .cursor/plans/refacciones_automotrices_mvp_263ba06a.plan.md
```

Extract the section for the requested phase (FASE N). Identify:
- Objective
- Duration estimate
- Exit criteria
- Subtasks (numbered X.1, X.2, ...)

### 1.2 Verify prerequisites

Check that the previous phase is complete:

```
CallMcpTool → plugin-linear-linear → get_issue
  { "id": "FRU-{parent_id_of_previous_phase}" }
```

| Phase | Parent Issue | Depends On |
|-------|-------------|------------|
| 0     | FRU-10      | None (can start immediately) |
| 1     | FRU-11      | None (Fase 0 is non-blocking) |
| 2     | FRU-12      | FRU-11 must be Done |
| 3     | FRU-13      | FRU-12 must be Done |
| 4     | FRU-14      | FRU-13 must be Done |
| 5     | FRU-15      | FRU-14 must be Done |

If the prerequisite phase is NOT Done, warn the user and ask if they want to proceed anyway.

### 1.3 Activate in Linear

Move the parent issue to `In Progress`:

```
CallMcpTool → plugin-linear-linear → save_issue
  { "id": "FRU-{parent}", "state": "In Progress" }
```

### 1.4 Present the phase briefing

Show the user:

```
## Fase N — {Name}
**Objetivo:** {objective}
**Duracion estimada:** {duration}
**Criterio de salida:** {exit_criteria}

### Tareas
- [ ] N.1 {description}
- [ ] N.2 {description}
- ...

Empiezo con la tarea N.1?
```

Wait for user confirmation before writing any code.

---

## 2. EXECUTE TASKS

For each subtask N.X:

### 2.1 Begin task

Move the subtask issue to `In Progress`:

```
CallMcpTool → plugin-linear-linear → save_issue
  { "id": "FRU-{subtask}", "state": "In Progress" }
```

### 2.2 Work on the task

Follow the vibe-coding rules already loaded (planning, quality, testing, versioning).
Key reminders:
- **One task at a time** — complete N.X before starting N.(X+1)
- **Tests first** when applicable (TDD per vibe-coding-testing rule)
- **No secrets** in code (per vibe-coding-versioning rule)

### 2.3 Complete task

After the user confirms the task works:

1. Suggest a git commit with a clear message
2. Move the subtask to `Done`:

```
CallMcpTool → plugin-linear-linear → save_issue
  { "id": "FRU-{subtask}", "state": "Done" }
```

3. Show progress: "Tarea N.X completada. Siguiente: N.(X+1). Continuamos?"

### 2.4 Handle blockers

If a task fails after 3 attempts (regla de los 3 fallos):

1. Add a comment on the Linear issue explaining the blocker
2. Recommend starting a fresh chat with clean context
3. Do NOT keep retrying the same approach

---

## 3. CLOSE PHASE

When all subtasks in a phase are Done:

### 3.1 Run quality review

Check the codebase against the quality gates:

- [ ] No files > 200 lines (refactor if needed)
- [ ] No functions > 30 lines
- [ ] No duplicated code across files
- [ ] No accumulated TODOs or temporary hacks
- [ ] No secrets in code (scan for API keys, passwords, tokens)
- [ ] `.gitignore` covers sensitive files
- [ ] Tests pass for the phase's functionality

### 3.2 Verify exit criteria

Re-read the phase's exit criteria from the plan and verify each one is met.

### 3.3 Close in Linear

Move the parent issue to `Done`:

```
CallMcpTool → plugin-linear-linear → save_issue
  { "id": "FRU-{parent}", "state": "Done" }
```

### 3.4 Final commit and deploy

Suggest a phase-closing commit:

```
git commit -m "feat(fase-N): complete {phase_name}

{brief summary of what was built}
Exit criteria verified."
```

### 3.5 Recommend next steps

```
Fase N completada y cerrada en Linear.

Recomendacion: abre un chat nuevo con contexto limpio para Fase N+1.
Esto ahorra tokens y mejora resultados.
```

---

## Issue Reference Table

Quick lookup for phase-to-issue mapping:

| Phase | Parent | Subtask Range | Milestone |
|-------|--------|---------------|-----------|
| 0     | FRU-10 | FRU-16 to FRU-20 | Fase 0 — Experimentacion Stitch |
| 1     | FRU-11 | FRU-21 to FRU-29 | Fase 1 — Fundamentos del Proyecto |
| 2     | FRU-12 | FRU-30 to FRU-39 | Fase 2 — Catalogo y Busqueda |
| 3     | FRU-13 | FRU-40 to FRU-49 | Fase 3 — Sistema de Cotizaciones |
| 4     | FRU-14 | FRU-50 to FRU-61 | Fase 4 — Admin Panel |
| 5     | FRU-15 | FRU-56 to FRU-67 | Fase 5 — Pulido y Lanzamiento |

---

## "What should I work on next?"

If the user asks what to work on:

1. Query Linear for incomplete issues in the project:

```
CallMcpTool → plugin-linear-linear → list_issues
  { "project": "Refacciones Automotrices MVP", "state": "Todo" }
```

2. Find the lowest-numbered incomplete phase
3. Within that phase, find the lowest-numbered incomplete subtask
4. Present it as a suggestion: "La siguiente tarea es N.X: {title}. Arrancamos?"
