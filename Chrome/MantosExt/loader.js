(function ($) {
    $.fn.loader = function (method) {

        var options = null;
        var methodName = '';
        var params = [];

        if (arguments.length >= 1 && typeof (arguments[0]) == 'object')
            options = arguments[0];
        else if (arguments.length >= 1 && typeof (arguments[0]) == 'string') {
            methodName = arguments[0];
            params = arguments[1];
        }

        var ld_attr = {
            'target': '',
            'imgLoaderWhite': '<img src="img/loader.gif" alt="Img Loader" />',
            'imgLoaderBlack': '<img ' +
                'src="data:image/gif;base64,R0lGODlhEAAQAPcAAAICAgEBAQQEBAMDAw4ODgUFBQgICAoKCgYGBlhYWC' +
                'kpKQ8PDxUVFQ0NDTQ0NBEREQcHB6enp8vLyx8fHyEhISUlJRsbGygoKDIyMlFRUerq6hQUFBwcHBkZGYCAgBMTE' +
                'zs7Oz8/Px4eHhcXFwkJCYGBgTo6OkhISDg4ODk5OUVFRSwsLCsrKyoqKkJCQiIiIoiIiG9vbz4+PkFBQS0tLS8vL' +
                'yMjIxoaGicnJxAQEDc3N8TExAwMDIKCgiAgIFBQUKioqElJSaCgoHBwcGRkZDMzM52dnWBgYDY2NlpaWj09PWJiYh' +
                'ISEra2tpCQkLOzs3d3d3Z2dpKSkk9PT9HR0UBAQF9fXy4uLoyMjF1dXSQkJJ+fn5eXl0pKSvv7+xgYGIODgyYmJs' +
                'PDw/Hx8XR0dK6urtvb29XV1XV1dZGRkd7e3mtra729vZWVleXl5aurqzw8PMLCwtzc3I6OjsXFxcbGxl5eXkRERHt' +
                '7e4WFhePj46WlpW5ubrCwsGVlZXFxcVRUVDU1NUdHR0xMTHh4eBYWFoSEhJSUlFZWVmhoaK+vrzExMR0dHZOTkzAwM' +
                'Hp6erm5uY+Pj1tbW9ra2qmpqeTk5Lq6ukNDQ+np6VVVVdLS0pubm+Li4rKysu7u7vz8/EZGRmZmZp6entPT04mJia' +
                'GhofDw8O/v77i4uLu7u0tLS21tbfn5+YqKildXV8DAwFxcXHNzc9TU1GFhYfT09MnJyYeHh05OTn9/f+bm5lNTU76' +
                '+vuHh4aysrKOjo8HBwa2trVJSUqampvX19X19fZqammNjY3x8fNbW1tjY2O3t7XJyck1NTd/f342Njfj4+IaGhs3Nz' +
                'dnZ2ezs7PPz8/39/efn57S0tMzMzGxsbGpqavb29sfHx9fX17W1teDg4NDQ0M/Pz1lZWff39wAAAP///wAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'ACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBQAAACwAAAAAEAAQAAAIlwABCBwIAAbBgwIdxTkB4BPCg6pMTeLh5aHACykAe' +
                'BvTY5pFAHX07FH1pMVHAJmo8KJ0kiAYHC3/UNHEzaKCFTQAlJAgAZVFDA4cvBjoxyIFgiHeWHKGcEaQEIUE7mmSBkWPMAN' +
                '/MHIxqIrAFiYARBEiDouHO4kuAbDwgSCLUk4OkPIAgAiRLwi1SNFRkO6FJVE/SkL0MCAAIfkECQUAAAAsAAAAABAAEAAACKo' +
                'AAQgcCOAYLoIIAbR4UwWAGw0AutDBkNCFrF8HKkGcNO4HQRuLAGw5QwZZM1zDdiGkFGfODCMVBNYQMwXhiU6v0iQUiABhDAo' +
                '7Cdopo0hYUAIAchzQFiECl6AAGDBAKjDDiJ05CGIgdWhIQhthfAwE42QZC2OMBH4IWUHBC4EUaABIQmgGkQQ0XCgQeIAghUdr' +
                'ACxJgGBGiJ0WVl0AcCQBAAsyqAatAmJnQAAh+QQJBQAAACwAAAAAEAAQAAAIrwABCBwIYA0fgggB2HCCBAAdCQBc9KGREEkfX' +
                'wB2SDgQR80JhBcAGHqyBNWvIWZ6ATDRQiAMI2SQgJkgsIWiE0CUdROYYs4mNAmbeNJjZeCBBBYSopAyMIgtGCUSAkBAzYuXOR' +
                'k8eCAjVSoCJV0RVvCTLUNCHgiPJMowQcUHgQdGACBA4IDALz4AyMjAIoQDABSYTEU4QpcgAHD+UhCBIOGHIElB/CUwoXFYHDak' +
                'BgQAIfkECQUAAAAsAAAAABAAEAAACKQAAQgcCMBVEoIIAVj4wwKAkAgAdLQJk7BFqxIAtkD0xUYGQQYiAITCcuvQliyQGgHAUEG' +
                'gHzQJFIQaaKONDCngdglskShWgoSiqNQCRLBKwpU9cggsYuUIrKMA5OipVAJFggQ/oHLSoKHYQAVHdRBD6AJUkYThnqnJCkCGiy' +
                'IfLhxAGI2VGYQVrowQwYCgLhAIa+AQ2BcAAqgXCCgsDBWh4oQBAQAh+QQJBQAAACwAAAAAEAAQAAAIpAABCBwIYIYKgggBfMgwAQ' +
                'AhDwBYRGmIUMSSLACgeEBQggsGggQYADhBJEWMR0EaQQGgQIRAF1PgjGQi0AIUDIR6GampYhCIhD3KABFEUEFClqsGTjABAsVRAKn' +
                'E7IhBwYGDGk93SJAAbeAIBAkX8TlA8IWWo6nU1CEKYAKFLwhDiLllideOowjASqEFBMCgQAhpDmTiZoySowQQJsmF5KljgQEBACH5' +
                'BAkFAAAALAAAAAAQABAAAAikAAEIHAhghSOCCAHwKCIwQwIAExCNSMhECQgAPx5miVEBIY+CISp0AeRgzUMfEwFoYfGiIEFXYWDlwS' +
                'OQgBYFLRESsWUIBUEGCQH4QHSgJgALQQVyMbIlCQAGDD4kLRUhAp+kAxVkQXigaEIhbIDACapEYApgd4S8ipDwU5oxGgwlOwRgxh' +
                'WE1awBMKUhB7YzSBKmwOT0lAYAGSTUwApAiJGgAQEAIfkECQUAAAAsAAAAABAAEAAACJ0AAQgcSLCgwQMArjgQiMLgQBEAaCwEEcQ' +
                'hgA8iPijA4EOFCQCFcjhEIJDHxxB2Egw8QMChCit2LlgkOELGTINDokC5c1MgHg8eAJXsUcEghRMkBQb7to2NwRJc8tQQaIbWDmZNd' +
                'Ah0FAlFj015BKaYAmCPGzBnJPxpggdAoKIDleSiAmCUBALAntAwWGRUBgCaJABQ8QbHTSwwHAYEACH5BAUFAAAALAAAAAAQABAAAAil' +
                'AAEIHEiwoMGBDAQyOkgwR0IROAgQXBFCIAIAEgHY8CHwgEA5XpoURDCBQIUUOgQewcQKkkEFJkAUbLTCIIELA0t4OsWJYZcpP6600aBB' +
                'FsNMCRKYGBiFgsEvDgh2qSUHiMEjMWa9ELhDWplLomoIxDGExaxYSwRiAAUgEp0YTyJIcmIFAE6Cgep0AtAnAoBWWLYWXHFNBQBFfnXAm' +
                'MBQIJohBwMCADs=" alt="Img Loader"' +
            ' />',
            'imgCtx': '',
            'targetAttr': null,
            'container': null
        }

        var ld_methods = {
            init: function(options) {
                //console.log($('html').attr('class'));

                if ($(this).parent().find('.loader_container').size() > 0) return false;

                this.ld_attr = $.extend(true, options, ld_attr);
                this.ld_attr.target = $(this);

                if (this.ld_attr.imgUrl) {
                    var img = "<img src='" + this.ld_attr.imgUrl + "' alt='' />";

                    this.ld_attr.imgCtx = $(img).insertBefore(this.ld_attr.target);
                } else {
                    if (this.ld_attr.color == "black")
                        this.ld_attr.imgCtx = $(this.ld_attr.imgLoaderBlack).insertBefore(this.ld_attr.target);
                    else
                        this.ld_attr.imgCtx = $(this.ld_attr.imgLoaderWhite).insertBefore(this.ld_attr.target);
                }

                $(this.ld_attr.imgCtx).wrap('<div class="loader_container" />');
                this.ld_attr.container = $(this.ld_attr.imgCtx).parent();

                this.ld_attr.container.append('<div class="loader_column" />');

                this.ld_attr.container.find('.loader_column').css({
                    'height': '100%',
                    'width': '1px',
                    'display': 'inline-block',
                    'vertical-align': 'middle'
                });

                var imgCtxSize = {
                    'width': $(this.ld_attr.imgCtx).width(),
                    'height': $(this.ld_attr.imgCtx).height()
                };

                this.ld_attr.targetAttr = {
                    'width': $(this.ld_attr.target).css('width'),
                    'height': $(this.ld_attr.target).css('height'),
                    'marginLeft': $(this.ld_attr.target).css('margin-left'),
                    'marginRight': $(this.ld_attr.target).css('margin-right'),
                    'marginTop': $(this.ld_attr.target).css('margin-top'),
                    'marginBottom': $(this.ld_attr.target).css('margin-bottom'),
                    'pFloat': $(this.ld_attr.target).css('float'),
                    'verticalAlign': $(this.ld_attr.target).css('vertical-align'),
                    'textAlign': $(this.ld_attr.target).css('text-align'),
                    'display': $(this.ld_attr.target).css('display'),
                    'position': $(this.ld_attr.target).css('position'),
                    'left': $(this.ld_attr.target).css('left'),
                    'top': $(this.ld_attr.target).css('top'),
                    'right': $(this.ld_attr.target).css('right'),
                    'bottom': $(this.ld_attr.target).css('bottom')
                };

                $(this.ld_attr.container).css({'width': this.ld_attr.targetAttr.width,  'height': this.ld_attr.targetAttr.height, 'margin-left': this.ld_attr.targetAttr.marginLeft, 'margin-right': this.ld_attr.targetAttr.marginRight, 'margin-top': this.ld_attr.targetAttr.marginTop, 'margin-bottom': this.ld_attr.targetAttr.marginBottom, 'float': this.ld_attr.targetAttr.pFloat + "", 'vertical-align': this.ld_attr.targetAttr.verticalAlign, 'text-align': 'center', 'display': this.ld_attr.targetAttr.display, 'position': this.ld_attr.targetAttr.position, 'left': this.ld_attr.targetAttr.left, 'top': this.ld_attr.targetAttr.top, 'right': this.ld_attr.targetAttr.right, 'bottom': this.ld_attr.targetAttr.bottom});
                $(this.ld_attr.target).css({ 'visibility': 'hidden', 'display': 'none' });
                $(this.ld_attr.target).attr('data-isloading', 'true');
            },
            end: function() {
                if (!this.ld_attr) return false;

                if (this.ld_attr.container == "") {

                    var that = $(this);
                    that.prev().remove();
                    that.css({ 'visibility': 'visible' });
                    that.show();
                    that.attr('data-isloading', 'false');

                } else {
                    $(this.ld_attr.container).remove();

                    $(this.ld_attr.target).css({ 'visibility': 'visible' });

                    if (this.ld_attr.targetAttr && this.ld_attr.targetAttr.display) {
                        $(this.ld_attr.target).css({ 'display': this.ld_attr.targetAttr.display });
                    }

                    $(this.ld_attr.target).attr('data-isloading', 'false');
                }
            }
        }

        if (methodName != '') {
            if (ld_methods[methodName]) {
                return this.each(function () {
                    ld_methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.Loader");
                return;
            }
        }

        return this.each(function () {
            ld_methods.init.call(this, options);
        });
    };
})(jQuery)