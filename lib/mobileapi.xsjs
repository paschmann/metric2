var service = $.request.parameters.get('service');
var output;
var Dataset = new Object({});

// Handle Service Requests
switch (service) {
	default:
        Dataset.dbinfo = executeRecordSetObj1("SELECT * FROM SYS.M_SYSTEM_OVERVIEW");
        Dataset.alerts = executeRecordSetObj1("SELECT ALERT_DETAILS, ALERT_RATING, UTCTOLOCAL(ALERT_TIMESTAMP, 'EST') as ALERT_DT, HOST, ALERT_ID, ALERT_NAME, ALERT_DESCRIPTION, ALERT_USERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5)")
        Dataset.connections = executeRecordSetObj1("SELECT COUNT(CONNECTION_ID) as STATUS FROM SYS.M_CONNECTIONS GROUP BY connection_status ORDER BY connection_status");
        Dataset.invalidcons = executeRecordSetObj1("SELECT COUNT(USER_NAME) AS CNT FROM INVALID_CONNECT_ATTEMPTS WHERE SUCCESSFUL_CONNECT_TIME > ADD_SECONDS (CURRENT_UTCTIMESTAMP, -43200)");
        Dataset.datadisk = executeRecordSetObj1("select d.usage_type, ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(v2.data_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( ( m_volumes as v1 join M_VOLUME_SIZES as v2 on v1.volume_id = v2.volume_id ) right outer join m_disks as d on d.disk_id = v2.disk_id ) where d.usage_type in ('DATA') group by v1.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,v1.host");
        Dataset.tracedisk = executeRecordSetObj1("select d.usage_type, ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(t.file_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( m_tracefiles as t right outer join m_disks as d on d.host = t.host ) where d.usage_type like '%TRACE%' group by d.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,d.host");
        Dataset.logdisk = executeRecordSetObj1("select d.usage_type, ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(v2.log_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( ( m_volumes as v1 join M_VOLUME_SIZES as v2 on v1.volume_id = v2.volume_id ) right outer join m_disks as d on d.disk_id = v2.disk_id ) where d.usage_type like 'LOG' group by d.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,d.host");
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