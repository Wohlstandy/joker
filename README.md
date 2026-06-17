# Kool Klown Klanx Discord Bot

Bot Discord.js v14 pour maintenir le serveur Discord de la guilde **Kool Klown Klanx**.

## Fonctionnalites

- Synchronisation des roles, categories, salons et permissions du serveur.
- Attribution automatique des roles d'accueil et des acces speciaux.
- Gestion des arrivees, sorties, validations, sanctions et changements de roles dans les logs.
- Salons vocaux temporaires crees automatiquement depuis un salon declencheur.
- Messages administratifs envoyes par le bot dans un salon cible.
- Suppression de messages par identifiant.
- Health check HTTP pour l'hebergement Render.
- Keepalive GitHub Actions pour limiter la mise en veille du service gratuit.

## Roles geres

- The Klown
- The Kween
- The Kool
- Saltimbanque
- Klown
- Visiteur

## Structure serveur

- Vestibule
- Le Trone
- Gazette des Klowns
- Le Chapiteau
- Loge des Klowns
- Coulisses du Chapiteau
- Logs

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

Le bot est prevu pour tourner sur Render avec un health check HTTP.

## Securite

- `.env` doit rester prive.
- Le role du bot Discord doit rester au-dessus des roles qu'il gere.
- Les actions sensibles sont limitees aux roles autorises.
