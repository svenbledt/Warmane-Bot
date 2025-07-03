# Blacklistword Command

The `/blacklistword` command manage blacklisted words for the server.

## Usage

```bash
/blacklistword <subcommand>
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `add` | Add a word to the blacklist |

## Examples

### Add subcommand
```bash
/blacklistword add
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reason` | String | No | Reason for blacklisting this word |
| `case_sensitive` | String | No | Make word check case sensitive |
| `delete_message` | String | No | Delete messages containing this word |
| `warn_user` | String | No | Warn user when this word is used |
| `use_context_analysis` | String | No | Analyze context to determine appropriate usage |
| `context_threshold` | String | No | Confidence threshold for context analysis (0-100) |
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

- **Required**: Developer


- **Additional**: Bot Developer

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
