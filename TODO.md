# Neural Bridge Nexus (SkillBridge) - Complete Setup & Developer Guide

This guide contains the full instructions to set up, install, and run the SkillBridge platform on any system. No previous setup is required as long as you follow these steps carefully.

---

## 🛠️ Step 1: Install Required Technologies
Before running the code, you must install the three pillars of our platform:

### 1. Java Development Kit (JDK 17+)
- **Purpose**: Runs the backend server (Spring Boot).
- **Download**: [Download OpenJDK 17+](https://adoptium.net/temurin/releases/?version=17)
- **Verification**: Open terminal and type `java -version`. You should see `17` or higher.

### 2. Node.js & npm
- **Purpose**: Runs the frontend interface (React).
- **Download**: [Download Node.js LTS](https://nodejs.org/en/download/)
- **Verification**: Open terminal and type `node -v` and `npm -v`.

### 3. MySQL Server (8.0+)
- **Purpose**: Stores all users, courses, messages, and reviews.
- **Download**: [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/)
- **Setup**: Note down your **root password** during installation (Default: `Shivam2706`).

---

## 📂 Step 2: Project Structure
The project is divided into two main folders:
- `/backend`: The Spring Boot API (Java).
- `/frontend`: The React User Interface (Javascript).

---

## 🚀 Step 3: Running the Project (Step-by-Step)

### Phase A: Database Preparation
1.  Open **MySQL Workbench** or any SQL terminal.
2.  Run this command to create the database:
    ```sql
    CREATE DATABASE skillbridge;
    ```
3.  Check settings in `backend/src/main/resources/application.properties`:
    - Ensure `spring.datasource.password` matches your MySQL root password.

### Phase B: Launching the Backend
1.  Open a terminal and navigate to the `backend` folder: `cd backend`
2.  Run the Maven wrapper to start the server:
    - **Windows**: `./mvnw spring-boot:run`
    - **Linux/Mac**: `chmod +x mvnw && ./mvnw spring-boot:run`
3.  **Wait** until you see: `Started BackendApplication in XX seconds`.

### Phase C: Launching the Frontend
1.  Open a **NEW** separate terminal and navigate to the `frontend` folder: `cd frontend`
2.  Install dependencies (only needed the first time):
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
    - **Note (Windows Security Error)**: If `npm start` fails with a "script disabled" error, use:
      `powershell -ExecutionPolicy Bypass -Command "npm start"`

---

## 🤖 Core Technologies Used
Here are the "engines" that power the site:
- **WebSocket (STOMP)**: Enables real-time chat without refreshing the page.
- **JWT (JSON Web Tokens)**: Securely keeps you logged in across different pages.
- **Spring Data JPA (Hibernate)**: Automatically manages the MySQL database tables.
- **AI Integration (Groq API)**: Powers the chatbot logic for skill recommendations.

---

## 🔑 Default Admin Account
- **Email**: `skillbridgeadmin@gmail.com`
- **Password**: `Shivam2706`

---

## 📋 Ongoing Development (TODO List)
- [x] Persistent Course Review System (Verified)
- [x] Real-time WebSocket Messaging (Verified)
- [ ] AI Learning Path Recommendation Engine (Phase 4)
- [ ] Stripe Payment Gateway Integration (Phase 5)
- [ ] Multi-language Support for Global Students
