//Additional Library Import
$.import("lilabs.metric2.lib","widgets");
$.import("lilabs.metric2.lib","dialogs");
$.import("lilabs.metric2.lib","alerts");
$.import("lilabs.metric2.lib","security");
$.import("lilabs.metric2.lib","sql");
$.import("lilabs.metric2.lib","dashboards");

var widgetLib = $.lilabs.metric2.lib.widgets;
var alertLib = $.lilabs.metric2.lib.alerts;
var dialogLib = $.lilabs.metric2.lib.dialogs;
var sqlLib = $.lilabs.metric2.lib.sql;
var securityLib = $.lilabs.metric2.lib.security;
var dashboardLib = $.lilabs.metric2.lib.dashboards;

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

var output = "";
var strContent = "";
var strDashboardUser = "lilabs.metric2.lib::metricuser";
var strTimeZone = 'PST';

var debugmode = 'hidden';

//convert usertoken to user_id
var userid = securityLib.getUserIDfromToken(usertoken);

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
        Dataset.dbinfo = sqlLib.executeRecordSetObj("SELECT LNAME, NAME, ACCT_TYPE, EMAIL, EMAIL_DOMAIN FROM METRIC2.m2_Users WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
		break;
	case 'Dashboards':
        Dataset.dashboards = sqlLib.executeRecordSetObj("select * from metric2.m2_dashboard WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
		break;
	case 'Position':
        widgetLib.updateWidgetPositions(JSON.parse(gridpos));
		break;
	case 'Widgets':
        widgetLib.showWidgets();
        output = strContent;
		break;
	case 'WidgetContents':
	    output = widgetLib.showWidgetContents();
	    break;
	case 'EditWidgetDialog':
        dialogLib.showWidgetDialog();
		break;
	case 'NewWidgetDialog':
        dialogLib.showWidgetDialog();
		break;
	case 'DeleteWidget':
        widgetLib.deleteWidget();
		break;
	case 'AddDashboardDialog':
        dialogLib.showDashboardDialog();
		break;
	case 'EditDashboardDialog':
        dialogLib.showDashboardDialog();
		break;
	case 'AlertHistoryDialog':
        output = dialogLib.showAlertHistoryDialog(alertid);
		break;
	case 'GetWidgetTypes':
        output = widgetLib.getWidgetTypes(widgetgroup);
		break;
	case 'RefreshWidget':
        output = widgetLib.showWidgetContents(dashboardwidgetid,'');
		break;
	case 'Alerts':
		output = alertLib.showAlerts();
		break;
	case 'AddAlert':
		output = dialogLib.showAlertDialog();
		break;
	case 'CreateAlert':
		output = alertLib.createAlert(sql);
		break;
	case 'EditAlert':
		output = dialogLib.showAlertDialog(alertid);
		break;
	case 'DeleteAlert':
        alertLib.deleteAlert(alertid);
        output = alertLib.showAlerts();
		break;
	case 'SetAlert':
        alertLib.setAlert(alertid, alertstatus);
        output = alertLib.showAlerts();
        break;
	case 'ClearAlert':
        alertLib.clearAlert(alertid);
        output = alertLib.showAlerts();
		break;
	case 'WidgetHistoryDialog':
        output = dialogLib.showWidgetHistoryDialog(dashboardwidgetid, 50, startdt, enddt);
		break;
	case 'WidgetForecastDialog':
        output = dialogLib.showWidgetForecastDialog(dashboardwidgetid, 50, action);
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
        //Update the owner of the dashboard to be the correct user_id
        output = dashboardLib.createDashboard(sql);
		break;
	case 'SaveDataPoint':
		widgetLib.updateWigetValue();
        output = '';
		break;
	case 'GetDataPoint':
		output = getDataPoint(dashboardwidgetparamid);
		break;
	case 'GetListOfWidgets':
		output = widgetLib.getListOfWidgets(dashboardid);
		break;
	case 'GetListOfDashboards':
		output = dashboardLib.getListOfDashboards(userid);
		break;
	case 'DoLogin':
        output = securityLib.getUserLoginToken();
        break;
    case 'CreateUser':
        output = securityLib.createUser();
        break;
    Default:
        output = 'Unknown service request';
        break;
}

//Post all service request data to output stream
$.response.contentType = "text/html";
$.response.setBody(output);


// --------------------------------------- API ----------------------------------------------------- //


function getDataPoint(dashboardwidgetparamid){
	return sqlLib.executeRecordSetObj("SELECT value FROM METRIC2.m2_DWP_HISTORY WHERE dwp_hist_id = (SELECT MAX(dwp_hist_id) FROM METRIC2.M2_DWP_HISTORY WHERE dashboard_widget_param_id = " + dashboardwidgetparamid + ")");
}

// --------------------------------------- End API ----------------------------------------------------- //


// --------------------------------------- Misc/Generic-Functions ----------------------------------------------------- //

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// --------------------------------------- End Misc/Generic-Functions ----------------------------------------------------- //


// --------------------------------------- Get-Functions ----------------------------------------------------- //

function getWidgetIDFromDashboardWidgetID(){
    return sqlLib.executeScalar("SELECT widget_id FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetRefreshRate(dashboardwidgetid){
    return parseInt(sqlLib.executeScalar("SELECT refresh_rate FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid))*1000;
}

function getWidgetNameFromWidgetID(widgetid){
    return sqlLib.executeScalar("SELECT name FROM metric2.m2_widget WHERE widget_id =" + widgetid);
}

function getWidgetTypeFromWidgetID(widgetid){
    return sqlLib.executeScalar("SELECT type FROM metric2.m2_widget WHERE widget_id =" + widgetid);
}

function getWidgetCodeType(dashboardwidgetid){
	return sqlLib.executeScalar("SELECT code FROM metric2.m2_widget INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_widget.widget_id = metric2.m2_dashboard_widget.widget_id WHERE metric2.m2_dashboard_widget.dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetHeight(dashboardwidgetid){
	return sqlLib.executeScalar("SELECT height FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetWidth(dashboardwidgetid){
	return sqlLib.executeScalar("SELECT width FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetParamValueEscaped(paramid, dashboardwidgetid){
    try {
        return sqlLib.executeScalar("SELECT REPLACE(REPLACE(value, 'MET3', '&#037;'), 'MET2', '&#039;') from metric2.m2_dashboard_widget_params WHERE param_id =" + paramid + " AND dashboard_widget_id =" + dashboardwidgetid);
    } catch (err) {
		return err;
	}
}

function getWidgetParamValueFromParamName(paramname, dashboardwidgetid){
	try {
		var value = sqlLib.executeScalar("SELECT REPLACE(REPLACE(value, 'MET3', '%'), 'MET2', '''') from metric2.m2_dashboard_widget_params INNER JOIN metric2.m2_widget_param ON metric2.m2_dashboard_widget_params.param_id = metric2.m2_widget_param.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		return value;
	} catch (err) {
		return err;
	}
}

function getWidgetParamValueFromParamNameObj(paramname, dashboardwidgetid){
	try {
		var value = sqlLib.executeScalar("SELECT REPLACE(REPLACE(value, 'MET3', '%'), 'MET2', '''') from metric2.m2_dashboard_widget_params INNER JOIN metric2.m2_widget_param ON metric2.m2_dashboard_widget_params.param_id = metric2.m2_widget_param.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		return value;
	} catch (err) {
		return err;
	}
}

function getDashboardWidgetParamIDFromParamName(paramname, dashboardwidgetid){
	try {
		var value = sqlLib.executeScalar("SELECT metric2.m2_dashboard_widget_params.dashboard_widget_param_id from metric2.m2_dashboard_widget_params INNER JOIN metric2.m2_widget_param ON metric2.m2_dashboard_widget_params.param_id = metric2.m2_widget_param.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		return value;
	} catch (err) {
		return err.message;
	}
}

function getWidgetParamSinglePastValueFromParamName(paramname, dashboardwidgetid){
	try {
        return sqlLib.executeScalar("SELECT metric2.m2_dwp_history.value, metric2.m2_dwp_history.dt_added from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " ORDER BY metric2.m2_dwp_history.dt_added desc LIMIT 1");
	} catch (err) {
		return err.message;
	}
}

function getWidgetParamRangePastValueFromParamName(paramname, dashboardwidgetid, reclimit){
	try {
        return sqlLib.executeRecordSetObj("SELECT metric2.m2_dwp_history.dt_added, metric2.m2_dwp_history.value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " ORDER BY metric2.m2_dwp_history.dt_added desc LIMIT " + reclimit);
	} catch (err) {
		return err.message;
	}
}

// --------------------------------------- End Get-Functions ----------------------------------------------------- //



