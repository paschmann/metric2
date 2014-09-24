// --------------------------------------- Widgets ----------------------------------------------------- //


function showWidgets(){
    
    try{
        // Loop through all our widgets for this dashboard and display them in the grid + gridster Div
        var rs = sqlLib.executeReader("SELECT title, width, dashboard_widget_id, type, height, code_type, col_pos, row_pos, code, hist_enabled from metric2.m2_dashboard_widget dw INNER JOIN metric2.m2_widget w ON w.widget_id = dw.widget_id where dashboard_id = " + dashboardid + " order by dashboard_widget_id");
        var intWidgetCounter = 0;
        
        strContent = "<div class='gridster' id='gridster'><ul id='gridtiles'>";
        
            while (rs.next()){
                var intDashboardWidgetID = rs.getString(3);
                intWidgetCounter++;
                strContent += "<li  id='tile_" + intDashboardWidgetID + "' data-row='" + rs.getString(8) + "' data-col='" + rs.getString(7) + "' data-sizex='" + rs.getString(2) + "' data-sizey='" + rs.getString(5) + "'>";
                    strContent += "<div class='t1-widget-div'><div class='t1-widget-header-div'>";
                        strContent += "<header class='t1-widget-header' id='widget-header" + intDashboardWidgetID + "'>" + rs.getString(1);
                            if (rs.getString(10) == '1'){
                                strContent += "<img class='t1-historyicon-img' id='historyicon" + intDashboardWidgetID + "' src='img/history-icon.png'>";
                            }				
                            strContent += "<img class='t1-editicon-img' id='editicon" + intDashboardWidgetID + "' src='img/settings-icon.png'>";
                        strContent += "</header>";
                    strContent += "</div>";
                    strContent += "<div id='t1-widget-container" + intDashboardWidgetID + "' class='t1-widget-container'>";
                        strContent += showWidgetContents(intDashboardWidgetID, rs.getString(9));
                    strContent += "</div>";
                strContent += "</li>";
            }
            
            if (intWidgetCounter === 0){
                strContent += "<p align='center' style='padding: 10px;'>Your dashboard would look way better with some data,<br /> click on the <i class='fa fa-plus-circle fa-2x' style='padding: 0 10px 10px;'></i> icon to add a few metrics.</li>";
            }
            
            rs.close();
        strContent += "</ul></div>";
    } catch (err) {
        strContent += err;
    }
}


function getListOfWidgets(dashboardid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD_WIDGET WHERE dashboard_id = " + dashboardid);
}

function showWidgetDiv(intDashboardWidgetID){
        var data = {};
        var code = getWidgetCode(intDashboardWidgetID);
        var rs = sqlLib.executeReader("SELECT WP.name, WP.param_id, WP.hist_enabled, WP.type, WP.HIST_DATAPOINT, DW.title, DW.width, DW.height, DW.col_pos, DW.row_pos FROM metric2.m2_widget_param as WP INNER JOIN metric2.m2_dashboard_widget_params as DWP ON WP.widget_id = DWP.widget_id INNER JOIN metric2.m2_dashboard_widget DW ON DWP.dashboard_widget_id = DW.dashboard_widget_id WHERE DWP.dashboard_widget_id =" + intDashboardWidgetID);
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
                } else {
                    insertWidgetHistory(intDashboardWidgetID, paramname, datapoint);
                }
            }
            //Check for alerts and add to object if needed?
        }
        rs.close();
        return data;
}

function showWidgetContents(intDashboardWidgetID, code){
	try{
        var strContent = '';
        var strCodeType = getWidgetCodeType(intDashboardWidgetID);
        // if code is blank, this is a refresh, and needs to get from db
        if (code === ''){
            code = getWidgetCode(intDashboardWidgetID);
        }
        
        if (strCodeType == 'Client'){
            widgetContents.push(showWidgetDiv(intDashboardWidgetID));
        }
	
		var refreshrate = parseInt(getWidgetRefreshRate(intDashboardWidgetID));
		if (refreshrate !== 0 && strCodeType != 'Client'){
			strContent += "<script type='text/javascript' id='timercode" + intDashboardWidgetID + "' name='script'>";
			strContent += "timers.push(setTimeout(function() {getDataSet({strService: 'RefreshWidget', strDashboardWidgetID: '" + intDashboardWidgetID + "'});}, " + refreshrate + "));";
			strContent += "</script>"; 
		}
		return strContent;
	} catch (err) {
        // If any widget throws an error, simply display the loading icon
        strContent += err; // Useful for debugging
        //strContent += "<img style='margin-top: 50px;' src='img/loading.gif' />";
	} finally {
        return null;
	}
}


function updateWidgetPositions(objGridPos){
    for (var i = 0, len = objGridPos.length; i < len; ++i) {
        var intDashboardWidgetID = objGridPos[i].id.substring(5);
        sqlLib.executeUpdate("UPDATE metric2.m2_dashboard_widget SET row_pos =" + objGridPos[i].row + ", col_pos =" + objGridPos[i].col + " WHERE dashboard_widget_id =" + intDashboardWidgetID);
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
        return sqlLib.executeRecordSetObj(SQL);
    } catch (err) {
        return 'Error getting widget types (getWidgetTypes:getDataSet.xsjs)';
    }
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