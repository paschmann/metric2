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
var strDashboardUser = "lilabs.metric2::metricuser";
var strTimeZone = 'PST';

var debugmode = 'hidden';

//convert usertoken to user_id
var userid = getUserIDfromToken(usertoken);

//Additional Library Import
//$.import("lilabs.metric2","customwigets");
//$.import("lilabs.metric2","demodata");



var Dataset = new Object({});

// Handle Service Requests
switch (service) {
	case 'DBInfo':
        Dataset.dbinfo = executeRecordSetObj("SELECT * FROM SYS.M_SYSTEM_OVERVIEW");
        // Alert ID and Dashboard widget id
		//createAlertHist(2, 181);
		output = JSON.stringify(Dataset);
		break;
	case 'UserInfo':
        Dataset.dbinfo = executeRecordSetObj("SELECT LNAME, NAME, ACCT_TYPE, EMAIL, EMAIL_DOMAIN FROM METRIC2.m2_Users WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
		break;
	case 'Dashboards':
        Dataset.dashboards = executeRecordSetObj("select * from metric2.m2_dashboard WHERE user_id = " + userid);
        output = JSON.stringify(Dataset);
		break;
	case 'Position':
        updateWidgetPositions(JSON.parse(gridpos));
		break;
	case 'Widgets':
        showWidgets();
        output = strContent;
		break;
	case 'EditWidgetDialog':
        showWidgetDialog();
		break;
	case 'NewWidgetDialog':
        showWidgetDialog();
		break;
	case 'DeleteWidget':
        deleteWidget();
		break;
	case 'AddDashboardDialog':
        showDashboardDialog();
		break;
	case 'EditDashboardDialog':
        showDashboardDialog();
		break;
	case 'AlertHistoryDialog':
        output = showAlertHistoryDialog(alertid);
		break;
	case 'GetWidgetTypes':
        output = getWidgetTypes(widgetgroup);
		break;
	case 'RefreshWidget':
        output = showWidgetContents(dashboardwidgetid,'');
		break;
	case 'Alerts':
		output = showAlerts();
		break;
	case 'AddAlert':
		output = showAlertDialog();
		break;
	case 'CreateAlert':
		output = createAlert(sql);
		break;
	case 'EditAlert':
		output = showAlertDialog(alertid);
		break;
	case 'DeleteAlert':
        deleteAlert(alertid);
        output = showAlerts();
		break;
	case 'SetAlert':
        setAlert(alertid, alertstatus);
        output = showAlerts();
        break;
	case 'ClearAlert':
        clearAlert(alertid);
        output = showAlerts();
		break;
	case 'WidgetHistoryDialog':
        output = showWidgetHistoryDialog(dashboardwidgetid, 50, startdt, enddt);
		break;
	case 'WidgetForecastDialog':
        output = showWidgetForecastDialog(dashboardwidgetid, 50, action);
		break;
	case 'Insert':
	case 'Update':
	case 'UpdateDashboard':
	case 'Delete':
		output = executeInputQuery(sql);
		break;
	case 'CallSP':
		output = executeStoredProc(sql);
		break;
	case 'CreateDashboard':
        //Update the owner of the dashboard to be the correct user_id
        output = createDashboard(sql);
		break;
	case 'SaveDataPoint':
		updateWigetValue();
        output = '';
		break;
	case 'GetDataPoint':
		output = getDataPoint(dashboardwidgetparamid);
		break;
	case 'GetListOfWidgets':
		output = getListOfWidgets(dashboardid);
		break;
	case 'GetListOfDashboards':
		output = getListOfDashboards(userid);
		break;
	case 'DoLogin':
        output = getUserLoginToken();
        break;
    case 'CreateUser':
        output = createUser();
        break;
    Default:
        output = 'Unknown service request';
        break;
}

//Post all service request data to output stream
$.response.contentType = "text/html";
$.response.setBody(output);


// --------------------------------------- Security ----------------------------------------------------- //

function getUserLoginToken() {
    var userID = executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "' AND password = '" + password + "'");
    // Calculate HMACSHA1-Value (160 Bits) which is returned as a Buffer of 20 Bytes
    var hmacSha1ByteBuffer = $.util.crypto.hmacSha1(userID, Math.random().toString(36).slice(2));
    // Encode ByteBuffer to Base64-String
    var userInitialToken =  $.util.convert.encodeBase64(hmacSha1ByteBuffer);
    
    if (!userID){
        userInitialToken = 0;
    } else {
        // Create a session token and update the user token in the DB
        executeUpdate("UPDATE metric2.m2_users set user_token = '" + userInitialToken + "' WHERE user_id = " + userID);
    }
    return userInitialToken;
}

function getUserIDfromToken(usertoken){
    return executeScalar("SELECT user_id FROM metric2.m2_users WHERE user_token = '" + usertoken + "'");
}

function createUser(){
    var email = $.request.parameters.get('email');
    var lname = $.request.parameters.get('lname');
    var company = $.request.parameters.get('company');
    var name = $.request.parameters.get('name');
    var password = $.request.parameters.get('password');
    var recCount = 0;
    var tmpUserID = executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "'");
    
    //check if user already exists
    if (tmpUserID === ''){
        var SQL = "INSERT INTO METRIC2.M2_USERS (user_ID, name, lname, email_domain, email, password, acct_type, dt_added) VALUES (metric2.user_id.NEXTVAL, '" + name + "', '" + lname + "', '" + company + "', '" + email + "', '" + password + "', '0', CURRENT_TIMESTAMP)";
        executeQuery(SQL);
        recCount = 1;
    } else {
        recCount = -1;
    }
    
    return recCount;
}

// --------------------------------------- API ----------------------------------------------------- //


function getListOfWidgets(dashboardid){
	return executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD_WIDGET WHERE dashboard_id = " + dashboardid);
}


function getListOfDashboards(userid){
	return executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD WHERE user_id = " + userid);
}



function getDataPoint(dashboardwidgetparamid){
	return executeRecordSetObj("SELECT value FROM METRIC2.m2_DWP_HISTORY WHERE dwp_hist_id = (SELECT MAX(dwp_hist_id) FROM METRIC2.M2_DWP_HISTORY WHERE dashboard_widget_param_id = " + dashboardwidgetparamid + ")");
}


function updateWigetValue(){
    //http://107.22.192.171:8000/lilabs/metric2/saveDataPoint.html?pid=818&value=456
    insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint, dashboardwidgetparamid);
}


// --------------------------------------- End API ----------------------------------------------------- //




// --------------------------------------- Widgets ----------------------------------------------------- //

