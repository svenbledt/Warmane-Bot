# Usage Examples

This page provides practical examples of how to use the Warmane Bot effectively in your Discord server.

## Character Management Examples

### Viewing Character Information

**Basic character lookup:**
```bash
/char info Arthas Frostmourne
```

**View character with private response:**
```bash
/char info Arthas Frostmourne true
```

### Managing Your Characters

**Set your main character:**
```bash
/char set Arthas Frostmourne main
```

**Add an alt character:**
```bash
/char set Paladin Frostmourne alt
```

**List your characters:**
```bash
/char list
```

**List someone else's characters:**
```bash
/char list @username
```

### Character Name Setup

**Set up character name via DM:**
```bash
/char name @username
```

This will send a DM to the user asking for their character name, then automatically update their nickname.

## Moderation Examples

### Word Filtering

**Add a server-specific word to the blacklist:**
```bash
/blacklistword add word:spam reason:Prevent spam messages
```

**Add a global word (developers only):**
```bash
/blacklistword add word:nigger global:true reason:Offensive language
```

**Remove a word from the blacklist:**
```bash
/blacklistword remove word:spam
```

**List all server blacklisted words:**
```bash
/blacklistword list
```

**List all global blacklisted words (developers only):**
```bash
/blacklistword listglobal
```

**Toggle a word on/off:**
```bash
/blacklistword toggle word:spam
```

**Add a word with custom settings:**
```bash
/blacklistword add word:test case_sensitive:true delete_message:true warn_user:true context_threshold:80
```

### User Management

**Check a user's account status:**
```bash
/account check @username
```

**Ban a user:**
```bash
/account ban @username Spamming
```

**Unban a user:**
```bash
/account unban @username
```

### Reporting Players (In-Game)

**Report a Warmane player to the moderation team and global blacklist:**
```bash
/report
```

This will open a form where you must enter:
- The in-game player name or ID of the person you are reporting
- The reason for the report (at least 10 characters)
- Evidence (such as a message excerpt, screenshot, or link)

After submitting, the reported player will be added to the global user blacklist and the report will be sent directly to the moderation team for review. You will receive a confirmation message.

### Global User Checks

**Check if a user is banned on other servers:**
```bash
/globalcheck @username
```

### Testing Word Context

**Test if a word would be flagged:**
```bash
/testcontext potentially_bad_word
```

## Information Commands

### Getting Help

**Show all commands:**
```bash
/help
```

**Get help for a specific command:**
```bash
/help char
```

### Server Information

**Check server time:**
```bash
/servertime
```

## Leveling System

### Check Your Level

**Check your own level:**
```bash
/level
```

**Check someone else's level:**
```bash
/level @username
```

## Settings and Configuration

### Bot Setup (Admin Only)

**Set server language:**
```bash
/setup language en
```

**Configure logging channel:**
```bash
/setup logging #bot-logs
```

**Set up word filtering:**
```bash
/setup moderation enable
```

## Common Use Cases

### New User Welcome

When a new user joins your server:

1. **Welcome them** and suggest they set up their character:
   ```
   Welcome! Use /char name @username to set up your character name.
   ```

2. **Help them get started:**
   ```
   Use /help to see all available commands.
   ```

### Character Verification

For guilds that require character verification:

1. **Ask users to set their main character:**
   ```
   Please use /char set YourCharacterName Realm main
   ```

2. **Verify their character:**
   ```
   Use /char info YourCharacterName Realm to verify
   ```

### Moderation Workflow

When dealing with rule violations:

1. **Warn the user** using the report system:
   ```
   /report
   ```
   (Fill out the form with username, reason, and evidence)

2. **Add problematic words** to the filter:
   ```
   /blacklistword add problematic_word
   ```

3. **Check user history** if needed:
   ```
   /globalcheck @username
   ```

### Server Management

For server administrators:

1. **Set up the bot** initially:
   ```
   /setup language en
   /setup logging #bot-logs
   ```

2. **Configure moderation:**
   ```
   /setup moderation enable
   /blacklistword add inappropriate_word1
   /blacklistword add inappropriate_word2
   ```

## Best Practices

### Character Management

- **Use consistent naming**: Always use the same format for character names
- **Verify characters**: Use `/char info` to verify character existence before setting
- **Keep it updated**: Update your character information when you make changes

### Moderation

- **Be consistent**: Apply the same rules to all users
- **Document actions**: Use the report system to keep track of moderation actions
- **Test filters**: Use `/testcontext` to test word filtering before implementing

### Communication

- **Use help command**: Direct users to `/help` when they're unsure about commands
- **Provide context**: When reporting users, include relevant context
- **Be clear**: Use clear, specific language in moderation actions

## Troubleshooting

### Common Issues

**Command not working?**
- Check if you have the required permissions
- Try `/help` to see available commands
- Contact a server administrator

**Character not found?**
- Verify the character name spelling
- Check if the realm is correct
- Ensure the character exists on Warmane

**Bot not responding?**
- Check if the bot is online
- Verify the bot has proper permissions
- Contact your server administrator

### Getting Help

If you encounter issues:

1. **Check the help command**: `/help`
2. **Ask a moderator**: Use `/report` for technical issues
3. **Contact your server admin**: For bot configuration issues

## Advanced Tips

### Efficient Character Management

- **Use alts**: Set up multiple characters with `/char set`
- **Keep track**: Use `/char list` to see all your characters
- **Update regularly**: Keep your character information current

### Moderation Efficiency

- **Use global checks**: Check user history across servers
- **Test filters**: Use `/testcontext` before adding words
- **Document everything**: Use the reporting system consistently

### Server Organization

- **Set up logging**: Configure proper logging channels
- **Use appropriate permissions**: Assign roles based on needs
- **Regular maintenance**: Periodically review and update settings 