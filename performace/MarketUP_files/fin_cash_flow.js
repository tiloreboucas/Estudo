fin_cash_flow_init = function () {
    var panelRender = Mktup.getCurrentPanelRender();
    buildFinCashFlowHeader(panelRender);
};

buildFinCashFlowHeader = function (panelRender) {

    var currentPage = Mktup.getTopRender();
    var panelHeader = panelRender.parents('.pageContent').find('.pageHeader');
    var markup = '';

    markup += '<div class="actionBar">';
    markup += '	<div class="search form">';
    markup += '		<button type="button" class="btSearch" title="Buscar"></button>';
    markup += '		<input type="text" class="inputText bypass fieldSearch data_de" placeholder="DD/MM/AAAA" id="search§dt_entry_ini" />';
    markup += '		<span class="legend">até</span>';
    markup += '		<input type="text" class="inputText bypass fieldSearch data_ate" placeholder="DD/MM/AAAA" id="search§dt_entry_fim" />';
    markup += '		<button type="button" class="button ok">ok</button>';
    markup += '		<button type="button" class="filterDays"><span class="bg"></span><span class="num">7<span class="txt">dias</span></span></button>';
    markup += '		<button type="button" class="filterDays"><span class="bg"></span><span class="num">15<span class="txt">dias</span></span></button>';
    markup += '		<button type="button" class="filterDays"><span class="bg"></span><span class="num">30<span class="txt">dias</span></span></button>';
    markup += '		<button type="button" class="advancedSearch">Busca Avançada</button>';
    markup += '		<div class="advancedSearchBox">';
    markup += '			<ul>';
    markup += '				<li>';
    markup += '					<label class="fieldContent">';
    markup += '						<span class="fieldTitle">Texto:</span>';
    markup += '						<input type="text" class="inputText bypass">';
    markup += '					</label>';
    markup += '				</li>';
    markup += '				<li>';
    markup += '					<label class="fieldContent">';
    markup += '						<span class="fieldTitle">Select:</span>';
    markup += '						<input type="hidden" class="customselect bypass">';
    markup += '					</label>';
    markup += '				</li>';
    markup += '				<li>';
    markup += '					<label class="fieldContent">';
    markup += '						<span class="fieldTitle">De/Para:</span>';
    markup += '						<span class="dePara">'; 
    markup += '							<input type="text" class="inputText bypass">';
    markup += '							<span class="separador">-</span>';
    markup += '							<input type="text" class="inputText bypass">';
    markup += '						</span>';
    markup += '					</label>';
    markup += '				</li>';
    markup += '				<li>';
    markup += '					<button type="button" class="btFiltrar button button1">Filtrar</button>';
    markup += '				</li>';
    markup += '			</ul>';
    markup += '		</div>';
    markup += '	</div>';
    markup += '	<div class="buttonPanel">';
    markup += '	</div>';
    markup += '</div>';

    panelHeader.append(markup);
    panelHeader.show();

    if (!$.epar(currentPage.pageDataPaging) ||
        !$.epar(currentPage.pageDataPaging.parameters) ||
        !$.epar(currentPage.pageDataPaging.parameters.dt_entry_ini) ||
        !$.epar(currentPage.pageDataPaging.parameters.dt_entry_fim)
    ) {

        var dt_fim = new Date();
        var dt_ini = new Date(); dt_ini.dateAdd('d', -7);

        panelHeader.find('#search§dt_entry_ini').val($.getToday(dt_ini));
        panelHeader.find('#search§dt_entry_fim').val($.getToday(dt_fim));

    } else {
        panelHeader.find('#search§dt_entry_ini').val($.DbPramDateFormat(currentPage.pageDataPaging.parameters.dt_entry_ini.substr(0, 10)));
        panelHeader.find('#search§dt_entry_fim').val($.DbPramDateFormat(currentPage.pageDataPaging.parameters.dt_entry_fim.substr(0, 10)));
    }

    panelHeader.find('button.advancedSearch').unbind('click').bind('click', function () {

        var tmp_filter = currentPage.pageFBP.Attribute_Groups[0].Attribute_Group_data[5].field_filter;
        currentPage.pageFBP.Attribute_Groups[0].Attribute_Group_data[5].field_filter = '';

        currentPage.advancedSearch();

        currentPage.pageFBP.Attribute_Groups[0].Attribute_Group_data[5].field_filter = tmp_filter;

        panelHeader.find('div.advancedSearchBox').find('#fin_entry§dt_entry_ini§search').parents('label').prev().hide();
        panelHeader.find('div.advancedSearchBox').find('#fin_entry§dt_entry_ini§search').parents('label').hide();
        panelHeader.find('div.advancedSearchBox').find('#fin_entry§dt_entry_fim§search').parents('label').hide();

        panelHeader.find('div.advancedSearchBox').find('#fin_entry§dt_entry_ini§search').val(panelHeader.find('#search§dt_entry_ini').val());
        panelHeader.find('div.advancedSearchBox').find('#fin_entry§dt_entry_fim§search').val(panelHeader.find('#search§dt_entry_fim').val());

    });

    var search_form = panelHeader.find('.search.form');
    buildFormDatepickers(search_form);
    search_form.formvalidator({ bypass: true });

    search_form.find('button.ok').unbind('click').bind('click', function () {

        var that = $(this);

        that.parent().formvalidator('validationGroup')
        if (true || that.parent()[0].attr.valid) {

            var dt_ini = that.parent().find('#search§dt_entry_ini').val();
            var dt_fim = that.parent().find('#search§dt_entry_fim').val();

            var currentPage = Mktup.getTopRender();
            var paging = {};
            paging.page = 1;
            paging.size = currentPage.listPageSize;
            paging.parameters = {};

            paging.parameters.dt_entry_ini = $.DateFormatToDbParam(dt_ini);
            paging.parameters.dt_entry_fim = $.DateFormatToDbParam(dt_fim);

            currentPage.pageDataPaging = paging;
            currentPage.pageListTotalRecords = null;

            renderCashFlow();
        }

    });


    var dayFilters = panelHeader.find('.filterDays');
    dayFilters.eq(0).unbind('click').bind('click', function () {


        var dt_ini = new Date(); dt_ini.dateAdd('d', -7);
        var dt_fim = new Date();

        dt_ini = $.getToday(dt_ini);
        dt_fim = $.getToday(dt_fim);

        panelHeader.find('#search§dt_entry_ini').val(dt_ini)
        panelHeader.find('#search§dt_entry_fim').val(dt_fim);

        panelHeader.find('button.ok').click();

    });

    dayFilters.eq(1).unbind('click').bind('click', function () {


        var dt_ini = new Date(); dt_ini.dateAdd('d', -15);
        var dt_fim = new Date();

        dt_ini = $.getToday(dt_ini);
        dt_fim = $.getToday(dt_fim);

        panelHeader.find('#search§dt_entry_ini').val(dt_ini)
        panelHeader.find('#search§dt_entry_fim').val(dt_fim);

        panelHeader.find('button.ok').click();

    });

    dayFilters.eq(2).unbind('click').bind('click', function () {

        var dt_ini = new Date(); dt_ini.dateAdd('d', -30);
        var dt_fim = new Date();

        dt_ini = $.getToday(dt_ini);
        dt_fim = $.getToday(dt_fim);

        panelHeader.find('#search§dt_entry_ini').val(dt_ini)
        panelHeader.find('#search§dt_entry_fim').val(dt_fim);

        panelHeader.find('button.ok').click();

    });

    panelHeader.show();
    search_form.find('button.ok').click();
};

