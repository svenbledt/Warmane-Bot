# Commands Overview

The Warmane Bot provides a comprehensive set of commands organized into different categories. Each command is designed to help manage your Discord server and provide useful World of Warcraft character information.

## 📚 Information Commands

Commands that provide information and help to users.

| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| [help](commands/help.md) | Shows all commands | `/help [options]` | <span class="permission-badge permission-public">Public</span> |
| [servertime](commands/servertime.md) | Get the servertime of Warmane | `/servertime` | <span class="permission-badge permission-public">Public</span> |

## 🛠️ Utility Commands

General utility commands for everyday use.

| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| [char](commands/char.md) | Character related commands | `/char [options]` | <span class="permission-badge permission-public">Public</span> |
| [level](commands/level.md) | Show your level card | `/level [options]` | <span class="permission-badge permission-public">Public</span> |

## 🛡️ Moderation Commands

Commands for server moderation and user management.

| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| [account](commands/account.md) | Check the account of a user and display some information about it. | `/account [options]` | <span class="permission-badge permission-moderator">Moderator</span> |
| [blacklistword](commands/blacklistword.md) | Manage blacklisted words for the server. | `/blacklistword [options]` | <span class="permission-badge permission-moderator">Moderator</span> |
| [globalcheck](commands/globalcheck.md) | Checks the current members of the guild for global blacklist entry\ | `/globalcheck` | <span class="permission-badge permission-moderator">Moderator</span> |
| [report](commands/report.md) | Report a Warmane player for violating server rules. The player will be added to the global user blacklist and the report will be sent to the moderation team for review. | `/report` | <span class="permission-badge permission-moderator">Moderator</span> |
| [testcontext](commands/testcontext.md) | Test how the context analyzer would interpret a message with blacklisted words. | `/testcontext [options]` | <span class="permission-badge permission-moderator">Moderator</span> |
| [charname](commands/charname.md) | Ask a user for their character name via DM and set it as their nickname. | `/charname` | <span class="permission-badge permission-moderator">Moderator</span> |

## ⚙️ Settings Commands

Commands for configuring the bot.

| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
| [setup](commands/setup.md) | Manage server settings | `/setup` | <span class="permission-badge permission-admin">Admin</span> |

