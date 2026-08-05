# 🚚 Vehicle Tracking & Fleet Monitoring Platform

A full-stack Vehicle Tracking & Fleet Monitoring Platform developed using **React**, **FastAPI**, and **PostgreSQL**. The application allows users to manage vehicles, create and monitor trips, and view fleet statistics through a simple dashboard. This project is developed as part of the Capstone Project and will be enhanced in future phases with JWT authentication, live GPS tracking, AI-powered route optimization, and cloud deployment.

---

# 📌 Problem Statement

Develop a full-stack web application that enables fleet managers to efficiently manage vehicles, monitor trips, and maintain fleet information using PostgreSQL. The application provides a user-friendly interface with REST APIs for vehicle and trip management while maintaining a scalable architecture for future enhancements.

---

# 🎯 Objectives

- Manage vehicle information
- Create and monitor trips
- Display fleet statistics through a dashboard
- Store data securely using PostgreSQL
- Develop REST APIs using FastAPI
- Build a responsive frontend using React
- Prepare the application for future AI and cloud integration

---

# ✨ Current Features (MVP)

## Dashboard

- View Total Vehicles
- View Total Trips

## Vehicle Management

- Add Vehicle
- View Vehicle List
- Delete Vehicle

## Trip Management

- Create Trip
- View Trip List
- Delete Trip

## Backend

- REST APIs
- Swagger API Documentation
- SQLAlchemy ORM

## Database

- PostgreSQL Integration
- Data Persistence

---

# 🛠 Tech Stack

## Frontend

- React
- Axios
- CSS

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

## Database

- PostgreSQL

## Development Tools

- VS Code
- Git
- GitHub
- pgAdmin

## Future Technologies

- JWT Authentication
- Leaflet Maps
- Docker
- AWS
- AI Modules

---

# 📂 Project Structure

```text
vehicle-tracking-platform/

├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── core/
│   │
│   ├── main.py
│   ├── .env
│   └── .gitignore
│
├── docs/
│   ├── database/
│   ├── diagrams/
│   └── screenshots/
│
└── README.md
```

---

# 🗄 Database

Current Tables

- users
- vehicles
- trips

Database: PostgreSQL

ORM: SQLAlchemy

---

# 📡 API Endpoints

## Dashboard

```
GET /dashboard/
```

Returns total number of vehicles and trips.

---

## Vehicles

```
GET /vehicles/
```

Retrieve all vehicles.

```
POST /vehicles/
```

Create a new vehicle.

```
DELETE /vehicles/{id}
```

Delete a vehicle.

---

## Trips

```
GET /trips/
```

Retrieve all trips.

```
POST /trips/
```

Create a new trip.

```
DELETE /trips/{id}
```

Delete a trip.

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Abishekcoder18/vehicle-tracking-platform.git
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Backend

```bash
cd backend

python -m venv .venv

.\.venv\Scripts\activate

pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv pydantic

uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

# 📐 System Design

The project documentation includes:

- Architecture Diagram
- ER Diagram
- Module/Class Diagram

Location:

```
docs/diagrams/
```

---

# 📷 Screenshots

The following screenshots are included in:

```
docs/screenshots/
```

- Dashboard
- Vehicle Management
- Trip Management
- Swagger API
- PostgreSQL Database

---

# 🚀 Project Status

## ✅ Completed

- Git Repository Setup
- React Frontend
- FastAPI Backend
- PostgreSQL Database
- Dashboard
- Vehicle CRUD
- Trip CRUD
- REST APIs
- SQLAlchemy ORM
- Swagger Documentation
- Architecture Diagram
- ER Diagram
- Module/Class Diagram

---

## 🚧 In Progress

- JWT Authentication
- UI Improvements
- Input Validation
- Better User Experience

---

## 🔮 Future Enhancements

- User Authentication (JWT)
- Role-Based Access Control
- Live Vehicle Tracking
- Maps Integration (Leaflet + OpenStreetMap)
- Notifications
- Route Optimization using AI
- Predictive Maintenance
- Docker Containerization
- AWS Cloud Deployment

---

# 👨‍💻 Author

**S. P. Abishek Edwin Raj**

B.Tech – Artificial Intelligence and Data Science

J.J. College of Engineering and Technology

GitHub:

https://github.com/Abishekcoder18

---

# 📄 License

This project is developed for educational and academic purposes as part of the Capstone Project.