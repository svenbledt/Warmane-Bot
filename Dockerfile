# Verwenden eines schlankeren Node.js-Image
FROM node:20-slim

# Setzen des Arbeitsverzeichnisses
WORKDIR /usr/src/bot

# Installiere pnpm global
RUN npm install -g pnpm

# Kopiere nur package.json und pnpm-lock.yaml für den Build-Cache
COPY package.json pnpm-lock.yaml ./

# Installiere Abhängigkeiten im Container
RUN pnpm install --frozen-lockfile

# Kopiere den Rest der Projektdateien
COPY . .

# Exponiere den notwendigen Port (z.B. 3000)
EXPOSE 3000

# Starten der Anwendung
CMD ["pnpm", "start"]