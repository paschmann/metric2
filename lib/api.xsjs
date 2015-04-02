//Additional Library Import
$.import("lilabs.metric2.lib", "widgets");
$.import("lilabs.metric2.lib", "dialogs");
$.import("lilabs.metric2.lib", "alerts");
$.import("lilabs.metric2.lib", "security");
$.import("lilabs.metric2.lib", "sql");
$.import("lilabs.metric2.lib", "dashboards");
$.import("lilabs.metric2.lib", "metricdata");
$.import("lilabs.metric2.lib", "oauth");

var widgetLib = $.lilabs.metric2.lib.widgets;
var alertLib = $.lilabs.metric2.lib.alerts;
var dialogLib = $.lilabs.metric2.lib.dialogs;
var sqlLib = $.lilabs.metric2.lib.sql;
var securityLib = $.lilabs.metric2.lib.security;
var dashboardLib = $.lilabs.metric2.lib.dashboards;
var metricdataLib = $.lilabs.metric2.lib.metricdata;
var oauthLib = $.lilabs.metric2.lib.oauth;

//Global Variable Declaration
var service = $.request.parameters.get("service");
var sessiontoken = $.request.headers.get("SessionToken");
var dashboardid = $.request.parameters.get("dashboardid");
var dashboardwidgetid = $.request.parameters.get("dashboardwidgetid");
var widgetid = $.request.parameters.get("widgetid");
var action = $.request.parameters.get("action");
var gridpos = $.request.parameters.get("gridpos");
var alertid = $.request.parameters.get("alertid");
var alertstatus = $.request.parameters.get("alertstatus");
var widgetgroup = $.request.parameters.get("widgetgroup");
var datapoint = $.request.parameters.get("datapoint");
var startdt = $.request.parameters.get("startdt");
var enddt = $.request.parameters.get("enddt");
var email = $.request.parameters.get("email");
var password = $.request.parameters.get("password");
var dashboardwidgetparamid = $.request.parameters.get("dashboardwidgetparamid");
var sql = $.request.parameters.get("SQL");
var dashboardpos = $.request.parameters.get("dashboardpos");
var viewmode = $.request.parameters.get("view");

var output = "";
var strContent = "";
var strDashboardUser = "lilabs.metric2.lib::metricuser";
var strTimeZone = "PST";

var debugmode = "hidden"; //hidden or block
var intHanaVersion = 9;

//convert sessiontoken to user_id
var userid = securityLib.getUserIDfromToken(sessiontoken);

var widgetContents = [];
var Dataset = {};
Dataset.result = "";

