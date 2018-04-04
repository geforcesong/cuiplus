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
        PlugInBase._registerInJquery(this.name);
        PlugInManager.trigger('cui.init.before.' + this.name);
        this.init();
        PlugInManager.trigger('cui.init.after.' + this.name);
    }

    static _registerInJquery(name) {
        if (!$.fn[name]) {
            $.fn[name] = function () {
                return this;
            };
        }
    }
}

export default PlugInBase;
