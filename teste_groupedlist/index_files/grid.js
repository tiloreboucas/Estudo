grid_init = function (gridContainer) {

    var defGrid_Init = new $.Deferred();

    var currentPage = Mktup.getTopRender();
    panelRender = gridContainer,
    th_list_array = [],
    grid_object_name = gridContainer.attr('id').split('§')[1],
    grid_entity = grid_object_name.substr(3);

    gridContainer.empty();
    gridContainer.loader();

    $.loadFBP(grid_entity).done(function (grid_fbp_result) {

        if (grid_fbp_result) {
            var listFields = grid_fbp_result.Attribute_Groups;

            buildGridTableHeader(panelRender, listFields, th_list_array, grid_entity).done(function (table_header_result) {

                populateGridTable(currentPage, panelRender, listFields, th_list_array).done(function (populate_table_result) {

                    if (grid_fbp_result.FX.onList) {

                        grid_fbp_result.FX.onList().done(function () {
                            gridContainer.loader('end');
                            if (panelRender.hasClass('formgrid')) panelRender.formvalidator({ bypass: true });
                            defGrid_Init.resolve(true);
                        });

                    } else {
                        gridContainer.loader('end');
                        if (panelRender.hasClass('formgrid')) panelRender.formvalidator({ bypass: true });
                        defGrid_Init.resolve(true);
                    }
                });


            });

        }

    });

    return defGrid_Init.promise();

};

