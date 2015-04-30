// -------------------------   Server side processesing ----------------------- //

function getDataSet(options) {
    showLoadingSpinner(true, "Loading " + options.service);
    var html = "";
    var jURL = "lib/api.xsjs";
    options.viewmode = viewmode;

    $.ajax({
        url: jURL,
        type: "GET",
        headers: {
            "SessionToken": sessionToken
        },
        data: options,
        success: function(data) {
            
            var objData = jQuery.parseJSON(data);
            
            if (options.service === "Init") {
                var objData = jQuery.parseJSON(data);
                var arrData = JSON.parse(objData.dbinfo);
                loadInstanceData(arrData);
                
                if (viewmode !== "dashboard") {
                    var arrUserData = JSON.parse(objData.userinfo);
                    loadUserData(arrUserData);
                }
                
                loadDashboards(JSON.parse(objData.dashboards));
            } else if (options.service === "InitViewMetric") {
                var objData = jQuery.parseJSON(data);
                clearTimers();
                loadMetrics(objData);
                loadClientMetrics(objData);
            } else if (options.service === "Dashboards" || options.service === "CloneDashboard" || options.service === "CreateDashboard" || options.service === "UpdateDashboard" || options.service === "DeleteDashboard") {
                var objData = jQuery.parseJSON(data);
                loadDashboards(JSON.parse(objData.dashboards));
                if (options.service === "DeleteDashboard") {
                    getContent($("#dashboards li:eq(1)").data("id"));
                }
                addNotification(objData.result, 0, true);
            } else if (options.service === "Widgets" || options.service === "CloneMetric" || options.service === "CreateMetric" || options.service === "EditMetric" || options.service === "DeleteWidget") {
                var objData = jQuery.parseJSON(data);
                clearTimers();
                loadBGImg();
                if (objData.widgetCount === 0) {
                    $("#grid").html(strNoWidgetMsg);
                } else {
                    loadMetrics(objData);
                    loadClientMetrics(objData);
                    loadGridster(true);
                }
                dashboardActive(true);
                addNotification(objData.result, 0, true);
            } else if (options.service === "RefreshWidget") {
                var elemID = "t1-widget-container" + options.strDashboardWidgetID;
                var objData = jQuery.parseJSON(data);
                if (objData.widgets !== "") {
                    $(elemID).html(objData.widgets);
                }
                loadClientMetrics(objData);
            } else if (options.service === "EditWidgetDialog") {
                showWidgetDialog(jQuery.parseJSON(data), true);
            } else if (options.service === "NewWidgetDialog") {
                showWidgetDialog(jQuery.parseJSON(data), false);
            } else if (options.service === "WidgetHistoryDialog") {
                var objData = jQuery.parseJSON(data);
                widgetHistoryChart(objData.metricHistory, objData.dashboardwidgetid, objData.startdt, objData.enddt);
            } else if (options.service === "WidgetForecastDialog") {
                var objData = jQuery.parseJSON(data);
                widgetForecastChart(objData.metricForecast, objData.dashboardwidgetid);
            } else if (options.service === "AlertHistoryDialog") {
                showAlertHistoryDialog(jQuery.parseJSON(data));
            } else if (options.service === "DeleteMetricHistory") {
                addNotification("History deleted", 3, true);
            } else if (options.service === "EditProfileDialog") {
                showProfileDialog(jQuery.parseJSON(data));
            } else if (options.service === "EditSettingsDialog") {
                showSettingsDialog(jQuery.parseJSON(data));
            } else if (options.service === "GetWidgetTypes") {
                objWidgetList = JSON.parse(data);
                showNewWidgetDialog(0);
            } else if (options.service === "Alerts" || options.service === "CreateAlert" || options.service === "EditAlert" || options.service === "DeleteAlert") {
                loadBGImg();
                var objData = jQuery.parseJSON(data);
                loadAlerts(objData);
                addNotification(objData.result, 0, true);
            } else if (options.service === "AddAlertDialog") {
                showAlertDialog(jQuery.parseJSON(data), false);
            } else if (options.service === "EditAlertDialog") {
                showAlertDialog(jQuery.parseJSON(data), true);
            } else if (options.service === "SetAlert") {
                loadAlerts(jQuery.parseJSON(data));
                addNotification("Alert Status Set", 0, false);
            } else if (options.service === "ClearAlert") {
                loadAlerts(jQuery.parseJSON(data));
                addNotification("Alert History Cleared", 0, true);
            } else if (options.service === "SaveDashboardPositions") {
                addNotification("Dashboard Order Saved", 0, false);
            } else if (options.service === "Select") {
                showSQLResults(data);
            } else if (options.service === "SetDashboardSharingURL"){
                var objData = jQuery.parseJSON(data);
                $("#dashboardshareurl").prop("disabled", false);
                $("#dashboardshareurl").val(getDashboardShareURL(objData.shareURL));
            } else if (options.service === "DisableDashboardSharingURL"){
                $("#dashboardshareurl").prop("disabled", true);
                $("#dashboardshareurl").val("");
            } else if (options.service === "SetMetricSharingURL"){
                var objData = jQuery.parseJSON(data);
                $("#metricshareurl").prop("disabled", false);
                $("#metricshareurl").val(getMetricShareURL(objData.shareURL));
            } else if (options.service === "DisableMetricSharingURL"){
                $("#metricshareurl").prop("disabled", true);
                $("#metricshareurl").val("");
            } else if (options.service === "UpdateUser"){
                addNotification("User Account Updated", 0);
                var objData = jQuery.parseJSON(data);
                var arrUserData = JSON.parse(objData.userinfo);
                loadUserData(arrUserData);
            }
            
            showLoadingSpinner(false, "");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            addNotification("Error", 3, true);
            console.log(textStatus);
            showLoadingSpinner(false, "");
        }
    });
}