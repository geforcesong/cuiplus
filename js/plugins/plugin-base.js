import PlugInManager from './plugin-manager.js';

class PlugInBase {
    constructor(name) {
        this.name = name;
        this.defaultOpt = {};
    }

    init() {
        throw new Error(`${this.name} is not initialized.`);
    }

    register() {
        this.createPlugIn();
        PlugInManager.trigger('cui.init.before.' + this.name);
        this.init();
        PlugInManager.trigger('cui.init.after.' + this.name);
    }

    createPlugIn() {
        throw new Error(`Plugin ${this.name} is not created.`);
    }
}

export default PlugInBase;
