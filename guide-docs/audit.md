## Interaction Start
**Timestamp**: 2026-04-18T09:01:45Z
**User Input**: "Build **\"LUMINA\" — a proactive, AI-powered engineering student assistant** designed for offline-first environments and high academic workload scenarios.

This is a real-world student productivity and behavioral intelligence system that goes beyond task tracking — it predicts user needs, analyzes behavior, and enables collaborative academic workflows.

The system operates in a **local-first architecture**, ensuring usability in low-connectivity environments like college campuses and hostels.

---

## System Overview:

Lumina helps students manage schedules, track attendance, monitor focus, collaborate with peers, and organize knowledge — all while proactively detecting stress, distraction, and workload imbalance.

The system processes structured and unstructured data (timetables, app usage, emails, notes) and converts it into actionable insights via analytics and AI.

---

## Features:

* **AI Timetable Parser and Attendance Engine**

  * Upload timetable via PDF/image
  * OCR-based schedule extraction
  * Automatic timetable structuring
  * Real-time attendance tracking
  * Bunk Analytics:

    * Calculate allowable absences based on 75% rule
    * Predict future attendance impact

* **ContextSwitch Engine (Behavior Tracking)**

  * Monitor foreground app usage and screen activity
  * Generate task-switching timeline
  * Compute Cognitive Debt Score using exponential decay model
  * Study Squads:

    * Share anonymized focus/activity graphs
    * Encourage deep work via social accountability

* **Group Discussion Hub**

  * Real-time chat using WebSockets
  * Persistent group conversations
  * Whiteboard for collaborative drawing
  * Pasteboard for code snippets and notes
  * Live multi-user editing

* **Gmail and Calendar Heatmap Sync**

  * Parse emails and calendar events
  * Detect academic keywords
  * Generate color-coded stress heatmap:

    * Red → deadline overload
    * Green → low workload
  * Timeline visualization

* **Multi-User Kanban & Progress Engine**

  * Shared task board for teams
  * Categories:

    * “What I am Doing”
    * “What I Want to Do”
  * Real-time updates and synchronization
  * Track project progress across members

* **Frictionless Expense Logger**

  * Quick entry of daily expenses
  * CRUD-based system
  * Weekly student spending summary and insights

* **Local-First Second Brain (RAG)**

  * Upload PDFs, notes, and study material
  * Perform semantic search using local vector database
  * Fully offline functionality
  * Ensure complete data privacy

---

## Bonus Features:

* **Overleaf / LaTeX Remote Preview**

  * View compiled LaTeX outputs inside dashboard
  * Enable quick academic document review

* **Smart Battery Guardian**

  * Monitor device battery levels
  * If battery < 15%:

    * Pause heavy background processes
    * Trigger final sync of collaborative data

---

## Build Order:

1. Core logic — data models, OCR pipeline, attendance engine, behavioral tracking, Kanban logic, expense system, local RAG pipeline
2. Backend / services layer — APIs, real-time communication setup
3. AI integration — semantic search, cognitive scoring logic
4. Frontend dashboard — visualization, interaction, collaboration tools

---

## Tech Constraints:

* Preferred stack: Python / Node.js (as required), WebSockets, local database (SQLite / IndexedDB), OCR library, vector database for RAG
* Real-time features must use efficient communication protocols (e.g., Socket.io)
* Keep dependencies minimal and optimized for low-resource devices

---

## System Constraints:

* Must support offline-first operation
* Must function on low-spec devices (laptops/mobile)
* Must handle intermittent connectivity
* Data privacy is critical — prioritize local processing
* UI must be intuitive and responsive

---

## Context Requirements:

* Designed for engineering students
* Academic workflows (classes, assignments, labs, group projects)
* Real-world usage scenarios (college schedules, study sessions, teamwork)

---

## Note:

Follow all development instructions, workflow stages, and execution constraints defined in the provided **gemini.md harness** strictly while building the system."
**AI Response**: "[Displayed welcome message and performed Workspace Detection]"
**Context**: Pre-flight check and DISCOVER - Workspace Detection

---

