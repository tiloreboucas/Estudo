//## REPLACE_ON_INSTALL ## var AppPath = '//' + window.location.hostname + '/omega_proxy',
var AppPath = '//192.168.1.20:8080/omega_proxy',
//var AppPath = '//' + window.location.host + '/omega_proxy',
	ClientId = 1,
    driverOff = null,
	dbDefault;


//var AppPath = '//marketup.no-ip.org:8080/omega_proxy',
//var AppPath = '//192.168.1.20:8080/omega_proxy',

var tables_off = [
    ["fin_entry", "empty", "ts_control"],
    ["fin_transfer", "empty", "ts_control"],
    ["operator_pdv", "readonly", "ts_control"],
    ["payment_type", "readonly", "ts_control"],
    ["payment_condition", "readonly", "ts_control"],
    ["pdv", "readonly", "ts_control"],
    ["pdv_operation", "readwrite", "dt_open_pdv"],
    ["operation_type_pdv", "readonly", "ts_control"],
    ["pdv_operation_detail", "empty", "ts_control"],
    ["coupon", "empty", "ts_control"],
    ["coupon_item", "empty", "ts_control"],
    ["coupon_payment", "empty", "ts_control"],
    ["custom_item_combo", "readonly", "ts_control"],
    ["custom_item_group", "readonly", "ts_control"],
    ["itens_custom_item_group", "readonly", "ts_control"],
    ["item_pdv", "readonly", "ts_control"],
    ["item_unit", "readonly", "ts_control"],
    ["item_image", "readonly", "ts_control"],
    ["client_pdv", "readonly", "ts_control"],
    ["seller_pdv", "readonly", "ts_control"],
// ["pdv_item_tax", "readonly", "ts_control"],
    ["default_value", "readonly", "ts_control"],
    ["company", "readonly", "ts_control"],
// ["vw_sale_price_all", "readonly", "ts_control"],
    ["seller_commission", "readwrite", "ts_control"],
    ["printer_attribute", "readwrite", "ts_control"],
    ["fin_account_management", "readwrite", "ts_control"],
    ["fin_account", "readonly", "ts_control"],
    ["user", "readwrite", "ts_control"],
    ["address_person", "readonly", "ts_control"],
    ["general_value", "readonly", "ts_control"]
];

//colocar aqui as entidades que nao quer que seja derivada de um FBP.  Atila: 19/10/2012
var customTableStruct = [
    ["item_pdv", ["id_item", "ds_item", "ds_codebar", "vl_value", "id_item_unit", "ds_item_image", "ds_item_group"]],
    ["client_pdv", ["id_client", "ds_cpf", "_ds_client", "id_client_type"]],
    ["operator_pdv", ["id_operator", "id_employee", "in_authorization_manager", "_ds_operator"]],
    ["seller_pdv", ["id_employee", "vl_comission", "_ds_employee"]],
    ["coupon_payment_installment", ["id_coupon_payment_installment", "id_coupon_payment", "dt_payment", "vl_main", "vl_payment", "ds_payment_description", "nu_installment", "dt_update"]]
];


//colocar aqui as entidades|métodos que serão utilizados no Sync porém difere do padrão (List).  Atila: 19/10/2012
var customSyncMethod = [
    ["item_pdv", "Custom_PDV", "GetItemPdv"],
    ["client_pdv", "Custom_PDV", "GetClientPdv"],
    ["operator_pdv", "Custom_PDV", "GetOperatorPdv"],
    ["seller_pdv", "Custom_PDV", "GetSellerPdv"],
    ["coupon_payment_installment", "Coupon_Payment_Installment", "ListData"]
];

function SmartBarBlock(area, id, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Tools_DataEngine.aspx/getSamartBarWidget",
        data: "{ 'area': '" + area + "', 'id': " + id + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            callback(response);
        }
    });
}


function ReportData(report_name, params, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Report_DataEngine.aspx/getReportData",
        data: "{ 'report_name': '" + report_name + "', 'param': '" + JSON.stringify(params) + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}



function WizardItemsAutocomplete(callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/ListItemsAutocomplete",
        // data: "{ 'codebar': '" + codebar + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardCityAutocomplete(callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/ListCityAutocomplete",
        // data: "{ 'codebar': '" + codebar + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}

function IsLocalProduct(codebar, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/isLocalProduct",
        data: "{ 'codebar': '" + codebar + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response.d);
        }
    });
}

function WizardPermissionStructure(module_id, callback) {


    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/getPermissionStructure",
        data: "{ 'module_id': '" + module_id + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardPagePermission(page_id, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/getPagePermission",
        data: "{ 'page_id': '" + page_id + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}


function WizardSavePagePermission(return_rows, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/savePagePermission",
        data: "{d:'" + JSON.stringify(return_rows) + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardSaveGroup(group_name, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/saveGroup",
        data: "{group_name:'" + group_name + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); callback(false); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardInsertPerson(name, mail, id_person_type, is_employee, is_operator, is_operator_adm, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/InsertWizardPersons",
        data: "{ 'name': '" + name + "', 'mail': '" + mail + "', 'in_person_type': 1, 'is_employee': " + is_employee + ", 'is_operator': " + is_operator + ", 'is_operator_adm': " + is_operator_adm + ", 'id_omega': " + ClientId + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            if (callback) callback(response);
        }
    });
}

function WizardUpdatePerson(id_person, name, mail, is_operator, is_operator_adm, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/UpdateWizardPersons",
        data: "{ 'id_person': " + id_person + ", 'name': '" + name + "', 'mail': '" + mail + "', 'is_operator': " + is_operator + ", 'is_operator_adm': " + is_operator_adm + ",'id_omega': " + ClientId + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            if (callback) callback(response);
        }
    });
}

function WizardUpdateUserStatus(id_user, in_block) {
    var deferred = $.Deferred();
    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/UpdateUserStatus",
        data: "{ 'id_user': " + id_user + ", 'in_block': " + in_block + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            deferred.resolve(response);
        }
    });
    return deferred.promise();
}

function WizardListPerson(id_person, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/ListWizardPersons",
        data: "{ 'id_person_simple': " + id_person + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardUserExists(ds_login, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/UserExists",
        data: "{ 'ds_login': '" + ds_login + "'}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            callback(response);
        }
    });
}

function WizardPersonContactList(id_person, callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/PersonContactList",
        data: "{ 'id_person': " + id_person + "}",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            callback(response);
        }
    });
}

function ClearTabCombos(callback) {

    $.ajax({
        type: "POST",
        url: AppPath + "/Wizard_DataEngine.aspx/ClearPDVTabCombos",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            callback(response);
        }
    });
}



