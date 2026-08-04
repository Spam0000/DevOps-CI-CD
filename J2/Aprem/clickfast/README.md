# ClickFast

[![CI](https://github.com/Spam0000/DevOps-CI-CD/actions/workflows/clickfast-ci.yml/badge.svg)](https://github.com/Spam0000/DevOps-CI-CD/actions/workflows/clickfast-ci.yml)

Jeu de clics en HTML/CSS/JS, servi par nginx, teste et buildé par GitHub Actions.

## Lancement local (sans Docker)

Ouvre `src/index.html` dans un navigateur.

## Lancement avec Docker

```bash
docker build -t clickfast .
docker run --rm -p 8080:80 clickfast
```

Ouvre http://localhost:8080

## Tests

```bash
npm install
npm test
```

## Pipeline CI

A chaque push ou pull request :

1. `test` : installe les dependances et lance jest
2. `build` : construit l'image Docker (si test vert)

La pipeline bloque le build si un test echoue.
