/* Step 1. Copy/Update/Create a custom function for your metric in js/m2.metrics.js */ 

function JSFunctionName(data) {
    //All parameter values will be parsed into this function in the data object based on the m2_widget_params defined above
    try {
        var html = "<div class='t1-widget-text-big'>" + data['Large Text Value'] + "</div>";
        html += "<div class='t1-widget-footer'>";
        html += "<div class='t1-widget-percent-medium-grey'>" + data['Footer Text Value'] + "</div>";
        html += "</div>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

/* Step 2. Copy/create/update any CSS in css/metrics.css. */
.t1-widget-text-big{
    font-size: 26px;
}

/* Step 3. Update each parameter and execute the SQL below. */
--WIDGET_ID ICON_URL TYPE CODE CODE_TYPE DESCRIPTION WIDGET_GROUP HIST_ENABLED DEF_HEIGHT DEF_WIDTH
INSERT INTO "METRIC2"."M2_WIDGET" VALUES (METRIC2.WIDGET_ID.NEXTVAL,'Metric Display Name', METRIC2.WIDGET_ID.CURRVAL || '.png','Query','JSFunctionName','Client','Description', 2, 2, 2, 2);

-- PARAM_ID, WIDGET_ID, NAME, TYPE, VALUE_DEFAULT, INDEX_NO, REQUIRED, PLACEHOLDER, DISPLAY_NAME, VISIBLE, OPTION_GROUP, HIST_ENABLED, HIST_DATAPOINT
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (METRIC2.WIDGET_PARAM_ID.NEXTVAL,METRIC2.WIDGET_ID.CURRVAL,'SQL1','SQL','SELECT * FROM METRIC2.M2_WIDGET_TOTAL_CPU, METRIC2.M2_WIDGET_SYS_MEM, METRIC2.M2_WIDGET_RUNNINGCONNETIONS, METRIC2.M2_WIDGET_DISTRIBUTED_VALUE,
METRIC2.M2_WIDGET_BLOCKEDTRANS, METRIC2.M2_WIDGET_CONNECTIONS, METRIC2.M2_WIDGET_INVALID_CONS, METRIC2.M2_WIDGET_DATADISK LIMIT 1',200,0,'SQL Query for details','SQL Query','true',null,0, null);
INSERT INTO "METRIC2"."M2_WIDGET_PARAM" VALUES (METRIC2.WIDGET_PARAM_ID.NEXTVAL,METRIC2.WIDGET_ID.CURRVAL,'Server Connection','OPTION','Local Server',100,1,'Local Server','Server Connection','true',3,0, null);

SELECT METRIC2.WIDGET_ID.CURRVAL FROM DUMMY;

/* Step 4. Create a screenshot or icon of your metric and upload it to the folder: lilabs/metric2/img/metrics/##.png (where ## is the Widget_ID). */