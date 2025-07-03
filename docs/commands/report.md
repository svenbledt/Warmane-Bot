# Report Command

The `/report` command report a warmane player for violating server rules. the player will be added to the global user blacklist and the report will be sent to the moderation team for review.

## Usage

```bash
/report
```

## Examples

### Basic usage
```bash
/report
```

## What it does

This command report a warmane player for violating server rules. the player will be added to the global user blacklist and the report will be sent to the moderation team for review..

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

- **File**: `src\commands\Moderation\slashcommand-report.js`
- **Category**: Moderation
- **Type**: Slash Command
- **Framework**: Discord.js v14
