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

2. **Backend API**
   - Node.js (Hapi) 
   - Authentication, RBAC enforcement, orchestration 
   - Audit logging and persistence 

3. **Clinical Microservices** 
   - Python (FastAPI) 
   - Isolated execution of clinical models (e.g. KFRE) 
   - Stateless and independently deployable 

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
