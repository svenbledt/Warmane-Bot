# Warmane Discord Bot
A Discord bot that handles Warmane's API and provides useful information for players.

## Features

- **Character Lookup**: Look up a character's information.
- **Blacklist**: Add or remove a character from the blacklist to prevent him from joining any discord the bot is on.
- **Character Nickname**: Set a nickname on discord based on the character's name.
- **Settings**: Change the bot's settings. (disable or enable features)
- **Servertime**: Get the current servertime of the server.

## TODO
- [ ] Excesive Testing of logging system.

## Starting the Bot

To use PM2 to manage the bot.

First install pm2 and dependencies

```js
npm i --global pm2
npm i
```

Then u need to link your PM2 Dashboard to the npm instance.<br>
The command for that u can get on https://app.pm2.io/<br>
After you linked pm2 successfully u need to start the app and save the process in the list.

```js
pm2 start npm --name "Warmane Tool" -- start
pm2 save
```

## Docker Usage

### Using Docker Compose

1. Create a `docker-compose.yml` file with your environment variables:

```yaml
version: '3.8'

services:
  warmane-bot:
    image: svenbledt/warmane-bot:latest
    container_name: warmane-bot
    restart: unless-stopped
    environment:
      # Bot configuration
      - CLIENT_TOKEN=your-discord-token
      - MONGODB_URI=mongodb+srv://user:password@yourcluster.mongodb.net/?retryWrites=true&w=majority
      - DB_NAME=warmane_bot
      
      # Development section IDs from config.js
      - GUILD_ID=1254444159985651712
      - REPORT_CHANNEL=1257409168265187428
      - INVITE_CHANNEL=1257459204948627638
      - ANNOUNCEMENT_CHANNEL=1257409143724310609
      - STAFF_ANNOUNCEMENT_CHANNEL=1257409165769314435
      - LOG_CHANNEL=1333610717630300210
      
      # Development mode toggle
      - DEV_MODE=false
    volumes:
      - ./logs:/usr/src/bot/logs
```

2. Start the bot:
```bash
docker-compose up -d
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop the bot:
```bash
docker-compose down
```

## Docker Publishing

### Prerequisites
1. Make sure you're logged in to Docker Hub:
```bash
docker login
```

2. Set up QEMU for multi-architecture builds:
```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

3. Create a new builder instance with multi-platform support:
```bash
docker buildx create --name mybuilder --driver docker-container --bootstrap
docker buildx use mybuilder
```

4. Verify your builder's platforms:
```bash
docker buildx inspect --bootstrap
```

### Building and Publishing
Build and push the multi-platform image:
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t svenbledt/warmane-bot:latest --push .
```

### Cleanup
After successful publishing, clean up Docker resources:
```bash
# Remove the custom builder
docker buildx rm mybuilder

# Clean up unused Docker resources (images, containers, networks)
docker system prune -f

# For a more comprehensive cleanup including unused volumes
docker system prune -a --volumes -f
```
