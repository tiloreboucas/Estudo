form_init = function () {

    var currentPage = Mktup.getTopRender(),
    currentPageRender = (currentPage.isSheet ? $('#sheet_container_' + currentPage.pageId) : $('section.MainSection')),
    panelRender = currentPageRender.find('div.pageMain'),
    pageButtons = currentPageRender.find('header div.actionBar div.buttonPanel'),
    formGroups = currentPage.pageFBP.Attribute_Groups,
    formSteps = currentPage.pageFBP.Steps;

    panelRender.empty();

    if (!$.epar(formSteps)) {
        var fake_step = {};
        fake_step.id_step = 0;
        fake_step.id_term = 0;
        fake_step.nu_order = 0;

        formSteps = [fake_step];
    }

    panelRender.loader();

    buildFormStructure(currentPage, panelRender, formGroups, formSteps).done(function () {

        loadFormData(currentPage, formGroups).done(function (load_fd_result) {

            setFormValues(currentPage, formGroups).done(function () {

                buildFormButtons(currentPageRender, currentPage, panelRender, formGroups);
                buildFormDatepickers(panelRender);
                buildFormAutoCompletes(panelRender);

                if (currentPage.pageFBP.FX.onRender) {
                    currentPage.pageFBP.FX.onRender().done(function () {

                        panelRender.loader('end');

                        //Instancia formvalidator
                        panelRender.formvalidator();

                        if (currentPage.isSheet) currentPageRender.dialog('open');

                        buildFormGrids(panelRender).done(function () {
                            if (currentPage.pageFBP.FX.onPostRender) currentPage.pageFBP.FX.onPostRender();
                        });

                    });
                } else {

                    panelRender.loader('end');

                    //Instancia formvalidator
                    panelRender.formvalidator();

                    if (currentPage.isSheet) currentPageRender.dialog('open');
                    buildFormGrids(panelRender).done(function () {
                        if (currentPage.pageFBP.FX.onPostRender) currentPage.pageFBP.FX.onPostRender();
                    });
                }

            });

        });

    });

};

buildFormStructure = function (currentPage, panelRender, formGroups, formSteps) {

    var defForm_buildFormStructure = new $.Deferred();
    var stepGroups = [];
    var markup = '';
    var total_space = 0;
    var next_space = 0;
    var groupFields = [];

    //Hidden Fields
    markup += '<div class="tabHideContent">';
    var hddFields = getFormFields(formGroups, true);

    for (var xxhddField in hddFields) {
        markup += buildField(currentPage, hddFields[xxhddField]);
    }
    markup += '</div>';

    //Render Each Step
    for (var x_step in formSteps) {

        stepGroups = [];
        for (var x_group in formGroups) {
            if ((formGroups[x_group].id_step * 1) == (formSteps[x_step].id_step * 1)) stepGroups.push(formGroups[x_group]);
        }

        markup += '<div class="tabContent ' + (x_step == 0 ? "ativo" : "ativo") + '" data-id_step="' + formSteps[x_step].id_step + '" >';

        for (var x_step_group in stepGroups) {

            if (!checkGroupHasFields(stepGroups[x_step_group].Attribute_Group_data)) continue;

            markup += '\t<article class="panelContent" data-id_attribute_group="' + stepGroups[x_step_group].id_attribute_group + '">\n';
            markup += '\t\t<header class="panelHeader"><h3>' + Mktup.translator(stepGroups[x_step_group].id_term_attribute_group) + '</h3></header>\n';

            if (stepGroups[x_step_group].Attribute_Group_data[0].ds_attribute_name.substr(0, 3) != 'ls_') {

                markup += '\t\t<div class="panelMain form">\n';
                markup += '\t\t\t<div class="container_32_form" >\n';

                total_space = 0;
                groupFields = stepGroups[x_step_group].Attribute_Group_data;

                for (var x_group_field in groupFields) {

                    if ((groupFields[x_group_field].id_field_type < 1) || (groupFields[x_group_field].id_field_type > 21)) continue;
                    next_space = ((groupFields[x_group_field].nu_field_size * 4) > (groupFields[x_group_field].nu_field_space * 4)) ? (groupFields[x_group_field].nu_field_size * 4) : (groupFields[x_group_field].nu_field_space * 4);

                    if ((total_space + next_space) > 32) {
                        total_space = next_space;
                        markup += '\t\t\t\t<div class="clear"></div>\n';
                    } else {
                        total_space += next_space;
                    }
                    markup += buildField(currentPage, groupFields[x_group_field]);

                }

                if (total_space != 0) markup += '\t\t\t\t<div class="clear"></div>\n';
                markup += '\t\t\t</div>\n';
                markup += '\t\t</div>\n';

            } else {
                markup += buildField(currentPage, stepGroups[x_step_group].Attribute_Group_data[0]);
            }
            markup += '\t</article>\n';
        }

        markup += '</div>';
    }

    panelRender.append(markup);

    defForm_buildFormStructure.resolve(true);

    return defForm_buildFormStructure.promise();

};

checkGroupHasFields = function (oGroup) {

    for (var xx_g_field in oGroup) {
        if (((oGroup[xx_g_field].id_field_type * 1) > 0) && ((oGroup[xx_g_field].id_field_type * 1) < 22)) return true;
    }

    return false;
};

getFormFields = function (formGroups, bHidden) {
    var arrHiddenFields = [];
    var xxx_currenGroup = null;

    for (var xxxGroup in formGroups) {
        xxx_currenGroup = formGroups[xxxGroup].Attribute_Group_data;

        for (var xxx_g_field in xxx_currenGroup) {
            if ((!bHidden) || (((xxx_currenGroup[xxx_g_field].id_field_type * 1) < 1) || ((xxx_currenGroup[xxx_g_field].id_field_type * 1) > 21))) arrHiddenFields.push(xxx_currenGroup[xxx_g_field]);
        }
    }

    return arrHiddenFields
};