function getActiveUser() {

    var AU_Def = $.Deferred();

    if (navigator.onLine) {
        SyncGetDataOn({ d: {} }, 'ActiveUser', 'GetActiveUser', true).done(function (e) {
            if ($.epar(e)) {
                AU_Def.resolve(sessionStorage.getItem('active_user'));
            } else {
                AU_Def.resolve(null);
            }
        })
    } else {
        AU_Def.resolve(sessionStorage.getItem('active_user'));
    }

    return AU_Def.promise();

}

function SendMail(ds_login, callback) {
    $.ajax({
        type: "POST",
        url: AppPath + "/Tools_DataEngine.aspx/ProccessMail",
        data: "{ 'ds_login': '" + ds_login + "', 'client_id':'" + ClientId + "' }",
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: false,
        error: function () { console.log("ERROR"); },
        success: function (response) {
            if (response.d == 'ok')
                callback(true);
            else
                callback(response.d);
        }
    });
}

function GetClientId() {
    return ClientId;
}

function GetGenericTemplateSync(bLogin) {
    var temps = [];
    var filter_ts_control = localStorage.getItem(String('LastSyncData_' + ClientId));
    var template = 'var ODB = new OmegaDB();\n localStorage.removeItem(String("LastSyncData_" + ClientId)); \n';
    var cont = 0;
    var pageLogin = window.location.href.indexOf('login.html');

    $(tables_off).each(function () {
        switch (this[1]) {
            case "empty":
                temps.push('CheckTableStruct("' + this[0] + '", ClientId, \nfunction(ret){ #' + cont + '# });');
                break;
            default:
                temps.push('ODB.SyncData("' + this[0] + '", ClientId, \nfunction(ret){ #' + cont + '# });');
                break;
        }

        cont++;
    });
    var temporario = '';
    var elem = (temps.length - 1);
    var max = elem;
    for (elem; elem >= 0; elem--) {
        var elemento = temps.pop();
        if (elem == max)
            temporario = elemento.replace('#' + elem + '#', ' localStorage.setItem(String("LastSyncData_" + ClientId), Number(new Date())); \n \n ODB = null;\nlocation.reload(true);'); //callback(ret);\n  
        else
            temporario = elemento.replace('#' + elem + '#', temporario);
    }
    template += temporario;

    return template;
}

function SyncOnlineData() {
    if (localStorageDB) {
        //displaySyncLoading.call(null, true);
        SyncOfflineData().done(function (ret) {
            if (ret) {
                ExecuteDataBaseOff({ d: {} }, '', 'EmptyDataBase', ClientId, function (e) {
                    var template = GetGenericTemplateSync();
                    eval(template);
                }, false);
            }
        });
    }
}

//GENERIC INTERFACE EXECUTE CRUD DB ONLINE
function ExecuteDataBaseOn(pData, entity, method, idClient, callback, sync) {
    //console.log('params', pData, entity, method, idClient, callback, sync);
    $.ajax({
        type: "POST",
        url: AppPath + "/" + entity + "_DataEngine.aspx/" + method,
        data: (pData.d ? "{d:'" + JSON.stringify(pData.d) + "'}" : JSON.stringify(pData)),
        contentType: "application/json; charset=utf-8",
        datatype: "jsondata",
        async: !sync, //Chamada do AJAX no modo síncrono/assíncrono.

        error: function (ret, status, erro) {
            if (ret.status == 901 || ret.status == 902)
                Mktup.Navigate('login');
            else
                console.log("ERROR: ", "PROXY: " + "/" + entity + "_DataEngine.aspx/" + method, "OBJ DATA: " + "{d:'" + JSON.stringify(pData.d) + "'}", "RETORNOS: " + JSON.stringify(ret), JSON.stringify(status), JSON.stringify(erro)); errorAlert(ret, status, erro, $(this));
        },
        success: function (response) {
            if (response.status == 901 || response.status == 902)
                Mktup.Navigate('login');
            if (method == 'UpdateData') {
                if (response.d) {
                    if (pData.d.length == 1) {
                        if (response.d == '-999') {
                            callback(response.d);
                        } else {
                            callback(pData.d[0]['id_' + entity.toLowerCase()]);
                        }
                    } else {
                        callback(response.d);
                    }
                } else {
                    callback(0);
                }

            } else {
                //console.log('omega', response.d);
                callback(response.d);
            }
        }
    });
}

function CheckTableStruct(entity, idClient, callback) {
    var dbName = idClient + "_OmegaDB_Off";
    var tableName = idClient + "_" + entity.toLowerCase() + "_Off";
    var lib = new localStorageDB(dbName, tableName);

    lib.init(function (db_data) {

        if ($.epar(entity.toLowerCase())) {
            if (!lib.tableExists(tableName)) {
                var tableFields = getTableStruct(entity.toLowerCase());
                lib.createTable(tableName, tableFields);
                lib.commit(function (ret) { callback(void (0)); });
            } else {
                callback(void (0));
            }
        } else {

            callback(void (0));
        }
    });
}

//Padroes adotados:
//- bdname: idCliente_'OmegaDB_Off'
//- objectStore: idCliente_entity_'Off'
//GENERIC INTERFACE EXECUTE CRUD DB OFFLINE
function ExecuteDataBaseOff(pData, entity, method, idClient, callback, sync) {

    try {
        var dbName = idClient + "_OmegaDB_Off";
        var tableName = idClient + "_" + entity.toLowerCase() + "_Off";
        var iCount = 0;

        // Initialise. If the database doesn't exist, it is created
        var lib = new localStorageDB(dbName, tableName);

        if (method == 'EmptyDataBase') {

            lib.drop(callback(true));

        } else {

            lib.init(function () {

                if ($.epar(entity.toLowerCase())) {
                    if (!lib.tableExists(tableName)) {
                        var tableFields = getTableStruct(entity.toLowerCase());
                        lib.createTable(tableName, tableFields);
                    }
                }

                switch (method) {
                    case "ListData":
                        if (sync) {
                            callback(lib.query(tableName));

                        } else if ($.isEmptyObject(eval(pData.d))) {

                            callback(lib.query(tableName, function (row) {
                                if (row.fl_actionOff == 'D') { return false; } else { return true; };
                            }));

                        } else if (pData.d.paging) {

                            var page_function = function (row) {
                                if (row.fl_actionOff == 'D') {
                                    return false;
                                } else {
                                    return ((row.ID >= ((pData.d.paging.page * pData.d.paging.size) - (pData.d.paging.size - 1))) && (row.ID <= (pData.d.paging.page * pData.d.paging.size)));
                                }
                            };

                            var rs = null;

                            if (pData.d.parameters) {
                                rs = lib.query_paged(tableName, pData.d.parameters, page_function);
                            } else {
                                rs = lib.query(tableName, page_function);
                            }
                            callback(JSON.stringify(rs));

                        } else if (pData.d.parameters) {
                            var results = lib.query(tableName, pData.d.parameters);
                            var rs = results.filter(function (el) { return el.fl_actionOff != 'D'; });
                            callback(JSON.stringify(rs));
                        } else {
                            callback(lib.query(tableName, eval(pData.d),
							function (row) {
							    if (row.fl_actionOff == 'D') { return false; } else { return true; };
							}));
                        }
                        break;
                    case "InsertData":
                        //Recebe multipos Objetos para Inserir
                        var lastID = 0;
                        for (pItem in pData.d) {
                            iCount++;
                            lastID = Number(new Date()) + iCount;
                            pData.d[pItem].ts_control = lastID;
                            pData.d[pItem].fl_actionOff = 'S';
                            if (!sync) {
                                pData.d[pItem].fl_actionOff = 'I';
                                pData.d[pItem]["id_" + entity.toLowerCase()] = lastID;
                            }
                            lib.insert(tableName, pData.d[pItem]);
                        }
                        lib.commit(function () { callback(lastID); });

                        break;
                    case "UpdateData":
                        //Recebe multipos Objetos para Inserir
                        var currentId = {};
                        for (pItem in pData.d) {
                            iCount++;
                            currentId = pData.d[pItem].ts_control;

                            pData.d[pItem].ts_control = Number(new Date()) + iCount;
                            if (Number(pData.d[pItem]["id_" + entity.toLowerCase()]) < 2147483647) {
                                pData.d[pItem].fl_actionOff = 'S';
                                if (!sync) pData.d[pItem].fl_actionOff = 'U';
                            }
                            currentId = eval('({"id_' + entity.toLowerCase() + '": ' + pData.d[pItem]["id_" + entity.toLowerCase()] + '})');
                            lib.update(tableName, currentId, function (row) { row = pData.d[pItem]; return row; });
                        }
                        lib.commit(function () {
                            if (pData.d.length == 1) {
                                callback(pData.d[0]['id_' + entity.toLowerCase()]);
                            } else {
                                callback(iCount);
                            }
                        });
                        break;
                    case "DeleteData":
                        //Recebe multipos Objetos para Inserir
                        var currentId = {};
                        for (pItem in pData.d) {
                            iCount++;
                            var field_comp = "id_" + entity.toLowerCase();
                            rs = lib.query(tableName, eval('({ ' + field_comp + ': ' + pData.d[pItem] + '})'))[0];
                            if (rs.fl_actionOff == 'I') {
                                lib.deleteRows(tableName, pData.d[pItem]);
                            }
                            else {
                                currentId = eval('({"id_' + entity.toLowerCase() + '": ' + pData.d[pItem] + '})');
                                lib.update(tableName, currentId, function (row) {
                                    row.ts_control = Number(new Date()) + iCount;
                                    row.fl_actionOff = 'D';
                                    return row;
                                });
                            }
                        }
                        lib.commit(function () {
                            callback(iCount);
                        });
                        break;
                    case "DropTable":
                        lib.dropTable(tableName);
                        break;
                    default: //ListData
                        if (sync) {
                            callback(lib.query(tableName));

                        } else if ($.isEmptyObject(eval(pData.d))) {

                            callback(lib.query(tableName, function (row) {
                                if (row.fl_actionOff == 'D') { return false; } else { return true; };
                            }));

                        } else if (pData.d.paging) {

                            var page_function = function (row) {
                                if (row.fl_actionOff == 'D') {
                                    return false;
                                } else {
                                    return ((row.ID >= ((pData.d.paging.page * pData.d.paging.size) - (pData.d.paging.size - 1))) && (row.ID <= (pData.d.paging.page * pData.d.paging.size)));
                                }
                            };

                            var rs = null;

                            if (pData.d.parameters) {
                                rs = lib.query_paged(tableName, pData.d.parameters, page_function);
                            } else {
                                rs = lib.query(tableName, page_function);
                            }
                            callback(JSON.stringify(rs));

                        } else if (pData.d.parameters) {
                            var results = lib.query(tableName, pData.d.parameters);
                            var rs = results.filter(function (el) { return el.fl_actionOff != 'D'; });
                            callback(JSON.stringify(rs));
                        } else {
                            callback(lib.query(tableName, eval(pData.d),
							function (row) {
							    if (row.fl_actionOff == 'D') { return false; } else { return true; };
							}));
                        }
                        break;
                }
            });
        }
    } catch (ex) {
        callback(entity.toLowerCase() + "ExecuteDataBaseOff - " + method + ":  error-> " + ex.message);
    }
}

function getTableStruct(table) {
    var control_fbp = false;
    var tableFields = [];
    try {
        tableFields = customTableStruct.filter(function (el) { return el[0] == table })[0][1];
    }
    catch (err) { }
    if (tableFields.length == 0) {
        if (eval('typeof fbp_' + table) == 'undefined') {
            $.ajax({
                url: 'fbp/fbp_' + table + '.js',
                async: false,
                success: function (script) {
                    eval(script);
                    control_fbp = true;
                }
            });
        }
        var attrgroups = eval('fbp_' + table + '.Attribute_Groups');
        $(attrgroups).each(function () {
            var ag = this;
            $(ag.Attribute_Group_data).each(function () {
                var agd = this;
                if (!(agd.ds_attribute_name.substring(0, 3) == 'ls_' || agd.ds_attribute_name.substring(0, 2) == 'm_')) //&& agd.in_off) tirei por enquanto pois nenhum fbp esta respeitando esta flag
                {
                    tableFields.push(agd.ds_attribute_name);
                    if (agd.ds_attribute_name.substring(0, 3) == 'id_') {
                        var ds_exists = false;
                        for (a = 0; a < ag.Attribute_Group_data.length; a++) {
                            var agd_aux = ag.Attribute_Group_data[a];
                            if (agd_aux.ds_attribute_name == agd.ds_attribute_name.replace('id_', 'ds_')) {
                                ds_exists = true;
                                a = ag.Attribute_Group_data.length;
                            }
                        }
                        if (!ds_exists) tableFields.push(agd.ds_attribute_name.replace('id_', '_ds_'));
                    }
                }
            });
            tableFields.push('fl_actionOff');
            tableFields.push('ts_control');
            tableFields.push('id_omega');
        });

        if (control_fbp) {
            eval('delete fbp_' + table);
        }
    }
    else {
        tableFields.push('fl_actionOff');
    }
    return tableFields;
}


/*!
* YCR PARTICIPACOES
* INTERFACE DEFAULT CRUD - ON-OFF - V 1.0.0
* Developed by Alexandre Parpinelli / Atila Resende
* Release Data: 03/10/2011
*/
OmegaDB = function () {

    //Lista Dados
    this.ListaDados = function (pData, entity, method, idClient, callback, sync) {
        if (window.applicationCache) {
            if (navigator.onLine) {
                ExecuteDataBaseOn(pData, entity, method, idClient, callback, sync);
            }
            else {
                ExecuteDataBaseOff(pData, entity, method, idClient, callback);
            }
        }
        else {
            alertModal($.translator(10608));
        }
    }

    this.SalvaDados = function (pData, entity, method, idClient, callback, sync) {
        if (window.applicationCache) {
            if (navigator.onLine) {
                if (method == 'InsertData') {
                    ExecuteDataBaseOn(pData, entity, method, idClient, callback, sync);
                } else if (method == 'UpdateData') {
                    ExecuteDataBaseOn(pData, entity, method, idClient, callback, sync);
                }
            }
            else {
                if (method == 'InsertData') {
                    ExecuteDataBaseOff(pData, entity, method, idClient, callback);
                } else if (method == 'UpdateData') {
                    ExecuteDataBaseOff(pData, entity, method, idClient, callback);
                }
            }
        }
        else {
            alertModal($.translator(10608));
        }
    }

    this.ExcluiDados = function (pData, entity, method, idClient, callback, sync) {
        if (window.applicationCache) {
            if (navigator.onLine) {
                ExecuteDataBaseOn(pData, entity, method, idClient, callback, sync);
            }
            else {
                ExecuteDataBaseOff(pData, entity, method, idClient, callback);
            }
        }
        else {
            alertModal($.translator(10608));
        }
    }

    //    this.EmptyDBOff = function (idClient, callback) {
    //        ExecuteDataBaseOff({ d: {} }, '', 'EmptyDataBase', idClient, function (e) { callback(e); }, false);
    //    }

    this.SyncData = function (entity, idClient, funcao_retorno) {
        if (window.applicationCache) {
            if (navigator.onLine) {
                //FILTRO DOS CUPONS PELA ABERTURA
                if (entity == 'pdv_operation') {
                    //Atualiza PDV Operation
                    CheckTableStruct(entity, idClient, function () {
                        CheckTableStruct('pdv_operation_detail', idClient, function () {
                            AtualizaPDVOperation(idClient, function (ret) { funcao_retorno(ret); });
                        });
                    });
                } else if (entity != 'pdv_operation_detail') {

                    //Fluxo Normal
                    var custom = customSyncMethod.filter(function (el) { return el[0] == entity })
                    if (custom.length > 0) {
                        ExecuteDataBaseOn({ d: {} }, custom[0][1], custom[0][2], idClient,
                        function (ret) {
                            var items = {};
                            items.d = eval(ret);
                            ExecuteDataBaseOff(items, entity, 'InsertData', idClient, function (ret) { funcao_retorno(ret); }, true);
                        });
                    }
                    else {
                        ExecuteDataBaseOn({ d: {} }, entity, 'ListData', idClient,
                        function (ret) {
                            var items = {};
                            items.d = eval(ret);
                            ExecuteDataBaseOff(items, entity, 'InsertData', idClient, function (ret) { funcao_retorno(ret); }, true);
                        });
                    }
                }
            }
            else {
                Mktup.alertModal($.translator(10609));
            }
        } else {
            Mktup.alertModal($.translator(10608));
        }
    }


    AtualizaPDVOperation = function (idClient, callback_pdv_operation) {

        var path = Mktup.getPath();
        var ofs = new OmegaFile();
        var pdv_conf = null;

        ofs.ReadFile(path + 'CONF_PDV.ivx', function (tk) {
            if ((tk) && (!tk.code)) { pdv_conf = tk; }
            
            //Initialization Code
            if ($.epar(pdv_conf)) {
                var conf = sjcl.decrypt(Mktup.getHash(), String(pdv_conf));

                if ($.epar(conf)) {

                    var filter_operation = {};
                    filter_operation.d = {};
                    filter_operation.d.paging = {};
                    filter_operation.d.parameters = {};
                    filter_operation.d.paging.size = 1;
                    filter_operation.d.paging.page = 1;
                    filter_operation.d.parameters.ds_key_control = conf;

                    ExecuteDataBaseOn(filter_operation, 'pdv', 'ListData', idClient, function (pdv_id) {
                        pdv_id = eval(pdv_id);
                        if (pdv_id.length > 0) {
                            pdv_id = pdv_id[0];

                            delete filter_operation.d.parameters.ds_key_control;
                            filter_operation.d.parameters.id_operation_type_pdv = 3;
                            filter_operation.d.parameters.id_pdv = pdv_id.id_pdv;

                            ExecuteDataBaseOn(filter_operation, 'pdv_operation', 'ListData', idClient, function (pdv_last_close_id) {
                                pdv_last_close_id = eval(pdv_last_close_id);
                                if (pdv_last_close_id.length > 0) {
                                    pdv_last_close_id = pdv_last_close_id[0];

                                    delete filter_operation.d.parameters.id_operation_type_pdv;
                                    filter_operation.d.paging.size = 10000;
                                    filter_operation.d.parameters.id_pdv_operation_ini = (pdv_last_close_id.id_pdv_operation + 1);

                                    ExecuteDataBaseOn(filter_operation, 'pdv_operation', 'ListData', idClient, function (ret_0) {
                                        var items = {};
                                        items.d = eval(ret_0);

                                        if (items.d.length > 0) {
                                            ExecuteDataBaseOff(items, 'pdv_operation', 'InsertData', idClient, function (ret_1) {
                                                var itensArray = [];

                                                $(items.d).each(function () {
                                                    var lista = $(this.ls_pdv_operation_detail);
                                                    lista.each(function () {
                                                        itensArray.push(this);
                                                    });
                                                });

                                                if (itensArray.length > 0) {
                                                    var od = {}
                                                    od.d = itensArray;
                                                    ExecuteDataBaseOff(od, 'pdv_operation_detail', 'InsertData', idClient, function () {
                                                        callback_pdv_operation();
                                                    }, true);
                                                } else {
                                                    callback_pdv_operation();
                                                }
                                            }, true);
                                        } else {
                                            callback_pdv_operation();
                                        }
                                    });
                                } else {
                                    callback_pdv_operation();
                                }
                            });

                        } else {
                            callback_pdv_operation();
                        }
                    });

                } else {
                    callback_pdv_operation();
                }
            }

        });

    }

    this.SoftwareUpdate = function () { }

    this.AuthUser = function (data, entity, method, client, callback) {
        ExecuteDataBaseOn(data, entity, method, client, callback);
    }

}

function writeError(e) {
    document.write(e);
}

function errorAlert(ret, status, erro, return_object) {
    if (ret.status == 404) {
        console.log('um fbp não pode ser encontrado.');
    } else {
        //console.log(status);
        //console.log('erro: ', erro.type);
        if (erro.arguments) {
            //console.log('argumento: ', erro.arguments[0]);
            //console.log('no arquivo: ', return_object[0].url);
        }
    }
};

function GetLastSyncOnlineData() {
    return localStorage["LastSyncData_" + ClientId];

};

function SyncGetDataOff(Data, Entity, Method, Sync) {
    var DtOffDef = $.Deferred();

    //Sync PDV
    ExecuteDataBaseOff(Data, Entity, Method, ClientId, function (ret) {
        DtOffDef.resolve(ret);
    }, Sync);

    return DtOffDef.promise();
};

function SyncGetDataOn(Data, Entity, Method, Sync) {
    var DtOnDef = $.Deferred();
    Entity = Entity.toLowerCase();

    if (navigator.onLine) {
        //Sync PDV

        //adaptação para entidades customizadas
        var arr_aux = [];
        arr_aux = customSyncMethod.filter(function (el) { return el[0] == Entity });
        if (arr_aux.length > 0) Entity = arr_aux[0][1];
        //

        ExecuteDataBaseOn(Data, Entity, Method, ClientId, function (ret_interno) {
            DtOnDef.resolve(ret_interno);
        }, Sync);
    } else {
        ExecuteDataBaseOff(Data, Entity, Method, ClientId, function (ret_interno) {
            if (Method == 'ListData') {
                if (typeof (ret_interno) == "string") {
                    ret_interno = "{d:" + ret_interno + "}";
                } else {
                    ret_interno = "{d:" + JSON.stringify(ret_interno) + "}";
                }
            }
            DtOnDef.resolve(ret_interno);
        }, Sync);

    }
    return DtOnDef.promise();
};

function SyncOff_InsertonData(arrSource, Entity, currPromise) {
    var arrReturn = []

    if (arrSource.length > 0) {
        for (x_counter in arrSource) {
            var current_id = eval('arrSource[x_counter].id_' + Entity.toLowerCase());
            eval('arrSource[x_counter].id_' + Entity.toLowerCase() + ' = 0 ');
            SyncGetDataOn({ d: [arrSource[x_counter]] }, Entity, 'InsertData', true).done(function (ret_id) {
                arrReturn.push([current_id, ret_id]);
                if (((x_counter * 1) + 1) == arrSource.length) {
                    currPromise.resolve(arrReturn);
                }
            });
        }
    } else {
        currPromise.resolve([]);
    }

};

function SyncOfflineData() {

    var defSyncOff = $.Deferred();

    var off_filter = {};
    off_filter.d = {};
    off_filter.d.parameters = {};
    off_filter.d.parameters.fl_actionOff = "I";

    var off_operation = []
    var off_operation_detail = [];
    var off_coupon = [];
    var off_coupon_item = [];
    var off_coupon_payment = [];
    var off_seller_commission = [];
    var off_fin_transfer = [];

    var on_coupon = [];
    var on_operation = [];

    //Busca as Operações Realizadas no OFF
    SyncGetDataOff(off_filter, 'pdv_operation', 'ListData', false).done(function (operation_list) {
        operation_list = eval(operation_list);

        // Se foi realizada alguma operação prossegue
        if (operation_list.length > 0) {

            off_operation = operation_list;

            SyncGetDataOff(off_filter, 'pdv_operation_detail', 'ListData', false).done(function (operation_detail_list) {
                operation_detail_list = eval(operation_detail_list);
                off_operation_detail = operation_detail_list;

                SyncGetDataOff(off_filter, 'coupon', 'ListData', false).done(function (coupon_list) {
                    coupon_list = eval(coupon_list);
                    off_coupon = coupon_list;

                    SyncGetDataOff(off_filter, 'coupon_item', 'ListData', false).done(function (coupon_item_list) {
                        coupon_item_list = eval(coupon_item_list);
                        off_coupon_item = coupon_item_list;

                        SyncGetDataOff(off_filter, 'coupon_payment', 'ListData', false).done(function (coupon_payment_list) {
                            coupon_payment_list = eval(coupon_payment_list);
                            off_coupon_payment = coupon_payment_list;

                            SyncGetDataOff(off_filter, 'seller_commission', 'ListData', false).done(function (seller_commission_list) {
                                seller_commission_list = eval(seller_commission_list);
                                off_seller_commission = seller_commission_list;

                                SyncGetDataOff(off_filter, 'fin_transfer', 'ListData', false).done(function (fin_transfer_list) {
                                    fin_transfer_list = eval(fin_transfer_list);
                                    off_fin_transfer = fin_transfer_list;


                                    //Começa a inclusão pelos coupons que é a maior dependencia de ids
                                    //Prepara array de Coupons

                                    for (cp_id in coupon_list) {

                                        off_coupon[cp_id].id_omega = ClientId;
                                        delete off_coupon[cp_id].ID;
                                        delete off_coupon[cp_id].fl_actionOff;
                                        delete off_coupon[cp_id]._ds_invoice;
                                        delete off_coupon[cp_id]._ds_pdv;
                                        delete off_coupon[cp_id]._ds_operator;
                                        delete off_coupon[cp_id]._ds_seller;
                                        delete off_coupon[cp_id]._ds_client;
                                        delete off_coupon[cp_id]._ds_coupon;
                                        delete off_coupon[cp_id]._ds_invoice_service;
                                        delete off_coupon[cp_id]._ds_fin_origin;
                                        delete off_coupon[cp_id].ts_control;
                                    }

                                    var defCoupon = $.Deferred();
                                    SyncOff_InsertonData(off_coupon, 'coupon', defCoupon)

                                    defCoupon.promise().done(function (on_coupon_list) {
                                        on_coupon_list = eval(on_coupon_list);
                                        on_coupon = on_coupon_list;

                                        //Itens do Coupon
                                        for (cp_item_id in off_coupon_item) {

                                            var cp_item_coupon_id = on_coupon.filter(function (el) { return el[0] == off_coupon_item[cp_item_id].id_coupon });
                                            off_coupon_item[cp_item_id].id_coupon = (cp_item_coupon_id.length > 0 ? cp_item_coupon_id[0][1] : null);

                                            off_coupon_item[cp_item_id].id_coupon_item = 0;
                                            off_coupon_item[cp_item_id].id_omega = ClientId;

                                            delete off_coupon_item[cp_item_id].ID;
                                            delete off_coupon_item[cp_item_id].fl_actionOff;
                                            delete off_coupon_item[cp_item_id]._ds_coupon;
                                            delete off_coupon_item[cp_item_id]._ds_coupon_item;
                                            delete off_coupon_item[cp_item_id]._ds_item;
                                            delete off_coupon_item[cp_item_id].ts_control;
                                        }

                                        SyncGetDataOn({ d: off_coupon_item }, 'Coupon_Item', 'InsertData', true).done(function (coupon_item_return) {

                                            for (cp_payment_id in off_coupon_payment) {
                                                var cp_payment_coupon_id = on_coupon.filter(function (el) { return el[0] == off_coupon_payment[cp_payment_id].id_coupon });
                                                off_coupon_payment[cp_payment_id].id_coupon = (cp_payment_coupon_id.length > 0 ? cp_payment_coupon_id[0][1] : null);

                                                off_coupon_payment[cp_payment_id].id_coupon_payment = 0;
                                                off_coupon_payment[cp_payment_id].id_omega = ClientId;

                                                delete off_coupon_payment[cp_payment_id].ID;
                                                delete off_coupon_payment[cp_payment_id].fl_actionOff;
                                                delete off_coupon_payment[cp_payment_id]._ds_coupon;
                                                delete off_coupon_payment[cp_payment_id]._ds_coupon_payment;
                                                delete off_coupon_payment[cp_payment_id]._ds_payment_condition;
                                                delete off_coupon_payment[cp_payment_id]._ds_payment_type;
                                                delete off_coupon_payment[cp_payment_id].ts_control;
                                            }

                                            SyncGetDataOn({ d: off_coupon_payment }, 'Coupon_Payment', 'InsertData', true).done(function (coupon_payment_return) {

                                                SyncFinancePDVPayments(off_operation[0].id_pdv, off_coupon_payment).done(function () {

                                                    for (cp_cseller_id in off_seller_commission) {
                                                        var cp_cseller_coupon_id = on_coupon.filter(function (el) { return el[0] == off_seller_commission[cp_cseller_id].id_coupon });
                                                        off_seller_commission[cp_cseller_id].id_coupon = (cp_cseller_coupon_id.length > 0 ? cp_cseller_coupon_id[0][1] : null);

                                                        off_seller_commission[cp_cseller_id].id_seller_commission = 0;
                                                        off_seller_commission[cp_cseller_id].id_omega = ClientId;

                                                        delete off_seller_commission[cp_cseller_id].ID;
                                                        delete off_seller_commission[cp_cseller_id].fl_actionOff;
                                                        delete off_seller_commission[cp_cseller_id]._ds_coupon;
                                                        delete off_seller_commission[cp_cseller_id]._ds_employee;
                                                        delete off_seller_commission[cp_cseller_id]._ds_sale_order;
                                                        delete off_seller_commission[cp_cseller_id]._ds_sale_order_client;
                                                        delete off_seller_commission[cp_cseller_id]._ds_seller_commission;
                                                        delete off_seller_commission[cp_cseller_id]._ds_seller_commission_closing;
                                                        delete off_seller_commission[cp_cseller_id].ts_control;
                                                    }

                                                    SyncGetDataOn({ d: off_seller_commission }, 'Seller_Commission', 'InsertData', true).done(function (seller_commission_return) {

                                                        for (cp_op_id in off_operation) {
                                                            var cp_op_coupon_id = on_coupon.filter(function (el) { return el[0] == off_operation[cp_op_id].nu_source });
                                                            off_operation[cp_op_id].nu_source = (cp_op_coupon_id.length > 0 ? cp_op_coupon_id[0][1] : null);

                                                            off_operation[cp_op_id].id_omega = ClientId;

                                                            delete off_operation[cp_op_id].ID;
                                                            delete off_operation[cp_op_id].fl_actionOff;
                                                            delete off_operation[cp_op_id]._ds_operation_type_pdv;
                                                            delete off_operation[cp_op_id]._ds_operator;
                                                            delete off_operation[cp_op_id]._ds_user;
                                                            delete off_operation[cp_op_id]._ds_pdv;
                                                            delete off_operation[cp_op_id]._ds_pdv_operation;
                                                            delete off_operation[cp_op_id].ts_control;
                                                        }

                                                        var defOperation = $.Deferred();
                                                        SyncOff_InsertonData(off_operation, 'Pdv_Operation', defOperation);

                                                        defOperation.promise().done(function (a) {
                                                            on_operation = eval(a);


                                                            for (cd_ft_id in off_fin_transfer) {
                                                                var cp_ft_operation_id = on_operation.filter(function (el) { return el[0] == off_fin_transfer[cd_ft_id].ds_nu_document });
                                                                off_fin_transfer[cd_ft_id].ds_nu_document = (cp_ft_operation_id.length > 0 ? cp_ft_operation_id[0][1] : null);

                                                                off_fin_transfer[cd_ft_id].id_fin_transfer = 0;
                                                                off_fin_transfer[cd_ft_id].id_omega = ClientId;

                                                                delete off_fin_transfer[cd_ft_id].ID;
                                                                delete off_fin_transfer[cd_ft_id].fl_actionOff;
                                                                delete off_fin_transfer[cd_ft_id].ts_control;
                                                            }

                                                            var defFinTransfer = $.Deferred();
                                                            SyncOff_InsertonData(off_fin_transfer, 'fin_transfer', defFinTransfer);

                                                            defFinTransfer.promise().done(function () {


                                                                for (cd_opd_id in off_operation_detail) {
                                                                    var cp_opd_operation_id = on_operation.filter(function (el) { return el[0] == off_operation_detail[cd_opd_id].id_pdv_operation });
                                                                    off_operation_detail[cd_opd_id].id_pdv_operation = (cp_opd_operation_id.length > 0 ? cp_opd_operation_id[0][1] : null);

                                                                    off_operation_detail[cd_opd_id].id_pdv_operation_detail = 0;
                                                                    off_operation_detail[cd_opd_id].id_omega = ClientId;

                                                                    delete off_operation_detail[cd_opd_id].ID;
                                                                    delete off_operation_detail[cd_opd_id].fl_actionOff;
                                                                    delete off_operation_detail[cd_opd_id]._ds_payment_type;
                                                                    delete off_operation_detail[cd_opd_id]._ds_pdv_operation;
                                                                    delete off_operation_detail[cd_opd_id]._ds_pdv_operation_detail;
                                                                    delete off_operation_detail[cd_opd_id].ts_control;
                                                                }

                                                                SyncGetDataOn({ d: off_operation_detail }, 'Pdv_Operation_Detail', 'InsertData', true).done(function (pdv_operation_detail_return) {


                                                                    SyncGetDataOff(off_filter, 'fin_entry', 'ListData', false).done(function (fin_entry_list) {
                                                                        fin_entry_list = eval(fin_entry_list);

                                                                        for (fe_id in fin_entry_list) {
                                                                            var cp_fe_operation_id = on_operation.filter(function (el) { return el[0] == fin_entry_list[fe_id].ds_nu_document });
                                                                            fin_entry_list[fe_id].ds_nu_document = (cp_fe_operation_id.length > 0 ? cp_fe_operation_id[0][1] : null);

                                                                            fin_entry_list[fe_id].id_fin_entry = 0;
                                                                            fin_entry_list[fe_id].id_omega = ClientId;

                                                                            delete fin_entry_list[fe_id].ID;
                                                                            delete fin_entry_list[fe_id].fl_actionOff;
                                                                            delete fin_entry_list[fe_id]._ds_fin_account
                                                                            delete fin_entry_list[fe_id]._ds_fin_entry_type
                                                                            delete fin_entry_list[fe_id]._ds_fin_account_management
                                                                            delete fin_entry_list[fe_id]._ds_payment_type
                                                                            delete fin_entry_list[fe_id]._ds_fin_billet
                                                                            delete fin_entry_list[fe_id].ts_control;
                                                                        }

                                                                        SyncGetDataOn({ d: fin_entry_list }, 'fin_entry', 'InsertData', true).done(function (fin_entry_return) {
                                                                            if (on_coupon.length > 0) {
                                                                                $(on_coupon).each(function (i_fe) {
                                                                                    PDVStockMove(on_coupon[i_fe][1]).done(function () {
                                                                                        if (i_fe == (on_coupon.length - 1)) defSyncOff.resolve(true);
                                                                                    });
                                                                                });
                                                                            }
                                                                            else {
                                                                                defSyncOff.resolve(true);
                                                                            }

                                                                        });

                                                                    });

                                                                });

                                                            });

                                                        });

                                                    });

                                                });

                                            });

                                        });

                                    });

                                });

                            });

                        });

                    });

                });

            });

        } else {
            defSyncOff.resolve(true);
        }

    });

    return defSyncOff.promise();
};

