buildField = function (currentPage, oField, isSearch) {

    //case 7: // slider
    //  return buildSlider(currentPage, oField);
    //case 12: // texthidden
    //  return buildTextHidden(currentPage, oField);
    //case 13: // geolocation
    //  return buildGeoLocation(currentPage, oField);   
   

    switch ((oField.id_field_type * 1)) {
        case 1: // inputtext
            return buildInputText(currentPage, oField, false, isSearch);
        case 2: // select
        case 3: // dropdown
            return buildDropDown(currentPage, oField, false, isSearch);
        case 4: // checkbox
            return buildCheckBox(currentPage, oField, isSearch);
        case 5: // radio
            return buildRadio(currentPage, oField, isSearch);
        case 6: // datepicker
            return buildDatePicker(currentPage, oField, isSearch);    
        case 8: // grid
            return buildGrid(currentPage, oField, isSearch);
        case 10: // autocomplete
            return buildMktupAutoComplete(currentPage, oField, false, isSearch);
        case 11: // textarea
            return buildTextArea(currentPage, oField, isSearch);       
        case 14: // password
            return buildPassword(currentPage, oField, isSearch);
        case 15: // File upload
            return buildFileUpload(currentPage, oField, isSearch);
        case 16: // Image upload
            return buildImageUpload(currentPage, oField, isSearch);
        case 17: // dia/mês
            return buildDayMonth(currentPage, oField, isSearch);
        case 18: //select com adicionar
            return buildDropDown(currentPage, oField, true, isSearch); 
        case 19: //grid com edição
            return buildGrid(currentPage, oField, true, isSearch);
        case 20:
        case 21: // autocomplete
            return buildMktupAutoComplete(currentPage, oField, true, isSearch);
        default: // inputhidden
            return buildHidden(currentPage, oField, isSearch);
    }


};

buildHidden = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '<input type="hidden" id="' + field_id + '" name="' + field_id + '" value="" ';
    //class="' + getFieldSpecialClasses(oField) + '"

    field_markup += getFieldSpecialData(oField, isSearch);

    field_markup += ' >';

    return field_markup;
};

buildInputText = function (currentPage, oField, AutoC, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '">';

    if ((isSearch && oField.ds_attribute_name.substring(0, 3) != 'ds_' && oField.ds_attribute_name.toLowerCase().substring(0,3) != 'id_') || (isSearch && oField.ds_attribute_name.toLowerCase().substring(0,3) == 'id_' && oField.ds_attribute_name.toLowerCase() == 'id_' + currentPage.pageEntity.toLowerCase())) {
        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span></label>';
        field_markup += '<label><span class="fieldTitle">DE:</span>';
        field_markup += '<input type="text"  class="inputText' + (($.epar(AutoC) == true) ? ' autocomplete' : '') + '' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" value="" ';
        if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';

        field_markup += '<label><span class="fieldTitle">ATÉ:</span>';
        field_markup += '<input type="text"  class="inputText' + (($.epar(AutoC) == true) ? ' autocomplete' : '') + '' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" value="" ';
        if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';
    }
    else {
        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span>';
        field_markup += '<input type="text"  class="inputText' + (($.epar(AutoC) == true) ? ' autocomplete' : '') + '' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + ((isSearch) ? '§search' : '') + '" name="' + field_id + ((isSearch) ? '§search' : '') + '" value="" ';
        if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';
    }
    field_markup += '</div>\n';

    return field_markup;
};

buildDropDown = function (currentPage, oField, useAdd, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">'
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="hidden" id="' + field_id + '" name="' + field_id + '" class="customselect' + ($.epar(useAdd) ? ' add' : '') + getFieldSpecialClasses(oField, isSearch) + '" data-overload="" data-label="" value="" ';
    field_markup += getFieldSpecialData(oField, isSearch);
    field_markup += ' >';

    field_markup += '</label></div>\n';

    return field_markup;
};

