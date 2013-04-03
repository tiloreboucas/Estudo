(function ($) {
    $.fn.msgbox = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var mb_attr = {
            'target': null,
            'container': null,
            'msg': '',
            'msgbox_main': null,
            'maxWidth': null,
            'type': 'hint',
            'autoShow': false,
            'msgbox_arrow': null,
            'isReady': false
        };

        var methods = {
            init: function (options) {
                var $this = this;

                $this.mb_attr = $.extend(true, {}, mb_attr, options);
                $this.mb_attr.target = $(this);
                $this.mb_attr.isReady = $this.mb_attr.target.parent().hasClass("msgbox_container");


                methods.build.call($this);
            },

            build: function () {
                var $this = this;

                if (!$this.mb_attr.isReady) $($this.mb_attr.target).wrap("<div class='msgbox_container' />");
                $this.mb_attr.container = $($this.mb_attr.target).parent();

                if (!$this.mb_attr.isReady) $($this.mb_attr.container).prepend("<div class='msgbox_main' />");
                $this.mb_attr.msgbox_main = $($this.mb_attr.container).find('.msgbox_main');
                $($this.mb_attr.msgbox_main).addClass($this.mb_attr.type);

                $($this.mb_attr.msgbox_main).css({
                    'bottom': $($this.mb_attr.target).outerHeight(true)
                });

                if (!$this.mb_attr.isReady) $($this.mb_attr.msgbox_main).append($this.mb_attr.msg);

                if (!$this.mb_attr.isReady) $($this.mb_attr.msgbox_main).append('<img class="msgbox_arrow" src="img/arrow_down_' + $this.mb_attr.type + '.png" alt="" />')

                $this.mb_attr.msgbox_arrow = $($this.mb_attr.msgbox_main).find('.msgbox_arrow');

                $($this.mb_attr.msgbox_arrow).css({
                    'left': ($($this.mb_attr.msgbox_main).width() / 2) - ($($this.mb_attr.msgbox_arrow).width() / 2)
                });

                if ($this.mb_attr.autoShow) {
                    methods.show.call($this);
                }
            },

            show: function () {
                var $this = this;
                var st = 0;
                var l = 0;
                $($this.mb_attr.msgbox_main).show();

                //console.log(($($this.mb_attr.msgbox_main).width() / 2) - ($($this.mb_attr.msgbox_arrow).width() / 2));

                l = ($this.mb_attr.msgbox_main.width() / 2) - ($this.mb_attr.msgbox_arrow.width() / 2);

                if ($this.mb_attr.target.hasClass("customselect")) {
                    st = $this.mb_attr.container.parents(".customselect_main").offset().top;
                    l = ($this.mb_attr.msgbox_main.width() / 2) - ($this.mb_attr.msgbox_arrow.width() / 2);
                } else if ($this.mb_attr.target.parents(".fieldContent").size() > 0) {
                    st = $this.mb_attr.target.parents(".fieldContent").parent().offset().top;
                    l = ($this.mb_attr.msgbox_main.width() / 2) - ($this.mb_attr.msgbox_arrow.width() / 2);
                } else {
                    st = $this.mb_attr.container.offset().top;
                    l = ($this.mb_attr.msgbox_main.width() / 2) - ($this.mb_attr.msgbox_arrow.width() / 2);
                }

                if(l < 20) l = 20;

                $($this.mb_attr.msgbox_arrow).css({
                    'left': l
                });

                $("body").animate({ scrollTop: st - ($(window).height() / 2) }, 100);
            },

            hide: function () {
                var $this = this;

                if ($this.mb_attr != undefined) $($this.mb_attr.msgbox_main).hide();
            },

            remove: function () {
                var $this = this;

                if ($this.mb_attr) {
                    $this.mb_attr.msgbox_main.remove();
                    $this.mb_attr.container.children().first().unwrap();
                }
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.msgbox");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);