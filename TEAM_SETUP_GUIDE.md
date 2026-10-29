# 🚀 SkillBridge Team Setup Guide

Welcome to the project! Follow these steps to get the application running on your local system.

## 1. Prerequisites
Ensure you have the following installed:
- **Java JDK 21+**
- **Node.js v18+**
- **MySQL Server 8.0+**
- **MySQL Workbench**

---

## 2. Database Configuration (CRITICAL)

To make the app connect to your database, you must follow these steps:

1.  **Execute Setup Script**: 
    - Open MySQL Workbench.
    - Open the `database_setup.sql` file from the project root.
    - Run the entire script (Lightning Bolt icon). This creates the `skillbridge` database and adds default users/courses.

2.  **Update Your Password**:
    - Open `backend/src/main/resources/application.properties`.
    - Change `spring.datasource.password=Shivam2706` to your **own** MySQL root password.

---

## 3. Running the Project

### A. Start the Backend
1.  Open a terminal in the `/backend` folder.
2.  Run: `./mvnw spring-boot:run` (or `mvn spring-boot:run` if you have Maven installed).
3.  The server should start on `http://localhost:8080`.

### B. Start the Frontend
1.  Open a terminal in the `/frontend` folder.
2.  Run: `npm install` (first time only).
3.  Run: `npm start`.
4.  The app will open in your browser at `http://localhost:3000`.

---

## 4. Default Login (For Testing)
You can log in immediately using the Admin node created in the setup script:

- **Email**: `skillbridgeadmin@gmail.com`
- **Password**: `Shivam2706`

---

## 5. Troubleshooting
- **401 Unauthorized**: If you see this in the Admin Dashboard, log out and log back in.
- **Port 8080 already in use**: Make sure no other Spring Boot instance is running.
- **CORS Errors**: Ensure the backend is actually running before trying to use the frontend.
