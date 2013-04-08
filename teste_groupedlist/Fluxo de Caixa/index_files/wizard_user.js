var wizard_user_dataholder = {};
wizard_user_dataholder.arrAttributes = [];

var list_obj = {};
list_obj.user = [];

wizard_user_init = function () {
    $('div.contentUser').loader();

    wizardUser_loadUserData().done(function (lud_return) {

        wizardUser_attachData().done(function () {

            $('div.contentUser').loader('end');

        });

    });

};

SortByName = function (x, y) {
    return ((x.name == y.name) ? 0 : ((x.name > y.name) ? 1 : -1));
};

wizardUser_loadUserData = function () {

    var defWizardUser_loadUserData = new $.Deferred();

    //Load User Data
    SyncGetDataOn({ d: {} }, "User", "ListData", false).done(function (list_ret) {
        list_obj.user = eval(list_ret);

        var html_code = "";

        html_code += '<h2>Usuários</h2>\n';
        html_code += '<div class="cb"></div>\n';
        html_code += '<div class="boxContent">\n';

        if (list_obj.user.length > 0) {

            for (var iu = 0; iu < list_obj.user.length; iu++) {

                WizardListPerson(list_obj.user[iu].id_person_simple, function (resp) {
                    resp = eval('(' + resp.d + ')');

                    list_obj.user[iu].name = (resp.name != null ? resp.name : "");
                    list_obj.user[iu].mail = (resp.mail != null ? resp.mail : "");
                    //list_obj.user[iu].phone = (resp.phone != null ? resp.phone : "");
                    list_obj.user[iu].phone = "";
                    list_obj.user[iu].is_operator_adm = resp.is_operator_adm;
                    list_obj.user[iu].is_operator = resp.is_operator;
                    list_obj.user[iu].foto = resp.foto;
                });


                if (iu == list_obj.user.length - 1) {

                    list_obj.user.sort(SortByName);

                    for (i = 0; i < list_obj.user.length; i++) {

                        user = list_obj.user[i];

                        html_code += '\t<div class="userItem">\n';

                        html_code += '\t\t<input type="hidden" class="userId" value=' + user.id_user + '>\n';

                        html_code += '\t\t<div class="mask" style="display:' + (user.in_block == "1" ? "block" : "none") + '"><div class="overlay"></div><p>USUÁRIO DESATIVADO</p></div>\n';
                        html_code += '\t\t<div class="buttonArea">\n';

                        html_code += '\t\t\t<div class="customradio" id="">\n';

                        html_code += '\t\t\t\t\t<input type="radio" name="" value="true" ' + (user.in_block == "1" ? '' : 'checked="checked"') + '>\n';
                        html_code += '\t\t\t\t\t<input type="radio" name="" value="false" ' + (user.in_block == "1" ? 'checked="checked"' : '') + '>\n';
                        html_code += '\t\t\t</div>\n';

                        html_code += '\t\t</div>\n';


                        html_code += '\t\t<div class="userItem_Content">\n';
                        html_code += '\t\t\t<div class="userItem_Info">\n';
                        html_code += '\t\t\t\t<img class="foto" src="'+ ($.epar(user.foto) ? user.foto : 'img/user.jpg') +'" alt="" />\n';
                        html_code += '\t\t\t\t<ul class="info">\n';
                        html_code += '\t\t\t\t\t<li class="nome">' + user.name + '</li>\n';
                        html_code += '\t\t\t\t\t<li class="telefone">' + user.phone + '</li>\n';
                        html_code += '\t\t\t\t\t<li class="email">' + user.mail + '</li>\n';
                        html_code += '\t\t\t\t</ul>\n';
                        html_code += '\t\t\t</div>\n';

                        html_code += '\t<div class="userItem_Permissoes">\n';
                        html_code += '\t\t<strong class="title">Permissões:</strong>\n';
                        html_code += '\t\t<ul class="userItem_PermissoesContent">\n';
                        html_code += '\t\t\t<li>\n';
                        html_code += '\t\t\t\t<strong>ERP</strong>\n';
                        html_code += '\t\t\t\t<span>' + user._ds_profile + ' &nbsp;</span>\n';
                        html_code += '\t\t\t</li>\n';
                        html_code += '\t\t\t<li>\n';
                        html_code += '\t\t\t\t<strong>PDV</strong>\n';
                        html_code += '\t\t\t\t<span>' + (user.is_operator_adm == 1 ? "Administrador" : (user.is_operator == 1 ? "Operador" : "")) + ' &nbsp;</span>\n';

                        html_code += '\t\t\t</li>\n';
                        html_code += '\t\t</ul>\n';
                        html_code += '\t</div>\n';
                        html_code += '\t\t</div>\n';

                        html_code += '\t</div>\n';

                    }

                }

            }

        }

        html_code += '\t<div class="userNewItem">\n';
        html_code += '\t\t<div class="userNewItem_Content"><p>Cadastre um novo usuário</p></div>\n';
        html_code += '\t</div>\n';
        html_code += '</div>\n';

        $('div.contentUser').html(html_code);

        defWizardUser_loadUserData.resolve(true);

    });

    return defWizardUser_loadUserData.promise();
};

