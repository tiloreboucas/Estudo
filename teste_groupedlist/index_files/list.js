list_init = function () {

    var currentPage = Mktup.getTopRender(),
    currentPageRender = (currentPage.isSheet ? $('#sheet_container_' + currentPage.pageId) : $('section.MainSection')),
    panelRender = currentPageRender.find('div.panelMain.form'),
    pageButtons = currentPageRender.find('header div.actionBar div.buttonPanel'),
    listFields = currentPage.pageFBP.Attribute_Groups,
    th_list_array = [];

    panelRender.loader();

    buildListTableHeader(panelRender, listFields, th_list_array).done(function (table_header_result) {

        if (currentPage.pageFBP.FX.onPreList) {

            currentPage.pageFBP.FX.onPreList().done(function () {

                populateListTable(currentPage, currentPageRender, panelRender, listFields, th_list_array, null, null, currentPage.pageDataPaging).done(function (populate_table_result) {
                    bindListNotificationBarButtons(currentPageRender);
                    panelRender.loader('end');
                });

            });
        } else {

            populateListTable(currentPage, currentPageRender, panelRender, listFields, th_list_array, null, null, currentPage.pageDataPaging).done(function (populate_table_result) {

                bindListNotificationBarButtons(currentPageRender);
                panelRender.loader('end');

            });
        }
        if (currentPage.isSheet) currentPageRender.dialog('open');
    });
};

buildListTableHeader = function (panelRender, listFields, th_list_array) {

    var defList_buildListTableHeader = new $.Deferred();

    var sortListColumns = function (x, y) { x = x.nu_list_order, y = y.nu_list_order; return ((x < y) ? -1 : ((x > y) ? 1 : 0)); };
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
    th_list_array.sort(sortListColumns);

    var markup = '';

    markup += '<div class="container_32">\n';
    markup += '<div class="grid_1"><span class="fieldTitle">&nbsp;</span></div>\n';

    for (var ix = 0; ix < th_list_array.length; ix++) {

        var add_class = '';

        if (th_list_array[ix].ds_attribute_name.substr(0, 3) == 'vl_') add_class = ' list_tar';
        if (th_list_array[ix].ds_attribute_name.substr(0, 3) == 'dt_') add_class = ' list_tac';

        if (th_list_array[ix].ds_attribute_name.substr(0, 4) == '_vl_') add_class = ' list_tar';
        if (th_list_array[ix].ds_attribute_name.substr(0, 4) == '_dt_') add_class = ' list_tac';

        var term_id = th_list_array[ix].id_term_attribute_name;
        var th_legend = Mktup.translator(term_id);
        markup += '<div class="grid_' + th_list_array[ix].col_size + '' + add_class + '"><label class="fieldContent"><span class="fieldTitle">' + th_legend + '</span></label></div>\n';
    }

    markup += '<div class="grid_3"><label class="fieldContent"><span class="fieldTitle">&nbsp;</span></label></div>\n';
    markup += '<div class="clear"></div>\n';
    markup += '</div>\n';

    markup += '<table class="container_32 table" cellpadding="0" cellspacing="0" border="0">\n';
    markup += '<tbody>\n';
    markup += '</tbody>\n';
    markup += '</table>\n';

    panelRender.append(markup);
    defList_buildListTableHeader.resolve(true);

    return defList_buildListTableHeader.promise();
};

