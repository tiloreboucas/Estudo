//TODO: Movimentar Estoque

item_init = function () {

    var currentPage = Mktup.getTopRender(),
    currentPageRender = (currentPage.isSheet ? $('#sheet_container_' + currentPage.pageId) : $('section.MainSection')),
    panelRender = currentPageRender.find('div.pageMain'),
    pageButtons = currentPageRender.find('header div.actionBar div.buttonPanel');

    panelRender.loader();

    loadItemData(currentPage, panelRender).done(function (load_sod_result) {

        setItemValues(currentPage, panelRender).done(function (load_sod_result) {

            bindItemElements(panelRender, currentPage).done(function () {

                panelRender.loader('end');

                buildFormDatepickers(panelRender);
                buildFormAutoCompletes(panelRender);

                panelRender.formvalidator();

                calcItemPercMargin(false, panelRender, currentPage.pageFormData);
                getItemCurrentStock(panelRender);

                bindCkEditors();

                initPackagePreview(panelRender);

            });

        });

    });
};

bindCkEditors = function () {
    var editFields = $('span.mktup_ckeditor');
    var editFieldValue = '';

    for (var i = 0; i < editFields.length; i++) {
        editFieldValue = $(editFields[i]).text();
        $(editFields[i]).text('');
        var editor = CKEDITOR.appendTo(editFields[i].id, null, editFieldValue);
        $(editFields[i]).attr('data-ckeditor', editor.name);
    }
};

loadItemData = function (currentPage, panelRender) {

    var defLoadItemData = new $.Deferred();

    if (currentPage.pageCurrentValue > 0) {

        var pk_name = 'id_item';
        var params = {}; params.d = {}; params.d.parameters = {};

        params.d.parameters[pk_name] = currentPage.pageCurrentValue;

        SyncGetDataOn(params, "item", "ListData", false).done(function (load_sod_result) {

            load_sod_result = eval('(' + load_sod_result + ')').d;
            if (load_sod_result.length > 0) {

                var current_form_data = load_sod_result[0];
                for (var attr_name in current_form_data) {

                    if (attr_name != attr_name.toLowerCase()) {
                        current_form_data[attr_name.toLowerCase()] = current_form_data[attr_name];
                        delete current_form_data[attr_name];
                    }
                }

                current_form_data._vl_current_item_stock = null;
                currentPage.pageFormData = current_form_data;

                loadItemImages(currentPage.pageFormData.ls_item_image, panelRender);

                defLoadItemData.resolve(true);


            } else {

                defLoadItemData.resolve(true);
            }
        });

    } else {
        currentPage.pageFormData = {}
        currentPage.pageFormData.in_active = 1;
        currentPage.pageFormData.in_sevice = 0;
        currentPage.pageFormData.in_stock_moves = 0;
        currentPage.pageFormData.in_saleable = 0;
        currentPage.pageFormData.in_site = 0;
        currentPage.pageFormData.id_item_type = null;
        currentPage.pageFormData.vl_value = 0;
        currentPage.pageFormData.vl_item_cost = 0;

        currentPage.pageFormData.id_item_group = null;
        currentPage.pageFormData.id_item_subgroup = null;

        currentPage.pageFormData.id_item_unit = 1;
        currentPage.pageFormData._ds_item_unit = null;

        currentPage.pageFormData.id_brand = null;
        currentPage.pageFormData.ds_model = null;

        currentPage.pageFormData.id_item_subgroup = null;

        currentPage.pageFormData.ls_item_image = [];

        defLoadItemData.resolve(true);
    }

    return defLoadItemData.promise();
};

