# Partie 2 - Aprem

Ce dossier contient la partie apres-midi de J2, basee sur:

- `partie2_cicd_et_devops.pdf`

## Objectif

Centraliser les livrables d'apres-midi autour de la partie CI/CD et exploitation DevOps.

## Contenu du dossier

- `README.md`: vue d'ensemble et execution
- `ACTIONS.md`: trace des actions realisees
- `ci-cd-checklist.md`: checklist de verification CI/CD
- `partie2_cicd_et_devops.pdf`: sujet/support

## Run du projet

Le projet applicatif est dans `J1/`.

Depuis `J1/`:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps
```

Healthcheck API:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/health
```

Arret:

```powershell
docker compose down
```

Reset complet:

```powershell
docker compose down -v
```

## Suite de travail conseillee

1. Appliquer la checklist `ci-cd-checklist.md`.
2. Verifier build, tests, et deploiement local Docker.
3. Documenter les resultats dans `ACTIONS.md`.
