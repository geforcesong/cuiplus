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
        this.trigger('cui.init.before.' + this.name);
        this.init();
        this.trigger('cui.init.after.' + this.name);
    }

    createPlugIn() {
        throw new Error(`Plugin ${this.name} is not created.`);
    }

    trigger(name, params) {
        $(document).trigger(name, params);
    }
}

export default PlugInBase;
