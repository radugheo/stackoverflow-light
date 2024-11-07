# Stack Overflow Light
A lightweight Q&A backend platform inspired by Stack Overflow. Users can ask questions, provide answers, vote on content, and track platform metrics. The application features real-time updates and caching mechanisms.

## Features
* Question and answer functionality
* Voting system
* User authentication via Auth0 OpenID Connect
* Real-time updates using WebSocket
* Redis caching for fetching popular questions page
* Usage metrics
* Complete Swagger documentation

## Tech Stack
* Backend: Node.js with Express
* Development: TypeScript
* Database: PostgreSQL with TypeORM
* Caching: Redis
* Authentication: Auth0 OpenID Connect
* Real-time updates: WebSocket
* API Documentation: Swagger
* Containerization: Docker

## Application Architecture
The application follows a layered architecture pattern, specifically implementing the Repository Pattern with Service Layer for a better separation of concerns and maintainable code structure.

### Architectural Layers
1. Routes Layer - HTTP request handling and routing
2. Controllers Layer - Request/response handling and data validation
3. Service Layer - Business logic implementation
4. Repository Layer - Data access layer using TypeORM

### Data Flow
```bash
Request -> Routes -> Controllers -> Services -> Repositories -> Database
```

### API URL Versioning
All API endpoints are versioned under `/v1` (e.g., `/api/v1/questions`).

### Project Structure
```
src/
|── config/            
|── controllers/        
|── middlewares/        
|── models/              
|── routes/             
|── services/            
|── types/               
|── utils/               
|── app.ts               
```

### Components
* Config: Contains all configuration setup (database, authentication and Redis)
* Controllers: Handle HTTP requests and return responses
* Middlewares: Implement middlewares for authentication and caching
* Models: Define database entities using TypeORM decorators
* Routes: Define API endpoints and their corresponding controllers
* Services: Implement business logic and make data operations
* Types: Contains TypeScript interfaces and types
* Utils: Helper functions and utilities

## Real-time Updates (WebSocket)

The application implements real-time updates using WebSocket for events related to questions and answers. This ensures the client receives immediate updates without polling the server.

### WebSocket Events:

#### Question Events
* `questionCreated` - When a new question is posted
* `questionUpdated` - When a question is edited
* `questionDeleted` - When a question is removed
* `questionVoted` - When a question receives a vote
* `questionAnswered` - When an answer is added to a question

#### Answer Events
* `answerCreated` - When a new answer is posted
* `answerUpdated` - When an answer is edited
* `answerDeleted` - When an answer is removed
* `answerVoted` - When an answer receives a vote

Each event carries relevant data like ID, content, author information, and vote counts.

## Caching

The application implements Redis caching to optimize performance for frequently accessed data.

### Popular Questions Caching
* The first page of popular questions is cached using Redis
* Cache duration: 1 hour (3600 seconds)
* Cache key depends on the number of entries per page
* Cache is automatically invalidated when:
  * New questions are created
  * Questions are updated or deleted
  * Voting occurs

### Cache Middleware
* Checks if requested data exists in cache before querying database
* Caches database results for subsequent requests
* Includes cache invalidation mechanisms to ensure data consistency

## Prerequisites
* Docker and Docker Compose
* Node.js 18 
* PostgreSQL 14
* Redis

## Installation & Running Locally
1. Clone the repository

2. Copy .env.example to .env and configure environment variables

3. Start the Application (make sure Docker Desktop is running)
```bash
docker-compose up --build
```
This will start:
* Main application on port 3000
* PostgreSQL database on port 5432
* Redis on port 6379
4. Access the Application
* API Documentation: `http://localhost:3000/api-docs`
* Main API: `http://localhost:3000/`
* Login: `http://localhost:3000/login` (redirects to Auth0 authentication form)
* Logout: `http://localhost:3000/logout`

## API Documentation
The API is documented using Swagger. Once the application is running, visit `/api-docs` for interactive API documentation.

## Testing
If you're running locally:
```bash
npm run test
```
If you're running in Docker:
```bash
docker-compose exec stackoverflowlight npm run test
```
The project includes three types of tests:

* Unit tests: Testing individual components and functions
* Integration tests: Testing database operations and repositories
* E2E tests: Testing API endpoints and request flows

Note: Tests use a separate test database (running on port 5433) to avoid interfering with the main application database.

## Deployment
This application can be deployed to AWS using Fargate - a serverless container service that eliminates the need to manage servers.

### Infrastructure Components
* Container Registry: AWS ECR to store Docker images
* Database: PostgreSQL on Amazon RDS
* Cache: Redis on ElastiCache
* Application Hosting: AWS Fargate

### Deployment Process
1. Initial Setup
* Set up AWS infrastructure
* Create database and Redis instances
* Configure container registry
2. Application Deployment
* Build and push Docker image
* Configure environment variables
* Deploy as Fargate service
* Set up load balancer for traffic distribution

### Scaling & Monitoring
The application is designed to scale automatically based on load. Fargate handles container scaling while RDS and ElastiCache provide database and cache scaling respectively.