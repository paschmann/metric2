// --------------------------------------- Dashboards ----------------------------------------------------- //


function getListOfDashboards () {
    if (viewmode === "true") { //View only mode
	   return sqlLib.executeRecordSetObj("select * from metric2.m2_dashboard WHERE SHARE_URL = '" + dashboardid + "'");
	} else {
	   return sqlLib.executeRecordSetObj("select * from metric2.m2_dashboard WHERE user_id = " + userid + " order by vieworder, dashboard_id");
	}
}


function createDashboard(){
    //Create a new dashboard and return the value
	try {
    	sqlLib.executeInputQuery("Insert into metric2.m2_dashboard (dashboard_id, title, subtitle, bg_url, user_id) VALUES (metric2.dashboard_id.NEXTVAL, '" + $.request.parameters.get('dashboardtitle') + "', '','" + $.request.parameters.get('dashboardbgurl') + "', " + userid + ")");
    	return sqlLib.executeScalar("Select MAX(dashboard_id) from metric2.m2_dashboard WHERE user_id = " + userid)
	} catch (err) {
		return err.message;
	}
}

function updateDashboard(){
    try {
        sqlLib.executeUpdate("Update metric2.m2_dashboard SET title = '" + $.request.parameters.get('dashboardtitle') + "', subtitle = '', bg_url = '" + $.request.parameters.get('dashboardbgurl') + "' WHERE dashboard_id =" + dashboardid);
        return 'Dashboard Updated';
	} catch (err) {
		return err.message;
	}
}

function deleteDashboard(){
    try {
        sqlLib.executeStoredProc("CALL METRIC2.M2_P_DELETE_DASHBOARD(" + dashboardid + ")");
        return 'Dashboard Deleted';
	} catch (err) {
		return err.message;
	}
}

function cloneDashboard(){
    try {
        sqlLib.executeUpdate("CALL METRIC2.M2_P_CLONEDASHBOARD(" + dashboardid + "," + userid + ")");
	} catch (err) {
		return err.message;
	}
    return "Dashboard Cloned";
}

function setShareURL(strURL){
    try {
        sqlLib.executeUpdate("UPDATE metric2.m2_dashboard SET share_url = '" + strURL + "' WHERE dashboard_id = " + dashboardid);
        return strURL;
	} catch (err) {
		return err.message;
	}
}

function getShareURL(strURL){
    try {
        return sqlLib.executeScalar("SELECT share_url FROM metric2.m2_dashboard WHERE dashboard_id = " + dashboardid);
	} catch (err) {
		return err.message;
	}
}

function saveDashboardPositions(userid){
    try {
        var arrDashboards = JSON.parse(dashboardpos);
        for (var i = 0, len = arrDashboards.length; i < len; ++i) {
            if (arrDashboards[i].length > 0){
                var intDashboardID = arrDashboards[i].substring(9);
                sqlLib.executeUpdate("UPDATE metric2.m2_dashboard SET vieworder = " + i + " WHERE dashboard_id = " + intDashboardID + " AND user_id = " + userid);
            }
        }
        return 'Dashboard Positions Saved';
    } catch (err) {
		return err.message;
	}
}



// --------------------------------------- End Dashboards ----------------------------------------------------- //