buildCheckBox = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">'
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="checkbox" id="' + field_id + '" name="' + field_id + '" class="inputCheckbox' + getFieldSpecialClasses(oField, isSearch) + '" value="" ';
    field_markup += getFieldSpecialData(oField, isSearch);

    field_markup += ' onclick="($(this).is(\':checked\') ? $(this).attr(\'checked\', true) : $(this).attr(\'checked\', false));" ';
    field_markup += ' >';

    field_markup += '</label></div>\n';

    return field_markup;

};

buildRadio = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '">';
    field_markup += '<span class="fieldTitle">' + Mktup.translator((oField.id_term_attribute_name * 1)) + '</span>';


    field_values = oField.field_values;

    for (var xx_field_value in field_values) {

        field_markup += '<label>'
        field_markup += '<span class="fieldRadio">';

        field_markup += '<input type="radio" id="' + field_id + '" name="' + field_id + '" class="inputRadio' + getFieldSpecialClasses(oField, isSearch) + '" value="' + field_values[xx_field_value].value + '" ';
        field_markup += ' onclick="$(\'#\' + this.id).removeAttr(\'checked\'); $(this).attr(\'checked\', \'checked\');';
        if ($.epar(oField.callback)) field_markup += 'eval($(this).attr(\'data-callback\'));'
        field_markup += '" ';

        if ($.epar(oField.default_value)) {
            if (oField.default_value == field_values[xx_field_value].value) field_markup += ' checked="checked" ';
        } else {
            if (xx_field_value == 0) field_markup += ' checked="checked" ';
            field_markup += 'data-original_value="0" ';
        }
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' >';

        field_markup += '<span class="inputRadioLabel" >';

        field_markup += Mktup.translator(field_values[xx_field_value].term) + '</span>';
        field_markup += '</span></label>\n';
    }

    field_markup += '</div>\n';

    return field_markup;

};

buildDatePicker = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '">';


    if (isSearch) {
        //ajuste para funcionar o filtro avançado em seller commission - átila 20/02/2013
        if (oField.main_entity == 'seller_commission' && field_id == 'seller_commission§id_seller_commission_closing') field_id = 'seller_commission§dt_closing';
        //

        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span></label>';

        field_markup += '<label><span class="fieldTitle">DE:</span>';
        field_markup += '<input type="text"  class="inputText datepicker' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" value="" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';

        field_markup += '<label><span class="fieldTitle">ATÉ:</span>';
        field_markup += '<input type="text"  class="inputText datepicker' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" value="" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';
    }
    else {
        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span>';
        field_markup += '<input type="text"  class="inputText datepicker' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + ((isSearch) ? '§search' : '') + '" name="' + field_id + ((isSearch) ? '§search' : '') + '" value="" ';
        if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';
    }
    field_markup += '</div>\n';

    return field_markup;

};

buildTextArea = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">';
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<textarea class="textarea' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '" name="' + field_id + '" rows="5" ';
    if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
    field_markup += getFieldSpecialData(oField, isSearch);
    field_markup += ' >';
    field_markup += '</textarea>';

    field_markup += '</label></div>\n';

    return field_markup;
};

buildTextSearch = function (currentPage, oField, isSearch) {
    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">';
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="text"  class="inputText textsearch' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '" name="' + field_id + '" value="" readonly ';
    if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
    field_markup += getFieldSpecialData(oField, isSearch);
    field_markup += ' >';

    field_markup += '<span class="contentSearchToList">';
    field_markup += '\t<button type="button" class="btClear"></button>';
    field_markup += '\t<button type="button" class="btSearch"></button>';
    field_markup += '</span>';

    field_markup += '</label></div>\n';

    return field_markup;

};

buildPassword = function (currentPage, oField) {
    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">';
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="password"  class="inputPass' + getFieldSpecialClasses(oField) + '" id="' + field_id + '" name="' + field_id + '" value="" ';
    if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
    field_markup += getFieldSpecialData(oField);
    field_markup += ' >';

    field_markup += '</label></div>\n';

    return field_markup;
};


