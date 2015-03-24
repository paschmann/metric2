// --------------------------------------- Widgets ----------------------------------------------------- //

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
	return sqlLib.executeScalar("SELECT code_type FROM metric2.m2_widget INNER JOIN metric2.m2_dashboard_widget ON metric2.m2_widget.widget_id = metric2.m2_dashboard_widget.widget_id WHERE metric2.m2_dashboard_widget.dashboard_widget_id =" + dashboardwidgetid);
}

function getWidgetCode(dashboardwidgetid){
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



function getListOfWidgets(dashboardid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD_WIDGET WHERE dashboard_id = " + dashboardid);
}


function getWidgetTypes(widgetGroup){
    try{
    var SQL = "";
        if (widgetGroup === "0"){
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget ORDER BY widget_id";
        } else {
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget WHERE widget_group = " + widgetGroup + " ORDER BY widget_id";
        }
        return sqlLib.executeRecordSetObj(SQL);
    } catch (err) {
        return "Error getting widget types (getWidgetTypes:getDataSet.xsjs)";
    }
}

function showWidgets(){
    
    try{
        // Loop through all our widgets for this dashboard
        var rs = sqlLib.executeReader("SELECT dashboard_widget_id from metric2.m2_dashboard_widget dw where dashboard_id = " + dashboardid);
        var intWidgetCounter = 0;
        
        while (rs.next()){
            var intDashboardWidgetID = rs.getString(1);
            intWidgetCounter++;
            widgetContents.push(showWidgetDiv(intDashboardWidgetID));
        }
        Dataset.widgetCount = intWidgetCounter;
        rs.close();
        
    } catch (err) {
        Dataset.error = err;
    }
}


function showWidgetDiv(intDashboardWidgetID){
    try {
        var data = {};
        var code = getWidgetCode(intDashboardWidgetID);
        var rs = sqlLib.executeReader("SELECT WP.name, WP.param_id, WP.hist_enabled, WP.type, WP.HIST_DATAPOINT, DW.title, DW.width, DW.height, DW.col_pos, DW.row_pos, W.hist_enabled, W.type FROM metric2.m2_widget_param as WP INNER JOIN metric2.m2_dashboard_widget_params as DWP ON WP.param_id = DWP.param_id INNER JOIN metric2.m2_dashboard_widget DW ON DWP.dashboard_widget_id = DW.dashboard_widget_id INNER JOIN metric2.m2_widget W ON W.widget_id = DW.widget_id WHERE DWP.dashboard_widget_id =" + intDashboardWidgetID);
        data.dwid = intDashboardWidgetID;
        data.code = code;
        data.refresh = parseInt(getWidgetRefreshRate(intDashboardWidgetID));
        
        while (rs.next()){
            data.paramid = rs.getString(2);
            var paramname = rs.getString(1);
            data.title = rs.getString(6);
            data.width = rs.getString(7);
            data.height = rs.getString(8);
            data.colpos = rs.getString(9);
            data.rowpos = rs.getString(10);
            data.type = rs.getString(12);
            data.histEnabled =  rs.getString(11);
            var datapoint = "";
            if (rs.getString(1).indexOf("SQL") >= 0){
                if (rs.getString(4).indexOf("RANGE") >= 0){
                    var reclimit = getWidgetParamValueFromParamName("RECLIMIT", intDashboardWidgetID);
                    data[paramname + "_Hist"] = getWidgetParamRangePastValueFromParamName("SQL1", intDashboardWidgetID, reclimit);
                }
                datapoint = sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName(paramname, intDashboardWidgetID));
            } else {
                if (rs.getString(4).indexOf("HIST") >= 0){
                    datapoint = getWidgetParamSinglePastValueFromParamName(paramname, intDashboardWidgetID);
                } else {
                    datapoint = getWidgetParamValueFromParamNameObj(paramname, intDashboardWidgetID);
                }
            }
            data[paramname] = datapoint;
            if (rs.getString(3) == "1"){
                if (rs.getString(5) !== null){
                    var val = JSON.parse(datapoint);
                    insertWidgetHistory(intDashboardWidgetID, paramname, val[0][rs.getString(5)]);
                    data.Alert = alertLib.checkWidgetAlert(intDashboardWidgetID, val[0][rs.getString(5)]);
                } else {
                    insertWidgetHistory(intDashboardWidgetID, paramname, datapoint);
                }
            }
        }
        rs.close();
        } catch (err) {
            data.error = err.description;
        }
        return data;
}

