# Verwenden eines schlanken Node.js-Image
FROM node:20-slim

# Setzen des Arbeitsverzeichnisses
WORKDIR /usr/src/bot

# Installiere pnpm global
RUN npm install -g pnpm

# Kopiere nur die package.json (aber nicht die pnpm-lock.yaml)
COPY package.json ./

# Installiere Abhängigkeiten basierend auf der package.json
RUN pnpm install

# Kopiere den Rest der Projektdateien
COPY . .

# Exponiere den notwendigen Port (z. B. 3000, falls benötigt)
EXPOSE 3000

# Starten der Anwendung
CMD ["pnpm", "start"]