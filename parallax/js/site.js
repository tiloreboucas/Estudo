var AppPath = '//' + window.location.host + '/proxy.aspx/';

$.extend({
    stringify: function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },

    execData: function (Method, Data, Callback) {
        $.ajax({
            type: "POST",
            url: AppPath + Method,
            data: $.stringify(Data),
            contentType: "application/json; charset=utf-8",
            datatype: "jsondata",
            async: false,
            error: function (error_data) { logError(error_data); },
            success: function (response_data) { Callback(eval(response_data.d)); }
        });
    },

    epar: function (par) {
        return (par) ? par : false
    }

});


SaveCompany = function () {

    var values = {};
    $('.form input, select').not('[type="button"]').each(function () {
        var that = $(this);
        if ($.epar(that.attr('id').split('§')[1])) values[that.attr('id').split('§')[1]] = that.val();
    });

    values["ds_country"] = 'Brasil';
    values["ds_login"] = '';
    values["source"] = 'site';
    var Data = {}
    Data.values = $.stringify(values).replace(/\"/g, "'");

    $.execData('SaveCompany', Data, function (json) {

        var success = false;
        if (json) {
            json = eval('(' + json + ')');
            if (json.success) {
                var param = {}
                param.ds_token = json.token;
                $.execData('GetIdInstall', param, function (id_inst) {
                    var udt_inst = {};
                    udt_inst.id_install = id_inst;
                    var tk_general = ((((id_inst % 2 == 0) ? String(Number(Math.sqrt(id_inst) + (id_inst / Math.sqrt(id_inst * String(id_inst)[0] * 1))).toFixed(10)).concat('MOD') : String(Math.sqrt(id_inst) + (id_inst / Math.sqrt(id_inst * (String(id_inst)[0] * 1 + 1)))).split('.')[1]) == undefined) ? 'Un' + id_inst + 'd&f' + id_inst + '1n3D' : (id_inst % 2 == 0) ? String(Number(Math.sqrt(id_inst) + (id_inst / Math.sqrt(id_inst * String(id_inst)[0] * 1))).toFixed(10)).concat('MOD') : String(Number(Math.sqrt(id_inst) + (id_inst / Math.sqrt(id_inst * (String(id_inst)[0] * 1 + 1)))).toFixed(10)).split('.')[1]);
                    udt_inst.ds_login = $.rc4EncryptStr('admin', tk_general);
                    udt_inst.ds_password = $.rc4EncryptStr(values["ds_password"], tk_general);
                    $.execData('UpdateAttrCompany', udt_inst, function (suc) {
                        success = eval('(' + suc + ')').success;
                        if (success) {
                            //$("#show_message").bind("dialogclose", function (event, ui) {
                            //   window.location = 'index.aspx';
                            //});
                            //showMessage("VERIFIQUE SEU E-MAIL! <br /><br />Mandamos para você um e-mail de verificação. Para finalizar o seu cadastro e começar a usar o MarketUP, precisamos que você entre no e-mail que você informou e clique no link de confirmação de cadastro.");
                            window.location = 'final.aspx';
                        } else {
                            showMessage('Problemas ao enviar a solicitação.<br />Tente novamente mais tarde.');
                        }

                        $('#btAvancar').loader('end');
                    });
                });

            }
        }

    });
}

RequestCep = function (value) {
    var iReturn = {};
    $.ajax({
        type: "POST",
        url: AppPath + "RequestCep",
        data: "{d:'{\"parameters\":{\"aux\":\"" + value + "\"}}'}",
        contentType: "application/json; charset=utf-8",
        async: false,
        datatype: "jsondata",
        success: function (response) {
            $('.marketup§ds_number').val('');
            $('.marketupds_address').val('');
            $('.marketupds_quarter').val('');
            $('.marketupds_city').val('');
            $('.marketupds_state').val('');

            if ($(eval(response.d)).size() > 0) {
                var cep = eval(response.d);

                $('.marketupds_address').val(cep[0].type_address + " " + cep[0].address).addClass('valid').removeClass('error');
                $('.marketupds_quarter').val(cep[0].neighborhood).addClass('valid').removeClass('error');
                $('.marketupds_city').val(cep[0].city).addClass('valid').removeClass('error');
                $('.marketupds_state').val(cep[0].state).addClass('valid').removeClass('error');
            } else {
                showMessage('CEP não encontrado');
                $('.marketupds_city').fadeIn();
                $('.marketupds_state').fadeIn();
            }
        }
    });
}

getSegments = function () {
    $.execData('GetSegments', {}, function (json) {

        var markup = '<option value="-1">Segmento</option>';

        if (json) {
            for (a in json) {
                markup += '<option value="' + json[a].id_segment + '">' + json[a].ds_segment + '</option>';
            }

            $('.marketupid_segment').append(markup);
        }

    });
}


checkDomain = function (pEnd) {
    var Data = {}
    var txt = $('#marketup§ds_domain').val();
    var patt = new RegExp(/^[a-zA-Z0-9]+$/);
    var newtxt = "";

    for (var i = 0; i < txt.length; i++) {
        if (patt.test(txt[i]))
            newtxt += txt[i];
    }
    
    $('#marketup§ds_domain').val(newtxt);

    Data["domain_name"] = $('#marketup§ds_domain').val();

    $.execData('CheckDomain', Data, function (json) {
        var available = (!json);

        $('#verificar').addClass('dn');

        if (available) {

            if ($('#indisponivel').not('.dn')) $('#indisponivel').addClass('dn');
            $('#disponivel').removeClass('dn')

            if ($.epar(pEnd) == true) {
                $('#btAtivacao').loader({ color: 'black' });
                setTimeout(function () { $("#show_eula").dialog() }, 200);
            }

        } else {

            if ($('#disponivel').not('.dn')) $('#disponivel').addClass('dn');
            $('#indisponivel').removeClass('dn')

            if ($.epar(pEnd) == true) {
                showMessage('É necessário informar e verificar a disponibilidade de um domínio.');
            }

        }
    });
}


sendContact = function () {

    var Data = {};
    var values = {}

    $('input, textarea').each(function () {
        var that = $(this);
        values[that.attr('name')] = that.val();
    });

    Data.values = $.stringify(values).replace(/\"/g, "'");

    $.execData('SendContact', Data, function (ret) {

        var success = false;
        if (ret) {
            ret = eval('(' + ret + ')');
            if (ret.success) success = true;
        }

        if (success) {
            $("#show_message").bind("dialogclose", function (event, ui) {
                window.location = 'index.aspx';
            });
            showMessage('Mensagem enviada com sucesso.');
        } else {
            showMessage('Problemas ao enviar a mensagem.<br/>Tente novamente mais tarde.');
        }

        $('.enviarFormulario').eq(0).loader('end');
    });

}

showMessage = function (message) {
    $('#show_message').html(message);
    $('#show_message').dialog({ buttons: { "Ok": function () { $(this).dialog("close"); } } });
}

validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

charValidate = function (pValue, pCheck) {
    var tmp = -1;

    for (i = 0; i < pCheck.length; i++) {
        tmp = pValue.indexOf(pCheck[i]);
        if (tmp != -1) return tmp;
    }

    return -1;
}


validateForm = function () {
}

loadCadastro = function () {

    $(document).ready(function () {
        $('.telBox').formvalidator();

        $('.required').each(function (index, item) {
            if ($(item).hasClass('marketupid_segment')) {
                $(item).focusout(function () {
                    if ($(item).val() == '-1') {
                        $(item).removeClass('selected');
                        $(item).parent().append("<div class='boxMsgErrorSelected'><p>Escolha uma opção</p></div>");
                    } else {
                        $(item).parent().find('.boxMsgErrorSelected').remove();
                        $(item).addClass('selected');
                    }
                });
            }

            if ($(item).hasClass('pass')) {
                $(item).focusin(function () {
                    $(item).addClass('caution');
                    if ($(item).parent().find('.boxMsgCaution').size() == 0) {
                        $(item).parent().append("<div class='boxMsgCaution'><p>A senha deve ter números, letras e no mínimo 8 caractéres</p></div>");
                    }
                });

                $(item).focusout(function () {

                    var that = $(this);
                    var current_pass = that.val();
                    var isValid = true;

                    //var iChars = "!@#$%^&*()+=[]\\\';,./{}|\":<>? áéíóúãõàüäëöïñçÁÉÍÓÚÃÕÀÜÄËÖÏÑÇ";
                    var aChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=[]\\\';,./{}|\":<>? áéíóúãõàüäëöïñçÁÉÍÓÚÃÕÀÜÄËÖÏÑÇ";
                    var nChars = "0123456789";

                    if (current_pass == '') return;

                    //if (isValid) isValid = (charValidate(current_pass, iChars) == -1);
                    if (isValid) isValid = (charValidate(current_pass, aChars) != -1);
                    if (isValid) isValid = (charValidate(current_pass, nChars) != -1);
                    if (isValid) isValid - (current_pass.length > 7);
                    if (isValid) isValid - (current_pass.length < 21);

                    if (isValid) {
                        that.parent().find('.boxMsgCaution').fadeOut(function () {
                            that.parent().find('.boxMsgCaution').remove();
                            that.removeClass('caution');
                        });
                    } else {
                        that.parent().find('.boxMsgCaution').fadeOut(function () {
                            that.parent().find('.boxMsgCaution').fadeIn();
                        });
                        that.val("").focus();
                    }

                });
            } else {
                $(item).focusout(function () {

                    //INICIO - Verificar Domínio quando sair do foco
                    if ($(item).hasClass('marketupds_domain')) {

                        var iChars = "!@#$%^&*()+=[]\\\';,./{}|\":<>? áéíóúãõàüäëöïñçÁÉÍÓÚÃÕÀÜÄËÖÏÑÇ";
                        var dm = $(item);
                        dm.parent().remove('div.boxMsgError');
                        dm.removeClass('error').removeClass('valid');

                        if (dm.val() == '' || dm.val() == dm.attr('placeholder')) {
                            dm.addClass('error');
                            dm.parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                        } else if (charValidate(dm.val(), iChars) != -1) {
                            dm.addClass('error');
                            dm.parent().append("<div class='boxMsgError'><p>Domínio inválido</p></div>");
                        } else {
                            dm.addClass('valid');
                            checkDomain();
                        }

                    }
                    //FIM - Verificar Domínio quando sair do foco


                    if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                        $(item).addClass('error').removeClass('valid');
                        if ($(item).parent().find('.boxMsgError').size() == 0) {
                            $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                        }
                    } else {
                        if ($(item).hasClass('repass')) {
                            if ($('.repass').val() == $('.pass').val()) {
                                $('.repass').addClass('valid').removeClass('error');
                                $('.pass').addClass('valid').removeClass('error');
                                if ($(item).parent().find('.boxMsgError').size() > 0) {
                                    $(item).parent().find('.boxMsgError').remove();
                                }
                            } else {
                                $('.repass').addClass('error').removeClass('valid');
                                $('.pass').addClass('error').removeClass('valid');
                                if ($(item).parent().find('.boxMsgError').size() == 0) {
                                    $(item).parent().append("<div class='boxMsgError'><p>Senha não confere</p></div>");
                                }
                            }
                        } else {
                            $(item).addClass('valid').removeClass('error');
                            if ($(item).parent().find('.boxMsgError').size() > 0) {
                                $(item).parent().find('.boxMsgError').remove();
                            }
                        }
                    }

                    if ($(item).hasClass('email')) {
                        if ($('#marketup§ds_email').val() != '') {
                            var teste = validateEmail($('#marketup§ds_email').val());
                            if (!teste) {
                                var tag = '<div class="boxMsgErrorEmail invalid"><p>Formato Inválido</p></div>';
                                $(tag).insertBefore('#marketup§ds_email');
                                $('#marketup§ds_email').removeClass('valid');
                            } else {
                                $('#marketup§ds_email').parent().find('.invalid').remove();
                                $('#marketup§ds_email').addClass('valid');
                            }
                        }
                    }

                    if ($('#divStep_1 .required').size() == $('#divStep_1 .valid').size()) {
                        $('#btAvancar').removeClass('off').addClass('on');
                    }

                    if ($('#divStep_2 .required').size() == $('#divStep_2 .valid').size()) {
                        $('#btAvancarLocalizacao').removeClass('off').addClass('on');
                    }

                    if ($('#divStep_3 .required').size() == $('#divStep_3 .valid').size()) {
                        $('#btAtivacao').removeClass('off').addClass('on');
                    }
                });
            }

            $(item).keyup(function (e) {

                if (e.which != 9) {

                    //INICIO - Validação de números e busca do CEP pelo limite de números
                    //validação
                    if ($(item).hasClass('marketupds_zip_code')) {
                        filter = new RegExp(/^[0-9]+$/);
                        if (!filter.test($(item).val())) {
                            var newVal = $(item).val().substring(0, $(item).val().length - 1);
                            $(item).val(newVal);
                        }
                        //busca
                        if ($(item).val().length == 8) {
                            RequestCep($('.marketupds_zip_code').val().replace('-', '').replace(' ', ''));
                        }
                    }
                    //FIM - Validação de números e busca do CEP pelo limite de números

                    if ($(item).hasClass('marketupds_domain')) {
                        filter = new RegExp(/^[a-zA-Z0-9-\-]+$/);
                        if (!filter.test($(item).val())) {
                            var newVal = $(item).val().substring(0, $(item).val().length - 1);
                            $(item).val(newVal);
                        }
                    }

                    if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                        $(item).addClass('error').removeClass('valid');
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    } else {
                        if ($(item).hasClass('repass')) {

                            if ($('.repass').val() == $('.pass').val()) {
                                $('.repass').addClass('valid').removeClass('error');
                                $('.pass').addClass('valid').removeClass('error');
                                $('.boxMsgError').hide();
                            } else {
                                $('.repass').addClass('error').removeClass('valid');
                                $('.pass').addClass('error').removeClass('valid');
                                $('.boxMsgError').show();
                            }
                        } else {
                            $(item).addClass('valid').removeClass('error');
                            if ($(item).parent().find('.boxMsgError').size() > 0) {
                                $(item).parent().find('.boxMsgError').remove();
                            }
                        }
                    }

                    if ($(item).hasClass('email')) {
                        if ($('#marketup§ds_email').val() != '') {
                            var teste = validateEmail($('#marketup§ds_email').val());
                            if (!teste) {
                                var tag = '<div class="boxMsgErrorEmail invalid"><p>Formato Inválido</p></div>';
                                $(tag).insertBefore('#marketup§ds_email');
                                $('#marketup§ds_email').removeClass('valid');
                            } else {
                                $('#marketup§ds_email').parent().find('.invalid').remove();
                                $('#marketup§ds_email').addClass('valid');
                            }
                        }
                    }

                    if ($('#divStep_1 .required').size() == $('#divStep_1 .valid').size()) {
                        $('#btAvancar').removeClass('off').addClass('on');
                    }

                    if ($('#divStep_2 .required').size() == $('#divStep_2 .valid').size()) {
                        $('#btAvancarLocalizacao').removeClass('off').addClass('on');
                    }

                    if ($('#divStep_3 .required').size() == $('#divStep_3 .valid').size()) {
                        $('#btAtivacao').removeClass('off').addClass('on');
                    }
                }

            });
        });

        /*$('#marketup§ds_phone').keyup(function () {
        filter = new RegExp(/^[0-9]+$/);
        if (!filter.test($('#marketup§ds_phone').val())) {
        var newVal = $('#marketup§ds_phone').val().substring(0, $('#marketup§ds_phone').val().length - 1);
        $('#marketup§ds_phone').val(newVal);
        }
        }); */

        $('#no_face').bind('click', function () {
            $('#divStep_1 fieldset li.dn').not('.hdd').show();

            if (!$.browser.msie) {
                $('#divStep_1 fieldset li.dn').not('.hdd').find('input[type="text"]').val('');
            } else {
                var fields = $('#divStep_1 fieldset li.dn').not('.hdd').find('input[type="text"]');
                fields[0].val('Nome');
                fields[1].val('Email');
                fields[2].val('00000');
                fields[3].val('00000');
            }
        });

        $("#show_message").dialog({
            modal: true,
            width: 450,
            title: "Alerta",
            open: function () {
                $('.ui-icon.ui-icon-closethick').show();
            }
        });
        $("#show_message").dialog("close");

        getSegments();

        $("#show_eula").dialog({
            modal: true,
            width: 545,
            height: 300,
            title: "Termos de Uso / Política de Privaciadade",
            closeOnEscape: false,
            open: function () { $('.ui-icon.ui-icon-closethick').hide(); }
        });

        $("#show_eula").dialog("close");


        $("#show_eula").dialog("option", "buttons", [
            {
                text: "Concordo",
                click: function () {
                    $(this).dialog("close");
                    SaveCompany();
                }
            },
            {
                text: "Não Concordo",
                click: function () {
                    $('#btAtivacao').loader('end');
                    $(this).dialog("close");
                }
            }
        ]);


        $.ajax({
            url: "eula.txt",
            success: function (data) {
                if (data) $("#show_eula").html(data);

            }
        });

        //$('#marketup§ds_phone').mask('(99) 9999-9999');

        $('#marketup§ds_domain').each(function () {
            var that = $(this);

            // Save current value of element
            that.data('oldVal', that.val());

            // Look for changes in the value
            that.bind("propertychange keyup input paste", function (event) {
                // If value has changed...
                if (that.data('oldVal') != that.val()) {
                    // Updated stored value
                    that.data('oldVal', that.val());
                    // Do action       
                    $('#disponivel, #indisponivel').addClass('dn');
                    $('#verificar').removeClass('dn');
                }
            });
        });

        $('#verificar').click(function () {
            checkDomain();
        });

        $('#btAvancar').click(function () {
            document.location.hash = '#etapa2';
            _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

            $('#divStep_1 .required').each(function (index, item) {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    }
                } else {
                    if ($(item).hasClass('repass')) {
                        /*
                        filter = new RegExp(/^[a-z0-9A-Z]*$/g);
                        if (!filter.test($(item).val())) {
                        var newVal = $(item).val().substring(0, $(item).val().length - 1);
                        $(item).val(newVal);
                        }
                        */
                        if ($('.repass').val() == $('.pass').val()) {
                            $('.repass').addClass('valid').removeClass('error');
                            $('.pass').addClass('valid').removeClass('error');
                            $('.boxMsgError').hide();
                        } else {
                            $('.repass').addClass('error').removeClass('valid');
                            $('.pass').addClass('error').removeClass('valid');
                            $('.boxMsgError').show();
                        }
                    } else {
                        $(item).addClass('valid').removeClass('error');
                        if ($(item).parent().find('.boxMsgError').size() > 0) {
                            $(item).parent().find('.boxMsgError').remove();
                        }
                    }
                }
            });
            if ($('#divStep_1 .required').size() == $('#divStep_1 .valid').size()) {
                $('#divStep_1').hide();
                $('#divStep_2').show();
            }
        });

        $('#btAvancarLocalizacao').click(function () {
            document.location.hash = '#etapa3';
            _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

            $('#divStep_2 .required').each(function (index, item) {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    }
                } else {
                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }
                }
            });
            if ($('#divStep_2 .required').size() == $('#divStep_2 .valid').size()) {
                $('#divStep_2').hide();
                $('#divStep_3').show();
            }
        });

        $('#divStep_2 .btVoltar').click(function () {
            document.location.hash = '';
            $('#divStep_2').hide();
            $('#divStep_1').show();
        });

        $('#divStep_3 .btVoltar').click(function () {
            document.location.hash = '#etapa2';
            _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

            $('#divStep_3').hide();
            $('#divStep_2').show();
        });

        $('#btAtivacao').click(function () {
            $('#divStep_3 .required').each(function (index, item) {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    }
                } else {
                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }
                }
            });
            if ($('#divStep_3 .required').size() == $('#divStep_3 .valid').size()) {

                checkDomain(true);

            }
        });

        $('.btBuscar').click(function () {
            if ($.epar($('.marketupds_zip_code').val())) {
                RequestCep($('.marketupds_zip_code').val().replace('-', '').replace(' ', ''));
            } else {
                showMessage('Informe o CEP a ser pesquisado.');
            }
        });
    });
}

