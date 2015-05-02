INSERT INTO "METRIC2"."M2_WIDGET" VALUES (53,'Gateway List','53.png','Service','widgetGatewayList','Client','A Table of list data from a Gateway Data Source',4,0,null,null);

-- 53. Gateway List
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (199,53,'USERNAME','Static','',100,1,'Required, Gateway Username','Gateway Username','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (200,53,'PASSWORD','Static','',200,1,'Required, Gateway Password','Gateway Password','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (201,53,'SERVER','Static','',300,1,'Required, Gateway Server URL','Gateway Server URL','true',null,0,null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (202,53,'SERVICE','OPTION',' ',400,0,'Required, Gateway Service','Gateway Data Source','true',7,0, null);


INSERT INTO "METRIC2"."M2_WIDGET_PARAM_OPTIONS" VALUES (34, '/sap/public/ping', 'Gateway Ping', 7);