populateListTable = function (currentPage, currentPageRender, panelRender, listFields, th_list_array, search_render, search_entity, paging) {
    //addListSpecialButtons();

    var defpopulateListTable = new $.Deferred();

    var entity = currentPage.pageEntity.toLowerCase();
    var tbody = '', thead = '';
    var values = '', return_fields = '', desc_name = '';

    var list_parameters = {}; list_parameters.d = {};
    var data_pagination = ($.epar(paging) ? paging : { "page": (1 * 1), "size": (currentPage.listPageSize * 1) });
    var data_filter = ($.epar(data_pagination.parameters) ? data_pagination.parameters : '');

    if ($.epar(data_pagination.fast_search)) {
        currentPageRender.find('.inputText.fieldSearch').val(data_pagination.fast_search);
    }

    currentPage.pageDataPaging = $.extend(true, {}, data_pagination);

    delete data_pagination.parameters;
    delete data_pagination.fast_search;

    //Define onde os registros serão renderizados
    if ($.epar(search_render)) {
        entity = search_entity;
        tbody = search_render.find('tbody:first');
        thead = search_render.find('thead:first');
    } else {
        tbody = panelRender.find('tbody:first');
        thead = panelRender.find('thead:first');
    }

    //Busca o filler_fields
    var filler_fields = getListFillerFields(currentPage, listFields, entity);

    //Monta field filter
    if (currentPage.isSheet) data_filter = getListFieldFilter(currentPage);

    //Se não for paginãção limpa a tabela
    if (data_pagination.page == 1) {
        tbody.empty();
        currentPage.pageListData = [];
    }

    if (th_list_array.length > 0) {
        if ($.epar(data_pagination)) list_parameters.d.paging = data_pagination;
        if ($.epar(data_filter)) list_parameters.d.parameters = data_filter;

        SyncGetDataOn(list_parameters, entity, "ListData", false).done(function (list_data_result) {

            list_data_result = eval(list_data_result);

            var markup = '';
            var columns = th_list_array;

            if (list_data_result.length > 0) {

                var _select = Mktup.translator(10680);
                var _update = Mktup.translator(10464);
                var _delete = Mktup.translator(10465);

                for (var x_row in list_data_result) {

                    currentPage.pageListData.push(list_data_result[x_row]);

                    var column_value = null,
                        column_name = '',
                        column_class = '',
                        column_align = 'left',
                        pk = list_data_result[x_row]['id_' + entity];

                    return_fields = '', desc_name = 'ds_' + entity;

                    if ($.epar(currentPage.pageCustomEntity)) desc_name = '_ds_' + currentPage.pageCustomEntity;
                    if (!list_data_result[x_row][desc_name]) desc_name = '_' + desc_name;
                    if (!list_data_result[x_row][desc_name]) desc_name = desc_name.replace('_ds', 'id');

                    if ($.epar(filler_fields)) {

                        filler_fields = eval(filler_fields);
                        for (var a in filler_fields) {
                            filler_fields[a].value = list_data_result[x_row][filler_fields[a].child_field];
                        }
                        return_fields = JSON.stringify(filler_fields).replace(/\"/gi, "'");
                    }

                    markup += '<tr data-id="' + pk + '" data-name="' + (list_data_result[x_row][desc_name]) + '" ' + ($.epar(return_fields) ? ' data-return_fields="' + return_fields + '" ' : '') + '>\n';
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

                        } else if (column_name.substr(0, 3) == 'dt_') {
                            //Verifica se é data
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
                        markup += '<td  class="grid_' + column_width + '" ><a style="text-align:' + column_align + ';" data-name="' + column_name + '"  data-title="' + column_value + '" ' + ($.epar(column_class) ? 'class="' + column_class + '"' : '') + ' >' + column_value + '</a></td>';
                    }


                    //Crud
                    markup += '<td class="grid_3"><div class="crud">';

                    if (currentPage.isSheet) markup += '<button type="button" class="selector" data-title="' + _select + '"></button>';
                    markup += '<button type="button" title="Editar" class="update" data-title="' + _update + '"></button>';
                    if ($.epar(currentPage.pagePermissions.in_delete) == 1) markup += '<button type="button" class="delete" title="Excluir" data-title="' + _delete + '"></button>';
                    markup += '</div></td>';
                    markup += '</tr>\n';

                }

                //Popula a tabela
                tbody.append(markup);

            } else if (data_pagination.page == 1) {
                //Popula a tabela sem registros
                markup += '<tr><td class="grid_32"><span>&nbsp;&nbsp;&nbsp;&nbsp;' + Mktup.translator(87) + '</span></td></tr>';
                tbody.append(markup);
            }

            //Verifica Paginação
            checkListPagination(currentPage, currentPageRender, panelRender, listFields, th_list_array, search_render, search_entity);
            bindListTableControls(currentPage, currentPageRender);


            if (currentPage.pageFBP.FX.onList) {

                currentPage.pageFBP.FX.onList().done(function () {
                    defpopulateListTable.resolve(true);
                });

            } else {
                defpopulateListTable.resolve(true);
            }

        });
    } else {

        bindListTableControls(currentPage, currentPageRender);
        defpopulateListTable.resolve(true);
    }

    return defpopulateListTable.promise();
};

bindListTableControls = function (currentPage, currentPageRender) {

    var buttonsRender = currentPageRender.find('div.panelMain.form table tbody');

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
        var tr = that.parents('tr');
        currentPage.renderType = 2; // form;
        currentPage.pageCurrentValue = tr.attr('data-id');
        currentPage.Render();
    });

    //Botão Delete
    buttonsRender.find('button.delete').unbind().bind('click', function () {
        var that = $(this);
        var tr = that.parents('tr');
        currentPage.deleteRecord(that, tr.attr('data-id'), tr.attr('data-name'), currentPage.pageEntity.toLowerCase().trim()).done(function (list_delrow_result) {
            if (list_delrow_result) {
                tr.remove();
            } else {
                Mktup.alertModal('Problemas ao excluir registro. Verifique os dados e tente novamente.');
            }

        });
    });
};

var getListFillerFields = function (currentPage, listFields, entity) {

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
};

var getListFieldFilter = function (currentPage) {

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
};

