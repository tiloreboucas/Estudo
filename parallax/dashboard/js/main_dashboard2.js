Number.prototype.toMoney = function (decimals, decimal_sep, thousands_sep) {
    var n = this,
	c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
	d = decimal_sep || ',', //if no decimal separetor is passed we use the comma as default decimal separator (we MUST use a decimal separator)

    /*
    according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
    the fastest way to check for not defined parameter is to use typeof value === 'undefined'
    rather than doing value === undefined.*/

	t = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep, //if you don't want ot use a thousands separator you can pass empty string as thousands_sep value

	sign = (n < 0) ? '-' : '',

    //extracting the absolute value of the integer part of the number and converting to string
	i = parseInt(n = Math.abs(n).toFixed(c)) + '',

	j = ((j = i.length) > 3) ? j % 3 : 0;

    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

fontResize = function (item, limite, fontSize) {
    var size = $(item).text().length;
    if (size >= limite) {
        $(item).css('font-size', fontSize);
    }
};

moeda = {
        desformatar: function (num) {
            if ($.epar(num)) {
                if (isNaN(num)) {
                    num = num.toString().replace(/\./g, '');
                    num = num.toString().replace(/\,/g, '.');
                    return parseFloat(num);
                }
                else {
                    return num;
                }
            }
            return num;
        },

        formatar: function (num) {
            if (parseFloat(num)) {
                return parseFloat(num).toMoney();

            } else {
                num = parseFloat('0.00');
                return parseFloat(num).toMoney();
            }
        },

        arredondar: function (num) {
            return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
        }
    };

    FormatMoeda = function (action, content) {
        switch (action) {
            case "formatar":
                return moeda.formatar(content);
            case "desformatar":
                return moeda.desformatar(content);
            case "arredondar":
                return moeda.arredondar(content);
            default: return content;
        }
    };

$.extend({

    epar: function (par) {
        return (par) ? par : false
    },

    MonthName: function (month, full) {
        month = month - 1;
        if (full) month = month + 12;

        var monthNames = [
		'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	    ];

        return monthNames[month];
    },

    getToday: function () {
        var hoje = new Date();
        var dia = hoje.getDate();
        var mes = hoje.getMonth();
        var ano = hoje.getFullYear();

        //O mes começa em Zero, então soma-se 1
        mes = (mes + 1);

        if (dia < 10) dia = "0" + dia;
        if (mes < 10) mes = "0" + mes;
        if (ano < 2000) ano = "19" + ano;

        return dia + "/" + mes + "/" + ano;
    }

});


function SmartBarBlock2(area, id, callback) {
    var teste = parseInt(String(Number(new Date()))) % 2;
    if (area == 'sale' && id == 1) {
        callback({ "d": "{ d: [{\"vl_total\":205.78,\"vl_control\":204.49,\"vl_bank\":7.19}]}" });
    } else if (area == 'sale' && id == 2) {
        callback({ "d": "{ d: [{\"nu_day\":21.0,\"nu_month\":48.0}]}" });
    } else if (area == 'sale' && id == 3) {
        callback({ "d": "{ d: [{\"id_item\":250,\"nu_qtd\":230.0,\"vl_total\":1.3,\"ds_product\":\"Água Mineral Crystal Spal Sem Gás 500 ml\"},{\"id_item\":9,\"nu_qtd\":11.0,\"vl_total\":77.1699999999985,\"ds_product\":\"Tequila 1800 Essentials - Teosone Edição Limitada 2011\"},{\"id_item\":1,\"nu_qtd\":6.0,\"vl_total\":100.0,\"ds_product\":\"Boné Exclusivo Hot Wheels - Mattel\"}]}" });
    } else if (area == 'sale' && id == 4) {
        callback({ "d": "{ d: [{\"year\":2012,\"month\":6,\"vl_month\":400},{\"year\":2012,\"month\":7,\"vl_month\":350},{\"year\":2012,\"month\":8,\"vl_month\":500},{\"year\":2012,\"month\":9,\"vl_month\":600}]}" });
    } else if (area == 'fin' && id == 3) {
        callback({ "d": "{ d: [{\"year\":2012,\"month\":6,\"vl_month\":1200},{\"year\":2012,\"month\":7,\"vl_month\":800},{\"year\":2012,\"month\":8,\"vl_month\":1600},{\"year\":2012,\"month\":9,\"vl_month\":1700}]}" });
    } else if (area == 'stock' && id == 1) {
        callback({ "d": "{ d: [{\"fornecedores\":3}]}" });
    } else if (area == 'stock' && id == 2) {
        callback({ "d": "{ d: [{\"year\":2012,\"month\":6,\"vl_month\":600},{\"year\":2012,\"month\":7,\"vl_month\":500},{\"year\":2012,\"month\":8,\"vl_month\":400},{\"year\":2012,\"month\":9,\"vl_month\":300}]}" });
    } else {
        callback({ "d": "{ d: [{\"vl_total\":150,\"vl_control\":204.49,\"vl_bank\":7.19}]}" });
    }
}

(function (namespace, $) {

    var Main = {
        init: function () { this.sheet(); },
        sheet: function () {

            this.Sale_Block_1(true);
            this.Sale_Block_2(true);
            this.Sale_Block_3(true);
            this.Sale_Chart();


            this.Buy_Block_1(true);
            this.Buy_Block_2(true);
            this.Buy_Block_3(true);
            this.Buy_Block_4(true);

            this.Fin_Block_1(true);
            this.Fin_Block_2(true);
            this.Fin_Block_4(true);
            this.Fin_Chart();

            this.Stock_Block_1(true);
            this.Stock_Block_2(true);
            this.Stock_ChartArea(true);
            this.Stock_ChartPie(true);

            //this.Alert_Block_1(true);

            setInterval(function () {
                Main.Sale_Block_1();
                Main.Sale_Block_2();

                Main.Buy_Block_1();
                Main.Buy_Block_2();

                Main.Fin_Block_1();
                Main.Fin_Block_2();

                Main.Stock_Block_1();

              //  Main.Alert_Block_1();
            }, 5000);

            $('section[id="main"]').show();
        },


        Sale_Block_1: function (first) {
            var result = '';

            SmartBarBlock2('sale', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var vl_day = FormatMoeda("formatar", data.vl_day).split(',');
                    var month = $.MonthName(current_date.split('/')[1] * 1, true);

                    var html_vl_billing_current_date = 'Faturamento' + '<span> (' + current_date + ')</span>'
                    var html_vl_billing = '<em>R$</em> <span class="valor"><span>45</span>,<em>17</em></span>';
                    var html_vl_billing_month = '<span class="currentMonth">Outubro:</span> <em>R$</em> <span class="valor"><span>53</span>,<em>28</em></span>'

                    result += ' <div id="sale_block_1_month" class="title" title="Valor em reais dos produtos que você já vendeu">' + html_vl_billing_current_date + '</div>';
                    result += ' <div id="sale_block_1_billing" class="sale_value" title="Valor em reais dos produtos que você já vendeu">' + html_vl_billing + '</div>';
                    result += ' <div id="sale_block_1_billing_month" class="sale_total" title="Valor em reais das vendas realizadas esse mês">' + html_vl_billing_month + '</div>';

                    if (first) {
                        $('.dashboard_block #sale_block_1').html(result);
                    } else {
                        /* Faturamento Diario */
                        var num = parseInt((parseInt(String(Number(new Date()))[12]) / 2));
                        var vendas = parseInt($('#sale_block_1_billing span.valor span').text());
                        var centavos = parseInt($('#sale_block_1_billing span.valor em').text()) * 2;
                        
                        centavos = centavos.toString();
                        
                        //console.log(centavos, centavos.length);

                        if(centavos.length > 2) centavos = centavos.substring(centavos.length - 2, centavos.length);

                        //console.log(centavos);

                        vendas += num;

                        var txtvendas = FormatMoeda("formatar", vendas).split(',')[0];

                        $('#sale_block_1_billing').fadeOut('fast', function(){
                            $(this).find('span.valor span').text(txtvendas);
                            $(this).find('span.valor em').text(centavos);
                            $(this).fadeIn();
                        });

                        /* Faturamento Mensal */
                        var centavosVendas = parseInt(parseInt(centavos) * 1.2);
                        centavosVendas = centavosVendas.toString();

                        if(centavosVendas.length > 2) centavosVendas = centavosVendas.substring(centavosVendas.length - 2, centavosVendas.length);

                        var valorVendas = parseInt(vendas * 1.2);
                        valorVendas = valorVendas.toString();
                        
                        var txtValorVendas = FormatMoeda("formatar", valorVendas).split(',')[0]; 

                        $('#sale_block_1_billing_month span.valor span').text(txtValorVendas);
                        $('#sale_block_1_billing_month span.valor em').text(centavosVendas);
                    }
                    fontResize("#sale_block_1_billing em + span", 7, "25px");
                }
            });
        },

        Sale_Block_2: function (first) {
            var result = '';

            SmartBarBlock2('sale', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var nu_month = FormatMoeda("formatar", parseFloat(data.nu_month)).split(',');
                    var nu_day = FormatMoeda("formatar", parseFloat(data.nu_day)).split(',');
                    var month = $.MonthName(current_date.split('/')[1] * 1, true);

                    var html_vl_sale_date = 'Vendas<span> (' + current_date + ')</span>';
                    var html_vl_sale_day = '<em></em> <span>' + nu_day[0] + '</span> <em></em>';
                    var html_vl_sale_month = '<span class="currentMonth">Outubro:</span> <em></em> <span>' + nu_month[0] + '</span><em></em>'

                    result += ' <div id="sale_block_2_date" class="title" title="">' + html_vl_sale_date + '</div>';
                    result += ' <div id="sale_block_2_day" class="sale_value" title="Número de vendas realizadas hoje">' + html_vl_sale_day + '</div>';
                    result += ' <div id="sale_block_2_month" class="sale_total" title="Número de vendas realizadas esse mês">' + html_vl_sale_month + '</div>';

                    if (first) {
                        $('.dashboard_block #sale_block_2').html(result);
                    }
                    else {

                        var tmp_html_sale_block_2 = $('#sale_block_2_date');
                        if (tmp_html_sale_block_2.html() != html_vl_sale_date) {
                            tmp_html_sale_block_2.html(html_vl_sale_date)
                        }

                        var tmp_html_sale_block_2 = $('#sale_block_2_day');

                        var num = parseInt(String(Number(new Date()))[12]);

                        /* Simula Venda */
                        var vendas = parseInt(tmp_html_sale_block_2.text());

                        vendas += num;

                        tmp_html_sale_block_2.fadeOut('fast').html("<em></em><span>" + vendas + "</span><em></em>").fadeIn();

                        var tmp_html_sale_block_2 = $('#sale_block_2_month');

                        var vendas = parseInt(tmp_html_sale_block_2.find('span').eq(1).text());
                        vendas += num;
                        
                        tmp_html_sale_block_2.find('span').eq(1).text(vendas);

                        //$('.dashboard_block #sale_block_2').fadeOut().html('').html(result).fadeIn();

                    }
                }
            });
        },

        Sale_Block_3: function (first) {
            var result = '';

            SmartBarBlock2('sale', 3, function (data) {

                if ($.epar(data)) {

                    result += ' <div class="title" title="Veja os produtos que você mais vendeu esse mês">Produtos<span title="Veja os produtos que você mais vendeu esse mês"> (mais vendidos)</span></div>';
                    result += ' <table>';
                    result += '  <tr>';
                    result += '   <th width="120"><span>Produto</span></th><th width="50"><span title="Quantidade vendida">Qtd</span></th><th><span>Valor</span></th>';
                    result += '  </tr>';
                    result += '  <tr>';
                    result += '   <td> </td><td> </td><td> </td>';
                    result += '  </tr>';

                    var rows = eval(data.d);
                    for (r in rows) {
                        result += '   <tr><td><span title=' + rows[r].ds_product + '>' + rows[r].ds_product + '</span></td><td title="">' + FormatMoeda("formatar", rows[r].nu_qtd).split(',')[0] + '</td><td title="">' + FormatMoeda("formatar", rows[r].vl_total) + '</td></tr>';
                    }

                    result += ' </table>';

                    if (first)
                        $('.dashboard_block #sale_block_3').html(result);
                    else
                        $('.dashboard_block #sale_block_3').hide().html('').html(result).fadeIn(2800);
                }
            });
        },

        Sale_Chart: function () {
            $('.billing_chart').prepend('<div class="title" title="Valor faturado">Histórico de Faturamento</div>');
            $('.financial_chart').prepend('<div class="title" title="Aqui você podde acompanhar como tem sido seu Lucro ao longo dos meses">Evolução do Resultado</div>');
            $('.provider').prepend('<div class="title" title="Participação em % dos seus fornecedores">Fornecedores</div>');
            $('.cost').prepend('<div class="title" title="Evolução do custo total em reais do estoque armazenado nos meses">Custo de Estoque</div>');
            $('.dashboard_sales').prepend('<div class="header" title="Aqui você pode acompanhar como tem sido suas vendas em R$ ao longo dos meses">Vendas</div>');
            $('.dashboard_buy').prepend('<div class="header">Compras</div>');
            $('.dashboard_financial').prepend('<div class="header">Financeiro</div>');
            $('.dashboard_stock').prepend('<div class="header">Estoque</div>');

            SmartBarBlock2('sale', 4, function (data) {

                if ($.epar(data)) {
                    var months = [];
                    var values = [];
                    var rows = eval(data.d);

                    for (r in rows) {
                        months.push($.MonthName(rows[r].month, false));
                        values.push(parseFloat(rows[r].vl_month));
                    }

                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'sale-chart', type: 'column', backgroundColor: '#bcc7cb', borderColor: '#6b9c2b' },
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
                            data: values
                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }
            });
        },

        Buy_Block_1: function (first) {
            var result = '';

            SmartBarBlock2('purchase', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var month = $.MonthName(current_date.split('/')[1] * 1, true);

                    var html_vl_buy_block_month = 'Total <span class="currentMonth">Outubro</span>';
                    var html_vl_buy_block_total = '<em class="first">R$</em> <span>285</span>, <em class="last">37</em>'

                    result += ' <div id="buy_block_1_month" class="title" title="Total em reais de compras realizadas">' + html_vl_buy_block_month + '</div>';
                    result += ' <div id="buy_block_1_total" class="total" title="Valor em reais comprado esse mês">' + html_vl_buy_block_total + '</div>';

                    if (first) {
                        $('.dashboard_block #buy_block_1').html(result);
                    }
                    else {
                        var tmp_html_sale_block_2 = $('#buy_block_1_month')
                        if (tmp_html_sale_block_2.text() != $(html_vl_buy_block_month).text()) {
                            tmp_html_sale_block_2.html(html_vl_buy_block_month);
                        }

                        var tmp_html_sale_block_2 = $('#buy_block_1_total')
                        /*if (tmp_html_sale_block_2.text() != $(html_vl_buy_block_total).text()) {
                            tmp_html_sale_block_2.hide();
                            tmp_html_sale_block_2.empty();
                            tmp_html_sale_block_2.html(html_vl_buy_block_total);
                            tmp_html_sale_block_2.fadeIn(2800);
                        }*/

                        //tmp_html_sale_block_2.find('span').text('578');
                        //$('.dashboard_block #buy_block_1').fadeOut().empty().html(result).fadeIn();
                    }
                    fontResize("#buy_block_1_total em + span", 7, "25px");
                }
            });
        },


        Buy_Block_2: function (first) {
            var result = '';

            SmartBarBlock2('purchase', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var vl_down_stock = FormatMoeda("formatar", data.vl_down_stock);
                    //var vl_down_stock = FormatMoeda("formatar", data.vl_down_stock).split(',');

                    var html_vl_down_stock = '<span class="first">' + vl_down_stock[0] + '</span>';

                    result += '<span class="last" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos.">Abaixo do estoque mínimo</span><span id="buy_block_2_products" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos.">' + html_vl_down_stock + '</span> <span class="second" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos.">produtos</span>';

                    if (first) {
                        $('.dashboard_block #buy_block_2').html(result);
                    }
                    else {
                        var tmp_html_stock = $('#buy_block_2_products');
                        /*if (tmp_html_stock.html() != html_vl_down_stock) {
                            tmp_html_stock.hide();
                            tmp_html_stock.empty();
                            tmp_html_stock.html(html_vl_down_stock);
                            tmp_html_stock.fadeIn(2800);
                        }*/
                        tmp_html_stock.find('.first').text('158');
                        //$('.dashboard_block #buy_block_2').fadeOut().empty().html(result).fadeIn();
                    }

                }
            });
        },

        Buy_Block_3: function (first) {
            var result = '';

            var current_date = $.getToday();

            var nu_orders = "153";

            result += ' <div class="receive" title="Quantidade de pedidos não recebidos">A receber até hoje<span class="first" title="Valor total dos produtos em pedidos não recebidos">' + nu_orders + ' <span title="Valor total dos produtos em pedidos não recebidos">Pedidos</span></span></div>';

            $('.dashboard_block #buy_block_3').hide().html('').html(result).fadeIn(2800);
        },

        Buy_Block_4: function (first) {
            var result = '';

            var vl_total = ["1.365", "24"];

            result += ' <div class="total"><span class="first" title="Valor total dos produtos em pedidos não recebidos">Valor a receber</span> <span class="valor"><em class="first">R$</em> <span class="last">' + vl_total[0] + '</span><em class="last">,' + vl_total[1] + '</em></span></div>';
            
            $('.dashboard_block #buy_block_4').html(result);
        },

        Stock_Block_1: function (first) {
            var result = '';

            //var vl_down_stock = FormatMoeda("formatar", data.vl_down_stock).split(',');
                    var vl_down_stock = ["3"];

                    var html_vl_stock_block_down_stock = '<span class="last" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos.">Abaixo do estoque mínimo</span>'

                    result += html_vl_stock_block_down_stock + '<span id="stock_block_1_down_stock" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos."><span class="first">' + vl_down_stock[0] + '</span></span> <span class="second" title="Produtos que estão abaixo do estoque mínimo que você determinou no cadastro dos produtos.">Produtos</span>';

                    $('.dashboard_block #stock_block_1').html(result)
        },

        Stock_Block_2: function (first) {
            var result = '';

            result += ' <div class="title" title="Produtos estoque baixo"><span>Produtos críticos</span></div>';
            result += ' <table>';
            result += '  <tr>';
            result += '   <th width="120"><span>Produto</span></th><th width="50"><span>Saldo</span></th><th><span>Dias</span></th>';
            result += '  </tr>';
            result += '  <tr>';
            result += '   <td> </td><td> </td><td> </td>';
            result += '  </tr>';

            result += '   <tr><td><span title="">Chocolate Bis</span></td><td title="">7</td><td title="Dias em média para terminar o seu estoque">2</td></tr>';
            result += '   <tr><td><span title="">Desodorante Dove</span></td><td title="">10</td><td title="Dias em média para terminar o seu estoque">3</td></tr>';
            result += '   <tr><td><span title="">Guaraná Dolly</span></td><td title="">4</td><td title="Dias em média para terminar o seu estoque">1</td></tr>';

            result += ' </table>';

            $('.dashboard_block #stock_block_2').html(result);
        },

        Stock_ChartArea: function () {

            SmartBarBlock2('stock', 2, function (data) {

                if ($.epar(data)) {
                    var months = [];
                    var values = [];
                    var rows = eval(data.d);

                    for (r in rows) {
                        months.push($.MonthName(rows[r].month, false));
                        values.push(parseFloat(rows[r].vl_month));
                    }

                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'stock-chart', type: 'area', backgroundColor: '#bcc7cb', colors: '#6b9c2b' },
                        credits: { text: null, href: null },
                        title: { text: null },
                        xAxis: {
                            min: 0,
                            categories: months,
                            labels: {
                                style: {
                                    color: '#fff',
                                    font: 'bold 9px Arial, Verdana, sans-serif',
                                    textTransform: 'uppercase'
                                }
                            }
                        },
                        colors: ['#f20404'],
                        yAxis: {
                            min: 0,
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
                                return '' + this.x + ': R$ ' + FormatMoeda("formatar", this.y) + '';
                            }
                        },
                        plotOptions: {
                            column: { pointPadding: 0.2, borderWidth: 0 }
                        },
                        series: [{
                            name: 'Custo do Estoque',
                            data: values
                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }
            });
        },

        Stock_ChartPie: function () {

            SmartBarBlock2('stock', 1, function (data) {

                if ($.epar(data)) {
                    var values = [];
                    var rows = eval(data.d);

                    for (r in rows) {
                        var names = [];
                        names.push(rows[r].name);
                        names.push(parseFloat(rows[r].value * 100));
                        values.push(names);
                    }

                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'chart-pizza', type: 'pie', backgroundColor: '#fff', colors: '#6b9c2b', plotShadow: false },
                        credits: { text: null, href: null },
                        title: { text: null },
                        legend: { enabled: false, text: null },
                        tooltip: {
                            formatter: function () {
                                return '' + this.point.name + ': ' + moeda.formatar(this.point.percentage) + ' %';
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: false,
                                cursor: 'pointer',
                                dataLabels: { enabled: false }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: 'Browser share',
                            data: [
                                ['Martins',   45.0],
                                ['Atacadão',       26.8],
                                {
                                    name: 'CBD',
                                    y: 12.8,
                                    sliced: true,
                                    selected: true
                                },
                                ['Ciro',    8.5],
                                ['Makro',     6.2],
                                ['Walmart',   0.7]
                            ]
                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }

            });
        },

        Fin_Block_1: function (first) {
            var result = '';

            SmartBarBlock2('fin', 1, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];

                    var current_date = $.getToday();
                    var vl_month = FormatMoeda("formatar", data.vl_month).split(',');
                    var vl_day = FormatMoeda("formatar", data.vl_day).split(',');
                    var month = $.MonthName(current_date.split('/')[1] * 1, true);

                    //Aqui é onde se faz a magica do mal :-)
                    var html_vl_day = '<em>R$</em> <span class="valor"><span>23</span>,<em>35</em></span>';
                    var html_vl_month = '<span class="currentMonth">Outubro:</span> <em>R$</em> <span class="valor"><span>29</span>,<em>67</em></span>';

                    result += ' <div class="title" title="Lucro (Receitas-Despesas) do dia até o momento">Resultado<span>(' + current_date + ')</span></div>';
                    result += ' <div id="fin_block_1_vl_day" class="sale_value" title="Lucro (Receitas-Despesas) do Dia">' + html_vl_day + '</div>';
                    result += ' <div id="fin_block_1_vl_month" class="sale_total" title="Lucro (Receitas-Despesas) no mês deOutubroaté o momento">' + html_vl_month + '</div>';


                    if (first) {
                        $('.dashboard_block #fin_block_1').html(result);
                    } else {
                        /* Faturamento Diario */
                        var num = parseInt((parseInt(String(Number(new Date()))[12]) / 2));
                        var vendas = parseInt($('#fin_block_1_vl_day span.valor span').text());
                        var centavos = parseInt($('#fin_block_1_vl_day span.valor em').text()) * 2;
                        
                        centavos = centavos.toString();
                        
                        if(centavos.length > 2) centavos = centavos.substring(centavos.length - 2, centavos.length);

                        vendas += num;

                        var txtvendas = FormatMoeda("formatar", vendas).split(',')[0];

                        $('#fin_block_1_vl_day').fadeOut('fast', function(){
                            $(this).find('span.valor span').text(txtvendas);
                            $(this).find('span.valor em').text(centavos);
                            $(this).fadeIn();
                        });

                        /* Faturamento Mensal */
                        var centavosVendas = parseInt(parseInt(centavos) * 1.2);
                        centavosVendas = centavosVendas.toString();

                        if(centavosVendas.length > 2) centavosVendas = centavosVendas.substring(centavosVendas.length - 2, centavosVendas.length);

                        var valorVendas = parseInt(vendas * 1.2);
                        valorVendas = valorVendas.toString();
                        
                        var txtValorVendas = FormatMoeda("formatar", valorVendas).split(',')[0]; 

                        $('#fin_block_1_vl_month span.valor span').text(txtValorVendas);
                        $('#fin_block_1_vl_month span.valor em').text(centavosVendas);
                    }
                    fontResize("#fin_block_1_vl_day em + span", 7, "25px");
                    //$('.dashboard_block #fin_block_1').fadeOut().empty().html(result).fadeIn();
                }
            });
        },

        Fin_Block_2: function (first) {
            var result = '';

            SmartBarBlock2('fin', 2, function (data) {
                if ($.epar(data)) {
                    data = eval(data.d)[0];
                    var vl_total = FormatMoeda("formatar", data.vl_total).split(',');
                    var vl_control = FormatMoeda("formatar", data.vl_control).split(',');
                    var vl_bank = FormatMoeda("formatar", data.vl_bank).split(',');

                    var html_vl_total = '<em>R$</em> <span class="valor"><span>123</span>,<em>31</em></span>';
                    var html_vl_cash = '<span>Caixa:</span> <em class="first">R$</em> <span class="valor"><span class="last">' + vl_control[0] + '</span> <em class="last">,' + vl_control[1] + '</em></span>';
                    var html_vl_bank = '<span>Bancos:</span> <em class="first">R$</em> <span class="valor"><span class="last">' + vl_bank[0] + '</span> <em class="last">,' + vl_bank[1] + '</em></span>';

                    result += ' <div class="title" title="Total de dinheiro na sua empresa (Caixas + Bancos)">Posição de caixa</div>';
                    result += ' <div id="fin_block_2_vl_total" class="value" title="Total de dinheiro na sua empresa (Caixas + Bancos)">' + html_vl_total + '</div>';
                    result += ' <div id="fin_block_2_vl_cash" class="cash" title="Total de dinheiro nos caixas da sua empresa">' + html_vl_cash + '</div>';
                    result += ' <div id="fin_block_2_vl_bank" class="bank" title="Total do dinheiro depositado nos Bancos">' + html_vl_bank + '</div>';

                    if (first) {
                        $('.dashboard_block #fin_block_2').html(result);
                    } else {
                        var num = parseInt((parseInt(String(Number(new Date()))[12]) / 2));
                        var vendas = parseInt($('#fin_block_2_vl_total span.valor span').text());
                        var centavos = parseInt($('#fin_block_2_vl_total span.valor em').text()) * 2;
                        
                        centavos = centavos.toString();
                        
                        if(centavos.length > 2) centavos = centavos.substring(centavos.length - 2, centavos.length);

                        vendas += num;

                        var txtvendas = FormatMoeda("formatar", vendas).split(',')[0];

                        $('#fin_block_2_vl_total').fadeOut('fast', function(){
                            $(this).find('span.valor span').text(txtvendas);
                            $(this).find('span.valor em').text(centavos);
                            $(this).fadeIn();
                        });
                    }
                    fontResize("#fin_block_2_vl_total em + span", 7, "20px");
                }
            });
        },

        Fin_Block_4: function (first) {
            var result = '';

            var vl_pay_day = 'R$ 37,35';
            var vl_pay_month = 'R$ 437,35';

            var vl_rec_day = 'R$ 937,35';
            var vl_rec_month = 'R$ 5.189,36';

            result += ' <div class="title">';
            result += '  <span class="pags" title="Total de Contas a Pagar">PAGS(R$)</span> <span class="recs" title="Total de Contas a Receber">RECS(R$)</span>';
            result += ' </div>';
            result += ' <p><span title="Hoje">Dia:</span> <span title="Valor a pagar Hoje">' + vl_pay_day + '</span> <span title="Valor a receber Hoje">' + vl_rec_day + '</span></p>';
            result += ' <p><span title="Mês Atual">Mês:</span> <span title="Valor a pagar nesse mês">' + vl_pay_month + '</span> <span title="Valor a receber nesse mês">' + vl_rec_month + '</span></p>';

            $('.dashboard_block #fin_block_4').hide().empty().html(result).fadeIn(2800);
        },

        Fin_Chart: function () {

            SmartBarBlock2('fin', 3, function (data) {

                if ($.epar(data)) {
                    var months = [];
                    var values = [];
                    var rows = eval(data.d);

                    for (r in rows) {
                        months.push($.MonthName(rows[r].month, false));
                        values.push(parseFloat(rows[r].vl_month));
                    }


                    chartRender = new Highcharts.Chart({
                        chart: { renderTo: 'financial-chart', type: 'line', backgroundColor: '#bcc7cb', colors: '#6b9c2b' },
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
                            min: 0,
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
                            data: values

                        }],
                        navigation: {
                            buttonOptions: { enabled: false }
                        }
                    });
                }
            });
        },

        nfs_pendentes: Boolean = false,

        GoToEntity: function (page_entity, page_id, page_value, in_form) {
            if (!$.epar(window.name)) window.name = Number(new Date());
            var isSheet = ($('section.sheet').length > 0) ? true : false,
            object_id = (isSheet ? $('section.sheet:last').attr('sheet_id') : window.name);
            if (!isSheet) {
                var object_page = sessionStorage.getItem('page_' + object_id);
                if (object_page) {
                    object_page = eval('(' + object_page + ')');
                } else {
                    object_page = {};
                    object_page.page_id = object_id;
                }
                object_page.page_entity = page_entity;
                object_page.page_id_page = page_id.toString();
                object_page.page_value = page_value.toString();
                //object_page.page_filter = page_filter.toString();
                sessionStorage.setItem('page_' + object_id, JSON.stringify(object_page));
                window.location = 'list.html';
                if (in_form) {
                    window.location = 'form.html';
                } else {
                    window.location = 'list.html';
                }
            } else {
                $('section.sheet:last').find('a.close').click();
            }
        },

        Alert_Block_1: function (first) {
            var result = '';

            if (first) {
                $.DB.request({
                    object: eval('({"parameters":{"id_nfe_send_status": -1}})'),
                    entity: 'invoice_nfe_control',
                    method: 'ListData',
                    sync: true,
                    callback: function (json) {
                        if ($.epar(json[0])) {
                            Main.nfs_pendentes = true;
                        }
                    }
                });
            } else if (Main.nfs_pendentes) {
                $('.dashboardAlert p').eq(0).text('Existem Notas Fiscais Eletrônicas pendentes de envio.')
                $('.dashboardAlert').show("slow");
                $('.dashboardAlert button, .dashboardAlert p').unbind('click').bind('click', function () {
                    Main.GoToEntity('invoice_nfe_control', 196, 0, false);
                });
            }
        }

    }
    $(document).ready(function () {
        Main.init();
    });
})(window, jQuery)

$(document).ready(function(){
    var d = new Date();
    var currentMonth = d.getMonth();
    var nameMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
   $('.currentMonth').html(nameMonth[currentMonth]); 
   console.log();
});