function showWidgetContents(intDashboardWidgetID, codetype){
	var strContent = '';
	
	// if codetype is blank, this is a refresh, and needs to get from db
    if (codetype === ''){
		codetype = getWidgetCodeType(intDashboardWidgetID);
	}
	
    try{
		switch (codetype) {
        case 'widgetTextAndFooter':
            strContent += widgetTextAndFooter(intDashboardWidgetID);
            break;
        case 'widgetList':
            strContent += widgetList(intDashboardWidgetID);
            break;
        case 'widgetNumberAndText':
            strContent += widgetNumberAndText(intDashboardWidgetID);
            break;
        case 'widgetAllServicesStarted':
            strContent += widgetAllServicesStarted(intDashboardWidgetID);
            break;
        case 'widgetIcon':
            strContent += widgetIcon(intDashboardWidgetID);
            break;
        case 'widgetNumberChange':
            strContent += widgetNumberChange(intDashboardWidgetID);
            break;
        case 'widgetInstanceDetails':
            strContent += widgetInstanceDetails(intDashboardWidgetID);
            break;
        case 'widgetHistoryChart':
            strContent += widgetHistoryChart(intDashboardWidgetID, '%');
            break;
        case 'widgetBlockedTransactions':
            strContent += widgetNumberChange(intDashboardWidgetID);
            break;
        case 'widgetBlockedTransactionsList':
            strContent += widgetList(intDashboardWidgetID);
            break;
        case 'widgetComponentOverview':
            strContent += widgetComponentOverview(intDashboardWidgetID);
            break;
        case 'widgetUsedMemoryPie':
            strContent += widgetUsedMemoryPie(intDashboardWidgetID);
            break;
        case 'widgetMemoryUsedHistory':
            strContent += widgetHistoryChart(intDashboardWidgetID, 'GB');
            break;
        case 'widgetDateTime':
			strContent += widgetDateTime(intDashboardWidgetID);
			//strContent += 'Refreshed';
			break;
        case 'widgetConnectionHistory':
			strContent += widgetHistoryChart(intDashboardWidgetID, '');
			break;
        case 'widgetWeather':
			strContent += "<div id='weather'></div><script type='text/javascript' id='evalcodeShowWeather' name='script'>widgetWeather(" + getWidgetParamValueFromParamName('ZIPCODE', intDashboardWidgetID) + ");</script>";
			break;
        case 'widgetStockPrice':
			strContent += "<div id='stock'></div><script type='text/javascript' id='evalcodeShowStock' name='script'>widgetStockPrice('" + getWidgetParamValueFromParamName('TICKER', intDashboardWidgetID) + "');</script>";
			break;
        case 'widgetBullet':
			strContent += widgetBullet(intDashboardWidgetID);
			break;
        case 'widgetSystemOverview':
			strContent += widgetSystemOverview(intDashboardWidgetID);
			break;
        case 'widgetIconDistributed':
			strContent += widgetIconDistributed(intDashboardWidgetID);
			break;
        case 'widgetRecentUnConnections':
			strContent += widgetRecentUnConnections(intDashboardWidgetID);
			break;
        case 'widgetDBMemoryOverview':
			strContent += widgetDBMemoryOverview(intDashboardWidgetID);
			break;
        case 'widgetResMemoryOverview':
			strContent += widgetResMemoryOverview(intDashboardWidgetID);
			break;
        case 'widgetPing':
			strContent += "<div id='ping'></div><script type='text/javascript' id='evalcodeShowPing' name='script'>widgetPing('ping', '" + getWidgetParamValueFromParamName('IP', intDashboardWidgetID) + "');</script>";
			break;
        case 'widgetFunnel':
			strContent += widgetFunnel(intDashboardWidgetID);
			break;
        case 'widgetSystemAlerts':
			strContent += widgetSystemAlerts(intDashboardWidgetID);
			break;
        case 'widgetUserAlerts':
			strContent += widgetUserAlerts(intDashboardWidgetID);
			break;
        case 'widgetSensorAPI':
			strContent += widgetSensorAPI(intDashboardWidgetID);
			break;
        case 'widgetTwitter':
			var twitterhandle = getWidgetParamValueFromParamName('HANDLE', intDashboardWidgetID);
			strContent += '<a style="margin: 5px;" class="twitter-timeline" href="https://twitter.com/' + twitterhandle + '" width="450" height="420"  data-tweet-limit="' + getWidgetParamValueFromParamName('NUMTWEETS', intDashboardWidgetID) + '" data-chrome="nofooter noheader transparent" data-widget-id="' + getWidgetParamValueFromParamName('WIDID', intDashboardWidgetID) + '">Tweets by ' +  twitterhandle + '</a><script type="text/javascript" id="evalcodeShowTweets" name="script">widgetTwitter();</script>';
			break;
        case 'widgetHistorySmall':
			strContent += widgetHistorySmall(intDashboardWidgetID);
			break;
        case 'widgetTableSizes':
			strContent += widgetTableSizes(intDashboardWidgetID);
			break;
		case 'widgetJSONService':
			strContent += "<div id='widgetJSONService" + intDashboardWidgetID + "'></div><script type='text/javascript' id='evalOData' name='script'>widgetJSONService('" + getWidgetParamValueFromParamName('URL', intDashboardWidgetID) + "', '#widgetJSONService" + intDashboardWidgetID + "','" + getWidgetParamValueFromParamName('OBJKEY', intDashboardWidgetID) + "','" + getWidgetParamValueFromParamName('TEXT1', intDashboardWidgetID) + "');</script>";
			break;
		case 'widgetJSONServiceTable':
			strContent += "<div id='widgetJSONService" + intDashboardWidgetID + "'></div><script type='text/javascript' id='evalOData' name='script'>widgetJSONServiceTable('" + getWidgetParamValueFromParamName('URL', intDashboardWidgetID) + "', '#widgetJSONService" + intDashboardWidgetID + "');</script>";
			break;
		case 'widgetConnectionList':
			strContent += executeRecordSet(getWidgetParamValueFromParamName('SQL1', intDashboardWidgetID));
			break;
		case 'widgetDataMap':
			strContent += "<div id='map'></div><script type='text/javascript' id='evalcodeShowMap' name='script'>widgetDataMap('map','" + executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', intDashboardWidgetID)) + "');</script>";
			break;
		case 'widgetProgressBar':
			strContent += widgetProgressBar(intDashboardWidgetID);
			break;
		case 'widgetRSSFeed':
			strContent += widgetRSSFeed(intDashboardWidgetID);
			break;
		case 'widgetImageBox':
			strContent += widgetImageBox(intDashboardWidgetID);
			break;
		}
		
		var refreshrate = parseInt(getWidgetRefreshRate(intDashboardWidgetID));
		if (refreshrate !== 0){
			strContent += "<script type='text/javascript' id='timercode" + intDashboardWidgetID + "' name='script'>";
			strContent += "timers.push(setTimeout(function() {getDataSet({strService: 'RefreshWidget', strDashboardWidgetID: '" + intDashboardWidgetID + "'});}, " + refreshrate + "));";
			strContent += "</script>"; 
		}
	} catch (err) {
        // If any widget throws an error, simply display the loading icon
        strContent += err; // Useful for debugging
        //strContent += "<img style='margin-top: 50px;' src='img/loading.gif' />";
	}
	return strContent;
}



function showWidgets(){
    
    try{
        // Loop through all our widgets for this dashboard and display them in the grid + gridster Div
        var rs = executeReader("SELECT title, width, dashboard_widget_id, type, height, code_type, col_pos, row_pos, code, hist_enabled from metric2.m2_dashboard_widget dw INNER JOIN metric2.m2_widget w ON w.widget_id = dw.widget_id where dashboard_id = " + dashboardid + " order by dashboard_widget_id");
        
        strContent = "<div class='gridster' id='gridster'><ul id='gridtiles'>";
        
            while (rs.next()){
                var intDashboardWidgetID = rs.getString(3);
                strContent += "<li  id='tile_" + intDashboardWidgetID + "' data-row='" + rs.getString(8) + "' data-col='" + rs.getString(7) + "' data-sizex='" + rs.getString(2) + "' data-sizey='" + rs.getString(5) + "'>";
                    strContent += "<div class='t1-widget-div'><div class='t1-widget-header-div'>";
                        strContent += "<header class='t1-widget-header' id='widget-header" + intDashboardWidgetID + "'>" + rs.getString(1);
                            if (rs.getString(10) == '1'){
                                strContent += "<img class='t1-historyicon-img' id='historyicon" + intDashboardWidgetID + "' src='img/history-icon.png'>";
                            }				
                            strContent += "<img class='t1-editicon-img' id='editicon" + intDashboardWidgetID + "' src='img/settings-icon.png'>";
                        strContent += "</header>";
                    strContent += "</div>";
                    strContent += "<section class='t1-widget-section'>";
                        strContent += "<div id='t1-widget-container" + intDashboardWidgetID + "' class='t1-widget-container'>";
                            strContent += showWidgetContents(intDashboardWidgetID, rs.getString(9));
                        strContent += "</div>";
                    strContent += "</section>";
                strContent += "</li>";
            }
            rs.close();
        strContent += "</ul></div>";
    } catch (err) {
        strContent += err;
    }
}


function updateWidgetPositions(objGridPos){
    for (var i = 0, len = objGridPos.length; i < len; ++i) {
        var intDashboardWidgetID = objGridPos[i].id.substring(5);
        executeUpdate("UPDATE metric2.m2_dashboard_widget SET row_pos =" + objGridPos[i].row + ", col_pos =" + objGridPos[i].col + " WHERE dashboard_widget_id =" + intDashboardWidgetID);
    }
}


