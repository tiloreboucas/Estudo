MktUP_Instance = function () {
    //Pagina Ativa
    this.activePage = {},
    this.instanceId = null,
    this.keyAuth = null,

    //Coleção de Termos
    this.termsCollection = [],

    //Informações de data
    this.dayNames = [],
    this.dayNamesMin = [],
    this.dayNamesShort = [],
    this.monthNames = [],
    this.monthNamesShort = [],

    this.getCurrentCurrency = function () {
        return 'R$';
    },

    this.getHash = function () {
        return ((((ClientId % 2 == 0) ? String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * String(ClientId)[0] * 1))).toFixed(10)).concat('MOD') : String(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * (String(ClientId)[0] * 1 + 1)))).split('.')[1]) == undefined) ? 'Un' + ClientId + 'd&f' + ClientId + '1n3D' : (ClientId % 2 == 0) ? String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * String(ClientId)[0] * 1))).toFixed(10)).concat('MOD') : String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * (String(ClientId)[0] * 1 + 1)))).toFixed(10)).split('.')[1]);
    },

    this.getPath = function () {
        return 'C:\\IVX\\' + ClientId + '\\';
    },

    this.checkLogin = function () {

        var def_checkLogin = $.Deferred();

        var userLogged = true;
        var pageLogin = (_instance.activePage.pageEntity == 'login');
        var activeUser = sessionStorage['active_user'];
        activeUser = eval('(' + activeUser + ')');

        //Check if user is logged
        userLogged = (($.epar(activeUser)) && (activeUser != 'null'));

        //Check session time out
        //TODO: Check online session
        var current_timestamp = Number(new Date());
        if ((userLogged) && ((((current_timestamp - activeUser.timestamp) / 1000) / 60) > 60)) {
            //Session time out
            sessionStorage.setItem['active_user'] = null;
            userLogged = false;
        }

        var params = {};

        //Login is Current Page
        if (pageLogin) {
            if (userLogged) {
                params.pageEntity = getStartPage();
                params._instance = _instance;
                _instance.activePage = new MktUP_Page(params);
            }

        } else {
            if (!userLogged) {
                params.pageEntity = 'login';
                params._instance = _instance;
                _instance.activePage = new MktUP_Page(params);
            }
        }

        def_checkLogin.resolve(true);

        return def_checkLogin.promise();
    },

    this.logOut = function () {

        var doLogout = function () {
            sessionStorage.removeItem('active_user');
            if (navigator.onLine) {
                SyncGetDataOn({ d: {} }, 'ActiveUser', 'LogoutActiveUser', true).done(function () { _instance.Navigate('login'); });
            } else {
                _instance.Navigate('login');
            }
        }

        if (_instance.activePage.renderType != 2) {
            doLogout();
        } else if (!_instance.checkFormChanges()) {
            doLogout();
        } else {
            Mktup.Confirm('Existem informações não salvas.', 'Continuar assim mesmo?', function (pYes) {
                if (pYes) doLogout();
            });
        }

    },

    this.loadDateInfo = function () {

        _instance.dayNames = [_instance.translator(10633), _instance.translator(10634), _instance.translator(10635), _instance.translator(10636), _instance.translator(10637), _instance.translator(10638), _instance.translator(10639)];
        _instance.dayNamesMin = [_instance.dayNames[0].substr(0, 1), _instance.dayNames[1].substr(0, 1), _instance.dayNames[2].substr(0, 1), _instance.dayNames[3].substr(0, 1), _instance.dayNames[4].substr(0, 1), _instance.dayNames[5].substr(0, 1), _instance.dayNames[6].substr(0, 1)];
        _instance.dayNamesShort = [_instance.dayNames[0].substr(0, 3), _instance.dayNames[1].substr(0, 3), _instance.dayNames[2].substr(0, 3), _instance.dayNames[3].substr(0, 3), _instance.dayNames[4].substr(0, 3), _instance.dayNames[5].substr(0, 3), _instance.dayNames[6].substr(0, 3)];

        _instance.monthNames = [_instance.translator(10466), _instance.translator(10468), _instance.translator(10469), _instance.translator(10470), _instance.translator(10471), _instance.translator(10472), _instance.translator(10473), _instance.translator(10474), _instance.translator(10475), _instance.translator(10476), _instance.translator(10477), _instance.translator(10478)];
        _instance.monthNamesShort = [_instance.monthNames[0].substr(0, 3), _instance.monthNames[1].substr(0, 3), _instance.monthNames[2].substr(0, 3), _instance.monthNames[3].substr(0, 3), _instance.monthNames[4].substr(0, 3), _instance.monthNames[5].substr(0, 3), _instance.monthNames[6].substr(0, 3), _instance.monthNames[7].substr(0, 3), _instance.monthNames[8].substr(0, 3), _instance.monthNames[9].substr(0, 3), _instance.monthNames[10].substr(0, 3), _instance.monthNames[11].substr(0, 3)];
    },

    this.Navigate = function (page_name, params) {

        if (!$.epar(params)) params = {};
        params.pageEntity = page_name;
        params._instance = _instance;

        if (!_instance.checkFormChanges() || (page_name == 'login')) {
            _instance.activePage = new MktUP_Page(params);
            _instance.activePage.Render();
        } else {
            Mktup.Confirm('Existem informações não salvas.', 'Continuar assim mesmo?', function (pYes) {

                if (pYes) {
                    _instance.activePage = new MktUP_Page(params);
                    _instance.activePage.Render();
                }

            });
        }
    },

    this.goToStartPage = function () {
        var start_page = getStartPage();
        _instance.Navigate(start_page);
    },

    this.getTopRender = function () {
        var current_page = _instance.activePage;
        if (current_page.pageSheets.length > 0) current_page = current_page.pageSheets[current_page.pageSheets.length - 1];
        return current_page;
    },

    this.getCurrentPanelRender = function () {
        return _instance.getTopRender().getCurrentRender().find('div.pageMain');
    },

    this.makeReadOnly = function (keepAdd) {

        var thatPanel = Mktup.getCurrentPanelRender();
        var currentControls = thatPanel.find(":input").not(":button").not(":hidden").not('.customselect');
        currentControls.each(function () {
            var that = $(this);
            if (!that.hasClass('textsearch')) {
                that.attr('readonly', true);
            } else {
                that.addClass('readonly');
            }
        });

        currentControls = thatPanel.find(".customselect");
        currentControls.each(function () {
            var that = $(this);
            that.customselect('toReadOnly');
        });

        currentControls = thatPanel.find(":checkbox, :radio")
        currentControls.each(function () {
            var that = $(this);
            that.attr('disabled', true);
        });

        if (!($.epar(keepAdd) == true)) {
            thatPanel.parent().find(".actionBar button.addNew").unbind().addClass('disableButton');
            thatPanel.find('.notificationBar .addActionButton').remove();
        }

        thatPanel.find('.crud button').hide();
        thatPanel.find('.grid .crud button, .formgrid .crud button').remove();
        thatPanel.find('[id*="§bt_grid_add"], [id*="§bt_save_form"]').remove();

        thatPanel.find('.grid a, .formgrid a').css('cursor', 'default');

        thatPanel.find(".datepicker").datepicker("destroy");

    },

    this.cleanGrid = function () {
        var defMktup_cleanGrid = new $.Deferred();
        _instance.getCurrentPanelRender().find('.panelMain.grid, .panelMain.formgrid').find('button').remove();
        defMktup_cleanGrid.resolve(true);
        return defMktup_cleanGrid.promise();
    },

    this.alertModal = function (Message, callback) {
        var AlertID = Number(new Date());
        AlertID = 'alert_' + AlertID;

        $('body').append('<div id="' + AlertID + '" ><p class="tac"></p></div>');

        if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
        $("#" + AlertID + " p.tac").html(Message);
        $("#" + AlertID).dialog({
            title: 'Aviso',
            draggable: true,
            resizable: false,
            width: 370,
            zIndex: 5000,
            modal: true,
            close: function (event, ui) {
                $("#" + AlertID).remove();
                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
                if (callback) callback();
            },
            open: function (event, ui) {
                if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
            },
            buttons: [{
                text: "OK",
                'class': "btYes",
                click: function () {
                    $(this).dialog("close");
                }
            }]
        });

    },

    this.customModal = function (modal_title, modal_html, modal_buttons, close_function) {

        var defMktup_customModal = new $.Deferred();

        var CustomID = Number(new Date());
        CustomID = 'custom_' + CustomID;

        $('body').append('<div id="' + CustomID + '" style="display:none;"></div>');
        if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
        $("#" + CustomID).html(modal_html);
        $("#" + CustomID).dialog({
            title: modal_title,
            autoOpen: false,
            draggable: true,
            resizable: false,
            width: 570,
            zIndex: 4000,
            modal: true,
            close: function (event, ui) {
                close_function($(this));
                $("#" + CustomID).remove();
                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
            },
            open: function (event, ui) {
                if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
            },
            buttons: modal_buttons
        });

        defMktup_customModal.resolve(CustomID);

        return defMktup_customModal.promise();
    },

    this.Confirm = function (Message1, Message2, callback) {

        var ConfirmID = Number(new Date());
        ConfirmID = 'confirm_' + ConfirmID;

        $('body').append('<div id="' + ConfirmID + '" ><p class="tac"></p></div>');

        if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
        $("#" + ConfirmID + " p.tac").html(Message1 + '\n' + Message2);
        $("#" + ConfirmID).dialog({
            title: 'Confirmação',
            draggable: true,
            resizable: false,
            width: 370,
            zIndex: 5000,
            modal: true,
            close: function (event, ui) {
                $("#" + ConfirmID).remove();
                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
            },
            open: function (event, ui) {
                if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
            },
            buttons: [{
                text: "Sim",
                'class': "btYes",
                click: function () {
                    if (callback) callback(true);
                    $(this).dialog("close");
                }
            }, {
                text: "Não",
                'class': "btNo",
                click: function () {
                    if (callback) callback(false);
                    $(this).dialog("close");
                }
            }]
        });

    },

    this.showPrint = function (str, title) {
        title = $.epar(title) ? title : '';
        var print_id = 'print_modal_' + Number(new Date());


        $('<div id="' + print_id + '"class="printModal" title="' + title + '"></div>').appendTo('body');
        $('#' + print_id).dialog({
            modal: true,
            width: "1023",
            height: $(window).height(),
            zIndex: 3000,
            position: "center",
            resizable: false,
            close: function () {
                $('#' + print_id).remove();
                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
            },
            open: function (event, ui) {
                if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
            },
            buttons: [{
                text: "Imprimir",
                'class': "btPrintModal",
                click: function () { $('#' + print_id).printElement({ printMode: 'iframe' }); return false; }
            },
            {
                text: "Cancelar",
                'class': "btCancelModal",
                click: function () {
                    $(this).dialog("close");
                    $('#' + print_id).remove();
                }
            }]
        });
        $(str).appendTo('#' + print_id);
    },

    this.renderPDVButton = function (PDVButton) {

        PDVButton.loader({ color: 'black' });

        PDVButton.unbind('click').bind('click', function () {
            $('.Main section').removeClass('DashboardOpen').addClass('noDashboard');
            _instance.Navigate('pdv');
        });

        var saveOperatorFile = function (ofs, oper, emp, json) {

            var defSaveOperatorFile = new $.Deferred();

            oper.id_operator = emp[0].id_operator;
            oper._ds_operator = emp[0]._ds_operator;
            oper.id_user = json[0].id_user;
            oper.id_profile = json[0].id_profile;
            oper.in_authorization_manager = emp[0].in_authorization_manager;
            ofs.WriteFile(_instance.getPath() + 'OPER_PDV.ivx', sjcl.encrypt(Mktup.getHash(), JSON.stringify(oper)), function (e) {

                defSaveOperatorFile.resolve(!((e) && (e.code)));

            });

            return defSaveOperatorFile.promise();
        };

        //Captura Dados do Operador
        var valid = true;
        var user = eval('(' + sessionStorage['active_user'] + ')'); user = eval('(' + user.user + ')');

        if ($.epar(user)) {

            var oper = {};
            var ofs = new OmegaFile();

            SyncGetDataOn(eval('({d:{"parameters":{"id_user": "' + user.d.m_au_user.id_user + '", "in_block":0}}})'), "User", "ListData", false).done(function (json) {
                json = eval('(' + json + ')').d;

                SyncGetDataOn(eval('({d: {"parameters":{"id_employee": "' + json[0].id_person_simple + '", "in_active":1}}})'), "Operator", "ListData", false).done(function (ret_emp) {
                    ret_emp = eval('(' + ret_emp + ')').d;

                    if ((ret_emp.length > 0) && (sjcl)) {
                        emp = ret_emp;

                        //Abre arquivo de configuração
                        ofs.ReadFile(_instance.getPath() + 'CONF_PDV.ivx', function (tk) {

                            if ($.epar(tk) && (!tk.code)) {

                                ofs.ReadFile(_instance.getPath() + 'ST_PDV.ivx', function (a) {

                                    var conf = false;
                                    if ((a) && (!a.code)) conf = sjcl.decrypt(tk, a);

                                    ofs.ReadFile(_instance.getPath() + 'OPER_PDV.ivx', function (op_aux) {

                                        //Arquivo existe e esta preenchido
                                        if ($.epar(op_aux) && (!(op_aux.code)) && ($.epar(conf))) {
                                            d_op_aux = sjcl.decrypt(_instance.getHash(), op_aux);
                                            d_op_aux = eval('(' + d_op_aux + ')');
                                            if ($.epar(d_op_aux.id_old_operator)) {
                                                oper.id_old_operator = d_op_aux.id_old_operator;
                                                oper._ds_old_operator = d_op_aux._ds_old_operator;
                                            } else {
                                                valid = (d_op_aux.id_operator == emp[0].id_operator);
                                                if (!valid) {
                                                    oper.id_old_operator = d_op_aux.id_operator;
                                                    oper._ds_old_operator = d_op_aux._ds_operator;
                                                }
                                            }

                                        } else {
                                            localStorage.removeItem('profile_pdv');
                                        }

                                        saveOperatorFile(ofs, oper, emp, json).done(function (sof_result) {

                                            if (!$.epar(conf)) {
                                                PDVButton.removeAttr('class').addClass('closed-coupon').html(_instance.translator(10878)).attr('title', 'Clique aqui para abrir o PDV');
                                            } else if (!valid) {
                                                PDVButton.removeAttr('class').addClass('locked-coupon').html('BLOQUEADO').attr('title', 'PDV bloqueado para o usuário ' + oper._ds_old_operator + '.');
                                            } else if ($.epar(localStorage.getItem('profile_pdv'))) {
                                                PDVButton.removeAttr('class').addClass('active-coupon').html(_instance.translator(10879)).attr('title', 'Cupom em andamento nesta máquina.');
                                            } else {
                                                PDVButton.removeAttr('class').addClass('open-coupon').html(_instance.translator(10877)).attr('title', 'PDV Aberto para este usuário.');
                                            }
                                            PDVButton.loader('end');
                                        });
                                    });
                                });
                            } else {
                                PDVButton.removeAttr('class').html('DESABILITADO').attr('title', 'Nenhum PDV configurado nesta máquina.');
                                PDVButton.unbind('click');
                                PDVButton.loader('end');
                            }
                        });

                    } else {
                        PDVButton.removeAttr('title').removeAttr('class').addClass('unavailable-coupon').html('INDISPONÍVEL').attr('title', 'O usuário ativo não é operador de PDV.');
                        PDVButton.unbind('click');
                        PDVButton.loader('end');
                    }
                });
            });

        } else {
            _instance.Navigate('login');
        }

    },

    this.translator = function (id) {

        var terms = _instance.termsCollection;
        if (!$.epar(terms) || !$.epar(terms.d) || !$.epar(terms.d.ls_term) || !$.epar(id) || (typeof (id * 1) != "number")) return '';
        terms = terms.d.ls_term;

        for (var i_translator in terms) {
            if (terms[i_translator].id_term == id) return terms[i_translator].ds_term;
        }
    },

    this.saveInstance = function () {

        //Read existing instances
        var arrCurrentInstances = sessionStorage["mktup_curr_instances"];
        arrCurrentInstances = eval(arrCurrentInstances);

        if (!$.epar(arrCurrentInstances)) _instance.Navigate('login');

        for (var i = 0; i < arrCurrentInstances.length; i++) {
            if (arrCurrentInstances[i].instanceId == Number(window.name.replace('mktup_', ''))) {
                arrCurrentInstances[i] = _instance;
                break;
            }
        }

        //Save instances
        sessionStorage["mktup_curr_instances"] = JSON.stringify(arrCurrentInstances);

    },

    this.clearMainSection = function () {
        $('section.MainSection').empty();
    },

    this.buildHeader = function (params) {

        var header = $('header.MainHeader');
        var keep = ((params) && (params.keepHeader)) ? params.keepHeader : false;
        var keepMenu = ((params) && (params.keepMenu)) ? params.keepMenu : false;
        var keepDashboard = ((params) && (params.keepDashboard)) ? params.keepDashboard : false;


        if (header.length > 0) {
            if (!keep) header.empty();
        } else {
            $('section.MainSection').append('<header class="MainHeader"></header>'); header = $('header.MainHeader');
        }
        if (!$.epar(header.html())) {
            header.append(_instance.buildHeaderTop());

            //Help Button Binding
            $('div.headerTop div.headerFirstPart div.fr button.btHelp').unbind('click').bind('click', function () {
                window.open('http://suporte.marketup.com', 'suporte_marketup', 'width=800, height=600');
            });

            //Logout Button Binding
            $('div.headerTop div.headerFirstPart div.fr button.btExit').unbind('click').bind('click', function () {
                _instance.logOut();
            });

            //Wizard Button Binding
            $('div.headerTop div.headerFirstPart div.fr button.btConfiguration').unbind('click').bind('click', function () {
                if ($.epar(sessionStorage.getItem('active_user'))) {
                    var user_obj = eval('(' + eval('(' + sessionStorage.getItem('active_user') + ')').user + ')').d.m_au_user;
                    SyncGetDataOn(eval('({d:{"parameters":{"id_user": "' + user_obj.id_user + '"}}})'), "User", "ListData", false).done(function (user) {
                        user = eval(user)[0];
                        if (user.id_profile != 1) {
                            var markup = '<div id="modalGeneralUserDetail" title="Atualizar Usuário">' +
	                                    '<ul class="form">' +
                                            '<input type="hidden" id="general_user_panel§id" value="' + user.id_user + '">' +
                                            '<input type="hidden" id="general_user_panel§profile" value="' + user.id_profile + '">' +
                                            '<input type="hidden" id="general_user_panel§person_simple" value="' + user.id_person_simple + '">' +
                                            '<li><label id="user_panel§lbl_foto"><span class="user_panel_lbl"><span class="fieldTitle">Foto</span></span><div class="userItem_Info"><img class="foto" src="' + ($.epar(user.ds_image) ? user.ds_image : 'img/user.jpg') + '" alt="" style="width:50px; heigth:50px"></div><label></li>' +
		                                    '<li>' +
			                                    '<label id="user_panel§lbl_name">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Nome</span></span>' +
				                                    '<span class="user_panel_name"><input type="text" id="general_user_panel§name" name="general_user_panel§name" class="inputText" readonly="readonly" value="' + user._ds_person_simple + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
                                            '<li>' +
			                                    '<label id="user_panel§lbl_email">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Email</span></span>' +
				                                    '<span class="user_panel_email"><input type="text" id="general_user_panel§email" name="general_user_panel§email" class="inputText" readonly="readonly" value="' + user_obj.ds_user_email + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
                                             '<li>' +
			                                    '<label id="user_panel§lbl_profile">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Perfil</span></span>' +
				                                    '<span class="user_panel_profile"><input type="text" id="general_user_panel§profile_desc" name="general_user_panel§profile_desc" class="inputText" readonly="readonly" value="' + user._ds_profile + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
		                                    '<li>' +
			                                    '<label id="user_panel§lbl_login">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Login</span></span>' +
				                                    '<span class="user_panel_login"><input type="text" id="general_user_panel§login" name="general_user_panel§login" class="inputText" readonly="readonly" value="' + $.rc4DecryptStr(user.ds_login, Mktup.getHash()) + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
		                                    '<li>' +
			                                    '<label id="user_panel§lbl_pass">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Senha</span></span>' +
				                                    '<span class="user_panel_pass"><input type="password" id="general_user_panel§ds_pass" name="general_user_panel§certificate_pass" class="inputPass pass required" value="' + $.rc4DecryptStr(user.ds_password, Mktup.getHash()) + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
		                                    '<li>' +
			                                    '<label id="user_panel§lbl_confirm_pass">' +
				                                    '<span class="user_panel_lbl"><span class="fieldTitle">Confirmar Senha</span></span>' +
				                                    '<span class="user_panel_repass"><input type="password" id="general_user_panel§ds_repass" name="general_user_panel§certificate_repass" class="inputPass preset passcheck required" value="' + $.rc4DecryptStr(user.ds_password, Mktup.getHash()) + '"></span>' +
			                                    '</label>' +
		                                    '</li>' +
	                                    '</ul>' +
                                    '</div>';
                            $(markup).dialog({
                                modal: true,
                                zIndex: 3000,
                                open: function () {
                                    if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
                                    $(this).formvalidator();
                                    var img = $(this).find('.userItem_Info img');
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
                                                params.sScale = img_crop.s;

                                                SyncGetDataOn(params, 'Tools', 'resizeThumbnailImage', true).done(function (resize_result) {
                                                    resize_result = eval('(' + resize_result + ')');
                                                    if (resize_result.success) {


                                                        that.attr('src', resize_result.filename);
                                                        that.parent().loader('end');


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

                                },
                                close: function (event, ui) {
                                    if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
                                },
                                buttons: {
                                    Salvar: function () {
                                        var that = $(this);
                                        that.formvalidator("validationGroup");
                                        if (that[0].attr.valid) {
                                            var save_user = {};
                                            save_user.id_user = $(this).find('#general_user_panel§id').val();
                                            save_user.ds_login = $.rc4EncryptStr($(this).find('#general_user_panel§login').val(), Mktup.getHash());
                                            save_user.ds_password = $.rc4EncryptStr($(this).find('#general_user_panel§ds_pass').val(), Mktup.getHash());
                                            save_user.id_person_simple = $(this).find('#general_user_panel§person_simple').val();
                                            save_user.id_profile = $(this).find('#general_user_panel§profile').val();
                                            save_user.ds_image = $(this).find('img.foto').attr('src');
                                            save_user.in_block = 0;
                                            SyncGetDataOn({ d: [save_user] }, "User", "UpdateData", false).done(function (new_user) {
                                                if (new_user) {
                                                    that.dialog('close');
                                                    Mktup.alertModal('Dados atualizados com sucesso!');
                                                }
                                                else {
                                                    Mktup.alertModal('Não foi possível atualizar os dados. Contate o administrador!');
                                                }
                                            });
                                        }
                                    }
                                }
                            });

                        }
                        else {
                            _instance.Navigate('wizard');
                        }
                    });
                }
                else {
                    _instance.Navigate('login');
                }

            });

        }
        if (!params.noMenu) { $('header.MainHeader div.headerSecondtPart').show(); _instance.buildMenu(keepMenu) } else { $('header.MainHeader div.headerSecondtPart').empty().hide(); }
        if (!params.noDashboard) {
            $('section.MainSection').removeClass('noDashboard'); _instance.buildDashboard(false);
            //(keepDashboard);
        } else {
            $('header.MainHeader div.headerDashboard').remove();
            $('body section.MainSection').removeAttr("class").addClass("MainSection").addClass("noDashboard");
        }
    },

    this.buildHeaderTop = function () {

        var markup = '';
        var user = localStorage['ActiveUserObject'];

        if (!$.epar(user)) {
            _instance.Navigate('login');
            return;
        }

        user = eval('(' + user + ')').d.m_au_user;

        var hj = new Date();

        markup += '<div class="headerTop">\n';
        markup += '\t<div class="headerFirstPart">\n';
        markup += '\t\t<div class="fl">\n';
        markup += '\t\t\t<div class="headerLogo"><a href="javascript:Mktup.Navigate(\'dashboard\');void(0);" ><h1>MarketUP</h1></a></div>\n';
        markup += '\t\t\t<div class="headerDate">\n';
        markup += '\t\t\t\t<span>' + _instance.dayNames[hj.getDay()] + ',</span>\n';
        markup += '\t\t\t\t<span>' + $.getToday() + '</span>\n';
        markup += '\t\t\t</div>\n';
        markup += '\t\t\t<div class="headerTime"><span>' + hj.getHours().padLeft(2) + 'h' + hj.getMinutes().padLeft(2) + '</span></div>\n';
        markup += '\t\t</div>\n';
        markup += '\t\t<div class="fr">\n';
        markup += '\t\t\t<div class="headerUser"><p class="nameUser">' + user.ds_user_name + '</p></div>\n';
        markup += '\t\t\t<div class="holdings"><p class="nameHolding">' + user.ds_company_name + '</p></div>\n';
        markup += '\t\t\t<button class="btHelp" title="Ajuda"></button>\n';
        markup += '\t\t\t<button class="btConfiguration" title="Configurações"></button>\n';
        markup += '\t\t\t<button class="btExit" title="Sair"></button>\n';
        markup += '\t\t</div>\n';
        markup += '\t\t<div class="cb"></div>\n';
        markup += '\t</div>\n';
        markup += '\t<div class="headerSecondtPart"></div>\n';
        markup += '</div>\n';
        markup += '<div class="overlay"></div>';


        setInterval(function () {

            var hj = new Date();
            var headerDate = $('div.headerTop div.headerFirstPart div.headerDate');
            var headerTime = $('div.headerTop div.headerFirstPart div.headerTime');

            headerDate.html('\t\t\t\t<span>' + _instance.dayNames[hj.getDay()] + ',</span>\n\t\t\t\t<span>' + $.getToday() + '</span>\n');
            headerTime.html('<span>' + hj.getHours().padLeft(2) + 'h' + hj.getMinutes().padLeft(2) + '</span>');

        }, 60000);

        return markup;
    },

    this.setActiveMenu = function () {

        if ($.epar(_instance.activePage) && $.epar(_instance.activePage.pageEntity)) {

            var page_name = _instance.activePage.pageEntity.toLowerCase().trim();
            var menu_item = $('[data-link="' + _instance.activePage.pageEntity.toLowerCase().trim() + '"]');
        }

    },

    this.buildMenu = function (keep) {
        var menuContainer = $('header.MainHeader div.headerSecondtPart');

        if (!$.epar(sessionStorage['active_user'])) Mktup.Navigate('login');

        var menu = eval('(' + eval('(' + sessionStorage['active_user'] + ')').user + ')').d.ls_au_module[0].ls_au_menu;
        var markup = '';
        var link = '';
        var hasChilds = false;

        var x = 0, y = 0, z = 0;

        if (keep && $.epar(menuContainer.html())) {
            _instance.setActiveMenu();
            return;
        }

        markup += '<nav class="menu">\n';
        markup += '	<ul class="lstMenu">\n';

        for (var x = 0; x < menu.length; x++) {
            markup += '		<li ' + ((menu.length > 7) && (x > (menu.length - (menu.length - 6))) ? 'class="toleft"' : '') + '>';
            markup += '<a href="javascript:void();" class="menu_x menu' + menu[x].id_menu + '" data-menu="{\'id_menu\':' + menu[x].id_menu + ', \'id_menu_master\':' + menu[x].id_menu_master + ', \'id_term_help\':' + menu[x].id_term_help + '}" ><span></span>' + menu[x].ds_menu + '</a>';

            if (($.epar(menu[x].ls_au_menu)) && (menu[x].ls_au_menu.length > 0)) {
                markup += '			<div class="subMenu">\n';
                markup += '				<ul>\n';

                var menu_y = menu[x].ls_au_menu;
                for (var y = 0; y < menu_y.length; y++) {

                    hasChilds = (($.epar(menu_y[y].ls_au_menu)) && (menu_y[y].ls_au_menu.length > 0));

                    if (menu_y[y].id_menu_master == 7 && menu_y[y].id_menu != 82 && !hasChilds && menu_y[y].in_report == 0) continue;

                    link = '';
                    if (!hasChilds) {
                        if ($.epar(menu_y[y].ds_link)) {
                            link = menu_y[y].ds_link;
                        } else if ($.epar(menu_y[y].m_au_page)) {
                            link = menu_y[y].m_au_page.ds_page_link;
                        }
                    }
                    markup += '					<li ' + (hasChilds ? 'class="hasChild img_' + menu_y[y].id_menu + '"' : '') + '>';
                    markup += '<a href="javascript:void();" class="menu_y" data-menu="{\'id_menu\':' + menu_y[y].id_menu + ', \'id_menu_master\':' + menu_y[y].id_menu_master + ', \'id_term_help\':' + menu_y[y].id_term_help + '}"  ' + ($.epar(link) ? 'data-link="' + link.toLowerCase() + '"' : '') + ' ><span></span>' + menu_y[y].ds_menu + '</a>';

                    if (hasChilds) {
                        markup += '						<ul class="subcategoryMenu">\n';

                        var menu_z = menu_y[y].ls_au_menu;
                        for (var z = 0; z < menu_z.length; z++) {

                            link = '';

                            if ($.epar(menu_z[z].ds_link)) {
                                link = menu_z[z].ds_link;
                            } else if ($.epar(menu_z[z].m_au_page)) {
                                link = menu_z[z].m_au_page.ds_page_link;
                            }

                            markup += '                     <li>';
                            markup += '<a href="javascript:void();" class="menu_z' + (menu_z[z].in_report == 1 ? ' report' : '') + '" data-menu="{\'id_menu\':' + menu_z[z].id_menu + ', \'id_menu_master\':' + menu_z[z].id_menu_master + ', \'id_term_help\':' + menu_z[z].id_term_help + '}"  ' + ($.epar(link) ? 'data-link="' + link.toLowerCase() + '"' : '') + ' ><span></span>' + menu_z[z].ds_menu + '</a>';
                            markup += '</li>';
                        }

                        markup += '				        </ul>\n';
                    }

                    markup += '</li>\n';
                }

                markup += '				</ul>\n';
                markup += '				<div class="boxHelpMenu"></div>\n';
                markup += '		    </div>\n';
            }

        }

        markup += '	</ul>\n';
        markup += '	<div class="cb"></div>\n';
        markup += '</nav>\n';
        markup += '<div class="statusPDV"><button type="button">desabilitado</button></div>\n';
        markup += '<div class="cb"></div>\n';

        menuContainer.empty();
        menuContainer.html(markup);

        $('nav.menu .lstMenu div a').unbind('hover').bind('hover', function () {

            var that = $(this);
            var help = that.parents('li').last().find('div.boxHelpMenu').html('<h5>Ajuda</h5>\n<p>' + _instance.translator(eval('(' + that.attr('data-menu') + ')').id_term_help) + '</p>');
        });

        $('nav.menu .lstMenu > li > a').unbind('hover').bind('hover', function () {

            var that = $(this);
            var help = that.parents('li').last().find('div.boxHelpMenu').html('<h5></h5>\n<p>' + _instance.translator(eval('(' + that.attr('data-menu') + ')').id_term_help) + '</p>');
        });

        $('nav.menu .lstMenu a').unbind('mouseout').bind('mouseout', function () {
            var that = $(this);
            var help = that.parents('li').last().find('div.boxHelpMenu').empty();
        });

        $('nav.menu .lstMenu a[data-link]').unbind('click').bind('click', function (event) {
            event.preventDefault();

            var that = $(this);
            if (that.hasClass('report')) {

                var params = {}; params.renderType = 3;
                Mktup.Navigate(that.attr('data-link'), params);

            } else {
                Mktup.Navigate(that.attr('data-link').replace('home.html', 'home'));
            }


        });

        _instance.setActiveMenu();
        _instance.renderPDVButton($('div.statusPDV button'));

    },

    this.buildDashboard = function (dashboard_type, keep) {
        var dashboard = $('header.MainHeader div.headerDashboard');

        if (dashboard.length > 0) {
            if (keep && dashboard_type == 1) return;
            dashboard.empty();
        } else {
            $('header.MainHeader').append('<div class="headerDashboard dashboard close"></div>');
            dashboard = $('header.MainHeader div.headerDashboard');
        }
        var dashboardType = '';
        switch (_instance.activePage.pageEntity.toLowerCase()) {
            case "coupon_item":
            case "coupon_payment":
            case "current_account_client":
            case "custom_item_combo":
            case "custom_item_group":
            case "default_value":
            case "document_person":
            case "education":
            case "item_image":
            case "item_subgroup":
            case "item_unit":
            case "itens_custom_item_group":
            case "operation_type_pdv":
            case "payment_condition":
            case "pdv_operation_detail":
            case "printer_attribute":
            case "sale_order_products_query":
            case "selling_commission_closing":
            case "sale_budget":
            case "sale_order":
            case "client":
            case "seller_commission":
            case "pdv_operation":
            case "coupon":
            case "employee":
            case "seller_commission_closing":
                dashboardType = 'sale';
                break;
            case "purchase_order_product":
            case "purchase_order_products_query":
            case "scope_query":
            case "stock_location_query":
            case "stock_movement":
            case "stock_movement_item":
            case "stock_movement_type":
            case "stock_source":
            case "supplier_type":
            case "purchase_budget":
            case "purchase_order":
            case "supplier":
            case "item":
            case "item_group":
            case "stock_room_query":
            case "stock_room":
            case "purchase_order_query":
            case "sale_order_query":
            case "stock_location":
            case "scope":
                dashboardType = 'purchase';
                break;
            case "stock_room_query":
            case "stock_room":
            case "purchase_order_query":
            case "sale_order_query":
            case "stock_location":
                dashboardType = 'stock';
                break;
            case "fin_entry_event":
            case "fin_event":
            case "fin_trransfer":
            case "general_value":
            case "history":
            case "home":
            case "invoice_item":
            case "invoice_tax":
            case "other_invoice_item":
            case "person_bank":
            case "tax_cfop":
            case "user":
            case "fin_cash_flow":
            case "fin_receivable":
            case "fin_payable":
            case "fin_entry":
            case "fin_operation":
            case "fin_account":
            case "fin_account_management":
            case "fin_account_management":
            case "payment_type":
            case "invoice":
            case "invoice_nfe_control":
            case "other_invoice":
            case "tax_calc":
            case "transaction_nature":
            case "fin_expenditure":
            case "fin_revenue":
                dashboardType = 'fin';
                break;
        }
        var markup = '';
        if (dashboardType == 'sale') {

            markup += '<div class="dashboardSales dashboardContent">\n';
            markup += '<div class="boxInfo">';
            markup += '	<ul>\n';
            markup += '		<li class="boxInfoOne">\n';

            SmartBarBlock('sale', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];
                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var vl_day = FormatMoeda("formatar", data.vl_day).split(',');
                    var month = Mktup.monthNames[(current_date.split('/')[1] * 1) - 1];

                    var html_vl_billing_current_date = '<span>' + Mktup.translator(10036) + '</span><span>(' + current_date + ')<span>';
                    var html_vl_billing = Mktup.translator(10537) + '&nbsp;' + vl_day[0] + ',' + vl_day[1];
                    var html_vl_billing_month = '<span class="tit">' + month + '</span><span class="val">' + Mktup.translator(10537) + '&nbsp;' + vl_month[0] + ',' + vl_month[1] + '</span>'

                    markup += '			<h6 class="titleBoxInfo">' + html_vl_billing_current_date + '</h6>\n';
                    markup += '			<p>' + html_vl_billing + '</p>\n';
                    markup += '			<strong>' + html_vl_billing_month + '</strong>\n';

                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoTwo">\n';
            markup += '			<h6 class="titleBoxInfo">' + Mktup.translator(10589) + '</h6>\n';
            markup += '			<div class="horizontalGraphBoxInfo" id="menu-sale-chart"></div>\n';
            markup += '		</li>\n';
            markup += '		<li class="boxInfoThree">\n';

            SmartBarBlock('sale', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var nu_month = FormatMoeda("formatar", parseFloat(data.nu_month)).split(',');
                    var nu_day = FormatMoeda("formatar", parseFloat(data.nu_day)).split(',');
                    var month = Mktup.monthNames[(current_date.split('/')[1] * 1) - 1];

                    var html_vl_sale_date = '<span>' + Mktup.translator(70205) + '</span><span> (' + current_date + ')</span>';
                    var html_vl_sale_day = nu_day[0];
                    var html_vl_sale_month = '<span class="tit">' + month + '</span> <span class="val">' + nu_month[0] + '</span>';

                    markup += '			<h6 class="titleBoxInfo">' + html_vl_sale_date + '</h6>\n';
                    markup += '			<p>' + html_vl_sale_day + '</p>\n';
                    markup += '			<strong>' + html_vl_sale_month + '</strong>\n';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoFour">\n';


            SmartBarBlock('sale', 3, function (data) {
                if ($.epar(data)) {
                    markup += '<h6 class="titleBoxInfoSale">' + Mktup.translator(10037) + '&nbsp;' + Mktup.translator(10580) + '</h6>\n';
                    markup += '<table cellpadding="0" cellspacing="0" border="0">\n';
                    markup += '<thead>';
                    markup += '  <tr>';
                    markup += '   <th width="120"><span>' + Mktup.translator(71593) + '</span></th><th width="50"><span title="' + Mktup.translator(10581) + '">' + Mktup.translator(10582) + '</span></th><th><span>' + Mktup.translator(71133) + '</span></th>';
                    markup += '  </tr>';
                    markup += '</thead>';

                    markup += '<tbody>';
                    var rows = eval(data.d);
                    for (r in rows) {
                        markup += '   <tr><td><span title=' + rows[r].ds_product + '>' + rows[r].ds_product + '</span></td><td title="' + Mktup.translator(10581) + '">' + FormatMoeda("formatar", rows[r].nu_qtd).split(',')[0] + '</td><td title="' + Mktup.translator(10583) + '">' + FormatMoeda("formatar", rows[r].vl_total) + '</td></tr>';
                    }
                    markup += '</tbody>';
                    markup += '			</table>\n';
                }
            });

            markup += '		</li>\n';
            markup += '	    </ul>\n';
            markup += ' </div>\n';
            markup += '</div>\n';
            markup += '<div class="dashboardReading">\n';
            markup += '	<button class="dashboardReadingButton" type="button"></button>\n';
            markup += '	<p>dashboard</p>\n';
            markup += '</div>\n';
            markup += '<div class="cb"></div>\n';
        }
        else if (dashboardType == 'purchase') {

            markup += '<div class="dashboardShopping  dashboardContent">\n';
            markup += '<div class="boxInfo">';
            markup += '	<ul>\n';
            markup += '		<li class="boxInfoOne">\n';

            // coluna 1
            SmartBarBlock('purchase', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var month = Mktup.monthNames[(current_date.split('/')[1] * 1) - 1];

                    var html_vl_buy_block_month = '<span class="tit">' + Mktup.translator(10535) + '</span><span>' + month + '</span>';
                    var html_vl_buy_block_total = '<span class="val">' + Mktup.translator(10537) + '&nbsp;' + vl_month[0] + ',' + vl_month[1] + '</span>';

                    markup += '			<h6 class="titleBoxInfo">' + html_vl_buy_block_month + '</h6>\n';
                    markup += '			<p>' + html_vl_buy_block_total + '</p>\n';
                    markup += '<strong></strong>';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoTwo">\n';

            // Coluna 2 
            SmartBarBlock('purchase', 3, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];
                    var current_date = $.getToday();
                    var vl_total = FormatMoeda("formatar", parseFloat(data.vl_total)).split(',');
                    var nu_orders = FormatMoeda("formatar", parseFloat(data.nu_orders)).split(',')[0];
                    var resultPurchase3 = '<span class="tit">Totalizando</span> <span class="val" >' + Mktup.translator(10537) + '&nbsp;' + vl_total[0] + ',' + vl_total[1] + '</span>';

                    markup += '			<h6 class="titleBoxInfo">' + Mktup.translator(10542) + '</h6>\n';
                    markup += '			<p>' + nu_orders + '&nbsp;' + Mktup.translator(10040) + '</p>\n';
                    markup += '			<strong>' + resultPurchase3 + '</strong>\n';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoThree">\n';
            markup += '			<h6 class="titleBoxInfo"></h6>\n';
            markup += '			<p></p>\n';
            // Coluna 1
            SmartBarBlock('purchase', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];
                    var vl_down_stock = FormatMoeda("formatar", data.vl_down_stock);
                    var html_vl_down_stock = '<span class="first"><span class="tit">' + vl_down_stock[0] + '</span><span class="val">Produto(s)</span></span>';
                    markup += '			<strong>' + html_vl_down_stock + Mktup.translator(10541) + '</strong>\n';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoFour">\n';

            // Coluna 4
            SmartBarBlock('purchase', 4, function (data) {
                if ($.epar(data)) {
                    markup += '<h6 class="titleBoxInfoPurchase">' + Mktup.translator(10547) + '</h6>\n';
                    markup += '<table>';
                    markup += ' <thead>';
                    markup += '  <tr>';
                    markup += '   <th width="120"><span>' + Mktup.translator(71593) + '</span></th><th width="50"><span>' + Mktup.translator(71022) + '</span></th><th><span>' + Mktup.translator(10550) + '</span></th>';
                    markup += '  </tr>';
                    markup += '  <tr>';
                    markup += '   <td> </td><td> </td><td> </td>';
                    markup += '  </tr>';
                    markup += ' </thead>';

                    markup += ' <tbody>';
                    var rows = eval(data.d);
                    for (r in rows) {
                        markup += '   <tr><td><span title="' + rows[r].ds_item + '">' + rows[r].ds_item + '</span></td><td title="' + Mktup.translator(10548) + '">' + FormatMoeda("formatar", rows[r].nu_days_end).split(',')[0] + '</td><td title="' + Mktup.translator(10549) + '">' + FormatMoeda("formatar", rows[r].vl_avaiable).split(',')[0] + '</td></tr>';
                    }
                    markup += ' </tbody>';

                    markup += '</table>';
                }
            });

            markup += '		</li>\n';
            markup += '	 </ul>\n';
            markup += ' </div>\n';
            markup += '</div>\n';
            markup += '<div class="dashboardReading">\n';
            markup += '	<button class="dashboardReadingButton" type="button"></button>\n';
            markup += '	<p>dashboard</p>\n';
            markup += '</div>\n';
            markup += '<div class="cb"></div>\n';

        }
        else if (dashboardType == 'fin') {
            //dashboardBilling 
            markup += '<div class="dashboardBilling  dashboardContent">\n';
            markup += '<div class="boxInfo">';
            markup += '	<ul>\n';
            markup += '		<li class="boxInfoOne">\n';

            // Coluna 1
            SmartBarBlock('fin', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var vl_day = FormatMoeda("formatar", data.vl_day).split(',');
                    var month = Mktup.monthNames[(current_date.split('/')[1] * 1) - 1];
                    var html_vl_day = Mktup.translator(10537) + ' ' + vl_day[0] + ',' + vl_day[1] + '';
                    var html_vl_month = '<span class="tit">' + month + '</span><span class="val">' + Mktup.translator(10537) + ' ' + vl_month[0] + ',' + vl_month[1] + '</span>';
                    var bill1Title = '<span>' + Mktup.translator(10585) + '</span><span>(' + current_date + ')</span>';

                    markup += '			<h6 class="titleBoxInfo">' + bill1Title + '</h6>\n';
                    markup += '			<p>' + html_vl_day + '</p>\n';
                    markup += '			<strong>' + html_vl_month + '</strong>\n';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoTwo">\n';
            markup += '			<h6 class="titleBoxInfo">' + Mktup.translator(10694) + '</h6>\n';
            markup += '         <div class="horizontalGraphBoxInfo" id="menu-fin-chart"></div>\n';
            markup += '		</li>\n';
            markup += '		<li class="boxInfoThree">\n';

            // Coluna 3
            SmartBarBlock('fin', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];
                    var vl_total = FormatMoeda("formatar", data.vl_total).split(',');
                    var vl_control = FormatMoeda("formatar", data.vl_control).split(',');
                    var vl_bank = FormatMoeda("formatar", data.vl_bank).split(',');

                    var html_vl_total = '<span>' + Mktup.translator(10537) + ' ' + vl_total[0] + ',' + vl_total[1] + '</span>';
                    var html_vl_cash = '<span class="tit">' + Mktup.translator(10556) + '</span><span class="val">' + Mktup.translator(10537) + ' ' + vl_control[0] + ',' + vl_control[1] + '</span>';
                    var html_vl_bank = '<span class="tit">' + Mktup.translator(10557) + ' </span><span class="val">' + Mktup.translator(10537) + ' ' + vl_bank[0] + ',' + vl_bank[1] + '</span>';

                    markup += '<h6 class="titleBoxInfo">' + Mktup.translator(10559) + '</h6>\n';
                    markup += '<p>' + html_vl_total + '</p>\n';
                    markup += '<strong>' + html_vl_bank + '' + html_vl_cash + '</strong>\n';
                }
            });

            markup += '		</li>\n';
            markup += '		<li class="boxInfoFour">\n';

            SmartBarBlock('fin', 4, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var vl_pay_day = FormatMoeda("formatar", data.vl_pay_day);
                    var vl_pay_month = FormatMoeda("formatar", data.vl_pay_month);

                    var vl_rec_day = FormatMoeda("formatar", data.vl_rec_day);
                    var vl_rec_month = FormatMoeda("formatar", data.vl_rec_month);
                    var resultFin4 = '';
                    resultFin4 += '<ul>'
                    resultFin4 += ' <li class="titleBoxInfo"><span></span><span class="pags" title="' + Mktup.translator(10562) + '">' + Mktup.translator(10563) + '</span> <span class="recs" title="' + Mktup.translator(10564) + '">' + Mktup.translator(10565) + '</span></li>';
                    resultFin4 += ' <li class="titleBoxInfo"><span title="' + Mktup.translator(10566) + '">' + Mktup.translator(10567) + '</span> <span title="' + Mktup.translator(10568) + '">' + vl_pay_day + '</span> <span title="' + Mktup.translator(10569) + '">' + vl_rec_day + '</span></li>';
                    resultFin4 += ' <li class="titleBoxInfo"><span title="' + Mktup.translator(10570) + '">' + Mktup.translator(10571) + '</span> <span title="' + Mktup.translator(10572) + '">' + vl_pay_month + '</span> <span title="' + Mktup.translator(10573) + '">' + vl_rec_month + '</span></li>';
                    resultFin4 += '</ul>';
                    resultFin4 += ' <div class="titleBoxInfo payablesToday"><span>Contas a pagar HOJE:</span><span title="' + Mktup.translator(10568) + '">' + vl_pay_day + '</span> </div>';

                    markup += resultFin4;
                }
            });

            markup += '		</li>\n';
            markup += '	    </ul>\n';
            markup += ' </div>\n';
            markup += '</div>\n';
            markup += '<div class="dashboardReading">\n';
            markup += '	<button class="dashboardReadingButton" type="button"></button>\n';
            markup += '	<p>dashboard</p>\n';
            markup += '</div>\n';
            markup += '<div class="cb"></div>\n';
        }

        dashboard.html(markup);
        markup = '';



        if (dashboardType == 'sale') {
            SmartBarBlock('sale', 4, function (data) {
                if ($.epar(data)) {
                    var months = [];
                    var values = [];
                    var rows = eval(data.d);
                    for (r in rows) {
                        months.push(Mktup.monthNamesShort[rows[r].month - 1]);
                        values.push(parseFloat(rows[r].vl_month));
                    }
                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'menu-sale-chart', width: 240, height: 110, type: 'column', backgroundColor: '#bcc7cb', colors: '#fdff00' },
                        credits: { text: null, href: null },
                        title: { text: null },
                        legend: { enabled: false },
                        xAxis: {
                            categories: months,
                            labels: {
                                style: { color: '#fff', font: 'bold 9px Arial, Verdana, sans-serif', textTransform: 'uppercase' }
                            }
                        },
                        yAxis: {
                            min: 0,
                            lineColor: '#595b5a',
                            lineWidth: 0,
                            title: { text: null },
                            labels: {
                                style: { color: '#fff', font: 'bold 9px Arial, Verdana, sans-serif', textTransform: 'uppercase' }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            backgroundColor: '#FFFFFF',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: 70,
                            floating: true,
                            shadow: false,
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                return '' + this.x + ': R$ ' + FormatMoeda("formatar", this.y);
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Vendas',
                            data: values,
                            color: '#62961e'
                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }
            });
        } else if (dashboardType == 'fin') {

            // Coluna 2
            SmartBarBlock('fin', 3, function (data) {

                if ($.epar(data)) {
                    var months = [];
                    var values = [];
                    var rows = eval(data.d);
                    var minValue = 0;

                    for (r in rows) {
                        months.push(Mktup.monthNamesShort[rows[r].month - 1]);
                        values.push(parseFloat(rows[r].vl_month));
                        if (rows[r].vl_month < minValue) minValue = rows[r].vl_month;
                    }
                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'menu-fin-chart', width: 240, height: 110, type: 'line', backgroundColor: '#bcc7cb' },
                        credits: { text: null, href: null },
                        title: { text: null },
                        legend: { enabled: false },
                        xAxis: {
                            categories: months,
                            labels: {
                                style: {
                                    color: '#fff',
                                    font: 'bold 9px Arial, Verdana, sans-serif',
                                    textTransform: 'uppercase'
                                }
                            }
                        },
                        colors: ['#fdff00'],
                        yAxis: {
                            min: minValue,
                            lineColor: '#595b5a',
                            lineWidth: 0,
                            title: { text: null },
                            labels: {
                                style: {
                                    color: '#fff',
                                    font: 'bold 9px Arial, Verdana, sans-serif',
                                    textTransform: 'uppercase'
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            backgroundColor: '#FFFFFF',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: 70,
                            floating: true,
                            shadow: false,
                            enabled: false
                        },
                        tooltip: {
                            formatter: function () {
                                return '' + this.x + ': R$ ' + moeda.formatar(this.y) + '';
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Cash',
                            data: values,
                            color: '#62961e'

                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }
            });

        }



        var dash_params = {};

        if (!$.epar(sessionStorage["mktup_dashboard_status"]) || $.epar(sessionStorage["mktup_dashboard_status"]) == 'open') {
            dash_params.userState = 'open';
            dash_params.dashState = 'open';
        } else {
            dash_params.userState = 'close';
            dash_params.dashState = 'close';
        }

        $(".headerDashboard").dashboard(dash_params);
    },

    this.getMainContentContainer = function () {

        var container = $('article.MainContent');

        if (container.length > 0) {
            container.empty();
        } else {
            $('section.MainSection').append('<article class="MainContent"></article>'); container = $('article.MainContent');
        }
        container.empty();
        return container;
    },

    this.buildSheet = function (sheet_params) {

        if (typeof (sheet_params) != "object") sheet_params = eval('(' + sheet_params + ')');

        var params = sheet_params;
        params.isSheet = true;
        params.pageId = Number(new Date());
        params._instance = _instance;

        var Sheet = new MktUP_Page(params);
        _instance.activePage.pageSheets.push(Sheet);
        Sheet.Render();
    },

    this.init_AppletNfe = function (full) {

        var defMktup_init_AppletNfe = new $.Deferred();
        var nu_times = 0;
        if ($('#NFe_Applet').length == 0) $('body').prepend('<applet id="NFe_Applet" archive="nfeApplet.jar" codebase="http://files.marketup.com/applets/" code="marketup.com.nfe.applet.NFe_Applet.class" width="0" height="0" style="position: absolute;"><param name="cache_archive" value="nfeApplet.jar"><param name="cache_version" value="1.2.0"><param name="codebase_lookup" value="false"></applet>');


        if ($.epar(full)) {
            var checkNfeApplet = setInterval(function () {
                nu_times++;
                if ($('#NFe_Applet').length == 0) {
                    if (nu_times > 9) {
                        clearInterval(checkNfeApplet);
                        defMktup_init_AppletNfe.resolve(false);
                    }
                } else {

                    var nfa = document.applets["NFe_Applet"];
                    if (nfa.Verify_Class) {
                        clearInterval(checkNfeApplet);

                        if (nfa.Verify_Class("org.apache.commons.codec.binary.Base64") && nfa.Verify_Class("org.apache.commons.httpclient.protocol.ProtocolSocketFactory")) {
                            defMktup_init_AppletNfe.resolve(true);
                        } else {
                            defMktup_init_AppletNfe.resolve(false);
                        }
                    } else if (nu_times > 9) {
                        clearInterval(checkNfeApplet);
                        defMktup_init_AppletNfe.resolve(false);
                    }
                }
            }, 1000);
        } else {
            defMktup_init_AppletNfe.resolve(true);
        }

        return defMktup_init_AppletNfe.promise();
    },

    this.checkFormChanges = function () {

        return false;

        var panelRender = _instance.getCurrentPanelRender();
        var arrFields = panelRender.find('input[id], textarea[id]').not('.bypass');

        for (var f = 0; f < arrFields.length; f++) {

            oField = $('#' + arrFields[f].id);
            if (oField.size() > 1) oField = $('#' + arrFields[f].id + '[checked]');

            if ($.epar(oField[0]) && oField[0].tagName == "SPAN") {
                fieldValue = oField.html();
            } else if (oField.hasClass('textsearch') || oField.hasClass('mktup_autocomplete')) {
                fieldValue = oField.attr('data-id_value');
            } else if (oField.hasClass('customradioToggle') || oField.hasClass('customradio')) {
                fieldValue = (oField.find('input[checked]').val() ? 1 : 0);
            } else if (oField.hasClass('inputCheckbox')) {
                fieldValue = (oField.is(":checked") ? 1 : 0);
            } else if (arrFields[f].id.split('§')[1].substr(0, 3) == 'vl_') {
                fieldValue = moeda.desformatar(oField.val());
            } else if (oField.hasClass('ckeditor')) {
                fieldValue = CKEDITOR.instances[arrFields[f].id].getData();
            } else {
                fieldValue = oField.val();
            }

            if ($.epar(oField.attr('data-original_value')) != $.epar(fieldValue)) {
                return true;
            }
        }

        return false;
    },

    // UPLOAD Dialog
    this.crop = function (l, a, callback, folder, image_name) {
        var params = {
            x: null,
            y: null,
            w: null,
            h: null,
            s: null
        }

        // Markup do Modal
        var markup = '' +
            '<div id="mktup_dialog_upload">' +
            '   <div class="upload_img">' +
            '       <div class="cont">' +
            '           <div id="mktup_dialog_upload_file">Selecione a imagem para Upload</div>' +
            '           <p>' +
            '               <span>FORMATOS SUPORTADOS: JPG, GIF, PNG</span>' +
            '               <span>PESO MÁXIMO: 10MB</span>' +
            '           </p>' +
            '       </div>' +
            '   </div>' +
            '   <div class="crop_img">' +
            '       <p>Arraste os cantos da caixa transparente sobre a imagem para recortá-la</p>' +
            '       <img style="display: none; max-height: 360px; max-width: 940px;" src="" alt="img" id="mktup_dialog_upload_img" />' +
            '   </div>' +
            '</div>' +
            '';

        $(markup).appendTo('body');

        // Inicia upLoader
        var par = {};
        par.crop = true;
        if ($.epar(folder)) par.folder = folder;
        if ($.epar(image_name)) par.image_name = image_name;
        var mktup_dialog_upload_file = new qq.FileUploader({
            element: document.getElementById('mktup_dialog_upload_file'),
            action: AppPath + '/Tools_Upload.aspx',
            debug: true,
            multiple: false,
            params: par,
            template: '<div class="boxDrag qq-upload-drop-area" >Arraste e solte seu logo para enviar</div><div class="qq-upload-button import"></div><ul class="qq-upload-list"></ul>',
            onComplete: function (id, fileName, responseJSON) {

                //console.log(id, fileName, responseJSON, responseJSON.success);
                if (responseJSON.success) {

                    $("#mktup_dialog_upload .upload_img").hide();

                    var img = $('#mktup_dialog_upload_img');

                    img.attr("src", responseJSON.filename + '?' + String(Number(new Date))).Jcrop({
                        //img.attr("src", 'img/imgInicioOperacoes.jpg').Jcrop({
                        onSelect: showCoords,
                        onChange: showCoords,
                        bgColor: 'black',
                        bgOpacity: .4,
                        aspectRatio: l / a,
                        setSelect: [0, 0, l, a]
                    });

                    img.show();

                    $(".crop_img").show();
                } else {
                    Mktup.alertModal('Problemas ao realizar o Upload. Tente novamente.');
                }
            }
        });



        // Inicia dialog
        $("#mktup_dialog_upload").dialog({
            modal: true,
            title: "Upload de Imagem",
            width: 960,
            height: 550,
            zIndex: 4000,
            autoOpen: true,
            close: function (event, ui) {
                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
                callback();
                $("#mktup_dialog_upload").dialog("destroy").empty().remove();
            },
            open: function (event, ui) {
                if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
            },
            buttons: [
        		{
        		    text: "salvar",
        		    click: function () {
        		        params.filepath = $('#mktup_dialog_upload_img').attr('src').split('?')[0];
        		        $(this).dialog("close");
        		        callback(params);
        		        $("#mktup_dialog_upload").dialog("destroy").empty().remove();
        		    }
        		}
			]
        });



        function showCoords(c) {
            params.x = c.x;
            params.y = c.y;
            params.w = c.w;
            params.h = c.h;
            params.s = ((c.x > 0) ? 100 / c.x : 1);
        };
    };


    //Get current instance
    var _instance = this;

    //Check instance
    var checkInstance = function () {

        //Read existing instances
        var arrCurrentInstances = sessionStorage["mktup_curr_instances"];
        arrCurrentInstances = eval(arrCurrentInstances);

        if (!$.epar(window.name) || !$.epar(arrCurrentInstances) || arrCurrentInstances.lenght == 0) {
            //New window

            //Identify the window
            _instance.instanceId = Number(new Date());
            window.name = 'mktup_' + _instance.instanceId;

            if ((!$.epar(arrCurrentInstances)) || (!$.isArray(arrCurrentInstances))) {
                //Doesnot exist instances, empty Array
                arrCurrentInstances = [];
            }

            if (arrCurrentInstances.length > 0) {
                //If has instances copy the last one
                _instance.activePage = arrCurrentInstances[(arrCurrentInstances.length - 1)].activePage;
                _instance.activePage.pageSheets = [];
            } else {
                //Else create new instance
                var params = {}; params.pageEntity = 'login';
                params._instance = _instance;
                _instance.activePage = new MktUP_Page(params);
            }

            arrCurrentInstances.push(_instance);

            //Save Instances
            sessionStorage["mktup_curr_instances"] = JSON.stringify(arrCurrentInstances);

        } else {
            //Existing Window
            //Identfy wich is the window instance           
            var CurrentInstance = arrCurrentInstances.filter(function (el) { return el.instanceId = Number(window.name.replace('mktup_', '')) });
            _instance.instanceId = CurrentInstance[0].instanceId;
            CurrentInstance[0].activePage._instance = _instance;
            _instance.activePage = new MktUP_Page(CurrentInstance[0].activePage);
            _instance.activePage.pageSheets = [];
            _instance.termsCollection = CurrentInstance[0].termsCollection;

        }

    }

    var getStartPage = function () {
        var goToWizard = localStorage.getItem("go_to_wizard");
        var id_profile = JSON.parse(JSON.parse(sessionStorage['active_user']).user).d.m_au_user.id_profile;
        if ((id_profile != 1) || ($.epar(goToWizard) == 'no')) {
            return 'dashboard'
        } else {
            localStorage.setItem("go_to_wizard", "yes");
            return 'wizard'
        }
    };

    var Init = function () {
        _instance.keyAuth = ((((ClientId % 2 == 0) ? String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * String(ClientId)[0] * 1))).toFixed(10)).concat('MOD') : String(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * (String(ClientId)[0] * 1 + 1)))).split('.')[1]) == undefined) ? 'Un' + ClientId + 'd&f' + ClientId + '1n3D' : (ClientId % 2 == 0) ? String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * String(ClientId)[0] * 1))).toFixed(10)).concat('MOD') : String(Number(Math.sqrt(ClientId) + (ClientId / Math.sqrt(ClientId * (String(ClientId)[0] * 1 + 1)))).toFixed(10)).split('.')[1]);
        checkInstance();
        _instance.checkLogin().done(function () {
            _instance.loadDateInfo();
            _instance.activePage.Render();
        });
    }

    Init();
};

MktUP_Page = function (params) {

    var _instance = params._instance;
    this.listPageSize = 20,
    this.pageEntity = ($.epar(params.pageEntity) ? params.pageEntity : 'login'),

    this.isSheet = ($.epar(params.isSheet) ? params.isSheet : false),

    // 1 - List | 2 - Form | 3 - Report
    this.renderType = ($.epar(params.renderType) ? params.renderType : 1),
    this.showActionBar = ($.epar(params.showActionBar) ? (params.showActionBar != 'hide') : true),

    this.pageId = ($.epar(params.pageId) ? params.pageId : Number(new Date())),
    this.pagePageId = ($.epar(params.pagePageId) ? params.pagePageId : 0),
    this.pageCurrentValue = ($.epar(params.pageCurrentValue) ? params.pageCurrentValue : 0),

    this.pageParentId = ($.epar(params.pageParentId) ? params.pageParentId : null),
    this.pageParentIdValue = ($.epar(params.pageParentIdValue) ? params.pageParentIdValue : null),
    this.pageParentGridId = ($.epar(params.pageParentGridId) ? params.pageParentGridId : null),
    this.pageParentFillerFields = ($.epar(params.pageParentFillerFields) ? params.pageParentFillerFields : ''),
    this.pageParentEntity = ($.epar(params.pageParentEntity) ? params.pageParentEntity : null),


    this.pageFieldFilter = ($.epar(params.pageFieldFilter) ? params.pageFieldFilter : null),
    this.pageCloseCallback = ($.epar(params.pageCloseCallback) ? params.pageCloseCallback : null),

    this.pageFBP = ($.epar(params.pageFBP) ? params.pageFBP : {}),

    this.pageListData = ($.epar(params.pageListData) ? params.pageListData : []),
    this.pageFormData = ($.epar(params.pageFormData) ? params.pageFormData : null),
    this.pageTempData = ($.epar(params.pageTempData) ? params.pageTempData : null),

    this.pageListTotalRecords = ($.epar(params.pageListTotalRecords) ? params.pageListTotalRecords : null),

    this.pageFormItensData = ($.epar(params.pageFormItensData) ? params.pageFormItensData : []),
    this.pageSteps = ($.epar(params.pageSteps) ? params.pageSteps : []),
    this.pageCurrentStep = ($.epar(params.pageCurrentStep) ? params.pageCurrentStep : 0),

    this.pageSheets = ($.epar(params.pageSheets) ? params.pageSheets : []),

    this.pageDataEntity = ($.epar(params.pageDataEntity) ? params.pageDataEntity : ''),
    this.pageDataFilter = ($.epar(params.pageDataFilter) ? params.pageDataFilter : ''),
    this.pageDataPaging = ($.epar(params.pageDataPaging) ? params.pageDataPaging : ''),
    this.pageDataSort = ($.epar(params.pageDataSort) ? params.pageDataSort : ''),
    this.pageDataPagePosition = ($.epar(params.pageDataPagePosition) ? params.pageDataPagePosition : ''),

    this.pagePermissions = ($.epar(params.pagePermissions) ? params.pagePermissions : {}),

    this.getCurrentRender = function () {
        return (_page.isSheet ? $('#sheet_container_' + _page.pageId) : $('section.MainSection'));
    }

    this.Render = function () {

        $('html').removeClass('pdv').css('overflow-x', 'none').css('overflow-y', 'scroll');

        switch (_page.pageEntity) {
            case 'dashboard':
            case 'home':
                _page.showActionBar = false;
                initHome();
                break;
            case 'login':
                initLogin();
                break;
            case 'pdv':
                initPDV();
                break;
            case 'wizard':
                initWizard();
                break;
            case 'item':
            case 'sale_budget':
            case 'sale_order':
            case 'purchase_budget':
            case 'purchase_order':
                Init(_page.pageEntity);
                break;
            case 'fin_cash_flow':
                _page.showActionBar = false;
                Init(null, _page.pageEntity, true);
                break;
            case 'fin_entry':
                _page.showActionBar = false;
                Init(null, _page.pageEntity);
                break;
            default:
                Init();
                break;
        }

        _instance.saveInstance();
    },

    this.deleteRecord = function (button, id, name, entity) {

        var defMktup_deleteRecord = new $.Deferred();

        button.loader();
        Mktup.Confirm('Você esta prestes a excluir o registro (' + id + ') ' + name + '.', 'Deseja continuar?', function (delete_return) {
            if (delete_return) {

                SyncGetDataOn({ d: { ids: [id]} }, entity, 'DeleteData', true).done(function (delete_result) {
                    button.loader('end');
                    defMktup_deleteRecord.resolve(delete_result);
                });

            } else {
                button.loader('end');
                defMktup_deleteRecord.resolve(false);
            }
        });

        return defMktup_deleteRecord.promise();
    },

    this.advancedSearch = function () {
        $('div.advancedSearchBox ul li:not(:last)').detach();
        var container_filter = $('div.advancedSearchBox');

        $("html").click(function (e) {
            if (!($(e.target).hasClass("advancedSearch") || $(e.target).parents(".advancedSearchBox").size() > 0 || $(e.target).parents(".ui-autocomplete").size() > 0 || $(e.target).parents(".ui-datepicker").size() > 0 || $(e.target).parents(".ui-datepicker-header").size() > 0)) container_filter.hide();
        });

        if (container_filter.is(":visible")) {
            container_filter.hide();
        }
        else {

            var fields_filter = [];
            var master_field = '';
            for (var ix = 0; ix < _page.pageFBP.Attribute_Groups.length; ix++) {
                fields_filter.push.apply(fields_filter, _page.pageFBP.Attribute_Groups[ix].Attribute_Group_data.filter(function (el) { return el.in_master_search == 1 || el.in_search > 0 }));
                if (ix == _page.pageFBP.Attribute_Groups.length - 1) {
                    if (fields_filter.length == 0 || (fields_filter.length == 1 && fields_filter[0].in_master_search == 1)) {
                        Mktup.alertModal('Nenhum filtro avançado nesta tela.');
                        return;
                    }
                    container_filter.show();
                    fields_filter.sort(function (a, b) { return a.nu_list_order - b.nu_list_order });
                    for (var ix1 = fields_filter.length - 1; ix1 >= 0; ix1--) {

                        if ($.epar(fields_filter[ix1].in_master_search) && fields_filter[ix1].in_master_search == 1) {
                            master_field = fields_filter[ix1];
                        }
                        else {
                            var field = buildField(_page, fields_filter[ix1], true);
                            container_filter.find('ul').prepend('<li>' + field + '</li>');
                        }
                        if (ix1 == 0) {
                            buildFormDatepickers(container_filter);
                            buildFormAutoCompletes(container_filter);
                            $(container_filter).find('ul li:not(:last) input.customselect').removeClass('add');
                            buildFormCustomSelect($(container_filter).find('ul li:not(:last) input.customselect'));

                            $('.advancedSearchBox input[id*="search"]').not('.datepicker').unbind('keypress').keypress(function (e) {
                                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                                    $(container_filter).find('ul li:last button').click();
                                    $('.datepicker').datepicker('hide');
                                }
                            });

                            $('.advancedSearchBox input[id*="search"].datepicker').unbind('keydown').keydown(function (e) {
                                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                                    $(container_filter).find('ul li:last button').click();
                                    $('.datepicker').datepicker('hide');
                                }
                            });

                        }
                    }
                }
            }

            $(container_filter).find('ul li:last button').unbind('click').click(function () {
                var objects_search = $('.advancedSearchBox input[id*="search"]');
                var not_element = $('.advancedSearchBox input[class*="inputRadio"]').not(':checked')[0];
                objects_search = $.grep(objects_search, function (el) { return el != not_element });

                getObjectFilterProxy(objects_search).done(function (par_filter) {
                    var paging = {};
                    paging.page = 1;
                    paging.size = _page.listPageSize;
                    paging.parameters = par_filter;

                    var master_value = $('.actionBar .search .fieldSearch').val();
                    if (master_field != '' && master_value.length > 0) {
                        var element_id = '';

                        if ($.epar(master_field.master_search_custom_field) && master_field.master_search_custom_field.length > 0)
                            element_id = master_field.master_search_custom_field;
                        else
                            element_id = master_field.ds_attribute_name;

                        switch (element_id.substring(0, 3)) {
                            case 'id_':
                            case 'in_':
                                paging.parameters[element_id] = master_value;
                                break;
                            case 'ds_':
                                paging.parameters[element_id] = '%' + master_value + '%';
                                break;
                            default:
                                paging.parameters[element_id + '_ini'] = master_value;
                                paging.parameters[element_id + '_fim'] = master_value;
                                break;
                        }
                    }

                    _page.pageDataPaging = paging;
                    _page.pageListTotalRecords = null;
                    _page.renderType = 1; // List;                          
                    _page.Render();
                });
            });

        }
    };

    //Get current instance
    var _page = this;

    var getRenderTypeName = function () {

        switch (_page.renderType * 1) {
            case 1:
                return "list";
            case 2:
                return "form";
            case 3:
                return "report";
        }

    }

    var Init = function (custom_form, custom_list, noDashBoard) {

        //Relatorios
        if (_page.renderType == 3) { initReport(); return; }

        $.loadFBP(_page.pageEntity).done(function (load_fbp_result) {

            if (load_fbp_result) {

                var currentPage = _instance.getTopRender();

                currentPage.pageFBP = load_fbp_result;

                var data_params = {};
                data_params.d = {};

                currentPage.pagePageId = currentPage.pageFBP.id_page * 1;
                getPermissions();

                if (!$.epar(currentPage.pagePermissions)) return;
                if (!$.epar(currentPage.pagePermissions.in_visible) == 1) return;

                //List
                if (currentPage.renderType == 1) {
                    data_params.d.parameters = currentPage.pageDataFilter;
                    data_params.d.paging = currentPage.pageDataPaging;
                    //Form
                } else if (_page.renderType == 2) {
                    data_params.d.parameters = {};
                    data_params.d.parameters['id_' + _page.pageEntity.toLowerCase()] = currentPage.pageCurrentValue * 1;
                }

                if (currentPage.isSheet) { initSheet(custom_form, custom_list) } else { initPage(custom_form, custom_list, noDashBoard) }
            }
        });
        //.fail(function (ret, status, erro) { errorAlert(ret, status, erro, $(this)) });

    };

    var initLogin = function () {
        _instance.clearMainSection();
        $('body').removeAttr('class').addClass('login');
        //LoadTemplate
        $.loadModule($('section.MainSection'), "login");
    };

    var initHome = function () {

        var params = {};
        params.noDashboard = true;
        params.keepHeader = true;
        params.keepMenu = true;
        params.noMenu = false;

        _instance.buildHeader(params);

        buildPageHeader().done(function () {

            $('body').removeAttr('class').addClass('dashboard');
            var container = _instance.getMainContentContainer()
            $.loadModule(container, "dashboard");
        });
    };

    var initWizard = function () {

        var params = {};
        params.noDashboard = true;
        params.keepHeader = true;
        params.keepMenu = true;
        params.noMenu = false;

        _instance.buildHeader(params);

        buildPageHeader().done(function () {
            $('body').removeAttr('class').addClass('wizard');
            var container = _instance.getMainContentContainer()
            $.loadModule(container, "wizard");
        });
    };

    var initPDV = function () {

        $('html').addClass('pdv').css('overflow', 'none');
        $('section.MainSection').removeClass('DashboardClose').loader();

        _page.showActionBar = false;
        $('body').removeAttr('class').addClass('pdv');

        var params = {};
        params.noDashboard = true;
        params.keepHeader = true;
        params.noMenu = true;

        _instance.buildHeader(params);

        buildPageHeader().done(function () {

            $('section.MainSection').loader('end');
            var container = $('section.MainSection article.MainContent');
            $.loadModule(container, "pdv");
        });
    };

    var getValueElement = function (el) {
        if (el.hasClass('mktup_autocomplete')) {
            return el.attr('data-id_value') * 1;
        }

        if (el.hasClass('datepicker')) {
            return ((el.val() == '') ? el.val() : ((el.attr('id').split('§')[1].indexOf('_ini') >= 0) ? $.DateFormatToDbParam(el.val()) + ' 00:00:00' : $.DateFormatToDbParam(el.val()) + ' 23:59:59'));
        }

        if (el.hasClass('inputRadio') || el.hasClass('customselect')) {
            return el.val();
        }

        if (el.hasClass('inputCheckbox')) {
            return ((el.attr('checked') == 'checked') ? 1 : 0);
        }

        if (el.hasClass('inputText')) {
            return ((el.attr('id').split('§')[1].substring(0, 3) == 'ds_' && el.val().trim().length > 0) ? '%' + el.val() + '%' : el.val());
        }

    };

    var getObjectFilterProxy = function (container) {
        var def = $.Deferred();
        var pars = {};

        for (var ind = 0; ind < container.length; ind++) {
            var arr = container[ind].id.split('§');
            var resp = getValueElement($(container[ind]));
            if ($.epar(resp)) {
                if (!(arr[1].substring(0, 3) == "id_" && resp == 0))
                    pars[arr[1]] = resp;
            }
        }
        def.resolve(pars);
        return def.promise();
    };

    var buildPageHeader = function () {

        var defPage_buildPageHeader = new $.Deferred();

        var headerRender = _page.getCurrentRender();
        var markup = '';

        if (!headerRender.hasClass(_page.pageEntity.toLowerCase())) {

            var currentMainContent = headerRender.find('article.MainContent:first');
            //headerRender.find('article.MainContent:first').empty(); //.remove();
            currentMainContent.empty();
            currentMainContent.detach();


            markup += '<article class="MainContent">\n';
            markup += '\t<section class="pageContent">\n';
            markup += '\t\t<header class="pageHeader">\n';

            if (!_page.isSheet) {
                markup += '\t\t\t<div class="pageHGroup">\n';
                markup += '\t\t\t\t<h2></h2>\n';
                markup += '\t\t\t</div>\n';
            }

            if (_page.showActionBar) {
                markup += '\t\t\t<div class="actionBar">\n';
                markup += '\t\t\t\t\t<div class="search form">\n';
                //markup += '\t\t\t\t\t\t<button type="button" class="btSearch" title="Buscar"></button>\n';
                markup += '\t\t\t\t\t\t<input type="text" class="inputText bypass fieldSearch" placeholder="ENCONTRE">\n';
                markup += '\t\t\t\t\t\t<button type="button" class="button ok">ok</button>\n';
                markup += '\t\t\t\t\t\t<button type="button" class="advancedSearch">Filtros Avançados</button>\n';
                markup += '<div class="advancedSearchBox">';
                markup += '<ul>';
                markup += ' <li>';
                markup += '     <button type="button" class="btFiltrar button button1">Filtrar</button>';
                markup += ' </li>';
                markup += '</ul>';
                markup += '</div>';
                markup += '</div>';
                markup += '<div class="buttonPanel">';
                if (_page.renderType == 1 || (_page.pageEntity == 'purchase_budget' || _page.pageEntity == 'purchase_order' || _page.pageEntity == 'sale_budget' || _page.pageEntity == 'sale_order')) markup += '        <button type="button" class="actionButton printActionButton" title="Imprimir"></button>';
                if (_page.renderType == 1) markup += '        <button type="button" class="actionButton exportActionButton" title="Exportar"></button>';
                markup += '        <button type="button" class="actionButton backActionButton"></button>';
                markup += '</div>';




                markup += '\t\t\t\t\t<button type="button" class="addNew">Adicionar Novo</button>\n';
                markup += '\t\t\t\t</div>\n';
            }

            markup += '\t\t</header>\n';
            markup += '\t\t<div class="pageMain"></div>\n';
            markup += '\t</section>\n';
            markup += '</article>\n';

            headerRender.append(markup);
            if (!_page.isSheet) headerRender.find('section.pageContent header div.pageHGroup h2').html(_instance.translator(_page.pageFBP.id_term_page));

            if (_page.showActionBar) {

                headerRender.find('.inputText.fieldSearch').unbind('keydown').bind('keydown', function (e) {

                    if ((e.ctrlKey && e.keyCode == 74) || (e.keyCode && e.keyCode == 13)) {
                        if (e.keyCode == 74) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        headerRender.find('button.ok').click();
                        return false;
                    }

                });
                // Botão Voltar
                headerRender.find('.actionButton.backActionButton').unbind().bind('click', function () {
                    _page.renderType = 1; // List;      
                    _page.pageDataPaging = '';
                    _page.Render();
                    _page.pageListTotalRecords = null;
                });

                //
                if (_page.renderType == 1) {
                   
                        headerRender.find('.actionButton.exportActionButton').unbind().bind('click', function () {

                            var panelRender = Mktup.getCurrentPanelRender();

                            var markup = '';
                            markup += '<div class="contentModal form">\n';
                            markup += '&nbsp;&nbsp;Qual formato exportar?';
                            markup += '</div>\n';

                            var exportButtons = {
                                "Word": function () {
                                    exportFileList(panelRender, ".doc");
                                    $(this).dialog("close");
                                },
                                "Excel": function () {
                                    exportFileList(panelRender, ".xls");
                                    $(this).dialog("close");
                                },
                                "Csv": function () {
                                    exportFileList(panelRender, ".csv");
                                    $(this).dialog("close");
                                },
                                "PDF": function () {
                                    exportFileList(panelRender, ".pdf");
                                    $(this).dialog("close");
                                }
                            }

                            $(markup).dialog({
                                title: 'Exportar',
                                resizable: false,
                                width: 450,
                                modal: true,
                                buttons: exportButtons
                            });

                        });

                    //Botão Imprimir

                    headerRender.find('.actionButton.printActionButton').unbind().bind('click', function () {


                        var panelRender = Mktup.getCurrentPanelRender();
                        var printTitle = panelRender.parent().find('.pageHeader h2').text();
                        var printBody = $('<div></div>').append(panelRender.find('.panelMain').clone())
                        var headers = '';
                        printBody.find('.panelMain').find('div:first-child').find('div label').each(function () {
                            headers += '<th>' + $(this).parent().html() + '</th>'
                        });
                        printBody.find('.panelMain').find('div:first-child').remove();
                        printBody.find('button').remove();
                        printBody.find('tbody tr').find('td').removeAttr('class');
                        printBody.find('tr').find('td').attr('align', 'left');
                        printBody.find('tbody tr').find('td:first-child').remove();
                        printBody.find('tbody tr').find('td:last-child').remove();
                        printBody.find('table').prepend('<thead><tr>' + headers + '</tr></thead>');
                        printBody.find('table').attr('border', '1')
                        printBody.find('table').attr('bordercolor', '#7b8a90')
                        printBody.find('thead tr').find('th:last-child').remove();
                        printBody.find('tr').find('th').attr('align', 'left');

                        //Mktup.showPrint(printBody.html(), Mktup.getCurrentPanelRender().parent().find('.pageHeader h2').text());

                        var title = $.epar(printTitle) ? printTitle : '';
                        var print_id = 'list_print_modal_' + Number(new Date());

                        $('<div id="' + print_id + '"class="printModal" title="' + title + '"></div>').appendTo('body');

                        $('#' + print_id).dialog({
                            modal: true,
                            width: "1023",
                            height: $(window).height(),
                            zIndex: 3000,
                            position: "top",
                            resizable: false,
                            open: function (event, ui) {
                                $('html').css('overflow', 'hidden');
                            },
                            close: function () {
                                $(this).dialog('destroy');
                                $('#' + print_id).remove();
                                if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'auto', 'overflow-y': 'scroll' });
                            },
                            buttons: [{
                                "text": "Imprimir",
                                "class": "btPrintModal",
                                "click": function () { $('#' + print_id).printElement(); return false; }
                            }, {
                                "text": "Cancelar",
                                "class": "btCancelModal",
                                "click": function () {
                                    $(this).dialog("close");
                                    $(this).dialog('destroy');
                                    $('#' + print_id).remove();
                                }
                            }]
                        });
                        $(printBody).appendTo('#' + print_id);
                    });

                }


                headerRender.find('button.advancedSearch').unbind('click').bind('click', function () {
                    _page.advancedSearch();
                });

                headerRender.find('button.ok').unbind().bind('click', function () {
                    var that = $(this);
                    var search_value = headerRender.find('.inputText.fieldSearch').val();
                    headerRender.find('.inputText.fieldSearch').attr('placeholder', 'ENCONTRE');
                    if ($.epar(search_value)) {
                        var paging = {};
                        paging.page = 1;
                        paging.size = _page.listPageSize;
                        paging.fast_search = search_value;
                        paging.parameters = {};


                        //NOVO CÓDIGO DEFAULT SEARCH BASEADO EM CONFIGURAÇÕES DO FBP - ATILA 05/03/2013
                        var master_field = [];
                        var element_id = '';
                        for (var ix = 0; ix < _page.pageFBP.Attribute_Groups.length; ix++) {
                            master_field.push.apply(master_field, _page.pageFBP.Attribute_Groups[ix].Attribute_Group_data.filter(function (el) { return el.in_master_search == 1 }));
                            if (master_field.length > 0) {
                                master_field = master_field[0];
                                break
                            };
                        }

                        if ($.epar(master_field.master_search_custom_field) && master_field.master_search_custom_field.length > 0)
                            element_id = master_field.master_search_custom_field;
                        else
                            element_id = master_field.ds_attribute_name;

                        switch (element_id.substring(0, 3)) {
                            case 'ds_':
                                paging.parameters[element_id] = '%' + search_value + '%';
                                break;
                            case 'id_':
                                if (isNaN(search_value)) {
                                    headerRender.find('.inputText.fieldSearch').attr('placeholder', 'SOMENTE NÚMEROS');
                                    headerRender.find('.inputText.fieldSearch').val('');
                                    headerRender.find('.inputText.fieldSearch').focus();
                                    return false;
                                }
                                else {
                                    paging.parameters[element_id] = search_value;
                                }
                                break;
                            case 'dt_':
                                if ($.isDate(search_value)) {
                                    paging.parameters[element_id + '_ini'] = $.DateFormatToDbParam(search_value) + ' 00:00:00';
                                    paging.parameters[element_id + '_fim'] = $.DateFormatToDbParam(search_value) + ' 23:59:59';
                                }
                                else {
                                    headerRender.find('.inputText.fieldSearch').attr('placeholder', 'SOMENTE DATAS');
                                    headerRender.find('.inputText.fieldSearch').val('');
                                    headerRender.find('.inputText.fieldSearch').focus();
                                    return false;
                                }
                                break;
                            case 'nu_':
                                if ($.isNaN(search_value)) {
                                    headerRender.find('.inputText.fieldSearch').attr('placeholder', 'SOMENTE NÚMEROS');
                                    headerRender.find('.inputText.fieldSearch').val('');
                                    headerRender.find('.inputText.fieldSearch').focus();
                                }
                                else {
                                    paging.parameters[element_id + '_ini'] = search_value;
                                    paging.parameters[element_id + '_fim'] = search_value;
                                    return false;
                                }
                                break;
                            default:
                                paging.parameters['ds_' + _page.pageEntity.toLowerCase().trim()] = '%' + search_value + '%';
                                break;
                        }
                        //FIM - ATILA 05/03/2013

                        _page.pageDataPaging = paging;
                    } else {
                        _page.pageDataPaging = '';
                    }

                    _page.pageListTotalRecords = null;
                    _page.renderType = 1; // List;                          
                    _page.Render();


                });




                headerRender.find('button.addNew').unbind().bind('click', function () {
                    if (_page.renderType != 2) {
                        _page.renderType = 2; // Form;              
                        _page.pageCurrentValue = 0;
                        _page.pageFormData = {}
                        _page.pageTempData = null;
                        _page.Render();
                    } else if (!_instance.checkFormChanges()) {
                        _page.renderType = 2; // Form;              
                        _page.pageCurrentValue = 0;
                        _page.pageFormData = {}
                        _page.pageTempData = null;
                        _page.Render();
                    } else {
                        Mktup.Confirm('Existem informações não salvas.', 'Continuar assim mesmo?', function (pYes) {

                            if (pYes) {
                                _page.renderType = 2; // Form;              
                                _page.pageCurrentValue = 0;
                                _page.pageFormData = {}
                                _page.pageTempData = null;
                                _page.Render();
                            }

                        });
                    }
                });

            }

        }
        $('[data-isloading]').removeAttr("data-isloading");
        headerRender.find('section.pageContent div.pageMain').empty();

        defPage_buildPageHeader.resolve(true);

        return defPage_buildPageHeader.promise();

    }





    var initPage = function (custom_form, custom_list, noDashBoard) {





        var render_type = getRenderTypeName();
        if (render_type == "form" && $.epar(custom_form)) render_type = custom_form;
        if (render_type == "list" && $.epar(custom_list)) render_type = custom_list;

        var params = {};

        params.noDashboard = ($.epar(noDashBoard) == true);

        params.keepHeader = true;
        params.keepMenu = true;

        if (params.noDashboard) {
            $('body section.MainSection').removeAttr("class").addClass("MainSection").addClass("noDashboard");
        } else if (!$.epar(sessionStorage["mktup_dashboard_status"]) || $.epar(sessionStorage["mktup_dashboard_status"]) == 'open') {
            $('body section.MainSection').removeAttr("class").addClass("MainSection").addClass("DashboardOpen");
        } else {
            $('body section.MainSection').removeAttr("class").addClass("MainSection").addClass("DashboardClose");
        }

        _instance.buildHeader(params);

        buildPageHeader().done(function () {

            $('body').removeAttr('class').addClass(_page.pageEntity.toLowerCase());
            var container = $('body div.pageMain:first');


            $.loadModule(container, render_type);

        });

    };







    var initReport = function () {

        var params = {};
        params.noDashboard = true;
        params.keepHeader = false;
        params.keepMenu = true;

        _instance.buildHeader(params);
        _page.showActionBar = false;

        buildPageHeader().done(function () {

            $('body').removeAttr('class').addClass('report').addClass(_page.pageEntity.toLowerCase());
            var container = $('body div.pageMain:first');
            $.loadModule(container, "report");

        });

    }

    var initSheet = function (custom_form) {

        $('body').append('<div id="sheet_container_' + _page.pageId + '" data-sheet_id="' + _page.pageId + '" class="sheet"></div>');

        buildPageHeader().done(function () {

            var render_type = getRenderTypeName();
            if (render_type == "form" && $.epar(custom_form)) render_type = custom_form;

            var container = $('#sheet_container_' + _page.pageId + ' div.pageMain:first');

            $('#sheet_container_' + _page.pageId).dialog({
                modal: true,
                width: "1023",
                height: "480",
                zIndex: 3000,
                position: "center",
                resizable: false,
                title: _instance.translator(_page.pageFBP.id_term_page),
                autoOpen: false,
                draggable: true,
                close: function (event, ui) {
                    $('#sheet_container_' + _page.pageId).remove();
                    if ($('.ui-dialog:visible').length < 1) $('html').css({ 'overflow-x': 'hidden', 'overflow-y': 'scroll' });
                },
                open: function () {
                    if ($(window).width() < 1050) $('html').css('overflow', 'hidden');
                }
            });

            $.loadModule(container, render_type).done(function () { });
        });
    };

    var getPermissions = function () {

        var oActiveUser = sessionStorage['active_user'];

        if (!$.epar(oActiveUser)) {
            _instance.Navigate('login');
            return;
        }

        oActiveUser = eval('(' + oActiveUser + ')');

        if (!$.epar(oActiveUser) || !$.epar(oActiveUser.user)) {
            _instance.Navigate('login');
            return;
        }

        oActiveUser = eval('(' + oActiveUser.user + ')');

        var permissionList = oActiveUser.d.ls_permission;

        p_permission = {};
        p_permission.id_page = _page.pagePageId;


        var pagePermission = permissionList.filter(function (el) { return el.id_page * 1 == _page.pagePageId * 1; })
        if ($.epar(pagePermission) && (pagePermission.length > 0)) {

            if (pagePermission[0].in_visible == 1) p_permission.in_visible = 1;
            if (pagePermission[0].in_insert == 1) p_permission.in_insert = 1;
            if (pagePermission[0].in_update == 1) p_permission.in_update = 1;
            if (pagePermission[0].in_delete == 1) p_permission.in_delete = 1;
            if (pagePermission[0].in_offline == 1) p_permission.in_offline = 1;
        } else {
            p_permission.in_visible = 0;
            p_permission.in_insert = 0;
            p_permission.in_update = 0;
            p_permission.in_delete = 0;
            p_permission.in_offline = 0;
        }

        _page.pagePermissions = p_permission;

    };

};

Mktup_CEP = function () {

    this.requestAddress = function (cep_value) {

        var defCep_requestAddress = new $.Deferred();

        var params = {}; params.d = {}; params.d.parameters = {}; params.d.parameters.aux = cep_value;

        SyncGetDataOn(params, "CEP", "GetAddress", false).done(function (get_address_result) {
            get_address_result = eval('(' + get_address_result + ')').d;
            defCep_requestAddress.resolve(get_address_result);
        });

        return defCep_requestAddress.promise();
    },

    this.searchCEP = function (zip_code, address, neighborhood, city, state, ibge, focus_field) {

        var defSearchCEP = new $.Deferred();
        var cep_value = zip_code.replace("-", "");


        var searchCity = function (city_value, city_field, state_value, state_field, ibge_value) {
            var def_searchCity = new $.Deferred();

            if (!city_field.hasClass('mktup_autocomplete')) {
                city_field.val(city_value);
            } else {
                city_field.val(city_value);
                city_field.attr('data-id_value', city_value);
            }

            if (!state_field.hasClass('mktup_autocomplete')) {
                state_field.val(state_value);
            } else {
                state_field.val(state_value);
                state_field.attr('data-id_value', state_value);
            }

            def_searchCity.resolve(true);
            return def_searchCity.promise();
        };

        _instance.requestAddress(cep_value).done(function (address_result) {
            if (address_result.length > 0) {

                address.val(((address_result[0].type_address.trim().length > 0 || address_result[0].address.trim().length > 0) ? address_result[0].type_address + " " + address_result[0].address : ''));
                neighborhood.val(address_result[0].neighborhood);

                if ($.epar(ibge)) ibge.val(address_result[0].nu_ibge);
                if ($.epar(focus_field)) focus_field.eq(0).focus();


                searchCity(address_result[0].city, city, address_result[0].state, state, address_result[0].nu_ibge).done(function () {
                    defSearchCEP.resolve(true);
                });

            } else {
                Mktup.alertModal(Mktup.translator(10188));

                address.val('');
                neighborhood.val('');

                if ($.epar(ibge)) ibge.val('');

                searchCity('', city, '', state, '').done(function () {
                    defSearchCEP.resolve(false);
                });
            }

        });

        return defSearchCEP.promise();
    },

    this.createButton = function (that, id, value, address, neighborhood, city, state, ibge, focus_field) {
        var field = $(that);

        field.parent().append('<button id="' + id + '" class="button defaultButton">' + value + '</button>');
        field.parent().find('#' + id).unbind('click').bind('click', function () {
            var that = $(this);
            var field = that.parents('label').find('input');
            that.loader();

            if (!$.epar(field.val())) {
                that.loader('end');
                field.msgbox('show');
                return false;
            }

            _instance.searchCEP(field.val(), $(address), $(neighborhood), $(city), $(state), ($.epar(ibge) ? $(ibge) : null), ($.epar(focus_field) ? $(focus_field) : null)).done(function () {
                that.loader('end');
            });
        });
    }

    var _instance = this;
};

$('body').unbind('keydown').bind('keydown', function (e) { if (e.keyCode == 192) return false; });