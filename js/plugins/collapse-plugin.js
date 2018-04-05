import PlugInBase from './plugin-base.js';

class Collapse extends PlugInBase {
    constructor(context) {
        super('collapse', context);
    }

    init() {
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

    createPlugIn() {
        const that = this;
        if (!$.fn[this.name]) {
            $.fn[this.name] = function (dataOpt) {
                this.click(function () {
                    that.toggle($(this), dataOpt);
                });
            };
        }
    }

    toggle($this, dataOpt) {
        const $target = $(dataOpt.target);
        let height = 0;
        if ($target.offset() && $target.offset().top < $this.offset().top) {
            height = $target.height();
        }
        if ($this.hasClass('shown')) {
            $this.removeClass('shown');
            $target.hide();
            if (height && height > 0) {
                $(document).scrollTop($(document).scrollTop() - height);
            }
            if (dataOpt.showtext) {
                $this.html(dataOpt.showtext);
            }
        } else {
            $this.addClass('shown');
            $target.show();
            if (dataOpt.hidetext) {
                $this.html(dataOpt.hidetext);
            }
        }
    }
}

export default Collapse;
