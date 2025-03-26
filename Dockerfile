# Verwenden eines Node.js Slim Basisimages
FROM node:20-slim

# Setze das Arbeitsverzeichnis
WORKDIR /usr/src/bot

# Installiere Systemabhängigkeiten für native Module (z. B. canvas)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    cairo-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Installiere pnpm
RUN npm install -g pnpm

# Kopiere nur die package.json (und nicht die pnpm-lock.yaml)
COPY package.json ./

# Installiere die Abhängigkeiten
RUN pnpm install

# Kopiere den Rest der Projektdateien
COPY . .

# Öffne den benötigten Port
EXPOSE 3000

# Starte die Anwendung
CMD ["pnpm", "start"]