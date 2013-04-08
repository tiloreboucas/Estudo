(function ($) {
    $.fn.searchfilter = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var sf_attr = {
            'target': '',
            'button': null,
            'box': null
        };

        var sf_methods = {
            init: function (options) {
                var $this = this;

                $this.sf_attr = $.extend(true, {}, sf_attr, options);
                $this.sf_attr.target = $(this);

                sf_methods.build.call($this);
            },

            build: function(){
                var $this = this;

                $this.sf_attr.button = $this.sf_attr.target.find('.advancedSearch');
                $this.sf_attr.box = $this.sf_attr.target.find('.advancedSearchBox');

                sf_methods.bindClick.call($this);  
            },

            bindClick: function(){
                var $this = this;

                $this.sf_attr.button.click(function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    sf_methods.open.call($this)
                });

                $("body").click(function(e){
                    if($(e.target).hasClass("advancedSearchBox") || $(e.target).parents(".advancedSearchBox").size() > 0) return false;

                    sf_methods.close.call($this);
                });
            },

            close: function(){
                var $this = this;
                
                $this.sf_attr.box.hide();
            },

            open: function(){
                var $this = this;

                $this.sf_attr.box.show();
            }
        };

        if (methodName != '') {
            if (sf_methods[methodName]) {
                return this.each(function () {
                    sf_methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.searchfilter");
                return;
            }
        }

        return this.each(function () {
            sf_methods.init.call(this, options);
        });
    };
})(jQuery);