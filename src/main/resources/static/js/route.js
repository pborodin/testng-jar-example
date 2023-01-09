'use stict';
console.log('Module route.js');

export class Route {
    constructor(config) {
        try {
            if(!config.name || !config.view) {
                throw 'error: name and view params are mandatories';
            }
            this.name = config.name;
            this.htmlName = config.view;
            this.isDefault = config.isDefault;
            this.controller = config.controller;
        } catch (e) {
            console.error(e);
        }
    }
    isActiveRoute (hashedPath) {
        return hashedPath.replace('#', '') === this.name;
    }
}