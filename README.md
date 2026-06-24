# Joker

Bot Discord.js v14 du serveur de guilde **Kool Klown Klanx**.

Le projet, le bot et le dépôt GitHub s'appellent **Joker**. Le serveur Discord garde le nom **Kool Klown Klanx**.

- Dépôt : https://github.com/Wohlstandy/joker.git
- Branche principale : `main`
- URL Render publique : https://kool-klown-klanx-discord-bot.onrender.com
- Healthcheck : https://kool-klown-klanx-discord-bot.onrender.com/health

> L'URL Render historique reste `kool-klown-klanx-discord-bot.onrender.com`. `joker.onrender.com` n'existe pas.

## Fonctionnalités

- Synchronise la structure du serveur : rôles, permissions, catégories et salons.
- Attribue automatiquement `🚪 Visiteur` aux nouveaux arrivants humains.
- Valide l'accès membre via le bouton de règlement `accept_rules_ticket`.
- Transforme `🚪 Visiteur` en `🤡 Klown` lors de l'acceptation du règlement.
- Mémorise les rôles validés par ID utilisateur dans `data/auto-members.json`.
- Restaure les accès sauvegardés avec `/repar`.
- Gère les rôles spéciaux automatiques : `👺 The Klown`, `👑 The Kween`, `🎭 The Kool`.
- Journalise les actions importantes dans `📋・actions-bot` sans flood pour les transitions Visiteur/Klown.
- Gère les salons vocaux temporaires depuis le salon déclencheur.
- Expose un healthcheck HTTP pour Render.
- Utilise un keepalive GitHub Actions vers l'URL Render publique.

## Règles importantes

- `/setup` ne doit jamais poster ni modifier le message de règlement.
- Le message de règlement est uniquement un one-shot manuel.
- Le bouton du règlement doit garder le custom id `accept_rules_ticket`.
- Quand un utilisateur accepte le règlement, Joker ajoute `🤡 Klown`, retire `🚪 Visiteur` et log un seul embed dans `actions-bot`.
- Si un utilisateur repasse de `🤡 Klown` vers `🚪 Visiteur`, Joker log un seul embed avec le texte `est repassé dans le Vestibule.`
- Le rôle `🚪 Visiteur` doit rester jaune, même après `/clearsetup` puis `/setup`.
- `/repar` répare les accès sauvegardés et log un embed clair en français.
- `/aide` affiche un embed titré `Commandes du bot`.
- `/aide` décrit `/repar` avec `Répare les accès sauvegardés.`

## Rôles

| Rôle | Couleur | Usage |
| --- | --- | --- |
| `👺 The Klown` | Rouge `#992d22` | Administration complète |
| `👑 The Kween` | Violet `#8e44ad` | Salon privé du Trône |
| `🎭 The Kool` | Blanc `#ffffff` | Modération avancée |
| `🎈 Saltimbanque` | Bleu `#206694` | Modération légère |
| `🤡 Klown` | Orange `#e67e22` | Membre validé |
| `🚪 Visiteur` | Jaune `#f1c40f` | Accès d'accueil |

## Commandes

| Commande | Permission | Action |
| --- | --- | --- |
| `/aide` | Tous les membres | Affiche la liste des commandes du bot. |
| `/setup` | Administrateur | Crée ou synchronise la structure du serveur sans toucher au message de règlement. |
| `/clearsetup` | Administrateur | Supprime uniquement les rôles et salons suivis par le setup. |
| `/repar` | Administrateur | Répare les accès sauvegardés. |
| `/membre` | Administrateur ou gestion des rôles | Donne manuellement le rôle Klown à un utilisateur. |
| `/kick` | Administrateur ou expulsion | Expulse un utilisateur avec une raison et un log. |
| `/del` | Administrateur | Supprime un message par ID. |
| `/ms` | Administrateur | Envoie un message avec le bot dans un salon. |

## Plugin BetterDiscord

Le fichier `betterdiscord/JokerVoiceDisconnect.plugin.js` déplace la commande d'application `Disconnect` hors de `Apps` et la place juste au-dessus du `Disconnect` natif dans le menu contextuel utilisateur BetterDiscord.

Installer le fichier dans le dossier plugins BetterDiscord, puis activer le plugin. L'action utilise le compte Discord connecté et demande la permission `Déplacer des membres` sur le serveur.

## Flux d'accueil

1. Un nouveau membre humain rejoint le serveur.
2. Joker lui donne le rôle `🚪 Visiteur`, sauf si son ID a un accès spécial automatique.
3. Le règlement reste géré manuellement, hors `/setup`, pour conserver son lien Discord permanent.
4. Au clic sur le bouton `accept_rules_ticket`, Joker donne `🤡 Klown`, retire `🚪 Visiteur`, envoie le DM de bienvenue si possible et log un seul embed.
5. Les rôles validés sont sauvegardés par ID utilisateur dans `data/auto-members.json`.
6. `/repar` resynchronise les rôles du setup, restaure les accès sauvegardés et remet les visiteurs manquants.

## Structure Discord

Joker maintient notamment :

- `🚪・Vestibule`
- `👑・Le Trône`
- `☠️・The Real KKK`
- `📰・Gazette des Klowns`
- `🎪・Le Chapiteau`
- `🎉・Loge des Klowns`
- `🔒・Coulisses du Chapiteau`
- `🔒・Logs`

Le salon de logs principal est `📋・actions-bot`.

## Installation locale

```bash
npm install
```

Créer un fichier `.env` local, puis renseigner les variables nécessaires :

```env
DISCORD_TOKEN=ton_token_bot
CLIENT_ID=id_application_discord
GUILD_ID=id_du_serveur
PORT=3000
```

`GUILD_ID` est optionnel, mais recommandé pour enregistrer les commandes slash instantanément sur un serveur de test ou de production.

## Lancement

```bash
npm start
```

Mode développement :

```bash
npm run dev
```

## Vérification

```bash
npm test
```

Test du flux d'accueil :

```bash
npm run test:welcome
```

## Hébergement

- Render exécute le service web `joker`.
- Le healthcheck Render pointe sur `/health`.
- Le endpoint `/health` doit répondre avec `service: "joker"` et `discord: "ready"` quand le bot est connecté.
- Le keepalive GitHub Actions doit uniquement ping `https://kool-klown-klanx-discord-bot.onrender.com`.
- Le deploy hook Render est stocké uniquement dans le `.env` local avec `RENDER_DEPLOY_HOOK_URL`.

## Maintenance Git

Avant modification :

```bash
git status --short
git remote -v
```

Le remote attendu est :

```text
https://github.com/Wohlstandy/joker.git
```

Commit habituel :

```bash
git add <fichiers>
git commit -m "Update bot configuration"
git push
```

Après un push nécessitant un redéploiement, déclencher le deploy hook Render depuis `.env`, puis vérifier :

```bash
curl https://kool-klown-klanx-discord-bot.onrender.com/health
```

## Sécurité

- Ne jamais publier `.env`.
- Ne jamais révéler le token Discord, les secrets ou le deploy hook Render.
- Le rôle du bot Discord doit rester au-dessus des rôles qu'il gère.
- Les données de `data/auto-members.json` sont des données d'exploitation du serveur et doivent être manipulées avec prudence.
