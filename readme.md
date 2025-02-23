# Task Manager API

A RESTful API for managing tasks with user authentication, status tracking, priorities, and task organization.

## Features

- User authentication and task management
- Create, read, update, and delete tasks
- Filter tasks by status and priority
- MySQL database integration with JWT authentication

## Prerequisites

- Node.js
- MySQL Server
- MySQL Workbench
- API testing tool (Insomnia)

## Installation

1. Clone the repository (or create project directory):

```bash
mkdir task-manager-api
cd task-manager-api
```

2. Initialize project and install dependencies:

```bash
npm init -y
npm install express mysql2 cors dotenv bcrypt jsonwebtoken
npm install nodemon --save-dev
```

3. Create database and tables using MySQL:

```sql
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table with user relationship
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('not-started', 'in-progress', 'completed') DEFAULT 'not-started',
    priority ENUM('high', 'low', 'minimal') DEFAULT 'low',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

4. Configure environment variables:
   Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=task_manager
JWT_SECRET=your_jwt_secret_here
```

5. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and receive a JWT token
- `GET /api/auth/profile`: Get user profile

### Tasks

- `GET /api/tasks`: Get all tasks for the authenticated user
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Create Task (Authenticated)

```http
POST /api/tasks
Authorization: Bearer <your-token>
Content-Type: application/json

{
    "title": "Organize Digital Files",
    "description": "Sort and organize files across devices",
    "priority": "low"
}
```

## Project Structure

```
task-manager-api/
├── config/
│   └── db.js
├── controllers/
│   ├── taskController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── taskRoutes.js
│   └── userRoutes.js
├── .env
├── server.js
├── package.json
└── README.md
```

## Error Handling

The API includes error handling for:

- Authentication and authorization
- Database connection issues
- Invalid request data
- Resource not found
- Server errors

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes
- User-specific data access
- SQL injection protection
- CORS configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details
