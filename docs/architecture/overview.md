# CareModel Hub (CMH)

CareModel Hub (CMH) is a cloud-native clinical decision-support platform designed to securely integrate validated predictive healthcare models into routine clinical workflows.

The current proof-of-concept implements the **Kidney Failure Risk Equation (KFRE)** within a modular microservices architecture, enabling secure orchestration, auditability, and future model expansion.

---

##  Key Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Clinical risk calculation via isolated Python microservice
- Full audit logging for traceability
- OpenAPI 3.0 contract with Swagger UI (development mode)
- MongoDB persistence layer
- Modular architecture designed for future AI model expansion

---

##  Architecture Overview

CMH follows a layered microservices architecture:

Frontend (React + TypeScript)  
↓  
Backend API (Node.js + Hapi)  
↓  
Clinical Microservice (FastAPI)  
↓  
MongoDB  

### Frontend
- React + TypeScript
- Authenticated clinical dashboard
- Secure API communication

### Backend
- Node.js (Hapi)
- JWT authentication
- RBAC enforcement
- Joi validation layer
- OpenAPI contract
- Audit logging

### Clinical Microservice
- Python (FastAPI)
- Isolated KFRE execution
- Stateless and independently deployable
- Automatic OpenAPI documentation

---

##  Security Principles

- Expiring JWT tokens
- Route-level RBAC enforcement
- Input validation at API boundary
- Microservice isolation of clinical computation
- Audit logging for governance and traceability
- Swagger documentation restricted to development mode

---

##  Local Development

### 1. Start MongoDB
```
mongod
```

### 2. Start Clinical Microservice
```
cd kfre_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 3. Start Backend
```
cd backend
npm install
npm run dev
```

### 4. Start Frontend
```
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

##  API Documentation

Backend OpenAPI documentation (development only):
```
http://localhost:4000/documentation
```

Microservice documentation:
```
http://localhost:8000/docs
```

---

##  Future Roadmap

- Additional clinical prediction models
- FHIR-based integration layer
- Enterprise identity provider integration
- Expanded governance and compliance mapping
- Scalable multi-model AI orchestration

---

CareModel Hub demonstrates a structured, extensible foundation for secure and governed clinical decision-support systems.