buildGridTableHeader = function (panelRender, listFields, th_list_array, grid_entity) {

    var defGrid_buildGridTableHeader = new $.Deferred();

    var sortGridColumns = function (x, y) { x = x.nu_list_order, y = y.nu_list_order; return ((x < y) ? -1 : ((x > y) ? 1 : 0)); };
    var page = listFields;
    var col_size = 0;
    var field_name = '';
    var item = {};
    var nu_cols = 0;

    for (var a in page) {
        var field = page[a].Attribute_Group_data;

        for (var b in field) {
            if (nu_cols < 7) {

                field_name = field[b].ds_attribute_name;
                if ((field_name.substring(0, 3) != 'ls_') && (field_name.substring(0, 2) != 'm_')) {

                    col_size = ($.epar(field[b].in_list) ? field[b].in_list : 0);

                    if (col_size > 0) {

                        if ((nu_cols + col_size) > 7) col_size = (7 - nu_cols);
                        nu_cols = nu_cols + col_size;

                        item = {};

                        item.id_attribute = field[b].id_attribute;
                        item.id_field_type = field[b].id_field_type;
                        item.ds_attribute_name = field[b].ds_attribute_name;
                        item.id_term_attribute_name = field[b].id_term_attribute_name;
                        item.col_size = col_size * 4;
                        item.nu_list_order = ($.epar(field[b].nu_list_order) ? field[b].nu_list_order : 0) * 1;
                        item.field_values = ($.epar(field[b].field_values) ? JSON.stringify(field[b].field_values) : '');
                        item.filler_fields = (field[b].filler_fields) ? JSON.stringify(field[b].filler_fields).replace(/\"/g, "'") : '';
                        item.field_filter = (field[b].field_filter) ? JSON.stringify(field[b].field_filter).replace(/\"/g, "'") : '';
                        item.field_entity = (field[b].field_entity) ? field[b].field_entity : '';
                        item.list_main_field = ($.epar(field[b].list_main_field) ? 1 : 0);
                        item.default_search = field[b].default_search || '';

                        th_list_array.push(item);
                    }
                }
            } else {
                break;
            }
        }
    }

    if ((nu_cols < 7) && (th_list_array.length > 0)) th_list_array[(th_list_array.length - 1)].col_size += ((7 - nu_cols) * 4);
    th_list_array.sort(sortGridColumns);

    var markup = '';
    var hddFields = []; var allFields = [];
    var CurrentGrid = {}; CurrentGrid.pageEntity = grid_entity;


    if (panelRender.hasClass('formgrid')) {
        hddFields = getGridFields(listFields, true);
        allFields = getGridFields(listFields, false);

        markup += '<div class="tabHideContent">';
        for (var xxhddField in hddFields) {
            if ((hddFields[xxhddField].id_field_type * 1 < 1) || (hddFields[xxhddField].id_field_type * 1 > 21)) {
                hddFields[xxhddField].id_field_type = 0;
                markup += buildField(CurrentGrid, hddFields[xxhddField]);
            }
        }
        markup += '</div>';
    }

    markup += '<div class="container_32">\n';
    markup += '<div class="grid_1"><span class="fieldTitle">&nbsp;</span></div>\n';

    for (var ix = 0; ix < th_list_array.length; ix++) {

        var term_id = th_list_array[ix].id_term_attribute_name;
        var th_legend = Mktup.translator(term_id);


        if (panelRender.hasClass('formgrid') && (allFields.length > 0)) {
            var currentField = allFields.filter(function (el) { return el.ds_attribute_name == th_list_array[ix].ds_attribute_name; });
            if (currentField.length > 0) {
                markup += buildField(CurrentGrid, currentField[0]);
            }
        } else {
            var add_class = '';

            if (th_list_array[ix].ds_attribute_name.substr(0, 3) == 'vl_') add_class = ' list_tar';
            if (th_list_array[ix].ds_attribute_name.substr(0, 3) == 'dt_') add_class = ' list_tac';

            if (th_list_array[ix].ds_attribute_name.substr(0, 4) == '_vl_') add_class = ' list_tar';
            if (th_list_array[ix].ds_attribute_name.substr(0, 4) == '_dt_') add_class = ' list_tac';

            markup += '<div class="grid_' + th_list_array[ix].col_size + '' + add_class + '"><label class="fieldContent"><span class="fieldTitle">' + th_legend + '</span></label></div>\n';
        }

    }

    markup += '<div class="grid_3"><label class="fieldContent"><span class="fieldTitle">&nbsp;</span>';

    if (panelRender.hasClass('formgrid') && (allFields.length > 0)) markup += '<button id="' + panelRender.attr('id') + '§bt_grid_add" type="button" class="button mainButton">Incluir</button>';

    markup += '</label></div>\n';
    markup += '<div class="clear"></div>\n';
    markup += '</div>\n';

    markup += '<table class="container_32 table" cellpadding="0" cellspacing="0" border="0">\n';
    markup += '<tbody>\n';
    markup += '</tbody>\n';
    markup += '</table>\n';

    panelRender.append(markup);

    panelRender.find('[data-default_value]').each(function () {
        var that = $(this);
        that.val(that.attr("data-default_value"));
    });

    //Bypass Class
    panelRender.find('input, textarea').addClass('bypass');

    //Custom Selects
    panelRender.find('.customselect').each(function () {
        var oField = $(this);
        oField.customselect().customselect("onOpen", function () { loadFormCustomSelectData($(this.container.context)); });
    });

    defGrid_buildGridTableHeader.resolve(true);

    return defGrid_buildGridTableHeader.promise();
};


populateGridTable = function (currentPage, panelRender, listFields, th_list_array, search_render, search_entity, paging) {
    //addGridSpecialButtons();

    var defpopulateGridTable = new $.Deferred();

    var entity = panelRender.attr('id').split('§')[1].toLowerCase().trim().substr(3);
    var tbody = '', thead = '';
    var values = '', return_fields = '', desc_name = '';

    var list_parameters = {}; list_parameters.d = {};
    var data_pagination = ($.epar(paging) ? paging : { "page": (1 * 1), "size": (currentPage.listPageSize * 1) });
    var data_filter = '';

    //Define onde os registros serão renderizados
    if ($.epar(search_render)) {
        entity = search_entity;
        tbody = search_render.find('tbody:first');
        thead = search_render.find('thead:first');
    } else {
        tbody = panelRender.find('tbody:first');
        thead = panelRender.find('thead:first');
    }

    //Limpa a tabela
    tbody.empty();

    if (th_list_array.length > 0) {
        list_data_result = (currentPage.pageFormData[panelRender.attr('id').split('§')[1].toLowerCase().trim()]);

        var markup = '';
        var columns = th_list_array;

        if ($.epar(list_data_result) && (list_data_result.length > 0)) {

            var _select = Mktup.translator(10680);
            var _update = Mktup.translator(10464);
            var _delete = Mktup.translator(10465);

            for (var x_row in list_data_result) {

                if ((list_data_result[x_row]['fl_action']) && (list_data_result[x_row]['fl_action'] == 'D')) continue;
                var column_value = null,
                        column_name = '',
                        column_class = '',
                        column_align = 'left',
                        pk = list_data_result[x_row]['id_' + entity];

                return_fields = '', desc_name = 'ds_' + entity;

                if ($.epar(currentPage.pageCustomEntity)) desc_name = '_ds_' + currentPage.pageCustomEntity;
                if (!list_data_result[x_row][desc_name]) desc_name = '_' + desc_name;
                if (!list_data_result[x_row][desc_name]) desc_name = desc_name.replace('_ds', 'id');

                //                if ($.epar(filler_fields)) {

                //                    filler_fields = eval(filler_fields);
                //                    for (var a in filler_fields) {
                //                        filler_fields[a].value = list_data_result[x_row][filler_fields[a].child_field];
                //                    }
                //                    return_fields = JSON.stringify(filler_fields);
                //                }

                markup += '<tr data-id="' + pk + '" data-name="' + (list_data_result[x_row][desc_name]) + '" ' + ($.epar(return_fields) ? ' return_fields="' + return_fields + '" ' : '') + '>\n';
                markup += '<td class="grid_1">&nbsp;</td>\n';

                for (var i in columns) {
                    column_class = '';
                    column_align = 'left';
                    column_name = columns[i].ds_attribute_name;
                    column_width = columns[i].col_size;
                    column_value = list_data_result[x_row][column_name];

                    if ((column_name.substr(0, 3) == 'id_') && (column_name != 'id_' + entity)) {
                        //Verifica se é uma FK
                        column_value = ($.epar(list_data_result[x_row][column_name.replace('id_', '_ds_')]) ? list_data_result[x_row][column_name.replace('id_', '_ds_')] : column_value);

                    } else if (column_name.substr(0, 3) == 'in_') {
                        //Verifica se é check/radio
                        if ($.epar(columns[i].field_values)) {
                            values = eval(columns[i].field_values);
                            for (var h in values) {
                                if (column_value == values[h].value) {
                                    column_value = Mktup.translator(values[h].term);
                                    break;
                                }
                            }

                        } else {
                            column_value = (column_value == "0" ? 'Não' : 'Sim');
                        }

                    } else if ((column_name.substr(0, 3) == 'dt_') || (column_name.substr(0, 4) == '_dt_')) {
                        //Verifica se é data
                        column_align = 'center';
                        if ($.epar(column_value)) {
                            var tmp_date = column_value.split('-');
                            column_value = tmp_date[1] + '/' + tmp_date[0] + '/' + tmp_date[2];
                        }

                    } else if ((column_name.substr(0, 3) == 'vl_') || (column_name.substr(0, 3) == '_vl')) {
                        //Verifica se é valor
                        column_align = 'right';
                        if (column_value < 0) column_class = 'debit';
                        column_value = FormatMoeda("formatar", column_value)

                    } else if (column_name.substr(0, 3) == 'nu_') {
                        //Verifica se é numérico
                        if ($.epar(column_value)) column_value = NumFormat(column_value);
                    }

                    if (!$.epar(column_value)) column_value = '&nbsp;';
                    markup += '<td  class="grid_' + column_width + '" ><a style="text-align:' + column_align + ';" data-name="' + column_name + '"  data-title="' + column_value + '"  ' + ($.epar(column_class) ? 'class="' + column_class + '"' : '') + ' >' + column_value + '</a></td>';
                }


                //Crud
                markup += '<td class="grid_3"><div class="crud">';

                if (currentPage.isSheet) markup += '<button type="button" class="selector" data-title="' + _select + '"></button>';
                markup += '<button type="button" title="Editar" class="update" data-title="' + _update + '"></button>';
                if ($.epar(currentPage.pagePermissions.in_delete) == 1) markup += '<button type="button" title="Excluir" class="delete" data-title="' + _delete + '"></button>';
                markup += '</div></td>';
                markup += '</tr>\n';

            }

            //Popula a tabela
            tbody.append(markup);

        } else if (!$.epar(paging)) {
            //Popula a tabela sem registros
            markup += '<tr><td class="grid_32" ><span>&nbsp;&nbsp;&nbsp;' + Mktup.translator(87) + '</span></td></tr>';
            tbody.append(markup);
        }

        bindGridTableControls(currentPage, panelRender);
        buildGridButtons(currentPage, panelRender, listFields);

        if ($.epar(panelRender.attr('data-callback'))) {

            var me = ($.epar(panelRender.attr('data-main_entity')) ? panelRender.attr('data-main_entity').toLowerCase() : panelRender.attr('id').split('§')[0]).toLowerCase();
            var callbackFunction = panelRender.attr('data-callback').replace('fbp_' + me + '.', 'Mktup.getTopRender().pageFBP.');

            callbackFunction = eval('' + callbackFunction + '');
            callbackFunction().done(function () {
                if (panelRender.hasClass('formgrid')) panelRender.formvalidator({ bypass: true });
                defpopulateGridTable.resolve(true);
            });

        } else {
            if (panelRender.hasClass('formgrid')) panelRender.formvalidator({ bypass: true });
            defpopulateGridTable.resolve(true);
        }

    } else {

        bindGridTableControls(currentPage, panelRender);
        buildGridButtons(currentPage, panelRender, listFields);
        defpopulateGridTable.resolve(true);
    }

    return defpopulateGridTable.promise();
}


bindGridTableControls = function (currentPage, panelRender) {

    var buttonsRender = panelRender.find('table tbody');

    //Tds
    buttonsRender.find('td a[data-name]:not([data-external_link])').unbind().bind('click', function () {
        var that = $(this);
        var bt = that.parents('tr').find('button.update');
        bt.click();
    });

    //Botão Selecionar
    buttonsRender.find('button.selector').unbind().bind('click', function () {

    });

    //Botão Update
    buttonsRender.find('button.update').unbind().bind('click', function () {
        var that = $(this);
        var grid = that.parents('div.panelMain');
        var tr = that.parents('tr');
        var current_id = tr.attr('data-id') * 1;
        var add_bt = grid.find('#' + that.parents('div.panelMain').attr('id') + '§bt_grid_add');

        if (grid.hasClass('formgrid')) {
            var grid_entity = grid.attr('id').split('§')[1].substr(3);
            var currentGridData = Mktup.getTopRender().pageFormData['ls_' + grid_entity];
            var currentRow = null;

            for (var z in currentGridData) {
                if (currentGridData[z]['id_' + grid_entity] * 1 == current_id) {
                    currentRow = currentGridData[z];
                    break;
                }
            }

            if ($.epar(currentRow)) {
                for (var k in currentRow) {
                    var oField = grid.find('#' + grid_entity + '§' + k);
                    if ($.epar(oField)) {

                        if (oField.hasClass('customselect')) {

                            var cs_id = currentRow[k];
                            var cs_ds = currentRow[getFormFieldDescritorName(currentRow, k.replace('id_', ''))];

                            oField.val(cs_id);
                            oField.customselect('addNewItem', { id: cs_id, text: $.encodeCustomSelectItem(cs_ds) });

                        } else if (oField.hasClass('textsearch')) {
                            oField.attr('data-id_value', currentRow[k]);
                            oField.val(currentRow[getFormFieldDescritorName(currentRow, k.replace('id_', ''))]);
                        } else if (k.substr(0, 3) == 'dt_') {
                            oField.val($.DbDateFormat(currentRow[k]));
                        } else if (k.substr(0, 3) == 'vl_') {
                            oField.val(moeda.formatar(currentRow[k]))
                        } else {
                            oField.val(currentRow[k]);
                        }

                    }
                }
                //add_bt.attr('data-id_value', current_id);
                add_bt.html('Salvar');
            }

        } else {
            add_bt.attr('data-id_value', current_id);
            add_bt.click();
        }

    });

    //Botão Delete
    buttonsRender.find('button.delete').unbind().bind('click', function () {
        var that = $(this);
        var grid_entity = that.parents('div.panelMain').attr('id').split('§')[1].substr(3).toLowerCase().trim();
        var tr = that.parents('tr');
        currentPage.deleteRecord(that, tr.attr('data-id'), tr.attr('data-name'), grid_entity).done(function (cp_dr_result) {
            if (cp_dr_result) {

                //ajuste atila para evitar erro na exclusao de grid interno!!!
                currentPage.pageFormData['ls_' + grid_entity] = currentPage.pageFormData['ls_' + grid_entity].filter(function (el) { return el['id_' + grid_entity] != tr.attr('data-id') });

                var arrGrid = currentPage.pageFormData['ls_' + grid_entity];
                for (var k = 0; k < arrGrid.length; k++) {

                    if ((arrGrid[k]['id_' + grid_entity] * 1) == (tr.attr('data-id') * 1)) {
                        delete arrGrid[k];
                        break;
                    }
                }
                that.parents('tr').remove();
            } else {
                Mktup.alertModal('Problemas ao excluir registro. Verifique os dados e tente novamente.');
            }

        });
    });
}

var getGridFillerFields = function (currentPage, listFields, entity) {

    var filler_fields = '';

    if (currentPage.isSheet) {
        filler_fields = ($.epar(currentPage.pageParentFillerFields)) ? currentPage.pageParentFillerFields : '';
    } else {

        var fieldset = listFields;
        for (var x in fieldset) {
            for (var y in fieldset[x].Attribute_Group_data) {
                if (fieldset[x].Attribute_Group_data[y].ds_attribute_name == 'id_' + entity) {
                    filler_fields = fieldset[x].Attribute_Group_data[y].filler_fields;
                }
            }
        }

        filler_fields = ($.epar(filler_fields)) ? filler_fields : '';
    }

    return filler_fields;
}


var getGridFieldFilter = function (currentPage) {

    var data_filter = '';

    var field_filter = currentPage.pageFieldFilter,
            parent_group = currentPage.pageParentEntity;

    if ($.epar(field_filter)) {
        field_filter = eval(field_filter);
        data_filter = {};

        for (var a in field_filter) {
            if (field_filter[a].form_field) {
                var value = $('#' + parent_group + '§' + field_filter[a].form_field).val();
                if ($.epar(value)) {
                    if (!isNaN(value)) value = (value * 1);
                    if (value == null) value = 0;
                } else {
                    value = (field_filter[a].form_field.substr(0, 3) == 'ds' ? "$$ivolvex$$!**!$$ivolvex$$" : 0);
                }

                if (field_filter[a].search_field) {
                    data_filter[field_filter[a].search_field] = value;
                } else {
                    data_filter[field_filter[a].form_field] = value;
                }

            } else {
                var custom_value = field_filter[a].custom_value
                custom_value = (field_filter[a].custom_field.substr(0, 3) == 'ds' ? custom_value : (custom_value * 1));
                data_filter[field_filter[a].custom_field] = custom_value;
            }
        }
    }

    return data_filter;
}

getGridFields = function (formGroups, bHidden) {
    var arrHiddenFields = [];
    var xxx_currenGroup = null;

    for (var xxxGroup in formGroups) {
        xxx_currenGroup = formGroups[xxxGroup].Attribute_Group_data;

        for (var xxx_g_field in xxx_currenGroup) {
            if (bHidden) {
                if (((xxx_currenGroup[xxx_g_field].id_field_type * 1) < 1) || ((xxx_currenGroup[xxx_g_field].id_field_type * 1) > 21)) arrHiddenFields.push(xxx_currenGroup[xxx_g_field]);
            } else {
                if (((xxx_currenGroup[xxx_g_field].id_field_type * 1) > 0) || ((xxx_currenGroup[xxx_g_field].id_field_type * 1) < 22)) arrHiddenFields.push(xxx_currenGroup[xxx_g_field]);
            }
        }

    }

    return arrHiddenFields
};

buildGridButtons = function (currentPage, panelRender, listFields) {

    if (panelRender.hasClass('formgrid')) {

        $('#' + panelRender.attr('id') + '§bt_grid_add').unbind('click').bind('click', function () {

            var bt_save = $(this); bt_save.loader();
            var bt_save_names = bt_save.attr('id').split('§');

            var grid_entity = bt_save_names[1].substr(3);
            var parent_entity = bt_save_names[0];
            var grid = Mktup.getCurrentPanelRender().find('#' + parent_entity + '§ls_' + grid_entity);

            var parent_id_value = Mktup.getCurrentPanelRender().find('#' + parent_entity + '§id_' + parent_entity).val();

            grid.find('#' + grid_entity + '§id_' + parent_entity).val(parent_id_value);

            //Validate Fields
            panelRender.formvalidator("validationGroup", { bypass: true });

            if (panelRender[0].attr.valid) {

                saveFormGrid(currentPage, listFields, panelRender).done(function () {

                    grid_init(grid).done(function () {
                        //defSetFormParentValues.resolve();
                    });

                });
            } else {
                bt_save.loader('end');
            }

        });

    } else {
        panelRender.append('<div class="buttonArea"><div class="left"></div><div class="right"><button type="button" class="button defaultButton" id="' + panelRender.attr('id') + '§bt_grid_add">Incluir</button></div><div class="cb"></div></div>');
        $('#' + panelRender.attr('id') + '§bt_grid_add').unbind('click').bind('click', function () {

            var bt_save = $(this); bt_save.loader();
            var bt_save_names = bt_save.attr('id').split('§');

            var grid_entity = bt_save_names[1].substr(3);
            var parent_entity = bt_save_names[0];

            var params = {};

            params.pageParentGridId = bt_save_names[0] + '§' + bt_save_names[1]

            params.renderType = 2; // Form;            
            params.pageEntity = grid_entity;
            params.pageParentIdValue = currentPage.pageCurrentValue;
            params.pageParentEntity = parent_entity;
            params.showActionBar = "hide";

            params.pageCurrentValue = ($.epar(bt_save.attr('data-id_value')) ? bt_save.attr('data-id_value') * 1 : 0);
            bt_save.removeAttr('data-id_value');

            Mktup.buildSheet(params);

            bt_save.loader('end');

        });
    }
};

setFormGridFieldValue = function (field_name, field_value) {
};

saveFormGrid = function (currentPage, formGroups, currentGrid) {

    var defSaveFormGrid = new $.Deferred();

    var form_entity_name = currentPage.pageEntity.toLowerCase().trim();
    var grid_entity_name = currentGrid.attr('id').split('§')[1].substr(3);
    var gridFormData = {};

    //    //Validate Fields
    //    currentGrid.formvalidator("validationGroup");

    //    if (!currentGrid[0].attr.valid) {
    //        defSaveFormGrid.resolve(false);
    //        return defSaveFormGrid.promise();
    //    }

    //Get Fields
    var aG = null;
    var oField = null;
    var fieldValue = '';

    for (var a = 0; a < formGroups.length; a++) {
        ag = formGroups[a].Attribute_Group_data;

        for (var b in ag) {

            if (ag[b].ds_attribute_name.substr(0, 3) == 'ls_') continue;

            oField = currentGrid.find('#' + grid_entity_name + '§' + ag[b].ds_attribute_name);
            if (oField.size() > 1) oField = currentGrid.find('#' + grid_entity_name + '§' + ag[b].ds_attribute_name + '[checked]');
            fieldValue = (oField.hasClass('textsearch') ? oField.attr('data-id_value') : oField.val());

            if (ag[b].ds_attribute_name.substr(0, 3) != 'ds_') {

                if (!$.epar(fieldValue)) {
                    fieldValue = null;
                } else {

                    if (ag[b].ds_attribute_name.substr(0, 3) == 'dt_') {

                        var k = fieldValue.split('/');
                        //if (!$.epar(k[2])) k.push(k[2] = new Date().getFullYear());
                        fieldValue = k[1] + '-' + k[0] + '-' + k[2];

                    } else if (ag[b].ds_attribute_name.substr(0, 3) == 'vl_') {
                        fieldValue = moeda.desformatar(oField.val());
                    } else {
                        fieldValue = fieldValue * 1;
                    }
                }
            }
            gridFormData[ag[b].ds_attribute_name] = fieldValue;

            if (oField.hasClass('textsearch')) {
                gridFormData['_ds' + ag[b].ds_attribute_name.substr(2)] = oField.val();
            } else if (oField.hasClass('customselect')) {
                gridFormData['_ds' + ag[b].ds_attribute_name.substr(2)] = oField.parents('.customselect_container').find('div.customselect_label').html().trim();
            }
        }
    }

    //Chek PK
    if (!$.epar(gridFormData['id_' + grid_entity_name])) gridFormData['id_' + grid_entity_name] = 0;
    var FormEdit = (gridFormData['id_' + grid_entity_name] != 0);

    var parentValueId = Mktup.getTopRender().pageFormData['id_' + form_entity_name];
    parentValueId = ($.epar(parentValueId) ? parentValueId * 1 : 0);

    gridFormData['id_' + form_entity_name] = parentValueId;
    gridFormData.id_omega = ClientId;


    //Create DataObject 
    var FormDataObject = $.extend(true, {}, gridFormData);

    delete FormDataObject.ts_control;
    delete FormDataObject.in_system;

    for (var attr_name in FormDataObject) {
        if ((attr_name.substr(0, 1) == '_') || (attr_name.substr(0, 3) == 'ls_')) delete FormDataObject[attr_name];
    }

    //Save Object
    if (($.epar(parentValueId) ? parentValueId : 0) == 0) {

        if (!$.epar(Mktup.getTopRender().pageFormData['ls_' + grid_entity_name])) Mktup.getTopRender().pageFormData['ls_' + grid_entity_name] = [];
        var masterData = Mktup.getTopRender().pageFormData['ls_' + grid_entity_name];

        if (!FormEdit) {
            gridFormData.fl_action = 'I';
            gridFormData['id_' + grid_entity_name] = Number(new Date());
            masterData.push(gridFormData);
            defSaveFormGrid.resolve();
        } else {
            gridFormData.fl_action = 'U';

            for (var mit in masterData) {
                if (masterData[mit]['id_' + grid_entity_name] * 1 == gridFormData['id_' + grid_entity_name] * 1) {
                    masterData[mit] = gridFormData;
                    break
                }
            }
            defSaveFormGrid.resolve();
        }

    } else {
        SyncGetDataOn({ d: [FormDataObject] }, grid_entity_name, (FormEdit ? "UpdateData" : "InsertData"), false).done(function (save_formgrid_return) {

            if (!FormEdit) FormDataObject['id_' + grid_entity_name] = save_formgrid_return;

            var current_pk = FormDataObject['id_' + grid_entity_name];
            gridFormData['id_' + grid_entity_name] = current_pk * 1;

            var masterData = Mktup.getTopRender().pageFormData['ls_' + grid_entity_name];
            if (!FormEdit) {
                masterData.push(gridFormData);
            } else {

                for (var mit in masterData) {
                    if (masterData[mit]['id_' + grid_entity_name] * 1 == gridFormData['id_' + grid_entity_name] * 1) {
                        masterData[mit] = gridFormData;
                        break
                    }
                }

            }

            Mktup.saveInstance();
            defSaveFormGrid.resolve();

        });
    }

    return defSaveFormGrid.promise();


}
