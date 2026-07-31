# Notes App

A full-stack three-tier notes application built with the PERN stack and Prisma ORM, containerized with Docker Compose.

## Overview

This project is a simple notes management app that lets users:

- register an account
- log in with their email and password
- create personal notes
- view and delete their notes

The application follows a classic three-tier architecture:

- Frontend: React + Vite
- Backend: Express.js + Node.js
- Database: PostgreSQL managed through Prisma ORM

## Tech Stack

- React 19
- Vite
- Express.js
- Node.js
- PostgreSQL
- Prisma ORM
- Docker Compose

## Project Structure

- `frontend/` – React client application
- `backend/` – Express API and Prisma configuration
- `docker-compose.yml` – container orchestration for the app stack
- `backend/prisma/schema.prisma` – Prisma schema for the database models

## Application Features

- User registration and login
- JWT-style concept not used in this project; login is handled via direct email/password lookup in the API
- Notes CRUD flow for authenticated users
- Dockerized development environment
- Prisma migrations deployed on backend startup

## Database Schema

The Prisma schema currently defines:

- `User`
  - `id`
  - `email` (unique)
  - `name`
  - `password`
  - relation to `notes`

- `Note`
  - `id`
  - `content`
  - `userId`
  - relation to `User`

## Docker Setup

This app is designed to run entirely with Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Start the application

From the project root, run:

```bash
docker compose up --build
```

This will start:

- PostgreSQL on port `5432`
- Backend API on port `3000`
- Frontend app on port `5173`

### Stop the application

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

## Accessing the App

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- PostgreSQL database: `localhost:5432`

## API Endpoints

### User Routes

- `POST /api/v1/user/register`
  - Create a new user account

- `POST /api/v1/user/login`
  - Authenticate a user

- `GET /api/v1/user/get-user`
  - Fetch all registered users

### Notes Routes

- `GET /api/v1/notes?userId=<id>`
  - Fetch notes for a specific user

- `POST /api/v1/notes`
  - Create a new note

- `DELETE /api/v1/notes/:id`
  - Delete a note by its ID

## Environment Variables

The Compose setup provides the backend with:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/notes_db
```

The frontend is configured to point to the API using:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Notes on the Current Implementation

- The backend runs on Express and uses Prisma directly from the generated client.
- Prisma migrations are applied during container startup through the backend service command.
- The frontend uses Axios for API communication.
- The current authentication flow stores the password directly in the database and validates it as plain text. For production use, password hashing and secure token-based auth should be added.

## Running Locally Without Docker

If you want to run the app outside Docker for development, you can install dependencies separately and run the frontend and backend from their respective folders.

