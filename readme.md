# Task Manager API

A RESTful API for managing tasks with support for status tracking, priorities, and task organization.

## Features

- Create, read, update, and delete tasks
- Filter tasks by status and priority
- Track task progress (not-started, in-progress, completed)
- Set task priorities (high, low, minimal)
- MySQL database integration

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
npm install express mysql2 cors dotenv
npm install nodemon --save-dev
```

3. Create database using MySQL:

```sql
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('not-started', 'in-progress', 'completed') DEFAULT 'not-started',
    date DATE NOT NULL,
    priority ENUM('high', 'low', 'minimal') DEFAULT 'low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
```

5. Start the server:

```bash
npm run dev
```

## API Endpoints

### Tasks

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/api/tasks`                    | Get all tasks         |
| GET    | `/api/tasks/:id`                | Get a single task     |
| POST   | `/api/tasks`                    | Create a new task     |
| PUT    | `/api/tasks/:id`                | Update a task         |
| DELETE | `/api/tasks/:id`                | Delete a task         |
| GET    | `/api/tasks/status/:status`     | Get tasks by status   |
| GET    | `/api/tasks/priority/:priority` | Get tasks by priority |

### Request/Response Examples

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
    "title": "Organize Digital Files",
    "description": "Sort and organize files across devices",
    "priority": "low"
}
```

Response:

```json
{
  "id": "1",
  "title": "Organize Digital Files",
  "description": "Sort and organize files across devices",
  "status": "not-started",
  "date": "January 28, 2025",
  "priority": "low"
}
```

#### Update Task

```http
PUT /api/tasks/1
Content-Type: application/json

{
    "status": "in-progress",
    "priority": "high"
}
```

#### Get Tasks by Status

```http
GET /api/tasks/status/in-progress
```

#### Get Tasks by Priority

```http
GET /api/tasks/priority/high
```

## Project Structure

```
task-manager-api/
├── config/
│   └── db.js
├── controllers/
│   └── taskController.js
├── routes/
│   └── taskRoutes.js
├── .env
├── server.js
├── package.json
└── README.md
```

## Testing with Insomnia

1. Create a new Collection for Task Manager
2. Import these example requests:
   - GET All Tasks: `GET http://localhost:5000/api/tasks`
   - Create Task: `POST http://localhost:5000/api/tasks`
   - Update Task: `PUT http://localhost:5000/api/tasks/1`
   - Delete Task: `DELETE http://localhost:5000/api/tasks/1`
   - Get by Status: `GET http://localhost:5000/api/tasks/status/not-started`
   - Get by Priority: `GET http://localhost:5000/api/tasks/priority/high`

## Error Handling

The API includes error handling for:

- Database connection issues
- Invalid request data
- Resource not found
- Server errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
