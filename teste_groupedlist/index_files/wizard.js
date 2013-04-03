/* Sidebar (Botões) */
wizard_init = function () {
    var buttons = $(".wizardSidebar ul li button");
    wizard_suporteUserInfo();
    buttons.click(function () {
        var bt = $(this);

        bt.loader();
        buttons.removeClass("active");
        $("article.wizardContent > div").hide();

        var content = $('div.content' + this.className.substring(2));
        if (content.length > 0) {
            content.show();
        } else {
            $("article.wizardContent").append('<div class="content' + this.className.substring(2) + '"></div>');
            content = $('div.content' + this.className.substring(2));
            content.show();
            $.loadModule(content, bt.attr('data-file'));
        }
        content.show();
        bt.loader('end');
        bt.addClass("active");
    });


    $('.mainButton').unbind("click").click(function () {
        var that = $(this);
        that.loader();
        if ($('.textarea').val().length > 0) {

            var bd = '';
            bd += "ID do Cliente: " + ClientId + "<br/>";
            bd += "Dominio de acesso: " + document.domain + "<br/>";
            bd += "Nome do Usuário: " + $('#suporte_user_name').val() + "<br/>";
            bd += "Email do Usuário: " + $('#suporte_user_email').val() + "<br/><br/>";
            bd += "Mensagem: <br/>";
            bd += $('.textarea').val();

            $.ajax({
                type: "POST",
                url: AppPath + "/Tools_DataEngine.aspx/SendMail",
                data: "{ 'pTo': 'atendimento@marketup.com','pToName': 'SUPORTE VIA SISTEMA', 'pSubject': 'SUPORTE', 'pBody': '" + bd + "' }",
                contentType: "application/json; charset=utf-8",
                datatype: "jsondata",
                async: false,
                error: function () { console.log("ERROR"); },
                success: function (response) {
                    that.loader("end");
                    if (response.d == 'ok') {
                        $('.textarea').val("");
                        Mktup.alertModal("E-mail enviado com sucesso!");
                    }
                    else
                        Mktup.alertModal("Erro ao enviar e-mail! Tente novamente.");
                }
            });
        } else {
            Mktup.alert("Digite sua mensagem.");
            return false;
        }
    });

    $('#wizard§chk_go_to_wizard').unbind('click').bind('click', function () {
        localStorage["go_to_wizard"] = ((this.checked) ? 'no' : 'yes');
    });

    if ($.epar(localStorage["go_to_wizard"]) == 'no') $('#wizard§chk_go_to_wizard').attr('checked', true);
}

wizard_suporteUserInfo = function () {
    var user_active = eval('(' + eval('(' + sessionStorage['active_user'] + ')').user + ')').d.m_au_user;
    $('.fieldContent #suporte_user_name').val(user_active.ds_user_name);
    $('.fieldContent #suporte_user_email').val(user_active.ds_user_email);
}

wizard_checkJava = function (_parent) {

    var bt = _parent.find("#wizard§check_java");
    var sp = bt.find('div span');
    var ld = bt.find('div.fl');

    ld.loader();

    if (!navigator.javaEnabled()) {
        sp.removeAttr("class").addClass("icoErrorBig");
        bt.find('div p').html('Seu browser não tem suporte a Java.');
        ld.loader('end');
        return;
    }

    if($('html').hasClass('mac')) {
        sp.removeAttr("class").addClass("icoErrorMac");
        bt.find('div p').html('Não disponivel para Chrome no Mac OS');
        ld.loader('end');
    } else if (!deployJava.versionCheck('1.7')) {
        sp.removeAttr("class").addClass("icoCautionBig");
        bt.find('div p').html('Java desatualizado, atualize a versão.');
        ld.loader('end');
    } else {

        bt.find('div p').html('Carregando applet MarketUP ...');
        Mktup.init_AppletNfe().done(function (nfeapplet_load_result) {

            if (!nfeapplet_load_result) {
                sp.removeAttr("class").addClass("icoErrorBig");
                bt.find('div p').html('O applet do MarketUp não foi carregado corretamente.');
            } else {
                sp.removeAttr("class").addClass("icoCheckBig");
                bt.find('div p').html('Suporte a Java em funcionamento');
            }
            ld.loader('end');

        });
       
    }
};

wizard_checkMarketupPackage = function (_parent) {

    var bt = _parent.find("#wizard§check_marketup_package");
    var sp = bt.find('div span');
    var ld = bt.find('div.fl');

    ld.loader();

    if($('html').hasClass('mac')) {
        sp.removeAttr("class").addClass("icoErrorMac");
        bt.find('div p').html('Não disponivel para Mac OS');
        ld.loader('end');

        if ($(".notification .icoCheckBig").size() > 0) { 
            $("#wizard_pdv_pdv_panel").show(); 
            $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
            $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel para Mac OS");
        }
    } else if ((!navigator.javaEnabled()) || (!deployJava.versionCheck('1.7')) || ($('#NFe_Applet').length == 0)) {
        sp.removeAttr("class").addClass("icoErrorBig");
        bt.find('div p').html('<a href="http://files.marketup.com/downloads/fiscalprinter.msi" target="_blank">Clique aqui</a> para instalar o <span>app</span> do MarketUP');
        ld.loader('end');
        if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
        else {
                        $("#wizard_pdv_pdv_panel").show();
                        $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                        $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                    }

    } else {
        Mktup.init_AppletNfe(true).done(function (nfeapplet_load_result) {

            if (nfeapplet_load_result) {
                sp.removeAttr("class").addClass("icoCheckBig");
                bt.find('div p').html('APP do MarketUP instalado com sucesso.');
                ld.loader('end');
                if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
                else {
                        $("#wizard_pdv_pdv_panel").show();
                        $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                        $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                    }
            } else {
                sp.removeAttr("class").addClass("icoErrorBig");
                bt.find('div p').html('<a href="http://files.marketup.com/downloads/fiscalprinter.msi" target="_blank">Clique aqui</a> para instalar o <span>app</span> do MarketUP');
                ld.loader('end');
                if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
                else {
                        $("#wizard_pdv_pdv_panel").show();
                        $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                        $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                    }
            }
        });

        setTimeout(function () {
            try {
                var nfa = document.applets["NFe_Applet"];

                if (nfa.Verify_Class("org.apache.commons.httpclient.protocol.ProtocolSocketFactory") && nfa.Verify_Class("org.apache.commons.codec.binary.Base64")) {
                    sp.removeAttr("class").addClass("icoCheckBig");
                    bt.find('div p').html('APP do MarketUP instalado com sucesso.');
                    ld.loader('end');
                    if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
                    else {
                        $("#wizard_pdv_pdv_panel").show();
                        $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                        $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                    }
                } else {
                    sp.removeAttr("class").addClass("icoErrorBig");
                    bt.find('div p').html('<a href="http://files.marketup.com/downloads/fiscalprinter.msi" target="_blank">Clique aqui</a> para instalar o <span>app</span> do MarketUP');
                    ld.loader('end');
                    if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
                    else {
                        $("#wizard_pdv_pdv_panel").show();
                        $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                        $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                    }
                }
            } catch (eerr) {
                sp.removeAttr("class").addClass("icoErrorBig");
                bt.find('div p').html('<a href="http://files.marketup.com/downloads/fiscalprinter.msi" target="_blank">Clique aqui</a> para instalar o <span>app</span> do MarketUP');
                ld.loader('end');
                if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
                else {
                    $("#wizard_pdv_pdv_panel").show();
                    $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                    $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
                }
            }
            
            if ($(".notification .icoCheckBig").size() == 3) { $("#wizard_pdv_pdv_panel").show(); }
            else {
                $("#wizard_pdv_pdv_panel").show();
                $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel"); 
            }

            if($('html').hasClass('mac')) {if ($(".notification .icoCheckBig").size() > 0) { 
                $("#wizard_pdv_pdv_panel").show();
                $('#wizard_pdv§in_use_printer').css("visibility", "hidden");
                $('#wizard_pdv_printer_panel .boxContent.header p').text("Não disponivel para Mac OS"); 
            }}
        }, 11000);
    }
};

wizard_checkOffLineSupport = function (_parent) {

    var bt = _parent.find("#wizard§check_offline");
    var sp = bt.find('div span');
    var ld = bt.find('div.fl');

    ld.loader();

    if (window.webkitStorageInfo) {

        var ofs = new OmegaFile();

        ofs.checkQuota().done(function (ix) {
            if (ix > 0) {
                sp.removeAttr("class").addClass("icoCheckBig");
                bt.find('div p').html('Suporte a navegação OFF-LINE');
                ld.loader('end');

                if($('html').hasClass('mac')) {
                    if ($(".notification .icoCheckBig").size() > 0) { $("#wizard_pdv_pdv_panel").show(); }
                }
            }
            else {
                sp.removeAttr("class").addClass("icoCautionBig");
                bt.find('div p').html('Seu browser dispõe de pouco espaço OFF-LINE');
                ld.loader('end');
            }
        });

    } else if (localStorage) {
        sp.removeAttr("class").addClass("icoCautionBig");
        bt.find('div p').html('Seu browser dispõe de pouco espaço OFF-LINE');
        ld.loader('end');
    } else {
        sp.removeAttr("class").addClass("icoErrorBig");
        bt.find('div p').html('Seu browser não suporta navegação OFF-LINE');
        ld.loader('end');
    }
};