buildDayMonth = function (currentPage, oField, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '">';


    if (isSearch) {
        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span></label>';

        field_markup += '<label><span class="fieldTitle">DE:</span>';
        field_markup += '<input type="text"  class="inputText datepickerDM' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_ini' + ((isSearch) ? '§search' : '') + '" value="" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';

        field_markup += '<label><span class="fieldTitle">ATÉ:</span>';
        field_markup += '<input type="text"  class="inputText datepickerDM' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" name="' + field_id + '_fim' + ((isSearch) ? '§search' : '') + '" value="" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ></label>';
    }
    else {
        field_markup += '<label class="fieldContent"><span class="fieldTitle">';
        field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
        field_markup += '</span>';

        field_markup += '<input type="text"  class="inputText datepickerDM' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + ((isSearch) ? '§search' : '') + '" name="' + field_id + ((isSearch) ? '§search' : '') + '" value="" ';
        if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
        field_markup += getFieldSpecialData(oField, isSearch);
        field_markup += ' ><label>';
    }

    field_markup += '</div>\n';

    return field_markup;

};

buildFileUpload = function (currentPage, oField) {
    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">';
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="file"  class="inputFile' + getFieldSpecialClasses(oField) + '" id="' + field_id + '" name="' + field_id + '" value="" ';
    if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
    field_markup += getFieldSpecialData(oField);
    field_markup += ' >';

    field_markup += '</label></div>\n';

    return field_markup;
};

buildGrid = function (currentPage, oField, isForm) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name;

    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '<div class="panelMain form ' + ($.epar(isForm) ? 'formgrid' : 'grid') + '"  id="' + field_id + '" name="' + field_id + '" ';
    field_markup += getFieldSpecialData(oField);
    field_markup += ' >';
    field_markup += '</div>';

    return field_markup;
};

buildMktupAutoComplete = function (currentPage, oField, bAdd, isSearch) {

    var field_markup = '';
    var field_id = currentPage.pageEntity.toLowerCase() + '§' + oField.ds_attribute_name + ((isSearch) ? '§search' : '');
    var div_space = ((oField.nu_field_size * 4) > (oField.nu_field_space * 4)) ? (oField.nu_field_size * 4) : (oField.nu_field_space * 4);
    oField.main_entity = currentPage.pageEntity.toLowerCase();

    field_markup += '\t\t\t\t<div class="grid_' + div_space + '"><label class="fieldContent"><span class="fieldTitle">';
    field_markup += Mktup.translator((oField.id_term_attribute_name * 1));
    field_markup += '</span>';

    field_markup += '<input type="text"  data-id_value class="inputText mktup_autocomplete' + getFieldSpecialClasses(oField, isSearch) + '" id="' + field_id + '"  name="' + field_id + '" data-id_value ';
    if (oField.nu_field_space > oField.nu_field_size) field_markup += ' style="width:' + ((oField.nu_field_size / oField.nu_field_space) * 100) + '%;" ';
    field_markup += getFieldSpecialData(oField, isSearch);
    field_markup += ' />';

    if (bAdd) field_markup += '<button id="' + currentPage.pageEntity.toLowerCase() + '§bt_' + oField.ds_attribute_name + '" class="button button1 mktup_autocomplete" style="position: absolute; top:0; right:1px; z-index: 1; display:none">Salvar ' + Mktup.translator((oField.id_term_attribute_name * 1)) +'</button>';

    field_markup += '</label></div>\n';

    return field_markup;
};