function updateWidgetPositions(objGridPos){
    for (var i = 0, len = objGridPos.length; i < len; ++i) {
        var intDashboardWidgetID = objGridPos[i].id.substring(5);
        sqlLib.executeUpdate("UPDATE metric2.m2_dashboard_widget SET row_pos =" + objGridPos[i].row + ", col_pos =" + objGridPos[i].col + " WHERE dashboard_widget_id =" + intDashboardWidgetID);
    }
    return "Metric positions Updated";
}



function upsertMetricParams(){
    for (var i = 0; i <= 400; i++) {
        try {
            var value= $.request.parameters.get("pid" + i);
            if (value !== "NaN" && value !== "Undefined" && value !== "" && value !== "undefined" && typeof value != "undefined"){
                if (service === "EditMetric"){
                    sqlLib.executeUpdate("UPDATE metric2.m2_dashboard_widget_params SET value = '" + value + "' WHERE dashboard_widget_id =" + dashboardwidgetid + " AND param_id =" + i );
                } else {
                    sqlLib.executeUpdate("Insert into metric2.m2_dashboard_widget_params (dashboard_widget_param_id, dashboard_widget_id, param_id, value, widget_id, dt_added) VALUES (metric2.dashboard_widget_param_id.NEXTVAL, (SELECT TOP 1 dashboard_widget_id FROM metric2.m2_dashboard_widget ORDER BY dashboard_widget_id desc)," + i + ", '" + value + "'," + widgetid + ", current_utcdate)");
                }
            }
        } catch (err) {
            
        }
    }
}

function createMetric() {
    try {
        sqlLib.executeInputQuery("Insert into metric2.m2_dashboard_widget (dashboard_widget_id, dashboard_id, widget_id, title, width, height, row_pos, col_pos, refresh_rate) VALUES (metric2.dashboard_widget_id.NEXTVAL, " + dashboardid + ", " + widgetid + ",'" + $.request.parameters.get('widgettitle') + "'," + $.request.parameters.get('widgetwidth') + "," + $.request.parameters.get('widgetheight') + ",1,1," + $.request.parameters.get('refreshrate') + ")");
        widgetLib.upsertMetricParams();
    } catch (err) {
        return err.message;
    }
    return "Metric Created";
}

function editMetric() {
    try {
        sqlLib.executeInputQuery("UPDATE metric2.m2_dashboard_widget SET width =" + $.request.parameters.get('widgetwidth') + ", height =" + $.request.parameters.get('widgetheight') + ", refresh_rate = " + $.request.parameters.get('refreshrate') + ", title = '" + $.request.parameters.get('widgettitle') + "' WHERE dashboard_widget_id =" + dashboardwidgetid);
        widgetLib.upsertMetricParams();
    } catch (err) {
        return err.message;
    }
    return "Metric Edited";
}

function cloneMetric(){
    //Pass in the dashboard widget id to clone and the dashboard to clone to (not function yet = 0)
    try {
        sqlLib.executeUpdate("CALL METRIC2.M2_P_CLONEMETRIC(" + dashboardwidgetid + ", " + dashboardid + ")");
	} catch (err) {
		return err.message;
	}
    return "Metric Cloned";
}

function deleteMetric(){
    try {
        sqlLib.executeStoredProc("CALL METRIC2.M2_P_DELETE_WIDGET(" + dashboardwidgetid + ")");
	} catch (err) {
		return err.message;
	}
    return "Metric Deleted";
}

function deleteMetricHistory() {
    try {
        sqlLib.executeStoredProc("CALL METRIC2.M2_P_DELETE_WIDGET_HISTORY(" + dashboardwidgetid + ")");
	} catch (err) {
		return err.message;
	}
    return "Metric History Deleted";
}


function insertWidgetHistory(dashboardwidgetid, paramname, value, dashboardwidgetparamid){
	try {
		if (!dashboardwidgetparamid){
				dashboardwidgetparamid = sqlLib.executeScalar("SELECT DASHBOARD_WIDGET_PARAM_ID FROM metric2.M2_dashboard_widget_params INNER JOIN metric2.M2_WIDGET_PARAM ON metric2.M2_WIDGET_PARAM.param_id = metric2.m2_dashboard_widget_params.param_id WHERE metric2.m2_widget_param.name = '" + paramname + "' AND metric2.M2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		}
		if (value !== "NaN" && value !== "Undefined" && value !== "" && value !== "undefined" && typeof value !== "undefined"){
            sqlLib.executeUpdate("INSERT INTO metric2.M2_DWP_HISTORY (dwp_hist_id, dashboard_widget_param_id, value) VALUES (metric2.dwp_history_id.NEXTVAL, " + dashboardwidgetparamid + ", '" + value + "')");
            return "Accepted";
		} else {
            return "Not accepted due to missing value";
		}
	} catch (err) {
		return err.message;
	}
}

// --------------------------------------- End Widgets ----------------------------------------------------- //