loadContato = function () {
    $(document).ready(function () {

        $("#show_message").dialog({ modal: true, width: 450, title: "Alerta" });
        $("#show_message").dialog("close");

        $('#contact§phone').parent().formvalidator();
        //$('#contact§phone').mask('(99) 9999-9999');

        $('.required').each(function (index, item) {
            $(item).focusout(function () {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    }
                } else {
                    if ($(item).hasClass('repass')) {
                        if ($('.repass').val() == $('.pass').val()) {
                            $('.repass').addClass('valid').removeClass('error');
                            $('.pass').addClass('valid').removeClass('error');
                            if ($(item).parent().find('.boxMsgError').size() > 0) {
                                $(item).parent().find('.boxMsgError').remove();
                            }
                        } else {
                            $('.repass').addClass('error').removeClass('valid');
                            $('.pass').addClass('error').removeClass('valid');
                            if ($(item).parent().find('.boxMsgError').size() == 0) {
                                $(item).parent().append("<div class='boxMsgError'><p>Senha não confere</p></div>");
                            }
                        }
                    } else {
                        $(item).addClass('valid').removeClass('error');
                        if ($(item).parent().find('.boxMsgError').size() > 0) {
                            $(item).parent().find('.boxMsgError').remove();
                        }
                    }
                }

                if ($('#divStep_1 .required').size() == $('#divStep_1 .valid').size()) {
                    $('#btAvancar').removeClass('off').addClass('on');
                }

                if ($('#divStep_2 .required').size() == $('#divStep_2 .valid').size()) {
                    $('#btAvancarLocalizacao').removeClass('off').addClass('on');
                }

                if ($('#divStep_3 .required').size() == $('#divStep_3 .valid').size()) {
                    $('#btAtivacao').removeClass('off').addClass('on');
                }
            });

            $(item).keyup(function () {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                } else {
                    if ($(item).hasClass('repass')) {
                        if ($('.repass').val() == $('.pass').val()) {
                            $('.repass').addClass('valid').removeClass('error');
                            $('.pass').addClass('valid').removeClass('error');
                            $('.boxMsgError').hide();
                        } else {
                            $('.repass').addClass('error').removeClass('valid');
                            $('.pass').addClass('error').removeClass('valid');
                            $('.boxMsgError').show();
                        }
                    } else {
                        $(item).addClass('valid').removeClass('error');
                        if ($(item).parent().find('.boxMsgError').size() > 0) {
                            $(item).parent().find('.boxMsgError').remove();
                        }
                    }
                }

                if ($('#divStep_1 .required').size() == $('#divStep_1 .valid').size()) {
                    $('#btAvancar').removeClass('off').addClass('on');
                }

                if ($('#divStep_2 .required').size() == $('#divStep_2 .valid').size()) {
                    $('#btAvancarLocalizacao').removeClass('off').addClass('on');
                }

                if ($('#divStep_3 .required').size() == $('#divStep_3 .valid').size()) {
                    $('#btAtivacao').removeClass('off').addClass('on');
                }
            });
        });

        $('.enviarFormulario').click(function () {
            $('.form div ul li .required').each(function (index, item) {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Campo Obrigatório</p></div>");
                    }
                } else {
                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }
                }
            });

            if ($('.error').length == 0) {
                $(this).loader();
                setTimeout(function () { sendContact(); }, 200);
            }
        });
    });
}

