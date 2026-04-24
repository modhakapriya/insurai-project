# InsurAI Backend

## Setup
1. cd insurai-backend
2. npm install
3. copy .env.example to .env and adjust if needed
4. npm run dev

## Default user
- Email: admin@insurai.com
- Password: admin123

## Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/policies
- POST /api/policies
- PUT /api/policies/:id
- DELETE /api/policies/:id
- GET /api/claims
- POST /api/claims
- PUT /api/claims/:id
- DELETE /api/claims/:id
- GET /api/documents
- POST /api/documents
- PUT /api/documents/:id
- DELETE /api/documents/:id
- GET /api/analytics
- GET /api/risk
- GET /api/fraud
- POST /api/assistant/chat

Use `Authorization: Bearer <token>` for all endpoints except /api/auth/* and /api/health.

## Quick Test (PowerShell)
1. Login and store token:
```powershell
$body = @{ email = 'admin@insurai.com'; password = 'admin123' } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -ContentType 'application/json' -Body $body).token
```

2. Create a policy:
```powershell
$policy = @{
  holder = 'Jane Smith'
  type = 'Property Insurance'
  premium = '$320/mo'
  coverage = '$350,000'
  status = 'Active'
  riskScore = '4.1/10'
  aiRecommendation = 'Standard'
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/policies -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $policy
```

3. Create a claim:
```powershell
$claim = @{
  claimant = 'Jane Smith'
  type = 'Property'
  amount = '$4,200'
  status = 'Pending'
  aiConfidence = '90%'
  submitted = '2026-03-18'
  processing = 'Under review'
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/claims -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $claim
```

4. Create a document:
```powershell
$doc = @{
  name = 'inspection_report_smith.pdf'
  category = 'Inspection'
  size = '1.2 MB'
  timestamp = '2026-03-18 10:30'
  status = 'Processed'
  confidence = '97%'
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/documents -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $doc
```
