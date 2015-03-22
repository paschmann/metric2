// --------------------------------------- Dialogs ----------------------------------------------------- //


function showProfileDialog(){
    if (userid){
		return sqlLib.executeRecordSetObj("SELECT * FROM metric2.m2_users WHERE user_id =" + userid);
	}
	return '';
}

function editSettings() {
    try {
        return sqlLib.executeInputQuery("Update metric2.m2_users SET email_domain = '" + $.request.parameters.get('domain') + "' WHERE user_id =" + userid);
    } catch (err) {
        return err.message;
    }
    
}
 

function showSettingsDialog(){
    var data = {};
    if (userid){
		//This is an edit
		data.userInfo = sqlLib.executeRecordSetObj("SELECT email_domain, user_id FROM metric2.m2_users WHERE user_id =" + userid);
		data.diskSize = sqlLib.executeRecordSetObj("select ROUND(d.total_size/1024/1024/1024,0) DISKSIZE FROM m_disks as d where d.usage_type = 'DATA'");
		data.m2Size = sqlLib.executeRecordSetObj("SELECT round(sum(TABLE_SIZE) /1024/1024) M2SIZE FROM M_TABLES WHERE SCHEMA_NAME = 'METRIC2' GROUP BY SCHEMA_NAME");
	}
	return data;
}   


function showAlertDialog(alertid){
    var data = {};
    if (alertid){
	    data.alertDetail = sqlLib.executeRecordSetObj("SELECT * FROM metric2.m2_alert WHERE alert_id =" + alertid + " AND user_id = " + userid);
	} else {
	    data.alertDetail = null;
	}
	data.alertWidgets = sqlLib.executeRecordSetObj("SELECT dashboard_widget_id, metric2.m2_dashboard_widget.title, metric2.m2_dashboard.title as dtitle FROM metric2.m2_dashboard_widget INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id INNER JOIN metric2.m2_widget ON metric2.m2_dashboard_widget.widget_id = metric2.m2_widget.widget_id WHERE metric2.m2_dashboard.user_id = " + userid + " AND metric2.m2_widget.hist_enabled = 1 order by metric2.m2_dashboard.dashboard_id ASC");
	
	return data;
}