buildFormDMDatepickers = function () {

};

buildFormDatepickers = function (panelRender) {



    panelRender.find(".datepicker").datepicker({
        beforeShow: function (i) { if ($(i).attr('readonly')) { return false; } },
        dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        numberOfMonths: 2,
        dateFormat: "dd/mm/yy",
        dayNames: Mktup.dayNames,
        dayNamesMin: Mktup.dayNamesMin,
        dayNamesShort: Mktup.dayNamesShort,
        monthNames: Mktup.monthNames,
        monthNamesShort: Mktup.monthNamesShort,
        nextText: Mktup.translator(10659),
        prevText: Mktup.translator(10660),
        currentText: Mktup.translator(10566)
    });

};

buildFormCustomRadios = function () {

};

buildFormGrids = function (panelRender, gridToRender) {


    var defForm_buildFormGrids = new $.Deferred();

    var arrGrids = ($.epar(gridToRender) ? [gridToRender] : panelRender.find('div.panelMain.form.grid, div.panelMain.form.formgrid'));

    if (arrGrids.length > 0) {
        buildFormGrid(arrGrids, 0, null).done(function () { defForm_buildFormGrids.resolve(true); });
    } else {
        defForm_buildFormGrids.resolve(true);
    }

    return defForm_buildFormGrids.promise();
};

buildFormGrid = function (arrGrids, gridCurrentId, defForm_buildFormGrid) {

    if (!defForm_buildFormGrid) defForm_buildFormGrid = new $.Deferred();

    grid_init($(arrGrids[gridCurrentId])).done(function (bfg_id) {

        if (gridCurrentId == (arrGrids.length - 1)) {
            defForm_buildFormGrid.resolve(true);
        } else {
            gridCurrentId++;
            buildFormGrid(arrGrids, gridCurrentId, defForm_buildFormGrid);
        }
    });

    return defForm_buildFormGrid.promise()
};

buildFormCustomSelect = function (fields) {
    for (var el = 0; el < fields.length; el++) {
        $(fields[el]).customselect().customselect("onOpen", function () { loadFormCustomSelectData($(this.container.context)); });
    }
};

buildFormButtons = function (currentPageRender, currentPage, panelRender, formGroups) {

    var saveFunction = function () {

        var bt_save = $(this);
        bt_save.loader();
        saveForm(currentPage, formGroups).done(function (save_result) {

            //Tratamento para Modais
            if (currentPage.isSheet) {
                if (save_result) {
                    setFormParentValues(currentPage).done(function () {
                        bt_save.dialog("close");
                    });
                } else {
                    bt_save.loader('end');
                    return false;
                }
            } else {
                setFormNotification(save_result, panelRender);

                if (save_result > 0) {
                    setFormValues(currentPage, formGroups).done(function () {
                        bt_save.loader('end');
                    });
                } else {
                    bt_save.loader('end');
                }
            }

        });
    };

    if (currentPage.isSheet) {

        var arrButtons = [];

        arrButtons.push({
            text: "Salvar",
            click: saveFunction
        });

        arrButtons.push({
            text: "Cancelar",
            'class': "btCancel",
            click: function () {
                $(this).dialog("close");
            }
        });

        currentPageRender.dialog({ buttons: arrButtons });

    } else {

        var markup = '';
        markup += '<div class="notificationBar">\n';
        markup += '    <div class="buttonPanel">\n';
        markup += '        <button type="button" class="actionButton addActionButton" title="Adicionar"></button>\n';
        //markup += '        <button type="button" class="actionButton copyActionButton"></button>\n';
        //markup += '        <button type="button" class="actionButton printActionButton" title="Imprimir"></button>\n';
        markup += '    </div>\n';
        markup += '	<div class="fr">\n';
        //markup += '		<button type="button" class="button mainButton" style="display:none;">Faturar</button>\n';
        markup += '		<button type="button" class="button mainButton" id="' + currentPage.pageEntity.toLowerCase().trim() + '§bt_save_form">Salvar</button>\n';
        markup += '	</div>\n';
        // markup += '    <div class="txt">\n';
        // markup += '        <p>Lorem ipsum dolor sit amet, consectetur</p>\n';
        // markup += '    </div>\n';
        markup += '    <div class="notification"><div class="ico"><span ></span></div><p></p></div>\n';
        markup += '	<div class="cb"></div>\n';
        markup += '</div>\n';

        panelRender.append(markup);
        $('#' + currentPage.pageEntity.toLowerCase().trim() + '§bt_save_form').unbind('click').bind('click', saveFunction);
    }
};

