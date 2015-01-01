// --------------------------------------- Dashboards ----------------------------------------------------- //


function getListOfDashboards(userid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD WHERE user_id = " + userid + " order by vieworder");
}

function createDashboard(sql){
    //Create a new dashboard and return the value
	try {
    	sqlLib.executeInputQuery(sql);
    	sqlLib.executeInputQuery("UPDATE metric2.m2_dashboard SET user_id = " + userid + " WHERE user_id = 999");
		return sqlLib.executeScalar("Select MAX(dashboard_id) from metric2.m2_dashboard WHERE user_id = " + userid)
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
        return 'Positions Saved: ' + dashboardpos;
    } catch (err) {
		return err.message;
	}
}



// --------------------------------------- End Dashboards ----------------------------------------------------- //