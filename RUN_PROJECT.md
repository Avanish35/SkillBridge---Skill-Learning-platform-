# 🚀 How to Run SkillBridge Locally

SkillBridge is a full-stack application. You must run both the **Backend** (Spring Boot) and the **Frontend** (React) simultaneously.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed and running:

1.  **MySQL Server:** 
    *   The backend requires a MySQL database at `localhost:3306`.
    *   Default Credentials (from `application.properties`): 
        *   **User:** `root`
        *   **Password:** `Shivam2706`
    *   The database `skillbridge` will be created automatically if it doesn't exist.
2.  **Java JDK 17+:** (I am using JDK 25.0.2).
3.  **Node.js & npm:** For the frontend.

---

## 🔧 Step-by-Step Execution

### Step 1: Start the Backend (Java / Spring Boot)

1.  Open a new terminal in VS Code pointing to the `backend` folder.
2.  Run the application using the Maven wrapper:

    **Windows (PowerShell/CMD):**
    ```powershell
    .\mvnw.cmd spring-boot:run
    ```

    **Mac/Linux/Git Bash:**
    ```bash
    ./mvnw spring-boot:run
    ```

    *Wait until you see `Started BackendApplication` in the logs. The backend runs on `http://localhost:8080`.*

> [!IMPORTANT]
> **If you see a `JAVA_HOME` error:**
> You must set the `JAVA_HOME` environment variable to your JDK path.
> 
> **Windows Example (PowerShell):**
> ```powershell
> $env:JAVA_HOME="C:\Program Files\Java\jdk-25.0.2"
> .\mvnw.cmd spring-boot:run
> ```

---

### Step 2: Start the Frontend (React)

1.  Open a **second** new terminal in VS Code pointing to the `frontend` folder.
2.  (Optional) Install dependencies if this is your first time:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

    *Your browser will automatically open to `http://localhost:3000`.*

---

## 🛑 How to Stop the Project

To stop the servers, go to each terminal window and press:
**`Ctrl + C`** (and type `Y` if prompted).

## 💡 Troubleshooting
*   **Port Conflicts:** If you get an error that port 8080 or 3000 is already in use, find and kill the process or restart your editor.
*   **Database Connection:** Ensure your MySQL service is running. You can check this in Windows Services (MySQL80).
