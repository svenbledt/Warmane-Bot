# Testcontext Command

The `/testcontext` command test how the context analyzer would interpret a message with blacklisted words.

## Usage

```bash
/testcontext [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | String | Yes | The message to test |
| `word` | String | Yes | The blacklisted word to test against |

## Examples

### Basic usage
```bash
/testcontext
```

### With parameters
```bash
/testcontext parameter1 parameter2
```

## What it does

This command test how the context analyzer would interpret a message with blacklisted words..

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

- **File**: `src\commands\Moderation\slashcommand-testcontext.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
