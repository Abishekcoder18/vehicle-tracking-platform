# Problem Statement

## 1. Title

Vehicle Tracking & Fleet Monitoring Platform

## 2. Domain

Logistics and Fleet Management

## 3. Who are the users?

### 1. Admin
- Manages the entire platform.
- Adds and manages vehicles, drivers, and fleet managers.
- Monitors overall fleet performance.

### 2. Fleet Manager
- Assigns vehicles and drivers.
- Creates and monitors trips.
- Tracks vehicle locations and trip status.

### 3. Driver
- Views assigned trips.
- Updates trip progress.
- Shares vehicle location during the trip.

## 4. What problem are we solving?

Many logistics companies still rely on manual methods or disconnected systems to track vehicles, assign drivers, and monitor trips. This often leads to delays, inefficient route planning, poor fleet utilization, and difficulty in tracking vehicle status in real time.

For example, if a delivery vehicle breaks down or gets stuck in traffic, the fleet manager may not know about it immediately, resulting in delayed deliveries and increased operational costs.

This platform provides a centralized solution to manage vehicles, drivers, trips, and live tracking, helping companies improve fleet efficiency and make better operational decisions.

## 5. Proposed Solution

The Vehicle Tracking & Fleet Monitoring Platform is a web-based application that helps logistics companies efficiently manage their fleet operations.

The platform will provide the following features:

- Vehicle management (add, update, and monitor vehicles)
- Driver management and assignment
- Trip creation and scheduling
- Real-time vehicle tracking using maps
- Fleet monitoring dashboard with trip status
- Route history and trip reports
- Notifications for delays or completed trips
- AI-ready architecture for future route optimization and predictive maintenance

## 6. Core Entities / Database Tables

1. Users
   - Stores login information for Admins, Fleet Managers, and Drivers.

2. Vehicles
   - Stores vehicle details such as registration number, model, type, and status.

3. Drivers
   - Stores driver information, license details, and contact information.

4. Trips
   - Stores trip details including source, destination, assigned vehicle, assigned driver, and trip status.

5. VehicleLocations
   - Stores the latest GPS coordinates and timestamps for each vehicle.

6. RouteHistory
   - Stores completed trip routes and travel history.

7. Notifications
   - Stores alerts such as trip completion, delays, maintenance reminders, and emergency notifications.

---

## 7. User Roles & Permissions

### Admin
- Manage all users
- Manage vehicles
- Manage drivers
- View all trips
- View reports and analytics
- Manage system settings

### Fleet Manager
- Create and assign trips
- Assign drivers and vehicles
- Monitor live vehicle locations
- View fleet reports

### Driver
- Login to the system
- View assigned trips
- Update trip status
- Share live vehicle location

---

## 8. Success Criteria

The project will be considered successful if:

- Users can securely log in based on their roles.
- Fleet Managers can assign vehicles and drivers to trips.
- Drivers can update trip progress and location.
- Vehicle locations can be viewed in real time.
- Admin can monitor the complete fleet through a dashboard.
- The system provides accurate trip history and reports.

---

## 9. Out of Scope

The following features are not included in the initial version:

- Online payment integration
- Fuel expense management
- Vehicle maintenance scheduling
- Mobile application
- IoT hardware integration
- Advanced AI route optimization (planned as future enhancement)

---

## 10. Chosen Track

Python (FastAPI)

Frontend:
- React
- Tailwind CSS
- Axios
- Leaflet

Backend:
- FastAPI
- SQLAlchemy
- Pydantic

Database:
- PostgreSQL

Future Enhancement:
- AI-based Route Optimization
- Predictive Maintenance
# System Architecture

## Overview

The Vehicle Tracking & Fleet Monitoring Platform follows a three-tier architecture consisting of a React frontend, FastAPI backend, PostgreSQL database, and future AI module for route optimization and predictive maintenance.

## Architecture Diagram

![System Architecture](diagrams/architecture-v1.png)