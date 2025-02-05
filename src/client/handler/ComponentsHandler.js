/*eslint no-unused-vars: "warn"*/
const { info, error, success } = require('../../utils/Console');
const { readdirSync } = require('fs');
const DiscordBot = require('../DiscordBot');
const Component = require('../../structure/Component');
const AutocompleteComponent = require('../../structure/AutocompleteComponent');

class ComponentsHandler {
    client;

    /**
   *
   * @param {DiscordBot} client
   */
    constructor(client) {
        this.client = client;
    }

    load = () => {
        for (const directory of readdirSync('./src/components/')) {
            for (const file of readdirSync('./src/components/' + directory).filter(
                (f) => f.endsWith('.js')
            )) {
                try {
                    const module = require('../../components/' + directory + '/' + file);

                    if (!module) continue;

                    // Parse the module data
                    const componentData = module.toJSON ? module.toJSON() : module;

                    if (!componentData) {
                        error(`No component data found in ${file}`);
                        continue;
                    }

                    if (componentData.__type__ === 3) {
                        if (!componentData.customId || !componentData.type || !componentData.run) {
                            error('Unable to load the button/select/modal component ' + file);
                            continue;
                        }

                        switch (componentData.type) {
                        case 'modal': {
                            this.client.collection.components.modals.set(
                                componentData.customId,
                                componentData
                            );
                            break;
                        }
                        case 'select': {
                            this.client.collection.components.selects.set(
                                componentData.customId,
                                componentData
                            );
                            break;
                        }
                        case 'button': {
                            this.client.collection.components.buttons.set(
                                componentData.customId,
                                componentData
                            );
                            break;
                        }
                        default: {
                            error(
                                'Invalid component type (not: button, select, or modal): ' +
                    file
                            );
                            continue;
                        }
                        }

                        info(`Loaded new component (type: ${componentData.type}) : ` + file);
                    } else if (componentData.__type__ === 4) {
                        if (!componentData.commandName || !componentData.run) {
                            error('Unable to load the autocomplete component ' + file);
                            continue;
                        }

                        this.client.collection.components.autocomplete.set(
                            componentData.commandName,
                            componentData
                        );

                        info('Loaded new component (type: autocomplete) : ' + file);
                    } else {
                        error(
                            'Invalid component type ' +
                componentData.__type__ +
                ' from component file ' +
                file
                        );
                    }
                } catch (err) {
                    error(
                        'Unable to load a component from the path: ' +
              'src/components/' +
              directory +
              '/' +
              file +
              '\n' +
              err
                    );
                }
            }
        }

        const componentsCollection = this.client.collection.components;

        success(
            `Successfully loaded ${
                componentsCollection.autocomplete.size +
        componentsCollection.buttons.size +
        componentsCollection.selects.size +
        componentsCollection.modals.size
            } components.`
        );
    };

    reload = () => {
        this.client.collection.components.autocomplete.clear();
        this.client.collection.components.buttons.clear();
        this.client.collection.components.modals.clear();
        this.client.collection.components.selects.clear();

        this.load();
    };
}

module.exports = ComponentsHandler;