checkListPagination = function (currentPage, currentPageRender, panelRender, listFields, th_list_array, search_render, search_entity) {

    var pagingBar = currentPageRender.find('article.panelContent div.notificationBar');
    var pagingButton = pagingBar.find('#bt_more_data');

    pagingButton.loader();
    pagingBar.show();

    if (currentPage.pageDataPaging.page == 1) currentPageRender.find('.inputText.fieldSearch').focus();

    if (currentPage.pageListData.length < 1) {
        pagingBar.find('.txt p').html('');
        pagingButton.removeAttr('class').addClass('button').addClass('mainButton').addClass('disableButton');
        pagingButton.loader('end');
    } else {
        var actualRows = currentPage.pageListData.length;
        getTotalRecords(currentPage).done(function (ls_total) {
            var totalRows = ls_total * 1;

            if (actualRows < totalRows) {
                pagingBar.find('.txt p').html('Exibindo ' + actualRows + ' de ' + totalRows + ' registros.');
                pagingButton.removeAttr('class').addClass('button').addClass('mainButton');
                pagingButton.unbind('click').bind('click', function () {

                    var that = $(this);
                    that.loader();
                    currentPage.pageDataPaging.page++;
                    populateListTable(currentPage, currentPageRender, panelRender, listFields, th_list_array, search_render, search_entity, currentPage.pageDataPaging).done(function () {
                        that.loader('end');
                    });

                });

            } else {
                pagingBar.find('.txt p').html('Exibindo todos os ' + totalRows + ' registros.');
                pagingButton.removeAttr('class').addClass('button').addClass('mainButton').addClass('disableButton');
                pagingButton.unbind('click');
            }
            pagingButton.loader('end');
        });
    }
};

getTotalRecords = function (currentPage) {

    var defGetTotalRecords = new $.Deferred();

    if (!$.epar(currentPage.pageListTotalRecords)) {

        SyncGetDataOn({}, currentPage.pageEntity, "CountListData", false).done(function (total_rows_result) {
            total_rows_result = eval('(' + total_rows_result + ')').d;

            currentPage.pageListTotalRecords = total_rows_result.countListData;
            defGetTotalRecords.resolve(currentPage.pageListTotalRecords);

        });

    } else {
        defGetTotalRecords.resolve(currentPage.pageListTotalRecords);
    }

    return defGetTotalRecords.promise();
};

bindListNotificationBarButtons = function (currentPageRender) {

    var buttonBar = currentPageRender.find('article.panelContent div.notificationBar .buttonPanel');

    // Botão Adicionar Novo
    buttonBar.find('.actionButton.addActionButton').unbind('click').bind('click', function () {

        var panelRender = Mktup.getCurrentPanelRender();

        var bt_add = panelRender.parent().find('button.addNew');
        if (!bt_add.hasClass('disableButton')) bt_add.click();
    });

    // Botão Imprimir
    buttonBar.find('.actionButton.printActionButton').unbind('click').bind('click', function () {

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
                text: "Imprimir",
                'class': "btPrintModal",
                click: function () { $('#' + print_id).printElement(); return false; }
            }, {
                text: "Cancelar",
                'class': "btCancelModal",
                click: function () {
                    $(this).dialog("close");
                    $(this).dialog('destroy');
                    $('#' + print_id).remove();
                }
            }]
        });
        $(printBody).appendTo('#' + print_id);
    });


    // Botão Exportar
    buttonBar.find('.actionButton.exportActionButton').unbind('click').bind('click', function () {

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
            resizable: false,
            width: 450,
            modal: true,
            buttons: exportButtons
        });
    });
};

