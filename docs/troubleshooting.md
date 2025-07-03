# Troubleshooting Guide

This guide helps you resolve common issues you might encounter while using the Warmane Bot.

## Common Issues

### Commands Not Working

**Problem**: Commands don't respond or show an error.

**Solutions**:
1. **Check bot status**: Make sure the bot is online and visible in your server
2. **Verify permissions**: Ensure you have the required permissions to use the command
3. **Try the help command**: Use `/help` to see if the bot is responding at all
4. **Check bot permissions**: The bot needs proper permissions in your server

**Required Bot Permissions**:
- Send Messages
- Use Slash Commands
- Embed Links
- Manage Messages (for moderation commands)
- Manage Members (for user management)

### Character Commands Issues

**Problem**: `/char info` doesn't find characters.

**Solutions**:
1. **Check spelling**: Verify the character name is spelled correctly
2. **Verify realm**: Make sure you're using the correct realm name
3. **Check character existence**: Ensure the character exists on Warmane
4. **Try different formatting**: Some character names might need specific formatting

**Supported Realms**:
- Frostmourne
- Lordaeron
- Icecrown
- Blackrock
- And more...

**Problem**: `/char set` fails or shows errors.

**Solutions**:
1. **Verify character first**: Use `/char info` to confirm the character exists
2. **Check ownership**: The character might already be claimed by someone else
3. **Use correct type**: Use "main" or "alt" as the type parameter
4. **Check permissions**: Ensure you have permission to manage nicknames

### Moderation Commands Issues

**Problem**: Moderation commands don't work.

**Solutions**:
1. **Check your role**: Ensure you have moderator or administrator permissions
2. **Verify bot permissions**: The bot needs Manage Messages and Manage Members permissions
3. **Check command syntax**: Use the correct command format

**Problem**: Word filtering doesn't work.

**Solutions**:
1. **Check word spelling**: Ensure the word is spelled exactly as it should be filtered
2. **Test with `/testcontext`**: Use this command to test if a word would be flagged
3. **Verify bot permissions**: The bot needs Manage Messages permission
4. **Check word list**: Use `/blacklistword list` to see current blacklisted words

### Report Command Issues

**Problem**: `/report` command is misunderstood or not working as expected.

**Clarification**:
- The `/report` command is for reporting in-game Warmane players who violate server rules, **not Discord users**.
- When you use `/report`, you must fill out a form with the player's in-game name or ID, the reason, and evidence.
- After submitting, the reported player is added to the global user blacklist and the moderation team is notified for review.

**Solutions**:
1. **Make sure you are reporting an in-game player, not a Discord user.**
2. **Fill out all required fields in the report form.**
3. **Provide clear evidence and a valid reason.**
4. **If you do not see a confirmation, check your permissions or contact a moderator.**

### Level System Issues

**Problem**: `/level` shows incorrect or no information.

**Solutions**:
1. **Check if you're active**: The level system tracks activity over time
2. **Wait for updates**: Level information updates periodically
3. **Contact admin**: If issues persist, contact your server administrator

### Setup Command Issues

**Problem**: `/setup` command doesn't work.

**Solutions**:
1. **Check permissions**: You need Administrator permissions to use setup
2. **Verify bot permissions**: The bot needs Administrator permissions
3. **Use correct syntax**: Follow the setup command format exactly

## Error Messages

### "You do not have permission to use this command"

**Cause**: You don't have the required Discord permissions.

**Solution**: Contact your server administrator to get the necessary permissions.

### "Character not found"

**Cause**: The character doesn't exist or the name/realm is incorrect.

**Solution**: 
1. Double-check the character name spelling
2. Verify the realm name
3. Ensure the character exists on Warmane

### "Bot is not responding"

**Cause**: The bot might be offline or experiencing issues.

**Solution**:
1. Check if the bot is visible in your server
2. Try a simple command like `/help`
3. Contact your server administrator

### "Invalid command syntax"

**Cause**: The command was used incorrectly.

**Solution**:
1. Use `/help` to see the correct command format
2. Check the command documentation
3. Follow the examples provided

## Permission Levels

### Public Commands
These commands can be used by everyone:
- `/help`
- `/servertime`
- `/char info`
- `/level`
- `/report`

### Moderator Commands
These require moderation permissions:
- `/account`
- `/blacklistword`
- `/globalcheck`
- `/testcontext`

### Administrator Commands
These require administrator permissions:
- `/setup`

## Getting Help

### Step 1: Self-Help
1. **Check this guide**: Look for your specific issue above
2. **Use `/help`**: Get information about commands
3. **Try examples**: Check the [examples page](examples.md)

### Step 2: Ask for Help
1. **Contact a moderator**: Use `/report` for in-game player issues
2. **Ask in support channels**: If your server has a support channel
3. **Contact server admin**: For bot configuration issues

### Step 3: Report Issues
If you find a bug or persistent issue:
1. **Document the problem**: Note what you were trying to do
2. **Include error messages**: Copy any error text exactly
3. **Provide context**: Include what you were doing when the issue occurred

## Best Practices

### Before Asking for Help
1. **Try the command again**: Sometimes temporary issues resolve themselves
2. **Check your spelling**: Ensure command names and parameters are correct
3. **Verify permissions**: Make sure you have the required permissions
4. **Read the documentation**: Check the command documentation for proper usage

### When Reporting Issues
1. **Be specific**: Describe exactly what you were trying to do
2. **Include error messages**: Copy error text exactly as shown
3. **Provide context**: Mention what you were doing when the issue occurred
4. **Be patient**: Allow time for moderators to respond

## Prevention Tips

### Regular Maintenance
- **Keep character info updated**: Update your character information when it changes
- **Check permissions**: Ensure you have the permissions you need
- **Stay informed**: Read server announcements about bot updates

### Good Practices
- **Use commands correctly**: Follow the proper syntax
- **Be patient**: Some commands may take a moment to respond
- **Report issues**: Help improve the bot by reporting problems

## Still Need Help?

If you've tried everything above and still need assistance:

1. **Contact your server administrator**: They can help with bot configuration
2. **Ask in support channels**: Many servers have dedicated help channels
3. **Use the report system**: Report in-game player issues through `/report`

Remember: Most issues can be resolved by checking permissions, verifying command syntax, or contacting your server's moderators. 