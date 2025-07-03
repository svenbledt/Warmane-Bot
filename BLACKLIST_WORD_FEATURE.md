# Blacklist Word Feature

## Overview
The Blacklist Word feature is an advanced moderation system that automatically detects and handles messages containing specific words. Unlike basic word filters, this system uses **Context Analysis** to intelligently distinguish between appropriate and inappropriate usage, minimizing false positives while maintaining effective moderation.

## Key Features

### 🧠 Intelligent Context Analysis
The system's core strength is its ability to analyze the context around blacklisted words:
- **Confidence Scoring**: Assigns a score (0-100%) to determine if usage is appropriate
- **Threshold-Based Decisions**: Only takes action when confidence is below the configured threshold
- **Smart Pattern Recognition**: Identifies educational, professional, and legitimate usage patterns
- **False Positive Reduction**: Minimizes blocking of legitimate discussions

### 🌐 Global and Server-Specific Words
- **Server Words**: Apply only to specific servers when the feature is enabled
- **Global Words**: Apply to all servers regardless of individual server settings (bot developers only)
- **Hierarchical Enforcement**: Global words take precedence and are always active
- **Flexible Management**: Different rules for different communities

### ⚙️ Advanced Word Configuration
Each blacklisted word can be configured with comprehensive settings:
- **Case Sensitivity**: Exact case matching or case-insensitive detection
- **Message Actions**: Delete messages, warn users, or both
- **Context Analysis**: Enable/disable intelligent context checking
- **Context Threshold**: Confidence level for action (0-100%)
- **Reason Documentation**: Optional explanation for transparency

## Commands

### `/blacklistword add`
Add a word to the blacklist with advanced configuration options.

**Options:**
- `word` (required): The word to blacklist (max 50 characters)
- `reason` (optional): Reason for blacklisting (max 200 characters)
- `case_sensitive` (optional): Whether the check should be case sensitive (default: false)
- `delete_message` (optional): Whether to delete messages (default: true)
- `warn_user` (optional): Whether to warn users (default: true)
- `use_context_analysis` (optional): Whether to use context analysis (default: true)
- `context_threshold` (optional): Confidence threshold 0-100% (default: 20%)
- `global` (optional): Make word global across all servers (bot developers only)

**Examples:**
```
# Basic usage
/blacklistword add word:badword reason:Inappropriate language

# Advanced configuration with context analysis
/blacklistword add word:test reason:Spam prevention delete_message:true warn_user:true use_context_analysis:true context_threshold:30

# Global word (bot developers only)
/blacklistword add word:extremeword reason:Global moderation global:true context_threshold:10
```

### `/blacklistword remove`
Remove a word from the blacklist.

**Options:**
- `word` (required): The word to remove

**Example:**
```
/blacklistword remove word:badword
```

### `/blacklistword list`
List all blacklisted words with pagination and detailed information.

**Options:**
- `page` (optional): Page number to display (default: 1)

**Features:**
- Shows word status (enabled/disabled)
- Displays all configuration settings
- Pagination for large lists
- Context analysis information

**Example:**
```
/blacklistword list page:1
```

### `/blacklistword toggle`
Enable or disable a blacklisted word without removing it.

**Options:**
- `word` (required): The word to toggle

**Example:**
```
/blacklistword toggle word:badword
```

### `/testcontext`
Test how the context analyzer would interpret a message with blacklisted words.

**Options:**
- `message` (required): The message to test
- `word` (required): The blacklisted word to test against
- `context_threshold` (optional): Threshold to test against (0-100%)

**Example:**
```
/testcontext message:"I need to discuss the badword in this context" word:badword context_threshold:20
```

## Context Analysis System

### How It Works
The context analyzer evaluates multiple factors to determine if word usage is appropriate:

**Confidence Scoring (0-100%):**
- **Low confidence** (< threshold): Likely inappropriate → Action taken
- **High confidence** (≥ threshold): Likely appropriate → No action

