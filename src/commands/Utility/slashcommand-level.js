/*eslint no-unused-vars: "warn"*/
const {
    MessageFlags,
    ApplicationCommandOptionType,
    PermissionsBitField,
    AttachmentBuilder
} = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const LanguageManager = require('../../utils/LanguageManager');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = new ApplicationCommand({
    command: {
        name: 'level',
        description: 'Show your level card',
        type: 1,
        contexts: [0], // 0 = Guild, 1 = BotDM, 2 = PrivateChannel
        options: [
            {
                name: 'user',
                description: 'The user to show the level card for',
                type: ApplicationCommandOptionType.User,
                required: false,
            }
        ],
    },
    options: {
        cooldown: 5000,
    },
    run: async (client, interaction) => {
        // If user has ban permissions, they can view others' lists, otherwise they see their own
        const targetUser = interaction.member.permissions.has([PermissionsBitField.Flags.BanMembers]) 
            ? (interaction.options.getUser('user') || interaction.user)
            : interaction.user;
        
        // Get guild settings for language
        const guildSettings = await client.getDatabaseHandler().findOne('settings', {
            guild: interaction.guildId
        });
        const lang = guildSettings?.language || 'en';
        if (!guildSettings.levelingSystem) {
            return interaction.reply({
                content: LanguageManager.getText('commands.level.disabled', lang),
                flags: [MessageFlags.Ephemeral]
            });
        }
        // Try finding with different possible field names
        const levelingProgress = await client.getDatabaseHandler().findOne('levelingProgress', {
            guild: interaction.guildId,
            user: targetUser.id  // Try with 'user' instead of 'userId'
        });


        if (!levelingProgress) {
            return interaction.reply({
                content: LanguageManager.getText('commands.level.no_progress', lang),
                flags: [MessageFlags.Ephemeral]
            });
        }

        // Create canvas for level card
        const canvas = createCanvas(800, 200); // Width: 800px, Height: 200px
        const ctx = canvas.getContext('2d');

        // Load images
        const background = await loadImage(path.join(__dirname, '../../assets/welcome-bg.png'));
        const avatarFrame = await loadImage(path.join(__dirname, '../../assets/frames.png'));
        
        // Load user avatar
        const avatarURL = targetUser.displayAvatarURL({ extension: 'png', size: 256 });
        const avatar = await loadImage(avatarURL);

        // 1. Draw background first
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Calculate XP values
        const currentXP = levelingProgress?.xp || 0;
        const level = levelingProgress?.level || 0;
        const xpNeeded = Math.floor(100 * level * 3);
        const progress = currentXP / xpNeeded;

        // Draw XP bar
        const barX = 190; // Position after avatar
        const barY = 90;
        const barWidth = 550;
        const barHeight = 30;

        // Set shadow properties
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Background bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 15);
        ctx.fill();

        // Progress bar
        ctx.fillStyle = 'rgb(85, 10, 0)';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth * progress, barHeight, 15);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 3. Draw avatar and frame last
        ctx.save();
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 50, 50, 100, 100);
        ctx.restore();

        // Draw avatar frame
        const frameWidth = 175;
        const frameHeight = (frameWidth * avatarFrame.height) / avatarFrame.width;
        ctx.drawImage(
            avatarFrame,
            35,
            10 - (frameHeight - 175) / 2,
            frameWidth,
            frameHeight
        );

        // Get the display name (nickname if exists, otherwise username)
        const displayName = interaction.guild.members.cache.get(targetUser.id)?.displayName || targetUser.username;

        // Add text last
        ctx.fillStyle = '#000000';
        ctx.font = '900 35px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(displayName, barX + 8, barY - 10);
        
        ctx.textAlign = 'right';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`${currentXP}/${xpNeeded} XP`, barX + barWidth, barY - 5);
        
        ctx.textAlign = 'left';
        ctx.font = '850 25px Arial';
        ctx.fillText(`Level ${level}`, barX + 10, barY + 55);

        // Send the response
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { 
            name: 'level-card.png',
            description: LanguageManager.getText('commands.level.card_description', lang)
        });
        await interaction.reply({
            files: [attachment]
        });
    }
});
