import PlugInFactory from './plugin-factory.js';
import PlugInBase from './plugin-base.js';

class Collapse extends PlugInBase {
    constructor(context) {
        super('collapse', context);

        this.defaultOpt = {
            showtext: null,
            hidetext: null,
            once: false,
            isexpand: false,
            showbefore: null,
            showafter: null,
            hidebefore: null,
            hideafter: null
        };
        this.exports = ['_show', '_hide', '_toggle'];
        PlugInFactory.plugin(this);
        $(document).on('dom.load.collapse', function () {
            $('[data-collapse]').each(function (index, item) {
                var $this = $(item);
                var data = $this.data();
                $this.removeAttr('data-collapse');
                $this.collapse(data);
                $this.attr('data-collapse-load', '');
            });
        });
    }

    init(context) {
        var opt = context.opt;
        var $this = context.$element;
        var $target = context.$target = $(opt.target);

        //record the traget's height
        var height = 0;
        if ($target.offset() && $target.offset().top < $this.offset().top) {
            height = $target.height();
        }
        var _showtext = function () {
            if (opt.showtext) {
                if ($this.find('span').length > 0) {
                    $this.find('span').text(opt.showtext);
                } else {
                    $this.text(opt.showtext);
                }
            }
            if (opt.once) {
                $this.hide();
            }
        };
        var _hidetext = function () {
            if (opt.hidetext) {
                if ($this.find('span').length > 0) {
                    $this.find('span').text(opt.hidetext);
                } else {
                    $this.text(opt.hidetext);
                }
            }
        };
        if (opt.isexpand) {
            context._show = function () {
                $this.addClass('shown');
                $target.addClass('collapse-expand');
                _showtext();
            };
            context._hide = function () {
                $this.removeClass('shown');
                $target.removeClass('collapse-expand');
                if (height && height > 0) {
                    $(document).scrollTop($(document).scrollTop() - $target.prop('scrollHeight') + height);
                }
                _hidetext();
            };
        } else {
            context._show = function () {
                $this.addClass('shown');
                $target.show();
                _showtext();
            };
            context._hide = function () {
                $this.removeClass('shown');
                $target.hide();
                if (height && height > 0) {
                    $(document).scrollTop($(document).scrollTop() - height);
                }
                _hidetext();
            };
        }
        context._toggle = function () {
            if ($this.hasClass('shown')) {
                context._hide();
            } else {
                context._show();
            }
        }
    }

    initAfter(context) {
        var $this = context.$element;
        var $target = context.$target;
        var opt = context.opt;
        var _resetForExpand = function () {
            if (!$this.hasClass('shown')) {
                if ($target.prop('scrollHeight') > $target.prop('offsetHeight')) {
                    $this.css('visibility', 'visible');
                } else {
                    $this.css('visibility', 'hidden');
                }
            }
        };
        if (opt.isexpand) {
            $(document).on('dom.resize.collapse', _resetForExpand);
            _resetForExpand();
        }
        if (!opt.isexpand) {
            if ($target.is(':hidden')) {
                context._hide();
            } else {
                context._show();
            }
        }
        $this.on('click.collapse', context._toggle);
    }
}

export default new Collapse({});