renderCashFlow = function () {

    var currentPage = Mktup.getTopRender();
    var panelRender = Mktup.getCurrentPanelRender();

    panelRender.empty();

    currentPage.pageTempData = {};

    var currentData = currentPage.pageTempData;
    var day_params = $.extend(true, {}, currentPage.pageDataPaging.parameters);

    panelRender.parent().loader();

    SyncGetDataOn(day_params, 'fin_cash_flow', 'getDaySheet', false).done(function (gds_result) {
        panelRender[0].innerHTML = gds_result;

        $('div.day:contains(","):contains("-")').addClass('debit');
        $('div.month:contains(","):contains("-")').addClass('debit');
       
        calcColumnTotalsByDay(0);
        calcLineTotalsByDay(0);
        panelRender.parent().loader('end');

        bindNavigation(panelRender);
        
    });
};

bindNavigation = function (panelRender) {

    setFooterPosition(panelRender);

    panelRender.find('.btLeft').unbind('click').bind('click', function () {
        var cf_h = panelRender.find('.cf_headercenter');
        var sl = cf_h[0].scrollLeft - 90;
        cf_h[0].scrollLeft = panelRender.find('.display')[0].scrollLeft = panelRender.find('.cf_main_view')[0].scrollLeft = panelRender.find('.cf_footercenter')[0].scrollLeft = sl;
    });

    panelRender.find('.btRight').unbind('click').bind('click', function () {
        var cf_h = panelRender.find('.cf_headercenter');
        var sl = cf_h[0].scrollLeft + 90;
        cf_h[0].scrollLeft = panelRender.find('.display')[0].scrollLeft = panelRender.find('.cf_main_view')[0].scrollLeft = panelRender.find('.cf_footercenter')[0].scrollLeft = sl;
    });

    bindHoverLine(panelRender);
    bindClickToViewList(panelRender);
    bindClickChangeViewMode(panelRender);

    $('div.cf_rightside div:contains(","):contains("-")').addClass('debit');
};

