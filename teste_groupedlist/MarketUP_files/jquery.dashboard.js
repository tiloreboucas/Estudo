(function ($) {
    $.fn.dashboard = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var attr = {
            'target': null,
            'container': null,
            'userState': 'open',
            'dashState': 'open',
            'button': null
        };

        var methods = {
            init: function (options) {
                var $this = this;

                $this.attr = $.extend(true, {}, attr, options);
                $this.attr.target = $(this);

                methods.build.call($this);
            },

            build: function () {
                var $this = this;

                $this.attr.container = $('.MainSection');
                $this.attr.button = $('.dashboardReadingButton');

                if($this.attr.container.hasClass("noDashboard")) {
                    $this.attr.container.find('.headerDashboard').hide();
                    return false;
                }

                if ($this.attr.dashState == 'open') {
                    methods.open.call($this);
                } else {
                    methods.close.call($this);
                }

                window.dashboard = $this;

                if(!$('html').hasClass('ipad')){
                    $(window).scroll(function () {
                        var $this = window.dashboard;

                        if (($('body')[0].scrollTop > 150) && ($this.attr.dashState == 'open')) {
                            methods.close.call($this);
                        } else if (($('body')[0].scrollTop < 10) && ($this.attr.dashState == 'close') && ($this.attr.userState == 'open')) {
                            methods.open.call($this);
                        }
                    });
                }

                $($this.attr.button).click(function () {
                    if ($this.attr.dashState == 'open') {
                        methods.close.call($this);
                        $this.attr.userState = 'close';
                    } else {
                        methods.open.call($this);
                        $this.attr.userState = 'open';
                    }

                    sessionStorage["mktup_dashboard_status"] = $this.attr.userState;
                });
            },

            close: function () {
                var $this = this;

                $($this.attr.container).addClass('DashboardClose').removeClass('DashboardOpen');
                $($this.attr.target).addClass('close').removeClass('open');
                $this.attr.dashState = 'close';
            },

            open: function () {
                var $this = this;

                $($this.attr.container).addClass('DashboardOpen').removeClass('DashboardClose');
                $($this.attr.target).addClass('open').removeClass('close');
                $this.attr.dashState = 'open';
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.dashboard");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);