//Funçoes Globais
$.extend({

    epar: function (par) {
        if (isNaN(par) || par == null || typeof (par) == "boolean") {
            return (par) ? par : false;
        } else {
            return String(par);
        }
    },

    isArray: function (a) {
        return Object.prototype.toString.apply(a) === '[object Array]';
    },

    loadHTMLFile: function (template_url, sync, callback) {
        var resp = '';
        if (!$.epar(sync)) sync = true;

        $.ajax({
            url: template_url,
            async: !sync,
            success: function (ret) {
                resp = ret;
                if (callback) callback(ret);
            }
        });
        return resp;
    },

    loadJSFile: function (folder, name) {
        var defCommom_loadJSFile = new $.Deferred();

        if ($('head').find('script[src="js/' + folder + '/' + name + '.js"]').size() == 0) {
            var tag = document.createElement("script"),
            head = document.getElementsByTagName('head')[0];
            
            tag.src = 'js/' + folder + '/' + name + '.js';
            tag.type = "text/javascript";
            tag.onload = function () {
                defCommom_loadJSFile.resolve(true);
            };
            
            head.appendChild(tag);

        } else {
            defCommom_loadJSFile.resolve(true);
        }
        return defCommom_loadJSFile.promise();
    },

    loadCSSFile: function (module_name) {

        var defCommom_loadCSSFile = new $.Deferred();

        if ($('head').find('link[href="css/' + module_name + '.css"]').size() == 0) {
            $('head').append('<link href="css/' + module_name + '.css" rel="stylesheet" type="text/css" />');
        }
              
        defCommom_loadCSSFile.resolve(true);
        return defCommom_loadCSSFile.promise();
    },

    loadFBP: function (pageEntity) {

        pageEntity = pageEntity.toString().toLowerCase();
        var defCommon_loadFBP = new $.Deferred(),
        fbpObject = null;

        //Load FBP
        $.getScript('fbp/fbp_' + pageEntity + '.js')
            .done(function () {
                fbpObject = eval('fbp_' + pageEntity);
                eval('delete fbp_' + pageEntity);
                defCommon_loadFBP.resolve(fbpObject);
            })
            .fail(function (err) {
                defCommon_loadFBP.resolve(fbpObject)
            });

        return defCommon_loadFBP.promise();
    },

    loadModule: function (container, module_name) {

        var defCommom_loadModule = new $.Deferred();

        if ($('head').find('link[href="css/' + module_name + '.css"]').size() == 0) {
            $('head').append('<link href="css/' + module_name + '.css" rel="stylesheet" type="text/css" />');
        }

        if ($('head').find('script[src="js/mylibs/modules/' + module_name + '.js"]').size() == 0) {

            var tag = document.createElement("script"),
            head = document.getElementsByTagName('head')[0];

            tag.src = 'js/mylibs/modules/' + module_name + '.js';
            tag.type = "text/javascript";
            tag.onload = function () {
                $.ajax({
                    url: 'modules/' + module_name + '.html',
                    async: false,
                    success: function (ret_html) {
                        container.html(ret_html);
                        eval(module_name + '_init(container)');
                        defCommom_loadModule.resolve(true);
                    }
                });
            };
           
            head.appendChild(tag);

        } else {
            $.ajax({
                url: 'modules/' + module_name + '.html',
                async: false,
                success: function (ret_html) {
                    container.html(ret_html);
                    eval(module_name + '_init(container)');
                    defCommom_loadModule.resolve(true);
                }
            });
        }

        return defCommom_loadModule.promise();
    },

    roundValue: function (val) {
        val = parseFloat(val);
        val = Math.round(val * 100) / 100;
        val = val.toString();

        if (val.indexOf(".") < 0) {
            val += ".00"
        } else {
            var dec = val.substring(val.indexOf(".") + 1, val.length)
            if (dec.length > 2)
                val = val.substring(0, val.indexOf(".")) + "." + dec.substring(0, 2)
            else if (dec.length == 1)
                val = val + "0"
        }

        return val;
    },

    isDate: function (txtDate) {
        var currVal = txtDate;
        if (currVal == '')
            return false;

        //Declare Regex 
        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/,
        dtArray = currVal.match(rxDatePattern); // is format OK?

        if (dtArray == null)
            return false;

        dtDay = dtArray[1];
        dtMonth = dtArray[3];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    },

    getToday: function (par_date) {

        var hoje = ($.epar(par_date) ? par_date : new Date());
        var dia = hoje.getDate();
        var mes = hoje.getMonth();
        var ano = hoje.getFullYear();

        //O mes começa em Zero, então soma-se 1
        mes = (mes + 1);

        if (dia < 10) dia = "0" + dia;
        if (mes < 10) mes = "0" + mes;
        if (ano < 2000) ano = "19" + ano;

        return dia + "/" + mes + "/" + ano;
    },

    dataFilled: function (has_data_param) {
        return ($.epar(has_data_param) && $.epar(has_data_param.d) && (has_data_param.d.length > 0));
    },

    encodeCustomSelectItem: function (pText) {
        return ($.epar(pText) ? pText.replace(/\,/g, '&#44;').replace(/\|/g, '&#124;') : '');
    },

    DbPramDateFormat: function (pDate) {
        var k = pDate.split('-');
        return k[2] + '/' + k[1] + '/' + k[0];
    },

    DbDateFormat: function (pDate) {
        var k = pDate.split('-');
        return k[1] + '/' + k[0] + '/' + k[2];
    },

    DateFormatToDb: function (pDate) {
        var k = pDate.split('/');
        return k[1] + '-' + k[0] + '-' + k[2];
    },

    DateFormatToDbParam: function (pDate) {
        var k = pDate.split('/'),
        k2 = pDate.split('-');

        if (Object.prototype.toString.apply(k) === '[object Array]' && k.length == 3)
            return k[2] + '-' + k[1] + '-' + k[0];
        
        if (Object.prototype.toString.apply(k2) === '[object Array]' && k2.length == 3)
            return k2[2] + '-' + k2[0] + '-' + k2[1];
    },

    DateToInt: function (pDate) {
        var k = pDate.split('/'),
        k2 = pDate.split('-');

        if (Object.prototype.toString.apply(k) === '[object Array]' && k.length == 3)
            return k[2] * 1 + k[1] * 1 + k[0] * 1;
       
        if (Object.prototype.toString.apply(k2) === '[object Array]' && k2.length == 3)
            return k2[2] * 1 + k2[0] * 1 + k2[1] * 1;
    }

});