setFooterPosition = function (panelRender) {

    var altura_navegador = $(window).outerHeight(true);
    var altura_conteudo = document.body.scrollHeight;

    if (altura_conteudo > altura_navegador) {
        panelRender.find('.cf_footer').css({
            "position": "fixed",
            "bottom": "-30px",
            "padding-bottom": "70px"
        });

        panelRender.find('.cf_leftside').css({
            "padding-bottom": "70px"
        });

    } else {
        panelRender.find('.cf_footer').css({
            "position": "relative",
            "bottom": "0px",
            "padding-bottom": "0px"
        });

        panelRender.find('.cf_leftside').css({
            "padding-bottom": "0px"
        });
    }

    //console.log("legenda", $(".cf_container"));
    if($('.legenda').size() == 0){
        var str = "<div class='legenda'><span class='realizado'>Realizado</span><span class='previsto'>Previsto</span></div>";
        $(".cf_container").prepend(str);

        $(".legenda").css({
            'position': 'fixed',
            'top': '200px',
            'padding-left': '910px',
            /*'right': '50px',*/
            'z-index': '2'
        });

        $(".legenda span").css({
            'display': 'block',
            'font-size': '12px',
            'font-weight': 'bold',
            'height': '12px',
            'text-indent': '5px'
        });

        $(".legenda span.realizado").css({
            'color': '#c7c7c7',
            'border-left': '10px solid #c7c7c7',
            'margin-bottom': '5px'
        });
        
        $(".legenda span.previsto").css({
            'color': '#dfac45',
            'border-left': '10px solid #dfac45'
        });
    }
};

bindHoverLine = function (panelRender) {

    panelRender.find(".cf_leftside div[data-index], .cf_rightside div[data-index]").hover(function () {
        var rowIndex = $(this).attr("data-index");
        var start_index = $('.cf_headercenter').scrollLeft() / 90;
        var end_index = start_index + 6;

        $('.cf_leftside [data-index="' + rowIndex + '"]').addClass("hover");

        for (var t = start_index; t <= end_index; t++) {
            $('.cf_main div[data-index="' + rowIndex + '"] div[data-column-index="' + t + '"]').addClass("hover");
        }

        $('.cf_rightside [data-index="' + rowIndex + '"]').addClass("hover");

    }, function () {

        var rowIndex = $(this).attr("data-index");
        var start_index = $('.cf_headercenter').scrollLeft() / 90;
        var end_index = start_index + 6;

        $('.cf_leftside [data-index="' + rowIndex + '"]').removeClass("hover");

        for (var t = start_index; t <= end_index; t++) {
            $('.cf_main div[data-index="' + rowIndex + '"] div[data-column-index="' + t + '"]').removeClass("hover");
        }

        $('.cf_rightside [data-index="' + rowIndex + '"]').removeClass("hover");

    });

    panelRender.find(".cf_main div[data-column-index]").hover(function () {

        var rowIndex = $(this).parent().attr("data-index");
        var start_index = $('.cf_headercenter').scrollLeft() / 90;
        var end_index = start_index + 6;

        $('.cf_leftside [data-index="' + rowIndex + '"]').addClass("hover");

        for (var t = start_index; t <= end_index; t++) {
            $('.cf_main div[data-index="' + rowIndex + '"] div[data-column-index="' + t + '"]').addClass("hover");
        }

        $('.cf_rightside [data-index="' + rowIndex + '"]').addClass("hover");

    }, function () {
        var rowIndex = $(this).parent().attr("data-index");
        var start_index = $('.cf_headercenter').scrollLeft() / 90;
        var end_index = start_index + 6;

        $('.cf_leftside [data-index="' + rowIndex + '"]').removeClass("hover");

        for (var t = start_index; t <= end_index; t++) {
            $('.cf_main div[data-index="' + rowIndex + '"] div[data-column-index="' + t + '"]').removeClass("hover");
        }

        $('.cf_rightside [data-index="' + rowIndex + '"]').removeClass("hover");
    });
};