var exportFileList = function (render, type) {

    if ($.epar(render) && $.epar(type)) {
        var trs = render.find('.table').find('tr'),
                    page = AppPath + '/Export_Files_DataEngine.aspx',
                    name = $('.pageHGroup h2').text().trim(),
                    bodyList = render.clone(),
                    retorno = '',
			        headers = '',
                    contenters = '',
                    footers = '',
                    new_table = "";

        if (type == '.csv') {
            if (Mktup.activePage.pageEntity == "fin_entry") {
                //monta cabeçalho
                headers += 'Data;';
                headers += $('.panelMain .header .grid_5 .fieldTitle:first').text() + ';';
                headers += 'Observação;';
                headers += $('.panelMain .header .grid_6 .fieldTitle').text() + ';';
                headers += $('.panelMain .header .grid_3 .fieldTitle').text() + ';';
                headers += $('.panelMain .header .grid_5 .fieldTitle:last').text() + ';';
                headers = headers + '\r\n';

                //altera corpo
                var corpo = '';
                var tableList = bodyList.find('.panelMain.form .table');
                tableList.find('div.mov').each(function () {
                    var texto = $(this).find('.de').text() + '->' + $(this).find('.para').text();
                    $(this).replaceWith($.trim(texto));
                });
                tableList.find('div span').each(function () {
                    var texto = $(this).text();
                    $(this).replaceWith($.trim(texto));
                });
                tableList.find('tbody tr').each(function () {
                    $(this).find('div:first').remove();
                    $(this).find('div.crud').each(function () { $(this).parent().remove(); });
                    $(this).find('div:last').remove();
                });
                tableList.find('tr td div[class^="grid"]').each(function () {
                    var texto = $.trim($(this).text());
                    $(this).replaceWith('<td id="temp">' + $.trim(texto) + ';<td>');
                });

                //coleta informações
                tableList.find('tbody tr').each(function () {
                    var listItems = '';
                    listItems += $.trim($(this).parents('table').prev().find('span').text()) + ';';
                    listItems += $(this).find('#temp').text();
                    corpo += listItems + '\r\n';
                });

                headers += corpo;
                retorno = headers;

            } else {
                bodyList.find('.panelMain.form div label span:last').remove();
                bodyList.find('.panelMain.form div label span').each(function () { headers += $(this).text() + ';'; }); //monta cabeçalho
                headers = headers + '\r\n';

                var tableList = bodyList.find('.panelMain.form .table');
                tableList.find('tr').each(function () { $(this).find('td:first').remove(); });
                tableList.find('div.crud').each(function () { $(this).parent().remove(); });

                tableList.find('tr').each(function () { //Monta conteudo
                    var listItems = '';
                    $(this).find('td a').each(function () {
                        listItems += ($(this).text() == '&nbsp;' ? '' : $(this).text()) + ';';
                    });
                    contenters += listItems + '\r\n';
                });
                headers += contenters;
                retorno = headers;
            }
        } else {
            if (Mktup.activePage.pageEntity == "fin_entry") {
                //monta cabeçalho
                headers += '<td style="text-align: center ;">Data</td>';
                headers += '<td style="text-align: center ;">' + $('.panelMain .header .grid_5 .fieldTitle:first').text() + '</td>';
                headers += '<td style="text-align: center ;">Observação</td>';
                headers += '<td style="text-align: center ;">' + $('.panelMain .header .grid_6 .fieldTitle').text() + '</td>';
                headers += '<td style="text-align: center ;">' + $('.panelMain .header .grid_3 .fieldTitle').text() + '</td>';
                headers += '<td style="text-align: center ;">' + $('.panelMain .header .grid_5 .fieldTitle:last').text() + '</td>';
                headers = '<table border="1"><tr>' + headers + '</tr></table>';

                //altera corpo
                var tableList = bodyList.find('.panelMain.form .table');
                tableList.attr('border', '1');
                tableList.find('tbody tr td').each(function () {
                    $(this).find('div:first').remove();
                    $(this).find('div:first').parent().prepend('<span>' + $(this).parents('table').prev().find('span').text() + '</span>');
                });
                tableList.find('div.para').each(function () { $(this).before('<span> -> </span>'); });
                tableList.find('div.crud').each(function () { $(this).parent().remove(); });
                tableList.find('tr td div[class^="grid"]').each(function () {
                    var texto = $(this).text();
                    $(this).replaceWith('<td>' + texto + '</td>');
                });
                //tableList.prepend(headers);
                tableList.removeClass();
                retorno = '<html><head>' + headers + '</head><body>' + $($('<div></div>').append(tableList)).html() + '</body></html>';
            } else {
                bodyList.find('.panelMain.form div label span').each(function () { headers += '<td style="text-align: ' + ($(this).hasClass('currency') ? 'right' : 'left') + ';background-color: grey;">' + $(this).text() + '</td>'; }); //monta cabeçalho
                headers = '<thead><tr>' + headers + '</tr></thead>';
                var tableList = bodyList.find('.panelMain.form .table');
                tableList.find('tr').each(function () { $(this).find('td:first').remove(); });
                tableList.find('div.crud').each(function () { $(this).parent().remove(); });
                tableList.prepend(headers);
                tableList.find('thead tr td:last').remove();
                tableList.attr('border', '1');
                tableList.find("tbody tr:even").find('td').css("background-color", "lightgrey");
                tableList.find("tbody tr:odd").find('td').css("background-color", "white");
                retorno = '<html><head></head><body>' + $($('<div></div>').append(tableList)).html() + '</body></html>';
            }
        }

        $("body").append('<form id="exportform" action="' + page + '" method="post"><input type="hidden" id="exportdata" name="exportdata" /><input type="hidden" id="nameTable" name="nameTable" value="' + name + '" /><input type="hidden" id="extension" name="extension" value="' + type + '" /></form>');
        $("#exportdata").val(retorno);
        $("#exportform").submit().remove();

    } else { alertModal("Problemas. Contate o administrador do sistema!"); }
};