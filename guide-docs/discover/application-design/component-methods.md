# Component Methods

Method signatures focusing exclusively on the critical component interfaces to bridge interactions. (Note: Internal detailed business logic arrays are fleshed out during Functional Design).

## 1. Lumina Mobile Client
- `initializeSyncPool()`: Initiates WatermelonDB push/pull logic upon app instantiation or network restoration.
- `trackAppSwitchEvent(appId: string, timestamp: ISO8601)`: Pushes a local screen-switch event to trigger the ContextSwitch decay calculation sequence.
- `queueKanbanAction(action: SyncEventPayload)`: Submits an offline board movement or state change strictly to local storage queue.
- `renderStudySquadGraph(graphData: Array<Vector>)`: Transforms downloaded matrix data into the UI canvas component.

## 2. Core Node.js Hub
- `handleWebSocketConnection(socket: Socket, token: JWT)`: Secures and upgrades connection, assigning the student to respective squad sync rooms.
- `reconcileSyncQueue(clientEvents: Array<Event>): Promise<SyncResponse>`: Resolves conflicts from pushed localized client queues and returns validated server events.
- `forwardOCRRequest(imageBlob: Buffer): Promise<TimetableJSON>`: Acts as a proxy bridging the mobile REST call gracefully towards the Python microservice.

## 3. Python AI Microservice
- `POST /api/v1/extract-timetable(file: UploadFile)`: Accepts image binary, performs OCR, detects grids, and returns structured JSON timetable arrays mapped to university schedules.
- `POST /api/v1/analyze-bunk-risk(attendanceMatrix: Array)`: (Currently designed for mobile but structured here for generic analytics hooks) Evaluates total attendance metrics.

## 4. On-Device RAG Engine
- `ingestPDF(documentPath: string, fileBuffer: Blob)`: Chunks text from binary, computes high-dimensional vectors natively on-chip, and persists them.
- `queryContext(searchVector: string): Promise<VectorData[]>`: Runs semantic matching algorithms against local IndexedDB/Vector cache returning Top-K similar paragraphs without ever hitting cloud layers.
