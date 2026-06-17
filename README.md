# Kool Klown Klanx Discord Bot

Bot Discord.js v14 pour maintenir le serveur Discord de la guilde **Kool Klown Klanx**.

## Fonctionnalites

- Synchronisation de la structure du serveur.
- Gestion des roles, permissions, categories et salons.
- Attribution automatique des acces d'accueil.
- Journalisation des arrivees, sorties, validations, sanctions et changements de roles.
- Salons vocaux temporaires depuis un salon declencheur.
- Messages administratifs envoyes par le bot dans un salon cible.
- Suppression de messages par identifiant.
- Health check HTTP pour Render.
- Keepalive GitHub Actions pour limiter la mise en veille.

## Roles

| Role | Couleur | Usage |
| --- | --- | --- |
| 👺 The Klown | Rouge `#992d22` | Administration complete |
| 👑 The Kween | Violet `#8e44ad` | Moderation avancee |
| 🎭 The Kool | Blanc `#ffffff` | Moderation avancee |
| 🎈 Saltimbanque | Bleu `#206694` | Moderation legere |
| 🤡 Klown | Orange `#e67e22` | Membre |
| 🚪 Visiteur | Gris `#95a5a6` | Acces d'accueil |

## Categories et salons

### 🚪・Vestibule

- 👋・entrées
- 👉・sorties

### 📰・Gazette des Klowns

- 📢・annonces
- 📅・events
- 🗞️・actualité

### 🎪・Le Chapiteau

- 💬・la-place
- 📖・présentation
- 💰・commerce
- 📈・stuffs
- 🖌️・skins

### 🎉・Loge des Klowns

- 🔊・Salon principal
- 🔊・Donjons
- 🔊・Farm
- 🔊・AFK
- 👥・duo
- 👪・quatuor
- ➕・cree-ton-salon

### 🔒・Coulisses du Chapiteau

- 📝・staff
- 📊・gestion-guilde
- 🚨・sanctions
- 🔊・Staff

### 🔒・Logs

- 📋・actions-bot

## Installation

```bash
npm install
```

Copier `.env.example` vers `.env`, puis remplir :

```env
DISCORD_TOKEN=ton_token_bot
CLIENT_ID=id_application_discord
GUILD_ID=id_du_serveur
```

## Lancement

```bash
npm start
```

## Hebergement

- Render pour l'execution du bot.
- GitHub Actions pour le keepalive.
- Health check HTTP disponible sur l'URL Render.

## Securite

- `.env` reste prive.
- Le token Discord ne doit jamais etre publie.
- Le role du bot doit rester au-dessus des roles qu'il gere.