function showWidgetForecastDialog(dashboardwidgetid, reclimit, forecasttype){
	sqlLib.executeUpdate("DROP VIEW METRIC2.M2_V_PAL_TS_DATA");
	var dashboardwidgetparamid = sqlLib.executeScalar("SELECT DISTINCT metric2.m2_dwp_history.dashboard_widget_param_id from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
	var msg1 = sqlLib.executeUpdate("CREATE VIEW METRIC2.M2_V_PAL_TS_DATA AS SELECT TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ID, AVG(TO_REAL(a.VALUE)) VALUE FROM METRIC2.M2_DWP_HISTORY a WHERE DASHBOARD_WIDGET_PARAM_ID = " + dashboardwidgetparamid + " GROUP BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')), DASHBOARD_WIDGET_PARAM_ID ORDER BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ASC");
	var msg2 = sqlLib.executeUpdate("DELETE FROM METRIC2.M2_PAL_TS_RESULTS");
	
	if (forecasttype == 'double'){
		var msg3 = sqlLib.executeUpdate("CALL _SYS_AFL.PAL_TS_S (METRIC2.M2_V_PAL_TS_DATA, METRIC2.M2_PAL_TS_PARAMS, METRIC2.M2_PAL_TS_RESULTS) WITH OVERVIEW");
	} else {
		var msg4 = sqlLib.executeUpdate("CALL _SYS_AFL.PAL_TS_S (METRIC2.M2_V_PAL_TS_DATA, METRIC2.M2_PAL_TS_PARAMS, METRIC2.M2_PAL_TS_RESULTS) WITH OVERVIEW");
	}
	var strHTML = sqlLib.executeRecordSetObj("SELECT ID, VALUE FROM METRIC2.M2_V_PAL_RESULTS");
    return strHTML;
}


function showDashboardDialog(){
    var dashboardtitle = '';
	var dashboardsubtitle = '';
	if(service !== 'AddDashboardDialog'){
        return sqlLib.executeRecordSetObj("SELECT title, subtitle, dashboard_id, bg_url FROM metric2.m2_dashboard WHERE dashboard_id =" + dashboardid);
    }
	return '';
}


function showWidgetHistoryDialog(dashboardwidgetid, reclimit, startdt, enddt){

	var strSQL = "SELECT TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'YYYY') as year, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM') as month, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'DD') as day, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'HH24') as hour,TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MI') as min, '00' as secs, TO_DECIMAL(AVG(TO_DECIMAL(metric2.m2_dwp_history.value)),2,2) as value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " AND (TO_DATE(TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM/DD/YYYY'),'MM/DD/YYYY') between TO_DATE('" + startdt + "','MM/DD/YYYY')  AND TO_DATE('" + enddt + "','MM/DD/YYYY')) GROUP BY TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'YYYY'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'DD'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'HH24'), TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MI') ORDER BY day, hour, min";
	var objData = sqlLib.executeRecordSetObj(strSQL);
	if (objData.indexOf("dberror") > -1){
	    //Error converting to decimal, most likely because data is string based
	   var strSQL = "SELECT TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'YYYY') as year, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM') as month, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'DD') as day, TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'HH24') as hour,TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MI') as min, '00' as secs, metric2.m2_dwp_history.value as value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + " AND (TO_DATE(TO_CHAR(UTCTOLOCAL(metric2.m2_dwp_history.dt_added,'" + strTimeZone + "'), 'MM/DD/YYYY'),'MM/DD/YYYY') between TO_DATE('" + startdt + "','MM/DD/YYYY')  AND TO_DATE('" + enddt + "','MM/DD/YYYY')) ORDER BY day, hour, min";
	   var objData = sqlLib.executeRecordSetObj(strSQL);
	}
	return objData;
}


function showAlertHistoryDialog(alertid){
    var arr = [];
    var hour = 0;
    arr.push(alertid);
    while (hour < 24){
		for (var day = 1; day < 8; day++){
			var value = sqlLib.executeScalar("SELECT COUNT(IFNULL(actual, 0)) FROM metric2.m2_alert_history WHERE metric2.m2_alert_history.alert_id = " + alertid + " AND TO_INT(TO_CHAR(ADDED, 'HH24')) in ('" + hour + "','" + (hour + 1) + "') AND TO_CHAR(ADDED, 'D') = '" + day + "'");
			arr.push(value);
		}
		hour += 2;
	}
    return arr;
}


function showWidgetDialog(){
    var widget = {};
    
    widget.widgettitle = '';
    widget.widgetwidth = '1';
    widget.widgetheight = '1';
	widget.widgetrefresh = '';
	widget.widgettype = 'WebService';
	widget.widgetid = widgetid;
	
	if(widgetid === undefined){
        //This is an edit
        widgetid = widgetLib.getWidgetIDFromDashboardWidgetID();
        widget.widgetid = widgetid;
        widget.dashboardwidgetid = dashboardwidgetid;
        var rsdetails = sqlLib.executeReader("SELECT * FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
        while (rsdetails.next()){
            widget.widgetwidth = rsdetails.getString(5);
            widget.widgetheight = rsdetails.getString(6);
            widget.widgettitle = rsdetails.getString(4);
			widget.widgetrefresh = rsdetails.getString(9);
        }
		rsdetails.close();
    }
    
    widget.defaultwidgetwidth = sqlLib.executeScalar("Select def_width from metric2.m2_widget where widget_id = " + widgetid);
    widget.defaultwidgetheight = sqlLib.executeScalar("Select def_height from metric2.m2_widget where widget_id = " + widgetid);
    
    widget.widgetwidth = widget.defaultwidgetwidth !== '' ? widget.defaultwidgetwidth : widget.widgetwidth;
    widget.widgetheight = widget.defaultwidgetheight !== '' ? widget.defaultwidgetheight : widget.widgetheight;
    
    widget.widgetname = widgetLib.getWidgetNameFromWidgetID(widgetid);
    
    var params = [];
    var rs = sqlLib.executeReader("SELECT param_id, name, type, value_default, index_no, required, placeholder, display_name, visible, option_group FROM metric2.m2_widget_param WHERE widget_id =" + widgetid + " ORDER BY index_no");
    while (rs.next()) {
        var widgetparam = {};
        var value = 'unknown';
        value = dashboardwidgetid === undefined ? rs.getString(4) : widgetLib.getWidgetParamValueEscaped(rs.getString(1), dashboardwidgetid);
		var required = '';
		
		value = replaceAll("MET2", "&#039;", value);
		value = replaceAll("MET3", "&#037;", value);
        
        widgetparam.setvalue = value;
        widgetparam.paramid = rs.getString(1);
        widgetparam.name = rs.getString(2);
        widgetparam.type = rs.getString(3);
        widgetparam.valdefault = rs.getString(4);
        widgetparam.index = rs.getString(5);
        widgetparam.required = rs.getString(6);
        widgetparam.placeholder = rs.getString(7);
        widgetparam.displayname = rs.getString(8);
        widgetparam.visible = rs.getString(9);
        widgetparam.optgroup = rs.getString(10);
        
        if (rs.getString(3) == 'OPTION'){
            widgetparam.options = showParamOption(rs.getString(10), value)
        }
        
		params.push(widgetparam);
    }
	rs.close();
	widget.param = params;
	widget.type = widgetLib.getWidgetTypeFromWidgetID(widgetid);
	
	if (widget.type == 'WebService'){
		widget.dashboardwidgetparamid = widgetLib.getDashboardWidgetParamIDFromParamName('VALUE',dashboardwidgetid);
	}
    
    return widget;
}



function showParamOption(optiongroup, value){
	var strHTML = '';
	var options = [];
	var rs = sqlLib.executeReader("SELECT option_group, value, display_value FROM metric2.m2_widget_param_options WHERE option_group =" + optiongroup + " ORDER BY display_value");
	while (rs.next()) {
		var selected = rs.getString(2) == value ? ' selected ' : '';
		var objObj = {};
		objObj.value = rs.getString(2);
		objObj.display = rs.getString(3);
        strHTML += "<option value = '" + rs.getString(2) + "'" + selected + ">" + rs.getString(3) + "</option>";
        options.push(objObj);
	}
	rs.close();
	return options;
}


// --------------------------------------- End Dialogs ----------------------------------------------------- //