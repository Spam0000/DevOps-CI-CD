# Partie 2 - Matin

Ce dossier contient la partie matin de J2, basee sur le PDF:

- `partie2_exercice_matin.pdf`

## Ce qui a ete fait

- Preparation d'une documentation claire pour executer le projet.
- Ajout d'un script de verification rapide pour valider l'API.
- Ajout d'un resume des etapes pour tracer le travail realise.

## Projet a lancer

Le projet applicatif est dans `J1/`.

### Prerequis

- Docker Desktop
- Docker Compose
- PowerShell (Windows)

### Lancer le projet

Depuis le dossier `J1/`:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps
```

### Verifier que l'API repond

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/health
```

Reponse attendue: un JSON contenant `status: ok`.

### Arreter le projet

```powershell
docker compose down
```

### Reset complet des donnees

```powershell
docker compose down -v
```

## Verification rapide

Un script est fourni dans ce dossier:

- `quick-check.ps1`

Il effectue:

- healthcheck
- creation d'une tache
- lecture de la tache creee
- suppression de la tache

Execution:

```powershell
./quick-check.ps1
```