// Handle Service Requests
switch (service) {
    case "Init":
        Dataset.userinfo = securityLib.getUserInfo();
        Dataset.dbinfo = securityLib.getDBInfo();
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "RevokeOAuthToken":
        Dataset.result = oauthLib.revokeAPIToken();
        output = JSON.stringify(Dataset);
        break;
    case "ProcessGoogleAPIoAuth":
        output = oauthLib.processGoogleAPIoAuth();
        break;
    case "SaveGoogleAPIAccessToken":
        Dataset.result = oauthLib.saveGoogleAPIAccessToken();
        output = JSON.stringify(Dataset);
        break;
    case "ProcessGithubAPIoAuth":
        output = oauthLib.processGithubAPIoAuth();
        break;
    case "UserInfo":
        Dataset.userinfo = securityLib.getUserInfo();
        output = JSON.stringify(Dataset);
        break;
    case "DBInfo":
        Dataset.dbinfo = securityLib.getDBInfo();
        output = JSON.stringify(Dataset);
        break;
    case "Dashboards":
        Dataset.result = "List of Dashboards";
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "Position":
        Dataset.result = widgetLib.updateWidgetPositions(JSON.parse(gridpos));
        output = JSON.stringify(Dataset);
        break;
    case "Widgets":
        widgetLib.showWidgets();
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "EditWidgetDialog":
        Dataset = dialogLib.showWidgetDialog();
        output = JSON.stringify(Dataset);
        break;
    case "EditSettingsDialog":
        Dataset = dialogLib.showSettingsDialog();
        output = JSON.stringify(Dataset);
        break;
    case "NewWidgetDialog":
        Dataset = dialogLib.showWidgetDialog();
        output = JSON.stringify(Dataset);
        break;
    case "DeleteWidget":
        Dataset.result = widgetLib.deleteMetric();
        widgetLib.showWidgets();
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "DeleteMetricHistory":
        Dataset.result = widgetLib.deleteMetricHistory();
        output = JSON.stringify(Dataset);
        break;
    case "CloneMetric":
        Dataset.result = widgetLib.cloneMetric();
        widgetLib.showWidgets();
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "CreateMetric":
        Dataset.result = widgetLib.createMetric();
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "EditMetric":
        Dataset.result = widgetLib.editMetric();
        widgetLib.showWidgets();
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "AddDashboardDialog":
        output = dialogLib.showDashboardDialog();
        break;
    case "EditDashboardDialog":
        output = dialogLib.showDashboardDialog();
        break;
    case "AlertHistoryDialog":
        Dataset = dialogLib.showAlertHistoryDialog(alertid);
        output = JSON.stringify(Dataset);
        break;
    case "EditProfileDialog":
        output = dialogLib.showProfileDialog();
        break;
    case "GetWidgetTypes":
        output = widgetLib.getWidgetTypes(widgetgroup);
        break;
    case "RefreshWidget":
        widgetContents.push(widgetLib.showWidgetDiv(dashboardwidgetid, $.request.parameters.get("refreshrate")));
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
        break;
    case "Alerts":
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "AddAlertDialog":
        Dataset = dialogLib.showAlertDialog();
        output = JSON.stringify(Dataset);
        break;
    case "CreateAlert":
        Dataset.result = alertLib.createAlert();
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "EditAlert":
        Dataset.result = alertLib.editAlert();
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "EditAlertDialog":
        Dataset = dialogLib.showAlertDialog(alertid);
        output = JSON.stringify(Dataset);
        break;
    case "DeleteAlert":
        alertLib.deleteAlert(alertid);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "SetAlert":
        alertLib.setAlert(alertid, alertstatus);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "ClearAlert":
        alertLib.clearAlert(alertid);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
        break;
    case "WidgetHistoryDialog":
        Dataset.metricHistory = dialogLib.showWidgetHistoryDialog(dashboardwidgetid, 50, startdt, enddt);
        output = JSON.stringify(Dataset);
        break;
    case "WidgetForecastDialog":
        Dataset.metricForecast = dialogLib.showWidgetForecastDialog(dashboardwidgetid, 50, action);
        output = JSON.stringify(Dataset);
        break;
    case "Select":
        output = sqlLib.executeRecordSetObj(sql);
        break;
    case "Insert":
    case "Update":
    case "Delete":
        output = sqlLib.executeInputQuery(sql);
        break;
    case "CallSP":
        output = sqlLib.executeStoredProc(sql);
        break;
    case "CreateDashboard":
        Dataset.dashboardid = dashboardLib.createDashboard();
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "UpdateDashboard":
        Dataset.result = dashboardLib.updateDashboard();
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "CloneDashboard":
        Dataset.result = dashboardLib.cloneDashboard();
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "DeleteDashboard":
        Dataset.result = dashboardLib.deleteDashboard();
        Dataset.dashboards = dashboardLib.getListOfDashboards();
        output = JSON.stringify(Dataset);
        break;
    case "SetSharingURL":
        Dataset.shareURL = dashboardLib.setShareURL(Math.random().toString(36).slice(2));
        output = JSON.stringify(Dataset);
        break;
    case "GetSharingURL":
        Dataset.shareURL = dashboardLib.getShareURL();
        output = JSON.stringify(Dataset);
        break;
    case "DisableSharingURL":
        dashboardLib.setShareURL("");
        break;
        // metricdata Functions //
    case "API":
        if (userid !== 999 && userid !== "") {
            if ($.request.method === $.net.http.GET) {
                output = metricdataLib.getDataPoint();
            } else if ($.request.method === $.net.http.POST) {
                output = metricdataLib.updateWigetValue();
            }
        } else {
            output = "{'STATUS': 'Invalid user token'}";
        }
        break;
    case "SaveDataPoint":
        //depreciated
        output = metricdataLib.updateWigetValue();
        break;
    case "GetListOfWidgets":
        output = widgetLib.getListOfWidgets(dashboardid);
        break;
    case "GetListOfDashboards":
        output = dashboardLib.getListOfDashboards(userid);
        break;
    case "SaveDashboardPositions":
        Dataset.result = dashboardLib.saveDashboardPositions(userid);
        output = JSON.stringify(Dataset);
        break;
    case "Login":
        output = securityLib.getUserSessionToken();
        break;
    case "CreateUser":
        output = securityLib.createUser();
        break;
    case "UpdateUser":
        Dataset.response = securityLib.updateUser();
        Dataset.userinfo = sqlLib.executeRecordSetObj("SELECT LNAME, NAME, ACCT_TYPE, EMAIL, EMAIL_DOMAIN FROM METRIC2.m2_Users WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
        break;
    case "EditSettings":
        Dataset = dialogLib.editSettings();
        output = JSON.stringify(Dataset);
        break;
    default:
        Dataset.result = "Unknown service request: " + service;
        output = JSON.stringify(Dataset);
        break;
}

//Post all service request data to output stream
$.response.contentType = "text/html";
$.response.status = $.net.http.OK;
$.response.setBody(output);


// --------------------------------------- Misc/Generic-Functions ----------------------------------------------------- //

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, "g"), replace);
}

// --------------------------------------- End Misc/Generic-Functions ----------------------------------------------------- //