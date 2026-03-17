# CareModel Hub (CMH)

CareModel Hub (CMH) is a **cloud-native clinical decision-support platform** designed to securely integrate predictive healthcare models into routine clinical workflows.  
The platform follows a **modular microservices architecture**, enabling validated clinical models to be deployed, governed, and extended over time.

The current proof-of-concept implementation focuses on the **Kidney Failure Risk Equation (KFRE)**, with the architecture deliberately designed to support additional models in future iterations.

---

## Project Objectives

- Provide a **secure and auditable platform** for clinical risk calculation
- Separate **clinical computation** from **application orchestration**
- Support **role-based access control (RBAC)** aligned with healthcare governance
- Enable **future expansion** to additional prediction models and AI services
- Align with **EU digital health strategy** and security-by-design principles

---

## High-Level Architecture

CMH is composed of three primary layers:

1. **Frontend** 
   - React + TypeScript 
   - Authenticated UI for clinicians, scientists, and administrators
   - Communicates with backend via secured REST API   

2. **Backend API**
   - Node.js (Hapi)  
   - JWT authentication and RBAC enforcement  
   - Validation (Joi schemas)  
   - OpenAPI contract + Swagger UI (development only)  
   - Audit logging and MongoDB persistence  
   - Orchestrates clinical microservices 

3. **Clinical Microservices** 
   - Python (FastAPI) 
   - Isolated execution of clinical models (e.g. KFRE) 
   - Stateless and independently deployable
   - Automatically exposes OpenAPI documentation  

---
## Backend Architectural Approach

During initial design, a dedicated *controller layer* was considered to separate route definitions from request-handling logic.

However, for this proof-of-concept phase, Hapi route handlers are defined directly within the `api/` modules (e.g. `results-api.ts`, `users-api.ts`, `audit-api.ts`). This decision was intentional and aimed to:

- Reduce unnecessary abstraction in a single-developer POC  
- Maintain clarity of request flow (validation → authorisation → service → persistence)  
- Keep the codebase accessible for academic and governance review  

The current structure preserves separation between:

- `schemas/` – API validation layer (Joi)  
- `services/` – Business logic and microservice orchestration  
- `models/` – Persistence layer (MongoDB)  
- `openapi/` – API contract definition and Swagger UI  

A dedicated controller layer may be introduced in future iterations if system complexity or team size increases.

---


## Repository Structure

```text
cmh/
├── frontend/                # React + TypeScript client
│   ├── src/
│   └── package.json
│
├── backend/                 # Node.js API (Hapi)
│   ├── src/
│   │   ├── api/             # API route definitions
│   │   ├── auth/            # JWT, RBAC, authorisation
│   │   ├── services/        # External service clients (KFRE)
│   │   └── models/          # Data persistence layer
│   └── server.ts
│
├── kfre_service/             # Python FastAPI microservice
│   ├── app/
│   │   ├── main.py
│   │   └── audit.py
│   └── requirements.txt
│
├── docker-compose.yml       # Local development orchestration
└── README.md

## API Documentation

The backend exposes:

- `/openapi.json` – OpenAPI 3.0 specification  
- `/documentation` – Swagger UI (development mode only)

Swagger UI is intentionally disabled in production environments to reduce attack surface while preserving developer transparency during local development.

The Python microservice exposes its own documentation automatically via:

- `/docs` (Swagger UI)  
- `/redoc`  
- `/openapi.json`

---

## Development Setup

To run the full stack locally:

### 1. Start MongoDB
- mongod

### 2. Start Python Microservice
- cd kfre_service
- source .venv/bin/activate
- uvicorn app.main:app --reload --port 8000

### 3. Start Backend
- cd backend
- npm install
- npm run dev

### 4. Start Frontend
- cd frontend
- npm install
- npm run dev

---

## Security Considerations

- JWT tokens are validated with expiration enforcement  
- RBAC enforced at route level  
- Swagger documentation restricted to development mode  
- Clinical computation isolated within a separate microservice  
- Audit logging implemented for traceability  

---

## Future Direction

The CMH architecture is intentionally modular and extensible. Future iterations may include:

- Additional clinical risk models  
- FHIR-based integration layer  
- Enterprise identity provider integration  
- Multi-tenant governance controls  
- Formal ISO-aligned documentation and traceability mapping  

---

CareModel Hub represents a structured, extensible foundation for secure and governed clinical decision-support systems.