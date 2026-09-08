# Employee Management Portal Test Report

Date: 2026-09-07

## Automated checks

| Check | Result |
| --- | --- |
| TypeScript `npm.cmd run typecheck` | Passed |
| Vite production build `npm.cmd run build` | Passed |
| Spring Boot `mvnw.cmd test` | Passed |
| Live POST `/api/employees` | Passed, returned created employee id |
| Live GET `/api/employees/{id}` | Passed, returned created employee |
| Live PUT `/api/employees/{id}` | Passed, returned updated job title |
| Live DELETE `/api/employees/{id}` | Passed, returned HTTP 204 |
| Browser load at `http://localhost:5173/` | Passed |

## Manual UI coverage

- Employee list loads from the Spring Boot API.
- Search filters by name, email, or job title.
- Department select filters the table.
- Add employee dialog validates required fields, email, phone, salary, and joining date.
- Edit employee dialog sends a PUT request and refreshes the list.
- Delete confirmation sends a DELETE request and refreshes the list.
- Loading, empty, API error, success snackbar, and responsive states are implemented.

## Notes

- The build reports a non-blocking bundle-size warning because Material UI is included in the initial bundle.
- The Vite dev proxy requires the backend to be running on port 8080.
- H2 is in-memory, so backend data resets when the Spring Boot process restarts.