### Appropriate Usage Indicators
- **Educational context**: "discuss", "analyze", "study", "research"
- **Professional context**: Technical discussions, work-related content
- **Quotation marks**: Words in quotes or references
- **Code blocks**: Technical formatting and code
- **Appropriate prefixes/suffixes**: "un-", "re-", "-ing", "-ed"
- **Contextual phrases**: "in the context of", "regarding", "about"
- **Legitimate patterns**: Normal conversation flow

### Inappropriate Usage Indicators
- **Hate speech patterns**: "hate", "kill", "attack", "insult"
- **Threatening language**: Direct threats or intimidation
- **Personal attacks**: Targeted harassment
- **Inappropriate phrases**: "i hate", "you are", aggressive patterns
- **Spam patterns**: Repeated or disruptive usage

### Threshold Guidelines
- **10-20%**: Very strict (highly inappropriate words)
- **20-40%**: Standard moderation (recommended default)
- **50-70%**: Lenient (words with many legitimate uses)
- **80-90%**: Very lenient (only blocks obvious abuse)

## Server Settings

### Enable/Disable Feature
The blacklist word feature can be enabled or disabled per server using the `/setup` command:
1. Use `/setup` command
2. Click "🚫 Blacklisted Words"
3. Toggle the feature on/off
4. Configure additional settings

### Recommended Settings
- **Context Analysis**: ✅ Enabled
- **Context Threshold**: 20-30% (balanced approach)
- **Delete Messages**: ✅ Enabled
- **Warn Users**: ✅ Enabled
- **Case Sensitive**: ❌ Disabled (catches more variations)

### Server Behavior Scenarios

**Server with Feature Enabled:**
- ✅ Global words: Enforced
- ✅ Server words: Enforced
- ✅ Full moderation coverage
- ✅ Complete protection

**Server with Feature Disabled:**
- ✅ Global words: Still enforced (bot developer control)
- ❌ Server words: Not enforced (respects server choice)
- ✅ Global protection only
- ✅ Maintains minimum standards

## Database Schema

### BlacklistedWord Model
```javascript
{
    guild: String,           // Guild ID (null for global words)
    word: String,           // The blacklisted word
    addedBy: String,        // User ID who added the word
    addedByUsername: String, // Username for display
    reason: String,         // Optional reason
    enabled: Boolean,       // Whether the word is active
    deleteMessage: Boolean, // Whether to delete messages
    warnUser: Boolean,      // Whether to warn users
    caseSensitive: Boolean, // Whether check is case sensitive
    useContextAnalysis: Boolean, // Whether to use context analysis
    contextThreshold: Number,    // Confidence threshold (0.0-1.0)
    global: Boolean,        // Whether word applies globally
    createdAt: Date,        // When the word was added
    updatedAt: Date         // When the word was last updated
}
```

## Language Support
The feature supports multiple languages through the comprehensive language system:
- **English (en.js)**: Complete translations
- **German (de.js)**: Full German localization
- **Spanish (es.js)**: Complete Spanish translations
- **French (fr.js)**: Full French localization
- **Russian (ru.js)**: Complete Russian translations

All messages, commands, and responses are localized based on the server's language setting.

## Logging System

### Automatic Logging
When server logging is enabled, the system logs all actions to the configured log channel:

**Word Management Events:**
- Word added to blacklist (with reason and settings)
- Word removed from blacklist
- Word enabled/disabled
- Global word creation (bot developers only)

**Message Events:**
- Blacklisted word detected and action taken
- Context analysis decisions (confidence scores)
- Message deletions and user warnings
- System statistics and performance

**Log Information:**
- User details (username, ID)
- Channel information
- Message content (truncated if too long)
- Actions taken (delete, warn, log)
- Context analysis reasoning
- Timestamps and metadata

## Permissions and Security