loadFormData = function (currentPage, formGroups) {

    var defLoadFormData = new $.Deferred();
    var bHasParent = ($.epar(currentPage.pageParentIdValue) || $.epar(currentPage.pageParentEntity));

    if (currentPage.pageCurrentValue > 0) {

        var pk_name = 'id_' + currentPage.pageEntity.trim().toLowerCase();
        var params = {}; params.d = {}; params.d.parameters = {};

        params.d.parameters[pk_name] = currentPage.pageCurrentValue;
        if (currentPage.isSheet && bHasParent && (!$.epar(currentPage.pageParentIdValue) || $.epar(currentPage.pageParentIdValue) == '0')) {

            currentPage.pageFormData = null;
            var parentData = Mktup.activePage.pageFormData;
            if (parentData['ls_' + currentPage.pageEntity.toLowerCase()]) {
                parentData = parentData['ls_' + currentPage.pageEntity.toLowerCase()];

                for (var z in parentData) {
                    if (parentData[z][pk_name] == currentPage.pageCurrentValue) {

                        currentPage.pageFormData = parentData[z];
                        defLoadFormData.resolve(true);
                    }
                }
            }

            if (!$.epar(currentPage.pageFormData)) {
                currentPage.pageFormData = getEmptyFormDataObject(getFormFields(formGroups, false));
                defLoadFormData.resolve(true);
            }

        } else {
            if ($.epar(currentPage.pageParentIdValue) && $.epar(currentPage.pageParentEntity)) params.d.parameters['id_' + currentPage.pageParentEntity.toLowerCase()] = currentPage.pageParentIdValue * 1;

            SyncGetDataOn(params, currentPage.pageEntity, "ListData", false).done(function (load_fd_result) {

                load_fd_result = eval('(' + load_fd_result + ')').d;
                if (load_fd_result.length > 0) {

                    var current_form_data = load_fd_result[0];
                    for (var attr_name in current_form_data) {

                        if (attr_name != attr_name.toLowerCase()) {
                            current_form_data[attr_name.toLowerCase()] = current_form_data[attr_name];
                            delete current_form_data[attr_name];
                        }

                    }

                    currentPage.pageFormData = current_form_data;
                }

                defLoadFormData.resolve(true);
            });
        }

    } else {
        if (!$.epar(currentPage.pageFormData)) currentPage.pageFormData = getEmptyFormDataObject(getFormFields(formGroups, false));
        currentPage.pageFormData['id_' + currentPage.pageEntity.toLowerCase().trim()] = 0;
        defLoadFormData.resolve(true);
    }

    return defLoadFormData.promise();
};

buildFormFieldFilterParameters = function (field_filter, that) {

    if (typeof (field_filter) != 'object') field_filter = eval(field_filter);

    var field_parameters = {};

    for (var a in field_filter) {
        if (field_filter[a].form_field) {

            var filter_entity = ($.epar(that.attr('data-main_entity')) ? that.attr('data-main_entity').toLowerCase() : that.attr('id').split('§')[0]);
            var currentFilter = $('#' + filter_entity + '§' + field_filter[a].form_field);

            if (currentFilter.size() > 1) currentFilter = $('#' + filter_entity + '§' + field_filter[a].form_field + ':checked');

            //ajuste átila 06/03/2013 para aceitar valores de filtro a partir de autocomplete!!
            var value = (currentFilter.hasClass('mktup_autocomplete') ? currentFilter.attr('data-id_value') : currentFilter.val());

            if ($.epar(value)) {
                if (!isNaN(value)) value = (value * 1);
                if (value == null) value = 0;
            } else {
                value = (field_filter[a].form_field.substr(0, 3) == 'ds' ? "$$ivolvex$$!**!$$ivolvex$$" : 0);
            }

            if (field_filter[a].search_field) {
                field_parameters[field_filter[a].search_field] = value;
            } else {
                field_parameters[field_filter[a].form_field] = value;
            }

        } else {
            var custom_value = field_filter[a].custom_value
            custom_value = (field_filter[a].custom_field.substr(0, 3) == 'ds' ? custom_value : (custom_value * 1));
            field_parameters[field_filter[a].custom_field] = custom_value;
        }
    }

    return field_parameters;

};

setFormFillerFields = function (filler_fields, that, data_object) {

    if (typeof (filler_fields) != 'object') filler_fields = eval(filler_fields);
    var filter_entity = ($.epar(that.attr('data-main_entity')) ? that.attr('data-main_entity').toLowerCase() : that.attr('id').split('§')[0]);

    for (var a in filler_fields) {
        var oField = $('#' + filter_entity + '§' + filler_fields[a].parent_field);
        var fieldvalue = data_object[filler_fields[a].child_field];

        if ($.epar(oField) && $.epar(fieldvalue)) {

            if (oField.size() > 1) {
                oField.removeAttr('checked');
                //-- Erro: Uncaught ReferenceError: currentPage is not defined  --
                //oField = $('#' + currentPage.pageEntity.toLowerCase().trim() + '§' + ag[b].ds_attribute_name + '[value="' + fieldvalue + '"]');
                oField = $('#' + Mktup.activePage.pageEntity.toLowerCase().trim() + '§' + filler_fields[a].parent_field + '[value="' + fieldvalue + '"]');
                oField.attr('checked', 'checked');
                oField.click();
                continue;
            }

            if (oField.hasClass('inputCheckbox')) {
                if (fieldvalue * 1) oField.attr("checked", true);
            } else if (oField.hasClass('customselect')) {
                oField.customselect('setValue', fieldvalue);
            } else if (oField.hasClass('textsearch') || oField.hasClass('mktup_autocomplete')) {
                oField.attr('data-id_value', fieldvalue);
                oField.val(data_object[getFormFieldDescritorName(data_object, filler_fields[a].child_field)]);
            } else {
                if ((oField[0]) && (oField[0].tagName == "SPAN")) {
                    oField.html(fieldvalue);
                } else {
                    oField.val(fieldvalue);
                }
            }
        }
    }
};

