const AutocompleteComponent = require('../../structure/AutocompleteComponent');

module.exports = new AutocompleteComponent({
    commandName: 'guild-leave',
    run: async (client, interaction) => {

        const focusedValue = interaction.options.getFocused().toLowerCase();

        const choices = interaction.client.guilds.cache
            .map((guild) => ({
                name: guild.name,
                value: guild.id,
            }));
    
    
        const filteredChoices = choices
            .filter((choice) => choice.name.toLowerCase().includes(focusedValue))
            .slice(0, 25);
    
        await interaction.respond(filteredChoices);
    },
});