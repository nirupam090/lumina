# Service Layer Orchestration

## 1. Offline Sync Orchestrator
- **Definition**: Handles precise push/pull conflict operations originating from the local WatermelonDB instance to the central Node.js backend.
- **Responsibilities**: 
  - Retrieves local SQLite queues formatting them to batch generic REST arrays for payload delivery.
  - Ensures atomic actions performed offline (such as Kanban drops, Attendance marking ticks) seamlessly replace their temporary client IDs with permanent server-issued UUIDs natively.
  - Mitigates collision if two students modify the squad Kanban simultaneously.

## 2. Squad Real-Time Service
- **Definition**: WebSocket event publisher module housed in Node.js.
- **Responsibilities**: 
  - Subscribes active online users to persistent channels matching their `squadId`.
  - Pushes Focus Graph vector updates and Group Chat messages exclusively to joined logical squad rooms instantly.

## 3. Cognitive Behavioral Service (Native/Local Context)
- **Definition**: Mobile OS native background loop tracking feature.
- **Responsibilities**: 
  - Interfaces natively (via Expo/React Native native bridge) to capture active app sessions.
  - Maps OS-level context transitions continuously applying an automated decay algorithm to compute "Debt".
  - Pings UI nudge alerts and schedules local push notifications.

## Sequence Diagram: Offline Queue Resolution to Global Sync
```mermaid
sequenceDiagram
    autonumber
    actor MobileUX as Student UX
    participant LocalDB as WatermelonDB (SQLite Queue)
    participant SyncOrchestrator as Node.js Gateway
    participant PeerUX as Squad Peer Device
    
    rect rgb(240, 240, 240)
    Note over MobileUX, LocalDB: Device operates totally Offline (Airplane Mode)
    MobileUX->>LocalDB: Modify Task state to "Doing"
    LocalDB-->>MobileUX: Immediate UI Render
    LocalDB->>LocalDB: Append 'action:update' to offline queue schema
    MobileUX->>LocalDB: Periodically poll for network state
    end
    
    Note over MobileUX, SyncOrchestrator: Device reconnects to Campus WiFi
    MobileUX->>SyncOrchestrator: Emits connection ping over WebSockets
    LocalDB->>SyncOrchestrator: Execute POST /sync pushing batch changes
    SyncOrchestrator-->>SyncOrchestrator: Verify timestamps & resolve any state conflicts
    SyncOrchestrator->>LocalDB: Respond with unified updated DB mapping
    LocalDB->>MobileUX: Reactively trigger re-render of synchronized valid state
    SyncOrchestrator-)PeerUX: WebSocket Event -> Broadcast updated Kanban state to active Squad
```
