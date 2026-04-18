# Units of Work Breakdown

Based on the accepted "Hybrid Foundation + User Value in Parallel" strategy, we have constructed structurally independent units mapping to distinct feature deliveries. I have also aggressively integrated the explicit features you requested (Whiteboard, Expense Logger, Overleaf, Battery Guardian, Heatmaps). 

The application utilizes a **Turborepo Monorepo** ensuring code organization supports these units.

## Unit 1: Core Sync & Base Framework
- **Scope**: Skeleton structures serving as the foundation block for all future features.
- **Core Integrations**: WatermelonDB local definitions, Auth wrappers, WebSocket context instantiation.
- **Explicit Features Attached**: 
  - **Smart Battery Guardian**: A global context hook that detects if the device crosses the 15% threshold; forcefully pauses background processing loops and flushes the WatermelonDB queue to Node.js immediately.

## Unit 2: Timetable, Attendance & Context Analytics 
- **Scope**: Integrating local algorithmic hooks mapping behavioral inputs.
- **Explicit Features Attached**: 
  - **Timetable OCR**: Python fast-api microservice call mapping JSON to schedule view.
  - **Bunk Analytics**: 75% threshold computational limit tracker.
  - **ContextSwitch Tracking**: OS-level app switch detection calculating the exponential Cognitive Debt Score natively.

## Unit 3: Group Discussion Hub & Collaboration
- **Scope**: Realtime multi-user Socket.io features spanning high-bandwidth interactions.
- **Explicit Features Attached**: 
  - **Group Discussion Hub**: Persistent offline/online chat, synchronized Whiteboard for sketching logic gates, and a Pasteboard API for snippets.
  - **Multi-User Kanban**: "What I am Doing" synchronizing lists across peers.
  - **Squad Graph Leaderboards**: Pushing the behavioral tracking output to peers.

## Unit 4: Widgets & Productivity Tools
- **Scope**: Independent dashboard integrations tracking personal hygiene and schedules.
- **Explicit Features Attached**: 
  - **Gmail/Calendar Heatmap Sync**: Scrapes localized auth tokens for keywords, populating the red/green "Stress Meter" visualization.
  - **Frictionless Expense Logger**: UI Forms enabling CRUD inputs natively projecting the "Weekly Student Wrap".

## Unit 5: Second Brain (RAG) & Academic Integrations
- **Scope**: Heavy offline payload management manipulating large models privately.
- **Explicit Features Attached**: 
  - **Local-First RAG**: Ingesting PDF Textbooks -> TensorFlow.js Native vector algorithms -> Semantic Retrieval Offline.
  - **Overleaf Viewer**: Bridging a Webview/PDF pipeline displaying compiled LaTeX reports via specific webhook callbacks inline.

---

## Greenfield Code Organization Strategy (Monorepo)

```text
lumina-monorepo/
├── apps/
│   ├── mobile/               # React Native/Expo (Handles ALL client Units)
│   ├── api-gateway/          # Node.js WebSocket & REST queue (Handles Unit 1, Unit 3, Unit 4 integration)
│   └── ai-worker/            # Python OCR & Processing (Handles Unit 2 Timetable OCR logic)
├── packages/
│   ├── core-types/           # Shared TypeScript Data Objects
│   ├── watermelondb-sync/    # DB Models for offline schema
│   └── tfjs-rag/             # Local AI logic packaged exclusively for mobile runtime
```
