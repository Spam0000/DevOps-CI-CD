Write-Host "[1/4] Healthcheck" -ForegroundColor Cyan
$health = Invoke-RestMethod -Method Get -Uri "http://localhost:3000/health"
$health | ConvertTo-Json -Depth 5

Write-Host "[2/4] Creation d'une tache" -ForegroundColor Cyan
$created = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/tasks" -ContentType "application/json" -Body '{"description":"Verification matin J2","status":"todo"}'
$created | ConvertTo-Json -Depth 5

Write-Host "[3/4] Lecture de la tache" -ForegroundColor Cyan
$read = Invoke-RestMethod -Method Get -Uri ("http://localhost:3000/api/tasks/" + $created.id)
$read | ConvertTo-Json -Depth 5

Write-Host "[4/4] Suppression de la tache" -ForegroundColor Cyan
Invoke-RestMethod -Method Delete -Uri ("http://localhost:3000/api/tasks/" + $created.id)
Write-Host "Termine." -ForegroundColor Green
