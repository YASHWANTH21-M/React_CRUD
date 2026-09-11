# PeopleOS Employee Management Portal

A responsive React + TypeScript employee management portal backed by the Spring Boot service in `D:\Employee_Management`.

## Stack

- React 19 + TypeScript
- Vite
- Axios
- Material UI
- Spring Boot, REST, JPA, H2

## Run end to end

1. Start the backend:

   ```powershell
   Set-Location D:\Employee_Management
   .\mvnw.cmd spring-boot:run
   ```

2. Start the frontend in another terminal:

   ```powershell
   Set-Location D:\FrontEnd
   npm.cmd install
   npm.cmd run dev
   ```

3. Open http://localhost:5173/.

The Vite development proxy forwards `/api/*` to `http://localhost:8080`.

## Frontend commands

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

## API contract

- `GET /api/employees` - list employees
- `GET /api/employees/{id}` - get one employee
- `POST /api/employees` - create an employee
- `PUT /api/employees/{id}` - update an employee
- `DELETE /api/employees/{id}` - delete an employee

The form validates required fields, email format, ten-digit phone numbers, positive salary, and joining date. Backend validation and duplicate-email messages are shown in the UI.



## Backend verification

From `D:\Employee_Management`:

```powershell
.\mvnw.cmd test
```
