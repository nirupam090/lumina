# Unit of Work Plan

## Phase 1: Clarification Questions

Since we established a Turborepo/Nx Monorepo approach in Application Design, we need to finalize how work is logically clustered to prepare for the subsequent BUILD phase processing. Let's define our Units of Work.

### Question 1: Unit Decomposition Strategy
How should we group our "Units of Work" prior to entering the BUILD phase (where each unit will undergo structural functional design and coding sequentially)?
A) Technology-Based Slices (Unit 1: Mobile UI Client, Unit 2: Node.js Backend Gateway, Unit 3: Python AI Worker)
B) Feature-Based Vertical Slices (Unit 1: Core Sync & Frameworks, Unit 2: Offline Analytics/RAG features, Unit 3: Multiplayer Kanban)
C) Other (please describe after [Answer]: tag below)

[Answer]: B) Feature-Based Vertical Slices (Unit 1: Core Sync & Frameworks, Unit 2: Offline Analytics/RAG features, Unit 3: Multiplayer Kanban) - Core Sync & App Framework
Auth (light), local DB (WatermelonDB), sync skeleton (REST/WebSocket), base navigation
Timetable + Attendance + OCR
OCR → parse → schedule → attendance + bunk analytics
ContextSwitch + Analytics
Usage tracking (or simulated), session timeline, cognitive score
Kanban + Realtime Collaboration
Boards, tasks, WebSocket sync, basic chat
Second Brain (RAG)
Local docs, embeddings (lightweight), semantic search
Heatmap + Expenses
Gmail/Calendar parsing (mock if needed), stress heatmap, expense logger

### Question 2: Execution Sequence Priorities
When sequentially executing these designated units through the BUILD phase, how should we prioritize the ordering?
A) Foundation First (Core Backend Database, Services, and Python ML infrastructure built completely before building the Mobile App UI)
B) User Value First (Building the offline mobile interface first using mocked data, then attaching the backend later)
C) Other (please describe after [Answer]: tag below)

[Answer]: Hybrid: Foundation + User Value in Parallel (Thin Foundation First)

## Phase 2: Mandatory Generation
*(To be checked off sequentially after clarification answers are approved)*
- [x] Analyze user responses to dictate decomposition logic.
- [x] Generate `guide-docs/discover/application-design/unit-of-work.md` defining the explicit units of work and the Greenfield Monorepo code organization mapping.
- [x] Generate `guide-docs/discover/application-design/unit-of-work-dependency.md` detailing inter-unit dependency sequences.
- [x] Generate `guide-docs/discover/application-design/unit-of-work-story-map.md` assigning previously generated Epics (Timetable, RAG, etc.) into these specific units.
- [x] Validate unit boundaries.