## Interaction: Continue to Requirements Analysis
**Timestamp**: 2026-04-18T09:05:00Z
**User Input**: "move ahead with next
always keep refering to gemini.md file and make sure you are following the instructions stated in that file,. it is your harness and at all costs you should follow the instructions structure and framework mentioned in that file"
**AI Response**: "[Appended interaction to audit.md, analyzed requirements, generated clarification questions in requirement-verification-questions.md]"
**Context**: Stage transition and DISCOVER - Requirements Analysis

---

## Interaction: Requirements Analysis Complete
**Timestamp**: 2026-04-18T09:14:00Z
**User Input**: "i have UPDATED THE ANSWERS ANALYSE THE ANSWERS AND MOVE AHEAD"
**AI Response**: "[Analyzed requirement answers, generated guide-docs/discover/requirements/requirements.md, updated state, and presented completion prompt]"
**Context**: DISCOVER - Requirements Analysis

---

## Interaction: Request Workflow Plan
**Timestamp**: 2026-04-18T14:48:00Z
**User Input**: "good with this i would first also request you to give me a workflow plan on how we are proceeding with things adn keep updating them as we move forward with each step. make sure we are always following gemini.md file."
**AI Prompt**: "Ready to proceed with this plan?"
**AI Response**: "[Generated Workflow Planning stage execution-plan.md, updated guide-state.md, presented to user]"
**Context**: DISCOVER - Workflow Planning

---

## Interaction: Approve Workflow Plan
**Timestamp**: 2026-04-18T14:52:00Z
**User Input**: "approve and continue"
**AI Response**: "[Logged approval, transitioned to DISCOVER - User Stories, generated user-stories-assessment.md and story-generation-plan.md, and asked user for inputs]"
**Context**: Stage transition and DISCOVER - User Stories

---

## Interaction: User Stories Generation
**Timestamp**: 2026-04-18T14:56:00Z
**User Input**: "i have answered go ahead"
**AI Prompt**: "User stories generation has created epic-based testing scenarios... Approve user stories and proceed to Application Design?"
**AI Response**: "[Executed phase 2 generation plan, created stories.md, personas.md, user-journey.md, and updated state]"
**Context**: DISCOVER - User Stories Checkout and Transition Prompt

---

## Interaction: Approve User Stories
**Timestamp**: 2026-04-18T15:02:00Z
**User Input**: "approved and conitnue"
**AI Response**: "[Logged approval, transitioned to DISCOVER - Application Design, generated application-design-plan.md, and asked user for inputs]"
**Context**: Stage transition and DISCOVER - Application Design

---

## Interaction: Application Design Generation
**Timestamp**: 2026-04-18T15:06:00Z
**User Input**: "make sure as we are moving forward with every step make sure we are also updating previous documents that we are required to update as per defined in the gemini.md file. make sure we are moving forward as per the gemini.md harness. and i have answered the required questions please move forward"
**AI Prompt**: "Application Design completion... Approve design and proceed to Units Generation?"
**AI Response**: "[Analyzed hybrid architecture decisions, updated all execution and stage checklists as per gemini.md constraints, generated 4 functional and dependency components with Mermaid diagrams architecture maps.]"
**Context**: DISCOVER - Application Design Checkout and Transition Prompt

---

## Interaction: Approve Application Design
**Timestamp**: 2026-04-18T15:10:00Z
**User Input**: "make sure as we are moving forward step by step make sure you are updating the execution plan file as well... and i have answered the required questions please move forward"
**AI Response**: "[Logged approval, transitioned to DISCOVER - Units Generation, generated unit-of-work-plan.md, and asked user for inputs]"
**Context**: Stage transition and DISCOVER - Units Generation

---

## Interaction: Units Generation Generation Phase
**Timestamp**: 2026-04-18T15:15:30Z
**User Input**: "i have answered now move ahead. before that i also wanted to remind you once of all our required features... Group Discussion Hub, Heatmap Sync, Kanban, Expense Logger, RAG, Overleaf, Smart Battery Guardian"
**AI Prompt**: "Units Generation Complete... Approve units and proceed to BUILD PHASE?"
**AI Response**: "[Analyzed hybrid sequencing explicitly extracting full lists of features. Created unit-of-work.md bridging 5 feature units accommodating ALL user requirements, plus unit-of-work-story-map.md mapping new stories.]"
**Context**: DISCOVER - Units Generation Checkout and Transition to Build Phase

---
