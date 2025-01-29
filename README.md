# Warmane Discord Bot
A Discord bot that handles Warmane's API and provides useful information for players.

## Features

- **Character Lookup**: Look up a character's information.
- **Blacklist**: Add or remove a character from the blacklist to prevent him from joining any discord the bot is on.
- **Character Nickname**: Set a nickname on discord based on the character's name.
- **Settings**: Change the bot's settings. (disable or enable features)
- **Servertime**: Get the current servertime of the server.

- **Github Token**: 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

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

Done
