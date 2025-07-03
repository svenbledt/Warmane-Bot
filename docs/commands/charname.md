# Charname Command

The `/charname` command ask a user for their character name via dm and set it as their nickname.

## Usage

```bash
/charname
```

## Examples

### Basic usage
```bash
/charname
```

## What it does

This command ask a user for their character name via dm and set it as their nickname..

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

- **File**: `src\commands\Moderation\usercontext-charname.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
