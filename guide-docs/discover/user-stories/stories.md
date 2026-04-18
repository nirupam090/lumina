# Epic-Based User Stories

Using the requested Epic-Based breakdown strategy and Behavior Driven Development (BDD) acceptance criteria. All stories are mapped to Alex (Regimented Planner) and Sam (Distraction-Prone Student) following INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable).

## Epic 1: Timetable & Attendance Intelligence
**Description**: Automating tracking of classes and predicting absence consequences.

### Story 1.1: Automated OCR Timetable Parsing
**As** Alex (The Regimented Planner),
**I want to** upload a photo of my semester timetable so that the app automatically constructs my weekly schedule without manual data entry.
- **Acceptance Criteria**:
  - **Given** I am on the Timetable import screen,
  - **When** I upload a clean JPEG or PDF containing a standard grid timetable,
  - **Then** the OCR pipeline (Python microservice/local parser) successfully extracts the subjects and times within 5 seconds,
  - **And** the UI displays the structured module events in calendar format.

### Story 1.2: Bunk Analytics and 75% Rule Calculation
**As** Sam (The Distraction-Prone Student),
**I want to** see a realtime "allowable skips" counter for each subject so I know if I can safely skip a morning lecture without failing my criteria.
- **Acceptance Criteria**:
  - **Given** I am viewing the daily attendance dashboard,
  - **When** I toggle an upcoming class from 'Attending' to 'Skipping',
  - **Then** the mathematical engine recalculates my projected total attendance,
  - **And** displays a red warning modal if my total projected attendance drops below the 75% limit.

## Epic 2: Behavioral Tracking & ContextSwitch
**Description**: Monitoring focus levels and maintaining study accountability.

### Story 2.1: Cognitive Debt Score Tracking
**As** Sam,
**I want to** have my foreground app switches passively monitored so that I get a realistic Cognitive Debt Score nudge.
- **Acceptance Criteria**:
  - **Given** I have granted the application the required device usage permissions,
  - **When** I switch away from study apps to social media apps more than 3 times in 10 minutes,
  - **Then** the ContextSwitch Engine actively increases my Cognitive Debt Score via an exponential decay model,
  - **And** triggers a visual nudge notification on the device to refocus.

### Story 2.2: Collaborative Study Squad Graphs
**As** Alex,
**I want to** share my anonymized focus graph with my squad so that we can maintain mutual social accountability.
- **Acceptance Criteria**:
  - **Given** I belong to a 4-person Study Squad,
  - **When** I complete a 2-hour offline deep-focus sprint,
  - **And** my device subsequently reconnects to the network,
  - **Then** my locally queued focus metrics securely sync via the Node.js websocket,
  - **And** updates the squad's shared leaderboard UI for all members.

## Epic 3: Local-First Second Brain (RAG)
**Description**: Private, zero-latency vector document querying.

### Story 3.1: Offline Semantic Search
**As** Alex,
**I want to** query my uploaded PDF notes entirely offline so that I can study in signal-dead campus zones.
- **Acceptance Criteria**:
  - **Given** I have previously uploaded a 50-page PDF note file to my Second Brain,
  - **And** the device operates in airplane mode (fully offline),
  - **When** I query the search bar with "Explain thermodynamic loops",
  - **Then** the local TensorFlow.js vector database retrieves the top 3 relevant paragraphs without network latency,
  - **And** data transmission metrics explicitly confirm zero outbound network requests occurred.

## Epic 4: Collaborative Kanban & Messaging
**Description**: Team workflow and persistent offline group chat caching.

### Story 4.1: Offline Action Queuing for Kanban
**As** Sam,
**I want to** move a task to "What I am Doing" while offline so that my group project workflow isn't blocked by bad internet in a hostel.
- **Acceptance Criteria**:
  - **Given** I am viewing a collaborative squad group project Kanban board offline,
  - **When** I drag a card to the "What I am Doing" column,
  - **Then** the UI reflects the positional change immediately,
  - **And** the action is appended to the local SQLite sync queue,
  - **And** a clear "Sync Pending" icon is displayed on the card until reconnection fully restores WebSocket communication.
