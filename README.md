# Workout Tracker Application

A full-stack workout tracking application built with .NET 9, React, and TypeScript.

## Features

- 🔐 User authentication with JWT
- 💪 Create and manage workouts
- 📋 Exercise library management
- 📊 Track sets, reps, and weights
- ✅ Complete workouts and track progress
- 🎨 Modern dark theme UI

## Tech Stack

### Backend
- .NET 9 Web API
- Entity Framework Core
- SQL Server
- MediatR (CQRS pattern)
- FluentValidation
- JWT Authentication
- Clean Architecture

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- React Hook Form
- Tailwind CSS
- React Router
- React Hot Toast

## Getting Started

### Prerequisites
- Docker Desktop
- Node.js 18+ (for frontend development)

### Running with Docker
```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd WorkoutTracker

# Start the application
docker-compose up --build