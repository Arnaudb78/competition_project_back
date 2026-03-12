# Mirokaï Experience — API Backend

API REST du projet Mirokaï Experience, construite avec **NestJS 11**, **MongoDB** (Mongoose) et **AWS S3**.

Elle est consommée par les 3 frontends du projet :
- [`competition-front-visitor`](https://github.com/Arnaudb78/competition_project_back) — parcours visiteur mobile (PWA)
- `front-admin-mirokai` — interface d'administration
- `competition-front-game` — mini-jeu en salle

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       NestJS API                         │
│                  Préfixe global : /api                   │
│                                                          │
│  /api/auth          → Authentification (admin + compte)  │
│  /api/accounts      → Comptes membres                    │
│  /api/modules       → Modules d'exposition               │
│  /api/groups        → Groupes visiteurs & scores         │
│  /api/challenges    → Défis + completions                │
│  /api/events        → Événements                         │
│  /api/replays       → Vidéos replay                      │
│  /api/clips         → Clips courts                       │
│  /api/questions     → Questions de quiz                  │
│  /api/upload        → Upload fichiers vers S3            │
│  /api/user          → Utilisateurs admin                 │
└──────────────┬───────────────────────┬───────────────────┘
               │                       │
          MongoDB Atlas             AWS S3
          (données)                 (médias)
```

### Deux types d'authentification

| Guard | Usage |
|---|---|
| `JwtAccountGuard` | Membres (app visiteur) — token via `/auth/account/signin` |
| `JwtAuthGuard` | Admins — token via `/auth/signin` |

---

## Prérequis

- **Node.js** 20+
- **pnpm** — `npm install -g pnpm`
- Un cluster **MongoDB** (Atlas ou local)
- Un bucket **AWS S3** avec un utilisateur IAM

---

## Installation

```bash
git clone https://github.com/Arnaudb78/competition_project_back
cd back-project
pnpm install
```

---

## Configuration

```bash
cp .env.example .env
```

```env
# Serveur
PORT=3001
JWT_SECRET=un_secret_long_et_aleatoire

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mirokai

# AWS S3
AWS_REGION=eu-west-3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_MEDIA_BUCKET=nom-du-bucket-s3
```

> Le bucket S3 doit avoir une politique publique en lecture pour que les URLs des médias fonctionnent.

---

## Lancer en développement

```bash
pnpm start:dev
```

L'API tourne sur `http://localhost:3001/api`

---

## Routes de l'API

### Authentification — `/api/auth`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signin` | Non | Connexion admin → JWT |
| `POST` | `/auth/account/signin` | Non | Connexion membre → JWT |
| `POST` | `/auth/account/signup` | Non | Inscription membre |

### Comptes membres — `/api/accounts`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/accounts` | Non | Créer un compte |
| `GET` | `/accounts/me` | Compte | Profil connecté |
| `PATCH` | `/accounts/me` | Compte | Modifier profil / mot de passe |

### Modules d'exposition — `/api/modules`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/modules` | Non | Liste des modules visibles |
| `GET` | `/modules/all` | Admin | Tous les modules |
| `GET` | `/modules/:id` | Non | Détail d'un module |
| `POST` | `/modules` | Admin | Créer un module |
| `PATCH` | `/modules/reorder` | Admin | Réordonner les modules |
| `PATCH` | `/modules/:id` | Admin | Modifier un module |
| `DELETE` | `/modules/:id` | Admin | Supprimer un module |
| `PATCH` | `/modules/:id/questions` | Admin | Ajouter une question |
| `DELETE` | `/modules/:id/questions/:ageGroup` | Admin | Supprimer une question |

### Groupes visiteurs — `/api/groups`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/groups` | Non | Créer un groupe (participants + âges) |
| `GET` | `/groups/:id` | Non | Récupérer un groupe et ses scores |
| `PATCH` | `/groups/:id/score` | Non | Ajouter des points à un participant |
| `PATCH` | `/groups/:id/module` | Non | Marquer un module comme visité |
| `PATCH` | `/groups/:id/end` | Non | Terminer la visite |

### Challenges — `/api/challenges`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/challenges` | Non | Liste des challenges visibles |
| `GET` | `/challenges/all` | Admin | Tous les challenges |
| `GET` | `/challenges/:id` | Non | Détail d'un challenge |
| `POST` | `/challenges` | Admin | Créer un challenge |
| `PATCH` | `/challenges/:id` | Admin | Modifier un challenge |
| `DELETE` | `/challenges/:id` | Admin | Supprimer un challenge |
| `POST` | `/challenges/:id/questions` | Admin | Ajouter une question |
| `DELETE` | `/challenges/:id/questions/:index` | Admin | Supprimer une question |
| `GET` | `/challenges/completions` | Compte | Mes completions |
| `POST` | `/challenges/:id/complete` | Compte | Terminer un challenge (score + trophées) |

> La logique des trophées est incrémentale : seule l'amélioration du meilleur score personnel génère des trophées (`delta = max(0, newScore - bestScore)`).

### Événements — `/api/events`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/events` | Non | Liste des événements visibles |
| `GET` | `/events/admin/all` | Admin | Tous les événements |
| `GET` | `/events/:id` | Non | Détail d'un événement |
| `POST` | `/events` | Admin | Créer un événement |
| `PATCH` | `/events/:id` | Admin | Modifier un événement |
| `DELETE` | `/events/:id` | Admin | Supprimer un événement |
| `POST` | `/events/:id/register` | Compte | S'inscrire / se désinscrire |

### Replays — `/api/replays`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/replays` | Non | Liste des replays |
| `GET` | `/replays/:id` | Non | Détail d'un replay |
| `POST` | `/replays` | Admin | Créer un replay |
| `PATCH` | `/replays/:id` | Admin | Modifier un replay |
| `DELETE` | `/replays/:id` | Admin | Supprimer un replay |
| `POST` | `/replays/:id/comment` | Compte | Commenter un replay |

### Clips — `/api/clips`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/clips` | Non | Liste des clips |
| `GET` | `/clips/:id` | Non | Détail d'un clip |
| `POST` | `/clips` | Admin | Créer un clip |
| `PATCH` | `/clips/:id` | Admin | Modifier un clip |
| `DELETE` | `/clips/:id` | Admin | Supprimer un clip |
| `PATCH` | `/clips/:id/like` | Compte | Liker un clip |

### Questions — `/api/questions`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/questions` | Admin | Liste toutes les questions |
| `GET` | `/questions/:id` | Admin | Détail d'une question |
| `POST` | `/questions` | Admin | Créer une question |
| `PATCH` | `/questions/:id` | Admin | Modifier une question |
| `DELETE` | `/questions/:id` | Admin | Supprimer une question |

### Upload — `/api/upload`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/upload/:folder/presign` | Non | URL pré-signée S3 (upload direct) |
| `POST` | `/upload/:folder` | Non | Upload via le serveur |

> `:folder` peut être `images`, `videos`, `audios`, etc.

### Utilisateurs admin — `/api/user`
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user` | Admin | Créer un admin |
| `GET` | `/user` | Admin | Liste des admins |
| `GET` | `/user/:id` | Admin | Détail d'un admin |
| `PATCH` | `/user/:id` | Admin | Modifier un admin |
| `DELETE` | `/user/:id` | Admin | Supprimer un admin |

---

## Structure du projet

```
src/
├── modules/
│   ├── account/       → Comptes membres (signup, profil, update)
│   ├── auth/          → JWT admin + compte, stratégies Passport
│   ├── challenge/     → Challenges + completions + trophées
│   ├── clip/          → Clips courts (likes)
│   ├── event/         → Événements (inscription participants)
│   ├── group/         → Groupes visiteurs & scores de visite
│   ├── module/        → Modules d'exposition (plan interactif)
│   ├── question/      → Questions de quiz (modules & challenges)
│   ├── replay/        → Vidéos replay (commentaires)
│   ├── upload/        → Upload S3 (presign + direct)
│   └── user/          → Utilisateurs admin
└── main.ts            → Bootstrap NestJS (port 3001, préfixe /api)
```

---

## Build & production

```bash
pnpm build
pnpm start:prod
```

### Variables d'environnement en production

```env
PORT=3001
JWT_SECRET=<secret_de_production>
MONGODB_URI=mongodb+srv://...
AWS_REGION=eu-west-3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_MEDIA_BUCKET=...
```

> En production, s'assurer que le bucket S3 autorise les requêtes CORS depuis les domaines des frontends.
