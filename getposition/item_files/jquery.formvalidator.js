var formValidatorCurrency = "R$";

String.prototype.removePart = function(start,finish) { return this.substr(0,start) + this.substr(finish); };

(function ($) {
    $.fn.formvalidator = function (method) {

        var options = null;
        var methodName = '';
        var params = [];


         var attr = {
            target: '',
            container: '',
            callback: function () { $.noop() },
            valid: false,
            group: null,
            securitylock: true,
            keypress: false,
            invalidGroup: [],
            hasVisibleStatusMsg: false,
            statusMsg: true,
            presetGroup: null,
            requiredGroup: [],
            bypass: false
        };

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
            if( params && params.bypass) attr.bypass = true;
        }
       
        var methods = {
            init: function (options) {
                var $this = this;

                $this.attr = $.extend(true, {}, attr, options);
                $this.attr.target = $(this);

                if($this.attr.bypass) {
                    $this.attr.requiredGroup = $this.attr.target.find('.required.bypass').not("[type='radio']").not("[type='checkbox']").not("div");
                    $this.attr.presetGroup = $this.attr.target.find('.preset.bypass').not("[type='radio']").not("[type='checkbox']").not("div");
                } else {
                    $this.attr.requiredGroup = $this.attr.target.find('.required').not(".bypass").not("[type='radio']").not("[type='checkbox']").not("div");
                    $this.attr.presetGroup = $this.attr.target.find('.preset').not(".bypass").not("[type='radio']").not("[type='checkbox']").not("div");
                }

                for(var i = 0; i < $this.attr.requiredGroup.length; i++){
                    for(var j = 0; j < $this.attr.presetGroup.length; j++){
                        if($this.attr.requiredGroup[i] == $this.attr.presetGroup[j]) $this.attr.presetGroup.splice([j], 1);
                    }
                }

                $this.attr.group = $($.merge( $.merge([],$this.attr.requiredGroup), $this.attr.presetGroup));

                $this.attr.group.each(function(i, item){
                    if($(item).hasClass("required")){
                        $(item).msgbox({
                            'type': 'erro',
                            'msg': 'Item obrigatório',
                            'autoShow': false
                        });
                    } else if ($(item).hasClass("preset")){
                        $(item).msgbox({
                            'type': 'hint',
                            'msg': 'Formato Inválido',
                            'autoShow': false
                        });

                        methods.startPresetFocusOutValidation.call($this, item);
                    }

                    methods.startFocusIn.call($this, item);
                });

                $this.attr.presetGroup = $this.attr.target.find('.preset');
                methods.startMask.call($this);

                methods.forceFormat.call($this);
            },

            forceFormat: function(item){
                var $this = this;
                
                $this.attr.presetGroup.each(function(i, item){
                    var isNumber = new RegExp(/^[0-9]+$/);
                
                    if ($(item).hasClass('cnpj')) {
                        if(item.value.length > 0 && item.value.length != 18 && item.value[2] != "."){
                            item.value = item.value.substr(0,2) + "." + item.value.substr(2,3) + "." + item.value.substr(5,3) + "/" + item.value.substr(8,4) + "-" + item.value.substr(12,2);
                        }
                    } else if ($(item).hasClass('cpf')) {
                        if(item.value.length > 0 && item.value.length != 14 && item.value[3] != "."){
                            item.value = item.value.substr(0,3) + "." + item.value.substr(3,3) + "." + item.value.substr(6,3) + "-" + item.value.substr(9,2);
                        }
                    } else if ($(item).hasClass("phone")) {
                    } else if ($(item).hasClass("cep")) {
                        if(item.value.length > 0 && item.value.length != 9 && item.value[5] != "-"){
                            item.value = item.value.substr(0,5) + "-" + item.value.substr(5,3);
                        }   
                    } else if ($(item).hasClass('currency')) {
                        if(item.value == "0") item.value = "R$ 0,00"; 
                        else {
                            var v = moeda.desformatar(item.value);
                            item.value = "R$ " + moeda.formatar(v);
                        }
                    } else if ($(item).hasClass('date')) {
                        if(item.value.length > 0 && item.value.length != 10 && item.value.indexOf("/") < 0){
                            item.value = item.value.substr(0,2) + "/" + item.value.substr(2,2) + "/" + item.value.substr(4,4);
                        }
                    }
                });
            },

            startFocusIn: function(item) {
                var $this = this;

                $(item).focusin(function(){
                    $(item).msgbox("hide");
                });
            },

            startPresetFocusOutValidation: function(item) {
                var $this = this;

                $(item).focusout(function(){
                    $(item).removeClass("preseterror").removeClass("presetvalidated");
                    methods.testPresetItem.call($this, item); 
                    if($(item).hasClass("preseterror") && item.value != "") $(item).msgbox("show")
                });
            },

            startMask: function() {
                var $this = this;

                $this.attr.presetGroup.each(function(i, item){
                    methods.mask.call($this, item);
                });
            },

            changeMsgType: function(obj) {
                var $this = this;

                $(obj.item).msgbox("remove").msgbox({
                    'type': obj.type,
                    'msg': obj.msg,
                    'autoShow': false
                }); 
            },

            validationGroup: function () {
                var $this = this;              
                methods.init.call($this);

                $this.attr.group.each(function(i, item){
                    if($(item).hasClass("required")) {
                        methods.testRequiedItem.call($this, item);
                        
                        if($(item).hasClass("error")){
                        } else if($(item).hasClass("preset")) {
                            methods.testPresetItem.call($this, item);
                        }
                        
                    } else if($(item).hasClass("preset") && item.value != "") {
                        methods.testPresetItem.call($this, item);
                    } else if($(item).hasClass("preseterror") && item.value == "") {
                        methods.testPresetItem.call($this, item);
                    }
                });

                var arr = $this.attr.group;
                for(var i = 0; i < arr.length; i++){
                    var arr_item = $(arr[i]);   
                    if(arr_item.hasClass("error") || arr_item.hasClass("preseterror")) {
                        arr_item.msgbox("show");
                        break;
                    }
                }

                methods.setValidationStatus.call($this);
            },

            addToInvalidGroup: function(item) {
                var $this = this;
                $this.attr.invalidGroup.push(item);
            },

            resetInvalidGroup: function() {
                var $this = this;
                $this.attr.invalidGroup = [];
            },

            removeToInvalidGroup: function(obj) {
                var $this = this;
                
                $($this.attr.invalidGroup).each(function(i, item){
                    if(obj == item) {
                        $this.attr.invalidGroup.splice(i, 1);
                        methods.removeStatusMsg.call($this, obj);
                        return false;
                    }
                });
            },

            showMsgStepByStep: function() {
                var $this = this;

                if($this.attr.invalidGroup[0]) methods.showStatusMsg.call($this, $this.attr.invalidGroup[0]);
            },

            removeMsgStepByStep: function() {
                var $this = this;
                $($this.attr.invalidGroup).each(function(i, item){
                    methods.removeStatusMsg.call($this, item);  
                });

                $this.attr.hasVisibleStatusMsg = false;
            },

            showStatusMsg: function(item) {
                var $this = this;
                $(item).msgbox("show");
                $(item).focus();
                $this.attr.hasVisibleStatusMsg = true;
            },

            removeStatusMsg: function(item) {
                var $this = this;
                $(item).msgbox('hide');    
            },

            testRequiedItem: function (item) {
                var $this = this;

                $(item).msgbox("remove").msgbox({
                    'type': 'erro',
                    'msg': 'Item obrigatório',
                    'autoShow': false
                });

                if ((item.type == 'radio') || (item.type == 'checkbox')) {
                    var strQuery = $(item).attr('name');
                    var radioStatus = false;
                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (item.checked) radioStatus = true;
                    });

                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (radioStatus) {
                            $(item).removeClass('error').addClass('validated');
                            if (i == ($('input[name="' + strQuery + '"]').size() - 1))
                                methods.removeToInvalidGroup.call($this, item);
                        } else {
                            $(item).addClass('error').removeClass('validated');
                            if ((i == ($('input[name="' + strQuery + '"]').size() - 1)) && ($(item).parent().find('label.error').size() == 0))
                                methods.addToInvalidGroup.call($this, item);
                        }
                    });
                } else if (item.type == 'hidden' && $(item).hasClass('customselect')) {
                    if (item.value == '' || item.value == '0') {
                        if (!$(item).parents(".customselect_main").hasClass('error')) {
                            $(item).parents(".customselect_main").addClass('error').removeClass('validated');
                            $(item).addClass('error').removeClass('validated');
                            methods.addToInvalidGroup.call($this, item);
                        }
                    } else {
                        $(item).parents(".customselect_main").removeClass('error').addClass('validated');
                        $(item).removeClass('error').addClass('validated');
                        methods.removeToInvalidGroup.call($this, item);
                    }
                } else {
                    if (item.value == '') {
                        if (!$(item).hasClass('error')) {
                            $(item).addClass('error').removeClass('validated');
                            methods.addToInvalidGroup.call($this, item);
                        }
                    } else {
                        if ($(item).hasClass('error')) {
                            $(item).removeClass('error').addClass('validated');
                            methods.removeToInvalidGroup.call($this, item);
                        } else {
                            $(item).addClass('validated');
                        }
                    }
                }
            },

            validaCampo: function (id_validate, valor) {
                id_validate = parseInt(id_validate);
                if (id_validate == null) id_validate = 0;
                switch (id_validate) {
                    case 1: //cnpj
                        cnpj = valor;
                        erro = new String;
                        cnpj = cnpj.replace(".", "");
                        cnpj = cnpj.replace(".", "");
                        cnpj = cnpj.replace("-", "");
                        cnpj = cnpj.replace("/", "");
                        var a = [];
                        var b = new Number;
                        var c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                        for (i = 0; i < 12; i++) {
                            a[i] = cnpj.charAt(i);
                            b += a[i] * c[i + 1];
                        }
                        if ((x = b % 11) < 2) {
                            a[12] = 0
                        } else {
                            a[12] = 11 - x
                        }
                        b = 0;
                        for (y = 0; y < 13; y++) {
                            b += (a[y] * c[y]);
                        }
                        if ((x = b % 11) < 2) {
                            a[13] = 0;
                        } else {
                            a[13] = 11 - x;
                        }
                        if ((cnpj.charAt(12) != a[12]) || (cnpj.charAt(13) != a[13])) {
                            erro += "erro";
                        }
                        if (erro.length > 0) {
                            return false;
                        }
                        return true;
                        break;
                    case 2: //inscrição estadual
                        return true;
                        break;
                    case 3: //cpf

                        var cpf = valor;
                        cpf = cpf.replace(/\./g, "");
                        cpf = cpf.replace("-", "");
                        var numeros, digitos, soma, i, resultado, digitos_iguais;
                        digitos_iguais = 1;
                        for (i = 0; i < cpf.length - 1; i++)
                            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                                digitos_iguais = 0;
                                break;
                            }
                        if (!digitos_iguais) {
                            numeros = cpf.substring(0, 9);
                            digitos = cpf.substring(9);
                            soma = 0;
                            for (i = 10; i > 1; i--)
                                soma += numeros.charAt(10 - i) * i;
                            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                            if (resultado != digitos.charAt(0))
                                return false;
                            numeros = cpf.substring(0, 10);
                            soma = 0;
                            for (i = 11; i > 1; i--)
                                soma += numeros.charAt(11 - i) * i;
                            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                            if (resultado != digitos.charAt(1))
                                return false;
                        }
                        else {
                            return false;
                        }
                        return true;
                        break;
                    case 4: //rg
                        return true;
                        break;
                    case 5: //telefone
                        var re = /(^(\([0-9]{2}\))\s([0-9]{4}-[0-9]{4}))/g;
                        return re.test(valor);
                        break;
                    case 6: //email
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return re.test(valor);
                        break;
                    case 7: //url
                        //return true;
                        var re = /^((https?|ftp)\:\/\/)?([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?[a-z0-9+\$_-]+(\.[a-z0-9+\$_-]+)*(\:[0-9]{2,5})?(\/([a-z0-9+\$_-]\.?)+)*\/?(\?[a-z+&\$_.-][a-z0-9;:@\/&%=+\$_.-]*)?(#[a-z_.-][a-z0-9+\$_.-]*)?$/i;
                        return re.test(valor);
                        break;
                    case 8: //número
                        return !isNaN(valor);
                        break;
                    case 9: //número positivo
                        return (!isNaN(valor) && parseFloat(valor) >= 0);
                        break;
                    case 10: //número negativo
                        return (!isNaN(valor) && parseFloat(valor) < 0);
                        break;
                    case 11: //valor monetário
                        valor = parseFloat(valor);
                        if (!isNaN(valor)) {
                            if (valor >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                        break;
                    case 12: //data
                        return methods.isDate(valor);
                        break;
                    case 13: //data maior ou igual que atual
                        data = valor;
                        hoje = new Date;
                        data = data.split('/');
                        if (data[1] == 2 && data[0] > 29) return false;
                        if (data[2] > hoje.getFullYear()) {
                            return true;
                        } else if (data[2] == hoje.getFullYear()) {
                            if (data[1] > hoje.getMonth() + 1) {
                                return true;
                            } else if (data[1] == hoje.getMonth() + 1) {
                                if (data[0] >= hoje.getDate()) {
                                    return true;
                                }
                            }
                        } else {
                            return false;
                        }
                        break;
                    case 14: //data menor ou igual que atual
                        data = valor;
                        hoje = new Date;
                        data = data.split('/');
                        if (data[1] == 2 && data[0] > 29) return false;
                        if (data[2] < hoje.getFullYear()) {
                            return true;
                        } else if (data[2] == hoje.getFullYear()) {
                            if (data[1] < hoje.getMonth() + 1) {
                                return true;
                            } else if (data[1] == hoje.getMonth() + 1) {
                                if (data[0] <= hoje.getDate()) {
                                    return true;
                                }
                            }
                        } else {
                            return false;
                        }
                        break;
                    case 15: //text
                        if (valor == '') {
                            return false;
                        } else {
                            return true;
                        }
                        break;

                    case 17:
                        valor = parseFloat(valor);
                        if (!isNaN(valor)) {
                            if (valor < 0) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                        break;

                    case 18:
                        valor = parseFloat(valor);
                        if (!isNaN(valor)) {
                            if (valor >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                        break;

                    case 19: //data
                        valor += '/2012'
                        return methods.isDate(valor);
                        break;

                    case 20:
                        var confirm_val = $.getTopRender().find('fieldset').find(':input[id*="password"]:eq(0)').val();
                        if (valor == confirm_val) {
                            return true;
                        }

                        return false;
                        break;

                    default: //não valida
                        return true;
                        break;
                }
            },

            testPresetItem: function (item) {
                var $this = this;
                var filter = null;
                var isValid = true;

                $(item).msgbox("remove").msgbox({
                    'type': 'hint',
                    'msg': 'Formato Inválido',
                    'autoShow': false
                });

                if($(item).hasClass("email")) {
                    filter = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                    isValid = methods.validaCampo("6", item.value);
                } else if ($(item).hasClass("site")) {
                    filter = new RegExp('^(http[s]?://|ftp://)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov|br)$');
                } else if ($(item).hasClass("phone")) {
                    filter = new RegExp(/^(\([0-9]{2}\))\s([0-9]{4,5})-([0-9]{4})$/);
                } else if ($(item).hasClass("cep")) {
                    filter = new RegExp("^([0-9]{5})-([0-9]{3})$");
                } else if ($(item).hasClass('integer')) {
                    filter = new RegExp(/^[0-9]+$/);
                } else if ($(item).hasClass('float')) {
                    filter = new RegExp(/(^\$?([1-9]{1}[0-9]{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\$?([1-9]{1}\d{0,2}(\.\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\,\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\.\d{3})*(\,\d{0,2})?|[1-9]{1}\d{0,}(\,\d{0,2})?|0(\,\d{0,2})?|(\.\d{1,2}))\)$)/);
                } else if ($(item).hasClass('cnpj')) {
                    filter = new RegExp('^[0-9]{2}.[0-9]{3}.[0-9]{3}/[0-9]{3}[0-9]{1}-[0-9]{2}$');
                    isValid = methods.validaCampo("1", item.value);
                } else if ($(item).hasClass('date')) {
                    filter = new RegExp('^[0-9]{2}/[0-9]{2}/[0-9]{4}');
                    isValid = methods.validaCampo("12", item.value);
                } else if ($(item).hasClass('cpf')) {
                    filter = new RegExp(/(^\d{3}\.\d{3}\.\d{3}-\d{2})|(^\d{3}\d{3}\d{3}\d{2})$/);
                    isValid = methods.validaCampo("3", item.value);
                } else if ($(item).hasClass('currency')) {
                    filter = new RegExp("");
                } else if ($(item).hasClass('passcheck')) {
                    isValid = ($this.attr.target.find(".pass").val() == item.value) ? true: false;
                    filter = new RegExp("");

                    $(item).msgbox("remove").msgbox({
                        'type': 'hint',
                        'msg': 'Senhas não conferem',
                        'autoShow': false
                    });
                } else if ($(item).hasClass('positiveinterger')) {
                    filter = new RegExp("");
                } else if ($(item).hasClass('negativeinteger')) {
                    filter = new RegExp("");
                } else if ($(item).hasClass('positivefloat')) {
                    filter = new RegExp(/^\d*[0-9](\,\d*[0-9])?$/);
                } else if ($(item).hasClass('negativefloat')) {
                    filter = new RegExp(/^[-]?\d*[0-9](\,\d*[0-9])?$/);
                } else if ($(item).hasClass('onlynumbers')) {
                    filter =  new RegExp(/^\d*[0-9]$/)
                }


                // Identificar tipo não declarado
                if(filter == null) { 
                    filter = new RegExp("");
                    isValid = true;
                }

                 if(item.value == "") {
                    $(item).removeClass('preseterror').removeClass('presetvalidated');
                    methods.removeToInvalidGroup.call($this, item);
                } else if(isValid){
                    if (!filter.test(item.value)) {
                        if (!$(item).hasClass('preseterror')) {
                            $(item).addClass('preseterror').removeClass('presetvalidated');
                            methods.addToInvalidGroup.call($this, item);
                        } else if (item.value == "") {
                            if ($(item).hasClass('preseterror')) {
                                $(item).removeClass('preseterror').addClass('presetvalidated');
                                methods.removeToInvalidGroup.call($this, item);
                            }
                        } else if($(item).hasClass('preseterror')){
                            $(item).removeClass('preseterror').addClass('presetvalidated');
                            methods.removeToInvalidGroup.call($this, item);
                        }
                    } else if (item.value == "") {
                        if ($(item).hasClass('preseterror')) {
                            $(item).removeClass('preseterror').addClass('presetvalidated');
                            methods.removeToInvalidGroup.call($this, item);
                        }
                    } else {
                        $(item).removeClass('preseterror').addClass('presetvalidated');
                        methods.removeToInvalidGroup.call($this, item);
                    }
                } else {
                    $(item).addClass('preseterror').removeClass('presetvalidated');
                    methods.removeToInvalidGroup.call($this, item);
                    methods.addToInvalidGroup.call($this, item);
                }
            },

            testItem: function (item) {
                var $this = this;

                if ((item.type == 'radio') || (item.type == 'checkbox')) {
                    var strQuery = $(item).attr('name');
                    var radioStatus = false;
                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (item.checked) radioStatus = true;
                    });

                    $('input[name="' + strQuery + '"]').each(function (i, item) {
                        if (radioStatus) {
                            $(item).removeClass('error').addClass('validated');
                            if (i == ($('input[name="' + strQuery + '"]').size() - 1))
                                methods.removeToInvalidGroup.call($this, item);
                        } else {
                            $(item).addClass('error').removeClass('validated');
                            if ((i == ($('input[name="' + strQuery + '"]').size() - 1)) && ($(item).parent().find('label.error').size() == 0))
                                methods.addToInvalidGroup.call($this, item);
                        }
                    });
                } else if (item.type == 'hidden' && $(item).hasClass('customselect')) {
                    if (item.value == '' || item.value == '0') {
                        if (!$(item).parent().parent().hasClass('error')) {
                            $(item).parent().parent().addClass('error').removeClass('validated');
                            $(item).addClass('error').removeClass('validated');
                            methods.addToInvalidGroup.call($this, item);
                        }
                    } else {
                        $(item).parent().parent().removeClass('error').addClass('validated');
                        $(item).removeClass('error').addClass('validated');
                        methods.addToInvalidGroup.call($this, item);
                    }
                } else {
                    if (item.value == '') {
                        if (!$(item).hasClass('error')) {
                            $(item).addClass('error').removeClass('validated');
                            methods.addToInvalidGroup.call($this, item);
                        }
                    } else {
                        if ($(item).hasClass('error')) {
                            $(item).removeClass('error').addClass('validated');
                            methods.removeToInvalidGroup.call($this, item);
                        } else {
                            $(item).addClass('validated');
                        }
                    }
                }
            },

            setValidationStatus: function () {
                var $this = this;

                if($this.attr.invalidGroup.length == 0 && $($this.attr.target).find(".msgbox_main.erro:visible").size() == 0 && $($this.attr.target).find(".msgbox_main.hint:visible").size() == 0)
                    $this.attr.valid = true;
                else
                    $this.attr.valid = false;

                return $this.attr.valid;
            },

            clearForm: function () {
                var $this = this;

                $($this.attr.target).find('.required').removeClass('validated').removeClass('error');

                $($this.attr.target).find('label.error').remove();

                $($this.attr.target).find('.customselect_main.error').removeClass('validated').removeClass('error');

                $this.attr.valid = false;
            },

            isDate: function (dateStr) {
                //Modified by Parpinelli
                var datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
                var matchArray = dateStr.match(datePat); // is the format ok?
                var datestatus = true,
                    datemsg = "";

                if (matchArray == null || matchArray[1] == null || matchArray[3] == null || matchArray[5] == null) return false;

                // parse date into variables
                day = matchArray[1];
                month = matchArray[3];
                year = matchArray[5];

                // check month range
                if (month < 1 || month > 12) return false;
                // check macro day range
                if (day < 1 || day > 31) return false;
                // check 30 days months
                if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) return false;
                // check for february 29th
                if (month == 2) {
                    var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
                    if (day > 29 || (day == 29 && !isleap)) return false;
                }
                return true;
            },

            mask: function(item) {
                var $this = this;
                var isNumber = new RegExp(/^[0-9]+$/);
                
                if ($(item).hasClass('cnpj')) {
                    $(item).attr("maxlength", "18");
                    $(item).keydown(function (event) {
                        if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 2) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 6) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 10) {
                                item.value = item.value + '/';
                            } else if (item.value.length == 15) {
                                item.value = item.value + '-';
                            }
                        }
                    });

                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });
                } else if ($(item).hasClass('cpf')) {
                    $(item).attr("maxlength", "14");
                    $(item).keydown(function (event) {
                        if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 3) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 7) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 11) {
                                item.value = item.value + '-';
                            }
                        }
                    });

                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });
                } else if ($(item).hasClass("phone")) {
                    $(item).attr('maxlength', '14');

                    $(item).keyup(function (event) {
                        if (event.which != 16 && event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value[0] != "(")
                                item.value = '(' + item.value;

                            var isNumber = new RegExp(/^[0-9]+$/);
                            if (!isNumber.test(item.value[item.value.length - 1])) {
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        }
                    });

                    $(item).keydown(function (event) {
                        if (event.which != 8 && event.which != 13 && event.which != 32 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 0) {
                                item.value = '(' + item.value;
                            } else if (item.value.length == 3) {
                                item.value = item.value + ') ';
                            } else if (item.value.length == 9) {
                                if (!((item.value[1] == 1) && (item.value[2] == 1) && (item.value[5] == 9))) {
                                    item.value = item.value + '-';
                                    $(item).attr('maxlength', '14');
                                }
                            } else if (item.value.length == 10) {
                                if (((item.value[1] == 1) && (item.value[2] == 1) && (item.value[5] == 9))) {
                                    item.value = item.value + '-';
                                    $(item).attr('maxlength', '15');
                                }
                            }
                        }
                    });
                } else if ($(item).hasClass("cep")) {
                    $(item).attr('maxlength', '9');

                    $(item).keydown(function () {
                        if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 5) {
                                item.value = item.value + '-';
                            }
                        }
                    });                    

                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });    
                } else if ($(item).hasClass('integer')) {
                    $(item).keyup(function (event) {
                        if(item.value.length == 1 && item.value[0] == "-") {

                        } else if(item.value.length > 1 && item.value[0] == "-" && item.value[1] == "0") {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else {
                            if(item.value.length > 1 && item.value[0] == 0) {
                                var newVal = item.value.substring(1, item.value.length);
                                item.value = newVal;
                            }
                        }
                    });
                } else if ($(item).hasClass('positiveinterger')) {
                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else {
                            if(item.value.length > 1 && item.value[0] == 0) {
                                var newVal = item.value.substring(1, item.value.length);
                                item.value = newVal;
                            }
                        }
                    });
                } else if($(item).hasClass('onlynumbers')) {
                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });
                } else if ($(item).hasClass('negativeinteger')) {
                    $(item).keyup(function (event) {
                        if(item.value.length == 1 && item.value[0] == "-"){
                            
                        } else if(item.value.length == 2 && item.value[0] == "-" && item.value[1] == "0"){
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else if(!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });
                } else if ($(item).hasClass('currency')) {
                    $(item).css({ 'text-align': 'right' });

                    item.isEdition = false;
                    item.selStart = 0;
                    item.selEnd = 0;

                    item.dotCountStart = 0;
                    item.dotCountEnd = 0;

                    //atila - 13/03/2013
                    item.onfocusin = function(){
                       if(!item.readOnly) {
                            if (item.value == "") {
                                item.value = "R$ 0,00";
                            } else {
                                item.value = moeda.formatar(moeda.desformatar(item.value)).replace(/\./gi,'');;
                            }
                        }
                    }

                     item.onfocusout = function(){
                        if (item.value == "0,00" || item.value == "0") {
                                item.value = "";
                            } else {
                                item.value = moeda.formatar(moeda.desformatar(item.value),true);
                            }
                    }

                     item.onkeypress = function(event) {
                        if(!((event.keyCode>=0x30 && event.keyCode<=0x39)) && event.keyCode != 44 ) {
                             event.returnValue = false;
                          }
                    }
                    //fim atila - 13/03/2013


                    //modificado a pedido do ygor/parps , depois ver como eles...
//                    item.onselect = function(e){
//                        item.isEdition = true;
//                        item.selStart = e.target.selectionStart;
//                        item.selEnd = e.target.selectionEnd - (e.target.selectionEnd - e.target.selectionStart);
//                    }

//                    item.onfocus = function(e) {
//                        if(!item.readOnly) {
//                            if (item.value == "") {
//                                item.value = "0,00";
//                            } else {
//                                var startIndex = item.value.indexOf(formValidatorCurrency + " ");
//                                if(startIndex >= 0) item.value = item.value.substring(startIndex + 3, item.value.length);
//                            }

//                            setTimeout(function () { 
//                                item.setSelectionRange(0, item.value.length + 1);
//                            }, 0);

//                            item.isEdition = false;
//                        }
//                    };

    //                item.onblur = function(e) {
   //                     if(!item.readOnly) {
//                            if (item.value != "" && item.value.search(formValidatorCurrency.substr(0,1)) == -1) {
//                                var x = item.value.replace(/,/gi, "");
//                                var v = x.replace(/\./gi, "");

//                                var newVal = "";
//                                var val0 = "";
//                                var val1 = "";

//                                val0 = v.substring(0, v.length - 2);
//                                val1 = v.substring(v.length - 2);

//                                newVal = val0 + "," + val1;

//                                item.value = newVal;

//                                var d = item.value.split(",");
//                                newVal = "";

//                                if (d[0].length > 3) {
//                                    for (var i = d[0].length; i > 0; i = i - 3) {
//                                        if (i == d[0].length) newVal = d[0].substring(i - 3, i) + "" + newVal;
//                                        else newVal = d[0].substring(i - 3, i) + "." + newVal;
//                                    }

//                                    item.value = newVal + "," + d[1];
//                                } else {
//                                    if (item.value.split(",")[0] == "") item.value = "0" + item.value;
//                                    if (item.value.split(",")[1].length == "1") item.value = item.value.split(",")[0] + ",0" + item.value.split(",")[1];
//                                }

//                                item.value = formValidatorCurrency + ' ' + item.value;
//                            }
//                            item.isEdition = false;
   //                     }
  //                  };

           //         item.onkeypress = function(e) {
//                        if (e.ctrlKey && e.which == 86) this.pasting = true;
//                        if (e.shiftKey && e.which == 45) this.pasting = true;

//                        if (this.pasting) {
//                            this.pasting = false;
//                            return true;
//                        }

//                        e = e || window.event;
//                        if (e.charCode == 0) return true;
//                        var s = String.fromCharCode(e.charCode);
//                        if (s < "0" || s > "9") return false;

//                        return true;
            //        };

                  //  item.onkeydown = function(e) {
                        //item.dotCountStart = item.value.split(".").length - 1;
                  //  }

                 //   item.onkeyup = function(e) {
//                        if(e.which == 9) { return false; }

//                        item.selStart = e.target.selectionStart;
//                        item.selEnd = e.target.selectionEnd;

//                        var x = item.value.replace(/,/gi, "");
//                        var v = x.replace(/\./gi, "");

//                        var newVal = "";
//                        var val0 = "";
//                        var val1 = "";

//                        while(v[0] == 0) {v = v.substr(1); }

//                        val0 = v.substring(0, v.length - 2);
//                        val1 = v.substring(v.length - 2);

//                        newVal = val0 + "," + val1;

//                        item.value = newVal;

//                        var d = item.value.split(",");
//                        newVal = "";

//                        if (d[0].length > 3) {
//                            for (var i = d[0].length; i > 0; i = i - 3) {
//                                if (i == d[0].length) {
//                                    newVal = d[0].substring(i - 3, i) + "" + newVal;
//                                } else {
//                                    newVal = d[0].substring(i - 3, i) + "." + newVal;
//                                }
//                            }

//                            item.value = newVal + "," + d[1];
//                        } else {
//                            if (item.value.split(",")[0] == "")
//                                item.value = "0" + item.value;

//                            if (item.value.split(",")[1].length == "1")
//                                item.value = item.value.split(",")[0] + ",0" + item.value.split(",")[1];
//                        }

//                        item.dotCountEnd = item.value.split(".").length - 1;

//                        if(item.isEdition) {
//                            if(item.dotCountStart > item.dotCountEnd) {
//                                item.selStart--;                                
//                            } else if(item.dotCountStart < item.dotCountEnd) {
//                                item.selStart++;
//                            }

//                            item.setSelectionRange(item.selStart, item.selStart); 
//                        } else {
//                            //console.log(" ");
//                        }
                 //   };
                } else if ($(item).hasClass('date')) {
                    $(item).keydown(function () {
                        if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 2) {
                                item.value = item.value + '/';
                            } else if (item.value.length == 5) {
                                item.value = item.value + '/';
                            }
                        }
                    });

                    $(item).keyup(function (event) {
                        var isNumber = new RegExp(/^[0-9]+$/);
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });    
                } else if ($(item).hasClass('cnpj')) {
                    $(item).keydown(function (event) {
                        if (event.which != 8 && event.which != 13 && event.which != 9 && event.which != 46 && event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) {
                            if (item.value.length == 2) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 6) {
                                item.value = item.value + '.';
                            } else if (item.value.length == 10) {
                                item.value = item.value + '/';
                            } else if (item.value.length == 15) {
                                item.value = item.value + '-';
                            }
                        }
                    });

                    $(item).keyup(function (event) {
                        if (!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        }
                    });
                } else if ($(item).hasClass('positivefloat')) {
                    $(item).keyup(function (event) {
                        if(item.value.length == 1 && item.value[0] == ",") {
                            item.value = "0,";
                        } else if(item.value[item.value.length - 1] == ","){
                            if(item.value.search(",") != item.value.length - 1){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        } else if(!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else if(item.value.length > 1 && item.value[0] == 0) {
                            if(item.value[1] == ","){
                                if(item.value.length >= (item.value.search(",") + 4)){
                                    var newVal = item.value.substring(0, item.value.length - 1);
                                    item.value = newVal;
                                }
                            } else {
                                var newVal = item.value.substring(1, item.value.length);
                                item.value = newVal;
                            }
                        } else if(item.value.search(",") >= 0) {
                            if(item.value.length >= (item.value.search(",") + 4)){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        }
                    });                   
                } else if ($(item).hasClass('negativefloat')) {
                    $(item).keyup(function (event) {
                        if(item.value.length == 1 && item.value[0] == "-") {

                        } else if(item.value.length == 1 && item.value[0] == ",") {
                            item.value = "-0,";
                        } else if(item.value.length == 1 && item.value[0] != "-"){
                            item.value = "-" + item.value;
                        } else if(item.value[item.value.length - 1] == ","){
                            if(item.value.search(",") != item.value.length - 1){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        } else if(!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else if(item.value.length > 1 && item.value[0] == 0) {
                            if(item.value[1] == ","){
                                if(item.value.length >= (item.value.search(",") + 4)){
                                    var newVal = item.value.substring(0, item.value.length - 1);
                                    item.value = newVal;
                                }
                            } else {
                                var newVal = item.value.substring(1, item.value.length);
                                item.value = newVal;
                            }
                        } else if(item.value.search(",") >= 0) {
                            if(item.value.length >= (item.value.search(",") + 4)){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        }
                    });    
                } else if ($(item).hasClass('floatprecision3')) {
                    item.onkeyup = function (event) {
                        if(item.value.length == 1 && item.value[0] == ",") {
                            item.value = "0,";
                        } else if(item.value[item.value.length - 1] == ","){
                            if(item.value.search(",") != item.value.length - 1){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        } else if(!isNumber.test(item.value[item.value.length - 1])) {
                            var newVal = item.value.substring(0, item.value.length - 1);
                            item.value = newVal;
                        } else if(item.value.length > 1 && item.value[0] == 0) {
                            if(item.value[1] == ","){
                                if(item.value.length >= (item.value.search(",") + 5)){
                                    var newVal = item.value.substring(0, item.value.length - 1);
                                    item.value = newVal;
                                }
                            } else {
                                var newVal = item.value.substring(1, item.value.length);
                                item.value = newVal;
                            }
                        } else if(item.value.search(",") >= 0) {
                            if(item.value.length >= (item.value.search(",") + 5)){
                                var newVal = item.value.substring(0, item.value.length - 1);
                                item.value = newVal;
                            }
                        }
                    };                   
                } 
            }
        };

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            } else {
                $.error("Method '" + methodName + "' does not exist on jQuery.FormValidator");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery);