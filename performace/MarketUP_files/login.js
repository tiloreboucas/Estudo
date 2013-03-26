
login_init = function () {

    $("#login§client_logo").attr("src", "files/docs/logo.gif?" + Number(new Date()));

    $("#frm_login").formvalidator();
    $('#login§ds_login').focus();
    $('#login§bt_forgot_pass').unbind('click').click(function () {
        var that = $(this);
        that.loader();
        setTimeout(function () {
            if ($('#login§ds_login').val() == '') {
                Mktup.alertModal('Preencha o usuário!', function (a) { $('#login§ds_login').focus(); })
                that.loader('end');
                return false;
            }
            else {
                SendMail($.rc4EncryptStr($('#login§ds_login').val(), Mktup.getHash()), function (resp) {
                    if (resp == true) {
                        Mktup.alertModal('Senha enviada para o email cadastrado.');
                        that.loader('end');
                        return false;
                    }
                    else {
                        Mktup.alertModal(resp);
                        that.loader('end');
                        return false;
                    }
                });
            }
        }, 100);
    });





    var hj = new Date();
    $('.headerDate span').eq(0).text(dateFormat.i18n.dayNames[hj.getDay() + 7] + ',');
    $('.headerDate span').eq(1).text($.getToday());
    $('.headerTime span').text(hj.getHours().padLeft(2) + 'h' + hj.getMinutes().padLeft(2));

    var loginTimer = setInterval(function () {

        if ($('.loginArea').size() == 0) clearInterval(loginTimer);

        var hj = new Date();
        var headerDate = $('.headerDate');
        var headerTime = $('.headerTime');

        headerDate.html('<span>' + dateFormat.i18n.dayNames[hj.getDay()] + ',</span><span>' + $.getToday() + '</span>\n');
        headerTime.html('<span>' + hj.getHours().padLeft(2) + 'h' + hj.getMinutes().padLeft(2) + '</span>');

    }, 60000);

    //Validação dos campos de Login e Senha
    if ($("#login§bt_login").hasClass('disableButton')) { $("#login§bt_login").attr("disabled", "disabled"); };

    $('#login§ds_login').add('#login§ds_password').unbind('keyup').keyup(function () {
        if ($('#login§ds_login').val().length != 0 && $('#login§ds_password').val().length != 0) {
            $("#login§bt_login").removeClass('disableButton');
            $("#login§bt_login").removeAttr("disabled");
        } else {
            $("#login§bt_login").removeClass('disableButton').addClass('disableButton');
            $("#login§bt_login").removeAttr("disabled").attr("disabled", "disabled");
        }
    });


    $('#login§ds_login').add('#login§ds_password').keyup(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $('#login§bt_login').click();
        }
    });

    $('#login§bt_login').unbind().bind('click', function () {

        $('#frm_login').formvalidator('validationGroup');
        if (!$('#frm_login')[0].attr.valid) return false;

        $('#login§bt_login').loader();
        sessionStorage.setItem('active_user', null);
        var user = $.rc4EncryptStr($('#login§ds_login').val(), Mktup.keyAuth), senha = $.rc4EncryptStr($('#login§ds_password').val(), Mktup.keyAuth);

        if (!navigator.onLine) {

            var current = eval('(' + localStorage.getItem('ActiveUserObject') + ')');

            if (current.d.m_au_user.ds_login == user) {

                var pars = {}; pars.d = {}; pars.d.parameters = {};
                pars.d.parameters.ds_login = user;
                pars.d.parameters.ds_password = senha;
                pars.d.parameters.id_profile = current.d.m_au_user.id_profile1;

                SyncGetDataOn(pars, "User", "ListData", false).done(function (user_json) {
                    user_json = eval(user_json);

                    if (user_json.length > 0) {

                        var login = {};
                        login.user = localStorage.getItem('ActiveUserObject');
                        login.timestamp = Number(new Date());
                        sessionStorage.setItem('active_user', JSON.stringify(login));

                        Mktup.termsCollection = eval('(' + login.user + ')');
                        Mktup.loadDateInfo();

                        $('#login§bt_login').loader('end');
                        $('section.MainSection').html('');
                        Mktup.goToStartPage();

                    } else {
                        Mktup.alertModal('Nenhum usuário encontrado. Não é possivel prosseguir no modo offline.', function () {
                            $('#login§bt_login').loader('end');
                            Mktup.Navigate('login');
                        });
                    }

                });

            } else {
                Mktup.alertModal('Nenhum usuário encontrado. Não é possivel prosseguir no modo offline.', function () {
                    $('#login§bt_login').loader('end');
                    Mktup.Navigate('login');
                });
            }

        } else {
            var pars = {}; pars.d = {}; pars.d.parameters = {};
            pars.d.parameters.ds_login = user;
            pars.d.parameters.ds_password = senha;

            SyncGetDataOn(pars, "ActiveUser", "AuthUser", false).done(function (user_json) {
                user_json = eval('(' + user_json + ')');

                if ($.epar(user_json)) {
                    if ($.epar(user_json.d.error)) {
                        Mktup.alertModal(user_json.d.error, function () { $('#login§bt_login').loader('end'); });
                    } else {
                        var login = {};
                        login.user = JSON.stringify(user_json);
                        login.timestamp = Number(new Date());
                        sessionStorage.setItem('active_user', JSON.stringify(login));
                        localStorage.setItem('ActiveUserObject', login.user);

                        Mktup.termsCollection = eval('(' + login.user + ')');
                        Mktup.loadDateInfo();

                        $('#login§bt_login').loader('end');
                        $('section.MainSection').html('');
                        Mktup.goToStartPage();

                    }
                }
            });
        }

    });
}