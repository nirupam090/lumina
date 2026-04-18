# Requirements Clarification Questions

Please answer the following questions to help clarify the requirements for Lumina.

## Question 1
Since you require offline-first operations and real-time collaboration (WebSockets, Live editing), what is the intended deployment model?

A) Web Application (PWA with Service Workers for offline, cloud backend for sync when online)
B) Desktop Application (Electron/Tauri with local SQLite, syncing to a central server when online)
C) Mobile Application (React Native/Flutter with local storage and cloud sync)
D) Other (please describe after [Answer]: tag below) 

[Answer]: C - we are creating a mobile application

## Question 2
The requirements mention "WebSockets" and "Real-time chat", but also "low-connectivity environments" and "offline-first". When a user is fully offline, how should the real-time collaborative features behave?

A) Disable collaborative features completely until connection is restored, but queue messages/actions locally to sync later
B) Support local-network collaboration (e.g., peer-to-peer/LAN) if central internet is down
C) Only support personal features (Kanban, RAG, Attendance) offline, and show clear error states for collaborative features
D) Other (please describe after [Answer]: tag below)

[Answer]: A) Disable collaborative features completely until connection is restored, but queue messages/actions locally to sync later but keep all the other features up 

## Question 3
Given the need for WebSockets, OCR, and a local Vector Database for RAG, what is your preferred deployment architecture for the AI and backend services?

A) Python monolithic backend (FastAPI/Flask) - Best for OCR and RAG, handling all logic and WebSockets
B) Node.js primary backend (Express/NestJS) for WebSockets and general logic, with Python microservices restricted to AI/OCR tasks
C) Embedded local models (e.g., in-browser Transformers.js or local proxy like Ollama) eliminating the need for a persistent Python cloud server
D) Other (please describe after [Answer]: tag below)

[Answer]: B - Node.js primary backend (Express/NestJS) for WebSockets and general logic, with Python microservices restricted to AI/OCR tasks - work on the hybrid model you can also go ahead with also integrating any other frameworks or architecture if needed. perform a hybrid approach with proper integration of everything with each other

## Question 4
For the "Local-First Second Brain (RAG)" to ensure "complete data privacy", how should the AI embeddings and retrieval operate?

A) Local Embedding Models (e.g., running python locally with ChromaDB/FAISS)
B) In-browser execution (Transformers.js) with client-side vector search (e.g., IndexedDB-based vector store)
C) Cloud-based but strictly private embeddings (e.g., a self-hosted cloud instance of a vector DB)
D) Other (please describe after [Answer]: tag below)

[Answer]: A - Local Embedding Models (e.g., running python locally with ChromaDB/FAISS). also keeping B ready for the approach as the feature requires as mentioned ahead. remember the following is a feature we need in this application- Local-First Second Brain (RAG): User can query his textbook PDFs and notes entirely offline. Using a local vector database (TensorFlow.js), Lumina performs Semantic RAG. Data never leaves the device, ensuring total privacy even in signal-dead zones like college basements.
