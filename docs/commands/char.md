# Char Command

The `/char` command character related commands

## Usage

```bash
/char [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `info` | String | Yes | Get information about a character on Warmane |
| `realm` | String | Yes | Select the realm of the character. |

## Examples

### Basic usage
```bash
/char
```

### With parameters
```bash
/char parameter1 parameter2
```

## What it does

This command character related commands.

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

- **File**: `src\commands\Utility\slashcommand-char.js`
- **Category**: Utility
- **Type**: Slash Command
- **Framework**: Discord.js v14
