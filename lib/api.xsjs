//Additional Library Import
$.import("lilabs.metric2.lib","widgets");
$.import("lilabs.metric2.lib","dialogs");
$.import("lilabs.metric2.lib","alerts");
$.import("lilabs.metric2.lib","security");
$.import("lilabs.metric2.lib","sql");
$.import("lilabs.metric2.lib","dashboards");
$.import("lilabs.metric2.lib","metricdata");

var widgetLib = $.lilabs.metric2.lib.widgets;
var alertLib = $.lilabs.metric2.lib.alerts;
var dialogLib = $.lilabs.metric2.lib.dialogs;
var sqlLib = $.lilabs.metric2.lib.sql;
var securityLib = $.lilabs.metric2.lib.security;
var dashboardLib = $.lilabs.metric2.lib.dashboards;
var metricdataLib = $.lilabs.metric2.lib.metricdata;

//Global Variable Declaration
var service = $.request.parameters.get('service');
var usertoken = $.request.parameters.get('usertoken');
var dashboardid = $.request.parameters.get('dashboardid');
var dashboardwidgetid = $.request.parameters.get('dashboardwidgetid');
var widgetid = $.request.parameters.get('widgetid');
var action = $.request.parameters.get('action');
var gridpos = $.request.parameters.get('gridpos');
var alertid = $.request.parameters.get('alertid');
var alertstatus = $.request.parameters.get('alertstatus');
var widgetgroup = $.request.parameters.get('widgetgroup');
var datapoint = $.request.parameters.get('datapoint');
var startdt = $.request.parameters.get('startdt');
var enddt = $.request.parameters.get('enddt');
var email = $.request.parameters.get('email');
var password = $.request.parameters.get('password');
var dashboardwidgetparamid = $.request.parameters.get('dashboardwidgetparamid');
var sql = $.request.parameters.get('SQL');
var dashboardpos = $.request.parameters.get('dashboardpos');
var viewmode = $.request.parameters.get('view');

var output = "";
var strContent = "";
var strDashboardUser = "lilabs.metric2.lib::metricuser";
var strTimeZone = 'PST';

var debugmode = 'hidden'; //hidden or block
var intHanaVersion = 9;

//convert usertoken to user_id
var userid = securityLib.getUserIDfromToken(usertoken);

var widgetContents = [];
var Dataset = new Object({});

