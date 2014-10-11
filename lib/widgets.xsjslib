// --------------------------------------- Widgets ----------------------------------------------------- //


function getListOfWidgets(dashboardid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD_WIDGET WHERE dashboard_id = " + dashboardid);
}


function getWidgetTypes(widgetGroup){
    try{
    var SQL = "";
        if (widgetGroup == '0'){
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget ORDER BY widget_id";
        } else {
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget WHERE widget_group = " + widgetGroup + " ORDER BY widget_id";
        }
        return sqlLib.executeRecordSetObj(SQL);
    } catch (err) {
        return 'Error getting widget types (getWidgetTypes:getDataSet.xsjs)';
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
        var rs = sqlLib.executeReader("SELECT WP.name, WP.param_id, WP.hist_enabled, WP.type, WP.HIST_DATAPOINT, DW.title, DW.width, DW.height, DW.col_pos, DW.row_pos, W.hist_enabled FROM metric2.m2_widget_param as WP INNER JOIN metric2.m2_dashboard_widget_params as DWP ON WP.param_id = DWP.param_id INNER JOIN metric2.m2_dashboard_widget DW ON DWP.dashboard_widget_id = DW.dashboard_widget_id INNER JOIN metric2.m2_widget W ON W.widget_id = DW.widget_id WHERE DWP.dashboard_widget_id =" + intDashboardWidgetID);
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
            data.histEnabled =  rs.getString(11);
            var datapoint = '';
            if (rs.getString(1).indexOf('SQL') >= 0){
                if (rs.getString(4).indexOf('RANGE') >= 0){
                    var reclimit = getWidgetParamValueFromParamName('RECLIMIT', intDashboardWidgetID);
                    data[paramname + '_Hist'] = getWidgetParamRangePastValueFromParamName('SQL1', intDashboardWidgetID, reclimit);
                }
                datapoint = sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName(paramname, intDashboardWidgetID));
            } else {
                if (rs.getString(4).indexOf('HIST') >= 0){
                    datapoint = getWidgetParamSinglePastValueFromParamName(paramname, intDashboardWidgetID);
                } else {
                    datapoint = getWidgetParamValueFromParamNameObj(paramname, intDashboardWidgetID);
                }
            }
            data[paramname] = datapoint;
            if (rs.getString(3) == '1'){
                if (rs.getString(5) !== null){
                    var val = JSON.parse(datapoint);
                    insertWidgetHistory(intDashboardWidgetID, paramname, val[0][rs.getString(5)]);
                    data['Alert'] = alertLib.checkWidgetAlert(intDashboardWidgetID, val[0][rs.getString(5)]);
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
} 

function cloneMetric(){
    //Pass in the dashboard widget id to clone and the dashboard to clone to (not function yet = 0)
    var strSQL = "CALL METRIC2.M2_P_CLONEMETRIC(" + dashboardwidgetid + ", 0)";
    var msg = sqlLib.executeUpdate(strSQL);
    return msg;
}

function deleteWidget(){
    executeQuery("DELETE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
    executeQuery("DELETE FROM metric2.m2_dwp_history where metric2.m2_dwp_history.dashboard_widget_param_id IN (SELECT dashboard_widget_param_id FROM metric2.m2_dashboard_widget_params WHERE metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + ")");
    executeQuery("DELETE FROM metric2.m2_dashboard_widget_params WHERE dashboard_widget_id =" + dashboardwidgetid);
	executeUpdate("DELETE FROM metric2.m2_alert WHERE dashboard_widget_id =" + dashboardwidgetid);
    strContent += 'Deleted';
}

function updateWigetValue(){
    widgetLib.insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint, dashboardwidgetparamid);
}


function insertWidgetHistory(dashboardwidgetid, paramname, value, dashboardwidgetparamid){
	try {
		if (!dashboardwidgetparamid){
				dashboardwidgetparamid = sqlLib.executeScalar("SELECT DASHBOARD_WIDGET_PARAM_ID FROM metric2.M2_dashboard_widget_params INNER JOIN metric2.M2_WIDGET_PARAM ON metric2.M2_WIDGET_PARAM.param_id = metric2.m2_dashboard_widget_params.param_id WHERE metric2.m2_widget_param.name = '" + paramname + "' AND metric2.M2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		}
		if (value !== 'NaN' && value !== 'Undefined' && value !== '' && value !== 'undefined' && typeof value != 'undefined'){
            sqlLib.executeQuery("INSERT INTO metric2.M2_DWP_HISTORY (dwp_hist_id, dashboard_widget_param_id, value) VALUES (metric2.dwp_history_id.NEXTVAL, " + dashboardwidgetparamid + ", '" + value + "')");
            return 'Inserted';
		} else {
            return 'Not inserted due to missing value';
		}
	} catch (err) {
		return err.message;
	}
}

// --------------------------------------- End Widgets ----------------------------------------------------- //