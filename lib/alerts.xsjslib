// --------------------------------------- Alerts ----------------------------------------------------- //

function createAlert() {
    try {
        sqlLib.executeInputQuery("Insert into metric2.m2_alert (alert_id, dashboard_widget_id, cond, operator, value, notify, created_on, user_id) VALUES (metric2.alert_id.NEXTVAL, " + widgetid + ", '" + $.request.parameters.get('value') + "', '" + $.request.parameters.get('operator') + "','" + $.request.parameters.get('value') + "', '" + $.request.parameters.get('notify') + "', current_timestamp, " + userid + ")");
        return 1;
    } catch (err) {
        return err.message;
    }
}

function editAlert () {
    try {
        sqlLib.executeInputQuery("Update metric2.m2_alert SET cond = '" + $.request.parameters.get('condition') + "', operator = '" + $.request.parameters.get('operator') + "', value = '" + $.request.parameters.get('value') + "', notify = '" + $.request.parameters.get('notify') + "' WHERE alert_id = " + alertid);
        return 1;
    } catch (err) {
        return err.message;
    }
}

function createAlertHist(alertid, dashboardwidgetid) {
    //This creates some random alert history entries for demo purposes
    var hour = 0;
    var maxentries = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

    for (var day = 0; day < 7; day++) {
        for (var i = 0; i <= maxentries; i++) {
            var num = Math.floor(Math.random() * 98) + 80;
            var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual,added) VALUES (metric2.alert_history_id.NEXTVAL, " + alertid + ", " + dashboardwidgetid + ", 'value', '>', 80, 'dba@metric2.com'," + num + ", ADD_DAYS(ADD_SECONDS(CURRENT_TIMESTAMP, 0)),-" + day + ")";
            sqlLib.executeQuery(SQL);
        }
    }

    for (var day = 1; day <= 400; day++) {
        var num = Math.floor(Math.random() * 98) + 80;
        var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual,added) VALUES (metric2.alert_history_id.NEXTVAL, " + alertid + ", " + dashboardwidgetid + ", 'value', '>', 80, 'dba@metric2.com'," + num + ", ADD_SECONDS(CURRENT_TIMESTAMP, 0))";
        sqlLib.executeQuery(SQL);
    }
}


function showAlerts() {
    var data = {};
    data.userAlerts = sqlLib.executeRecordSetObj("SELECT metric2.m2_dashboard_widget.title, metric2.m2_alert.cond, metric2.m2_alert.operator, metric2.m2_alert.value, metric2.m2_alert.notify, metric2.m2_dashboard.title as dashboardtitle, metric2.m2_alert.alert_id as ALERTID, status, COUNT(metric2.m2_alert_history.alert_id) as ALERTCOUNT, MAX(metric2.m2_alert_history.ADDED) as LASTTRIGGERED FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id LEFT OUTER JOIN metric2.m2_alert_history ON metric2.m2_alert_history.alert_id = metric2.m2_alert.alert_id WHERE metric2.m2_dashboard.user_id = " + userid + " GROUP BY metric2.m2_dashboard_widget.title, metric2.m2_alert.cond, metric2.m2_alert.operator, metric2.m2_alert.value, metric2.m2_alert.notify, metric2.m2_dashboard.title, metric2.m2_alert.alert_id, status ORDER BY MAX(metric2.m2_alert_history.ADDED) DESC"); 
    data.sysAlerts = sqlLib.executeRecordSetObj("SELECT *, UTCTOLOCAL(ALERT_TIMESTAMP, '" + strTimeZone + "') as TIME FROM METRIC2.M2_WIDGET_SYSALERTS");
    data.userAlertsStats = sqlLib.executeRecordSetObj("SELECT COUNT(metric2.m2_alert_history.alert_id) as ALERTCOUNT, TO_CHAR(metric2.m2_alert_history.ADDED, 'MM') as Month, TO_CHAR(metric2.m2_alert_history.ADDED, 'YYYY') as Year FROM metric2.m2_alert INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id LEFT OUTER JOIN metric2.m2_alert_history ON metric2.m2_alert_history.alert_id = metric2.m2_alert.alert_id WHERE metric2.m2_dashboard.user_id = " + userid + " GROUP BY TO_CHAR(metric2.m2_alert_history.ADDED, 'MM'), TO_CHAR(metric2.m2_alert_history.ADDED, 'YYYY') ORDER BY TO_CHAR(metric2.m2_alert_history.ADDED, 'YYYY'), TO_CHAR(metric2.m2_alert_history.ADDED, 'MM')"); 
    return data;
}

