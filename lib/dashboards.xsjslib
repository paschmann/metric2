// --------------------------------------- Dashboards ----------------------------------------------------- //


function getListOfDashboards(userid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD WHERE user_id = " + userid);
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


// --------------------------------------- End Dashboards ----------------------------------------------------- //
