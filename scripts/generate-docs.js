#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Command Documentation Generator
 * Automatically generates documentation for all bot commands
 */

const COMMANDS_DIR = path.join(__dirname, "../src/commands");
const DOCS_DIR = path.join(__dirname, "../docs/commands");

// Command categories and their descriptions
const CATEGORIES = {
  Information: "Commands that provide information and help to users.",
  Utility: "General utility commands for everyday use.",
  Moderation: "Commands for server moderation and user management.",
  Settings: "Commands for configuring the bot.",
};

// Permission levels
const PERMISSIONS = {
  public: { name: "Public", class: "permission-public", color: "#28a745" },
  moderator: {
    name: "Moderator",
    class: "permission-moderator",
    color: "#ffc107",
  },
  admin: { name: "Admin", class: "permission-admin", color: "#dc3545" },
  developer: { name: "Developer", class: "permission-developer", color: "#6f42c1" },
};

/**
 * Extract command information from a command file
 */
function extractCommandInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Extract command name from filename
    const fileName = path.basename(filePath, ".js");
    const commandName = fileName
      .replace("slashcommand-", "")
      .replace("usercontext-", "");

    // Extract category from directory
    const category = path.basename(path.dirname(filePath));

    // Extract type from module.exports
    const typeMatch = content.match(/type:\s*(\d)/);
    const commandType = typeMatch ? parseInt(typeMatch[1], 10) : 1;
    if (commandType !== 1) {
      // Not a slash command, skip
      return null;
    }

    // Extract description from module.exports
    const descriptionMatch = content.match(
      /description:\s*['"`]([^'"`]+)['"`]/
    );
    const description = descriptionMatch
      ? descriptionMatch[1]
      : "No description available";

    // Extract options/parameters and subcommands
    const optionsMatch = content.match(/options:\s*\[([\s\S]*?)\]/);
    let options = [];
    let subcommands = [];
    
    if (optionsMatch) {
      const optionsContent = optionsMatch[1];
      
      // More robust subcommand extraction
      const subcommandBlocks = optionsContent.match(/{[^}]*name:\s*['"`][^'"`]+['"`][^}]*type:\s*1[^}]*}/g);
      if (subcommandBlocks) {
        subcommandBlocks.forEach(block => {
          const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
          const descMatch = block.match(/description:\s*['"`]([^'"`]+)['"`]/);
          if (nameMatch && descMatch) {
            subcommands.push({
              name: nameMatch[1],
              description: descMatch[1],
            });
          }
        });
      }
      
      // Extract regular options (not subcommands)
      const optionBlocks = optionsContent.match(/{[^}]*name:\s*['"`][^'"`]+['"`][^}]*required:\s*(true|false)[^}]*}/g);
      if (optionBlocks) {
        optionBlocks.forEach(block => {
          // Skip if this is a subcommand
          if (!block.includes('type: 1')) {
            const nameMatch = block.match(/name:\s*['"`]([^'"`]+)['"`]/);
            const descMatch = block.match(/description:\s*['"`]([^'"`]+)['"`]/);
            const requiredMatch = block.match(/required:\s*(true|false)/);
            if (nameMatch && descMatch && requiredMatch) {
              options.push({
                name: nameMatch[1],
                description: descMatch[1],
                required: requiredMatch[1] === "true",
              });
            }
          }
        });
      }
    }

    // Determine permission level based on category and content
    let permission = "public";
    if (category === "Settings") {
      permission = "admin";
    } else if (category === "Moderation") {
      permission = "moderator";
    }
    
    // Check for developer-only features
    if (content.includes("bot_developer_only") || 
        content.includes("client.config.users.developers") ||
        content.includes("global: true") ||
        content.includes("listglobal")) {
      permission = "developer";
    }

    return {
      name: commandName,
      category,
      description,
      options,
      subcommands,
      permission,
      filePath: path.relative(path.join(__dirname, ".."), filePath),
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate markdown documentation for a command
 */
function generateCommandDoc(command) {
  const permissionBadge = `<span class="permission-badge ${
    PERMISSIONS[command.permission].class
  }">${PERMISSIONS[command.permission].name}</span>`;

  let doc = `# ${
    command.name.charAt(0).toUpperCase() + command.name.slice(1)
  } Command

The \`/${command.name}\` command ${command.description.toLowerCase()}

## Usage

\`\`\`bash
/${command.name}${command.subcommands.length > 0 ? " <subcommand>" : command.options.length > 0 ? " [options]" : ""}
\`\`\`

`;

  if (command.subcommands.length > 0) {
    doc += `## Subcommands

| Subcommand | Description |
|------------|-------------|
`;

    command.subcommands.forEach((subcommand) => {
      doc += `| \`${subcommand.name}\` | ${subcommand.description} |\n`;
    });

    doc += "\n## Examples\n\n";
    
    command.subcommands.forEach((subcommand) => {
      doc += `### ${subcommand.name.charAt(0).toUpperCase() + subcommand.name.slice(1)} subcommand\n`;
      doc += `\`\`\`bash\n`;
      doc += `/${command.name} ${subcommand.name}\n`;
      doc += `\`\`\`\n\n`;
    });
  }

  if (command.options.length > 0) {
    doc += `## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
`;

    command.options.forEach((option) => {
      doc += `| \`${option.name}\` | String | ${
        option.required ? "Yes" : "No"
      } | ${option.description} |\n`;
    });

    doc += "\n";
  }

  doc += `## Examples

### Basic usage
\`\`\`bash
/${command.name}
\`\`\`

`;

  if (command.options.length > 0) {
    doc += `### With parameters
\`\`\`bash
/${command.name} parameter1 parameter2
\`\`\`

`;
  }

  doc += `## What it does

This command ${command.description.toLowerCase()}.

## Permissions

- **Required**: ${PERMISSIONS[command.permission].name}
${
  command.permission === "moderator"
    ? "- **Additional**: Manage Messages, Manage Members"
    : ""
}
${command.permission === "admin" ? "- **Additional**: Administrator" : ""}
${command.permission === "developer" ? "- **Additional**: Bot Developer" : ""}

## Response

The command responds with an embed containing relevant information.

## Error Handling

- **Invalid input**: The command handles invalid input gracefully
- **Permission errors**: Graceful handling of missing permissions
- **Network errors**: Proper error handling for external API calls

## Related Commands

- \`/help\` - Get help with commands
- \`/setup\` - Configure bot settings

## Technical Details

- **File**: \`${command.filePath}\`
- **Category**: ${command.category}
- **Type**: Slash Command
- **Framework**: Discord.js v14
`;

  return doc;
}

/**
 * Generate commands overview page
 */
function generateCommandsOverview(commands) {
  let doc = `# Commands Overview

The Warmane Bot provides a comprehensive set of commands organized into different categories. Each command is designed to help manage your Discord server and provide useful World of Warcraft character information.

`;

  // Group commands by category
  const commandsByCategory = {};
  commands.forEach((cmd) => {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push(cmd);
  });

  // Generate sections for each category
  Object.entries(CATEGORIES).forEach(([category, description]) => {
    const categoryCommands = commandsByCategory[category] || [];
    if (categoryCommands.length === 0) return;

    const emoji = {
      Information: "📚",
      Utility: "🛠️",
      Moderation: "🛡️",
      Settings: "⚙️",
    }[category];

    doc += `## ${emoji} ${category} Commands

${description}

| Command | Description | Usage | Permission |
|---------|-------------|-------|------------|
`;

    categoryCommands.forEach((cmd) => {
      const permissionBadge = `<span class="permission-badge ${
        PERMISSIONS[cmd.permission].class
      }">${PERMISSIONS[cmd.permission].name}</span>`;
      const usage = `\`/${cmd.name}${
        cmd.options.length > 0 ? " [options]" : ""
      }\``;

      doc += `| [${cmd.name}](commands/${cmd.name}.md) | ${cmd.description} | ${usage} | ${permissionBadge} |\n`;
    });

    doc += "\n";
  });

  return doc;
}

/**
 * Main function
 */
function main() {
  console.log("🔧 Generating command documentation...");

  // Ensure docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  const commands = [];

  // Process each category directory
  Object.keys(CATEGORIES).forEach((category) => {
    const categoryDir = path.join(COMMANDS_DIR, category);
    if (!fs.existsSync(categoryDir)) return;

    const files = fs.readdirSync(categoryDir);
    files.forEach((file) => {
      if (file.endsWith(".js")) {
        // Skip user context and message context menu commands
        if (file.startsWith("usercontext-") || file.startsWith("messagecontext-")) return;
        const filePath = path.join(categoryDir, file);
        const commandInfo = extractCommandInfo(filePath);
        if (commandInfo) {
          commands.push(commandInfo);
        }
      }
    });
  });

  // Generate individual command documentation
  commands.forEach((command) => {
    const docPath = path.join(DOCS_DIR, `${command.name}.md`);
    const docContent = generateCommandDoc(command);
    fs.writeFileSync(docPath, docContent);
    console.log(`✅ Generated: ${command.name}.md`);
  });

  // Generate commands overview
  const overviewPath = path.join(__dirname, "../docs/commands.md");
  const overviewContent = generateCommandsOverview(commands);
  fs.writeFileSync(overviewPath, overviewContent);
  console.log("✅ Generated: commands.md");

  // Generate sidebar
  const sidebarPath = path.join(__dirname, "../docs/_sidebar.md");
  const sidebarContent = generateSidebar(commands);
  fs.writeFileSync(sidebarPath, sidebarContent);
  console.log("✅ Generated: _sidebar.md");

  console.log(`\n🎉 Documentation generated for ${commands.length} commands!`);
}

/**
 * Generate sidebar navigation
 */
function generateSidebar(commands) {
  let sidebar = `<!-- docs/_sidebar.md -->

* [🏠 Home](/)
* [📚 Commands](commands.md)
* [💡 Examples](examples.md)
* [🐛 Troubleshooting](troubleshooting.md)
* [🔒 Privacy Policy](PRIVACY_POLICY.md)
`;

  // Group commands by category
  const commandsByCategory = {};
  commands.forEach((cmd) => {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push(cmd);
  });

  // Generate sections for each category as bold list items
  Object.entries(CATEGORIES).forEach(([category, description]) => {
    const categoryCommands = commandsByCategory[category] || [];
    if (categoryCommands.length === 0) return;

    const emoji = {
      Information: "📚",
      Utility: "🛠️",
      Moderation: "🛡️",
      Settings: "⚙️",
    }[category];

    sidebar += `\n* **${emoji} ${category}**\n`;
    categoryCommands.forEach((cmd) => {
      sidebar += `  * [${cmd.name}](commands/${cmd.name}.md)\n`;
    });
  });

  sidebar += `\n`;

  return sidebar;
}

// Run the generator
if (require.main === module) {
  main();
}

module.exports = { main, extractCommandInfo, generateCommandDoc };
