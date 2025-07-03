# Globalcheck Command

The `/globalcheck` command checks the current members of the guild for global blacklist entry\

## Usage

```bash
/globalcheck
```

## Examples

### Basic usage
```bash
/globalcheck
```

## What it does

This command checks the current members of the guild for global blacklist entry\.

## Permissions

- **Required**: Moderator
- **Additional**: Manage Messages, Manage Members



## Response

The command responds with an embed containing relevant information.

## Error Handling

- **Invalid input**: The command handles invalid input gracefully
- **Permission errors**: Graceful handling of missing permissions
- **Network errors**: Proper error handling for external API calls

## Related Commands

- `/help` - Get help with commands
- `/setup` - Configure bot settings

## Technical Details

- **File**: `src\commands\Moderation\slashcommand-globalcheck.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
