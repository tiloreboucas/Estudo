(function ($) {
    $.fn.customselect = function (method) {

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
            'target': '',
            'container': '',
            'overload': '',
            'label': '',
            'labelContainer': null,
            'onChange': function () { $.noop() },   // Ao Selecionar
            'onOpen': function () { $.noop() },     // Ao Abrir
            'onClick': null,    // Ao Adicionar
            'listItens': [],
            'list': null,
            'main': null,
            'button': null,
            'ready': false,
            'isReadOnly': false,
            'ordination': "",
            'limit': null
        };

        var methods = {
            init: function (options) {
                var $this = this;

                $this.attr = $.extend(true, {}, attr, options);
                $this.attr.target = $(this);

                $this.attr.ready = ($this.attr.target.parents('.customselect_container').size() > 0);

                methods.build.call($this);
                if (($this.attr.target.val() != "") && ($this.attr.target.val() != undefined)) methods.setValue.call($this, $this.attr.target.val());
            },

            build: function () {
                var $this = this;

                if (($this.attr.target[0].dataset.label != "") && ($this.attr.target[0].dataset.label != undefined)) { $this.attr.label = $this.attr.target[0].dataset.label; }
                if (($this.attr.target[0].dataset.limit != "") && ($this.attr.target[0].dataset.limit != undefined)) { $this.attr.limit = $this.attr.target[0].dataset.limit; }

                if (!$this.attr.ready) $($this).wrap('<div class="customselect_container" />');
                $this.attr.container = $($this).parents(".customselect_container");

                if (!$this.attr.ready) $($this.attr.container).wrap('<div class="customselect_main" />');
                $this.attr.main = $($this.attr.container).parents(".customselect_main");

                if (!$this.attr.ready) $('<div class="customselect_label"></div>').appendTo($this.attr.container);
                $this.attr.labelContainer = $($this.attr.container).find('.customselect_label')[0];

                if (!$this.attr.ready) $('<button type="button" class="customselect_button"></button>').appendTo($this.attr.container);

                $this.attr.button = $($this.attr.container).find('.customselect_button');

                // Abrir
                //if (!$this.attr.ready) methods.startButton.call($this);
                methods.startButton.call($this);

                methods.setLabel.call($this, $this.attr.label);

                if (!$this.attr.ready) $('<ul class="custonselect_list close"></ul>').appendTo($this.attr.container);
                if (($this.attr.target[0].dataset.ordination != "") && ($this.attr.target[0].dataset.ordination != undefined)) $this.attr.ordination = $this.attr.target[0].dataset.ordination;
    
                else $this.attr.ordination = 'asc';

                $this.attr.list = $($this.attr.container).find('.custonselect_list');
                methods.overloadItens.call($this);

                if ($this.attr.limit) {
                    methods.showList.call($this);
                    var maxHeight = $($this.attr.list).find('li').eq(0).outerHeight(true) * parseInt($this.attr.limit);
                    methods.hideList.call($this);
                    $($this.attr.list).css({ 'max-height': maxHeight });
                }

                if (($this.attr.target[0].dataset.readonly != "") && ($this.attr.target[0].dataset.readonly != undefined)) $this.attr.isReadOnly = $this.attr.target[0].dataset.readonly;
                else $this.attr.isReadOnly = false;

                if ($this.attr.isReadOnly) methods.toReadOnly.call($this);

                if (!$this.attr.ready && $this.attr.onClick) methods.createSearch.call($this);

                // Required
                if ($this.attr.target.hasClass("required")) if (!$this.attr.main.hasClass("required")) $this.attr.main.addClass("required");
            },

            createSearch: function () {
                var $this = this;

                var markup = '' +
                '<li><div class="custonselect_search">' +
                    '<div class="custonselect_search_label">Adicionar Novo</div>' +
                    '<div class="custonselect_search_container">' +
                        '<div class="custonselect_search_box">' +
                            '<input class="custonselect_search_input" type="text" placeholder="Adicionar Registro" />' +
                        '</div>' +
                        '<button type="button" class="custonselect_search_button">ok</button>' +
                    '</div>' +
                '</div></li>';

                $(markup).appendTo($this.attr.list);

                $this.attr.search_label = $this.attr.list.find('.custonselect_search_label');
                $this.attr.search_container = $this.attr.list.find('.custonselect_search_container');
                $this.attr.search_box = $this.attr.list.find('.custonselect_search_box');
                $this.attr.search_input = $this.attr.list.find('.custonselect_search_box input');
                $this.attr.search_button = $this.attr.list.find('.custonselect_search_button');

                $this.attr.search_input.click(function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }); ;

                $this.attr.search_label.click(function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $this.attr.search_label.hide();
                    $this.attr.search_container.show();

                    $this.attr.search_input[0].focus();
                });

                $this.attr.search_button.click(function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var obj = $this.attr.onClick($this);

                    return false;
                });
            },

            onFocus: function () {
                var $this = this;

                $($this.attr.main).focusin(function () {
                    if ($this.attr.isReadOnly) return false;

                    $($this.attr.main).unbind().keydown(function (e) {
                        e.isDefaultPrevented();

                        var valueLi = null;
                        var textLi = null;
                        var i = null;

                        if (($this.attr.target[0].dataset.index != "") && ($this.attr.target[0].dataset.index != undefined)) i = parseInt($this.attr.target[0].dataset.index);

                        if (e.which == 40) {
                            if (i == null) {
                                i = 0;
                            } else if (i >= 0 && i < $this.attr.listItens.length - 1) {
                                i++;
                            }
                        } else if (e.which == 38) {
                            if (i == null) {
                                i = 0;
                            } else if (i > 0) {
                                i--;
                            }
                        }

                        $this.attr.target[0].dataset.index = i;

                        valueLi = $this.attr.listItens[i].value;
                        textLi = $this.attr.listItens[i].text;

                        methods.refreshHidden.call($this, valueLi);
                        methods.hideList.call($this);
                        methods.setLabel.call($this, textLi);
                        if ($this.attr.onChange) $this.attr.onChange();
                    });
                });
            },

            startButton: function () {
                var $this = this;

                $($this.attr.button).unbind('click').click(function (e) {
                    if ($($this.attr.list).hasClass('close')) {
                        $this.attr.onOpen();
                        methods.showList.call($this);
                        $this.attr.target.msgbox("hide");

                    } else methods.hideList.call($this);

                    return false;
                });

                $($this.attr.labelContainer).unbind('click').click(function (e) {
                    if ($($this.attr.list).hasClass('close')) {
                        $this.attr.onOpen();
                        methods.showList.call($this);
                        $this.attr.target.msgbox("hide");

                    } else methods.hideList.call($this);

                    return false;
                });

                $('body').click(function () {
                    $('.custonselect_list.open').removeClass('open').addClass('close');
                    $('.customselect_container.active').removeClass('active');
                });
            },

            stopButton: function () {
                var $this = this;

                $($this.attr.button).unbind();
                $($this.attr.labelContainer).unbind();
            },

            setLabel: function (label) {
                var $this = this;

                $($this.attr.labelContainer).text(label);
            },

            buildListItens: function () {
                //console.log('buildListItens');
                var $this = this;

                if (($this.attr.target[0].dataset.overload != "") && ($this.attr.target[0].dataset.overload != undefined)) {
                    //console.log("true");
                    $this.attr.overload = $this.attr.target[0].dataset.overload;

                    var list = $this.attr.overload.split(',');

                    var objListItens = [];

                    $(list).each(function (i, item) {
                        if (item) {
                            var obj = {
                                value: item.split('|')[0],
                                text: item.split('|')[1].replace(/\&#44;/g, ',').replace(/\&#124;/g, '|')
                            };

                            objListItens.push(obj);
                        }
                    });

                    var ordened = null;

                    function byTextAsc(a, b) { return a.text > b.text; }
                    function byTextDesc(a, b) { return a.text < b.text; }

                    if ($this.attr.ordination == 'desc')
                        objListItens.sort(byTextDesc);
                    else
                        objListItens.sort(byTextAsc);

                    $this.attr.listItens = objListItens;
                } else {
                    //console.log("false");
                    $this.attr.listItens = [];
                }
            },

            overloadItens: function () {
                //console.log('overloadItens');
                var $this = this;

                methods.buildListItens.call($this);

                $($this.attr.list).html('');

                if ($($this.attr.listItens).size() > 0) {
                    //console.log("true");
                    $($this.attr.listItens).each(function (i, item) {
                        $('<li data-value="' + item.value + '"><span>' + item.text + '</span></li>').appendTo($this.attr.list);
                    });

                    var itemGroup = $($this.attr.list).find('li span');

                    $(itemGroup).unbind("click").click(function () {

                        var valueLi = $(this).parent()[0].dataset.value;
                        var textLi = $(this).text();
                        methods.refreshHidden.call($this, valueLi);
                        methods.hideList.call($this);
                        methods.setLabel.call($this, textLi);
                        if ($this.attr.onChange) $this.attr.onChange();
                        return false;
                    });
                } else {
                    //console.log("false");
                }
            },

            refresh: function () {
                var $this = this;

                methods.overloadItens.call($this);
                methods.setLabel.call($this, $this.attr.label);
                methods.startButton.call($this);

                try {
                    if ($this.attr.target.hasClass("required")) {
                        if (!$this.attr.main.hasClass("required")) $this.attr.main.addClass("required");
                    } else {
                        if ($this.attr.main.hasClass("required")) $this.attr.main.removeClass("required");
                    }
                } catch(e){
                    console.log(e.message);
                }                
            },

            clear: function () {
                var $this = this;
                methods.overloadItens.call($this);
                methods.setLabel.call($this, $this.attr.label);
                methods.refreshHidden.call($this, "");
            },

            setValue: function (newValue) {
                var $this = this;

                $($this.attr.listItens).each(function (i, item) {
                    if (item.value == newValue) {
                        methods.setLabel.call($this, item.text);
                        methods.refreshHidden.call($this, item.value);
                    }
                });
            },

            toReadOnly: function () {
                var $this = this;

                $this.attr.target.attr('readonly', 'readonly');
                $this.attr.main.addClass('readonly');
                methods.stopButton.call($this);
            },

            toReadAndWrite: function () {
                var $this = this;

                $this.attr.target.removeAttr('readonly');
                $this.attr.target.removeAttr('data-readonly');
                $this.attr.main.removeClass('readonly');
                $this.attr.isReadOnly = false;

                methods.startButton.call($this);
            },

            addNewItem: function (obj) {

                if (obj) {
                    var $this = this;

                    var oldOver = $this.attr.target[0].dataset.overload;
                    var newOver = oldOver + (oldOver.length > 0 ? ',' : '') + obj.id + '|' + obj.text;
                    $this.attr.target[0].dataset.overload = newOver;

                    methods.overloadItens.call($this);
                    methods.setLabel.call($this, obj.text.replace(/\&#44;/g, ',').replace(/\&#124;/g, '|'));
                    methods.refreshHidden.call($this, obj.id);
                }
            },

            showList: function () {
                var $this = this;
                $('.customselect_container.active').removeClass('active');
                $('.custonselect_list.open').removeClass('open').addClass('close');

                $($this.attr.list).removeClass('close').addClass('open');
                $($this.attr.container).addClass('active');
            },

            hideList: function () {
                var $this = this;
                $($this.attr.list).removeClass('open').addClass('close');
            },

            refreshHidden: function (value) {
                var $this = this;
                $this.attr.target.val(value);
            },

            onOpen: function (func) {
                var $this = this;

                $this.attr.onOpen = func;
            },

            onClick: function (func) {
                var $this = this;

                $this.attr.onClick = func;
            },

            onChange: function (func) {
                var $this = this;

                $this.attr.onChange = func;
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.customselect");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);