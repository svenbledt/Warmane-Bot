# Servertime Command

The `/servertime` command get the servertime of warmane

## Usage

```bash
/servertime
```

## Examples

### Basic usage
```bash
/servertime
```

## What it does

This command get the servertime of warmane.

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

- **File**: `src\commands\Information\slashcommand-servertime.js`
- **Category**: Information
- **Type**: Slash Command
- **Framework**: Discord.js v14