$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};

//Prototype extensions
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var res = new Array(),
        thisp = arguments[1];

        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }

        return res;
    };
}

// Modifica objeto number para adicionar um metodo para formatar valor monetario
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
}

function dateAddExtention(p_Interval, p_Number) {
    var thing = new String();


    //in the spirt of VB we'll make this function non-case sensitive
    //and convert the charcters for the coder.
    p_Interval = p_Interval.toLowerCase();

    if (isNaN(p_Number)) {

        //Only accpets numbers
        //throws an error so that the coder can see why he effed up
        throw "The second parameter must be a number. \n You passed: " + p_Number;
        return false;
    }
    p_Number = new Number(p_Number);
    switch (p_Interval.toLowerCase()) {
        case "yyyy":
            {// year
                this.setFullYear(this.getFullYear() + p_Number);
                break;
            }
        case "q":
            {        // quarter
                this.setMonth(this.getMonth() + (p_Number * 3));
                break;
            }
        case "m":
            {        // month
                this.setMonth(this.getMonth() + p_Number);
                break;
            }
        case "y":        // day of year
        case "d":        // day
        case "w":
            {        // weekday
                this.setDate(this.getDate() + p_Number);
                break;
            }
        case "ww":
            {    // week of year
                this.setDate(this.getDate() + (p_Number * 7));
                break;
            }
        case "h":
            {        // hour
                this.setHours(this.getHours() + p_Number);
                break;
            }
        case "n":
            {        // minute
                this.setMinutes(this.getMinutes() + p_Number);
                break;
            }
        case "s":
            {        // second
                this.setSeconds(this.getSeconds() + p_Number);
                break;
            }
        case "ms":
            {        // second
                this.setMilliseconds(this.getMilliseconds() + p_Number);
                break;
            }
        default:
            {

                //throws an error so that the coder can see why he effed up and
                //a list of elegible letters.
                throw "The first parameter must be a string from this list: \n" +
                    "yyyy, q, m, y, d, w, ww, h, n, s, or ms. You passed: " + p_Interval;
                return false;
            }
    }
    return this;
}
Date.prototype.dateAdd = dateAddExtention;

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    shortDbDate: "mm-dd-yyyy",
    shortDbDateTime: "mm-dd-yyyy HH:MM:ss"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab",
		"Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"
	],
    monthNames: [
		"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
		"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
	]
};