GoOnLine = function (e) {
    $('#connect').fadeIn('slow');
    $('#active-modeoffline').hide();
    $('header, #wizard, body, footer').css('background', '#E0E0E0');
    $('#barra').css('background', '#3F3C3C');

    $('body').loader({ imgUrl: 'img/sync.gif' });
    setTimeout(function () {
        SyncOnlineData();
    }, 1000);
};

GoOffLine = function (e) {

    $('.headerFirstPart .fl').append('<div class="headerOffline">OPERANDO EM MODO OFFLINE</div>');

    var ls = localStorage["LastSyncData_" + String(GetClientId())];
    if (!$.epar(ls)) {
        Mktup.alertModal('Sincronia pendente.<br><br>Para utilizar o sistema offline é necessário que você tenha feito ao menos uma sincronia de dados.');
        Mktup.Navigate('login');
        return false;
    }

    //    else {
    //        location.reload(true);
    //    }
};


//FileSystem
OmegaFile = function () {

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    var fs = null;
    var _instance = this;

    this.checkQuota = function () {

        var deferred = $.Deferred();
        window.webkitStorageInfo.requestQuota(PERSISTENT, 1024 * 1024 * 1024 * 1024,
            function (bytes) {
                deferred.resolve(bytes);
            },
            function (e) {
                deferred.resolve(e);
            }
         );

        return deferred.promise();
    }

    this.getFS = function (bytes) {

        var deferred = $.Deferred();

        window.requestFileSystem(PERSISTENT, bytes,
            function (fs) { deferred.resolve(fs) },
            function (e) { deferred.resolve(e) }
        );

        return deferred.promise();

    }

    this.onInitFS = function (callback) {

        var deferred = $.Deferred();

        _instance.checkQuota().done(function (bytes) {
            if (_instance.noError(bytes)) {

                _instance.getFS(bytes).done(function (fs) {
                    if (_instance.noError(fs)) {

                        deferred.resolve(fs);
                    } else {

                        deferred.resolve(null);

                    }
                });
            } else {
            }
        });

        return deferred.promise();
    }


    this.noError = function (a) {
        return (a && (!a.code));
    }


    this.CreateSingleDir = function (rootDirEntry, folder_name) {

        var deferred = $.Deferred();

        rootDirEntry.getDirectory(folder_name, { create: true },
            function (dirEntry) {
                deferred.resolve(dirEntry);
            },
            function (e) {
                deferred.resolve(null);
            }
        );

        return deferred.promise();

    }

    this.createDir = function (rootDirEntry, folders) {

        if (folders.constructor != Array) {
            folders = folders.toString().replace(':', '').replace(/\\/g, '/');
            if (folders[folders.length - 1] == '/') folders = folders.substr(0, folders.length - 1);
            folders = folders.split('/');
        }

        var deferredDir = $.Deferred();

        SyncCreateDir(rootDirEntry, folders, deferredDir);

        return deferredDir.promise();
    }

    SyncCreateDir = function (rootDirEntry, folders, deferredDirInt) {

        rootDirEntry.getDirectory(folders[0], { create: true }, function (dirEntry) {
            // Recursively add the new subfolder (if we still have another to create).
            if (folders.length) {
                SyncCreateDir(dirEntry, folders.slice(1), deferredDirInt);
            } else {
                deferredDirInt.resolve(dirEntry);
            }
        },
            function () {
                deferredDirInt.resolve(false);
            }
       );

    }

    this.getFile = function (dirEntry, file) {
        var deferred = $.Deferred();

        dirEntry.getFile(file, { create: true }, function (fileEntry) {
            deferred.resolve(fileEntry);
        }, function (e) { deferred.resolve(null) });

        return deferred.promise();
    }


    this.WriteFile = function (file_path, dataBlob, func_callback) {

        _instance.SyncWriteFile(file_path, dataBlob).done(function (ret) { func_callback(ret) });
    }

    this.SyncWriteFile = function (file_path, dataBlob) {

        var mainDeferred = $.Deferred();

        file_path = file_path.toString().replace(':', '').replace(/\\/g, '/');
        if (!$.epar(dataBlob)) dataBlob = '';

        if (window.webkitStorageInfo) {

            if (typeof (dataBlob) == 'string') dataBlob = new Blob([dataBlob], { type: "text/plain" });

            file_path = file_path.split('/');

            var file = file_path[file_path.length - 1];
            file_path.pop();
            var folders = file_path;

            _instance.onInitFS().done(function (fs) {

                if (_instance.noError(fs)) {


                    _instance.createDir(fs.root, folders).done(function (dirEntry) {
                        if (_instance.noError(dirEntry)) {

                            _instance.getFile(dirEntry, file).done(function (fileEntry) {

                                if (_instance.noError(fileEntry)) {

                                    fileEntry.createWriter(function (fileWriter) {

                                        fileWriter.seek(fileWriter.length); // Start write position at EOF.
                                        fileWriter.onwriteend = function (e) {
                                            fileWriter.onwriteend = function () { mainDeferred.resolve(true) };
                                            fileWriter.write(dataBlob);
                                        }
                                        fileWriter.truncate(0);

                                    }, function (e) { mainDeferred.resolve(false) });

                                } else {
                                    mainDeferred.resolve(false);
                                }

                            });

                        } else {
                            mainDeferred.resolve(false);
                        }

                    });
                } else {
                    mainDeferred.resolve(false);
                }

            });

        } else {
            localStorage.removeItem(file_path);
            localStorage.setItem(file_path, dataBlob);
            mainDeferred.resolve(true);
        }

        return mainDeferred.promise();

    }


    this.ReadFile = function (file_path, callback) {
        _instance.SyncReadFile(file_path).done(function (ret) { callback(ret) });
    }

    this.SyncReadFile = function (file_path) {

        var mainDeferred = $.Deferred();

        file_path = file_path.toString().replace(':', '').replace(/\\/g, '/');

        if (window.webkitStorageInfo) {

            file_path = file_path.split('/');

            var file = file_path[file_path.length - 1];
            file_path.pop();
            var folders = file_path;

            _instance.onInitFS().done(function (fs) {
                if (_instance.noError(fs)) {

                    _instance.createDir(fs.root, folders).done(function (dirEntry) {
                        if (_instance.noError(dirEntry)) {

                            _instance.getFile(dirEntry, file).done(function (fileEntry) {

                                if (_instance.noError(fileEntry)) {

                                    // Get a File object representing the file,
                                    // then use FileReader to read its contents.
                                    // console.log('Sexta Chamada');
                                    fileEntry.file(function (file_ret) {

                                        var reader = new FileReader();
                                        reader.onloadend = function (e) {
                                            //console.log('Arquivo', this.result);
                                            mainDeferred.resolve(this.result)
                                        };
                                        reader.readAsText(file_ret);

                                    }, function (e) { mainDeferred.resolve(null) });
                                } else {
                                    mainDeferred.resolve(false);
                                }
                            });

                        } else {
                            mainDeferred.resolve(false);
                        }

                    });

                } else {
                    mainDeferred.resolve(false);
                }

            });
        } else {

            var result = localStorage.getItem(file_path);
            mainDeferred.resolve(result);

        }

        return mainDeferred.promise();
    }

    this.ClearDirectory = function (dir_path, callback) {
        _instance.SyncClearDirectory(dir_path, function (ret) { callback(ret) });
    }

    this.SyncClearDirectory = function (dir_path) {

        var mainDeferred = $.Deferred();

        dir_path = dir_path.toString().replace(':', '').replace(/\\/g, '/');
        if (dir_path[dir_path.length - 1] == '/') dir_path = dir_path.substr(0, (dir_path.length - 1));
        dir_path = dir_path.split('/');


        _instance.onInitFS().done(function (fsEntry) {

            if (_instance.noError(fsEntry)) {

                _instance.createDir(fsEntry.root, dir_path).done(function (dirEntry) {

                    if (_instance.noError(dirEntry)) {

                        dirEntry.removeRecursively(function () { mainDeferred.resolve(true) }, function () { mainDeferred.resolve(false) });

                    } else {
                        mainDeferred.resolve(false);
                    }

                });
            } else {
                mainDeferred.resolve(false);
            }


        });

        return mainDeferred.promise();
    }

    this.RemoveFile = function (file_path, callback) {
        _instance.SyncRemoveFile(file_path).done(function (ret) { callback(ret) });
    }

    this.SyncRemoveFile = function (file_path) {

        var removeDeferred = $.Deferred();

        file_path = file_path.toString().replace(':', '').replace(/\\/g, '/');

        if (window.webkitStorageInfo) {

            file_path = file_path.split('/');

            var file = file_path[file_path.length - 1];
            file_path.pop();
            var folders = file_path;

            _instance.onInitFS().done(function (fs) {

                if (_instance.noError(fs)) {

                    _instance.createDir(fs.root, folders).done(function (dirEntry) {
                        if (_instance.noError(dirEntry)) {

                            _instance.getFile(dirEntry, file).done(function (fileEntry) {

                                if (_instance.noError(fileEntry)) {

                                    fileEntry.remove(function () { removeDeferred.resolve(true) }, function () { removeDeferred.resolve(false) });

                                } else {
                                    removeDeferred.resolve(false);
                                }

                            });

                        } else {
                            removeDeferred.resolve(false);
                        }

                    });

                } else {
                    removeDeferred.resolve(false);
                }

            });

        } else {
            localStorage.removeItem(file_path);
            removeDeferred.resolve(result);
        }

        return removeDeferred.promise();
    }

    var toArray = function (list) {
        return Array.prototype.slice.call(list || [], 0);
    }

    this.listResults = function (entries, mainDeferred) {

        entries.forEach(function (entry, i) {
            console.log(entry);
        });

        mainDeferred.resolve(true);
    }

    this.readFolder = function (dir_path, callback) {
        _instance.SyncReadFolder(dir_path).done(function (ret) { callback(ret) });
    }

    this.SyncReadFolder = function (dir_path) {

        var mainDeferred = $.Deferred();

        dir_path = dir_path.toString().replace(':', '').replace(/\\/g, '/');
        if (dir_path[dir_path.length - 1] == '/') dir_path = dir_path.substr(0, (dir_path.length - 1));
        dir_path = dir_path.split('/');

        _instance.onInitFS().done(function (fs) {
            if (_instance.noError(fs)) {

                var cDir = $.Deferred();
                _instance.createDir(fs.root, folders).done(function (dirEntry) {
                    if (_instance.noError(dirEntry)) {

                        var dirReader = dirEntry.createReader();
                        var entries = [];

                        // Call the reader.readEntries() until no more results are returned.
                        var readEntries = function () {
                            dirReader.readEntries(function (results) {
                                if (!results.length) {
                                    _instance.listResults(entries.sort(), mainDeferred);
                                } else {
                                    entries = entries.concat(toArray(results));
                                    readEntries();
                                }
                            }, function () { mainDeferred.resolve(false) });
                        };

                        readEntries(); // Start reading dirs.

                    } else {
                        mainDeferred.resolve(false);
                    }
                });
            } else {
                mainDeferred.resolve(false);
            }
        });

        return mainDeferred.promise();
    }

    this.errorHandler = function (e) {
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
        };

        console.log('Error: ' + msg);
    }
}

$(document).ready(function () {
    if (window.applicationCache) {

        window.removeEventListener('online', GoOnLine, false);
        window.addEventListener('online', GoOnLine, false);


        window.removeEventListener('offline', GoOffLine, false);
        window.addEventListener('offline', GoOffLine, false);
    }
});
