// --------------------------------------- Alerts ----------------------------------------------------- //

function createAlert(sql){
    try {
        sqlLib.executeInputQuery(sql);
        sqlLib.executeInputQuery("UPDATE metric2.m2_alert SET user_id = " + userid + " WHERE user_id = 999");
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
            sqlLib.executeQuery(SQL);
        }
    }
		
    for (var day = 1; day <= 400; day++){
        var num = Math.floor(Math.random() *98) + 80;
        var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual,added) VALUES (metric2.alert_history_id.NEXTVAL, " + alertid + ", " + dashboardwidgetid + ", 'value', '>', 80, 'dba@metric2.com'," + num + ", ADD_SECONDS(CURRENT_TIMESTAMP, 0))";
		sqlLib.executeQuery(SQL);
    }
}


function showAlerts(){
	var strHTML = "";
	strHTML += "<div class='row'>";
        strHTML += "<div class='col-md-2'>";
            strHTML += "<ul class='nav nav-list bs-docs-sidenav'>";
                strHTML += "<li><a href='#' onclick='addAlert();'><i class='icon-chevron-right'></i>Add Alert</a></li>";
                strHTML += "<li><a href='#' onclick='viewSummary();'><i class='icon-chevron-right'></i>Summary</a></li>";

                var rs = sqlLib.executeReader("SELECT DISTINCT metric2.m2_dashboard.title FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid);
                while (rs.next()){
                    strHTML += "<li><a href='#'><i class='icon-chevron-right'></i> " + rs.getString(1) + "</a></li>";
                }
                rs.close();
            strHTML += "</ul>";
          strHTML += "</div>";
        
        strHTML += "<div class='col-md-10'>"
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>User Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Dashboard</th><th>Widget Name</th><th>Status</th><th>Operator</th><th>Value</th><th>Notify</th><th>Alert Count</th><th>Modify</th><th>Clear</th></tr></thead><tbody>";

        var rs3 = sqlLib.executeReader("SELECT metric2.m2_dashboard_widget.title, cond, operator, value, notify, last_executed, metric2.m2_dashboard.title, alert_id, status FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid);
        while (rs3.next()){
            var strStatus = '';
            var strSetStatus = '';
            var intStatus = 0;
            var histcount = sqlLib.executeScalar("SELECT count(alert_hist_id) FROM metric2.m2_alert_history WHERE alert_id = " + rs3.getString(8));
            
            if (rs3.getString(9) == 1) { strStatus = 'Enabled'; strSetStatus = 'Disable'; intStatus = 0;} else { strStatus = 'Disabled'; strSetStatus = 'Enable'; intStatus = 1;}
                //strHTML += "<tr><td>" + rs3.getString(7) + "</td><td>" + rs3.getString(1) + "</td><td>" + strStatus + "</td><td>" + rs3.getString(3) + "</td><td>" + rs3.getString(4) + "</td><td>On-Screen</td><td><a href='#' onclick='alertHistory(" + rs3.getString(8) + ");'>" + histcount + "</a></td><td><a href='#' onclick='setAlert(" + rs3.getString(8) + ", " + intStatus + ");'>" + strSetStatus + "</a> | <a href='#' onclick='editAlert(" + rs3.getString(8) + ");'>Edit Alert</a> | <a href='#' onclick='deleteAlert(" + rs3.getString(8) + ");'>Delete Alert</a></td><td><a href='#' onclick='clearAlert(" + rs3.getString(8) + ");'>Clear History</a></td></tr>";
                strHTML += "<tr><td>" + rs3.getString(7) + "</td><td>" + rs3.getString(1) + "</td><td>" + strStatus + "</td><td>" + rs3.getString(3) + "</td><td>" + rs3.getString(4) + "</td><td>On-Screen</td><td><a href='#' onclick='alertHistory(" + rs3.getString(8) + ");'>" + histcount + "</a></td><td><a href='#' onclick='setAlert(" + rs3.getString(8) + ", " + intStatus + ");'>" + strSetStatus + "</a> | <a href='#' onclick='editAlert(" + rs3.getString(8) + ");'>Edit Alert</a></td><td><a href='#' onclick='clearAlert(" + rs3.getString(8) + ");'>Clear History</a></td></tr>";
        }
        rs3.close();
        
        strHTML += "</tbody></table></div>";
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>System Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Host</th><th>Rating</th><th>Last Check</th><th>Alert Details</th></tr></thead><tbody>";

        var rs2 = sqlLib.executeReader("SELECT ALERT_DETAILS, ALERT_RATING, UTCTOLOCAL(ALERT_TIMESTAMP, '" + strTimeZone + "'), HOST, ALERT_ID, ALERT_NAME, ALERT_DESCRIPTION, ALERT_USERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5)");
        while (rs2.next()){
            strHTML += "<tr><td>" + rs2.getString(4) + "</td><td>" + rs2.getString(2) + "</td><td>" + rs2.getString(3) + "</td><td>" + rs2.getString(1) + "</td></tr>";
        }
        rs2.close();
        strHTML += "</tbody></table></div></div>";
    return strHTML;
}

function deleteAlert(alertid){
    var SQL = "DELETE FROM metric2.m2_alert WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}


function clearAlert(alertid){
    var SQL = "DELETE FROM metric2.m2_alert_history WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}

function setAlert(alertid, intStatus){

	var SQL = "UPDATE metric2.m2_alert SET status = " + intStatus + " WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}

function checkWidgetAlert(dashboardwidgetid, value){
    //check if widget has an alert - if yes, check against the specified value and send an alert if needed
	try {
		var rs = sqlLib.executeReader("SELECT alert_id, operator, value, notify, cond, title FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id WHERE status = 1 AND metric2.m2_alert.dashboard_widget_id = " + dashboardwidgetid);
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
					sqlLib.executeQuery(SQL);
				}
			}
		}
		rs.close();
		return strContent;
	} catch (err) {
		return err + " " + SQL;
	}
}


function checkAlertJob(){
    try {
		var rs = sqlLib.executeReader("SELECT alert_id, operator, value, notify, cond, title, m2_dashboard_widget.dashboard_widget_id FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id WHERE status = 1");
		var strContent = '';
        
		while (rs.next()) {
			var alertid = rs.getString(2);
			var response = '';
			var doInsert = 0;
            var intCheckValue = rs.getInteger(3);
            var strOperator = rs.getString(2);
            var dashboardWidgetID = rs.getString(7);
            var value = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardWidgetID));
            
            //strContent += dashboardWidgetID + ' Value: ' + value + ' Operator:' + strOperator + ' Check Value:' + intCheckValue + '<br />';
            
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
					var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual) VALUES (metric2.alert_history_id.NEXTVAL, " + rs.getString(1) + ", " + rs.getString(7) + ", '" + rs.getString(5) + "', '" + rs.getString(2) + "', " + rs.getString(3) + ", 'XSJOB', " + value + ")";
					sqlLib.executeQuery(SQL);
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