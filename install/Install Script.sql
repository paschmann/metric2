-- ********** IMPORTANT ***********
-- You need to decide if you will use the metric2 service account created below or if you will use your own account (e.g. SYSTEM)

DROP SCHEMA METRIC2 CASCADE;
CREATE SCHEMA METRIC2;

-- ********** M2 Service Account ***********
CREATE USER M2_SVC_ACCOUNT PASSWORD 7Ag6w612auiY881;
-- NB, after the user is created, you may need to log in using the user account to set the password for the first time (this depends on your instance password policy requirements)

CREATE ROLE M2_SERVICE;
GRANT INSERT, SELECT, UPDATE, DELETE, DROP, CREATE ANY, ALTER, EXECUTE ON SCHEMA metric2 TO M2_SERVICE;
GRANT MONITORING TO M2_SERVICE WITH ADMIN OPTION;
GRANT M2_SERVICE TO M2_SVC_ACCOUNT WITH ADMIN OPTION;
GRANT AFL__SYS_AFL_AFLPAL_EXECUTE TO M2_SERVICE;
GRANT EXECUTE ON SYSTEM.AFL_WRAPPER_ERASER to M2_SERVICE;
GRANT EXECUTE ON SYSTEM.AFL_WRAPPER_GENERATOR to M2_SERVICE;
GRANT EXECUTE ON _SYS_AFL.PAL_TS_S to M2_SERVICE;


-- ********** Application service account **********
-- If you would prefer to use your own account, set the username to that account below.

UPDATE "_SYS_XS" ."SQL_CONNECTIONS" SET username = 'M2_SVC_ACCOUNT' WHERE name = 'lilabs.metric2.lib::metricuser';

-- *******************************************************************************



--Sequences
CREATE SEQUENCE "METRIC2"."ALERT_HISTORY_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."ALERT_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."CONNECTION_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."DASHBOARD_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."DASHBOARD_WIDGET_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."DASHBOARD_WIDGET_PARAM_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."DWP_HISTORY_ID" START WITH 1;
CREATE SEQUENCE "METRIC2"."ALERT_MAIL_ID" START WITH 1;

-- Sequences with default data
CREATE SEQUENCE "METRIC2"."OPTION_ID" START WITH 200;
CREATE SEQUENCE "METRIC2"."WIDGET_ID" START WITH 200;
CREATE SEQUENCE "METRIC2"."WIDGET_PARAM_ID" START WITH 300;
CREATE SEQUENCE "METRIC2"."USER_ID" START WITH 2;