function deleteWidget(){
    executeQuery("DELETE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
    executeQuery("DELETE FROM metric2.m2_dwp_history where metric2.m2_dwp_history.dashboard_widget_param_id IN (SELECT dashboard_widget_param_id FROM metric2.m2_dashboard_widget_params WHERE metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + ")");
    executeQuery("DELETE FROM metric2.m2_dashboard_widget_params WHERE dashboard_widget_id =" + dashboardwidgetid);
	executeUpdate("DELETE FROM metric2.m2_alert WHERE dashboard_widget_id =" + dashboardwidgetid);
    strContent += 'Deleted';
}


function getWidgetTypes(widgetGroup){
    try{
    var SQL = "";
        if (widgetGroup == '0'){
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget ORDER BY widget_id";
        } else {
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget WHERE widget_group = " + widgetGroup + " ORDER BY widget_id";
        }
        return executeRecordSetObj(SQL);
    } catch (err) {
        return 'Error getting widget types (getWidgetTypes:getDataSet.xsjs)';
    }
}


// --------------------------------------- End Widgets ----------------------------------------------------- //


// --------------------------------------- Alerts ----------------------------------------------------- //

function createAlert(sql){
    try {
        executeInputQuery(sql);
        executeInputQuery("UPDATE metric2.m2_alert SET user_id = " + userid + " WHERE user_id = 999");
        return 1;
	} catch (err) {
		return err.message;
	}
    
}

function createAlertHist(alertid, dashboardwidgetid){
    var hour = 0;
    var maxentries = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    
    for (var day = 0; day < 7; day++){
        for (var i = 0; i <= maxentries; i++){
            var num = Math.floor(Math.random() *98) + 80;
            var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual,added) VALUES (metric2.alert_history_id.NEXTVAL, " + alertid + ", " + dashboardwidgetid + ", 'value', '>', 80, 'dba@metric2.com'," + num + ", ADD_DAYS(ADD_SECONDS(CURRENT_TIMESTAMP, 0)),-" + day + ")";
            executeQuery(SQL);
        }
    }
		
    for (var day = 1; day <= 400; day++){
        var num = Math.floor(Math.random() *98) + 80;
        var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual,added) VALUES (metric2.alert_history_id.NEXTVAL, " + alertid + ", " + dashboardwidgetid + ", 'value', '>', 80, 'dba@metric2.com'," + num + ", ADD_SECONDS(CURRENT_TIMESTAMP, 0))";
		executeQuery(SQL);
    }
}


