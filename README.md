# Kool Klown Klanx Discord Bot

Bot Discord.js v14 pour configurer le serveur Discord de la guilde **Kool Klown Klanx**.

## Fonctionnalites

- `/setup` cree ou resynchronise les roles, categories, salons, permissions et le bouton de reglement.
- `/setup` ne poste aucun message visible apres execution.
- `/clearsetup` supprime les elements suivis par le bot.
- `/invite user:<pseudo>` cree une invitation permanente et l'envoie en message prive.
- `/membre @user` donne manuellement le role `🤡 Klown`.
- `/kick @user raison` expulse un membre et enregistre l'action.
- Le bouton `✅ Accepter le reglement` retire `🚪 Visiteur` et ajoute `🤡 Klown`.
- Les nouveaux arrivants recoivent automatiquement `🚪 Visiteur`.
- `Lisouille` / `jaliyha` recoit directement `👑 The Kween`, sans role `🤡 Klown`, sans DM et sans validation du reglement.
- Les logs enregistrent les arrivees, departs, validations et changements de roles.
- Le vocal `➕・cree-ton-salon` cree automatiquement un salon vocal temporaire.

## Roles

- `👺 The Klown` : administrateur complet, affiche separement.
- `👑 The Kween` : moderation avancee sans administrateur.
- `🎭 The Kool` : moderation avancee sans administrateur.
- `🎈 Saltimbanque` : moderation legere avec kick, sans ban.
- `🤡 Klown` : permissions standards.
- `🚪 Visiteur` : acces limite au sas d'entree.

## Categories

- `🚪・Vestibule`
- `👑・Le Trône`
- `🎪・Le Chapiteau`
- `📰・Gazette des Klowns`
- `☠️・The Real KKK`
- `🎉・Loge des Klowns`
- `🔒・Coulisses du Chapiteau`
- `🔒・Logs`

## Installation

```bash
npm install
```

Copie `.env.example` vers `.env`, puis remplis :

```env
DISCORD_TOKEN=ton_token_bot
CLIENT_ID=id_application_discord
GUILD_ID=id_du_serveur
```

## Lancement

```bash
npm start
```

Quand le bot est connecte, les commandes slash sont disponibles sur le serveur configure dans `GUILD_ID`.

## Notes

- Le role Discord gere automatiquement pour le bot doit etre place au-dessus des roles qu'il modifie.
- Garde `.env` prive : il contient le token du bot.