wizardUser_attachData = function () {

    var defWizardUser_attachData = new $.Deferred();

    wizard_user_dataholder.arrAttributes.push({ "id_user": $(this.target).parent().parent().find('.userId').val() });

    $('.contentUser .customradio').customradio({
        'onTrue': function () {
            var target = this.target;
            WizardUpdateUserStatus($(target).parent().parent().find('.userId').val() * 1, 0).done(function (a) {
                a = a.d;
                if (!a)
                    Mktup.alertModal('Não foi possível ativar o usuário.<br><br>Contate o administrador do sistema.');
                else
                    $(target).parent().parent().find('.mask').hide();
            });

        },
        'onFalse': function () {
            var target = this.target;
            WizardUpdateUserStatus($(target).parent().parent().find('.userId').val() * 1, 1).done(function (b) {
                b = b.d;
                if (!b)
                    Mketup.alertModal('Não foi possível desativar o usuário.<br><br>Contate o administrador do sistema.');
                else
                    $(target).parent().parent().find('.mask').show();
            });

        }
    });

    var img = $('.contentUser .userItem_Info img');
    img.unbind('click').bind('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var that = $(this);

        var width = 50;
        var height = 50;

        that.parent().loader();

        Mktup.crop(width, height, function (img_crop) {

            if ($.epar(img_crop)) {

                var params = {};
                params.ImageName = img_crop.filepath;
                params.sPhotoName = img_crop.filepath;
                params.W = parseInt(img_crop.w);
                params.H = parseInt(img_crop.h);
                params.X = parseInt(img_crop.x);
                params.Y = parseInt(img_crop.y);
                params.sScale = height / params.H;

                SyncGetDataOn(params, 'Tools', 'resizeThumbnailImage', true).done(function (resize_result) {
                    resize_result = eval('(' + resize_result + ')');
                    if (resize_result.success) {
                        var par_obj = {};
                        par_obj.entity_name = 'user';
                        par_obj.field_name = 'ds_image';
                        par_obj.field_value = resize_result.filename;
                        par_obj.field_type = 'NVARCHAR(150)';
                        par_obj.id_entity = that.parents('.userItem').find('.userId').val();

                        SyncGetDataOn(par_obj, "Tools", "UpdateEntityField", false).done(function (uef_result) {
                            that.attr('src', resize_result.filename);
                            that.parent().loader('end');
                        });



                    } else {
                        that.attr('src', 'img/user.jpg');
                        that.parent().loader('end');
                    }

                });

            } else {
                that.attr('src', 'img/user.jpg');
                that.loader('end');
            }

        });

    });


    $('.userNewItem').unbind('click').bind('click', function () {
        $('.userItem').loader();

        wizardUser_detail(0).done(function () {
            $('.userItem').loader('end');
        });
    });

    $('.userItem').unbind('click').bind('click', function () {

    var that = $(this)

        that.find('.userItem_Content').loader();

        var id_user = $(this).find('.userId').val();
        var obj_user = getObjects(list_obj.user, "id_user", id_user);

        wizardUser_detail(obj_user).done(function () {
        });


    });


    defWizardUser_attachData.resolve(true);

    return defWizardUser_attachData.promise();

}

wizardUser_detail = function (userId) {

    var defWizardUser_detail = new $.Deferred();

    var nUser = new Mktup_User(userId);
    defWizardUser_detail.resolve(true);

    return defWizardUser_detail.promise();
}


function getObjects(obj, key, val) {
    var newObj = false;
    $.each(obj, function () {
        var testObject = this;
        $.each(testObject, function (k, v) {
            if (val == v && k == key) {
                newObj = testObject;
            }
        });
    });

    return newObj;
}

