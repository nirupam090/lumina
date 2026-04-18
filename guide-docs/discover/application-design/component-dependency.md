# Component Dependency Architecture

## Dependency Matrix

| Root Component | Depends On | Purpose / Interface Method |
| -------------- | ---------- | -------------------------- |
| **Mobile Screen Controllers** | WatermelonDB Local Models | Fetching observable reactive data queries completely decoupled from network status. |
| **WatermelonDB Sync Adapter** | Node.js Backend REST APIs | Executing explicit bi-directional state reconciliation across discrete /sync HTTP endpoints. |
| **Node.js Core Backend** | Python AI Microservice | Offloading computationally blocking tasks (like Machine Vision OCR analysis on Timetable PDFs). |
| **Mobile Screen Controllers** | On-Device RAG Service | Emitting Natural Language text prompts to fetch queried local textbook documents. |

## Data Flow Diagram

This dependency flowchart encapsulates how raw functionality transitions cleanly from User Intent on Mobile, into caching layers, and finally routes to backend hubs upon network availability, highlighting complete segregation of local AI paths from Cloud AI paths.

```mermaid
flowchart TD
    subgraph Client Application Environment
        UI[React UI Interfaces / Components]
        WDB[(WatermelonDB Local Datastore)]
        RAG[Local TF.js AI Engine & Vector Store]
        
        UI <--> |1. Reactive Live Observers| WDB
        UI --> |2. Offline Semantic Search Query| RAG
    end

    subgraph Secure Cloud Network
        NODE[Node.js Primary Backend API]
        POSTGRES[(PostgreSQL Primary DB)]
        PY[Python FastAPI / Worker Container]
        
        NODE <--> |5. Global State ORM Queries| POSTGRES
        NODE --> |6. Submits Blob Data for Sync OCR| PY
    end
    
    WDB <--> |3. Synchronizes Batched Sync Payloads| NODE
    UI <--> |4. Real-time WSS Streaming (Chat/Graph)| NODE

    %% Styling Elements %%
    classDef mobile fill:#e3f2fd,stroke:#1976d2,stroke-width:2px;
    classDef cloud fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef localai fill:#f1f8e9,stroke:#388e3c,stroke-width:2px,stroke-dasharray: 5 5;
    
    class UI,WDB mobile;
    class RAG localai;
    class NODE,POSTGRES,PY cloud;
```
