# InsurAI Java Backend

Spring Boot backend that mirrors the existing Node.js API shape used by `insurai-react`.

## Stack

- Java 17
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- H2 file database
- JWT auth

## Implemented endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET/POST/PUT/DELETE /api/policies`
- `GET/POST/PUT/DELETE /api/claims`
- `GET/POST/PUT/DELETE /api/documents`
- `POST /api/ai/policy-recommendation`
- `POST /api/assistant/chat`
- `GET /api/analytics`
- `GET /api/risk`
- `GET /api/fraud`

## Default login

- Email: `admin@insurai.com`
- Password: `admin123`

## Run

You need Maven installed on this machine first.

```powershell
cd "c:\Users\Admin\Videos\Captures - Copy\insurai-backend-java"
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Notes

- This Java backend was scaffolded to replace the current Node backend gradually.
- The frontend has not been switched automatically; it will work against this backend because the API paths are the same.
- The AI policy recommendation route currently uses Java fallback logic rather than a live model call.
