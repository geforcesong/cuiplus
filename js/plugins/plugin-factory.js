class PlugInFactory {
    plugin(pluginContext) {
        var name = pluginContext.name;
        var that = this;
        if ($.fn[name]) {
            /*eslint no-console: ["error", { allow: ["log"] }] */
            console.log('the plugin is exists: ' + name);
            return null;
        }
        $.fn[name] = function (options) {
            var $this = $(this);
            var cache = $this.data(name);
            if (cache && typeof (cache) !== 'string') {
                if (options) {
                    cache.setOptions && cache.setOptions(options);
                }
                return cache;
            }
            var context = $.extend({
                $element: $this,
                name: '',
                defaultOpt: null,
                initBefore: null,
                init: null,
                initAfter: null,
                setOptionsBefore: null,
                setOptionsAfter: null,
                destroyBefore: null,
                exports: {},
                isThirdPart: false
            }, pluginContext);
            context.options = options;
            context.$element = $this;
            var excutePlugin = function () {
                var obj = $.proxy(that.create, this)(context);
                $this.data(name, obj);
                return obj;
            };
       
            return excutePlugin();
        };
    }

    create(context) {
        var that = this;
        context.opt = $.extend(true, {}, context.defaultOpt, context.options);
        $.proxy(this.handleInit, that)(context);
        return context.exports;
    }

    handleOptions(context) {
        var that = this;
        return function (options) {
            context.setOptionsBefore && $.proxy(context.setOptionsBefore, that)(context, options);
            context.opt = $.extend(context.opt, options);
            context.setOptionsAfter && $.proxy(context.setOptionsAfter, that)(context, options);
        };
    }

    handleInit(context) {
        var that = this;
        var opt = context.opt;
        context.exports = context.exports || {};

        //before plugin initial event
        this.trigger('cui.init.before.' + context.name, context);
        opt.initbefore && that.trigger(opt.initbefore, context);

        //before plugin initial custom event
        context.initBefore && that.trigger(context.initBefore, context);
        context.init && $.proxy(context.init, that)(context);

        //is third part plugin
        if (context.isThirdPart && context.exports.original) {
            context.exports.original = $.isFunction(context.exports.original) ? $.proxy(context.exports.original, context)() : context.exports.original;
        } else {
            //add exports for the plugin
            $.proxy(that.handleExports, that)(context);

            //initial get options of plugin
            context.exports.getOptions = function () {
                return opt;
            };

            //initial set options of plugin
            context.exports.setOptions = $.proxy(that.handleOptions, that)(context);

            //destroy export for the plugin
            context.exports.destroy = $.proxy(that.handleDestroy, that)(context);
        }

        //after plugin initial custom event
        context.initAfter && $.proxy(context.initAfter, that)(context);
        opt.initafter && that.trigger(opt.initafter, context);

        //after plugin initial event
        that.trigger('cui.init.after.' + context.name, context);
    }

    handleDestroy(context) {
        var that = this;
        return function () {
            //before plugin destroy event
            that.trigger('cui.before.destroy.' + context.name, context);

            //before plugin destroy custom event
            $.proxy(context.destroyBefore, that)(context);
            context.$element.data(context.name, null);
        };
    }

    handleExports(context) {
        if (context.exports) {
            var obj = {};
            $.each(context.exports, function (key, value) {
                if ($.isFunction(value)) {
                    //export method for the plugin
                    obj[key] = $.proxy(value, context);
                }
            });
            obj.name = context.name;
            context.exports = obj;
        }
    }

    trigger(name, context) {
        var params = [context.$element, context.exports];
        var array = Array.prototype.slice.call(arguments);
        params.concat(array.slice(2, array.length));
        if ($.isFunction(name)) {
            name.apply(this, params);
        } else {
            $(document).trigger(name, params);
        }
    }
}

export default new PlugInFactory();