NumberPadLeft = function (pNumber, pWidth, pChar) {
    if (!pChar) pChar = "0";
    pNumber = "" + pNumber;

    if (pNumber.length >= (pWidth * 1)) {
        return "" + pNumber;
    } else {
        while (pNumber.length < (pWidth * 1)) { pNumber = pChar + pNumber };
        return pNumber;
    }
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

Number.prototype.padLeft = function (pWidth, pChar) {
    return NumberPadLeft(this, pWidth, pChar);
};

moeda = {
    desformatar: function (num) {
        if ($.epar(num)) {
            if (isNaN(num)) {
                num = num.toString().replace(/\./g, '');
                num = num.toString().replace(/\,/g, '.');
                num = num.toString().replace('R$', '');
                num = num.toString().trim();
                return parseFloat(num);
            }
            else {
                return num;
            }
        }
        return num;
    },

    formatar: function (num, currency) {
        if (parseFloat(num)) {
            if (currency) {
                return Mktup.getCurrentCurrency() + ' ' + parseFloat(num).toMoney();
            } else {
                return parseFloat(num).toMoney();
            }

        } else {
            num = parseFloat('0.00');
            if (currency) {
                return Mktup.getCurrentCurrency() + ' ' + parseFloat(num).toMoney();
            } else {
                return parseFloat(num).toMoney();
            }
        }
    },

    arredondar: function (num) {
        return Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2);
    }
}


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
}

FormatDate = function (date) {
    k = date;
    k = k.split('/');
    g = k[1] + '-' + k[0] + '-' + k[2];
    return g;
}

FormatDateToBr = function (date) {
    k = date;
    k = k.split('-');
    g = k[1] + '/' + k[0] + '/' + k[2];
    return g;
}

NumFormat = function (num) {
    x = 0;
    if (num < 0) {
        num = Math.abs(num);
        x = 1;
    }
    if (isNaN(num)) num = '0';
    num = Math.floor((num * 100 + 0.5) / 100).toString();
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
    if (x == 1) num = ' – ' + num; return num;
}

// Source: http://stackoverflow.com/questions/497790
var dateTool = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}

// Funcoes Acessiveis em Mais de um Modulo do Sistema
CalculaParcelas = function (PaymentCondition, Value) {

    var data_atual = new Date();

    if ($.epar(PaymentCondition)) {
        var InstallmentValue = $.roundValue(parseFloat(Value / parseInt(PaymentCondition.nu_installments)));
        var FirstValue = $.roundValue(parseFloat(InstallmentValue) + parseFloat($.roundValue((Value - (parseInt(PaymentCondition.nu_installments) * InstallmentValue)))));
        var FirstDate = data_atual.dateAdd('d', parseInt(PaymentCondition.nu_days_interval_first));
        var Installments = [];

        Installments.push({ "nu_installment": 1, "dt_installment": FirstDate.format('shortDbDate'), "vl_installment": FirstValue });

        for (var i = 2; i <= PaymentCondition.nu_installments; i++) {
            FirstDate = FirstDate.dateAdd('d', parseInt(PaymentCondition.nu_days_interval));
            Installments.push({ "nu_installment": i, "dt_installment": FirstDate.format('shortDbDate'), "vl_installment": InstallmentValue });
        }

        return Installments;
    } else {
        return [];
    }

};

SyncFinancePDVPayments = function (id_pdv, arrPayments) {

    var SFPP_def = $.Deferred();

    SyncGetDataOn(eval('({d:{"parameters":{"id_pdv": ' + id_pdv + '}}})'), 'fin_account', 'ListData', false).done(function (json_ac) {
        json_ac = eval('(' + json_ac + ')').d;
        var fin_entry = null, id_fin_account = null, coupon_payment = null;
        var arrEntries = [];

        if (json_ac.length > 0) {
            id_fin_account = json_ac[0].id_fin_account;

            $(arrPayments).each(function (x) {

                coupon_payment = arrPayments[x];

                fin_entry = {};
                fin_entry.id_fin_entry = 0;
                fin_entry.id_fin_account = id_fin_account;

                if (coupon_payment.in_cd == 1) {
                    fin_entry.id_fin_account_management = 51;
                    fin_entry.id_fin_entry_type = 2;
                    fin_entry.in_cd = 1;
                    fin_entry.ds_obs = 'PAGAMENTO PDV ';
                } else {
                    fin_entry.id_fin_account_management = 36;
                    fin_entry.id_fin_entry_type = 1;
                    fin_entry.in_cd = -1;
                    fin_entry.ds_obs = 'TROCO PDV';
                }

                fin_entry.id_payment_type = coupon_payment.id_payment_type * 1;
                fin_entry.ds_nu_document = coupon_payment.id_coupon;
                fin_entry.dt_entry = coupon_payment.dt_payment;
                fin_entry.vl_entry = coupon_payment.vl_payment;

                fin_entry.nu_fin_account_destination = null;
                fin_entry.nu_fin_account_origin = null;
                fin_entry.nu_fin_entry_transfer = null;

                if (fin_entry.dt_entry.indexOf('/') > 0) {
                    var temp_date = fin_entry.dt_entry.split('/');
                    fin_entry.dt_entry = temp_date[2] + '-' + temp_date[0] + '-' + temp_date[1];
                }

                arrEntries.push(fin_entry);
            });

            if (arrEntries.length > 0) {

                SyncGetDataOn({ d: arrEntries }, 'fin_entry', 'InsertData', false).done(function (json_pdv_entries) {
                    SFPP_def.resolve(true);
                });

            } else {
                SFPP_def.resolve(true);
            }

        } else {
            SFPP_def.resolve(false);
        }
    });

    return SFPP_def.promise();
};

