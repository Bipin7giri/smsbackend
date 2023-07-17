# School Management System

This is a School Management System built using Node.js, Express.js, TypeScript, MongoDB, and PostgreSQL with TypeORM. The system is designed to manage various aspects of a school, including user roles such as Admin, Head of Department (HOD), Teacher, Student, and Accountant.

## Requirements

To run this application, you need to have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB
- PostgreSQL

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/school-management-system.git
cd school-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the necessary configuration variables:

```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/school_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=school_db
```

4. Run the application:

```bash
npm start
```

The server should now be running at `http://localhost:3000`.

## Database

This system uses both MongoDB and PostgreSQL for different functionalities.

- MongoDB: Used for storing general school-related information and student/teacher details.
- PostgreSQL: Used for financial and accounting data.

Ensure that you have both MongoDB and PostgreSQL services running before starting the application.

## Endpoints

The API provides the following endpoints:

1. Authentication
   - POST `/api/auth/register`: Register a new user with appropriate roles (Admin, HOD, Teacher, Student, Accountant).
   - POST `/api/auth/login`: Authenticate users and receive a JWT token for authorization.

2. Admin (Authentication required)
   - GET `/api/admin/users`: Get a list of all users in the system.
   - PUT `/api/admin/users/:userId`: Update user information.
   - DELETE `/api/admin/users/:userId`: Delete a user from the system.

3. Head of Department (HOD) (Authentication required)
   - GET `/api/hod/teachers`: Get a list of all teachers under this HOD's department.

4. Teacher (Authentication required)
   - GET `/api/teacher/students`: Get a list of all students assigned to this teacher.

5. Student (Authentication required)
   - GET `/api/student/courses`: Get a list of courses enrolled by this student.

6. Accountant (Authentication required)
   - GET `/api/accountant/payments`: Get a list of all financial transactions and payments.

## Authentication and Authorization

- Authentication is implemented using JWT (JSON Web Tokens). Users will receive a token upon successful login, which they must include in the Authorization header for protected endpoints.

- Authorization is managed through user roles. Each user role has access to specific endpoints based on their permissions.

## Database Models

The system uses the following database models:

1. User: Stores user information including name, email, password hash, and role.
2. Department: Represents different departments in the school.
3. Teacher: Stores teacher-specific details and their assigned department.
4. Student: Stores student-specific details and their enrolled courses.
5. Course: Represents the courses offered by the school.
6. Payment: Stores financial transactions and payment details.


---
_Replace `your-username` in the Setup section with your GitHub username or the repository URL where the code is hosted._
