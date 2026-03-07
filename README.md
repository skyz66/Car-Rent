# Car Rental Agency MVP

This repository contains:
- `database/car_rental_agency.sql` (MySQL schema + seed data)
- `backend/` (PHP 8.x REST API with JWT)
- `frontend/` (Angular + Angular Material)

## Quick Start

### 1) Database
Import the SQL file in phpMyAdmin:
- `database/car_rental_agency.sql`

Ensure your MySQL database is named `car_rental_agency` (or update `.env`).

### 2) Backend (PHP 8.x)
From `backend/`:

```bash
composer install
copy .env.example .env
php -S localhost:8000 -t public
```

Edit `backend/.env` with your DB credentials and set a strong `JWT_SECRET`.

### 3) Frontend (Angular)
From `frontend/`:

```bash
npm install
ng serve
```

The frontend expects the API at `http://localhost:8000/api`.

## API Response Shape
All endpoints return:

```json
{
  "success": true,
  "data": { }
}
```

On error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Example API Calls

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@mail.com","password":"secret123","licence_issue_date":"2020-01-01"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrental.local","password":"<your-password>"}'
```

### List cars
```bash
curl http://localhost:8000/api/cars
```

### Check availability
```bash
curl "http://localhost:8000/api/cars/1/availability?start=2026-03-10%2009:00:00&end=2026-03-12%2010:00:00"
```

### Create rental (customer)
```bash
curl -X POST http://localhost:8000/api/rentals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"car_id":1,"start_date":"2026-03-10 09:00:00","end_date":"2026-03-12 10:00:00"}'
```

### Confirm rental (admin)
```bash
curl -X PATCH http://localhost:8000/api/rentals/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"status":"confirmed"}'
```

### Generate contract (admin)
```bash
curl -X POST http://localhost:8000/api/rentals/1/documents/contract \
  -H "Authorization: Bearer <TOKEN>"
```

## Backend Structure

```
backend/
  public/
    index.php
    .htaccess
  src/
    Controllers/
    Middleware/
    Services/
    Utils/
    Auth.php
    AuthContext.php
    Config.php
    Database.php
    Response.php
    Router.php
  storage/
    documents/
  composer.json
  .env.example
```

## Implementation Phases (target: March 8, 2026)

1. Phase 1: Auth + cars list + rental create with availability + licence rule
2. Phase 2: My rentals + admin rentals status + dashboard
3. Phase 3: Reclamations + documents PDFs
4. Phase 4: Polish (UI + validations + performance)

## Notes
- Availability overlap logic:
  `start_date < requested_end AND end_date > requested_start` with status in `pending/confirmed/ongoing`.
- Licence rule at rental creation:
  `licence_issue_date <= CURDATE() - INTERVAL 2 YEAR`.
- Passwords are hashed using bcrypt.

If you want me to adjust existing SQL seed data or add known admin credentials, tell me which email/password you want and I will update the SQL file.
