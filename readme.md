# Task Manager API

A RESTful API for managing tasks with user authentication, status tracking, priorities, and task organization.

## Features

- Secure cookie-based authentication system with refresh tokens
- User authentication and task management
- Create, read, update, and delete tasks
- Filter tasks by status and priority
- MySQL database integration
- Protection against XSS attacks using HTTP-only cookies

## Prerequisites

- Node.js
- MySQL Server
- MySQL Workbench
- API testing tool (Insomnia or Postman)

## Installation

1. Clone the repository (or create project directory):

```bash
mkdir task-manager-api
cd task-manager-api
```

2. Initialize project and install dependencies:

```bash
npm init -y
npm install express mysql2 cors dotenv bcrypt jsonwebtoken cookie-parser
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
- `POST /api/auth/login`: Login and receive HTTP-only cookies
- `GET /api/auth/profile`: Get user profile (protected)
- `GET /api/auth/me`: Check authentication status (protected)
- `POST /api/auth/refresh`: Refresh access token using refresh token
- `POST /api/auth/logout`: Logout and clear authentication cookies

### Tasks

- `GET /api/tasks`: Get all tasks for the authenticated user
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

## Authentication Flow Examples

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "Password123"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Note: Authentication tokens are set as HTTP-only cookies and are not included in the response body.

#### Check Authentication Status

```http
GET /api/auth/me
```

Response:

```json
{
  "isAuthenticated": true,
  "userId": 1,
  "email": "user@example.com"
}
```

#### Refresh Access Token

```http
POST /api/auth/refresh
```

Response:

```json
{
  "message": "Token refreshed successfully"
}
```

#### Logout

```http
POST /api/auth/logout
```

Response:

```json
{
  "message": "Logged out successfully"
}
```

#### Create Task (Authenticated)

```http
POST /api/tasks
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

## Authentication System

The application uses a two-token authentication system:

1. **Access Token**

   - Short-lived (15 minutes)
   - Stored as HTTP-only cookie
   - Used for accessing protected resources

2. **Refresh Token**
   - Long-lived (7 days)
   - Stored as HTTP-only cookie
   - Used only to obtain new access tokens when they expire

Benefits of this approach:

- Protection against XSS attacks (JavaScript cannot access HTTP-only cookies)
- Improved user experience (silent token refresh)
- Better security (short-lived access tokens)
- No token storage needed in local/session storage

## Frontend Integration

To use this API with a frontend application:

1. Configure your HTTP client to include credentials:

```javascript
// Using axios
axios.defaults.withCredentials = true;

// Using fetch
fetch(url, {
  credentials: "include",
});
```

2. Set up CORS on the server to allow your frontend domain and credentials:

```javascript
app.use(
  cors({
    origin: "http://yourdomain.com",
    credentials: true,
  })
);
```

## Error Handling

The API includes error handling for:

- Authentication and authorization
- Token expiration and refresh
- Database connection issues
- Invalid request data
- Resource not found
- Server errors

## Security Features

- Password hashing with bcrypt
- HTTP-only cookie-based authentication
- Two-token system with automatic refresh
- Protected routes
- User-specific data access
- SQL injection protection
- CORS configuration with credentials support

## License
