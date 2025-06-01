# GitHub CRM

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

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- GitHub API token

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
GITHUB_API_TOKEN=your_github_token
JWT_SECRET=your_jwt_secret
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/github-crm.git
cd github-crm
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development environment:
```bash
# From the root directory
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run start:dev
```

## Building for Production

```bash
# Build and start all services
docker-compose up --build
```

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login user

### Repositories
- GET /repositories - Get all repositories
- POST /repositories - Add a new repository
- PATCH /repositories/:id - Update repository
- DELETE /repositories/:id - Delete repository

## License

MIT

docker build -t github-crm-backend:devel -f Dockerfile .

docker run -d \
    -u `id -u` \
    --network workspace \
    --name github-crm-backend.workspace \
    -v $(pwd):/usr/src/app \
    -p 9257:9257 \
    github-crm-backend:devel


Email: root@devloc.space
Password: toor

Name: GitHub CRM Database
Host: postgres
Port: 5432
Maintenance database: github_crm
Username: postgres
Password: postgres