Mktup_User = function (user) {
    var getProfiles = function () {
        var deferred = $.Deferred();
        var pars = {}; pars.d = {}; pars.d.parameters = {}; pars.d.parameters.in_active = 1;
        SyncGetDataOn(pars, "Profile", "ListData", false).done(function (list_prof) {
            list_prof = eval(list_prof);
            var lista = '';

            $(list_prof).each(function (ix) {

                lista += this.id_profile + "|" + this.ds_profile
                if (ix < list_prof.length - 1)
                    lista += ",";
                else
                    deferred.resolve(lista);
            });

        });
        return deferred.promise();
    };

    var user_data = [];
    var markup = '';
    markup += '<div id="modalUserDetail">\n';
    markup += '\t<ul class="form">\n';

    markup += '<input type="hidden" class="userId" value="' + (user == 0 ? 0 : user.id_user) + '">\n';

    getProfiles().done(function (lista) {

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_name" >\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Nome</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_name"><input type="text" id="user_panel§name" name="user_panel§name" class="inputText required" value="' + (user == 0 ? "" : user.name) + '" /></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_email">\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Email</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_email"><input type="text" id="user_panel§email" name="user_panel§email" class="inputText preset email required" placeholder="usuario@dominio.com" value="' + (user == 0 ? "" : user.mail) + '" /></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Gerar:</span></span>\n';
        markup += '\t\t\t<label id="user_panel§lbl_operadorPdv" >\n';
        markup += '\t\t\t<span class="user_panel_pdv"><span class="fieldTitle"><input type="checkbox" class="inputCheckbox" style="margin-right: 5px;" />Operador de PDV</span></span>\n';
        markup += '\t\t\t<span class="user_panel_pdv"><span class="fieldTitle"><input type="checkbox" class="inputCheckbox" style="margin-right: 5px;" />Administrador de PDV</span></span>\n';
        markup += '\t\t\t<span class="user_panel_pdv"><span class="fieldTitle"><input type="checkbox" class="inputCheckbox" style="margin-right: 5px;" />Vendedor</span></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_perfil" >\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Perfil *</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_profile"><input type="hidden" class="required customselect" id="user_panel§profile" name="user_panel§profile" data-overload="' + lista + '" data-label="Selecione um Perfil" value="" /></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_login">\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Login</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_login"><input type="text" id="user_panel§login" name="user_panel§login" class="inputText required" value="' + (user == 0 ? "" : $.rc4DecryptStr(user.ds_login, Mktup.getHash())) + '" />\n';
        markup += '\t\t\t\t<img class="user_panel_valid_image" src="" alt="Válido" title="Login válido!"></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_pass">\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Senha</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_pass"><input type="password" id="user_panel§certificate_pass" name="user_panel§certificate_pass" class="inputPass pass required" value="' + (user == 0 ? "" : $.rc4DecryptStr(user.ds_password, Mktup.getHash())) + '" /></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t\t<li>\n';
        markup += '\t\t\t<label id="user_panel§lbl_confirm_pass">\n';
        markup += '\t\t\t\t<span class="user_panel_lbl"><span class="fieldTitle">Confirmar Senha</span></span>\n';
        markup += '\t\t\t\t<span class="user_panel_repass"><input type="password" id="user_panel§certificate_repass" name="user_panel§certificate_repass" class="inputPass preset passcheck required" value="' + (user == 0 ? "" : $.rc4DecryptStr(user.ds_password, Mktup.getHash())) + '" /></span>\n';
        markup += '\t\t\t</label>\n';
        markup += '\t\t</li>\n';

        markup += '\t</ul>\n';
        markup += '</div>\n';


        var arrButtons = [];



        arrButtons.push({
            "text": "Salvar",
            "class": "btSave"
        });

        $('.ui-dialog #modalUserDetail').formvalidator();

        Mktup.customModal('Atualizar Usuário', markup, arrButtons, function () { }).done(function (modal_id) {
            $('.customselect').customselect().customselect("setValue", user.id_profile);

            $('#user_panel§operatorPdv,#user_panel§administratorPdv').customradio();


            $('#user_panel§login').unbind('blur').bind('blur', function () {
                var field_log = $(this);
                WizardUserExists($.rc4EncryptStr($(this).val(), Mktup.getHash()), function (resp_1) {
                    resp_1 = eval('(' + resp_1.d + ')');
                    if (!resp_1.result || resp_1.id == user.id_user) {
                        field_log.next().show();
                        field_log.next().attr("src", "img/valid.gif");
                        field_log.next().attr("title", "Login válido!");
                        field_log.next().attr("rel", "Login válido!");
                    }
                    else {
                        field_log.next().show();
                        field_log.next().attr("src", "img/no_valid.gif");
                        field_log.next().attr("title", "Login inválido!");
                        field_log.next().attr("rel", "Login inválido!");
                    }
                });
            });

            $('.ui-dialog-titlebar-close').children('span').unbind('click').bind('click', function () {
                var sign_panel = $('#' + modal_id);
                sign_panel.dialog('close');
                wizard_user_init();
                $('.boxContent > .loader_container').parent().find('.userItem_Content').loader('end');
            });

            $('.btSave').unbind('click').bind('click', function () {

                $('.ui-dialog #modalUserDetail').formvalidator("validationGroup");

                if ($('.ui-dialog #modalUserDetail')[0].attr.valid) {

                    $('.boxContent > .loader_container').parent().find('.userItem_Content').loader('end');

                    if ($('#user_panel§login').next(':visible').length == 0 || $('#user_panel§login').next().attr("src") == "img/valid.gif") {
                        if ($('#user_panel§certificate_pass').val() != $('#user_panel§certificate_repass').val()) {
                            Mktup.alertModal('Confirmação de senha incorreta!</br></br>Digite o valor correto no campo e tente novamente.', function () {
                                $('#user_panel§certificate_repass').focus();
                            });
                            return false;

                        }

                        //$('#form-w-user').formvalidator();

                        //                    $('#form-w-user').formvalidator('clearForm');

                        //                    $('#form-w-user').formvalidator('validationGroup');

                        //                    if (!$('#form-w-user')[0].attr.valid) return false;


                        var obj = {};
                        obj.user = {};

                        obj.user.ds_login = $.rc4EncryptStr($('#user_panel§login').val(), Mktup.getHash());
                        obj.user.ds_password = $.rc4EncryptStr($('#user_panel§certificate_pass').val(), Mktup.getHash());
                        obj.user.id_profile = $('#user_panel§profile').val();
                        obj.user._confirm_ds_password = $.rc4EncryptStr($('#user_panel§certificate_repass').val(), Mktup.getHash());

                        if (user == 0) {
                            obj.user.id_user = "0";
                            obj.user.id_person_simple = 0;
                            obj.user.in_block = 0;

                            WizardInsertPerson($('#user_panel§name').val(), $('#user_panel§email').val(), 1, true, (($("#user_panel§operatorPdv input[checked]").val() == 'true') ? true : false), (($("#user_panel§administratorPdv input[checked]").val() == 'true') ? true : false), function (resultado) {
                                obj.user.id_person_simple = resultado.d;
                            });
                            SyncGetDataOn({ d: [obj.user] }, "User", "InsertData", false).done(function (new_user) {
                                var sign_panel = $('#' + modal_id);
                                sign_panel.dialog('close');
                                wizard_user_init();
                            });

                        } else {
                            obj.user.id_user = user.id_user;
                            obj.user.id_person_simple = user.id_person_simple;
                            obj.user.in_block = user.in_block;

                            WizardUpdatePerson(obj.user.id_person_simple, $('#user_panel§name').val(), $('#user_panel§email').val(), (($('#modalUserDetail #user_panel§operatorPdv input[checked]').val() == 'true') ? true : false), (($('#modalUserDetail #user_panel§rdbAdministratorPdv[checked]').val() == 'true') ? true : false), function (resp_wiz_updt) {
                                resp_wiz_updt = eval(resp_wiz_updt);
                            });

                            delete obj.user._confirm_ds_password;
                            SyncGetDataOn({ d: [obj.user] }, "User", "UpdateData", false).done(function (new_user) {
                                var sign_panel = $('#' + modal_id);
                                sign_panel.dialog('close');
                                wizard_user_init();

                            });


                        }

                    }
                    else {
                        Mktup.alertModal('Login já existente.<br/><br/>Escolha outro login para este usuário.', function () {
                            $('#user_panel§login').focus();
                        });
                        return false;
                    }
                }


            });

            var sign_panel = $('#' + modal_id);

            sign_panel.dialog('open');
        });

    });

}

