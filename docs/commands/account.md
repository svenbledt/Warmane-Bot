# Account Command

The `/account` command check the account of a user and display some information about it.

## Usage

```bash
/account [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | String | Yes | The user to check the account of. |

## Examples

### Basic usage
```bash
/account
```

### With parameters
```bash
/account parameter1 parameter2
```

## What it does

This command check the account of a user and display some information about it..

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

- **File**: `src\commands\Moderation\slashcommand-account.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