-- Tables
CREATE ROW TABLE "METRIC2"."M2_ALERT"  ( "ALERT_ID" INT CS_INT NOT NULL, "DASHBOARD_WIDGET_ID" INT CS_INT, "COND" VARCHAR(40) CS_STRING, "OPERATOR" VARCHAR(40) CS_STRING, "VALUE" REAL CS_FLOAT, "NOTIFY" VARCHAR(200) CS_STRING, "USER_ID" INT CS_INT, "STATUS" INT CS_INT DEFAULT 1, "LAST_EXECUTED" LONGDATE CS_LONGDATE DEFAULT CURRENT_TIMESTAMP, "CREATED_ON" LONGDATE CS_LONGDATE DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( "ALERT_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_ALERT_HISTORY"  ( "ALERT_HIST_ID" INT CS_INT NOT NULL, "ALERT_ID" INT CS_INT, "DASHBOARD_WIDGET_ID" INT CS_INT, "COND" VARCHAR(40) CS_STRING, "OPERATOR" VARCHAR(40) CS_STRING, "VALUE" REAL CS_FLOAT, "NOTIFY" VARCHAR(200) CS_STRING, "ACTUAL" REAL CS_FLOAT, "ADDED" LONGDATE CS_LONGDATE DEFAULT CURRENT_TIMESTAMP, "ADDED_BY" VARCHAR(50) CS_STRING, PRIMARY KEY ( "ALERT_HIST_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_DASHBOARD"  ( "DASHBOARD_ID" INT CS_INT NOT NULL, "TITLE" VARCHAR(100) CS_STRING, "SUBTITLE" VARCHAR(100) CS_STRING, "DT_ADDED" LONGDATE CS_LONGDATE, "USER_ID" INT CS_INT, "REFRESH_RATE" INT CS_INT, "WIDTH" INT CS_INT, "HEIGHT" INT CS_INT, "BG_COLOR" VARCHAR(10) CS_STRING, "TV_MODE" INT CS_INT, PRIMARY KEY ( "DASHBOARD_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_DASHBOARD_WIDGET"  ( "DASHBOARD_WIDGET_ID" INT CS_INT NOT NULL, "DASHBOARD_ID" INT CS_INT, "WIDGET_ID" INT CS_INT, "TITLE" VARCHAR(100) CS_STRING, "WIDTH" INT CS_INT, "HEIGHT" INT CS_INT, "ROW_POS" INT CS_INT, "COL_POS" INT CS_INT, "REFRESH_RATE" INT CS_INT DEFAULT 0, PRIMARY KEY ( "DASHBOARD_WIDGET_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_DASHBOARD_WIDGET_PARAMS"  ( "DASHBOARD_WIDGET_PARAM_ID" INT CS_INT NOT NULL, "DASHBOARD_WIDGET_ID" INT CS_INT, "PARAM_ID" INT CS_INT, "VALUE" VARCHAR(1000) CS_STRING, "WIDGET_ID" INT CS_INT, "DT_ADDED" LONGDATE CS_LONGDATE, PRIMARY KEY ( "DASHBOARD_WIDGET_PARAM_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_DWP_HISTORY"  ( "DWP_HIST_ID" INT CS_INT NOT NULL, "DASHBOARD_WIDGET_PARAM_ID" INT CS_INT NOT NULL, "DT_ADDED" LONGDATE CS_LONGDATE DEFAULT CURRENT_TIMESTAMP, "VALUE" VARCHAR(100) CS_STRING, PRIMARY KEY ( "DWP_HIST_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_PAL_TS_FIXEDVALS"  ( "ID" INT CS_INT ) ;
CREATE ROW TABLE "METRIC2"."M2_USER_CONNECTIONS"  ( "CONNECTION_ID" INT CS_INT NOT NULL, "USER_ID" INT CS_INT, "NAME" VARCHAR(40) CS_STRING, "STRING" VARCHAR(200) CS_STRING, PRIMARY KEY ( "CONNECTION_ID" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_USERS"  ( "USER_ID" INT CS_INT NOT NULL, "NAME" VARCHAR(100) CS_STRING, "LNAME" VARCHAR(100) CS_STRING, "ACCT_TYPE" INT CS_INT, "EMAIL" VARCHAR(100) CS_STRING NOT NULL, "PASSWORD" VARCHAR(100) CS_STRING, "EMAIL_DOMAIN" VARCHAR(100) CS_STRING, "DT_ADDED" LONGDATE CS_LONGDATE, "USER_TOKEN" VARCHAR(100) CS_STRING, PRIMARY KEY ( "USER_ID", "EMAIL" ) ) ;
CREATE ROW TABLE "METRIC2"."M2_WIDGET"  ( "WIDGET_ID" INT CS_INT, "NAME" VARCHAR(100) CS_STRING, "ICON_URL" VARCHAR(200) CS_STRING, "TYPE" VARCHAR(40) CS_STRING, "CODE" VARCHAR(100) CS_STRING, "CODE_TYPE" VARCHAR(100) CS_STRING, "DESCRIPTION" VARCHAR(200) CS_STRING, "WIDGET_GROUP" INT CS_INT, "HIST_ENABLED" INT CS_INT DEFAULT 0, "DEF_HEIGHT" INT CS_INT, "DEF_WIDTH" INT CS_INT ) ;
CREATE ROW TABLE "METRIC2"."M2_WIDGET_PARAM"  ( "PARAM_ID" INT CS_INT, "WIDGET_ID" INT CS_INT, "NAME" VARCHAR(100) CS_STRING, "TYPE" VARCHAR(100) CS_STRING, "VALUE_DEFAULT" VARCHAR(1000) CS_STRING, "INDEX_NO" INT CS_INT, "REQUIRED" INT CS_INT, "PLACEHOLDER" VARCHAR(100) CS_STRING, "DISPLAY_NAME" VARCHAR(100) CS_STRING, "VISIBLE" VARCHAR(10) CS_STRING, "OPTION_GROUP" INT CS_INT, "HIST_ENABLED" INT CS_INT DEFAULT 0, "HIST_DATAPOINT" VARCHAR(10) CS_STRING) ;
CREATE ROW TABLE "METRIC2"."M2_WIDGET_PARAM_OPTIONS"  ( "OPTION_ID" INT CS_INT NOT NULL, "VALUE" VARCHAR(200) CS_STRING, "DISPLAY_VALUE" VARCHAR(200) CS_STRING, "OPTION_GROUP" INT CS_INT, PRIMARY KEY ( "OPTION_ID" ) ) ;

-- Col Tables
CREATE COLUMN TABLE "METRIC2"."M2_PAL_TS_PARAMS" ("NAME" VARCHAR(60), "INTARGS" INTEGER CS_INT, "DOUBLEARGS" DOUBLE CS_DOUBLE, "STRINGARGS" VARCHAR(100)) UNLOAD PRIORITY 0  AUTO MERGE;
CREATE COLUMN TABLE "METRIC2"."M2_PAL_TS_RESULTS" ("ID" INTEGER CS_INT, "VALUE" DOUBLE CS_DOUBLE) UNLOAD PRIORITY 0  AUTO MERGE;
CREATE TABLE "METRIC2"."M2_OUTGOING_EMAIL" ("ID" INT, "EMAILTO" VARCHAR(255), "EMAILFROM" VARCHAR(255), "SUBJECT" VARCHAR(255), "CONTENTS" VARCHAR(2000), "SENT" VARCHAR(100));

-- Views
CREATE VIEW "METRIC2"."V_TS_DATA" ( "ID", "VALUE" ) AS SELECT TO_INT(TO_CHAR(DT_ADDED, 'HH24')) ID, AVG(TO_REAL(a.VALUE)) VALUE FROM METRIC2.M2_DWP_HISTORY a WHERE DASHBOARD_WIDGET_PARAM_ID = 771 GROUP BY TO_INT(TO_CHAR(DT_ADDED, 'HH24')), DASHBOARD_WIDGET_PARAM_ID ORDER BY TO_INT(TO_CHAR(DT_ADDED, 'HH24')) ASC WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_V_PAL_TS_DATA" ( "ID", "VALUE" ) AS SELECT TO_INT(TO_CHAR(DT_ADDED, 'HH24')) ID, AVG(TO_REAL(a.VALUE)) VALUE FROM METRIC2.M2_DWP_HISTORY a WHERE DASHBOARD_WIDGET_PARAM_ID = 1102 GROUP BY TO_INT(TO_CHAR(DT_ADDED, 'HH24')), DASHBOARD_WIDGET_PARAM_ID ORDER BY TO_INT(TO_CHAR(DT_ADDED, 'HH24')) ASC WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_V_PAL_RESULTS" ( "ID", "VALUE" ) AS SELECT CASE WHEN a.ID IS NOT NULL THEN a.ID ELSE b.ID END AS ID, CASE WHEN ROUND(a.VALUE,2) IS NOT NULL THEN ROUND(a.VALUE,2) ELSE ROUND(b.VALUE, 2) END VALUE FROM METRIC2.M2_V_PAL_TS_DATA a FULL JOIN METRIC2.M2_PAL_TS_RESULTS b ON (a.ID=b.ID) ORDER BY ID ASC WITH READ ONLY;

-- Metric Data Views
CREATE VIEW "METRIC2"."M2_WIDGET_CONNLIST" ( "Connection ID", "Host", "Port", "Client IP", "Schema", "Status" ) AS SELECT connection_id as "Connection ID", host as "Host", port as "Port", client_ip as "Client IP", current_schema_name as "Schema", connection_status as "Status" FROM (SELECT C.*, P.STATEMENT_STRING FROM SYS.M_CONNECTIONS C LEFT OUTER JOIN SYS.M_PREPARED_STATEMENTS P ON C.CURRENT_STATEMENT_ID = P.STATEMENT_ID WHERE C.CONNECTION_ID > 0 AND C.CONNECTION_STATUS = 'RUNNING') TMP WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_ROWCOLSIZES" ( "cols", "rows" ) AS SELECT C AS "cols", R AS "rows" FROM ( SELECT ROUND(SUM(TABLE_SIZE)/1024/1024/1024,2) AS "C" 	FROM SYS.M_TABLES WHERE IS_COLUMN_TABLE = 'TRUE'),( SELECT ROUND(SUM(TABLE_SIZE)/1024/1024/1024,2) AS "R" FROM SYS.M_TABLES WHERE IS_COLUMN_TABLE = 'FALSE') WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_ALLSTARTED" ( "STATUS" ) AS SELECT STATUS from SYS.M_SYSTEM_OVERVIEW WHERE name = 'All Started' AND section = 'Services' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_ALLSTARTED_VALUE" ( "VALUE" ) AS SELECT VALUE from SYS.M_SYSTEM_OVERVIEW WHERE name = 'All Started' AND section = 'Services' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_BLOCKEDTRANS" ( "CNT" ) AS SELECT COUNT(HOST) AS CNT FROM SYS.M_BLOCKED_TRANSACTIONS WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_BLOCKEDTRANSLIST" ( "HOST", "SCHEMA", "OBJECT", "TYPE", "MODE" ) AS SELECT HOST, WAITING_SCHEMA_NAME AS SCHEMA, WAITING_OBJECT_NAME AS OBJECT, LOCK_TYPE AS TYPE, LOCK_MODE AS MODE FROM SYS.M_BLOCKED_TRANSACTIONS WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_CONNECTIONS" ( "STATUS" ) AS SELECT COUNT(CONNECTION_ID) as STATUS FROM SYS.M_CONNECTIONS GROUP BY connection_status ORDER BY connection_status WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_DATADISK" ( "DISK_SIZE", "DATA_SIZE", "USED_SIZE" ) AS select ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(v2.data_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( ( m_volumes as v1 join M_VOLUME_SIZES as v2 on v1.volume_id = v2.volume_id ) right outer join m_disks as d on d.disk_id = v2.disk_id ) where d.usage_type = 'DATA' group by v1.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,v1.host WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_DB_CPU" ( "CPU" ) AS SELECT ABS(SUM(PROCESS_CPU)) as CPU from SYS.M_SERVICE_STATISTICS WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_DBMEM" ( "ALLOCATION_LIMIT", "TOTAL_MEMORY_USED_SIZE", "PEAK" ) AS select ROUND(m1.ALLOCATION_LIMIT/1024/1024/1024,2) as ALLOCATION_LIMIT, ROUND(m1.INSTANCE_TOTAL_MEMORY_USED_SIZE/1024/1024/1024) as TOTAL_MEMORY_USED_SIZE, ROUND((b1.PEAK+m1.INSTANCE_CODE_SIZE+ m1.INSTANCE_SHARED_MEMORY_ALLOCATED_SIZE)/1024/1024/1024,2)  as PEAK from SYS.M_HOST_RESOURCE_UTILIZATION m1  join (select a2.HOST as HOST, sum(ifnull (a1.INCLUSIVE_PEAK_ALLOCATION_SIZE,	 a2.HEAP_MEMORY_USED_SIZE)) as PEAK from SYS.M_SERVICE_MEMORY a2  left outer join (select HOST, PORT, INCLUSIVE_PEAK_ALLOCATION_SIZE from SYS.M_HEAP_MEMORY_RESET  where DEPTH = 0 ) as a1 on a2.HOST = a1.HOST and a2.PORT = a1.PORT group by a2.HOST) as b1 on m1.HOST = b1.HOST WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_DISTRIBUTED_VALUE" ( "VALUE" ) AS SELECT VALUE from SYS.M_SYSTEM_OVERVIEW WHERE name = 'Distributed' AND section = 'System' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_FREEPHYSMEM" ( "RND" ) AS select round((USED_PHYSICAL_MEMORY + FREE_PHYSICAL_MEMORY) /1024/1024/1024, 2) AS RND from PUBLIC.M_HOST_RESOURCE_UTILIZATION WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_INSTANCEID" ( "VALUE" ) AS SELECT value from SYS.M_SYSTEM_OVERVIEW WHERE name = 'Instance ID' AND section = 'System' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_INSTANCENUMBER" ( "VALUE" ) AS SELECT VALUE from SYS.M_SYSTEM_OVERVIEW WHERE name = 'Instance Number' AND section = 'System' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_INVALID_CONS" ( "CNT" ) AS SELECT COUNT(USER_NAME) AS CNT FROM INVALID_CONNECT_ATTEMPTS WHERE SUCCESSFUL_CONNECT_TIME > ADD_SECONDS (CURRENT_UTCTIMESTAMP, -43200) WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_LOGDISK" ( "DISK_SIZE", "DATA_SIZE", "USED_SIZE" ) AS select ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(v2.data_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( ( m_volumes as v1 join M_VOLUME_SIZES as v2 on v1.volume_id = v2.volume_id ) right outer join m_disks as d on d.disk_id = v2.disk_id ) where d.usage_type = 'LOG' group by v1.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,v1.host WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_PHYSICALMEM" ( "PHYSICAL_MEMORY" ) AS select ROUND(T2.PHYSICAL_MEMORY_SIZE/1024/1024/1024,2) as PHYSICAL_MEMORY from M_HOST_RESOURCE_UTILIZATION as T1 join (select M_SERVICE_MEMORY.HOST, sum(M_SERVICE_MEMORY.PHYSICAL_MEMORY_SIZE) as PHYSICAL_MEMORY_SIZE,sum(M_SERVICE_MEMORY.SHARED_MEMORY_ALLOCATED_SIZE) as SHARED_MEMORY_ALLOCATED_SIZE from SYS.M_SERVICE_MEMORY group by M_SERVICE_MEMORY.HOST) as T2 on T2.HOST = T1.HOST WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_RESIDENTMEM" ( "FREE_PHYSICAL_MEMORY", "TOTAL_MEMORY", "PHYSICAL_MEMORY", "TOTAL_PHYSICAL_MEMORY" ) AS select ROUND(T1.FREE_PHYSICAL_MEMORY/1024/1024/1024,2) as FREE_PHYSICAL_MEMORY, ROUND((T1.USED_PHYSICAL_MEMORY+ T2.SHARED_MEMORY_ALLOCATED_SIZE)/1024/1024/1024,2) as TOTAL_MEMORY, ROUND(T2.PHYSICAL_MEMORY_SIZE/1024/1024/1024,2) as PHYSICAL_MEMORY, ROUND((T1.FREE_PHYSICAL_MEMORY+T1.USED_PHYSICAL_MEMORY)/1024/1024/1024,2) as TOTAL_PHYSICAL_MEMORY from M_HOST_RESOURCE_UTILIZATION as T1 join (select M_SERVICE_MEMORY.HOST, sum(M_SERVICE_MEMORY.PHYSICAL_MEMORY_SIZE) as PHYSICAL_MEMORY_SIZE,sum(M_SERVICE_MEMORY.SHARED_MEMORY_ALLOCATED_SIZE) as SHARED_MEMORY_ALLOCATED_SIZE from SYS.M_SERVICE_MEMORY group by M_SERVICE_MEMORY.HOST) as T2 on T2.HOST = T1.HOST WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_RUNNINGCONNETIONS" ( "CNT" ) AS SELECT count(C.CONNECTION_STATUS) AS CNT FROM SYS.M_CONNECTIONS C WHERE C.CONNECTION_STATUS = 'RUNNING' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_SYS_MEM" ( "SM" ) AS SELECT round(sum(VALUE/1024/1024/1024),1) as SM FROM SYS.M_MEMORY WHERE NAME = 'SYSTEM_MEMORY_SIZE' AND PORT = '30003' WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_SYSALERTS" ( "ALERT_DETAILS", "ALERT_RATING", "ALERT_TIMESTAMP", "HOST", "ALERT_ID", "ALERT_NAME", "ALERT_DESCRIPTION", "ALERT_USERACTION" ) AS SELECT ALERT_DETAILS, ALERT_RATING, ALERT_TIMESTAMP, HOST, ALERT_ID, ALERT_NAME, ALERT_DESCRIPTION, ALERT_USERACTION FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS  WHERE (ALERT_RATING =2 OR ALERT_RATING =3 OR ALERT_RATING =4 OR ALERT_RATING =5) WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_SYSOVERVIEW" ( "STATUS" ) AS SELECT STATUS FROM SYS.M_SYSTEM_OVERVIEW WHERE NAME IN ('CPU','Data', 'Log', 'Trace', 'Alerts') WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_TOTAL_CPU" ( "SM" ) AS  select ROUND(ABS(SUM(TOTAL_CPU) / COUNT(TOTAL_CPU)), 0)  AS SM from sys.m_service_statistics WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_TRACEDISK" ( "DISK_SIZE", "DATA_SIZE", "USED_SIZE" ) AS select ROUND(d.total_size/1024/1024/1024,2) disk_size, ROUND(sum(t.file_size)/1024/1024/1024,2) data_size, ROUND(d.used_size/1024/1024/1024,2) used_size from ( m_tracefiles as t right outer join m_disks as d on d.host = t.host ) where d.usage_type like '%TRACE%' group by d.host, d.usage_type, d.total_size,d.device_id, d.path, d.used_size order by d.device_id,d.host WITH READ ONLY;
CREATE VIEW "METRIC2"."M2_WIDGET_USERALERTS" ( "ALERT_ID", "OPERATOR", "V1", "ACTUAL", "ALERT_TIMESTAMP", "VALUE", "NOTIFY", "COND", "TITLE" ) AS SELECT metric2.m2_alert_history.alert_id, metric2.m2_alert_history.operator, metric2.m2_alert.value v1, metric2.m2_alert_history.actual, TO_CHAR(metric2.m2_alert_history.added, 'MM/DD/YY HH:MM:SS'), metric2.m2_alert_history.value, metric2.m2_alert_history.notify, metric2.m2_alert.cond, metric2.m2_dashboard_widget.title FROM metric2.m2_alert INNER JOIN metric2.M2_DASHBOARD_WIDGET ON metric2.m2_alert.dashboard_widget_id = metric2.m2_dashboard_widget.dashboard_widget_id  INNER JOIN metric2.m2_alert_history ON  metric2.m2_alert_history.dashboard_widget_id = metric2.m2_alert.dashboard_widget_id  WHERE metric2.m2_alert_history.alert_hist_id IN (Select distinct metric2.m2_alert_history.alert_hist_id from metric2.m2_alert_history order by alert_hist_id desc LIMIT 5) WITH READ ONLY; 
CREATE VIEW "METRIC2"."M2_WIDGET_HANAOVERVIEW" ( "CPU", "MEM", "RUNNING", "BLOCKED", "ACTIVE", "INVALID_CONS", "DATA_DISK_SIZE", "DATA_DATA_SIZE", "DATA_USED_SIZE", "LOG_DISK_SIZE", "LOG_DATA_SIZE", "LOG_USED_SIZE" ) AS SELECT CPU.SM AS CPU, MEM.SM AS MEM, CONS.CNT AS RUNNING, BLOCKED.CNT AS BLOCKED,  ACTIVE.STATUS AS ACTIVE,	INVALID.CNT AS INVALID_CONS, DATA.DISK_SIZE AS DATA_DISK_SIZE,  DATA.DATA_SIZE AS DATA_DATA_SIZE, DATA.USED_SIZE AS DATA_USED_SIZE, LOG.DISK_SIZE AS LOG_DISK_SIZE, LOG.DATA_SIZE AS LOG_DATA_SIZE, LOG.USED_SIZE AS LOG_USED_SIZE FROM METRIC2.M2_WIDGET_TOTAL_CPU "CPU",METRIC2.M2_WIDGET_SYS_MEM "MEM", METRIC2.M2_WIDGET_INVALID_CONS "INVALID", METRIC2.M2_WIDGET_DATADISK "DATA", METRIC2.M2_WIDGET_RUNNINGCONNETIONS "CONS", METRIC2.M2_WIDGET_BLOCKEDTRANS "BLOCKED", METRIC2.M2_WIDGET_CONNECTIONS "ACTIVE", METRIC2.M2_WIDGET_LOGDISK "LOG" LIMIT 1 WITH READ ONLY;

-- Procedures
CREATE PROCEDURE METRIC2.M2_P_WIDGET_HISTORY(v_dwid INT, v_startdt VARCHAR(30), v_enddt VARCHAR(30)) LANGUAGE SQLSCRIPT AS BEGIN SELECT TO_CHAR(metric2.m2_dwp_history.dt_added, 'YYYY') as year, TO_CHAR(metric2.m2_dwp_history.dt_added, 'MM') as month, TO_CHAR(metric2.m2_dwp_history.dt_added, 'DD') as day, TO_CHAR(metric2.m2_dwp_history.dt_added, 'HH24') as hour, TO_CHAR(metric2.m2_dwp_history.dt_added, 'MI') as min, '00' as secs, TO_DECIMAL(AVG(TO_INT(metric2.m2_dwp_history.value)),2,2) as value from metric2.m2_dwp_history INNER JOIN metric2.m2_dashboard_widget_params ON metric2.m2_dwp_history.dashboard_widget_param_id = metric2.m2_dashboard_widget_params.dashboard_widget_param_id INNER JOIN metric2.m2_widget_param ON metric2.m2_widget_param.param_id = metric2.m2_dashboard_widget_params.param_id WHERE  metric2.m2_dashboard_widget_params.dashboard_widget_id = :v_dwid AND (TO_DATE(TO_CHAR(metric2.m2_dwp_history.dt_added, 'MM/DD/YYYY'),'MM/DD/YYYY') between TO_DATE(:v_startdt,'MM/DD/YYYY')  AND TO_DATE(:v_enddt,'MM/DD/YYYY')) GROUP BY TO_CHAR(metric2.m2_dwp_history.dt_added, 'YYYY'), TO_CHAR(metric2.m2_dwp_history.dt_added, 'MM'), TO_CHAR(metric2.m2_dwp_history.dt_added, 'DD'), TO_CHAR(metric2.m2_dwp_history.dt_added, 'HH24'), TO_CHAR(metric2.m2_dwp_history.dt_added, 'MI') ORDER BY day desc, hour desc, min desc; END;
CREATE PROCEDURE METRIC2.M2_P_DELETE_DASHBOARD(dashboard_id INT) LANGUAGE SQLSCRIPT AS BEGIN DELETE FROM METRIC2.M2_DWP_HISTORY WHERE DASHBOARD_WIDGET_PARAM_ID in (SELECT DASHBOARD_WIDGET_PARAM_ID FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS INNER JOIN METRIC2.M2_DASHBOARD_WIDGET ON METRIC2.M2_DASHBOARD_WIDGET_PARAMS.DASHBOARD_WIDGET_ID = METRIC2.M2_DASHBOARD_WIDGET.DASHBOARD_WIDGET_ID WHERE DASHBOARD_ID = :dashboard_id); DELETE FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS WHERE DASHBOARD_WIDGET_ID in (SELECT DASHBOARD_WIDGET_ID FROM METRIC2.M2_DASHBOARD_WIDGET WHERE DASHBOARD_ID = :dashboard_id); DELETE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id in (SELECT DASHBOARD_WIDGET_ID FROM METRIC2.M2_DASHBOARD_WIDGET WHERE DASHBOARD_ID = :dashboard_id); DELETE FROM metric2.m2_alert WHERE dashboard_widget_id in (SELECT DASHBOARD_WIDGET_ID FROM METRIC2.M2_DASHBOARD_WIDGET WHERE DASHBOARD_ID = :dashboard_id); DELETE FROM metric2.m2_alert_history WHERE dashboard_widget_id in (SELECT DASHBOARD_WIDGET_ID FROM METRIC2.M2_DASHBOARD_WIDGET WHERE DASHBOARD_ID = :dashboard_id); DELETE FROM METRIC2.M2_DASHBOARD WHERE DASHBOARD_ID = :dashboard_id; END;
CREATE PROCEDURE METRIC2.M2_P_DELETE_WIDGET(widget_id INT) LANGUAGE SQLSCRIPT AS BEGIN DELETE FROM METRIC2.M2_DWP_HISTORY WHERE DASHBOARD_WIDGET_PARAM_ID in (SELECT DASHBOARD_WIDGET_PARAM_ID FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS WHERE DASHBOARD_WIDGET_ID = :widget_id); DELETE FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS WHERE DASHBOARD_WIDGET_ID = :widget_id; DELETE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id  = :widget_id; DELETE FROM metric2.m2_alert WHERE dashboard_widget_id = :widget_id; DELETE FROM metric2.m2_alert_history WHERE dashboard_widget_id  = :widget_id; END;
CREATE PROCEDURE METRIC2.M2_P_HISTGENERATOR(dwp_id INT, min_Val INT, max_val INT, start_hour INT, end_hour INT, add_days INT) LANGUAGE SQLSCRIPT AS CNTR INTEGER; BEGIN CNTR := :start_hour; WHILE CNTR <= :end_hour DO INSERT INTO "METRIC2"."M2_DWP_HISTORY" VALUES ("METRIC2"."DWP_HISTORY_ID".NEXTVAL, :dwp_id, ADD_DAYS(ADD_SECONDS(CURRENT_DATE, 60*(:CNTR*60)), :add_days), TO_INT(:min_val + (:max_val-:min_val)*RAND())); CNTR := CNTR + 1; END WHILE; END;
CREATE PROCEDURE METRIC2.M2_P_DELETE_WIDGET_HISTORY(widget_id INT) LANGUAGE SQLSCRIPT AS BEGIN DELETE FROM METRIC2.M2_DWP_HISTORY WHERE DASHBOARD_WIDGET_PARAM_ID in (SELECT DASHBOARD_WIDGET_PARAM_ID FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS WHERE DASHBOARD_WIDGET_ID = :widget_id); END;
CREATE PROCEDURE 
METRIC2.M2_P_CLONEMETRIC(v_dwid INT, v_did INT) LANGUAGE SQLSCRIPT AS BEGIN INSERT INTO METRIC2.M2_DASHBOARD_WIDGET SELECT METRIC2.DASHBOARD_WIDGET_ID.NEXTVAL, DASHBOARD_ID, WIDGET_ID, TITLE, WIDTH, HEIGHT, ROW_POS, COL_POS, REFRESH_RATE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id  = :v_dwid; INSERT INTO METRIC2.M2_DASHBOARD_WIDGET_PARAMS SELECT METRIC2.DASHBOARD_WIDGET_PARAM_ID.NEXTVAL, METRIC2.DASHBOARD_WIDGET_ID.CURRVAL, PARAM_ID, VALUE, WIDGET_ID, DT_ADDED FROM METRIC2.M2_DASHBOARD_WIDGET_PARAMS WHERE DASHBOARD_WIDGET_ID = :v_dwid; END;

-- Create demo user
INSERT INTO METRIC2.M2_USERS (user_ID, name, lname, email_domain, email, password, acct_type, dt_added) 
VALUES (1, 'Demo', 'User', 'Lithium Labs', 'demo@metric2.com', '5749A96C37BEEF97ED177C17D625385E343399D3A1CD232BA4D59A1E5C142CAD', '0', '0123-01-01 00:00:00.0')


-- Widgets by Type
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (1,'Text and Footer','1.png','Static','widgetTextAndFooter','Client','Display Plain Text',2,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (2,'List','2.png','Query','widgetList','Client','A Table of List data',2,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (3,'Number and Text','3.png','Query','widgetNumberAndText','Client','A Large number with text below it',2,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (4,'All Services Started','4.png','Query','widgetAllServicesStarted','Client','Displays whether the HANA Services have been started or not',1,0,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (5,'Icon and Text','5.png','Query','widgetIcon','Client','Displays an Icon of your choice and a custom SQL data point followed by Text',2,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (6,'Number and Changed Value','6.png','Query','widgetNumberChange','Client','Displays a large number value with amount changed since last update',2,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (7,'Instance Details','7.png','Query','widgetInstanceDetails','Client','Displays the Instance ID and Number of the Connection',1,0,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (8,'Current Connections','8.png','Query','widgetNumberChange','Client','Displays the current connections to your Database',1,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (9,'DB CPU Usage History','9.png','Query','widgetHistChart','Client','A history of CPU for the HANA Database Instance',1,1,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (10,'Block Transactions','10.png','Query','widgetNumberChange','Client','A count of currently blocked transactions',1,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (11,'Blocked Transaction List','11.png','Query','widgetList','Client','A list of transactions currently being blocked',1,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (12,'Component Overview','12.png','Query','widgetComponentOverview','Client','A summary of the status of each core system component',1,0,1,3);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (13,'Memory Used','13.png','Query','widgetUsedMemoryPie','Client','A pie chart showing the used and available memory',1,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (14,'Resident Memory Usage History','14.png','Query','widgetHistChart','Client','A line chart showing the memory usage history',1,1,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (15,'Date and Time','15.png','Static','widgetDateTime','Client','A Date and Time Widget',2,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (16,'Connection History','16.png','Query','widgetHistChart','Client','A historical chart showing the recent connection count',1,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (17,'Weather','17.png','Service','widgetWeather','Client','A weather display',7,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (18,'Disk Usage','18.png','Query','widgetBullet','Client','A bullet chart showing data, trace and log disk usage, volume size and disk size',1,0,2,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (21,'System Overview','21.png','Query','widgetSystemOverview','Client','A summary of important system metrics',1,0,1,4);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (22,'System Type','22.png','Query','widgetIconDistributed','Client','A icon showing the system type',1,0,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (23,'Recent Unsuccessful Connections','23.png','Query','widgetRecentUnConnections','Client','A recent (12 hours) count of unsuccessful connection attempts',1,1,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (24,'DB Memory Overview','24.png','Query','widgetDBMemoryOverview','Client','A summary of Database Memory details',1,0,1,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (25,'Resident Memory Overview','25.png','Query','widgetResMemoryOverview','Client','A summary of Resident Memory details',1,0,1,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (26,'Ping','26.png','Query','widgetPing','Client','Ping a host IP Address',7,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (27,'System Connections','27.png','Query','widgetFunnel','Client','Displays the 3 groups of connection types',1,0,1,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (28,'System Alert Ticker','28.png','Query','widgetSystemAlerts','Client','Displays the system alerts in a ticker format',1,0,1,3);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (29,'Sensor (API)','29.png','WebService','widgetSensorAPI','Client','Displays a physical temperature from a sensor',6,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (30,'Stock Price','30.png','Service','widgetStockPrice','Client','Stock Price',7,1,1,1);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (31,'Twitter','31.png','Service','widgetTwitter','Client','Displays a twitter feed from a designated user',7,0,3,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (32,'User Alert Ticker','32.png','Query','widgetUserAlerts','Client','Displays a list of recently executed user alerts',1,0,1,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (33,'Sensor (Poll)','33.png','Service','widgetSensorPoll','Client','Displays a value from a Sensor using poll (HTTP GET)',6,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (34,'Number and History','34.png','Query','widgetHistorySmall','Client','Displays a value, icon and small history chart below the number',2,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (35,'Row and Column Table Size','35.png','Query','widgetTableSizes','Client','Displays the size of the row and columns in memory',1,0,1,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (36,'JSON Web Service','36.png','Service','widgetJSONService','Client','Client side call to a web service, and displays the value',7,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (37,'JSON Web Service Table','37.png','Service','widgetJSONServiceTable','Client','Client side call to a web service, and displays the response as a table',7,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (38,'Connection List','38.png','Query','widgetTable','Client','Displays a list of running connections including IP, host, schema, and status',1,0,1,3);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (39,'Map','39.png','Query','widgetDataMap','Client','Displays a map and queries your DB for a latitude, longditude, name and value',2,0,2,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (40,'Progress Bar','40.png','Query','widgetProgressBar','Client','Displays a progress bar from a custom SQL Script (SQL should return a percent and a value)',2,1,1,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (41,'RSS Feed','41.png','Service','widgetRSSFeed','Client','Displays posts from a specified RSS Feed',7,0,null,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (42,'Image Box','42.png','Static','widgetImageBox','Client','Displays a Image using the supplied URL',2,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (43,'Gauge','43.png','Query','metricGauge','Client','Displays a gauge with a numeric value',2,1,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (44,'Clock','44.png','Query','metricClock','Client','Displays a clock',2,0,2,2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (45,'HANA Overview','45.png','Query','metricHANAOverview','Client','Displays a HANA Instance overview',1,0,4,6);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (46,'Label','46.png','Label','metricLabel','Client','Displays a dashboard label',2,0,null,null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (47,'US State Map', '47.png','Query','metricDataByState','Client','Displays a map of the US by State.', 2, 2, 2, 2);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (48,'Donut Chart', '48.png','Query','metricDonut','Client','Displays a donut chart.', 2, 0, null, null);
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (49,'Treemap', '49.png','Query','metricTreemap','Client','Displays a treemap chart.', 2, 0, null, null);

-- Widget Params
-- widgetTextAndFooter
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (4,1,'Large Text Value','Static','',100,0,'Any form of Static Text','Main Text','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (5,1,'Footer Text Value','Static','',200,0,'Any form of Static Text','Footer Text','true',null,0, null);

-- widgetList 
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (17,2,'SQL1','SQL','SELECT * FROM SYS.M_SYSTEM_OVERVIEW',200,0,'SQL Statement for the list of data to be returned','SQL Query','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (16,2,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


-- widgetNumberAndText
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (19,3,'SQL1','SQL','SELECT 7 as VALUE FROM DUMMY',200,1,'SQL Statement for the list of data to be returned','SQL Query','true',null, 1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (20,3,'TEXT1','Static','',300,0,'Any form of Static Text','Text','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (18,3,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


-- widgetAllServicesStarted
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (7,4,'SQL1','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_ALLSTARTED_VALUE',200,1,'SQL Statement for the value of the services','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (8,4,'SQL2','SQL','SELECT STATUS FROM METRIC2.M2_WIDGET_ALLSTARTED',300,1,'SQL Statement for Status','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (6,4,'Server Connection','OPTION','Local Server',100,0,'Local Server','Server Connection','true',3,0, null);

-- widgetIcon
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (9,5,'ICONURL','URL','',100,1,'Optional: The font awesome name of the Icon','Icon Name','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (10,5,'SQL1','SQL','SELECT 1 as VALUE FROM DUMMY',200,1,'SQL Statement for your data point','SQL Query','true',null, 1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (11,5,'TEXT1','Static','',300,1,'Any form of Static Text','Text','true',null,0);

-- widgetNumberChange
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (13,6,'SQL1','SQL','SELECT 283 as VALUE FROM DUMMY',200,1,'SQL Statement for your data point','SQL Query','true',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (31,6,'DECPLACE','Static','0',400,1,'Datatype of changed value (decimal places)','Decimal Places','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (14,6,'UOM1','OPTION','Gb',300,0,'Optional, Unit of measure for the changed value','Text','true',2,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (12,6,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

-- widgetInstanceDetails
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (22,7,'SQL1','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_INSTANCEID',200,0,'SQL Statement for the Instance ID to be returned','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (23,7,'SQL2','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_INSTANCENUMBER',300,0,'SQL Statement for the Instance number to be returned','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (21,7,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

-- widgetFunnel
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (27,8,'SQL1','SQL','SELECT CNT AS VALUE FROM METRIC2.M2_WIDGET_RUNNINGCONNETIONS',200,0,'SQL Statement for the number of connections to be returned','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (30,8,'DECPLACE','Static','0',400,1,'Datatype of changed value (decimal places)','Decimal Places','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (26,8,'UOM1','Static','Users',300,0,'Optional, Unit of measure for the changed value','Text','true',2,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (24,8,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

--widgetHistoryChart
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (33,9,'SQL1','RANGE','SELECT CPU AS VALUE FROM METRIC2.M2_WIDGET_DB_CPU',200,0,'SQL Statement to fetch the current CPU value','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (157,9,'UOM1','Static','%',300,1,'Required, Unit of measure','Text','false',2,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (35,9,'RECLIMIT','Static','20',300,1,'Integer: Number of records to fecth from history','Record Limit','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (36,9,'CHARTTYPE','OPTION','line',400,1,'Required: line or bar','Chart Type','true',1,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (32,9,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

--widgetBlockedTransactions
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (38,10,'SQL1','SQL','SELECT CNT FROM METRIC2.M2_WIDGET_BLOCKEDTRANS',200,0,'SQL Statement to fetch the current count of blocked transactions','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (37,10,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

--widgetBlockedTransactionsList
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (41,11,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_BLOCKEDTRANSLIST',200,0,'SQL Statement to fetch the current count of blocked transactions','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (39,11,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (44,12,'SQL1','SQL','SELECT STATUS FROM METRIC2.M2_WIDGET_SYSOVERVIEW',200,0,'SQL Statement to fetch the status of each sys component','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (43,12,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

--widgetUsedMemoryPie
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (54,13,'SQL1','SQL','SELECT RND AS VALUE FROM METRIC2.M2_WIDGET_FREEPHYSMEM',200,0,'SQL Statement to retrieve physical memory','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (56,13,'SQL2','SQL','SELECT PHYSICAL_MEMORY AS VALUE FROM METRIC2.M2_WIDGET_PHYSICALMEM',300,0,'SQL Statement to retrieve free physical memory','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (45,13,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (58,14,'SQL1','RANGE','SELECT PHYSICAL_MEMORY AS VALUE FROM METRIC2.M2_WIDGET_PHYSICALMEM',200,0,'SQL Statement to retrieve physical memory','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (153,14,'UOM1','Static','%',300,1,'Required, Unit of measure','Text','false',2,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (59,14,'RECLIMIT','Static','20',300,1,'Integer: Number of records to fecth from history','Record Limit','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (60,14,'CHARTTYPE','OPTION','line',400,1,'Required: line or bar','Chart Type','true',1,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (57,14,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (152,15,'TimeZone','Static','',100,0,'Time Zone of Clock','Javascript TZ Code','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (63,16,'SQL1','RANGE','SELECT CNT AS VALUE FROM METRIC2.M2_WIDGET_RUNNINGCONNETIONS',200,0,'SQL Statement to retrieve current connections','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (154,16,'UOM1','Static','',300,1,'Required, Unit of measure','Text','false',2,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (64,16,'RECLIMIT','Static','20',300,1,'Integer: Number of records to fecth from history','Record Limit','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (65,16,'CHARTTYPE','OPTION','line',400,1,'Required: line or bar','Chart Type','true',1,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (62,16,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (70,17,'ZIPCODE','Static',' ',100,1,'Required, ZIP Code for weather feed','ZIP Code','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (83,18,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_DATADISK',200,0,'SQL Query for DATA disk details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (85,18,'SQL2','SQL','SELECT * FROM METRIC2.M2_WIDGET_LOGDISK',300,0,'SQL Query for LOG disk details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (87,18,'SQL3','SQL','SELECT * FROM METRIC2.M2_WIDGET_TRACEDISK',400,0,'SQL Query for TRACE disk details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (71,18,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (76,21,'SQL1','SQL','SELECT SM FROM METRIC2.M2_WIDGET_TOTAL_CPU',200,0,'SQL Statement to retrieve CPU Usage','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (77,21,'SQL2','SQL','SELECT SM FROM METRIC2.M2_WIDGET_SYS_MEM',300,0,'SQL Statement to retrieve physical memory','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (79,21,'SQL3','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_ALLSTARTED_VALUE',400,0,'SQL Statement to check if all services are started','SQL Query','false',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (80,21,'SQL4','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_DISTRIBUTED_VALUE',500,0,'SQL Statement to check if the system is distributed','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (75,21,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (82,22,'SQL1','SQL','SELECT VALUE FROM METRIC2.M2_WIDGET_DISTRIBUTED_VALUE',200,0,'SQL Statement to check if the system is distributed','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (81,22,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (89,23,'SQL1','SQL','SELECT CNT AS VALUE FROM METRIC2.M2_WIDGET_INVALID_CONS',200,0,'SQL Query for unsuccessful connection attempts','SQL Query','false',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (88,23,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (93,24,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_DBMEM',200,0,'SQL Query for memory details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (91,24,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (95,25,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_RESIDENTMEM',200,0,'SQL Query for memory details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (94,25,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (97,26,'IP','Static','192.168.0.1',100,1,'IP or DNS Name of reachable server','IP/DNS Name','true',null,1, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (102,27,'SQL1','SQL','SELECT STATUS FROM METRIC2.M2_WIDGET_CONNECTIONS',200,0,'SQL Query for Connection counts','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (100,27,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (104,28,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_SYSALERTS',200,0,'SQL Query for current Alerts','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (103,28,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (118,29,'VALUE','HIST','',400,1,'Value to be displayed','','false',null,1, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (106,29,'TEXT1','Static','Temperature',200,0,'Text: The text displayed below the returned temperature','Display Text','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (109,29,'UOM1','OPTION',' ',300,0,'Optional, Unit of measure for the sensor value','UOM','true',2,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (122,30,'TICKER','Static','',100,1,'Stock Ticker','Ticker','true',null,1, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (112,31,'HANDLE','Static',' ',100,1,'Required, a twitter handle for the user','@Twitter','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (113,31,'NUMTWEETS','Static','5',200,1,'The number of tweets to display','Tweet Count','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (115,31,'WIDID','Static','',300,1,'Required: Twitter widget ID (can be created here: https://twitter.com/settings/widgets)','Widget ID','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (118,32,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_USERALERTS',200,0,'SQL Query for current user Alerts','SQL Query','false',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (125,34,'SQL1','RANGE','',200,1,'SQL Statement for the value to be displayed and stored','SQL Query','true',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (124,34,'Server Connection','OPTION','Local Server',100,0,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (126,34,'RECLIMIT','Static','30',300,1,'Integer: Number of records to fecth from history','Record Limit','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (128,34,'ICONURL','URL','',500,0,'Optional: The font awesome name of the Icon','Icon Name','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (130,34,'LINECOL','Static','#CCCCCC',600,0,'HTML Color: Color of the sparkline','Sparkline Color','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (131,34,'UOM1','OPTION',' ',250,0,'Optional, Unit of measure for the value','UOM','true',2,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (134,35,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_ROWCOLSIZES',200,1,'SQL Query for col and row sizes in mem','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (132,35,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (135,36,'URL','Static','http://ip.jsontest.com/',100,1,'Url of reachable web service','URL','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (137,36,'OBJKEY','Static','ip',200,1,'The object key to display','Object Key','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (138,36,'TEXT1','Static','',300,1,'Text: The text displayed below the returned','Text','true',null,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (139,37,'URL','Static','https://api.github.com/users/paschmann',100,1,'Url of reachable web service','URL','true',null,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (140,38,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (141,38,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_CONNLIST',200,0,'SQL Query for connection list','SQL Query','false',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (143,39,'SQL1','SQL','SELECT MET236.12135MET2 as Lat, MET2-115.17021MET2 as Long, MET2Las VegasMET2 as Label, MET210MET2 as Value FROM DUMMY',200,0,'SQL Query for connection list','SQL Query','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (144,40,'Server Connection','Connection','Local Server',100,1,'Local Server','Server Connection','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (145,40,'SQL1','SQL','SELECT 92 as VALUE, MET2Sales IncreaseMET2 as Label FROM DUMMY',200,1,'SQL Query for connection list','SQL Query','true',null,1, 'VALUE');
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (146,40,'ICONURL','URL','',300,0,'Optional: The font awesome name of the Icon','Icon Name','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (147,41,'URL','Static','',100,1,'http://rss.cnn.com/rss/edition.rss','Feed URL','true', null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (148,41,'FEEDCOUNT','Static','',200,1,'4','Feed Count','true', null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (149,42,'URL','Static','http://scn.sap.com/resources/sbs_static/2406/developer-center-picture-5-transp.png',100,1,'Url of Image including HTTP','URL','true',null,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (151,43,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (150,43,'SQL1','SQL','SELECT 1 as min, 10 as max, 5 as value, MET2SpeedMET2 as Label, MET2Motor 1MET2 as Title FROM DUMMY',500,0,'SQL Statement for values, requires min, max, value, Label and Title','SQL Query','true',null,0, 'VALUE');

INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (153,44,'TimeZone','Static','',100,0,'Time Zone of Clock','Javascript TZ Code','false',null,0, null);

-- HANA Overview
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (170,45,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_HANAOVERVIEW',200,0,'SQL Query for details','SQL Query','false',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (171,45,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

-- Label Widget
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (172,46,'TEXT1','Static','',100,1,'Any form of Static Text','Text','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (173,46,'FONTSIZE','Static','',200,1,'Font size in px','Font Size','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (174,46,'FONTCOLOR','Static','',300,1,'Font color in Hex (e.g #333333)','Font Color','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (175,46,'FONTALIGN','Static','',400,1,'Font alignment (e.g left, center, right)','Font Alignment','true',null,0,null);

-- US State Map Widget
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (177,47,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (176,47,'SQL1','SQL','SELECT * FROM SALES.STATE_SALES',200,0,'SQL Query for details','SQL Query','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (178,47,'TEXT1','Static','',300,1,'Any form of Static Text','Text','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (179,47,'UOM1','OPTION',' ',400,0,'Optional, Unit of measure for the value','UOM','true',2,0, null);

-- Donut Chart
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (180,48,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (181,48,'SQL1','SQL','SELECT STATE_NAME as LABEL, SUM(VALUE) as VALUE FROM SALES.STATE_SALES GROUP BY STATE_NAME ORDER BY SUM(VALUE) DESC LIMIT 5',200,0,'SQL Query for details','SQL Query','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (182,48,'UOM1','OPTION',' ',400,0,'Optional, Unit of measure for the value','UOM','true',2,0, null);

-- Treemap
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (183,49,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (184,49,'SQL1','SQL','SELECT STATE_NAME as LABEL, SUM(VALUE) as VALUE FROM SALES.STATE_SALES GROUP BY STATE_NAME ORDER BY SUM(VALUE) DESC',200,0,'SQL Query for details','SQL Query','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (185,49,'GROUP','Static','',300,0,'Optional, Column name group for Treemap categories, should be returned by SQL','Grouping Column','true',2,0, null);

INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (1,'line','Line',1);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (2,'bar','Bar',1);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (3,'°F','°F',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (4,'°C','°C',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (5,'ms','ms',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (6,'s','s',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (7,'sec','sec',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (8,'min','min',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (9,'hr','hr',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (10,'ft','ft',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (11,'m','m',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (12,'localserver','Local Server',3);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (13,' ',' ',2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (14, '$', '$', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (15, '$M', '$M', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (16, 'Gal/Day', 'Gal/Day', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (17, 'l/Day', 'l/Day', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (18, 't/Day', 't/Day', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (19, 't/s', 't/s', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (20, 'kg/s', 'kg/s', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (21, 'lbs/s', 'lbs/s', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (22, 'mph', 'mph', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (23, 'km', 'km', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (24, 'ft/s', 'ft/s', 2);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (25, 'm/s', 'm/s', 2);


INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (1);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (2);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (3);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (4);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (5);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (6);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (7);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (8);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (9);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (10);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (11);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (11);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (12);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (13);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (14);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (15);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (16);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (17);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (18);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (19);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (20);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (21);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (22);
INSERT INTO "METRIC2"."M2_PAL_TS_FIXEDVALS" VALUES (23);
