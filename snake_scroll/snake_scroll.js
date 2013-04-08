(function ($) {
    $.fn.paymentlist = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var pl_attr = {
            'target': '',
            'buttons': {
                'toLeft': null,
                'toRight': null
            },
            'index': 0,
            'itens': null
        };

        var pl_methods = {
            init: function (options) {
                var $this = this;

                $this.pl_attr = $.extend(true, {}, pl_attr, options);
                $this.pl_attr.target = $(this);

                pl_methods.build.call($this);
            },

            build: function () {
                var $this = this;

                // Load Buttons
                $this.pl_attr.buttons.toLeft = $this.pl_attr.target.find(".scrolling.left");
                $this.pl_attr.buttons.toRight = $this.pl_attr.target.find(".scrolling.right");
                $this.pl_attr.itens = $this.pl_attr.target.find(".item");

                // Bind Buttons Click
                $this.pl_attr.buttons.toLeft.unbind('click').click(function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    pl_methods.toLeft.call($this, "toLeft");
                });

                $this.pl_attr.buttons.toRight.unbind('click').click(function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    pl_methods.toRight.call($this, "toRight");
                });

                // Show Mode
                if ($this.pl_attr.itens.size() < 11) {
                    pl_methods.viewSmall.call($this);
                } else {
                    pl_methods.viewNormal.call($this);
                }
            },

            viewSmall: function () {
                var $this = this;

                $this.pl_attr.buttons.toLeft.hide();
                $this.pl_attr.buttons.toRight.hide();
            },

            viewNormal: function () {
                var $this = this;

                $this.pl_attr.buttons.toLeft.hide();

                pl_methods.showList.call($this);
            },

            showList: function (from) {
                var $this = this;

                $this.pl_attr.itens.hide();

                var limite = 0;

                if (from == "toRight") {
                    if ($this.pl_attr.index > 0) {
                        if ($this.pl_attr.index == 1) $this.pl_attr.index++;

                        if ($this.pl_attr.index == $this.pl_attr.itens.size() - 9) {
                            $this.pl_attr.buttons.toRight.hide();
                            limite = $this.pl_attr.index + 8;
                        } else {
                            limite = $this.pl_attr.index + 7;
                        }
                    } else {
                        limite = $this.pl_attr.index + 8;
                    }
                } else if (from == "toLeft") {
                    if ($this.pl_attr.index > 0) {
                        if ($this.pl_attr.index == 1) {
                            $this.pl_attr.index--;
                            $this.pl_attr.buttons.toLeft.hide();

                            limite = $this.pl_attr.index + 8;
                        } else {
                            limite = $this.pl_attr.index + 7;
                        }
                        
                        $this.pl_attr.buttons.toRight.show();
                    } else {
                        limite = $this.pl_attr.index + 7;
                    }
                } else {
                    limite = $this.pl_attr.index + 8;
                }

                if ($this.pl_attr.index > 0) $this.pl_attr.buttons.toLeft.show();

                for (var i = $this.pl_attr.index; i <= limite; i++) {
                    $this.pl_attr.itens.eq(i).show();
                }
            },

            toLeft: function () {
                var $this = this;

                if ($this.pl_attr.index > 0) $this.pl_attr.index--;

                pl_methods.showList.call($this, "toLeft");
            },

            toRight: function () {
                var $this = this;

                if ($this.pl_attr.index < $this.pl_attr.itens.length - 8) $this.pl_attr.index++;

                pl_methods.showList.call($this, "toRight");
            },

            refreshList: function () {
                var $this = this;

                $this.pl_attr.itens = $this.pl_attr.target.find(".item");
                $this.pl_attr.index = 0;
                return $(this).each(function () {
                    pl_methods.init.call(this, options);
                });
            }
        };

        if (methodName != '') {
            if (pl_methods[methodName]) {
                return this.each(function () {
                    pl_methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.paymentlist");
                return;
            }
        }

        return this.each(function () {
            pl_methods.init.call(this, options);
        });
    };
})(jQuery);