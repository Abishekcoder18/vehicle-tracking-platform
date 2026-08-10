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

This platform provides a centralized solution to manage vehicles, drivers, trips, and vehicle locations, helping companies improve fleet efficiency and make better operational decisions.

## 5. Proposed Solution

The Vehicle Tracking & Fleet Monitoring Platform is a web-based application that helps logistics companies efficiently manage their fleet operations.

The platform provides the following features:

- Vehicle management (add, update, and monitor vehicles)
- Driver management
- Trip creation and scheduling
- Vehicle location tracking using GPS coordinates
- Interactive vehicle tracking using Google Maps
- Fleet monitoring dashboard with trip status
- Trip progress monitoring
- Vehicle status validation
- Secure user authentication using JWT
- Protected REST APIs
- GPS simulation for vehicle movement demonstration
- AI-ready architecture for future route optimization and predictive maintenance

## 6. Core Entities / Database Tables

### 1. Users

- Stores user login information and authentication details.
- Supports secure authentication and user role information.

### 2. Vehicles

- Stores vehicle details such as registration number, model, type, and status.

### 3. Drivers

- Stores driver information, license details, contact information, and status.

### 4. Trips

- Stores trip details including source, destination, assigned vehicle, assigned driver, and trip status.

### 5. VehicleLocations

- Stores vehicle GPS coordinates, vehicle IDs, trip IDs, and timestamps for vehicle tracking.

### Future Entities

The following entities are planned for future enhancements:

### 6. RouteHistory

- Intended to store completed trip routes and travel history.

### 7. Notifications

- Intended to store alerts such as trip completion, delays, maintenance reminders, and emergency notifications.

## 7. User Roles & Permissions

### Admin

- Manage users
- Manage vehicles
- Manage drivers
- View all trips
- View fleet information
- Manage system settings

### Fleet Manager

- Create and assign trips
- Assign drivers and vehicles
- Monitor vehicle locations
- View fleet information
- Monitor trip status

### Driver

- Login to the system
- View assigned trips
- Update trip status
- Share vehicle location during a trip

## 8. Success Criteria

The project will be considered successful if:

- Users can securely log in using authentication.
- Fleet Managers can manage vehicles and drivers.
- Fleet Managers can create and manage trips.
- Vehicles can be assigned to trips with availability validation.
- Vehicle locations can be stored and retrieved through REST APIs.
- The latest vehicle location can be displayed on the dashboard.
- Vehicle movement can be visualized on Google Maps.
- Trip progress can be monitored through the dashboard.
- The system provides a centralized platform for basic fleet monitoring.

## 9. Out of Scope

The following features are not included in the initial version:

- Online payment integration
- Fuel expense management
- Vehicle maintenance scheduling
- Mobile application
- IoT hardware integration
- Real GPS device integration
- Advanced AI route optimization
- Predictive maintenance

These features may be considered for future project phases.

## 10. Chosen Track

Python (FastAPI)

### Frontend

- React
- React Router
- Axios
- React Icons
- Vite
- Google Maps Platform

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib / Bcrypt
- python-dotenv

### Database

- PostgreSQL

### Future Enhancements

- AI-based Route Optimization
- Predictive Maintenance
- Real GPS Device Integration
- Advanced Fleet Analytics
- Traffic-aware routing
- Weather-aware routing

# System Architecture

## Overview

The Vehicle Tracking & Fleet Monitoring Platform follows a modular full-stack architecture consisting of a React frontend, FastAPI backend, PostgreSQL database, and Google Maps Platform for map-based vehicle visualization.

The architecture is designed to support future enhancements such as real GPS device integration, AI-based route optimization, predictive maintenance, advanced analytics, and cloud deployment.

## Architecture Diagram

The system architecture diagram is maintained in:

`docs/diagrams/architecture.drawio`