var service = $.request.parameters.get('service');
var output;
var Dataset = new Object({});

// Handle Service Requests
switch (service) {
	case 'DBInfo':
        Dataset.dbinfo = executeRecordSetObj1("SELECT * FROM SYS.M_SYSTEM_OVERVIEW");
        Dataset.alerts = executeRecordSetObj1("SELECT ALERT_DETAILS, ALERT_RATING, UTCTOLOCAL(ALERT_TIMESTAMP, 'EST') as ALERT_DT, HOST, ALERT_ID, ALERT_NAME, ALERT_DESCRIPTION, ALERT_USERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5)")
        Dataset.connections = executeRecordSetObj1("SELECT COUNT(CONNECTION_ID) as STATUS FROM SYS.M_CONNECTIONS GROUP BY connection_status ORDER BY connection_status");
        Dataset.invalidcons = executeRecordSetObj1("SELECT COUNT(USER_NAME) AS CNT FROM INVALID_CONNECT_ATTEMPTS WHERE SUCCESSFUL_CONNECT_TIME > ADD_SECONDS (CURRENT_UTCTIMESTAMP, -43200)");
        output = JSON.stringify(Dataset);
		break;
}

$.response.contentType = "application/json";
$.response.setBody(output);


function executeRecordSetObj1(strSQL){
	try {
		var conn = $.db.getConnection("lilabs.metric2.lib::metricuser");
		var pstmt = conn.prepareStatement(strSQL);
		var rs = pstmt.executeQuery();
		var rsm = rs.getMetaData();
		var strObj = '';
		
		while (rs.next()) {
    			strObj += '{';
    			for (var i = 1; i <= rsm.getColumnCount(); i++){
    				strObj += '"' + rsm.getColumnLabel(i) + '":"' + rs.getString(i) + '",';
    			}
    			strObj = strObj.substring(0, strObj.length - 1);
    			strObj += '},'
    		}
		rs.close();
		pstmt.close();
		conn.close();
		
		return '[' + strObj.substring(0, strObj.length - 1) + ']';
	} catch (err) {
		return err.message;
	}
}