function showAlerts(){
	var strHTML = "";
	strHTML += "<div class='row'>";
        strHTML += "<div class='col-md-2'>";
            strHTML += "<ul class='nav nav-list bs-docs-sidenav'>";
                strHTML += "<li><a href='#' onclick='addAlert();'><i class='icon-chevron-right'></i>Add Alert</a></li>";
                strHTML += "<li><a href='#' onclick='viewSummary();'><i class='icon-chevron-right'></i>Summary</a></li>";

                var rs = executeReader("SELECT DISTINCT metric2.m2_dashboard.title FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid);
                while (rs.next()){
                    strHTML += "<li><a href='#'><i class='icon-chevron-right'></i> " + rs.getString(1) + "</a></li>";
                }
                rs.close();
            strHTML += "</ul>";
          strHTML += "</div>";
        
        strHTML += "<div class='col-md-10'>"
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>User Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Dashboard</th><th>Widget Name</th><th>Status</th><th>Operator</th><th>Value</th><th>Notify</th><th>Exception Count</th><th>Modify</th><th>Clear</th></tr></thead><tbody>";

        var rs3 = executeReader("SELECT metric2.m2_dashboard_widget.title, cond, operator, value, notify, last_executed, metric2.m2_dashboard.title, alert_id, status FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid);
        while (rs3.next()){
            var strStatus = '';
            var strSetStatus = '';
            var intStatus = 0;
            var histcount = executeScalar("SELECT count(alert_hist_id) FROM metric2.m2_alert_history WHERE alert_id = " + rs3.getString(8));
            
            if (rs3.getString(9) == 1) { strStatus = 'Enabled'; strSetStatus = 'Disable'; intStatus = 0;} else { strStatus = 'Disabled'; strSetStatus = 'Enable'; intStatus = 1;}
                //strHTML += "<tr><td>" + rs3.getString(7) + "</td><td>" + rs3.getString(1) + "</td><td>" + strStatus + "</td><td>" + rs3.getString(3) + "</td><td>" + rs3.getString(4) + "</td><td>On-Screen</td><td><a href='#' onclick='alertHistory(" + rs3.getString(8) + ");'>" + histcount + "</a></td><td><a href='#' onclick='setAlert(" + rs3.getString(8) + ", " + intStatus + ");'>" + strSetStatus + "</a> | <a href='#' onclick='editAlert(" + rs3.getString(8) + ");'>Edit Alert</a> | <a href='#' onclick='deleteAlert(" + rs3.getString(8) + ");'>Delete Alert</a></td><td><a href='#' onclick='clearAlert(" + rs3.getString(8) + ");'>Clear History</a></td></tr>";
                strHTML += "<tr><td>" + rs3.getString(7) + "</td><td>" + rs3.getString(1) + "</td><td>" + strStatus + "</td><td>" + rs3.getString(3) + "</td><td>" + rs3.getString(4) + "</td><td>On-Screen</td><td><a href='#' onclick='alertHistory(" + rs3.getString(8) + ");'>" + histcount + "</a></td><td><a href='#' onclick='setAlert(" + rs3.getString(8) + ", " + intStatus + ");'>" + strSetStatus + "</a> | <a href='#' onclick='editAlert(" + rs3.getString(8) + ");'>Edit Alert</a></td><td><a href='#' onclick='clearAlert(" + rs3.getString(8) + ");'>Clear History</a></td></tr>";
        }
        rs3.close();
        
        strHTML += "</tbody></table></div>";
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>System Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Host</th><th>Rating</th><th>Last Check</th><th>Alert Details</th></tr></thead><tbody>";

        var rs2 = executeReader("SELECT ALERT_DETAILS, ALERT_RATING, UTCTOLOCAL(ALERT_TIMESTAMP, '" + strTimeZone + "'), HOST, ALERT_ID, ALERT_NAME, ALERT_DESCRIPTION, ALERT_USERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5)");
        while (rs2.next()){
            strHTML += "<tr><td>" + rs2.getString(4) + "</td><td>" + rs2.getString(2) + "</td><td>" + rs2.getString(3) + "</td><td>" + rs2.getString(1) + "</td></tr>";
        }
        rs2.close();
        strHTML += "</tbody></table></div></div>";
    return strHTML;
}

function deleteAlert(alertid){
    var SQL = "DELETE FROM metric2.m2_alert WHERE alert_id = " + alertid;
    executeUpdate(SQL);
}


function clearAlert(alertid){
    var SQL = "DELETE FROM metric2.m2_alert_history WHERE alert_id = " + alertid;
    executeUpdate(SQL);
}

function setAlert(alertid, intStatus){

	var SQL = "UPDATE metric2.m2_alert SET status = " + intStatus + " WHERE alert_id = " + alertid;
    executeUpdate(SQL);
}

function checkWidgetAlert(dashboardwidgetid, value){
    //check if widget has an alert - if yes, check against the specified value and send an alert if needed
	try {
		var rs = executeReader("SELECT alert_id, operator, value, notify, cond, title FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id WHERE status = 1 AND metric2.m2_alert.dashboard_widget_id = " + dashboardwidgetid);
		var strContent = '';
        
		while (rs.next()) {
			var alertid = rs.getString(2);
			var response = '';
			var doInsert = 0;
            var intCheckValue = rs.getInteger(3);
            var strOperator = rs.getString(2);
            
			
			//Check if alerts exist and if there are notifications to push
			response = "<script type='text/javascript' id='alertcode" + dashboardwidgetid + "' name='script'>";
			response += "addNotification('Alert Condition: " + rs.getString(6) + " " + value + " " + strOperator + " " + intCheckValue + "', 2);";
			response += "</script>";
			
			if (alertid !== ''){
				if (strOperator == '='){
					if (value == intCheckValue) {
						strContent += response;
						doInsert = 1;
					}
				} else if (strOperator == '>'){
					if (value > intCheckValue) {
						strContent += response;	
						doInsert = 1;
					}
				} else if (strOperator == '<'){
					if (value < intCheckValue) {
						strContent += response;
						doInsert = 1;
					}
				} else if (strOperator == '<='){
					if (value <= intCheckValue) {
						strContent += response;
						doInsert = 1;
					}
				} else if (strOperator == '>='){
					if (value >= intCheckValue) {
						strContent += response;
						doInsert = 1;
					}
				}
								
				if (doInsert == 1){
					var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual) VALUES (metric2.alert_history_id.NEXTVAL, " + rs.getString(1) + ", " + dashboardwidgetid + ", '" + rs.getString(5) + "', '" + rs.getString(2) + "', " + rs.getString(3) + ", '" + rs.getString(4) + "', " + value + ")";
					executeQuery(SQL);
				}
			}
		}
		rs.close();
		return strContent;
	} catch (err) {
		return err + " " + SQL;
	}
}


// --------------------------------------- End Alerts ----------------------------------------------------- //


// --------------------------------------- Dialogs ----------------------------------------------------- //



function showAlertDialog(alertid){
    
	var dashboardwidgetid = '';
	var operator = '=';
	var notify = '';
	var value = '';
	var cond = '';

	if (alertid){
		//This is an edit
		var rs = executeReader("SELECT * FROM metric2.m2_alert WHERE alert_id =" + alertid + " AND user_id = " + userid);
        while (rs.next()){
			dashboardwidgetid = rs.getString(2);
			cond = rs.getString(3);
			operator = rs.getString(4);
			notify = rs.getString(6);
			value = rs.getString(5);
		}
		rs.close();
	}
	var output = "<form class='form-horizontal'>";
	output += "<input type='" + debugmode + "' value = 'value' id='condition' />";
	output += "<input type='" + debugmode + "' value = '" + alertid + "' id='alertid' />";
    output += "<div class='form-group'><label class='col-sm-3 control-label'>Widget: </label><div class='controls'>" + showWidgetNameDropDown(dashboardwidgetid) + "</div></div>";
    output += "<div class='form-group'><label for='operator' class='col-sm-3 control-label'>Operator:</label><div class='controls'><select id='operator' style='width: 100px;'>" + showAlertOperatorDropdown(operator) + "</select></div></div>";
	output += "<div class='form-group'><label for='value' class='col-sm-3 control-label'>Value:</label><div class='controls'><input type='text' placeholder='Value' id='value' value = '" + value + "' /></div></div>";
	output += "<div class='form-group'><label for='notify' class='col-sm-3 control-label'>Notify:</label><div class='controls'><input type='text' placeholder='Email' id='notify' value = '" + notify + "' disabled/></div></div>";
	return output;
}


function showAlertOperatorDropdown(selected){
    var output = '';
	
	output += selected == '>' ? "<option selected>></option>" : "<option>></option>";
	output += selected == '<' ? "<option selected><</option>" : "<option><</option>";
	output += selected == '<=' ? "<option selected><=</option>" : "<option><=</option>";
	output += selected == '>=' ? "<option selected>>=</option>" : "<option>>=</option>";
		
	return output;
}


function showWidgetForecastDialog(dashboardwidgetid, reclimit, forecasttype){
	executeUpdate("DROP VIEW METRIC2.M2_V_PAL_TS_DATA");
	var dashboardwidgetparamid = executeScalar("SELECT DISTINCT metric2.m2_dwp_history.dashboard_widget_param_id from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
	executeUpdate("CREATE VIEW METRIC2.M2_V_PAL_TS_DATA AS SELECT TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ID, AVG(TO_REAL(a.VALUE)) VALUE FROM METRIC2.M2_DWP_HISTORY a WHERE DASHBOARD_WIDGET_PARAM_ID = " + dashboardwidgetparamid + " GROUP BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')), DASHBOARD_WIDGET_PARAM_ID ORDER BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ASC");
	executeUpdate("Delete * from METRIC2.M2_PAL_TS_RESULTS");
	
	if (forecasttype == 'double'){
		executeUpdate("CALL _SYS_AFL.PAL_TS_S (M2_V_PAL_TS_DATA, M2_PAL_TS_PARAMS, M2_PAL_TS_RESULTS) WITH OVERVIEW");
	} else {
		executeUpdate("CALL _SYS_AFL.PAL_TS_S (M2_V_PAL_TS_DATA, M2_PAL_TS_PARAMS, M2_PAL_TS_RESULTS) WITH OVERVIEW");
	}
	var strHTML = executeRecordSetObj("SELECT * FROM METRIC2.M2_V_PAL_RESULTS");
    return strHTML;
}


function showDashboardDialog(){
    var dashboardtitle = '';
	var dashboardsubtitle = '';
	if(service !== 'AddDashboardDialog'){
        //This is an edit
        var rs = executeReader("SELECT title, subtitle FROM metric2.m2_dashboard WHERE dashboard_id =" + dashboardid);
        while (rs.next()){
            dashboardtitle = rs.getString(1);
            dashboardsubtitle = rs.getString(2);
        }
		rs.close();
    }
	
    output = "<form class='form-horizontal' role='form'>";
		output += "<input type='" + debugmode + "' value='" + dashboardid + "' id='dashboardid' />";
		output += "<div class='form-group'><label for='dashboardtitle' class='col-sm-3 col-sm-3 control-label'>Title:</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='Title' id='dashboardtitle' value = '" + dashboardtitle + "' /></div></div>";
    output += "</form>";
}


function showWidgetHistoryDialog(dashboardwidgetid, reclimit, startdt, enddt){

	//var strHTML = '[["2012-10-02",200],["2012-10-09", 300],["2012-10-12", 150]]';
    var strSQL = "SELECT TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'YYYY') as year, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM') as month, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'DD') as day, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'HH24') as hour,TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MI') as min, '00' as secs, TO_DECIMAL(AVG(TO_INT(metric2.m2_dwp_history.value)),2,2) as value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " AND (TO_DATE(TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM/DD/YYYY'),'MM/DD/YYYY') between TO_DATE('" + startdt + "','MM/DD/YYYY')  AND TO_DATE('" + enddt + "','MM/DD/YYYY')) GROUP BY TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'YYYY'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'DD'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'HH24'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MI') ORDER BY day, hour, min";
	//var strSQL = "CALL METRIC2.M2_P_WIDGET_HISTORY(" + dashboardwidgetid + ",'" + startdt + "','" + enddt + "');";
	var strHTML = executeRecordSetObj(strSQL);
	return strHTML;
}


function showAlertHistoryDialog(alertid){

	var strHTML = "<table class='w-histchart-table'><tr><td style='text-align: right;'>";
		strHTML += "<img src='img/hist-icon-table.png' class='alert-menu-img' onClick='alertHistoryTable(1);' />";
		strHTML += "<img src='img/hist-icon-bubble.png' class='alert-menu-img' onClick='alertHistoryTable(2);' />";
		strHTML += "<img src='img/hist-icon-expand.png' class='alert-menu-img' onClick='alertHistoryTable(3);' />";
	strHTML += "</td></tr></table>";
	strHTML += "<div id='alerttable' style='margin-left: 0px;'>";
		strHTML += "<table class='table table-striped' id='table2'>";
			strHTML += "<thead><tr><th>Hour</th><th style='text-align: center;'>Monday</th><th style='text-align: center;'>Tuesday</th><th style='text-align: center;'>Wednesday</th>";
			strHTML += "<th style='text-align: center;'>Thursday</th><th style='text-align: center;'>Friday</th><th style='text-align: center;'>Saturday</th><th style='text-align: center;'>Sunday</th></tr></thead><tbody>";
				var hour = 0;
				
				while (hour < 24){
					strHTML += "<tr><th scope='row'>" + hour + ":00 - " + (hour + 2) + ":00</th>";
					
					for (var day = 1; day < 8; day++){
						var value = executeScalar("SELECT COUNT(IFNULL(actual, 0)) FROM metric2.m2_alert_history WHERE metric2.m2_alert_history.alert_id = " + alertid + " AND TO_INT(TO_CHAR(ADDED, 'HH24')) in ('" + hour + "','" + (hour + 1) + "') AND TO_CHAR(ADDED, 'D') = '" + day + "'");
						strHTML += "<td style='text-align: center;'>" + value + "</td>";
					}
					
					strHTML += "</tr>";
					hour += 2;
				}
			strHTML += "</tbody>";
		strHTML += "</table>";
	strHTML += "</div>";
	return strHTML;
}


function showWidgetDialog(){
    var widgettitle = '';
    var widgetwidth = '1';
    var widgetheight = '1';
	var widgetrefresh = '';
	var widgettype = 'WebService';
	
	if(widgetid === undefined){
        //This is an edit
        widgetid = getWidgetIDFromDashboardWidgetID();
        var rsdetails = executeReader("SELECT * FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
        while (rsdetails.next()){
            widgetwidth = rsdetails.getString(5);
            widgetheight = rsdetails.getString(6);
            widgettitle = rsdetails.getString(4);
			widgetrefresh = rsdetails.getString(9);
        }
		rsdetails.close();
    }
    
    var defaultwidgetwidth = executeScalar("Select def_width from metric2.m2_widget where widget_id = " + widgetid);
    var defaultwidgetheight = executeScalar("Select def_height from metric2.m2_widget where widget_id = " + widgetid);
    
    widgetwidth = defaultwidgetwidth !== '' ? defaultwidgetwidth : widgetwidth;
    widgetheight = defaultwidgetheight !== '' ? defaultwidgetheight : widgetheight;
    
    output += "<form class='form-horizontal' role='form'>";
        output += "<input type='" + debugmode + "' value='newwidget' id='action' />";
        output += "<input type='" + debugmode + "' value='" + dashboardid + "' id='dashboardid' />";
        output += "<input type='" + debugmode + "' value='" + widgetid + "' id='widgetid' />";
        output += "<input type='" + debugmode + "' value='" + dashboardwidgetid + "' id='dashboardwidgetid' />";
        output += "<div class='form-group'><label class='col-sm-3 control-label'>Type: </label><div class='col-sm-9'>" + getWidgetNameFromWidgetID(widgetid) + "</div></div>";
        output += "<div class='form-group'><label for='widgettitle' class='col-sm-3 col-sm-3 control-label'>Title:</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='Title' id='widgettitle' value = '" + widgettitle + "' /></div></div>";
	
        output += "<div class='form-group'><label for='widgetwidth' class='col-sm-3 control-label'>Width</label><div class='col-sm-9'><select class='form-control' id='widgetwidth' style='width: 100px;'";
        output += defaultwidgetwidth ? ' disabled ' : '';
        output += ">" + showWidgetSizeDropdown(widgetwidth) + "</select></div></div>";
    
    	output += "<div class='form-group'><label for='widgetheight' class='col-sm-3 control-label'>Height</label><div class='col-sm-9'><select class='form-control' id='widgetheight' style='width: 100px;'";
        output += defaultwidgetheight ? ' disabled ' : '';
        output += ">" + showWidgetSizeDropdown(widgetheight) + "</select></div></div>";
	
	output += "<div class='form-group'><label for='refreshrate' class='col-sm-3 control-label'>Refresh Rate:</label><div class='col-sm-9'><div class='input-group'><input class='form-control' type='text' placeholder='0' id='refreshrate' value = '" + widgetrefresh + "'  style='width: 90px;'>&nbsp;Secs</div></div></div>";
	
	var rs = executeReader("SELECT param_id, name, type, value_default, index_no, required, placeholder, display_name, visible, option_group FROM metric2.m2_widget_param WHERE widget_id =" + widgetid + " ORDER BY index_no");
    while (rs.next()) {
        var value = 'unknown';
        var value = dashboardwidgetid === undefined ? rs.getString(4) : getWidgetParamValueEscaped(rs.getString(1), dashboardwidgetid);
		
		value = replaceAll("MET2", "&#039;", value);
        value = replaceAll("MET3", "&#037;", value);	
		
		if (rs.getString(9) == 'true'){
			output += "<div class='form-group'><label for='pid_" + rs.getString(1) + "' class='col-sm-3 control-label'>" + rs.getString(8) + "</label><div class='col-sm-9'>";
			
			if (rs.getString(3) == 'OPTION'){
				output += "<select class='form-control' id='pid_" + rs.getString(1) + "'>" + showParamOption(rs.getString(10), value) + "</select>";
			} else {
				output += "<input class='form-control' type='text'  value='" + value + "' placeholder='" + rs.getString(7) + "' id='pid_" + rs.getString(1) + "' />";
			}
			
			output += "</div></div>";
			
		} else {
		    output += "<input class='form-control' type='" + debugmode + "' value='" + value + "' placeholder='" + rs.getString(7) + "' id='pid_" + rs.getString(1) + "' />";    
		}
		
    }
	rs.close();
	
	if (getWidgetTypeFromWidgetID(widgetid) == 'WebService'){
		var serviceurl = 'saveDataPoint.html?pid=' + getDashboardWidgetParamIDFromParamName('VALUE',dashboardwidgetid) + '&value=12345';
		output += "<div class='form-group'><label for='pid_serviceurl'  class='col-sm-3 control-label'>API Url</label><div class='col-sm-9'><a href='" + serviceurl + "'>" + serviceurl + "</div></div>";
	}
    output += "</form>";
}


function showWidgetNameDropDown(dashboardwidgetid){
    var strHTML = "<select id='widgetid'>";
    var rs = executeReader("SELECT dashboard_widget_id, metric2.m2_dashboard_widget.title, metric2.m2_dashboard.title FROM metric2.m2_dashboard_widget INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid + " order by metric2.m2_dashboard.dashboard_id ASC");
	while (rs.next()){
		strHTML += "<option ";
		if (dashboardwidgetid == rs.getString(1)){
			strHTML += ' selected ';
		}
		strHTML += " value=" + rs.getString(1) + ">" + rs.getString(3) + " - " + rs.getString(2) + "</option>";
	}
	rs.close();
	strHTML += "</select>";
	return strHTML;
}

function showParamOption(optiongroup, value){
	var strHTML = '';
	var rs = executeReader("SELECT option_group, value, display_value FROM metric2.m2_widget_param_options WHERE option_group =" + optiongroup + " ORDER BY display_value");
	while (rs.next()) {
		var selected = rs.getString(2) == value ? ' selected ' : '';
        strHTML += "<option value = '" + rs.getString(2) + "'" + selected + ">" + rs.getString(3) + "</option>";
	}
	rs.close();
	return strHTML;
}


function showWidgetSizeButtons(selected){
	var output = '';
	
	output += selected == 1 ? "<a class='btn active' href='#'>1</a>" : "<a class='btn' href='#'>1</a>";
	output += selected == 2 ? "<a class='btn active' href='#'>2</a>" : "<a class='btn' href='#'>3</a>";
	output += selected == 3 ? "<a class='btn active' href='#'>3</a>" : "<a class='btn' href='#'>3</a>";
	output += selected == 4 ? "<a class='btn active' href='#'>4</a>" : "<a class='btn' href='#'>4</a>";
	
	return output;
}

function showWidgetSizeDropdown(selected){
	var output = '';
	output += selected == 1 ? "<option selected>1</option>" : "<option>1</option>";
	output += selected == 2 ? "<option selected>2</option>" : "<option>2</option>";
	output += selected == 3 ? "<option selected>3</option>" : "<option>3</option>";
	output += selected == 4 ? "<option selected>4</option>" : "<option>4</option>";	
	return output;
}


// --------------------------------------- End Dialogs ----------------------------------------------------- //

// --------------------------------------- Misc/Generic-Functions ----------------------------------------------------- //

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// --------------------------------------- End Misc/Generic-Functions ----------------------------------------------------- //


// --------------------------------------- Get-Functions ----------------------------------------------------- //

function getWidgetIDFromDashboardWidgetID(){
    return executeScalar("SELECT widget_id FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetRefreshRate(dashboardwidgetid){
    return parseInt(executeScalar("SELECT refresh_rate FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid))*1000;
}

function getWidgetNameFromWidgetID(widgetid){
    return executeScalar("SELECT name FROM metric2.m2_widget WHERE widget_id =" + widgetid);
}

function getWidgetTypeFromWidgetID(widgetid){
    return executeScalar("SELECT type FROM metric2.m2_widget WHERE widget_id =" + widgetid);
}

function getWidgetCodeType(dashboardwidgetid){
	return executeScalar("SELECT code FROM metric2.m2_widget INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_widget.widget_id = metric2.m2_dashboard_widget.widget_id WHERE metric2.m2_dashboard_widget.dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetHeight(dashboardwidgetid){
	return executeScalar("SELECT height FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetWidth(dashboardwidgetid){
	return executeScalar("SELECT width FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
}


function getWidgetParamValue(paramid, dashboardwidgetid){
    //return executeScalar("SELECT REPLACE(value, 'MET2', '''') from metric2.m2_dashboard_widget_params WHERE param_id =" + paramid + " AND dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetParamValueEscaped(paramid, dashboardwidgetid){
    try {
        return executeScalar("SELECT REPLACE(REPLACE(value, 'MET3', '&#037;'), 'MET2', '&#039;') from metric2.m2_dashboard_widget_params WHERE param_id =" + paramid + " AND dashboard_widget_id =" + dashboardwidgetid);
    } catch (err) {
		return err;
	}
}

function getWidgetParamValueFromParamName(paramname, dashboardwidgetid){
	try {
		var value = executeScalar("SELECT REPLACE(REPLACE(value, 'MET3', '%'), 'MET2', '''') from metric2.m2_dashboard_widget_params INNER JOIN metric2.m2_widget_param ON metric2.m2_dashboard_widget_params.param_id = metric2.m2_widget_param.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		return value;
	} catch (err) {
		return err;
	}
}

function getDashboardWidgetParamIDFromParamName(paramname, dashboardwidgetid){
	try {
		var value = executeScalar("SELECT metric2.m2_dashboard_widget_params.dashboard_widget_param_id from metric2.m2_dashboard_widget_params INNER JOIN metric2.m2_widget_param ON metric2.m2_dashboard_widget_params.param_id = metric2.m2_widget_param.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		return value;
	} catch (err) {
		return err.message;
	}
}

function getWidgetParamSinglePastValueFromParamName(paramname, dashboardwidgetid){
	try {
        return executeScalar("SELECT metric2.m2_dwp_history.value, metric2.m2_dwp_history.dt_added from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " ORDER BY metric2.m2_dwp_history.dt_added desc LIMIT 1");
	} catch (err) {
		return err.message;
	}
}

function getWidgetParamRangePastValueFromParamName(paramname, dashboardwidgetid, reclimit){
	try {
        return executeRecordSetObj("SELECT metric2.m2_dwp_history.dt_added, metric2.m2_dwp_history.value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE name = '" + paramname + "' AND metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " ORDER BY metric2.m2_dwp_history.dt_added desc LIMIT " + reclimit);
	} catch (err) {
		return err.message;
	}
}

// --------------------------------------- End Get-Functions ----------------------------------------------------- //

function insertWidgetHistory(dashboardwidgetid, paramname, value, dashboardwidgetparamid){
	try {
		if (!dashboardwidgetparamid && value !== 'NaN' && value !== 'Undefined' && value !== ''){
				dashboardwidgetparamid = executeScalar("SELECT DASHBOARD_WIDGET_PARAM_ID FROM metric2.M2_dashboard_widget_params INNER JOIN metric2.M2_WIDGET_PARAM ON metric2.M2_WIDGET_PARAM.param_id = metric2.m2_dashboard_widget_params.param_id WHERE metric2.m2_widget_param.name = '" + paramname + "' AND metric2.M2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		}
		executeQuery("INSERT INTO metric2.M2_DWP_HISTORY (dwp_hist_id, dashboard_widget_param_id, value) VALUES (metric2.dwp_history_id.NEXTVAL, " + dashboardwidgetparamid + ", '" + value + "')");
		return '';
	} catch (err) {
		return err.message;
	}
}


// --------------------------------------- Dashboards ----------------------------------------------------- //


function createDashboard(sql){
    //Create a new dashboard and return the value
	try {
    	executeInputQuery(sql);
    	executeInputQuery("UPDATE metric2.m2_dashboard SET user_id = " + userid + " WHERE user_id = 999");
		return executeScalar("Select MAX(dashboard_id) from metric2.m2_dashboard WHERE user_id = " + userid)
	} catch (err) {
		return err.message;
	}
    
}


// --------------------------------------- End Dashboards ----------------------------------------------------- //





// --------------------------------------- Widget UI's ----------------------------------------------------- //


function widgetTextAndFooter(intDashboardWidgetID){
    var strHTML = "<div class='t1-widget-text-big'>" + executeScalar("SELECT VALUE FROM metric2.m2_dashboard_widget_params WHERE dashboard_widget_id =" + intDashboardWidgetID + " AND PARAM_ID = 4") + "</div>";
    strHTML += "<div class='t1-widget-footer'>";
    strHTML += "<div class='t1-widget-percent-medium-grey'>" + executeScalar("SELECT VALUE FROM metric2.m2_dashboard_widget_params WHERE dashboard_widget_id =" + intDashboardWidgetID + " AND PARAM_ID = 5") + "</div>";
	strHTML += "</div>";
    
    return strHTML;
}

function widgetList(dashboardwidgetid){
    return executeRecordSet(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
}

function widgetNumberAndText(dashboardwidgetid){
	var datapoint = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<div class='t1-widget-text-big'>" + datapoint + "";
    strHTML += "<p class='t1-widget-text-small'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p></div>";
	strHTML += checkWidgetAlert(dashboardwidgetid, datapoint);
    return strHTML;
}

function widgetInstanceDetails(dashboardwidgetid){
    var strHTML = "<table style='height: 100%'><tr><td><p class='t1-widget-text-big'>" + executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
    strHTML += "</td></tr><tr><td><font style='font-size: 40px; color: #999;'>" + executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)) + "</font></p></td></tr></table>";
	strHTML += "";
    
    return strHTML;
}


function widgetDateTime(dashboardwidgetid){
	var strHTML = "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
	strHTML += "showClock(" + dashboardwidgetid + ");";
	strHTML += "timer = $.timer(function() { showClock(" + dashboardwidgetid + "); }); timer.set({ time : 1000, autostart : true });";
    //strHTML += "timers.push(timer);"
    strHTML += "</script>";
	return strHTML;
}


function widgetAllServicesStarted(dashboardwidgetid){
	// Get system connection and execute these queries against it
	//Save query value to a history table for later review
	var value1 = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var value2 = executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid));
	
	var strHTML = "<div class='t1-widget-text-big'>" + value1 + "</div><br />";
	strHTML += "<div class='t1-widget-footer'>";
        strHTML += "<div class='t1-widget-percent-medium-grey'>" + value2 + "</div>";
	strHTML += "</div>";
	strHTML += checkWidgetAlert(dashboardwidgetid, value1);
    return strHTML;
}

function widgetIcon(dashboardwidgetid){
	var datapoint = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<img class='w-icon-img' src='" + getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid) + "' >";
	strHTML += "<p class='w-icon-datapoint'>" + datapoint + "</p>";
	strHTML += "<p class='w-icon-text1'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p>";
	strHTML += checkWidgetAlert(dashboardwidgetid, datapoint);
	return strHTML;
}

function widgetImageBox(dashboardwidgetid){
	var strHTML = "<img class='w-icon-img' src='" + getWidgetParamValueFromParamName('URL', dashboardwidgetid) + "' >";
	return strHTML;
}

function widgetRecentUnConnections(dashboardwidgetid){
	var data = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<div class='iconframe'><img src='img/icon-lock.png' class='w-unsuccesfulconns-img'>";
    strHTML += "<p class='w-unsuccesfulconns-datapoint'>";
	strHTML += data + " Attempts</p></div>";
	
	strHTML += checkWidgetAlert(dashboardwidgetid, data);
	return strHTML;
}

function widgetIconDistributed(dashboardwidgetid){
    var strHTML = "<div class='iconframe'>";
	var boolDistributed = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var strText = '';
	if (boolDistributed == 'Yes'){
		strHTML += "<img src='img/distributedicon.png' class='w-distributed-img' />";
		strText = 'Distributed';
	} else {
		strHTML += "<img src='img/singleicon.png' class='w-distributed-img' />";
		strText = 'Single';
	}
	strHTML += "<p class='w-distributed-datapoint'>" + strText + "</p></div>";
	return strHTML;
}


function widgetBullet(dashboardwidgetid){
    
    var datadisk = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
    var logdisk = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)));
    var tracedisk = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL3', dashboardwidgetid)));
    
	var data1 = '{"title": "Data Size", "subtitle": "' + datadisk[0].DATA_SIZE + ' Gb","ranges": [' + datadisk[0].USED_SIZE + ', ' + datadisk[0].DISK_SIZE + ', ' + datadisk[0].DISK_SIZE + '],"measures": [' + datadisk[0].DATA_SIZE + '],"markers": [' + datadisk[0].DISK_SIZE + ']}';
	var data2 = '{"title": "Log Size", "subtitle": "' + logdisk[0].DATA_SIZE + ' Gb","ranges": [' + logdisk[0].USED_SIZE + ', ' + logdisk[0].DISK_SIZE + ', ' + logdisk[0].DISK_SIZE + '],"measures": [' + logdisk[0].DATA_SIZE + '],"markers": [' + logdisk[0].DISK_SIZE + ']}';
	var data3 = '{"title": "Trace Size", "subtitle": "' + tracedisk[0].DATA_SIZE + ' Gb","ranges": [' + tracedisk[0].USED_SIZE + ', ' + tracedisk[0].DISK_SIZE + ', ' + tracedisk[0].DISK_SIZE + '],"measures": [' + tracedisk[0].DATA_SIZE + '],"markers": [' + tracedisk[0].DISK_SIZE + ']}';
	var strHTML = "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetBullet('t1-widget-container" + dashboardwidgetid + "','" + data1 + "','" + data2 + "','" + data3 + "');</script>";
	return strHTML;
}


function widgetNumberChange(dashboardwidgetid){
	var data = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var fltPrevValue = parseInt(getWidgetParamSinglePastValueFromParamName('SQL1', dashboardwidgetid));
	var strUOM = getWidgetParamValueFromParamName('UOM1', dashboardwidgetid);
	var intDecPlace = parseInt(getWidgetParamValueFromParamName('DECPLACE', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', data);
	
	var strHTML = "<div class='t1-widget-text-big'>" + data + "</div>";
	var fltCurValuedata = parseFloat(data);
	var strFooter = "";
	
	
	try{
            var fltChangeValue = (fltCurValuedata - fltPrevValue);
			fltChangeValue = fltChangeValue.toFixed(intDecPlace);
			strHTML += "<div class='t1-widget-footer' style='margin-top: 30px;'>";
			if (fltChangeValue > 0){
				strFooter = "<div class='t1-widget-percent-medium-green'>&#9650 " + fltChangeValue + " " + strUOM + "</div>";
			} else if (data == fltPrevValue) {
				strFooter = "<div class='t1-widget-percent-medium-grey'>&#9668 " + strUOM + "</div>";
			} else {
				strFooter = "<div class='t1-widget-percent-medium-red'>&#9660" + fltChangeValue + " " + strUOM + "</div>";
			}
	} catch (err) {
		strFooter = err;
		strHTML += "</div>";
	}
	
	strHTML += checkWidgetAlert(dashboardwidgetid, fltCurValuedata);
	
	return strHTML + strFooter; 
}

function widgetHistoryChart(dashboardwidgetid, uom){
	try{
		var strHistData = new Array([]);
		var datapoint = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
		var reclimit = getWidgetParamValueFromParamName('RECLIMIT', dashboardwidgetid);
		insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
		strHistData = JSON.parse(getWidgetParamRangePastValueFromParamName('SQL1', dashboardwidgetid, reclimit));
		var strChartType = getWidgetParamValueFromParamName('CHARTTYPE', dashboardwidgetid);
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var strHTML = "<div class='t1-widget-percent-medium-grey w-historychart-datapoint'>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></div>";
		strHTML += "<span class='" + dashboardwidgetid + "'>" + strData + "</span>";
		
		strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
		strHTML += "$('." + dashboardwidgetid + "').peity('" + strChartType + "', {";
			strHTML += "width: '" + parseInt(getWidgetWidth(dashboardwidgetid)) * 200 + "',";
			strHTML += "height: '" + parseInt(getWidgetHeight(dashboardwidgetid)) * 145 + "'";
		strHTML += "})";
		
		strHTML += "</script>";
		
		strHTML += checkWidgetAlert(dashboardwidgetid, datapoint);
		
		return strHTML;
	} catch (err) {
		return err;
	}
}


function widgetHistorySmall(dashboardwidgetid){
    try{
		var strHistData = new Array([]);
		var datapoint = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
		var reclimit = getWidgetParamValueFromParamName('RECLIMIT', dashboardwidgetid);
        var uom = getWidgetParamValueFromParamName('UOM1', dashboardwidgetid);
        var imgURL = getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid);
        var strSparkColor = getWidgetParamValueFromParamName('LINECOL', dashboardwidgetid);
		insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
		strHistData = JSON.parse(getWidgetParamRangePastValueFromParamName('SQL1', dashboardwidgetid, reclimit));
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var strHTML = "<div class='t1-widget-text-big' style='top: 65px;'><table style='width: 100%;'><tr>";
        if (imgURL){
            strHTML += "<td><img src='" + imgURL + "' /> </td>";
        }
        strHTML += "<td>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></td></tr></table></div>";
		strHTML += "<div class='t1-widget-footer' style='text-align:center'><span class='" + dashboardwidgetid + "'>" + strData + "</span></div>";
		
		strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
		strHTML += "$('." + dashboardwidgetid + "').peity('line', {";
			strHTML += "width: '" + parseInt(getWidgetWidth(dashboardwidgetid)) * 185 + "',";
			strHTML += "height: '" + parseInt(getWidgetHeight(dashboardwidgetid)) * 60 + "',";
            strHTML += "strokeColour: '" + strSparkColor + "', colour: '#FFFFFF'";
		strHTML += "})";
		
		strHTML += "</script>";
		
		strHTML += checkWidgetAlert(dashboardwidgetid, datapoint);
		
		return strHTML;
	} catch (err) {
		return err;
	}
}

function getIconForStatus(strStatus){
	if (strStatus === 'OK') {
		return '<img src="img/OKIcon.png">';
	} else if (strStatus === 'WARNING'){
		return '<img src="img/WARNINGIcon.png">';
	} else {
		return '<img src="img/ERRORIcon.png">';
	}
}


function widgetUsedMemoryPie(dashboardwidgetid){
	var intPhysicalMem = executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var intFreePhysicalMem = executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid));
    insertWidgetHistory(dashboardwidgetid, 'SQL1', intFreePhysicalMem);
	var strHTML = "";
	strHTML += "<div class='t1-widget-peity'>";
	strHTML += "<table width='100%'><tr>";
	strHTML += "<td><span class='pie-memory' data-diameter='120'>" + intFreePhysicalMem + "/" + intPhysicalMem + "</span></td>";
	strHTML += "</tr><tr>";
	strHTML += "<td class='w-usedmem-datapoint'><br />" + intFreePhysicalMem + " of " + intPhysicalMem + "Gb</td>";
	strHTML += "</tr></table>";
	strHTML += "</div>";
	
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
	strHTML += "$('.pie-memory').peity('pie', {";
			strHTML += "colours: function(_, i, all) {";
				strHTML += "var col = '';";
				strHTML += "if (i == 0){";
					strHTML += "if (parseInt(all[i]) >= parseInt(all[all.length - 1])) {";
						strHTML += "col = '#009DE0'";
					strHTML += "} else if ((parseInt(all[i])/parseInt(all[all.length - 1])*100) > 90) {";
						strHTML += "col = '#4D89F9'";
					strHTML += "} else {";
						strHTML += "col = '#4D89F9'";
					strHTML += "}";
				strHTML += "} else {";
					strHTML += "col = '#D4D4D4'";
				strHTML += "}";
				strHTML += "return col";
			strHTML += "}";
		strHTML += "}";
	strHTML += ");";
	strHTML += "</script>";
	
	strHTML += checkWidgetAlert(dashboardwidgetid, intFreePhysicalMem);

return strHTML;
}


function widgetComponentOverview(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%'><tr>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[0].STATUS) + "</div><br />";
	strHTML += "<p class='t1-widget-icon-text'>CPU</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[1].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Data Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[2].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Log Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[3].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Trace Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[4].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Statistics</p></td>";
		
	strHTML += "</tr></table>";
    return strHTML;
}


function widgetSystemOverview(dashboardwidgetid){
	var strHTML = "<table class='w-misc-table'>";
	
	strHTML += "<tr><td><div class='t1-widget-text-medium'>" +  executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)) + "%</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)) + "GB</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  executeScalar(getWidgetParamValueFromParamName('SQL3', dashboardwidgetid)) + "</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  executeScalar(getWidgetParamValueFromParamName('SQL4', dashboardwidgetid)) + "</div></td></tr>";
	
	strHTML += "<tr><td class='t1-widget-text-table'>Total CPU</td>";
	strHTML += "<td class='t1-widget-text-table'>Memory</td>";
	strHTML += "<td class='t1-widget-text-table'>Services Started</td>";
	strHTML += "<td class='t1-widget-text-table'>Distributed</td></tr>";
		
	strHTML += "</table>";
    return strHTML;
}


function widgetTableSizes(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table class='w-misc-table' style='margin-top: 25px;'>";
	
	strHTML += "<tr><td><div class='t1-widget-text-medium'>" + datapoints[0].rows  + "<sup>GB</sup></div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  datapoints[0].cols + "<sup>GB</sup></div></td>";
	
	strHTML += "<tr><td class='t1-widget-text-table'><img src='img/row-tables.png' />&nbsp;&nbsp;Rows</td>";
	strHTML += "<td class='t1-widget-text-table'><img src='img/col-tables.png' />&nbsp;&nbsp;Cols</td>";
		
	strHTML += "</table>";
    return strHTML;
}




function widgetDBMemoryOverview(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%' style='align: center;'>";
	
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].ALLOCATION_LIMIT + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Allocated</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PEAK + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Peak</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY_USED_SIZE + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Used</td></tr>";

	strHTML += "</table>";
    return strHTML;
}

function widgetResMemoryOverview(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%' style='align: center;'>";
	
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Physical</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Total Resident</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB DB Resident</td></tr>";

	strHTML += "</table>";
    return strHTML;
}

function widgetFunnel(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table class='w-funnel-table'>";
	
	var itemmax = datapoints[0].STATUS;
	var itemmid = Math.round(((datapoints[1].STATUS/itemmax)*100));
	var itemmin = Math.round((datapoints[2].STATUS/itemmax)*100);
	var permax = (100 - (itemmid + itemmin));
	
	strHTML += "<tr><td style='background-color: #f55b4c; width: 50px;'></td><td class='t1-widget-text-table' style='width: 50px; text-align:left; width: 70px; color: #f55b4c;padding-left: 10px; height: " + permax + "%;'>" +  datapoints[0].STATUS + " Connections</td>";
	strHTML += "<td rowspan='3' style='width: 200px;'><img src='img/funnel-summary.png' /><font style='font-size: 40px; color: #CCC;'>&nbsp;&nbsp;" + (parseInt(datapoints[0].STATUS) + parseInt(datapoints[1].STATUS) + parseInt(datapoints[2].STATUS)) + "</font></td><td rowspan='3'></td></tr>";
	strHTML += "<tr><td style='background-color: #FFDD72; width: 50px;'></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #FFDD72; height: " + itemmid + "%'>" +  datapoints[1].STATUS + " Idle</td></tr>";
	strHTML += "<tr><td style='background-color: #5BD993; width: 50px;'></td></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #5BD993; height: " + itemmin + "%'>" +  datapoints[2].STATUS + " Running</td></tr>";

	strHTML += "</table>";
    return strHTML;
}


function widgetProgressBar(dashboardwidgetid){
	var datapoints = JSON.parse(executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var imgUrl = getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid);
	var strHTML = "<table style='width: 100%;'><tr><td>";
	
	if (imgUrl !== ''){
        strHTML += "<img class='w-icon-img' src='" + imgURL + "'>";
	} else {
        strHTML += "&nbsp;";
	}
	
	strHTML += "</td><td><div class='widget-progressbar-percent'>" + datapoints[0].PERCENT + "%</div>";
	strHTML += "<div class='widget-progressbar'>" + datapoints[0].LABEL + "</div></td></tr></table>";
	strHTML += "<div style='width: 94%; margin: 0 auto;'><table style='width: 100%; border: 1px solid #BBB; height: 30px; border-spacing: 5px;'>";
	strHTML += "<tr><td class='widget-progressbar-td' style='background-color: #DDD; width:" + datapoints[0].PERCENT + "%;'>&nbsp;</td><td></td></tr>";
	strHTML += "</table></div>";
    return strHTML;
}


function widgetSystemAlerts(dashboardwidgetid){
	var strHTML = '';
	var img = '';
	var rs = executeReader(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var count = 0;
	
	
	strHTML += "<div id='aniHolder'>";
        while (rs.next()){
			count++;
			if (rs.getString(2) === '4') {
				img = '<img src="img/ERRORIcon.png">';
			} else if (rs.getString(2) === '2'){
				img = '<img src="img/WARNINGIcon.png">';
			} else {
				img = '<img src="img/OKIcon.png">';
			}
	
            strHTML += "<div id='" + rs.getString(1) + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td'>" + img + "</td>";
						strHTML += "<td class='w-sysalerts-text'>" + rs.getString(6) + "<br /><b>" + rs.getString(1) + "</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
		}
		
	if (count === 0){
		strHTML += "<div id='sysalert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td'><img src='img/OKIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
	}
	
	strHTML += "</div>";
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetAlertRotator();</script>";
	return strHTML;
}

function widgetUserAlerts(dashboardwidgetid){
	var strHTML = '';
	var img = '';
	var rs = executeReader(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var count = 0;
	
	
	strHTML += "<div id='userAlert'>";
        while (rs.next()){
			count++;
			strHTML += "<div id='useralert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/WARNINGIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'>" +  rs.getString(5) + "<br />" + rs.getString(9) + "<br />Condition: <b>" + rs.getString(4) + " " + rs.getString(2) + " " + rs.getString(6) + "</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
		}
		
	if (count === 0){
		strHTML += "<div id='useralert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/OKIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
	}
	
	strHTML += "</div>";
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetUserAlertRotator();</script>";
	return strHTML;
}
	
	
function widgetSensorAPI(dashboardwidgetid){
    var datapoint = getWidgetParamSinglePastValueFromParamName('VALUE', dashboardwidgetid);
    var strHTML = '<div class="t1-widget-text-big">' + datapoint + '<sup>' + getWidgetParamValueFromParamName('UOM1', dashboardwidgetid) + '</sup></div>';
	strHTML += "<p class='w-sensor-text1'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p>";	
	strHTML += checkWidgetAlert(dashboardwidgetid, datapoint);
	insertWidgetHistory(dashboardwidgetid, 'VALUE', datapoint);
	return strHTML;
}


function widgetRSSFeed(dashboardwidgetid){
	var strHTML = "<div id='rss'></div><script type='text/javascript' id='evalcodeRSSFeeds' name='script'>widgetRSSFeed(" + getWidgetParamValueFromParamName('FEEDCOUNT', dashboardwidgetid) + ",'" + getWidgetParamValueFromParamName('URL', dashboardwidgetid) + "','rss');</script>";
	return strHTML;
}
	



// --------------------------------------- End Widget UI's ----------------------------------------------------- //


// --------------------------------------- SQL-Functions ----------------------------------------------------- //

function executeUpdate(strSQL){
	try {
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareStatement(strSQL);
		var updateCount = pstmt.executeUpdate();
		conn.commit();
		return updateCount;
	} catch (err) {
		return err.message;
	}
}

function executeQuery(strSQL){
	try{
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareStatement(strSQL);
		var updateCount = pstmt.executeQuery();
		conn.commit();
		return updateCount;
	} catch (err) {
		return err.message;
	}
}

function executeStoredProc(strSQL){
	try {
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareCall(strSQL);
		var updateCount = pstmt.execute();
		conn.commit();
		return updateCount;
	} catch (err) {
		return err.message;
	}
}


function executeReader(strSQL){
	try{
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareStatement(strSQL);
		var rs = pstmt.executeQuery();
		return rs;
	} catch (err) {
		return err.message;
	}
}


function executeScalar(strSQL){
	
	try{
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareStatement(strSQL);
		var rs = pstmt.executeQuery();
		var retVal;
			
		if (!rs.next()) {
			retVal = '';
		} else {
			retVal = rs.getString(1).replace("'", "\'");
		}
		
		rs.close();
		pstmt.close();
		conn.close();
		
		return retVal;
	} catch (err) {
		return '';
	}
}

function executeRecordSet(strSQL){
	try {
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareStatement(strSQL);
		var rs = pstmt.executeQuery();
		var rsm = rs.getMetaData();
		var intCount = 0;
		var htmlTable = '';
		
		htmlTable += '<table class=\'w-recordset-table\'><tr>';
		
		//Get the table data + header
		for (var i = 1; i <= rsm.getColumnCount(); i++){
			htmlTable += '<th align=\'left\'>' + rsm.getColumnName(i) + '</th>';
		}
		
		htmlTable += '</tr>';
		while (rs.next()) {
			htmlTable += '<tr>';
			for (var i = 1; i <= rsm.getColumnCount(); i++){
				htmlTable += '<td align=\'left\'>';
				htmlTable += rs.getString(i);
				htmlTable += '</td>';
			}
			htmlTable += '</tr>';
		}
		htmlTable += '</table>';
		
		rs.close();
		pstmt.close();
		conn.close();
		
		return htmlTable;
	} catch (err) {
		return err.message;
	}
    
} 


function executeRecordSetObjCALL(strSQL){
	try {
		var conn = $.db.getConnection(strDashboardUser);
		var pstmt = conn.prepareCall(strSQL);
		var rs = pstmt.getRecordSet();
		var rsm = rs.getMetaData();
		var strObj = '';
		
		while (rs.next()) {
			strObj += '{';
			for (var i = 1; i <= rsm.getColumnCount(); i++){
				strObj += '"' + rsm.getColumnLabel(i) + '":"' + rs.getString(i) + '",';
			}
			strObj = strObj.substring(0, strObj.length - 1);
			strObj += '},'
		}
		rs.close();
		pstmt.close();
		conn.close();
		
		return '[' + strObj.substring(0, strObj.length - 1) + ']';
	} catch (err) {
		return err.message;
	}
}

function executeRecordSetObj(strSQL){
	try {
		var conn = $.db.getConnection(strDashboardUser);
		//conn.prepareStatement("SET SCHEMA \"METRIC2\"").execute();  
		var pstmt = conn.prepareStatement(strSQL);
		var rs = pstmt.executeQuery();
		var rsm = rs.getMetaData();
		var strObj = '';
		
		while (rs.next()) {
			strObj += '{';
			for (var i = 1; i <= rsm.getColumnCount(); i++){
				strObj += '"' + rsm.getColumnLabel(i) + '":"' + rs.getString(i) + '",';
			}
			strObj = strObj.substring(0, strObj.length - 1);
			strObj += '},'
		}
		rs.close();
		pstmt.close();
		conn.close();
		
		return '[' + strObj.substring(0, strObj.length - 1) + ']';
	} catch (err) {
		return err.message;
	}
}

function executeInputQuery(SQL){
	try{
		var rs = 0;
		var conn = $.db.getConnection(strDashboardUser);
		if (SQL.indexOf(";") > 0){
			var ss = SQL.split(";");
			var sql2 = '';
			var i = 0;
			for (i in ss) {
				sql2 = ss[i].replace(";","");
				if (sql2.length > 0){
				   var pstmt = conn.prepareStatement(decodeURIComponent(sql2));
					rs = pstmt.executeUpdate();
					conn.commit();
				}
			}
		} else {
			var pstmt = conn.prepareStatement(decodeURIComponent(SQL));
			rs = pstmt.executeUpdate();
			conn.commit();
		}
		
		//rs.close();
		//$.response.setBody(SQL);
		return rs;
	} catch (err) {
		return err;
	}
}


// --------------------------------------- End SQL-Functions ----------------------------------------------------- //