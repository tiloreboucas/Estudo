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

        var attr = {
            'target': '',
            'imgLoaderWhite': '<img ' +
                'src="data:image/gif;base64,R0lGODlhEAAQAPMPALu7u5mZmTMzM93d3REREQAAAHd3' +
                'd1VVVWZmZqqqqoiIiO7u7kRERCIiIgARAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAPACwAAAAAE' +
                'AAQAEAEcPDJtyg6dUrFetDTIopMoSyFcxxD1krD8AwCkASDIlPaUDQLR6G1Cy0SgqIkE1IQGMrFAKCcGWSBzw' +
                'PAnAwarcKQ15MpTMJYd1ZyUDXSDGelBY0qIoBh/ZoYGgELCjoxCRRvIQcGD1kzgSAgAACQDxEAIfkEBQcADwAsAAA' +
                'AAA8AEAAABF3wyfkMkotOJpscRKJJwtI4Q1MAoxQ0RFBw0xEvhGAVRZZJh4JgMAEQW7TWI4EwGFjKR+CAQECjn8DoN0kwDtv' +
                'BT8FILAKJgfoo1iAGAPNVY9DGJXNMIHN/HJVqIxEAIfkEBQcADwAsAAAAABAADwAABFrwyfmColgiydpaQiY5x9' +
                'Ith7hURdIl0wBIhpCAjKIIxaAUPQ0hFQsAC7MJALFSFi4SgC4wyHyuCYNWxH3AuhSEotkNGAALAPqqkigG8MWAj' +
                'AnM4A8594vPUyIAIfkEBQcADwAsAAAAABAAEAAABF3wySkDvdKsddg+APYIWrcg2DIRQAcU6DJICjIsjBEETLEE' +
                'BYLqYSDdJoCGiHgZwG4LQCCRECEIBAdoF5hdEIWwgBJqDs7DgcKyRHZl3uUwuhm2AbNNW+LV7yd+FxEAIfkEBQcA' +
                'CAAsAAAAABAADgAABEYQyYmMoVgeWQrP3NYhBCgZBdAFRUkdBIAUguVVo1ZsWFcEGB5GMBkEjiCBL2a5ZAi+m2SAUR' +
                'ExwKqPiuCafBkvBSCcmiYRACH5BAUHAA4ALAAAAAAQABAAAARs0MnpAKDYrbSWMp0xZIvBKYrXjNmADOhAKBiQDF5gGc' +
                'ICNAyJTwFYTBaDQ0HAkgwSmAUj0OkMrkZM4HBgKK7YTKDRICAo2clAEIheKc9CISjEVTuEQrJASGcSBQcSUFEUDQUXJBgD' +
                'BW0Zj34RACH5BAUHAA8ALAAAAAAQABAAAARf8Mn5xqBYgrVC4EEmBcOSfAEjSopJMglmcQlgBYjE5NJgZwjCAbO4YBAJjp' +
                'IjSiAQh5ayyRAIDKvJIbnIagoFRFdkQDQKC0RBsCIUFAWsT7RwG410R8HiiK0WBwJjFBEAIfkEBQcADgAsAQABAA8ADwAABF' +
                'rQybEWADXJLUHHAMJxIDAgnrOo2+AOibEMh1LN62gIxphzitRoCDAYNcNN6FBLShao4WzwHDQKvVGhoFAwGgtFgQHENhoB7nCwH' +
                'RAIC0EyUcC8Zw1ha3NIRgAAIfkEBQcADwAsAAAAABAAEAAABGDwyfnWoljaNYYFV+Zx3hCEGEcuypBtMJBISpClAWLfWODymI' +
                'FiCJwMDMiZBNAAYFqUAaNQ2E0YBIXGURAMCo1AAsFYBBoIScBJEwgSVcmP0li4FwcHz+FpCCQMPCFINxEAIfkEBQcADgAsAAA' +
                'BABAADwAABFzQyemWXYNqaSXY2vVtw3UNmROM4JQowKKlFOsgRI6ASQ8IhSADFAjAMIMAgSYJtByxyQIhcEoaBcSiwegpDgvAw' +
                'SBJ0AIHBoCQqIAEi/TCIAABGhLG8MbcKBQgEQAh+QQFBwAPACwAAAEAEAAPAAAEXfDJSd+qeK5RB8fDRRWFspyotAAfQBbfNLCV' +
                'USSdKDV89gDAwcFBIBgywMRnkWBgcJUDKSZRIKAPQcGwYByAAYTEEJAAJIGbATEQ+B4ExmK9CDhBd8ThdHw/AmUYEQAh+QQFBwAP' +
                'ACwAAAEADwAPAAAEXvBJQIa8+ILSspdHkXxS9wxF4Q3L2aTBeC0sFjhAtuyLIjAMhYc2GBgaSKGuyNoBDp7czFAgeBIKwC6kWCAMx' +
                'USAFjtNCAAFGGF5tCQLAaJnWCTqHoREvQuQJAkyGBEAOw==" alt="Img Loader"' +
            ' />',
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

        var methods = {
            init: function (options) {
                if ($(this).parent().find('.loader_container').size() > 0) return false;

                this.attr = $.extend(true, options, attr);
                this.attr.target = $(this);

                if (this.attr.imgUrl) {
                    var img = "<img src='" + this.attr.imgUrl + "' alt='' />";

                    this.attr.imgCtx = $(img).insertBefore(this.attr.target);
                } else {
                    if (this.attr.color == "black")
                        this.attr.imgCtx = $(this.attr.imgLoaderBlack).insertBefore(this.attr.target);
                    else
                        this.attr.imgCtx = $(this.attr.imgLoaderWhite).insertBefore(this.attr.target);
                }

                $(this.attr.imgCtx).wrap('<div class="loader_container" />');

                $(this.attr.imgCtx).width('16px');

                this.attr.container = $(this.attr.imgCtx).parent();

                var imgCtxSize = {
                    'width': $(this.attr.imgCtx).width(),
                    'height': $(this.attr.imgCtx).height()
                };

                this.attr.targetAttr = {
                    'width': $(this.attr.target).css('width'),
                    'height': $(this.attr.target).css('height'),
                    'marginLeft': $(this.attr.target).css('margin-left'),
                    'marginRight': $(this.attr.target).css('margin-right'),
                    'marginTop': $(this.attr.target).css('margin-top'),
                    'marginBottom': $(this.attr.target).css('margin-bottom'),
                    'float': $(this.attr.target).css('float'),
                    'verticalAlign': $(this.attr.target).css('vertical-align'),
                    'textAlign': $(this.attr.target).css('text-align'),
                    'display': $(this.attr.target).css('display'),
                    'position': $(this.attr.target).css('position'),
                    'left': $(this.attr.target).css('left'),
                    'top': $(this.attr.target).css('top'),
                    'right': $(this.attr.target).css('right'),
                    'bottom': $(this.attr.target).css('bottom')
                };

                (this.attr.container).css({
                    'width': this.attr.targetAttr.width,
                    'height': this.attr.targetAttr.height,
                    'margin-left': this.attr.targetAttr.marginLeft,
                    'margin-right': this.attr.targetAttr.marginRight,
                    'margin-top': this.attr.targetAttr.marginTop,
                    'margin-bottom': this.attr.targetAttr.marginBottom,
                    'float': this.attr.targetAttr.float,
                    'vertical-align': this.attr.targetAttr.verticalAlign,
                    'text-align': this.attr.targetAttr.textAlign,
                    'display': this.attr.targetAttr.display,
                    'position': this.attr.targetAttr.position,
                    'left': this.attr.targetAttr.left,
                    'top': this.attr.targetAttr.top,
                    'right': this.attr.targetAttr.right,
                    'bottom': this.attr.targetAttr.bottom
                });

                $(this.attr.target).css({ 'visibility': 'hidden', 'display': 'none' });

                $(this.attr.target).attr('data-isloading', 'true');
            },
            end: function () {
                $(this.attr.container).remove();

                $(this.attr.target).css({
                    'visibility': 'visible',
                    'display': this.attr.targetAttr.display
                });

                $(this.attr.target).attr('data-isloading', 'false');
            }
        }

        if (methodName != '') {
            if (methods[methodName]) {
                return this.each(function () {
                    methods[methodName].call(this, params);
                });
            }
            else {
                $.error("Method '" + methodName + "' does not exist on jQuery.Loader");
                return;
            }
        }

        return this.each(function () {
            methods.init.call(this, options);
        });
    };
})(jQuery)