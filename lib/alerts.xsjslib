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
    var alertContents = [];
    var alertUser = [];
    var data = {};
    
    data.userAlertCounts = sqlLib.executeRecordSetObj("SELECT alert_id, count(alert_hist_id) as cnt FROM metric2.m2_alert_history WHERE alert_id IN (SELECT alert_id FROM metric2.m2_alert WHERE metric2.m2_alert.user_id = " + userid + ") GROUP BY alert_id");
    data.userAlerts = sqlLib.executeRecordSetObj("SELECT metric2.m2_dashboard_widget.title, cond, operator, value, notify, last_executed, metric2.m2_dashboard.title as dashboardtitle, alert_id as ALERTID, status FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid);
    data.sysAlerts = sqlLib.executeRecordSetObj("SELECT ALERT_DETAILS as ALERTDETAILS, ALERT_RATING as ALERTRATING, UTCTOLOCAL(ALERT_TIMESTAMP, '" + strTimeZone + "') as TIME, HOST, ALERT_ID, ALERT_NAME as ALERTNAME, ALERT_DESCRIPTION as ALERTDESCRIPTION, ALERT_USERACTION as ALERTUSERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5)");
    
    return data;
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

function sendAlertEmail(email, msg){
    var SQL = "INSERT INTO metric2.m2_outgoing_email (id, emailfrom, emailto, subject, contents) VALUES (metric2.alert_mail_id.NEXTVAL, 'info@metric2.com','" + email + "','" + msg + "','" + msg + "')";
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
            var msg = "Alert Condition: " + rs.getString(6) + " " + value + " " + strOperator + " " + intCheckValue;
			
			//Check if alerts exist and if there are notifications to push
			response = "<script type='text/javascript' id='alertcode" + dashboardwidgetid + "' name='script'>";
			response += "addNotification('" + msg + "', 2);";
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
					
					if (rs.getString(4) !== ''){
                        sendAlertEmail(rs.getString(4), msg);
					}
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