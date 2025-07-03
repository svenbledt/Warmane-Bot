# Level Command

The `/level` command show your level card

## Usage

```bash
/level [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | String | No | The user to show the level card for |

## Examples

### Basic usage
```bash
/level
```

### With parameters
```bash
/level parameter1 parameter2
```

## What it does

This command show your level card.

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

- **File**: `src\commands\Utility\slashcommand-level.js`
- **Category**: Utility
- **Type**: Slash Command
- **Framework**: Discord.js v14