setItemValues = function (currentPage, panelRender) {

    var defSetItemValues = new $.Deferred();

    var aG = null;
    var oField = null;
    var isNewRecord = (!$.epar(currentPage.pageCurrentValue) || currentPage.pageCurrentValue * 1 == 0);
    var fieldvalue = null;

    for (var a in currentPage.pageFormData) {

        oField = panelRender.find('#item§' + a);

        // if ($.epar(oField) && typeof (oField) == 'object' && oField.lenght == 0) continue;

        if ($.epar(oField) && oField.hasClass('customselect')) {
            if (oField.hasClass('fixed')) {
                oField.customselect();
            } else {
                oField.customselect().customselect("onOpen", function () { loadFormCustomSelectData($(this.container.context)); });
            }
        }

        if ($.epar(oField) && ($.epar(currentPage.pageFormData[a]) || $.epar(oField.attr('data-default_value')))) {


            fieldvalue = ($.epar(currentPage.pageFormData[a]) ? currentPage.pageFormData[a] : oField.attr('data-default_value'));

            if (a.substr(0, 3) == 'dt_') {
                fieldvalue = $.DbDateFormat(fieldvalue);
            } else if (a.substr(0, 3) == 'vl_') {
                fieldvalue = moeda.formatar(fieldvalue);
            }

            oField.attr('data-original_value', fieldvalue);

            if (oField.size() > 1) {
                oField.removeAttr('checked');
                oField = $('#item§' + a + '[value="' + fieldvalue + '"]');
                oField.attr('checked', 'checked');
                continue;
            }

            if (oField.hasClass('inputCheckbox')) {
                if (fieldvalue * 1) oField.attr("checked", true);
            } else if (oField.hasClass('customselect')) {

                if (oField.hasClass('fixed')) {
                    if ($.epar(currentPage.pageFormData[a])) oField.customselect('setValue', currentPage.pageFormData[a]);
                } else if ($.epar(currentPage.pageFormData[a])) {
                    var cs_id = currentPage.pageFormData[a];
                    var cs_ds = currentPage.pageFormData[getFormFieldDescritorName(currentPage.pageFormData, a.replace('id_', ''))];

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
                if ($.epar(currentPage.pageFormData[a])) {
                    oField.attr('data-id_value', currentPage.pageFormData[a]);
                    oField.val(currentPage.pageFormData[getFormFieldDescritorName(currentPage.pageFormData, a.replace('id_', ''))]);
                } else {
                    try {
                        var ts_values = fieldvalue.split('|');
                        oField.attr('data-id_value', ts_values[0]);
                        oField.val(ts_values[1]);
                    } catch (err) { }
                }
            } else {
                if ((oField[0]) && (oField[0].tagName == "SPAN")) {
                    oField.html(fieldvalue);
                } else {
                    oField.val(fieldvalue);
                }
            }
        }

    }

    var arrMoney = panelRender.find('[id^="item§"].money');
    var m_field = null;
    var m_value = '';

    if (arrMoney.length > 0) {
        for (var m = 0; m < arrMoney.length; m++) {
            m_field = $(arrMoney[m]);
            m_value = ($.epar(m_field.val()) ? m_field.val() : 0);

            m_value = moeda.formatar(m_value);
            m_value = Mktup.getCurrentCurrency() + ' ' + m_value;

            m_field.val(m_value);
        }
    }


    defSetItemValues.resolve();

    return defSetItemValues.promise();
};


bindItemElements = function (panelRender, currentPage) {
    var defBindItemElements = $.Deferred();
    var currentData = currentPage.pageFormData;

    panelRender.find('#item§in_site').customradio({
        'onTrue': function () {

            var that = panelRender.find('#item§in_site');
            that.parent().parent().next().show();
            currentData.in_site = 1;

            if (moeda.desformatar($('#item§vl_value').val().replace('R$', '')) > 0 && $('#item§vl_site_price').val().length == 0) {
                $('#item§vl_site_price').val($('#item§vl_value').val());
            }

            if ($('#item§ds_item').val().length > 0 && $('#item§ds_item_site_name').val().length == 0) {
                $('#item§ds_item_site_name').val($('#item§ds_item').val());
            }

        },
        'onFalse': function () {

            var that = panelRender.find('#item§in_site');
            that.parent().parent().next().hide();
            currentData.in_site = 0;
        }
    });
    panelRender.find('#item§in_site').customradio('setValue', currentData.in_site == 1);

    panelRender.find('#item§in_stock_moves').customradio({
        'onTrue': function () {

            var that = panelRender.find('#item§in_stock_moves');
            that.parent().parent().next().show();
            currentData.in_stock_moves = 1;


        },
        'onFalse': function () {

            var that = panelRender.find('#item§in_stock_moves');
            that.parent().parent().next().hide();
            currentData.in_stock_moves = 0;
        }
    });
    panelRender.find('#item§in_stock_moves').customradio('setValue', currentData.in_stock_moves == 1);

    panelRender.find('#item§in_saleable').customradio({
        'onTrue': function () {

            var that = panelRender.find('#item§in_saleable');
            that.parent().parent().next().show();
            currentData.in_saleable = 1;

        },
        'onFalse': function () {

            var that = panelRender.find('#item§in_saleable');
            that.parent().parent().next().hide();
            currentData.in_saleable = 0;
        }
    });
    panelRender.find('#item§in_saleable').customradio('setValue', currentData.in_saleable == 1);

    panelRender.find('#item§in_featured').customradio({
        'onTrue': function () {

            var that = panelRender.find('#item§in_featured');
            that.parent().parent().next().show();
            currentData.in_featured = 1;
            $('.destaque').show();

        },
        'onFalse': function () {

            var that = panelRender.find('#item§in_featured');
            that.parent().parent().next().hide();
            currentData.in_featured = 0;
            $('.destaque').hide();

        }
    });
    panelRender.find('#item§in_featured').customradio('setValue', currentData.in_featured == 1);

    panelRender.find('div.especs li[data-index]').unbind('click').bind('click', function () {

        panelRender.find('div.especs').loader();
        var that = $(this);

        panelRender.find('div.especs li[data-index]').removeClass('active');
        panelRender.find('div.especs div[data-index]').hide();

        that.addClass('active');
        panelRender.find('div.especs div[data-index="' + that.attr('data-index') + '"]').show();

        panelRender.find('div.especs').loader('end');


    });

    panelRender.find('#item§stock§in_es').customselect();

    panelRender.find('#item§in_active').removeClass('required');
    panelRender.find('#item§in_active').parent().parent().removeClass('required');

    panelRender.find('#item§stock§bt_move').unbind('click').bind('click', function () {

        var that = $(this);
        if ($('#item§stock§vl_amount').val() == "") {
            $('#item§stock§vl_amount').focus();
            return false;
        }
        that.loader();

        saveItem(currentPage).done(function (si_result) {
            if (si_result && si_result>0) {
                panelRender.find('#item§id_item').html(currentPage.pageFormData.id_item);



                doItemStockMove(panelRender).done(function (movement_result) {
                    if (movement_result && $('#item§stock§in_es').val() != "") {
                        getItemCurrentStock(panelRender);
                        setFormNotification(1, panelRender, 'Movimentação de estoque realizada com sucesso!');
                        that.loader('end');
                    } else {
                        setFormNotification(0, panelRender, 'Não foi possível realizar a movimentação de estoque!');
                        that.loader('end');
                    }
                });

            } else {
                setFormNotification(si_result, panelRender);
                that.loader('end');
            }

        });

    });

    panelRender.find('#item§bt_goto_sale_order').unbind('click').bind('click', function () {

        var that = $(this);
        that.loader();
        var id_item = panelRender.find('#item§id_item');
        id_item = ($.epar(id_item) ? id_item * 1 : 0);

        if (id_item == 0) {
            Mktup.alertModal('É necessario salvar o item para realizar esta operação.');
            that.loader('end');
        } else {
            sendItemtoSaleOrder();
        }
    });

    panelRender.find('#item§bt_goto_purchase_order').unbind('click').bind('click', function () {

        var that = $(this);
        that.loader();
        var id_item = panelRender.find('#item§id_item');
        id_item = ($.epar(id_item) ? id_item * 1 : 0);

        if (id_item == 0) {
            Mktup.alertModal('É necessario salvar o item para realizar esta operação.');
            that.loader('end');
        } else {
            sendItemtoPurchaseOrder();
        }
    });

    panelRender.find('#item§bt_goto_stock_movement').unbind('click').bind('click', function () {

        //alert('Vai para o movimentação de estoque com o item selecionado');

    });

    panelRender.find('#item§bt_save').unbind('click').bind('click', function () {
        var currentPage = Mktup.getTopRender();
        var that = $(this);
        that.loader();

        saveItem(currentPage).done(function (si_result) {

            if (si_result && si_result > 0) panelRender.find('#item§id_item').html(currentPage.pageFormData.id_item);
            setFormNotification(si_result, panelRender);
            that.loader('end');
        });

    });

    //Botão de limpar a imagem
    //    var bt_clean_img_upload = '<button class="delete"></button>';
    //    $(bt_clean_img_upload).appendTo('.capa');
    //    $(bt_clean_img_upload).appendTo('.thumb');
    //    $(bt_clean_img_upload).appendTo('.destaque');
    //    $(bt_clean_img_upload).appendTo('.itemDetailGroupMain .image');


    $('.delete').unbind('click').bind('click', function (a) {
        //alert('CLICOU FECHAR');
        a.stopPropagation();
        a.preventDefault();
        //that.parent().removeClass('empty_img_container').addClass('empty_img_container');
        //that.attr('src', '');            
        //$('.album span.capa img').attr('src', '');
        //$('.delete').empty().remove();
        //$('.album span.capa').loader('end');
        //$('.album span.capa img').remove();
        //$('<img src="" id="item§img§normal_image_1" />').appendTo('.album span.capa');
    });


    panelRender.find('[id^="item§img§"]').each(function () {

        var img = $(this);

        img.unbind('click').bind('click', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var that = $(this);

            var width = 460;
            var height = 338;

            if ($.epar(that.attr('data-in_main'))) { width = 143; height = 143; }
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

                            var id_item = panelRender.find('#item§id_item').val();
                            id_item = $.epar(id_item) ? id_item * 1 : 0;

                            var item_image = {};

                            item_image.id_item = id_item;
                            item_image._ds_item = panelRender.find('#item§ds_item').val();
                            item_image.ds_item_image = resize_result.filename;
                            item_image.in_main = ($.epar(that.attr('data-in_main')) ? 1 : 0);
                            item_image.in_featured = ($.epar(that.attr('data-in_featured')) ? 1 : 0);
                            item_image.id_omega = ClientId;

                            var currentData = Mktup.getTopRender().pageFormData;
                            if ($.epar(that.attr('data-idx'))) {
                                item_image.fl_action = 'D';
                                currentData.ls_item_image[that.attr('data-idx') * 1] = item_image;
                            }

                            item_image.id_item_image = 0;
                            item_image.fl_action = 'I';
                            currentData.ls_item_image.push(item_image);
                            that.attr('data-idx', (currentData.ls_item_image.length - 1));

                            that.parent().removeClass('empty_img_container');
                            that.attr('src', item_image.ds_item_image);
                            that.parent().loader('end');


                        } else {
                            //that.parent().removeClass('empty_img_container').addClass('empty_img_container');
                            //that.attr('src', '');
                            that.parent().loader('end');

                        }

                    });

                } else {
                    //that.parent().removeClass('empty_img_container').addClass('empty_img_container');
                    // that.attr('src', '');
                    that.parent().loader('end');
                }

            });

        });

        img.parent().unbind('click').bind('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var that_div = $(this);
            that_div.find('img').click();
        });

    });

    panelRender.find('#item§ds_item').unbind('click').bind('click', function () {
        $(this).removeAttr('readonly');
    }).unbind('focusout').bind('focusout', function () {
        $(this).attr('readonly', 'readonly');
    });

    panelRender.find('#item§ds_codebar').unbind('keydown').bind('keydown', function (e) {
        if (e.ctrlKey && e.keyCode == 74) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    panelRender.find('#item§vl_item_cost, #item§vl_value').unbind('change').bind('change', function () {
        calcItemPercMargin(true, panelRender);
    });


    panelRender.find('#item§id_tax_ncm_code').bind('keypress', function (e) {
        if (e.keyCode == 46) return false;
    });

    panelRender.find('.notificationBar .buttonPanel button.actionButton.addActionButton').unbind('click').bind('click', function () {
        Mktup.getCurrentPanelRender().parent().find('.actionBar .addNew').click();
    });

    defBindItemElements.resolve();

    return defBindItemElements.promise();
};

saveItem = function (currentPage) {

    var defSaveItem = new $.Deferred();
    var panelRender = Mktup.getCurrentPanelRender();
    var formGroups = buildItemFormGroup(panelRender);

    saveForm(currentPage, formGroups).done(function (si_result) {
        defSaveItem.resolve(si_result);
    });

    return defSaveItem.promise();
};

buildItemFormGroup = function (panelRender) {

    var arrFields = panelRender.find('[id^="item§"]').not('[id^="item§stock"]').not('button');
    var formGroup = {}; formGroup.Attribute_Group_data = [];

    for (var z = 0; z < arrFields.length; z++) {
        var field = {};
        field.ds_attribute_name = $(arrFields[z]).attr('id').replace('item§', '');
        formGroup.Attribute_Group_data.push(field);
    }

    field = {}; field.ds_attribute_name = 'ls_item_image'; field.id_field_type = 8;
    formGroup.Attribute_Group_data.push(field);

    return [formGroup];
};

getItemCurrentStock = function (panelRender) {

    if ($.epar(panelRender)) panelRender = Mktup.getCurrentPanelRender();
    var id_item = panelRender.find('#item§id_item').val();

    var vl_1 = panelRender.find('#item§_vl_current_item_stock');
    var vl_2 = panelRender.find('#item§_vl_current_item_stock2');

    vl_1.loader();
    vl_2.loader();

    vl_1.removeClass('debit');
    vl_2.find('strong').removeClass('debit');

    id_item = $.epar(id_item) ? id_item * 1 : 0;

    if (id_item < 1) {
        vl_1.html('0');
        vl_2.html('<strong>0</strong>');

        vl_1.loader('end');
        vl_2.loader('end');

    } else {

        var params = {}; params.d = {}; params.d.parameters = {}; params.d.parameters.id_stock_room_query = id_item;
        SyncGetDataOn(params, 'Stock_Room_Query', 'ListData', true).done(function (srq_list_result) {
            srq_list_result = eval('(' + srq_list_result + ')').d;

            if (srq_list_result.length > 0) {
                var stck_current_value = parseInt(srq_list_result[0].vl_amount_available);

                vl_1.html(stck_current_value);
                vl_2.html('<strong>' + stck_current_value + '</strong>');

                if (stck_current_value < 0) {
                    vl_1.addClass('debit');
                    vl_2.find('strong').addClass('debit');
                }

            } else {
                vl_1.html('0');
                vl_2.html('<strong>0</strong>');
            }
            vl_1.loader('end');
            vl_2.loader('end');

        })
    }
};

sendItemtoSaleOrder = function () {

    var panelRender = Mktup.getCurrentPanelRender();

    var saleData = {};
    saleData.ls_sale_order_products = [];

    var product = {};
    product.ds_code = panelRender.find('#item§ds_code').val();
    product.ds_item = panelRender.find('#item§ds_item').val();
    product._ds_item = panelRender.find('#item§ds_item').val();
    product.id_item = panelRender.find('#item§id_item').val() * 1;
    product.id_sale_order = 0;
    product.id_sale_price = null
    product.in_desc_perc = 0
    product.in_gift = null
    product.vl_desc_item = 0
    product.vl_desc_perc_item = 0
    product.vl_quantity_items = 1;
    product.vl_received = 0
    product.vl_subtotal_item = moeda.desformatar(panelRender.find('#item§vl_value').val()) * 1;
    product.vl_total_item = product.vl_subtotal_item;
    product.vl_unit_item = product.vl_subtotal_item;
    product.fl_action = 'I';

    saleData.ls_sale_order_products.push(product);

    var params = {};
    params.pageFormData = saleData;
    params.renderType = 2;
    params.pageCurrentValue = 0;

    Mktup.Navigate('sale_order', params);
};

sendItemtoPurchaseOrder = function () {

    var panelRender = Mktup.getCurrentPanelRender();

    var purchaseData = {};
    purchaseData.ls_purchase_order_products = [];

    var product = {};
    product.ds_code = panelRender.find('#item§ds_code').val();
    product.ds_item = panelRender.find('#item§ds_item').val();
    product._ds_item = panelRender.find('#item§ds_item').val();
    product.id_item = panelRender.find('#item§id_item').val() * 1;
    product.id_purchase_order = 0;
    product.id_purchase_price = null
    product.in_desc_perc = 0
    product.in_gift = null
    product.vl_desc_item = 0
    product.vl_desc_perc_item = 0
    product.vl_quantity_items = 1;
    product.vl_received = 0
    product.vl_subtotal_item = moeda.desformatar(panelRender.find('#item§vl_item_cost').val()) * 1;
    product.vl_total_item = product.vl_subtotal_item;
    product.vl_unit_item = product.vl_subtotal_item;
    product.fl_action = 'I';

    purchaseData.ls_purchase_order_products.push(product);

    var params = {};
    params.pageFormData = purchaseData;
    params.renderType = 2;
    params.pageCurrentValue = 0;

    Mktup.Navigate('purchase_order', params);
};

loadItemImages = function (arrImg, panelRender) {


    for (var t = 0; t < arrImg.length; t++) {
        var currentImage = null;

        if (arrImg[t].in_main == 1) {
            currentImage = panelRender.find('#item§img§main_image');
        } else if (arrImg[t].in_featured == 1) {
            currentImage = panelRender.find('#item§img§featured_image');
        } else {
            currentImage = panelRender.find('[id^="item§img§normal_image_"][src=""]').first();
        }

        if ($.epar(currentImage)) {
            currentImage.parent().loader();
            currentImage.attr('data-idx', t);
            currentImage.attr('src', arrImg[t].ds_item_image);
            currentImage.parent().removeClass('empty_img_container').loader('end');
        }

    }
};

calcItemPercMargin = function (fromField, panelRender, currentData) {

    var vl_item_cost = 0;
    var vl_value = 0;
    var _vl_item_margin = 0;

    var field = panelRender.find('#_vl_item_margin');
    field.loader();

    if (fromField) {

        vl_item_cost = panelRender.find('#item§vl_item_cost').val();
        vl_item_cost = $.epar(vl_item_cost) ? moeda.desformatar(vl_item_cost) : 0;

        vl_value = panelRender.find('#item§vl_value').val();
        vl_value = $.epar(vl_value) ? moeda.desformatar(vl_value) : 0;

    } else {
        vl_item_cost = currentData.vl_item_cost;
        vl_value = currentData.vl_value;
    }

    if (vl_item_cost > 0 || vl_value > 0) {
        if (vl_value == 0) vl_value = vl_item_cost;
        if (vl_item_cost == 0) vl_item_cost = vl_value;

        _vl_item_margin = parseInt((((vl_value / vl_item_cost) - 1) * 100));
    }

    field.html(_vl_item_margin + '%');
    field.loader('end');
};

doItemStockMove = function (panelRender) {

    var defDoItemStockMove = new $.Deferred();

    var id_item = panelRender.find('#item§id_item').val();
    id_item = $.epar(id_item) ? id_item * 1 : 0;

    if (id_item > 0) {

        var stock_movement = {};
        stock_movement.id_stock_movement = 0;
        stock_movement.id_stock_movement_type = 4;
        stock_movement.dt_movement = $.DateFormatToDb($.getToday());
        stock_movement.in_es = panelRender.find('#item§stock§in_es').val() * 1;

        if (stock_movement.in_es == 1) {
            stock_movement.id_stock_location_destination = 1;
        } else {
            stock_movement.id_stock_location_origin = 1;
        }

        stock_movement.id_omega = ClientId;

        SyncGetDataOn({ d: [stock_movement] }, 'stock_movement', 'InsertData', true).done(function (sm_insert_result) {

            if (sm_insert_result > 0) {
                var stock_movement_item = {};
                stock_movement_item.id_stock_movement_item = 0;
                stock_movement_item.id_stock_movement = sm_insert_result;
                stock_movement_item.id_stock_location = 1;
                stock_movement_item.id_item = id_item;
                stock_movement_item.ds_item = panelRender.find('#item§ds_item').val();
                stock_movement_item.vl_amount = panelRender.find('#item§stock§vl_amount').val() * 1;

                var vl_unit = panelRender.find('#item§vl_item_cost').val();
                if (!$.epar(vl_unit)) vl_unit = panelRender.find('#item§vl_value').val();
                vl_unit = moeda.desformatar(vl_unit);

                stock_movement_item.vl_unit = vl_unit;
                stock_movement_item.id_omega = ClientId;

                SyncGetDataOn({ d: [stock_movement_item] }, 'stock_movement_item', 'InsertData', true).done(function (smi_insert_result) {

                    if (smi_insert_result > 0) {

                        var stock_room = {};
                        var curr_date = new Date();
                        var room_dt_movement = $.DateFormatToDb($.getToday(curr_date)) + ' ' + curr_date.getHours() + ':' + curr_date.getMinutes() + ':' + curr_date.getSeconds();

                        stock_room.id_stock_room = 0;
                        stock_room.id_stock_movement = stock_movement_item.id_stock_movement;
                        stock_room.id_stock_movement_item = smi_insert_result;
                        stock_room.dt_movement = room_dt_movement;
                        stock_room.id_item = stock_movement_item.id_item;
                        stock_room.ds_item = stock_movement_item.ds_item;
                        stock_room.vl_amount = stock_movement_item.vl_amount;
                        stock_room.vl_unit = stock_movement_item.vl_unit;
                        stock_room.vl_total = moeda.desformatar(moeda.formatar(stock_movement_item.vl_amount * stock_movement_item.vl_unit));
                        stock_room.in_es = stock_movement.in_es;
                        stock_room.id_stock_location = stock_movement_item.id_stock_location;
                        stock_room.id_omega = ClientId;

                        SyncGetDataOn({ d: [stock_room] }, 'stock_room', 'InsertData', true).done(function (sr_insert_result) {

                            if (sr_insert_result > 0) {
                                defDoItemStockMove.resolve(true);
                            } else {
                                defDoItemStockMove.resolve(false);
                            }
                        });
                    } else {
                        defDoItemStockMove.resolve(false);
                    }

                });

            } else {
                defDoItemStockMove.resolve(false);
            }

        })
    } else {
        defDoItemStockMove.resolve(false);
    }

    return defDoItemStockMove.promise();
}

saveItemNewUnit = function (bt) {

    var defSaveItemNewUnit = new $.Deferred();

    var that = bt;
    var text_field = that.prev();

    var item_unit = {};
    item_unit.id_item_unit = 0;
    item_unit.ds_code = text_field.val().substr(0, 2);
    item_unit.ds_item_unit = text_field.val();
    item_unit.id_omega = ClientId;

    SyncGetDataOn({ d: [item_unit] }, "Item_Unit", "InsertData", false).done(function (ins_item_unit_result) {

        item_unit.id_item_unit = ins_item_unit_result
        text_field.attr('data-id_value', ins_item_unit_result);

        defSaveItemNewUnit.resolve();

    });

    return defSaveItemNewUnit.promise();
};

clearItemSubgroup = function () {
    $('#item§id_item_subgroup').val('');
    loadFormCustomSelectData($('#item§id_item_subgroup'));
};

initPackagePreview = function (panelRender) {
    packagePreviewBuild($("#item§vl_width").val(), $("#item§vl_height").val(), $("#item§vl_lenght").val());

    $("#item§vl_height, #item§vl_width, #item§vl_lenght").keyup(function () {
        packagePreviewBuild($("#item§vl_width").val(), $("#item§vl_height").val(), $("#item§vl_lenght").val());
    });

    $("#item§vl_height, #item§vl_width, #item§vl_lenght").focusout(function () {
        packagePreviewBuild($("#item§vl_width").val(), $("#item§vl_height").val(), $("#item§vl_lenght").val());
    });
};

packagePreviewError = function (panelRender) {

};

packagePreviewBuild = function (l, a, p) {
    var ALTURA_MAX = 105; // todas as medidas em cm
    var LARGURA_MAX = 105;
    var COMPRIMENTO_MAX = 105;
    var ALTURA_MIN = 2;
    var LARGURA_MIN = 11;
    var COMPRIMENTO_MIN = 16;

    if (a > ALTURA_MAX) {
        packagePreviewError("Altura maior do que o correio aceita");
    } else if (l > LARGURA_MAX) {
        packagePreviewError("Largura maior do que o correio aceita");
    } else if (p > COMPRIMENTO_MAX) {
        packagePreviewError("Comprimento maior do que o correio aceita");
    } else if (a < ALTURA_MIN) {
        packagePreviewError("Altura menor do que o correio aceita");
    } else if (l < LARGURA_MIN) {
        packagePreviewError("Largura menor do que o correio aceita");
    } else if (p < COMPRIMENTO_MIN) {
        packagePreviewError("Comprimento menor do que o correio aceita");
    } else if ((parseInt(l) + parseInt(a) + parseInt(p)) > 200) {
        packagePreviewError("Maior do que o correio aceita");
    }

    var n = [parseInt(l), parseInt(a), parseInt(p)];

    var w, y, z, leftZ, topZ, frontZ;

    var maior;
    for (var i = 0; i < n.length; i++) {
        if (i == 0) maior = n[i];
        else if (n[i] > maior) maior = n[i];
    }

    l = parseInt(((1 / ((maior * 100) / 100)) * 100) * n[0]);
    a = parseInt(((1 / ((maior * 100) / 100)) * 100) * n[1]);
    p = parseInt(((1 / ((maior * 100) / 100)) * 100) * n[2]);

    // Container
    $(".boxPreview .box_container").css({
        width: l,
        height: a
    });

    // Main
    $(".boxPreview .box_main").width(l).height(a);

    frontZ = p / 2;
    topZ = p / 2;

    if (l > p) { leftZ = ((p / 2) + (l - p)) * -1; }
    else if (p > l) {
        leftZ = ((p / 2) - (p - l)) * -1;
    } else { leftZ = (l / 2) * -1; }

    // Front
    $(".boxPreview .box_side.front").css({
        width: l,
        height: a,
        '-webkit-transform': 'translateZ(' + frontZ + 'px)'
    });

    // Left
    $(".boxPreview .box_side.right").css({
        width: p,
        height: a,
        '-webkit-transform': 'rotateY(-90deg) translateZ(' + leftZ + 'px)'
    });

    // Top
    $(".boxPreview .box_side.top").css({
        width: l,
        height: p,
        '-webkit-transform': 'rotateX(90deg) translateZ(' + topZ + 'px)'
    });
};