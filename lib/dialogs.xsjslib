

// --------------------------------------- Dialogs ----------------------------------------------------- //



function showAlertDialog(alertid){
    
	var dashboardwidgetid = '';
	var operator = '=';
	var notify = '';
	var value = '';
	var cond = '';

	if (alertid){
		//This is an edit
		var rs = sqlLib.executeReader("SELECT * FROM metric2.m2_alert WHERE alert_id =" + alertid + " AND user_id = " + userid);
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
	sqlLib.executeUpdate("DROP VIEW METRIC2.M2_V_PAL_TS_DATA");
	var dashboardwidgetparamid = sqlLib.executeScalar("SELECT DISTINCT metric2.m2_dwp_history.dashboard_widget_param_id from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
	sqlLib.executeUpdate("CREATE VIEW METRIC2.M2_V_PAL_TS_DATA AS SELECT TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ID, AVG(TO_REAL(a.VALUE)) VALUE FROM METRIC2.M2_DWP_HISTORY a WHERE DASHBOARD_WIDGET_PARAM_ID = " + dashboardwidgetparamid + " GROUP BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')), DASHBOARD_WIDGET_PARAM_ID ORDER BY TO_INT(TO_CHAR(UTCTOLOCAL(DT_ADDED, '" + strTimeZone + "'), 'HH24')) ASC");
	sqlLib.executeUpdate("Delete * from METRIC2.M2_PAL_TS_RESULTS");
	
	if (forecasttype == 'double'){
		sqlLib.executeUpdate("CALL _SYS_AFL.PAL_TS_S (M2_V_PAL_TS_DATA, M2_PAL_TS_PARAMS, M2_PAL_TS_RESULTS) WITH OVERVIEW");
	} else {
		sqlLib.executeUpdate("CALL _SYS_AFL.PAL_TS_S (M2_V_PAL_TS_DATA, M2_PAL_TS_PARAMS, M2_PAL_TS_RESULTS) WITH OVERVIEW");
	}
	var strHTML = sqlLib.executeRecordSetObj("SELECT * FROM METRIC2.M2_V_PAL_RESULTS");
    return strHTML;
}


function showDashboardDialog(){
    var dashboardtitle = '';
	var dashboardsubtitle = '';
	if(service !== 'AddDashboardDialog'){
        //This is an edit
        var rs = sqlLib.executeReader("SELECT title, subtitle FROM metric2.m2_dashboard WHERE dashboard_id =" + dashboardid);
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
	var strHTML = sqlLib.executeRecordSetObj(strSQL);
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
						var value = sqlLib.executeScalar("SELECT COUNT(IFNULL(actual, 0)) FROM metric2.m2_alert_history WHERE metric2.m2_alert_history.alert_id = " + alertid + " AND TO_INT(TO_CHAR(ADDED, 'HH24')) in ('" + hour + "','" + (hour + 1) + "') AND TO_CHAR(ADDED, 'D') = '" + day + "'");
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
        var rsdetails = sqlLib.executeReader("SELECT * FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
        while (rsdetails.next()){
            widgetwidth = rsdetails.getString(5);
            widgetheight = rsdetails.getString(6);
            widgettitle = rsdetails.getString(4);
			widgetrefresh = rsdetails.getString(9);
        }
		rsdetails.close();
    }
    
    var defaultwidgetwidth = sqlLib.executeScalar("Select def_width from metric2.m2_widget where widget_id = " + widgetid);
    var defaultwidgetheight = sqlLib.executeScalar("Select def_height from metric2.m2_widget where widget_id = " + widgetid);
    
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
	
	var rs = sqlLib.executeReader("SELECT param_id, name, type, value_default, index_no, required, placeholder, display_name, visible, option_group FROM metric2.m2_widget_param WHERE widget_id =" + widgetid + " ORDER BY index_no");
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
    var rs = sqlLib.executeReader("SELECT dashboard_widget_id, metric2.m2_dashboard_widget.title, metric2.m2_dashboard.title FROM metric2.m2_dashboard_widget INNER JOIN metric2.m2_dashboard ON metric2.m2_dashboard_widget.dashboard_id = metric2.m2_dashboard.dashboard_id WHERE metric2.m2_dashboard.user_id = " + userid + " order by metric2.m2_dashboard.dashboard_id ASC");
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
	var rs = sqlLib.executeReader("SELECT option_group, value, display_value FROM metric2.m2_widget_param_options WHERE option_group =" + optiongroup + " ORDER BY display_value");
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