# Checklist CI/CD - J2 Aprem

## Build

- [ ] Build image API: `docker compose build api`
- [ ] Build image stats: `docker compose build stats`
- [ ] Aucun echec de build

## Execution locale

- [ ] `docker compose up -d`
- [ ] Services `api`, `db`, `stats` en etat running
- [ ] Healthcheck API OK

## Qualite fonctionnelle

- [ ] Creation de tache (POST)
- [ ] Lecture liste (GET)
- [ ] Mise a jour (PUT)
- [ ] Suppression (DELETE)

## Robustesse

- [ ] Erreur 400 sur JSON invalide
- [ ] Erreur 404 sur id inexistant
- [ ] Validation description trop longue

## Persistance et services

- [ ] Persistance PostgreSQL apres restart
- [ ] Logs stats periodiques valides

## Nettoyage

- [ ] `docker compose down`
- [ ] Optionnel: `docker compose down -v`
