# Story Map to Delivery Units

We have retrofitted the newly validated features requested into the Epic map linking directly to the sequence blocks.

### Unit 1: Core Sync & Framework
- Epics Managed: *Infrastructure Foundation*
- **Explicit Tracking**: 
  - Implementation of the **Smart Battery Guardian** threshold (<15% limits trigger final Watermelon db Push & aborts RAG workers).

### Unit 2: Timetable, Attendance & ContextSwitch
- Epics Managed: *Epic 1 (Timetable & Attendance) & Epic 2 (Behavioral Tracking)*
- **Explicit Tracking**:
  - `Story 1.1`: AI Timetable OCR Pipeline (Python).
  - `Story 1.2`: Realtime Bunk Analytics limiting below 75% thresholds.
  - `Story 2.1`: ContextSwitch monitoring rendering the Cognitive Debt Score mathematically.

### Unit 3: Group Discussion Hub & Kanban
- Epics Managed: *Epic 4 (Kanban) and Group Collaboration Extensions*
- **Explicit Tracking**:
  - `Story 4.1`: Multi-user Kanban offline enqueue drag-and-drop ("What I am Doing").
  - `Story 2.2`: Syncing Study Squads visual flow graphs.
  - **Group Discussion Hub**: Native persistent group chat, socket Whiteboard component, Pasteboard integrations.

### Unit 4: Widgets & Productivity Tools
- Epics Managed: *Dashboard Extensions*
- **Explicit Tracking**:
  - **Gmail and Calendar Sync**: Building OAuth interceptors to detect keyword stress and dynamically render UI Red/Green via Stress Meter widgets.
  - **Frictionless Expense Logger**: Weekly Student Wrap algorithm attached through rapid CRUD forms.

### Unit 5: Second Brain (RAG) & Integrations
- Epics Managed: *Epic 3 (Local Second Brain)*
- **Explicit Tracking**:
  - `Story 3.1`: Seamless Semantic Offline Querying against TF.js model.
  - **Overleaf Integration**: Webview payload injecting LaTeX Remote Previews securely to the GUI.