// Handle Service Requests
switch (service) {
	case 'DBInfo':
        Dataset.dbinfo = sqlLib.executeRecordSetObj("SELECT * FROM SYS.M_SYSTEM_OVERVIEW");
        // Alert ID and Dashboard widget id
		//createAlertHist(2, 181);
		output = JSON.stringify(Dataset);
		break;
	case 'UserInfo':
        Dataset.userinfo = sqlLib.executeRecordSetObj("SELECT LNAME, NAME, ACCT_TYPE, EMAIL, EMAIL_DOMAIN FROM METRIC2.m2_Users WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
		break;
	case 'Dashboards':
	    if (viewmode === 'true') { //View only mode
	        Dataset.dashboards = sqlLib.executeRecordSetObj("select * from metric2.m2_dashboard WHERE SHARE_URL = '" + dashboardid + "'");
	    } else {
	        Dataset.dashboards = sqlLib.executeRecordSetObj("select * from metric2.m2_dashboard WHERE user_id = " + userid + " order by vieworder, dashboard_id");
	    }
        output = JSON.stringify(Dataset);
        break;
	case 'Position':
        widgetLib.updateWidgetPositions(JSON.parse(gridpos));
		break;
	case 'Widgets':
        widgetLib.showWidgets();
        //Dataset.widgets = strContent
        Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
		break;
	case 'WidgetContents':
        output = widgetLib.showWidgetContents();
        break;
	case 'EditWidgetDialog':
        output = JSON.stringify(dialogLib.showWidgetDialog());
		break;
	case 'EditSettingsDialog':
        output = JSON.stringify(dialogLib.showSettingsDialog());
		break;
	case 'NewWidgetDialog':
	    output = JSON.stringify(dialogLib.showWidgetDialog());
		break;
	case 'DeleteWidget':
        widgetLib.deleteWidget();
		break;
	case 'CloneMetric':
        output = widgetLib.cloneMetric();
		break;
	case 'AddDashboardDialog':
        output = dialogLib.showDashboardDialog();
		break;
	case 'EditDashboardDialog':
        output = dialogLib.showDashboardDialog();
		break;
	case 'AlertHistoryDialog':
        output = JSON.stringify(dialogLib.showAlertHistoryDialog(alertid));
		break;
	case 'EditProfileDialog':
        output = dialogLib.showProfileDialog();
		break;
	case 'GetWidgetTypes':
        output = widgetLib.getWidgetTypes(widgetgroup);
		break;
	case 'RefreshWidget':
	    widgetContents.push(widgetLib.showWidgetDiv(dashboardwidgetid));
	    Dataset.widgetData = widgetContents;
        output = JSON.stringify(Dataset);
		break;
	case 'Alerts':
	    Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
		break;
	case 'AddAlert':
	    Dataset = dialogLib.showAlertDialog();
        output = JSON.stringify(Dataset);
		break;
	case 'CreateAlert':
		output = alertLib.createAlert(sql);
		break;
	case 'EditAlert':
	    Dataset = dialogLib.showAlertDialog(alertid);
        output = JSON.stringify(Dataset);
		break;
	case 'DeleteAlert':
        alertLib.deleteAlert(alertid);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
		break;
	case 'SetAlert':
        alertLib.setAlert(alertid, alertstatus);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
		break;
	case 'ClearAlert':
        alertLib.clearAlert(alertid);
        Dataset = alertLib.showAlerts();
        output = JSON.stringify(Dataset);
		break;
	case 'WidgetHistoryDialog':
        output = dialogLib.showWidgetHistoryDialog(dashboardwidgetid, 50, startdt, enddt);
		break;
	case 'WidgetForecastDialog':
        output = dialogLib.showWidgetForecastDialog(dashboardwidgetid, 50, action);
		break;
	case 'Select':
	    output = sqlLib.executeRecordSetObj(sql);
	    break;
	case 'Insert':
	case 'Update':
	case 'UpdateDashboard':
	case 'Delete':
		output = sqlLib.executeInputQuery(sql);
		break;
	case 'CallSP':
		output = sqlLib.executeStoredProc(sql);
		break;
	case 'CreateDashboard':
        output = dashboardLib.createDashboard(sql);
		break;
	case 'SetSharingURL':
	    output = dashboardLib.setShareURL(Math.random().toString(36).slice(2));
		break;
	case 'GetSharingURL':
	    output = dashboardLib.getShareURL();
		break;
	case 'DisableSharingURL':
        dashboardLib.setShareURL('');
		break;
	// metricdata Functions //
	case 'API':
	    if ($.request.method === $.net.http.GET){
	        output = metricdataLib.getDataPoint();
	    } else if ($.request.method === $.net.http.POST){
	        output = metricdataLib.updateWigetValue();
	    }
	    break;
	case 'SaveDataPoint':
	    //depreciated
	    output = metricdataLib.updateWigetValue();
	    break;
	case 'GetListOfWidgets':
		output = widgetLib.getListOfWidgets(dashboardid);
		break;
	case 'GetListOfDashboards':
		output = dashboardLib.getListOfDashboards(userid);
		break;
	case 'SaveDashboardPositions':
		output = dashboardLib.saveDashboardPositions(userid);
		break;
	case 'Login':
        output = securityLib.getUserLoginToken();
        break;
    case 'CreateUser':
        output = securityLib.createUser();
        break;
    case 'UpdateUser':
        output = securityLib.updateUser();
        break;
    case 'TestUserToken':
        output = securityLib.getUserIDfromToken(usertoken);
    case 'Test':
        //Testing server side calls - call getDataSet.xsjs?service=Test
        break;
    default:
        output = 'Unknown service request: ' + service;
        break;
}

//Post all service request data to output stream
$.response.contentType = "text/html";
$.response.status = $.net.http.OK;
$.response.setBody(output);


// --------------------------------------- Misc/Generic-Functions ----------------------------------------------------- //

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// --------------------------------------- End Misc/Generic-Functions ----------------------------------------------------- //
