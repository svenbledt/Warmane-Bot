# Help Command

The `/help` command shows all commands

## Usage

```bash
/help [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `command` | String | No | Get information about a specific command |

## Examples

### Basic usage
```bash
/help
```

### With parameters
```bash
/help parameter1 parameter2
```

## What it does

This command shows all commands.

## Permissions

- **Required**: Public




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

- **File**: `src\commands\Information\slashcommand-help.js`
- **Category**: Information
- **Type**: Slash Command
- **Framework**: Discord.js v14