loadConfirmacao = function () {
    $(document).ready(function () {

        $('#stage_text').loader();

        $("#show_message").dialog({ modal: true, width: 450, title: "Alerta" });
        $("#show_message").dialog("close");

        setTimeout(function () {

            var params = window.location.href.split('?');
            if (params.length > 1) {
                var Data = {};
                Data.confirm_token = params[1];
                $.execData('ConfirmEmail', Data, function (json) {
                    if (json) {
                        $("#show_message").bind("dialogclose", function (event, ui) {
                            window.location = 'index.aspx';
                        });

                        json = eval('(' + json + ')');

                        if (json.success == 'true') {
                            $('#stage_text').loader('end');
                            $('#stage_text').css('width', '370px');
                            $('#stage_text').css('margin-top', '20px');

                            var message = '';

                            message += '<span>';
                            message += 'Seu e-mail foi validado com sucesso. Você agora é usuário do MarketUP!';
                            message += '<br /><br />';
                            message += 'Para sua maior segurança, faremos a configuração inicial da sua conta em nosso sistema e dentro de no máximo 24 horas você vai receber um e-mail com as informações para utilização imediata do MarketUP em sua empresa.';
                            message += '<br /><br />';
                            message += 'Se você teve algum problema, entre em contato conosco pelo nosso <a href="http://suporte.marketup.com">Suporte Gratuito</a>';
                            message += '</span>';

                            $('#stage_text').html(message);
                           /* $('#stage_text').append('<button type="button" class="buttonFinish">ok</button>');
                            $('.buttonFinish').button().click(function () {
                                window.location = 'index.aspx';
                            });*/
                        } else {
                            $('#stage_text').loader('end');
                            $('#stage_text').css('width', '370px');
                            $('#stage_text').html('<span>Problemas ao validar seu cacastro. <br/> Tente novamente mais tarde.</span>');
                        }
                    }
                });
            } else {
                $("#show_message").bind("dialogclose", function (event, ui) {
                    window.location = 'index.aspx';
                });
                showMessage('Dados inválidos. Vefirique os dados e tente novamente.');
            }
        }, 500);
    });
}