calcColumnTotalsByDay = function (start_idx) {

    var end_idx = $(".cf_headercenter_view .day[data-column-index]:last").attr('data-column-index') * 1;
    var vl_total = moeda.desformatar($(".cf_headercenter_view .day[data-column-index='" + start_idx + "']:first").text());
    var vl_cel = '';
    vl_total = (isNaN(vl_total) ? 0 : vl_total);

    $(".cf_headerright.total").html(moeda.formatar(vl_total));

    $('.month').css('display', 'none');

    for (var a = start_idx; a <= end_idx; a++) {

        $(".cf_headercenter_view .day[data-column-index='" + a + "']").html(moeda.formatar(vl_total));

        var cels = $(".cf_main .day[data-column-index='" + a + "']");

        for (var b = 0; b < cels.length; b++) {
            vl_cel = moeda.desformatar($(cels[b]).text());
            vl_total += (isNaN(vl_cel) ? 0 : vl_cel);
        }

        $(".cf_footercenter_view .day[data-column-index='" + a + "']").html(moeda.formatar(vl_total));

    }

    calcColumnTotalsByMonth(start_idx);
};

calcColumnTotalsByMonth = function (start_idx) {

    var end_idx = $(".cf_headercenter_view .month[data-column-index]:last").attr('data-column-index') * 1;
    var vl_total = moeda.desformatar($(".cf_headercenter_view .month[data-column-index='" + start_idx + "']:first").text());
    var vl_cel = '';

    vl_total = (isNaN(vl_total) ? 0 : vl_total);

    for (var a = start_idx; a <= end_idx; a++) {

        $(".cf_headercenter_view .month[data-column-index='" + a + "']").html(moeda.formatar(vl_total));

        var cels = $(".cf_main .month[data-column-index='" + a + "']");

        for (var b = 0; b < cels.length; b++) {
            vl_cel = moeda.desformatar($(cels[b]).text());
            vl_total += (isNaN(vl_cel) ? 0 : vl_cel);

            if (b == (cels.length - 1)) $(".cf_footercenter_view .month[data-column-index='" + a + "']").html(moeda.formatar(vl_total));
        }

        if (a == end_idx) $(".cf_footerright.total").html(moeda.formatar(vl_total));
    }
};

calcLineTotalsByDay = function (start_idx) {

    var end_idx = $(".cf_rightside [data-index]:last").attr('data-index') * 1;
   
    var header_total = 0;
    var footer_total = 0;
    var vl_cel = '';

    for (var a = start_idx; a <= end_idx; a++) {
        var line_total = 0;
        var cels = $(".cf_main [data-index='" + a + "'] div.month");

        for (var b = 0; b < cels.length; b++) {
            vl_cel = moeda.desformatar($(cels[b]).text());
            line_total += (isNaN(vl_cel) ? 0 : vl_cel);

            if (b == (cels.length - 1)) $(".cf_rightside [data-index='" + a + "']").html(moeda.formatar(line_total));
        }
        
    }
};

