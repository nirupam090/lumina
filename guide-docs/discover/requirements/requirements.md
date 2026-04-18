# Requirements Document: LUMINA Student Assistant

## Intent Analysis Summary
- **User Request**: Build "LUMINA", an offline-first, AI-powered engineering student assistant with features for timetable parsing, attendance tracking, behavior/focus monitoring, group collaboration, calendar sync, Pomodoro/Kanban tasks, an offline expense logger, and a local-first Second Brain (RAG) using on-device databases and processing. 
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: System-wide (Mobile Application + Hybrid Backend infrastructure)
- **Complexity Estimate**: Complex (due to offline-first synchronization, local ML/RAG execution on mobile, and real-time WebSocket syncing)

## Architectural & Deployment Strategy
Based on user clarifications:
- **Client Architecture**: Mobile Application (e.g., React Native/Flutter) handling local persistent storage (SQLite/IndexedDB-like) and background sync.
- **Backend Architecture**: A Hybrid Model featuring a Node.js primary backend (Express/NestJS) handling WebSockets and core business logic syncing, accompanied by Python microservices for heavy AI/OCR processing where off-device processing is permissible.
- **Offline / Sync Strategy**: Collaborative real-time features are disabled while offline, with actions/messages queued locally. Core features (Kanban, RAG, Attendance) remain fully functional offline.
- **RAG & Privacy**: Semantic routing and vector retrieval for the "Second Brain" must be fully local (e.g., utilizing TensorFlow.js or local embedding libraries) so that textbook PDFs and notes never leave the device, ensuring total privacy.

## Functional Requirements

### 1. Timetable Parser & Attendance Engine
- Upload timetables via PDF or image, parsed through OCR.
- Automatically structure schedules to match academic modules.
- Track real-time attendance, including predicting future impacts ("Bunk Analytics") based on a 75% allowable absence baseline.

### 2. ContextSwitch Engine (Behavior Tracking)
- Monitor foreground app/screen activity (utilizing OS specific usage permissions).
- Track task-switching to compute a "Cognitive Debt Score" via an exponential decay model.
- "Study Squads": Share anonymized focus graphs to promote social accountability.

### 3. Collaboration & Group Discussion Hub
- Real-time communication via WebSockets (Node.js).
- Persistent group conversations, a collaborative whiteboard, and pasteboards for code snippets.
- Offline support: Queue chat messages and collaboration actions locally to sync seamlessly upon reconnection.

### 4. Heatmap & Calendar Sync
- Parse emails and calendar events for academic keywords.
- Generate color-coded visualization timelines representing workload (Red for deadline overload, Green for low workload).

### 5. Multi-User Kanban & Expense Logger
- Shared task boards with specific categories ("What I am Doing", "What I Want to Do").
- Real-time updates and task progression across squad members.
- Frictionless daily expense CRUD tracking with weekly financial summaries.

### 6. Local-First Second Brain (RAG)
- Users can import PDFs and text notes.
- Fully offline semantic search via a local vector store.

### 7. Bonus Features
- Remote LaTeX (Overleaf) compilation preview within the dashboard.
- Smart Battery Guardian: Pause sync and heavy background tasks if the battery drops below 15%; trigger final lightweight sync prior to pausing.

## Non-Functional Requirements
- **Performance**: High efficiency for low-spec mobile device environments.
- **Connectivity**: Robust offline-first architecture with conflict-free queuing and synchronization.
- **Privacy & Security**: Absolute data privacy for user notes; RAG embeddings must be executed entirely on the client device.
- **Usability**: Intuitive, frictionless user interface explicitly optimized for engineering students tracking high-volume academic workloads.
