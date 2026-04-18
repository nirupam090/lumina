# Core User Journey: Offline Deep Focus to Online Squad Sync

This Mermaid visualization depicts the critical flow of a student transitioning between offline deep study and online collaboration synchronization. It outlines the specific user paths for both Sam and Alex working seamlessly despite connectivity drops.

```mermaid
journey
    title Offline Study Session & Automatic Queue Sync
    section 1. Offline Disconnect
      Enter campus dead-zone: 5: Sam, Alex
      System detects offline state gracefully: 5: System
      Collaborative WebSockets gracefully terminate: 4: System
    section 2. Local-First Study (RAG)
      Target specific PDF block via text: 5: Alex
      Local TF.js processes local embeddings: 4: System
      Query local notes seamlessly: 5: Alex, Sam
    section 3. ContextSwitch Monitoring
      App monitors screen focus locally: 4: System
      Calculates algorithmic Cognitive Debt Score: 4: System
      Caches behavioral analytics to SQLite: 5: System
    section 4. Network Reconnection
      Regain campus WiFi connectivity: 5: Sam, Alex
      System automatically detects connection: 4: System
      Local Queue drains to Node.js backend: 5: System
      Squad leaderboards & Kanban board update live: 5: System
```
