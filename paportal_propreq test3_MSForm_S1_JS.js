$(function () {
    
    
    $('[data-name="price_lookup_section"]').parent().hide();
    $('[data-name="subtotal_section"]').parent().show();

    

    (function (webapi, $) {
        function safeAjax(ajaxOptions) {
            var deferredAjax = $.Deferred();
            shell.getTokenDeferred().done(function (token) {
                // Add headers for ajax
                if (!ajaxOptions.headers) {
                    $.extend(ajaxOptions, {
                        headers: {
                            "__RequestVerificationToken": token
                        }
                    });
                } else {
                    ajaxOptions.headers["__RequestVerificationToken"] = token;
                }
                $.ajax(ajaxOptions)
                    .done(function (data, textStatus, jqXHR) {
                        validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                    }).fail(deferredAjax.reject); //ajax
            }).fail(function () {
                deferredAjax.rejectWith(this, arguments); // On token failure pass the token ajax and args
            });
            return deferredAjax.promise();
        }
        webapi.safeAjax = safeAjax;
    })(window.webapi = window.webapi || {}, jQuery)

    function appAjax(processingMsg, ajaxOptions) {
        return webapi.safeAjax(ajaxOptions)
            .fail(function (response) {
                if (response.responseJSON) {
                    alert("Error: " + response.responseJSON.error.message)
                } else {
                    alert("Error: Web API is not available... ")
                }
            });
    }

    $(document).ready(function () {
        debugger;
        onDisplaySectionChange();
        showHideFieldsandTab();

    });
    
    const priceArray = [-1, 1];
    const initialValue = 0;
    const sumWithInitial = priceArray.reduce((previousValue, currentValue) => previousValue + currentValue,
        initialValue
    );
    $('[data-name="subtotal_section"] > tbody').prepend('<tr><td class="clearfix cell"><h4 class="SubtotalFieldContent">' + sumWithInitial + '</h4></td></tr>');
    function showHideFieldsandTab() {
        $("#cr6a9_photography_boolean").change(onDisplaySectionChange);
        $("#cr6a9_video_boolean").change(onDisplaySectionChange);
        $("#cr6a9_floorplan_boolean").change(onDisplaySectionChange);
    }

    function onDisplaySectionChange() {
        var selectedValue = GetRadioSelectedValuePhoto($('#cr6a9_photography_boolean'));
        if (selectedValue == "0") {

            priceArray.push(0);

        } else {
            fetchPhotoPrice().done(function (data) {
                initializePhotoPrice(data);
            });
        }
    }
    GetRadioSelectedValuePhoto = function (input) {

        if (!!$(input).find("input[type=radio]")) {
            var controlName = $(input).find("input[type=radio]").first().attr("name");
            if (!!controlName) {
                return $("input[name='" + controlName + "']:checked").val();
            }
        }
        return "";
    };
    function fetchPhotoPrice() {
        return appAjax('Loading...', {
            type: "GET",
            url: `/_api/cr6a9_photo_svcs(3e12d31e-d150-ed11-bba2-0022481b5983)?$select=cr6a9_price_photo_svc_cat`,
            contentType: "application/json"
        });
    }
    function initializePhotoPrice({cr6a9_price_photo_svc_cat}) {
        priceArray.push(cr6a9_price_photo_svc_cat)
    }

    function onDisplaySectionChange() {
        var selectedValue = GetRadioSelectedValueVideo($('#cr6a9_video_boolean'));
        if (selectedValue == "0") {

            priceArray.push(0);
        } else {
            fetchVideoPrice().done(function (data) {
                initializeVideoPrice(data);
            });
        }
    }
    GetRadioSelectedValueVideo = function (input) {

        if (!!$(input).find("input[type=radio]")) {
            var controlName = $(input).find("input[type=radio]").first().attr("name");
            if (!!controlName) {
                return $("input[name='" + controlName + "']:checked").val();
            }
        }
        return "";
    };
    function fetchVideoPrice() {
        return appAjax('Loading...', {
            type: "GET",
            url: `/_api/cr6a9_video_svcs(c89461b4-f453-ed11-9562-0022481b5983)?$select=cr6a9_price_video_svc_cat`,
            contentType: "application/json"
        });
    }
    function initializeVideoPrice({cr6a9_price_video_svc_cat}) {
        priceArray.push(cr6a9_price_video_svc_cat)
    }

    function onDisplaySectionChange() {
        var selectedValue = GetRadioSelectedValueFloorplan($('#cr6a9_floorplan_boolean'));
        if (selectedValue == "0") {

            priceArray.push(0);


        } else {
            fetchFloorplanPrice().done(function (data) {
                initializeFloorplanPrice(data);
            });
        }
    }
    GetRadioSelectedValueFloorplan = function (input) {

        if (!!$(input).find("input[type=radio]")) {
            var controlName = $(input).find("input[type=radio]").first().attr("name");
            if (!!controlName) {
                return $("input[name='" + controlName + "']:checked").val();
            }
        }
        return "";
    };

    function fetchFloorplanPrice() {
        return appAjax('Loading...', {
            type: "GET",
            url: `/_api/cr6a9_floorplan_svcs(c9f71016-f553-ed11-9562-0022481b5949)?$select=cr6a9_price_floorplan_svc_cat`,
            contentType: "application/json"
        });
    }
    function initializeFloorplanPrice({cr6a9_price_floorplan_svc_cat}) {
        priceArray.push(cr6a9_price_floorplan_svc_cat)
    }


});