function deleteAlert(alertid) {
    var SQL = "DELETE FROM metric2.m2_alert WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}


function clearAlert(alertid) {
    var SQL = "DELETE FROM metric2.m2_alert_history WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}

function setAlert(alertid, intStatus) {

    var SQL = "UPDATE metric2.m2_alert SET status = " + intStatus + " WHERE alert_id = " + alertid;
    sqlLib.executeUpdate(SQL);
}

function sendAlertEmail(email, msg) {
    if (intHanaVersion === 9){
        try {
            var mail = new $.net.Mail({sender: {address:"info@metric2.com"},
                to: [{ address: email}],
                subject: "Metric2 Alert",
                parts: [new $.net.Mail.Part ({type: $.net.Mail.Part.TYPE_TEXT, text: msg, contentType: "text/plain" })]
            });
            var returnValue = mail.send();
            return "MessageId= " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
        } catch (err) {
            return JSON.stringify("Error sending email alert: " + err);
        }
    } else {
        var SQL = "INSERT INTO metric2.m2_outgoing_email (id, emailfrom, emailto, subject, contents) VALUES (metric2.alert_mail_id.NEXTVAL, 'info@metric2.com','" + email + "','" + msg + "','" + msg + "')";
        sqlLib.executeUpdate(SQL);
    }
}

function checkWidgetAlert(dashboardwidgetid, value) {
    //check if widget has an alert - if yes, check against the specified value and send an alert if needed
    try {
        var source = "Web"; //Default
        if (dashboardwidgetid === ""){
            var rs = sqlLib.executeReader("SELECT alert_id, operator, value, notify, cond, title, m2_dashboard_widget.dashboard_widget_id FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id WHERE status = 1");
            source = "XSJob";
        } else {
            var rs = sqlLib.executeReader("SELECT alert_id, operator, value, notify, cond, title FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id WHERE status = 1 AND metric2.m2_alert.dashboard_widget_id = " + dashboardwidgetid);
        }
        var strContent = '';

        while (rs.next()) {
            var intAlertID = rs.getString(1);
            var strOperator = rs.getString(2);
            var intCheckValue = rs.getInteger(3);
            var strNotify = rs.getString(4);
            var strCondition = rs.getString(5);
            var strTitle = rs.getString(6);
            
            var msg = "Alert Condition: " + strTitle + " " + value + " " + strOperator + " " + intCheckValue;
            
            if (dashboardwidgetid === ""){
                dashboardwidgetid = rs.getString(7);
                value = sqlLib.executeScalar(widgetLib.getWidgetParamValueFromParamName('SQL1', rs.getString(7)));
            }

            if (checkValueInsert(strOperator, intCheckValue, value) === 1) {
                var SQL = "INSERT INTO metric2.M2_ALERT_HISTORY (alert_hist_id, alert_id, dashboard_widget_id, cond, operator, value, notify, actual, added_by) VALUES (metric2.alert_history_id.NEXTVAL, " + intAlertID + ", " + dashboardwidgetid + ", '" + strCondition + "', '" + strOperator + "', " + intCheckValue + ", '" + strNotify + "', " + value + ", '" + source + "')";
                sqlLib.executeUpdate(SQL);
                
                strContent += msg;
                if (strNotify !== '') {
                    sendAlertEmail(rs.getString(4), msg);
                }
            }
        }
        rs.close();
        return strContent;
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

function checkValueInsert(strOperator, intCheckValue, value) {
    var doInsert = 0;
    if (strOperator === '=') {
        if (value === intCheckValue) {
            doInsert = 1;
        }
    } else if (strOperator === '>') {
        if (value > intCheckValue) {
            doInsert = 1;
        }
    } else if (strOperator === '<') {
        if (value < intCheckValue) {
            doInsert = 1;
        }
    } else if (strOperator === '<=') {
        if (value <= intCheckValue) {
            doInsert = 1;
        }
    } else if (strOperator === '>=') {
        if (value >= intCheckValue) {
            doInsert = 1;
        }
    }
    return doInsert;
}



// --------------------------------------- End Alerts ----------------------------------------------------- //