setFormValues = function (currentPage, formGroups) {

    var defSetFormValues = new $.Deferred();

    var aG = null;
    var oField = null;
    var isNewRecord = (!$.epar(currentPage.pageCurrentValue) || currentPage.pageCurrentValue * 1 == 0);
    var fieldvalue = null;

    for (var a = 0; a < formGroups.length; a++) {
        ag = formGroups[a].Attribute_Group_data;

        for (var b in ag) {

            oField = $('#' + currentPage.pageEntity.toLowerCase().trim() + '§' + ag[b].ds_attribute_name);

            if (oField.hasClass('customselect')) oField.customselect().customselect("onOpen", function () { loadFormCustomSelectData($(this.container.context)); });

            if ($.epar(oField) && ($.epar(currentPage.pageFormData[ag[b].ds_attribute_name]) || $.epar(oField.attr('data-default_value')))) {

                fieldvalue = ($.epar(currentPage.pageFormData[ag[b].ds_attribute_name]) ? currentPage.pageFormData[ag[b].ds_attribute_name] : oField.attr('data-default_value'));
                if (ag[b].ds_attribute_name.substr(0, 3) == 'dt_') {
                    fieldvalue = $.DbDateFormat(fieldvalue);
                } else if (ag[b].ds_attribute_name.substr(0, 3) == 'vl_') {
                    fieldvalue = moeda.formatar(fieldvalue);
                }

                oField.attr('data-original_value', (typeof (fieldvalue) == "string" ? fieldvalue.split('|')[0] : fieldvalue));

                if (oField.size() > 1) {
                    oField.removeAttr('checked');
                    oField = $('#' + currentPage.pageEntity.toLowerCase().trim() + '§' + ag[b].ds_attribute_name + '[value="' + fieldvalue + '"]');
                    oField.attr('checked', 'checked');
                    continue;
                }

                if (oField.hasClass('inputCheckbox')) {
                    if (fieldvalue * 1) oField.attr("checked", true);
                } else if (oField.hasClass('customselect')) {
                    if ($.epar(currentPage.pageFormData[ag[b].ds_attribute_name])) {
                        var cs_id = currentPage.pageFormData[ag[b].ds_attribute_name];
                        var cs_ds = currentPage.pageFormData[getFormFieldDescritorName(currentPage.pageFormData, ag[b].ds_attribute_name.substr(3))];

                        oField.val(cs_id);
                        oField.customselect('addNewItem', { id: cs_id, text: $.encodeCustomSelectItem(cs_ds) });
                    } else {
                        try {
                            var cs_values = fieldvalue.split('|');
                            oField.val(cs_values[0]);
                            oField.customselect('addNewItem', { id: cs_values[0], text: $.encodeCustomSelectItem(cs_values[1]) });
                        } catch (err) { }
                    }
                } else if (oField.hasClass('textsearch') || oField.hasClass('mktup_autocomplete')) {
                    if ($.epar(currentPage.pageFormData[ag[b].ds_attribute_name])) {
                        oField.attr('data-id_value', currentPage.pageFormData[ag[b].ds_attribute_name]);
                        oField.val((ag[b].ds_attribute_name.substr(0, 3) == 'ds_' ? currentPage.pageFormData[ag[b].ds_attribute_name] : currentPage.pageFormData[getFormFieldDescritorName(currentPage.pageFormData, ag[b].ds_attribute_name.substr(3))]));
                    } else {
                        try {
                            var ts_values = fieldvalue.split('|');
                            oField.attr('data-id_value', ts_values[0]);
                            oField.val(ts_values[1]);
                        } catch (err) { }
                    }
                } else {
                    if (oField.hasClass('currency')) moeda.desformatar(moeda.formatar(fieldvalue, true));

                    if ((oField[0]) && (oField[0].tagName == "SPAN")) {
                        oField.html(fieldvalue);
                    } else {
                        oField.val(fieldvalue);
                    }
                }
            }
        }

        if (a == (formGroups.length - 1)) {
            if ($.epar(currentPage.pageParentIdValue) && $.epar(currentPage.pageParentEntity)) {
                $('#' + currentPage.pageEntity.toLowerCase().trim() + '§id_' + currentPage.pageParentEntity.toLowerCase()).val(currentPage.pageParentIdValue);
            }

            $('input, textarea').not('[data-original_value]').not('.bypass').attr('data-original_value', '');

            defSetFormValues.resolve();
        }
    }

    return defSetFormValues.promise();
};

saveForm = function (currentPage, formGroups) {

    var defSaveForm = new $.Deferred();
    var form_entity_name = currentPage.pageEntity.toLowerCase().trim();

    //Validate Fields
    var currentPanel = Mktup.getCurrentPanelRender();
    currentPanel.formvalidator("validationGroup");

    if (!currentPanel[0].attr.valid) {
        defSaveForm.resolve(false);
        return defSaveForm.promise();
    }

    //Get Fields
    var aG = null;
    var oField = null;
    var fieldValue = '';

    for (var a = 0; a < formGroups.length; a++) {
        ag = formGroups[a].Attribute_Group_data;

        for (var b in ag) {

            if (ag[b].ds_attribute_name.substr(0, 3) == 'ls_') continue;

            oField = $('#' + form_entity_name + '§' + ag[b].ds_attribute_name);
            if (oField.size() > 1) oField = $('#' + form_entity_name + '§' + ag[b].ds_attribute_name + '[checked]');


            if (oField.hasClass('mktup_ckeditor')) {
                fieldValue = CKEDITOR.instances[oField.attr('data-ckeditor')].getData();
            } else if ($.epar(oField[0]) && oField[0].tagName == "SPAN") {
                fieldValue = oField.html();
            } else if (oField.hasClass('textsearch') || oField.hasClass('mktup_autocomplete')) {
                fieldValue = oField.attr('data-id_value');
            } else if (oField.hasClass('customradioToggle') || oField.hasClass('customradio')) {
                fieldValue = (oField.find('input[checked]').val().toString() == "true" ? 1 : 0);
            } else if (oField.hasClass('inputCheckbox')) {
                fieldValue = (oField.is(":checked") ? 1 : 0);
            } else if (ag[b].ds_attribute_name.substr(0, 3) == 'vl_') {
                fieldValue = moeda.desformatar(oField.val());
            } else {
                fieldValue = oField.val();
            }

            if (ag[b].ds_attribute_name.substr(0, 3) != 'ds_') {

                if (!$.epar(fieldValue) && $.epar(fieldValue) != '0') {
                    fieldValue = null;
                } else {

                    if (ag[b].ds_attribute_name.substr(0, 3) == 'dt_') {

                        var k = fieldValue.split('/');
                        //if (!$.epar(k[2])) k.push(new Date().getFullYear());
                        fieldValue = k[1] + '-' + k[0] + '-' + k[2];

                    } else {
                        fieldValue = fieldValue * 1;
                    }
                }
            }
            if (ag[b].ds_attribute_name.substr(0, 3) == 'id_' && fieldValue == 0) fieldValue = null;
            currentPage.pageFormData[ag[b].ds_attribute_name] = fieldValue;

            if (oField.hasClass('textsearch') || oField.hasClass('mktup_autocomplete')) {
                currentPage.pageFormData['_ds' + ag[b].ds_attribute_name.substr(2)] = oField.val();
            } else if (oField.hasClass('customselect')) {
                currentPage.pageFormData['_ds' + ag[b].ds_attribute_name.substr(2)] = oField.parents("div.customselect_main").find('div.customselect_label').html().trim();
            }

        }
    }

    //Chek PK
    if (!$.epar(currentPage.pageFormData['id_' + form_entity_name])) currentPage.pageFormData['id_' + form_entity_name] = 0;
    var FormEdit = (currentPage.pageFormData['id_' + form_entity_name] != 0);

    //Create DataObject 
    var FormDataObject = $.extend(true, {}, currentPage.pageFormData);

    delete FormDataObject.ts_control;
    delete FormDataObject.in_system;

    for (var attr_name in FormDataObject) {
        if ((attr_name.substr(0, 1) == '_') || (attr_name.substr(0, 3) == 'ls_')) delete FormDataObject[attr_name];
    }

    FormDataObject.id_omega = ClientId;
    currentPage.pageFormData.id_omega = ClientId;

    if (currentPage.isSheet && !$.epar(FormDataObject['id_' + currentPage.pageParentEntity])) {
        FormDataObject['id_' + currentPage.pageParentEntity] = currentPage.pageParentIdValue * 1;
    }

    //Save Object
    if (currentPage.isSheet && (($.epar(currentPage.pageParentIdValue) ? currentPage.pageParentIdValue : 0) == 0)) {
        if (!$.epar(Mktup.activePage.pageFormData['ls_' + form_entity_name])) Mktup.activePage.pageFormData['ls_' + form_entity_name] = [];
        var masterData = Mktup.activePage.pageFormData['ls_' + form_entity_name];
        if (!FormEdit) {
            currentPage.pageFormData.fl_action = 'I';
            currentPage.pageFormData['id_' + form_entity_name] = Number(new Date());
            masterData.push(currentPage.pageFormData);
            defSaveForm.resolve(true);
        } else {
            if (!currentPage.pageFormData.fl_action) currentPage.pageFormData.fl_action = 'U';

            for (var mit in masterData) {
                if (masterData[mit]['id_' + form_entity_name] * 1 == currentPage.pageFormData['id_' + form_entity_name] * 1) {
                    masterData[mit] = currentPage.pageFormData;
                    break
                }
            }
            defSaveForm.resolve(true);
        }

    } else {

        SyncGetDataOn({ d: [FormDataObject] }, form_entity_name, (FormEdit ? "UpdateData" : "InsertData"), false).done(function (save_form_return) {

            if (save_form_return > 0) {
                if (!FormEdit) currentPage.pageFormData['id_' + form_entity_name] = save_form_return;
                $('#' + form_entity_name + '§id_' + form_entity_name).val(save_form_return);

                var current_pk = currentPage.pageFormData['id_' + form_entity_name];
                currentPage.pageCurrentValue = current_pk * 1;

                if (currentPage.isSheet && Mktup.activePage.pageFormData) {
                    var masterData = Mktup.activePage.pageFormData['ls_' + form_entity_name];
                    if (masterData) {
                        if (!FormEdit) {
                            masterData.push(currentPage.pageFormData);
                        } else {

                            for (var mit in masterData) {
                                if (masterData[mit]['id_' + form_entity_name] * 1 == currentPage.pageFormData['id_' + form_entity_name] * 1) {
                                    masterData[mit] = currentPage.pageFormData;
                                    break
                                }
                            }

                        }
                    }
                }

                //Save Object Lists
                saveFormLists(currentPage, formGroups).done(function (save_fl_return) {
                    Mktup.saveInstance();
                    defSaveForm.resolve(save_fl_return);
                });
            } else {
                defSaveForm.resolve(save_form_return);
            }
        });
    }

    return defSaveForm.promise();
};

saveFormLists = function (currentPage, formGroups) {

    var defSaveFormLists = new $.Deferred();

    var arrFormListNames = [];

    for (var a = 0; a < formGroups.length; a++) {
        ag = formGroups[a].Attribute_Group_data;

        for (var b in ag) {

            if (ag[b].ds_attribute_name.substr(0, 3) != 'ls_') continue;
            if (ag[b].id_field_type != 8 && ag[b].id_field_type != 19) continue;

            arrFormListNames.push(ag[b].ds_attribute_name);
        }
    }

    if (arrFormListNames.length > 0) {
        saveFormList(currentPage, arrFormListNames, 0, defSaveFormLists);
    } else {
        defSaveFormLists.resolve(true);
    }

    return defSaveFormLists.promise();
};

saveFormList = function (currentPage, arrFormListNames, lsi, defSaveFormLists) {

    var currentList = null;
    var currentAction = '';
    var currentEntityName = '';

    var arrInsertIntens = [];
    var arrUpdateIntens = [];
    var arrDeleteIntens = [];

    currentList = currentPage.pageFormData[arrFormListNames[lsi]];
    currentEntityName = arrFormListNames[lsi].replace('ls_', '').toLowerCase().trim();

    if (!$.epar(currentList)) {
        if (lsi == (arrFormListNames.length - 1)) {
            defSaveFormLists.resolve(true);
        } else {
            lsi++;
            saveFormList(currentPage, arrFormListNames, lsi, defSaveFormLists);
        }
        return;
    }

    currentList = currentList.filter(function (el) { return $.epar(el.fl_action); })

    if (!$.epar(currentList) || currentList.length < 1) {
        if (lsi == (arrFormListNames.length - 1)) {
            defSaveFormLists.resolve(true);
        } else {
            lsi++;
            saveFormList(currentPage, arrFormListNames, lsi, defSaveFormLists);
        }
        return;
    }

    for (var ls_it in currentList) {
        currentAction = currentList[ls_it].fl_action;


        delete currentList[ls_it].fl_action;

        if (currentAction == 'D') {
            arrDeleteIntens.push(currentList[ls_it]['id_' + currentEntityName] * 1);
        } else if (currentAction == 'I') {
            currentList[ls_it]['id_' + currentEntityName] = 0;
            currentList[ls_it]['id_' + currentPage.pageEntity.toLowerCase().trim()] = currentPage.pageCurrentValue;
            arrInsertIntens.push(currentList[ls_it]);
        } else if (currentAction == 'U') {
            currentList[ls_it]['id_' + currentPage.pageEntity.toLowerCase().trim()] = currentPage.pageCurrentValue;
            arrUpdateIntens.push(currentList[ls_it]);
        }
    }

    var currentListId = lsi;
    doFormListAction(currentEntityName, "DeleteData", arrDeleteIntens, currentListId).done(function (doit_delete_return) {

        doFormListAction(currentEntityName, "InsertData", arrInsertIntens, currentListId).done(function (doit_insert_return) {

            doFormListAction(currentEntityName, "UpdateData", arrUpdateIntens, currentListId).done(function (doit_update_return) {

                lsi = doit_update_return;
                if (lsi == (arrFormListNames.length - 1)) {
                    defSaveFormLists.resolve(true);
                } else {
                    lsi++;
                    saveFormList(currentPage, arrFormListNames, lsi, defSaveFormLists);
                }

            });

        });

    });

};

doFormListAction = function (entityName, actionType, arrItens, currentId) {

    var doFormListAction = new $.Deferred();

    if (arrItens.length < 1) {
        doFormListAction.resolve(currentId);

    } else {

        var params = {}; params.d = {};
        if (actionType == "DeleteData") { params.d.ids = arrItens } else { params.d = arrItens };

        SyncGetDataOn(params, entityName, actionType, false).done(function (sgdo_result) {

            doFormListAction.resolve(currentId);

        });
    }


    return doFormListAction.promise();
};

setFormParentValues = function (currentPage) {

    var defSetFormParentValues = new $.Deferred();
    var sheetPage = currentPage;

    Mktup.activePage.pageSheets.pop();
    currentPage = Mktup.getTopRender();

    //Check if its source is a grid
    if ($.epar(sheetPage.pageParentGridId)) {
        grid_init($('#' + sheetPage.pageParentGridId)).done(function () {

            if (sheetPage.pageCloseCallback) {

                sheetPage.pageCloseCallback().done(function () {
                    defSetFormParentValues.resolve();
                });

            } else {
                defSetFormParentValues.resolve();
            }
        });
    } else {
        if (sheetPage.pageCloseCallback) {

            sheetPage.pageCloseCallback().done(function () {
                defSetFormParentValues.resolve();
            });

        } else {
            defSetFormParentValues.resolve();
        }
    }

    return defSetFormParentValues.promise();
};

getEmptyFormDataObject = function (arrFields) {

    var fdo = {};

    for (var fld in arrFields) {

        if (arrFields[fld].ds_attribute_name.substr(0, 1) != '_') {
            if (arrFields[fld].ds_attribute_name.substr(0, 3) == 'ls_') {
                fdo[arrFields[fld].ds_attribute_name] = [];
            } else {
                fdo[arrFields[fld].ds_attribute_name] = null;
            }

        }

    }

    return fdo;
};

loadFormCustomSelectData = function (currentSelect) {

    var defLoadFormCustomSelectData = new $.Deferred();

    var onAddFunction = null;
    var onChangeFunction = null;

    var select_entity = currentSelect.attr('id').split('§')[1].replace('id_', '').replace('_master', '');
    if ($.epar(currentSelect.attr('data-field_entity'))) select_entity = currentSelect.attr('data-field_entity');

    var return_data = '';
    var params = {}; params.d = {}; params.d.parameters = {};
    if ($.epar(currentSelect.attr('data-field_filter'))) params.d.parameters = buildFormFieldFilterParameters(currentSelect.attr('data-field_filter'), currentSelect);
    params.d.entity_name = select_entity;
    params.d.parameters.type_result = 'C';

    SyncGetDataOn(params, "Tools", "getCustomSelectData", false).done(function (load_cs_data_return) {

        load_cs_data_return = eval('(' + load_cs_data_return + ')').d;

        if (load_cs_data_return.length > 0) {

            var pk_name = 'id_' + select_entity;
            var ds_name = getFormFieldDescritorName(load_cs_data_return[0], select_entity);

            for (var x = 0; x < load_cs_data_return.length; x++) {
                return_data += (x > 0 ? ',' : '') + load_cs_data_return[x][pk_name] + '|' + $.encodeCustomSelectItem(load_cs_data_return[x][ds_name]);
            }

        }

        currentSelect.attr('data-overload', return_data);
        var cs_options = {};

        if (currentSelect.hasClass('add')) {

            onAddFunction = currentSelect.attr('data-on_add');
            onAddFunction = ($.epar(onAddFunction) ? eval(onAddFunction) : function () { saveForSimpleCustomSelectEntity($(this)); });
            cs_options.onClick = onAddFunction;

            currentSelect.customselect('onClick', cs_options.onClick);
        }

        onChangeFunction = currentSelect.attr('data-callback');
        if ($.epar(onChangeFunction)) {
            var me = ($.epar(currentSelect.attr('data-main_entity')) ? currentSelect.attr('data-main_entity').toLowerCase() : currentSelect.attr('id').split('§')[0]).toLowerCase();
            onChangeFunction = onChangeFunction.replace('fbp_' + me + '.', 'Mktup.getTopRender().pageFBP.');
            onChangeFunction = eval('(function () { ' + onChangeFunction + ' })');
            cs_options.onChange = onChangeFunction;

            currentSelect.customselect('onChange', cs_options.onChange);
        }

        if (cs_options.onClick) {
            currentSelect.customselect('refresh').customselect('createSearch');
        } else {
            currentSelect.customselect('refresh');
        }
        currentSelect.customselect('setValue', currentSelect.val());

        defLoadFormCustomSelectData.resolve(true);
    });

    return defLoadFormCustomSelectData.promise();
};

saveForSimpleCustomSelectEntity = function (CustomSelectAddButton) {


    var TextField = CustomSelectAddButton[0].search_input;

    TextField.msgbox({
        'type': 'erro',
        'msg': 'Informe um valor!',
        'autoShow': false
    });

    TextField.unbind('click').bind('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).msgbox('hide');
    });

    if (!$.epar(TextField.val())) {
        TextField.msgbox('show');
        return false;
    }

    TextField.msgbox('hide');

    var csEntity = CustomSelectAddButton[0].container.context.id.split('§')[1].replace('id_', '');
    var insObj = {};


    insObj['id_' + csEntity] = 0;
    insObj['ds_' + csEntity] = TextField.val();

    var mainInput = $('#' + CustomSelectAddButton[0].container.context.id);
    if ($.epar(mainInput.attr('data-field_filter'))) {

        var mainInput = $('#' + CustomSelectAddButton[0].container.context.id);
        var extraFields = buildFormFieldFilterParameters(mainInput.attr('data-field_filter'), mainInput);

        if ($.epar(extraFields)) $.extend(true, insObj, extraFields);
    }

    SyncGetDataOn({ d: [insObj] }, csEntity, "InsertData", false).done(function (insert_csentity_return) {

        var new_item = {};
        new_item.id = insert_csentity_return;
        new_item.text = TextField.val();

        $(CustomSelectAddButton[0].container.context).customselect('addNewItem', new_item).customselect('hideList');
        TextField.val('');

    });
};

