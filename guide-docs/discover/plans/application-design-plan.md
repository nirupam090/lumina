# Application Design Plan

## Phase 1: Contextual Design Questions

Please answer the following questions to help map the component boundaries and technical interfaces before we lock in the architecture.

### Question 1: Code Repository Structure
Given the hybrid nature of a Mobile app, Node.js WebSocket server, and Python AI service, how should the overall codebase be structured?
A) Monorepo (All components in one repository using workspaces like Turborepo/Nx to share generic types)
B) Polyrepo (Separate distinct repositories for the Mobile app, Node.js Backend, and Python microservice)
C) Other (please describe after [Answer]: tag below)

[Answer]: A) Monorepo (All components in one repository using workspaces like Turborepo/Nx to share generic types)

### Question 2: Mobile State Management and Local Storage
For handling the complex offline queuing and state syncing on the mobile client, which architectural pattern do you prefer?
A) Redux/Zustand with explicit SQLite wrappers mapped for offline persistence
B) WatermelonDB or similar reactive local database designed explicitly for offline-first syncing to REST/WebSockets
C) Offline-first caching via React Query / Apollo Client layered over AsyncStorage
D) Other (please describe after [Answer]: tag below)

[Answer]: B) WatermelonDB or similar reactive local database designed explicitly for offline-first syncing to REST/WebSockets

### Question 3: Inter-Service Communication (Backend)
How should the Node.js primary backend communicate with the Python OCR/AI microservice for heavy processing?
A) Direct REST API / HTTP calls over an internal cloud network
B) Asynchronous Message Broker/Queue (e.g., Redis, RabbitMQ) to handle heavy OCR workloads safely without blocking Node
C) gRPC for high performance and strict protobuf schemas
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Direct REST API / HTTP calls over an internal cloud network

## Phase 2: Mandatory Generation
*(To be checked off sequentially after clarification answers are approved)*
- [ ] Read and analyze user answers to resolve ambiguities.
- [ ] Generate `guide-docs/discover/application-design/components.md` with component definitions and high-level responsibilities.
- [ ] Generate `guide-docs/discover/application-design/component-methods.md` with method signatures.
- [ ] Generate `guide-docs/discover/application-design/services.md` with service definitions and orchestration patterns.
- [ ] Generate `guide-docs/discover/application-design/component-dependency.md` with dependency matrix and diagrams.
- [ ] Validate design completeness and consistency.
