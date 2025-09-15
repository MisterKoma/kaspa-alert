# Kaspa Alert

Kaspa Alert est une application Node.js qui surveille les tokens KRC20 sur le réseau Kaspa. Elle envoie automatiquement une alerte Telegram lorsqu'un token atteint un taux de mint compris entre 30% et 40%. L'application propose également une API pour consulter les tokens concernés.

## Fonctionnalités

- Surveillance automatique des tokens KRC20 via l'API kasplex.org.
- Envoi d'alertes Telegram pour les tokens dont le mint est entre 30% et 40%.
- Serveur Express avec endpoint `/tokens` pour afficher les tokens surveillés.
- Configuration simple via fichier `.env`.

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-utilisateur/kaspa-alert-main.git
   cd kaspa-alert-main/kaspa-alert
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer Telegram :**
   - Créez un bot Telegram avec [@BotFather](https://t.me/BotFather) et récupérez le token.
   - Ajoutez le bot à votre groupe ou conversation.
   - Récupérez l'identifiant du chat avec [@userinfobot](https://t.me/userinfobot) ou [@getidsbot](https://t.me/getidsbot).

4. **Créer un fichier `.env` à la racine du projet :**
   ```
   TELEGRAM_BOT_TOKEN=VOTRE_TOKEN_BOT
   TELEGRAM_CHAT_ID=VOTRE_CHAT_ID
   ```

## Utilisation

1. **Lancer l'application :**
   ```bash
   npm start
   ```
   ou
   ```bash
   node index.js
   ```

2. **Fonctionnement :**
   - L'application interroge l'API toutes les minutes.
   - Si un token atteint entre 30% et 40% de mint, une alerte est envoyée sur Telegram (une seule fois par token).
   - Les tokens surveillés sont accessibles via [http://localhost:3001/tokens](http://localhost:3001/tokens).

## API

- **GET `/tokens`** : Retourne la liste des tokens dont le mint est entre 30% et 40%.

## Arrêt

Pour arrêter l'application, pressez `Ctrl+C` dans le terminal.

## Contact

Pour toute question, contactez : [misterkoma@proton.me](mailto:misterkoma@proton.me)