bindClickToViewList = function (panelRender) {

    panelRender.find(".cf_leftside div.hasChild").click(function () {
        var that = $(this);
        //console.log(that);
      
        var currentPage = Mktup.getTopRender();

        if (that.hasClass("open")) {
            $(".isChild[data-id-parent='" + that.attr("data-id-parent") + "']").remove();
            that.removeClass("open");
            setFooterPosition(panelRender);
        } else {
            var params = {};
            params.id_fin_account_management = that.attr("data-id-parent") * 1;
            params.dt_entry_ini = currentPage.pageDataPaging.parameters.dt_entry_ini;
            params.dt_entry_fim = currentPage.pageDataPaging.parameters.dt_entry_fim;

            that.loader();
            SyncGetDataOn(params, 'fin_cash_flow', 'getDetailSheet', false).done(function (a_result) {
                a_result = eval('(' + a_result + ')').d;


                var dt_idx = that.attr("data-index")
                if (!$.epar(dt_idx)) dt_idx = that.parent().attr("data-index");

                if (typeof (a_result) == "object") {

                    that.addClass("open");

                    $(".cf_leftside [data-index=" + dt_idx + "]").after(a_result[0]);
                    $(".cf_main [data-index=" + dt_idx + "]").after(a_result[1]);
                    $(".cf_rightside [data-index=" + dt_idx + "]").after(a_result[2]);
                    setFooterPosition(panelRender);

                    calcLineTotalsByParent()

                }

                that.loader('end');

            });
        }
       
    });
};

bindClickChangeViewMode = function (panelRender) {

    panelRender.find('.cf_navigation .title span').unbind('click').bind('click', function () {

        var that = $(this);
        if (that.hasClass('.monthview')) {
            return;
        } else {
            $('.cf_main').loader();
            $('.day').css('display', 'none');
            $('.month').css('display', 'block');
            that.addClass('monthview');
            that.text('Visão Mensal');
            resizeScroll(panelRender, "month");
            $('.cf_main').loader('end');
        }

    });

    panelRender.find('.cf_navigation li.month').unbind('click').bind('click', function () {

       var that = $(this);
       var spans = that.find('span');
       var vl_scroll = that.attr('data-column-index') * 1 * 90;

        panelRender.find('.cf_navigation .title span').removeClass('monthview').text(spans.eq(1).text() + ' ' + spans.eq(0).text());
        
        $('.month').css('display', 'none');
        $('.day').css('display', 'block');
        that.removeClass('monthview');
        resizeScroll(panelRender, "day");

        panelRender.find('.cf_headercenter')[0].scrollLeft = panelRender.find('.display')[0].scrollLeft = panelRender.find('.cf_main_view')[0].scrollLeft = panelRender.find('.cf_footercenter')[0].scrollLeft = vl_scroll;

    });
};

resizeScroll = function (panelRender, type) {
    
    var wl;

    if (type == "day")
        wl = $('.cf_main div[data-index]:first div.day').size() * $('.cf_main div[data-index]:first div.day:first').outerWidth(true);
    else if (type == "month")
        wl = $('.cf_main div[data-index]:first div.month').size() * $('.cf_main div[data-index]:first div.month:first').outerWidth(true);

    panelRender.find('.cf_main').css('width', wl + 'px');
    panelRender.find('.cf_navigation .list').css('width', wl + 'px');
    panelRender.find('.cf_headercenter_view').css('width', wl + 'px');
    panelRender.find('.cf_footercenter_view').css('width', wl + 'px');
};

calcLineTotalsByParent = function (id_parent) {

    var start_idx = $(".cf_rightside .isChild[data-id-parent='" + id_parent + "'][data-index]:first").attr('data-index') * 1;
    var end_idx = $(".cf_rightside .isChild[data-id-parent='" + id_parent + "'][data-index]:last").attr('data-index') * 1;

    var header_total = 0;
    var footer_total = 0;
    var vl_cel = '';

    for (var a = start_idx; a <= end_idx; a++) {
        var line_total = 0;
        var cels = $(".cf_main [data-index='" + a + "'] div.month.isChild[data-id-parent='" + id_parent + "']");

        for (var b = 0; b < cels.length; b++) {
            vl_cel = moeda.desformatar($(cels[b]).text());
            line_total += (isNaN(vl_cel) ? 0 : vl_cel);

            if (b == (cels.length - 1)) $(".cf_rightside .isChild[data-id-parent='" + id_parent + "'][data-index='" + a + "']").html(moeda.formatar(line_total));
        }

    }
};