PDVStockMove = function (id_coupon) {

    var def_PDVStockMove = new $.Deferred();

    var params = {}; params.d = {}; params.d.parameters = {}; params.d.parameters.id_coupon = id_coupon;
    SyncGetDataOn(params, 'coupon_item', 'ListData', false).done(function (ci_result) {
        ci_result = eval('(' + ci_result + ')').d;

        if (ci_result.length > 0) {

            var stock_movement = {};
            stock_movement.id_stock_movement = 0;
            stock_movement.id_stock_movement_type = 2;
            stock_movement.dt_movement = $.DateFormatToDb($.getToday());
            stock_movement.in_es = -1;
            stock_movement.id_stock_location_origin = 1;
            stock_movement.id_coupon = id_coupon;
            stock_movement.id_omega = ClientId;

            SyncGetDataOn({ d: [stock_movement] }, 'stock_movement', 'InsertData', true).done(function (sm_insert_result) {

                if (sm_insert_result > 0) {

                    var arrMovementItem = []
                    for (var z = 0; z < ci_result.length; z++) {
                        var stock_movement_item = {};
                        stock_movement_item.id_stock_movement_item = 0;
                        stock_movement_item.id_stock_movement = sm_insert_result;
                        stock_movement_item.id_stock_location = 1;
                        stock_movement_item.id_item = ci_result[z].id_item * 1;
                        stock_movement_item.ds_item = ci_result[z]._ds_item;
                        stock_movement_item.vl_amount = ci_result[z].nf_quantity_items * 1;
                        stock_movement_item.vl_unit = ci_result[z].vl_unit_item;
                        stock_movement_item.id_omega = ClientId;

                        arrMovementItem.push(stock_movement_item);
                    }

                    SyncGetDataOn({ d: arrMovementItem }, 'stock_movement_item', 'InsertData', true).done(function (sf_result) {
                        if (sf_result) {

                            var params2 = {}; params2.d = {}; params2.d.parameters = {}
                            params2.d.parameters.id_stock_movement = sm_insert_result;

                            SyncGetDataOn(params2, 'stock_movement_item', 'ListData', false).done(function (arrItens) {

                                arrItens = eval('(' + arrItens + ')').d;
                                if (arrItens.length > 0) {

                                    var list_item = [];

                                    for (var x = 0; x < arrItens.length; x++) {

                                        var stock_room = {};
                                        var curr_date = new Date();
                                        var room_dt_movement = $.DateFormatToDb($.getToday(curr_date)) + ' ' + curr_date.getHours() + ':' + curr_date.getMinutes() + ':' + curr_date.getSeconds();

                                        stock_room.id_stock_room = 0;
                                        stock_room.id_stock_movement = arrItens[x].id_stock_movement * 1;
                                        stock_room.id_stock_movement_item = arrItens[x].id_stock_movement_item * 1;
                                        stock_room.dt_movement = room_dt_movement;
                                        stock_room.dt_expiration = arrItens[x].dt_expiration;
                                        stock_room.id_item = arrItens[x].id_item * 1;
                                        stock_room.ds_item = arrItens[x].ds_item;
                                        stock_room.ds_code_lot = arrItens[x].ds_code_lot;
                                        stock_room.vl_amount = arrItens[x].vl_amount * 1;
                                        stock_room.vl_unit = arrItens[x].vl_unit * 1;
                                        stock_room.vl_total = (arrItens[x].vl_amount * 1) * (arrItens[x].vl_unit * 1);
                                        stock_room.nu_invoice = null;
                                        stock_room.in_es = stock_movement.in_es;
                                        stock_room.id_stock_location = stock_movement.id_stock_location_origin;
                                        stock_room.vl_amount_available = null;
                                        stock_room.vl_amount_reserved = null;

                                        list_item.push(stock_room);
                                    }

                                    SyncGetDataOn({ d: list_item }, 'stock_room', 'InsertData', false).done(function (sri_result) {

                                        if (sri_result) {
                                            def_PDVStockMove.resolve(true);
                                        } else {
                                            def_PDVStockMove.resolve(false);
                                        }
                                    });

                                } else {
                                    def_PDVStockMove.resolve(false);
                                }
                            });
                        } else {
                            def_PDVStockMove.resolve(false);
                        }
                    });

                } else {
                    def_PDVStockMove.resolve(false);
                }
            });
        } else {
            def_PDVStockMove.resolve(false);
        }
    });

    return def_PDVStockMove.promise();
};


