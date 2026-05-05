Employee Feedback App

A full-stack web application to manage employees, reviews, and feedback with secure authentication.

Features

* Add / Delete Employees
* Create / Delete Reviews
* Assign Reviews to Employees
* Submit Feedback (Rating + Comment)
* View Feedback List
* Secure Login System (JWT आधारित authentication)
* Protected APIs (Unauthorized users cannot access data)

Tech Stack

Frontend

* React.js
* Axios
* CSS (Inline styling)

Backend

* Node.js
* Express.js

Database

* Microsoft SQL Server (SSMS)
* mssql package

Security

* JWT (JSON Web Token)
* bcrypt (Password hashing)

Security Implemented

* Passwords are hashed using **bcrypt**
* Login generates a **JWT token**
* All APIs are **protected using middleware**
* Token is required in every request
* Unauthorized access is blocked

Setup Instructions

Backend Setup

```bash
cd backend
npm install
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

Database Setup (SSMS)

Create database:

```sql
CREATE DATABASE feedback_app;
USE feedback_app;
```

Employees Table

```sql
CREATE TABLE employees (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

Reviews Table

```sql
CREATE TABLE reviews (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(100),
  description VARCHAR(255),
  assigned_to INT
);
```

Feedback Table

```sql
CREATE TABLE feedback (
  id INT IDENTITY(1,1) PRIMARY KEY,
  review_id INT,
  reviewer_id INT,
  comment VARCHAR(255),
  rating INT
);
```

Users Table (for login)

```sql
CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255)
);
```

---

Authentication Flow

1. Register user → password gets hashed
2. Login → JWT token generated
3. Token sent in headers for every request:

```
Authorization: <token>
```

4. Backend verifies token before allowing access

---

Login Credentials (Sample)

You must register first OR insert manually:

Example:

```
Email: aryan@gmail.com
Password: 12345
```

---

API Endpoints

Auth

* POST `/register`
* POST `/login`

Employees

* GET `/employees`
* POST `/employees`
* DELETE `/employees/:id`

Reviews

* GET `/reviews`
* POST `/reviews`
* DELETE `/reviews/:id`

Feedback

* GET `/feedback`
* POST `/feedback`
* DELETE `/feedback/:id`

---

UI Highlights

* Clean dashboard layout
* Employee → Review → Feedback flow
* Auto employee selection in feedback
* Delete buttons for all entities

---

Notes

* Email validation enforced (`@gmail.com`)
* Reviews are linked to employees
* Feedback is linked to reviews
* Deleting employee removes related reviews

---

Future Improvements

* Role-based access (Admin/User)
* Better UI (Material UI / Tailwind)
* Pagination & Search
* Deployment (AWS / Render)

---

Conclusion

This project demonstrates:

* Full-stack development skills
* Secure authentication implementation
* Clean UI + structured logic
* Real-world data relationships