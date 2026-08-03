# Todo API - Fil Rouge DevOps CI/CD

## Objectif

Ce projet implemente une stack complete:

- API REST CRUD de taches en Node.js
- base PostgreSQL persistante
- service Python de stats connecte a la meme base
- orchestration Docker Compose
- configuration 100% via variables d'environnement

## Arborescence

```text
J1/
|- src/
|  |- middleware/errorHandler.js
|  |- models/taskMemory.js
|  |- models/taskPg.js
|  |- models/taskRepository.js
|  |- routes/tasks.js
|  |- app.js
|  \- server.js
|- stats-service/
|  |- Dockerfile
|  |- requirements.txt
|  \- stats.py
|- Dockerfile
|- docker-compose.yml
|- .dockerignore
|- .env.example
|- .gitignore
|- package.json
\- README.md
```

## Prerequis

- Docker Desktop (mode Linux container)
- Docker Compose
- Git

## Configuration

Depuis le dossier J1, creer le fichier d'environnement local:

```powershell
Copy-Item .env.example .env
```

Variables principales:

- PORT: port HTTP expose par l'API
- USE_POSTGRES: true pour activer PostgreSQL
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- MAX_DESCRIPTION_LENGTH: taille max description
- STATS_INTERVAL_SECONDS: frequence des logs de stats

## Demarrage

```powershell
docker compose up -d --build
```

Verifier que tous les services sont UP:

```powershell
docker compose ps
```

Resultat attendu:

- api en etat running
- db en etat running/healthy
- stats en etat running

## Verification complete (pas a pas)

### 1. Healthcheck API

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/health
```

Attendu: un JSON avec status = ok.

### 2. Test CRUD complet

Creer une tache:

```powershell
$created = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType "application/json" -Body '{"description":"Faire le fil rouge","status":"todo"}'
$created
```

Lister les taches:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/tasks
```

Lire une tache par id:

```powershell
Invoke-RestMethod -Method Get -Uri ("http://localhost:3000/api/tasks/" + $created.id)
```

Modifier une tache:

```powershell
Invoke-RestMethod -Method Put -Uri ("http://localhost:3000/api/tasks/" + $created.id) -ContentType "application/json" -Body '{"status":"done"}'
```

Supprimer une tache:

```powershell
Invoke-RestMethod -Method Delete -Uri ("http://localhost:3000/api/tasks/" + $created.id)
```

Verifier suppression (doit rendre 404):

```powershell
try {
	Invoke-RestMethod -Method Get -Uri ("http://localhost:3000/api/tasks/" + $created.id)
} catch {
	$_.Exception.Response.StatusCode.value__
}
```

### 3. Robustesse erreurs

ID inexistant (attendu 404):

```powershell
try {
	Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/tasks/00000000-0000-0000-0000-000000000000"
} catch {
	$_.Exception.Response.StatusCode.value__
}
```

JSON malforme (attendu 400):

```powershell
try {
	Invoke-WebRequest -Method Post -Uri "http://localhost:3000/api/tasks" -ContentType "application/json" -Body '{"description":"bad json"'
} catch {
	$_.Exception.Response.StatusCode.value__
}
```

Description trop longue (attendu 400):

```powershell
$longDesc = "a" * 12000
$payload = @{ description = $longDesc; status = "todo" } | ConvertTo-Json
try {
	Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/tasks" -ContentType "application/json" -Body $payload
} catch {
	$_.Exception.Response.StatusCode.value__
}
```

### 4. Persistance PostgreSQL

1. Creer une tache.
2. Redemarrer la stack.
3. Verifier que la tache existe encore.

```powershell
$persisted = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType "application/json" -Body '{"description":"Doit survivre","status":"todo"}'
docker compose down
docker compose up -d
Invoke-RestMethod -Method Get -Uri ("http://localhost:3000/api/tasks/" + $persisted.id)
```

Attendu: la tache est toujours presente (volume pgdata fonctionnel).

### 5. Isolation reseau

La base ne doit pas etre exposee sur localhost:5432.

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

Attendu: TcpTestSucceeded = False.

### 6. Service Python de stats

```powershell
docker compose logs stats --tail 20
```

Attendu: lignes periodiques avec total et by_status.

## Arret et nettoyage

Arret:

```powershell
docker compose down
```

Arret + suppression volume (reset complet donnees):

```powershell
docker compose down -v
```

## Endpoints API

- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Format Task:

```json
{
	"id": "uuid",
	"description": "string",
	"status": "todo | in_progress | done",
	"createdAt": "timestamp",
	"updatedAt": "timestamp"
}
```

## Journal de bord

### Chapitre 1 - Socle CRUD

- routes CRUD implementees
- gestion d'erreurs centralisee
- validation entree ajoutee

### Chapitre 2 - Dockerfile production

- Dockerfile multi-stage
- base epinglee node:22-alpine
- utilisateur non-root
- .dockerignore actif

### Chapitre 3 - Persistance PostgreSQL

- table tasks creee au demarrage
- volume nomme pgdata
- donnees persistantes apres restart

### Chapitre 4 - Isolation reseau

- reseau backend dedie
- db non exposee sur l'hote

### Chapitre 5 - Configuration externalisee

- variables via .env
- .env ignore par Git
- .env.example versionne

### Chapitre 6 - Service Python

- service stats connecte a PostgreSQL
- affichage periodique des stats

### Chapitre 7 - Registry

- images prêtes a etre taggees et poussees

## Tableau metriques a remplir

| Metrique | API Node | Service Python |
| --- | --- | --- |
| Taille image | A mesurer | A mesurer |
| Temps build a froid | A mesurer | A mesurer |
| Temps build a chaud | A mesurer | A mesurer |
| Temps premiere reponse HTTP | A mesurer | N/A |
| Nombre de couches Dockerfile | A mesurer | A mesurer |

Commandes utiles:

```powershell
docker images
docker history j1-api
docker history j1-stats
docker compose build --no-cache
```

## Depannage rapide

Si Docker Desktop renvoie une erreur I/O sur metadata.db, redemarrer Docker Desktop puis relancer:

```powershell
docker compose down
docker compose up -d --build
```
