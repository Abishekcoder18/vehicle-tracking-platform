# 🚚 Vehicle Tracking Platform

A full-stack **Vehicle Tracking Platform** developed using **React**, **FastAPI**, and **PostgreSQL**. The application enables fleet managers to securely manage vehicles, monitor trips, and visualize fleet statistics through a modern web dashboard.

This project is developed as part of the **Capstone Project** and follows a scalable architecture that will support future enhancements such as live GPS tracking, AI-based route optimization, Docker containerization, and AWS deployment.

---

# 📌 Problem Statement

Develop a full-stack web application that enables fleet managers to efficiently manage vehicles, monitor trips, and maintain fleet information using PostgreSQL. The application provides secure user authentication, REST APIs, and a responsive frontend while maintaining a scalable architecture for future enhancements.

---

# 🎯 Objectives

- Secure user authentication
- Manage vehicle information
- Create and monitor trips
- Display fleet statistics
- Store data securely using PostgreSQL
- Develop REST APIs using FastAPI
- Build a responsive frontend using React
- Prepare the system for AI and cloud integration

---

# ✨ Current Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints
- Protected Dashboard Routes
- Logout Functionality

---

## 📊 Dashboard

- Total Vehicles
- Total Trips
- Responsive Dashboard Cards

---

## 🚚 Vehicle Management

- Add Vehicle
- View Vehicle List
- Delete Vehicle

---

## 🛣 Trip Management

- Create Trip
- View Trip List
- Delete Trip

---

## ⚙ Backend

- FastAPI REST APIs
- JWT Authentication
- SQLAlchemy ORM
- Pydantic Validation
- Swagger Documentation

---

## 🗄 Database

- PostgreSQL Integration
- SQLAlchemy ORM
- Persistent Data Storage

---

# 🛠 Tech Stack

## Frontend

- React
- React Router DOM
- Axios
- React Icons
- CSS

---

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Python-JOSE
- Passlib (bcrypt)
- Uvicorn

---

## Database

- PostgreSQL

---

## Development Tools

- Git
- GitHub
- VS Code
- pgAdmin
- Postman
- Swagger UI

---

## Future Technologies

- Leaflet Maps
- OpenStreetMap
- Docker
- AWS
- AI Route Optimization

---

# 📂 Project Structure

```text
vehicle-tracking-platform/

├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── main.py
│   ├── .env.example
│   └── requirements.txt
│
├── docs/
│   ├── diagrams/
│   └── screenshots/
│
└── README.md
```

---

# 🗄 Database

### Tables

- users
- vehicles
- trips

Database:

- PostgreSQL

ORM:

- SQLAlchemy

---

# 📡 API Endpoints

## Authentication

```
POST /auth/register
```

Register a new user.

```
POST /auth/login
```

Authenticate user and generate JWT token.

---

## Dashboard

```
GET /dashboard/
```

Returns dashboard statistics.

---

## Vehicles

```
GET /vehicles/
POST /vehicles/
DELETE /vehicles/{id}
```

---

## Trips

```
GET /trips/
POST /trips/
DELETE /trips/{id}
```

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

Runs on:

```
http://localhost:5173
```

---

## Backend

```bash
cd backend

python -m venv .venv

.\.venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Runs on:

```
http://127.0.0.1:8000
```

Swagger:

```
http://127.0.0.1:8000/docs
```

---

# 📐 System Design

Included inside:

```
docs/diagrams/
```

- Architecture Diagram
- ER Diagram
- Module Diagram

---

# 📷 Screenshots

Location:

```
docs/screenshots/
```

Screenshots included:

- Login Page
- Signup Page
- Dashboard
- Vehicle Management
- Trip Management
- Swagger UI
- PostgreSQL Database

---

# ✅ Completed Features

- React Frontend
- FastAPI Backend
- PostgreSQL Database
- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Dashboard
- Vehicle CRUD
- Trip CRUD
- REST APIs
- SQLAlchemy ORM
- Swagger Documentation
- Architecture Diagram
- ER Diagram
- Module Diagram

---

# 🚧 Upcoming Features

- Search Vehicles
- Edit Vehicle
- Edit Trip
- Input Validation
- Better Error Handling
- Dashboard Analytics

---

# 🔮 Future Enhancements

- Live Vehicle Tracking
- Leaflet Maps Integration
- Route Optimization using AI
- Predictive Maintenance
- Notifications
- Role-Based Access Control
- Docker Containerization
- AWS Deployment

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