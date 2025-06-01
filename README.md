# GitHub CRM

TODO:
1. Копіювати env для frontend та backend папок 
```
cd frontend && cp .env.example .env
```
```
cd ../backend && cp .env.example .env
```

2. Run db and dbadmin 
docker-compose up -d --build postgres dbadmin-postgres

3. Go to http://localhost:5050/browser/ and use credentials:
Email: root@devloc.space
Password: toor

4. Add new server with: 
Name: GitHub CRM Database
Host: postgres
Port: 5432
Maintenance database: github_crm
Username: postgres
Password: postgres

5. Run docker-compose
docker-compose up -d --build

6. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001


-------------------------------------------------------


A simple CRM system for managing public GitHub repositories.

## Features

- User authentication (email/password)
- GitHub repository management
- Real-time repository statistics
- Easy repository updates
- Modern and responsive UI

## Tech Stack

- Frontend:
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS

- Backend:
  - NestJS
  - TypeScript
  - PostgreSQL
  - TypeORM


## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login user

### Repositories
- GET /repositories - Get all repositories
- POST /repositories - Add a new repository
- PATCH /repositories/:id - Update repository
- DELETE /repositories/:id - Delete repository
