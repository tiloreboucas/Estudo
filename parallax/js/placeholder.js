$(document).ready(function () {
    if ($('html').hasClass('ie') || $('html').hasClass('gecko')) {
        $('input[placeholder], textarea[placeholder]').each(function (index, item) {
            $(item).val($(item).attr('placeholder')).addClass('placeholder');

            $(item).focus(function () {
                if ($(item).val() == $(item).attr('placeholder')) {
                    $(item).val("").removeClass('placeholder');
                }
            });

            $(item).focusout(function () {
                if ($(item).val() == "") {
                    $(item).val($(item).attr('placeholder')).addClass('placeholder');
                }
            });
        });   
    }
});