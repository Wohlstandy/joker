# Kool Klown Klanx Discord Bot

Bot Discord.js v14 pour maintenir le serveur Discord de la guilde **Kool Klown Klanx**.

## Fonctionnalités

- Synchronisation de la structure du serveur.
- Création et mise à jour des rôles, permissions, catégories et salons.
- Attribution automatique des accès d'accueil et des rôles spéciaux configurés.
- Mémorisation locale des membres validés pour restaurer les accès après un reset.
- Journalisation des arrivées, départs, validations, sanctions et changements de rôles.
- Salons vocaux temporaires depuis un salon déclencheur.
- Messages administratifs envoyés par le bot dans un salon cible.
- Suppression de messages par identifiant.
- Health check HTTP pour Render.
- Keepalive GitHub Actions pour limiter la mise en veille.

## Rôles

| Rôle | Couleur | Usage |
| --- | --- | --- |
| 👺 The Klown | Rouge `#992d22` | Administration complète |
| 👑 The Kween | Violet `#8e44ad` | Salon privé du Trône |
| 🎭 The Kool | Blanc `#ffffff` | Modération avancée |
| 🎈 Saltimbanque | Bleu `#206694` | Modération légère |
| 🤡 Klown | Orange `#e67e22` | Membre |
| 🚪 Visiteur | Gris `#95a5a6` | Accès d'accueil |

## Catégories Et Salons

### 🚪・Vestibule

- 👋・entrées
- 👉・sorties

### 👑・Le Trône

- 👑・le-trône
- 🔊・Le Trône

### ☠️・The Real KKK

- ☠️・la-vérité
- 🔺・KKK

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

## Commandes

| Commande | Permission | Action |
| --- | --- | --- |
| `/setup` | Administrateur | Crée ou synchronise toute la structure du serveur. |
| `/clearsetup` | Administrateur | Supprime les rôles et salons suivis par le setup. |
| `/membre` | Gérer les rôles | Valide manuellement un utilisateur comme membre. |
| `/kick` | Expulser des membres | Expulse un utilisateur avec une raison et un log. |
| `/del` | The Klown ou The Kool | Supprime un message par ID. |
| `/ms` | The Klown ou The Kool | Envoie un message avec le bot dans un salon. |

## Flux D'accueil

1. Un nouveau membre rejoint le serveur.
2. Le bot lui donne le rôle `🚪 Visiteur`, sauf si son ID a un accès spécial configuré.
3. Le règlement reste géré hors `/setup` pour conserver son lien Discord permanent.
4. Au clic, le bot donne le rôle `🤡 Klown`, retire `🚪 Visiteur`, envoie un DM de bienvenue et log l'action.
5. Les membres validés sont mémorisés dans `data/auto-members.json`.

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

`GUILD_ID` est optionnel, mais recommandé pour enregistrer les commandes slash instantanément sur un serveur.

## Lancement

```bash
npm start
```

## Vérification

```bash
npm test
```

## Hébergement

- Render pour l'exécution du bot.
- Health check HTTP disponible sur l'URL Render quand `PORT` est défini.
- GitHub Actions ping l'URL Render toutes les 10 minutes.

## Sécurité

- `.env` reste privé.
- Le token Discord ne doit jamais être publié.
- Le rôle du bot doit rester au-dessus des rôles qu'il gère.
