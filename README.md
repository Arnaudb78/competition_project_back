# Mirokaï Experience — API Backend

API REST du projet Mirokaï Experience, construite avec **NestJS**, **MongoDB** et **AWS S3**.

Elle est consommée par les 3 frontends du projet :
- `front-admin-mirokai` — interface d'administration
- `competition-front-visitor` — parcours visiteur mobile
- `competition-front-game` — jeu Phaser en salle

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  NestJS API                      │
│                                                 │
│  /api/auth      → Authentification admin (JWT)  │
│  /api/modules   → CRUD des modules              │
│  /api/upload    → Upload fichiers vers S3        │
│  /api/groups    → Groupes visiteurs & scores    │
└────────────┬────────────────┬───────────────────┘
             │                │
        MongoDB Atlas       AWS S3
        (données)          (médias)
```

---

## Prérequis

- **Node.js** 20+
- **pnpm** — `npm install -g pnpm`
- Un cluster **MongoDB** (Atlas ou local)
- Un bucket **AWS S3** avec un utilisateur IAM

---

## Installation

```bash
git clone <url-du-repo>
cd back-project
pnpm install
```

---

## Configuration

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Remplir les variables :

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

### Authentification
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Non | Connexion admin → retourne un JWT |

### Modules
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/modules` | Non | Liste tous les modules |
| `GET` | `/api/modules/:id` | Non | Détail d'un module |
| `POST` | `/api/modules` | JWT | Créer un module |
| `PATCH` | `/api/modules/:id` | JWT | Modifier un module |
| `DELETE` | `/api/modules/:id` | JWT | Supprimer un module |

### Upload (médias)
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/upload/images` | JWT | Upload une image vers S3 |
| `POST` | `/api/upload/videos` | JWT | Upload une vidéo vers S3 |
| `POST` | `/api/upload/audios` | JWT | Upload un audio vers S3 |

> Envoyer un `multipart/form-data` avec le champ `file`.

### Groupes visiteurs
| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/groups` | Non | Créer un groupe (participants + âges) |
| `GET` | `/api/groups/:id` | Non | Récupérer un groupe et ses scores |
| `PATCH` | `/api/groups/:id/score` | Non | Ajouter des points à un participant |
| `PATCH` | `/api/groups/:id/module` | Non | Marquer un module comme visité |
| `PATCH` | `/api/groups/:id/end` | Non | Terminer la visite |

---

## Exemples de données

### Créer un module
```json
POST /api/modules
{
  "number": 1,
  "name": "Les Robots Sentinelles",
  "cartel": "Découvrez les robots qui gardent l'expérience...",
  "mediaType": "video",
  "mediaUrl": "https://bucket.s3.eu-west-3.amazonaws.com/videos/uuid.mp4",
  "images": ["https://bucket.s3.eu-west-3.amazonaws.com/images/uuid.jpg"],
  "mapX": 0.42,
  "mapY": 0.31,
  "isVisible": true
}
```

### Créer un groupe visiteur
```json
POST /api/groups
{
  "participants": [
    { "name": "Martine", "age": 34 },
    { "name": "Lucas", "age": 12 }
  ]
}
```

### Ajouter des points
```json
PATCH /api/groups/:id/score
{
  "participantName": "Martine",
  "points": 100
}
```

---

## Structure du projet

```
src/
├── modules/
│   ├── auth/          → JWT, login admin
│   ├── module/        → CRUD des modules d'exposition
│   ├── upload/        → Upload S3 (images, vidéos, audios)
│   └── group/         → Groupes visiteurs et scores
└── main.ts            → Bootstrap NestJS
```

---

## Build & production

```bash
pnpm build
pnpm start:prod
```

### Déploiement (VPS / Railway / Render)

1. Configurer les variables d'environnement sur la plateforme
2. `pnpm build && pnpm start:prod`
3. L'API écoute sur le port défini par `PORT`

> En production, s'assurer que le bucket S3 autorise les requêtes CORS depuis le domaine admin.
