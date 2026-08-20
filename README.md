# Vehicle Tracking & Fleet Monitoring Platform

A full-stack Vehicle Tracking and Fleet Monitoring Platform developed using React, FastAPI, and PostgreSQL.

The system enables fleet managers to securely manage vehicles and drivers, create and monitor trips, track vehicle locations, and visualize active vehicle movement on an interactive Google Maps interface.

This project is developed as part of the Capstone Project.

---

## 1. Problem Statement

Many logistics companies rely on manual or disconnected systems to manage vehicles, drivers, and trips.
This makes real-time vehicle tracking, trip monitoring, and fleet management difficult and inefficient.
Our platform provides a centralized system for vehicle/driver management, trip monitoring, and live GPS-based vehicle tracking.

---

## 2. Objectives

- Secure user authentication using JWT
- Vehicle management
- Driver management
- Trip creation and monitoring
- Vehicle location tracking
- Interactive Google Maps visualization
- Trip progress monitoring
- PostgreSQL data storage
- REST APIs using FastAPI
- Responsive frontend using React
- Modular architecture for future enhancements

---

## 3. Current Features

### Authentication

- User signup
- User login
- Password hashing
- JWT authentication
- Protected API endpoints

### Vehicle Management

- Add vehicles
- Retrieve vehicles
- Update vehicle status
- Vehicle availability validation

### Driver Management

- Add drivers
- Retrieve driver information
- Driver status management

### Trip Management

- Create trips
- Retrieve trips
- Update trips
- Delete trips
- Pending to Running workflow
- Running to Completed workflow
- Vehicle assignment validation

### Vehicle Tracking

- Store vehicle GPS coordinates
- Retrieve vehicle locations
- Retrieve latest vehicle location
- Track active vehicle movement
- Display vehicle position on Google Maps
- Calculate trip progress
- GPS simulation
- Start/Stop simulation

### Dashboard

- Fleet statistics
- Vehicle information
- Trip information
- Active trip tracking
- Live vehicle coordinates
- Trip progress indicator

---

## 4. Technology Stack

### Frontend

- React 19
- React Router
- Axios
- React Icons
- @vis.gl/react-google-maps
- Vite
- ESLint

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- python-jose
- Passlib
- python-dotenv

### Database

- PostgreSQL

### Authentication

- JWT
- Bcrypt password hashing

### External Services

- Google Maps Platform

---

## 5. Project Structure

```text
vehicle-tracking-platform/
│
├── .gitignore
├── README.md
├── Problem_Statement.md
│
├── backend/
│   ├── .env.example
│   ├── requirements.txt
│   ├── main.py
│   │
│   └── app/
│       ├── api/
│       │   ├── auth.py
│       │   ├── dashboard.py
│       │   ├── driver.py
│       │   ├── trip.py
│       │   ├── vehicle.py
│       │   └── vehicle_location.py
│       │
│       ├── core/
│       │   ├── dependencies.py
│       │   └── security.py
│       │
│       ├── database/
│       │   └── database.py
│       │
│       ├── models/
│       │   ├── driver.py
│       │   ├── trip.py
│       │   ├── user.py
│       │   ├── vehicle.py
│       │   └── vehicle_location.py
│       │
│       └── schemas/
│           ├── driver.py
│           ├── trip.py
│           ├── user.py
│           ├── vehicle.py
│           └── vehicle_location.py
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── components/
│       │   ├── GoogleMap.jsx
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       │
│       └── services/
│           └── api.js
│
└── docs/
    ├── database/
    │   └── ER_Diagram.md
    │
    └── diagrams/
        ├── architecture.drawio
        ├── ER-diagram.drawio
        └── class-diagram.drawio
```

6. Prerequisites

Install the following before running the project:

Python 3.12+
Node.js and npm
PostgreSQL
Google Maps API key
7. Database Setup

The application uses PostgreSQL.

Create a database named:

vehicle_tracking_db

For example:

CREATE DATABASE vehicle_tracking_db;

Make sure PostgreSQL is running before starting the backend.

8. Backend Setup

From the project root:

python -m venv .venv

Activate the virtual environment on Windows:

.\.venv\Scripts\Activate.ps1

Install backend dependencies:

pip install -r backend\requirements.txt
9. Backend Environment Variables

Create:

backend/.env

Use the example file as a template:

backend/.env.example

The .env file should contain:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vehicle_tracking_db

Replace YOUR_PASSWORD with the password of your local PostgreSQL installation.

Never commit the real .env file or database credentials to Git.

10. Start the Backend

From the project root:

cd backend

Start FastAPI:

uvicorn main:app --reload

The backend will normally run at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
11. Frontend Setup

Open a second terminal.

From the project root:

cd frontend

Install dependencies:

npm install
12. Frontend Environment Variables

Create:

frontend/.env

Add:

VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

Replace the value with your Google Maps API key.

Never commit the real API key to Git.

13. Start the Frontend

From the frontend directory:

npm run dev

Vite will provide the local development URL, normally:

http://localhost:5173
14. Running the Complete Application

Two terminals are required.

Terminal 1 - Backend
.\.venv\Scripts\Activate.ps1
cd backend
uvicorn main:app --reload
Terminal 2 - Frontend
cd frontend
npm install
npm run dev

Open the frontend URL provided by Vite.

15. API Documentation

FastAPI provides interactive API documentation at:

http://127.0.0.1:8000/docs

The API currently includes:

Authentication
Dashboard
Vehicles
Drivers
Trips
Vehicle Locations
16. Vehicle Tracking Flow

The current tracking workflow is:

Running Trip
     |
     v
Google Maps Route
     |
     v
GPS Simulator
     |
     v
Vehicle Location API
     |
     v
PostgreSQL
     |
     v
Latest Vehicle Location
     |
     v
React Dashboard
     |
     v
Vehicle Marker + Trip Progress

The GPS simulator can be started and stopped from the dashboard.

17. Documentation

Project documentation and diagrams are available under:

docs/

The project includes:

System Architecture Diagram
Entity Relationship Diagram
Class/Module Diagram
18. Current Implementation Status
Completed
User signup
User login
JWT authentication
Protected APIs
Vehicle management
Driver management
Trip management
Vehicle status validation
Vehicle location storage
Latest vehicle location API
Google Maps route display
GPS simulation
Live vehicle marker
Trip progress calculation
Start/Stop simulation
Dashboard statistics
Future Enhancements
Real GPS device integration
Route optimization
AI-based route optimization
Traffic-aware routing
Weather-aware routing
Notifications
Advanced analytics
Docker containerization
AWS deployment
19. Author

S. P. Abishek Edwin Raj

B.Tech - Artificial Intelligence and Data Science

J.J. College of Engineering and Technology

20. License

This project is developed for educational and academic purposes as part of the Capstone Project.


### After saving

Run:

```powershell
Get-Content README.md