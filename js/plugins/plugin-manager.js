class PluginManager {
    static trigger(name, params) {
        $(document).trigger(name, params);
    }
}

export default PluginManager;