buildFormAutoCompletes = function (panelRender) {

    var item_entity = '';
    var item_field = '';
    var arrAC = panelRender.find('.inputText.mktup_autocomplete');

    var setItemValue = function (that, event, ui, clearValue, setValue, doCallback) {

        if (ui.item) {
            if (setValue) that.val(ui.item.label);
            that.attr('data-id_value', ui.item.id);
        } else if (that.val().length >= 2) {
            that.removeAttr('data-id_value');
            if (clearValue) that.val('');
        } else {
            that.attr('data-id_value', '');
            if (clearValue) that.val('');
        }

        checkButton(that);

        var callback_func = that.attr('data-callback');
        if ($.epar(callback_func)) {
            var me = ($.epar(that.attr('data-main_entity')) ? that.attr('data-main_entity').toLowerCase() : that.attr('id').split('§')[0]);
            callback_func = callback_func.replace('fbp_' + me + '.', 'Mktup.getTopRender().pageFBP.');
            callback_func = eval('(function (p) { ' + callback_func + ' })');
        }

        if (doCallback) {

            if (ui.item && $.epar(that.attr('data-filler_fields'))) {
                var ff = eval(that.attr('data-filler_fields'));
                setFormFillerFields(ff, that, ui.item);
            }

            if ($.epar(callback_func)) { callback_func(ui, that); }
        }

    };

    var saveSimpleItem = function (that) {

        var defSaveSimpleItem = new $.Deferred();

        var text_field = that.parent().find('.inputText');
        var params = eval('(' + text_field.attr('data-autocomplete_parameters') + ')');
        var object = {};

        object['id_' + params.en] = 0;
        object['ds_' + params.en] = text_field.val();
        object.id_omega = ClientId;

        if ($.epar(text_field.attr('data-field_filter'))) {
            var pl = buildFormFieldFilterParameters(text_field.attr('data-field_filter'), text_field);
            if ($.epar(pl)) $.extend(true, object, pl);
        }

        SyncGetDataOn({ d: [object] }, params.en, "InsertData", false).done(function (insert_acentity_return) {

            if (insert_acentity_return) {
                text_field.attr('data-id_value', insert_acentity_return);
                text_field.val(object['ds_' + params.en]);
            } else {
                text_field.removeAttr('data-id_value');
            }

            defSaveSimpleItem.resolve(insert_acentity_return);

        });

        return defSaveSimpleItem.promise();
    };

    var checkButton = function (that) {
        if (that.hasClass('add')) {
            var bt = that.parents('label').find('button');
            if (that.attr('data-id_value') != undefined) {
                bt.hide();
            } else {
                bt.show();
            }
        }
    }


    if (arrAC.length > 0) {

        for (var item = 0; item < arrAC.length; item++) {

            var that = $(arrAC[item]);
            var params = {}; params.tr = 'C';

            //Build Entity Parameters
            if ($.epar(that.attr('data-field_entity'))) {
                item_entity = that.attr('data-field_entity').split('|');
                params.en = item_entity[0];
                params.fn = item_entity[1];

                if (item_entity.length > 2) params.tr = item_entity[2];
            } else if ($.epar(that.attr('id'))) {
                params.en = that.attr('id').split('§')[1].replace('id_', '');
            } else {
                continue;
            }

            if ($.epar(that.attr('data-field_filter'))) {
                var pl = buildFormFieldFilterParameters(that.attr('data-field_filter'), that);
                params = $.extend(true, params, pl);
            }

            that.attr('data-autocomplete_parameters', JSON.stringify(params));

            that.autocomplete({
                source: function (request, response) {
                    var term = request.term.toLowerCase(),
                        element = $(this.element),
                        cache = element.attr('data-autocompleteCache') || '',
                        foundInCache = false;

                    if ($.epar(cache)) {
                        var rx = new RegExp('"([^{]*' + term + '[^}]*)"', 'gi');
                        var tmp_results = '';
                        while (result = rx.exec(search_result)) { tmp_results += '{"' + result[1] + '"}§'; }
                        if ($.epar(tmp_results)) {
                            response(data);
                            return;
                        }
                    }

                    var queue_params = eval('(' + element.attr('data-autocomplete_parameters') + ')');
                    queue_params.q = term;

                    $.ajax({
                        url: AppPath + "/AutoComplete_DataEngine.aspx",
                        dataType: "json",
                        data: queue_params,
                        success: function (data) {
                            cache[term] = data;
                            element.data('autocompleteCache', cache);
                            response(data);
                        }
                    });
                },
                minLength: 2,
                search: function (event, ui) { /*console.log('search');*/setItemValue($(this), event, ui, false, false, false); },
                select: function (event, ui) { /*console.log('select'); */setItemValue($(this), event, ui, true, true, true); },
                change: function (event, ui) { /*console.log('change'); */if (!$(this).hasClass('saving')) { setItemValue($(this), event, ui, true, false, false); } else { $(this).removeClass('saving'); } }

            }).keydown(function (e) {
                var that = $(this);
                if (that.val().length < 3) that.attr('data-id_value', '');
                checkButton(that);
            });

            //BindAdd Button
            if (that.hasClass('add')) {
                var bt = that.parents('label').find('button');

                bt.unbind('click').bind('click', function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    var that = $(this);
                    var text_field = that.parent().find('.mktup_autocomplete');

                    text_field.addClass('saving');
                    text_field.loader();

                    var add_function = text_field.attr('data-on_add');
                    if ($.epar(add_function)) {
                        var me = ($.epar(text_field.attr('data-main_entity')) ? text_field.attr('data-main_entity').toLowerCase() : text_field.attr('id').split('§')[0]);
                        add_function = add_function.replace('fbp_' + me + '.', 'Mktup.getTopRender().pageFBP.');
                        add_function = eval('(function (p) { return ' + add_function + ' })');
                    } else {
                        add_function = saveSimpleItem;
                    }

                    add_function(that).done(function (add_result) {

                        checkButton(text_field);
                        text_field.loader('end');
                        text_field.focus();

                    });

                });
            }

        }
    }
};

getFormFieldDescritorName = function (sample_data, entity) {


    if (sample_data['ds_' + entity]) return 'ds_' + entity;
    if (sample_data['_ds_' + entity]) return '_ds_' + entity;
    return 'ds_' + entity;

};

setFormNotification = function (notification_type, panelRender, customText) {

    var nBar = panelRender.find('.notificationBar .notification');
    if (notification_type > 0) {

        nBar.find('.ico span').removeAttr('class').addClass('icoCheckMini');
        if ($.epar(customText))
            nBar.find('p').html(customText);
        else
            nBar.find('p').html('Dados salvos com sucesso!');

    } else {

        if (notification_type == -999) {
            nBar.find('.ico span').removeAttr('class').addClass('icoCautionMini');
            nBar.find('p').html('Dados protegidos pelo sistema! Você não pode alterar este registro.');
        } else {
            if (notification_type == -998) {//Deverá ser usado este codigo no retorno da procedure sempre que necessitar validar duplicação de campo UNIQUE diferente do ID
                nBar.find('.ico span').removeAttr('class').addClass('icoCautionMini');
                nBar.find('p').html('Já existe um registro com este nome.');
            } else {
                if (notification_type == -997) {//Deverá ser usado este codigo no retorno da procedure sempre que necessitar validar duplicação de campo UNIQUE diferente do ID
                    nBar.find('.ico span').removeAttr('class').addClass('icoCautionMini');
                    nBar.find('p').html('Código de barras já cadastrado!');
                } else {
                    nBar.find('.ico span').removeAttr('class').addClass('icoErrorMini');
                    if ($.epar(customText))
                        nBar.find('p').html(customText);
                    else
                        nBar.find('p').html('Problemas ao salvar! Verifique os dados e tente novamente.');
                }
            }
        }
    }

};