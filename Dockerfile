FROM node:latest

# Create the directory!
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install our bot
RUN npm install -g pnpm
COPY package.json /usr/src/bot
RUN pnpm install

# Our precious bot
COPY . /usr/src/bot

# Start me!
CMD ["pnpm", "start"]