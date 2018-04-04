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
        if (!$.fn[this.name]) {
            $.fn[this.name] = function (data) {
                this.click(function () {
                    $(data.target).slideToggle();
                });
            };
        }
    }
}

export default Collapse;