loadComingSoon = function () {
    $(document).ready(function () {

        $("#show_message").dialog({ modal: true, width: 450, title: "Alerta" });
        $("#show_message").dialog("close");


        $('.required').each(function (index, item) {
            $(item).focusout(function () {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Required Field</p></div>");
                    }
                } else {
                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }
                }

            });

            $(item).keyup(function () {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    $(item).parent().append("<div class='boxMsgError'><p>Required Field</p></div>");
                } else {

                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }

                }

            });
        });

        $('.enviarFormulario').click(function () {
            $('.form div ul li .required').each(function (index, item) {
                if ($(item).val() == '' || $(item).val() == $(item).attr('placeholder')) {
                    $(item).addClass('error').removeClass('valid');
                    if ($(item).parent().find('.boxMsgError').size() == 0) {
                        $(item).parent().append("<div class='boxMsgError'><p>Required Field</p></div>");
                    }
                } else {
                    $(item).addClass('valid').removeClass('error');
                    if ($(item).parent().find('.boxMsgError').size() > 0) {
                        $(item).parent().find('.boxMsgError').remove();
                    }
                }
            });

            if ($('.error').length == 0) {
                $(this).loader();
                setTimeout(function () { sendComingSoon(); }, 200);
            }
        });
    });
}

sendComingSoon = function () {

    var Data = {};
    var values = {}

    $('input, textarea').each(function () {
        var that = $(this);
        values[that.attr('name')] = that.val();
    });


    Data.values = $.stringify(values).replace(/\"/g, "'");

    $.execData('SendContact', Data, function (ret) {

        var success = false;
        if (ret) {
            ret = eval('(' + ret + ')');
            if (ret.success) success = true;
        }

        if (success) {
            $("#show_message").bind("dialogclose", function (event, ui) {
                window.location = 'index.aspx';
            });
            showMessage('Message sent successfully.');
        } else {
            showMessage('Problems while sending the message. <br/> Try again later.');
        }

        $('.enviarFormulario').eq(0).loader('end');
    });

}

$(document).ready(function () {
    $('#marketup§ds_company').keypress(function (e) {
        if (e.which == 32 || e.keyCode == 32) {
            $('#marketup§ds_domain').val($('#marketup§ds_company').val());
            checkDomain();
        }
    });
});