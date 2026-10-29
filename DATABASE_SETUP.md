# 🔍 MySQL Database Setup Guide

Follow this guide to connect the SkillBridge platform to your local MySQL environment.

---

## 1. Initialize the Database 🏛️
Before running the application, you must create the schema and populate it with initial data.

1.  Open **MySQL Workbench**.

2.  Open the File -> Open SQL Script... and select the **`database_setup.sql`** (located in  the root of this project).
3.  Click the **Lightning Bolt (⚡)** icon to execute the entire script.
4.  **Refresh** your schemas sidebar—you should now see the `skillbridge` database with 12 tables inside.
---

## 2. Configure Your Connection 🔧
Each developer has a different MySQL password. You must update the project to use yours.

1.  Navigate to: `backend/src/main/resources/application.properties`
2.  Find the line: `spring.datasource.password=Shivam2706`
3.  **Replace** `Shivam2706` with your own local MySQL root password:

```properties
# Example: If your password is "abc123"
spring.datasource.password=abc123

# Example: If you have NO password
spring.datasource.password=
```

---

## 3. Verify the Connection ✅
1.  Open your terminal in the **`/backend`** folder.
2.  Run the command: `./mvnw spring-boot:run`
3.  If you see the message: **`Started BackendApplication in X seconds`**, your database is successfully connected!

---

## 4. Test the Admin Dashboard 👤
Once the backend is connected, you can verify the data by logging in with the default Admin node:

- **Login URL**: `http://localhost:3000/login`
- **Email**: `skillbridgeadmin@gmail.com`
- **Password**: `Shivam2706`

> [!TIP]
> If you pull new changes from GitHub and the Admin Dashboard shows "0 Members," simply **logout and log back in** to refresh your security token!
