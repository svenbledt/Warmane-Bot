# Blacklistword Command

The `/blacklistword` command manage blacklisted words for the server.

## Usage

```bash
/blacklistword [options]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `add` | String | Yes | Add a word to the blacklist |
| `reason` | String | No | Reason for blacklisting this word |
| `case_sensitive` | String | No | Whether the word check should be case sensitive |
| `delete_message` | String | No | Whether to delete messages containing this word |
| `warn_user` | String | No | Whether to warn the user when this word is used |
| `use_context_analysis` | String | No | Whether to analyze context to determine appropriate usage |
| `context_threshold` | String | No | Confidence threshold for context analysis (0-100%) |
| `global` | String | No | Make this word global (bot developers only) |

## Examples

### Basic usage
```bash
/blacklistword
```

### With parameters
```bash
/blacklistword parameter1 parameter2
```

## What it does

This command manage blacklisted words for the server..

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

- **File**: `src\commands\Moderation\slashcommand-blacklistword.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