### Required Permissions
- **Manage Messages**: Required to use all blacklist word commands
- **Administrator**: Required to access the setup command
- **Bot Developers**: Can create global blacklisted words

### Security Features
- **Server-specific words**: Default isolation between servers
- **Global word protection**: Only bot developers can create global words
- **Permission validation**: All commands check user permissions
- **Audit trail**: Complete logging of all actions

## Best Practices

### Word Selection
1. **Focus on inappropriate language** rather than common words
2. **Use context analysis** for words with legitimate uses
3. **Set appropriate thresholds** based on your community
4. **Document reasons** for transparency and maintenance

### Configuration Guidelines
1. **Start conservative**: Begin with a few words and expand gradually
2. **Use context analysis**: It's the key feature that makes this system special
3. **Monitor effectiveness**: Check logs to see how the system is performing
4. **Community feedback**: Listen to your members about false positives/negatives
5. **Regular maintenance**: Review and update your word list periodically

### Threshold Recommendations
- **Highly inappropriate words**: 10-20%
- **Standard moderation**: 20-40%
- **Words with legitimate uses**: 50-70%
- **Very lenient filtering**: 80-90%

## Troubleshooting

### Word Not Being Detected
- **For server words**: Check if the blacklist word feature is enabled in server settings
- **For global words**: These work regardless of server settings
- Verify the word is enabled in the blacklist
- Check case sensitivity settings
- Ensure context threshold isn't too high
- Verify the bot has permission to read messages

### Too Many False Positives
- Increase context threshold
- Enable context analysis
- Review word selection
- Check for legitimate usage patterns

### Messages Not Being Deleted
- Verify the bot has "Manage Messages" permission
- Check if the word has "Delete Message" enabled
- Ensure the bot's role is above the user's role in the hierarchy
- Verify context analysis didn't prevent action

### Warnings Not Being Sent
- Check if the word has "Warn User" enabled
- Verify the bot has permission to send messages in the channel
- Check if the bot has permission to mention users
- Ensure context analysis didn't prevent action

### System Not Working
- Verify feature is enabled in `/setup`
- Check bot permissions
- Review log channel configuration
- Ensure database connectivity

## Integration

The blacklist word feature integrates with:
- **Server settings system**: Feature enable/disable
- **Logging system**: Comprehensive event logging
- **Permission system**: Role-based access control
- **Language system**: Multi-language support
- **Message event handling**: Real-time message processing
- **Database system**: Persistent word storage
- **Context analysis**: Intelligent word evaluation

## Advanced Features

### Global Word Management
- **Bot developers only**: Can create words that apply to all servers
- **Always enforced**: Global words work regardless of individual server settings
- **Server isolation**: Server words don't affect other servers
- **Hierarchical enforcement**: Global words take precedence over server settings
- **Flexible deployment**: Different rules for different communities

### Enforcement Hierarchy
The system follows a specific hierarchy for word enforcement:

**Global Words (Highest Priority):**
- ✅ Always enforced on all servers
- ✅ Work even when server feature is disabled
- ✅ Bot developer control only
- ✅ Take precedence over server settings

**Server Words (Lower Priority):**
- ✅ Only enforced when server feature is enabled
- ✅ Respect individual server settings
- ✅ Server administrator control
- ✅ Can be disabled per server

### Context Analysis Customization
- **Per-word thresholds**: Different sensitivity for different words
- **Analysis enable/disable**: Turn off for simple words
- **Confidence scoring**: Detailed reasoning for decisions

### Action Combinations
- **Delete + Warn**: Remove message and notify user
- **Delete only**: Remove message silently
- **Warn only**: Keep message but warn user
- **Log only**: Monitor without taking action

### Performance Optimization
- **Efficient detection**: Fast word matching algorithms
- **Context caching**: Optimized analysis performance
- **Database indexing**: Quick word lookups
- **Memory management**: Efficient resource usage

This advanced blacklist system provides intelligent, context-aware moderation while maintaining high performance and flexibility for different community needs. 