getFieldSpecialData = function (oField, isSearch) {

    var field_markup = '';

    if ($.epar(oField.in_readonly) == 1) {

        switch ((oField.id_field_type * 1)) {
            case 1: // inputtext
            case 6: // datepicker
            case 10: // textsearch
            case 11: // textarea
            case 14: // password
            case 15: // File upload
            case 16: // Image upload
            case 17: // dia/mês
            case 20: // autocomplete
                if (!isSearch) field_markup += ' readonly="readonly" ';
                break;
            case 2: // select
            case 3: // dropdown
            case 18: //select com adicionar
                if (!isSearch) field_markup += ' readonly="readonly" ';
                break;
            case 4: // checkbox
            case 5: // radio
                if (!isSearch) field_markup += ' disabled="disabled" ';
                break;
            case 8: // grid
            case 19: //grid com edição
            default: // inputhidden
                break;
        }

    }

    if ($.epar(oField.main_entity)) field_markup += ' data-main_entity="' + oField.main_entity + '" ';
    if ($.epar(oField.ds_entity)) field_markup += ' data-grid_entity="' + oField.ds_entity + '" ';
    if ($.epar(oField.field_entity)) field_markup += ' data-field_entity="' + oField.field_entity + '" ';

    if ($.epar(oField.readonly)) field_markup += ' readonly="readonly" ';
    if ($.epar(oField.maxlength)) field_markup += ' maxlength="' + oField.maxlength + '" ';

    if ($.epar(oField.filler_fields)) field_markup += ' data-filler_fields="' + JSON.stringify(oField.filler_fields).replace(/\"/g, "'") + '" ';
    if ($.epar(oField.field_filter)) field_markup += ' data-field_filter="' + JSON.stringify(oField.field_filter).replace(/\"/g, "'") + '" ';
    if ($.epar(oField.field_values)) field_markup += ' data-field_values="' + JSON.stringify(oField.field_values).replace(/\"/g, "'") + '" ';

    if (oField.default_value != undefined) {
        if (oField.default_value.indexOf('|') > 0) {
            field_markup += ' data-default_value="' + oField.default_value + '" data-original_value="' + oField.default_value.split('|')[0] + '"';
        } else {
            field_markup += ' data-default_value="' + oField.default_value + '" data-original_value="' + oField.default_value + '"';
        }
    }

    if ($.epar(oField.callback) && !isSearch) field_markup += ' data-callback="' + oField.callback.replace('fbp_' + oField.main_entity, 'Mktup.getTopRender().pageFBP') + '" ';
    if ($.epar(oField.on_add) && !isSearch) field_markup += ' data-on_add="' + oField.on_add + '" ';

    return field_markup;
}

getFieldSpecialClasses = function (oField, isSearch) {

    var class_markup = '';
    if ($.epar(oField.in_null) * 1 == 0 && !isSearch) class_markup += ' required';
    if ($.epar(oField.id_validate) * 1 > 0) {

        if (isSearch && oField.id_validate != 11 && oField.id_validate != 8 && oField.id_validate != 9) {
            return class_markup;
        }
        else {
            class_markup += ' preset';
            class_markup += getFieldPressets(oField.id_validate);
        }
    }

    return class_markup;
}

getFieldPressets = function (id_validate) {

    switch (id_validate) {
        case 1: //cnpj
            return ' cnpj';
        case 3: //cpf
            return ' cpf';
        case 5: //telefone
            return ' phone';
        case 6: //email
            return ' email';
        case 7: //url
            return ' site';
        case 8: //número
            return ' interger';
        case 9: //número positivo
            return ' positiveinterger';
        case 10: //número negativo
            return ' negativeinteger';
        case 11: //valor monetário
            return ' currency';
        case 12: //data
        case 13: //data maior ou igual que atual
        case 14: //data menor ou igual que atual
            return ' date';
        case 15: //text
            return ' text';
        case 17:
            return ' negativefloat';
        case 18:
            return ' positivefloat'
        case 19: //data
            return ' shortdate';
        case 20:
            return ' passcheck';
        case 22:
            return ' cep';
        case 2: //inscrição estadual
        case 4: //rg
        default: //não valida
            return '';
    }

}
