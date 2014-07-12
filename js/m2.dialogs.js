
// -------------------------   Dialog Functions ----------------------- //
	
function dialogConstructor(strDialogTitle, boolDeleteBtn, boolSaveBtn, strData, intSize, boolDisplay){
    if (boolDeleteBtn){
        $('#btnModalDelete').show();
    } else {
        $('#btnModalDelete').hide();
    }

    if (boolSaveBtn){
        $('#btnModalSave').show();
    } else {
        $('#btnModalSave').hide();
    }

    $('#modal-header').html(strDialogTitle);
    $('#dialogHTML1').html(strData);
            
    switch (intSize){
        case 1:
            //Small
            $('#modaldlg').css('height','auto');
            $('#modaldlg').css('width','600px');
            $('#dialogHTML1').css('height','auto');
            break;
        case 2:
            //Large
            $('#dialogHTML1').css('height','84%');
            $('#modaldlg').css('height','900px');
            $('#modaldlg').css('width','80%');
            break;
        case 3:
            //Wide
            $('#dialogHTML1').css('height','auto');
            $('#modaldlg').css('height','auto');
            $('#modaldlg').css('width','720px');
            break;
    }
            
    if (boolDisplay){
        $('#myModal').appendTo("body").modal('show');   
    }
}



		
function configureWidgetCarousel(){
    $('#widgetcarousel').carousel({
        interval: 4000
    })
                            
    $('.carousel .item').each(function(){
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));
                              
        if (next.next().length>0) {
            next.next().children(':first-child').clone().appendTo($(this));
        } else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });
}



function getNewWidgetHTML(objWidgets) {
    strCarousel = '<div id="widgetcarousel" class="carousel slide"><div class="carousel-inner">';
        
            
    for (var i = 0, len = objWidgets.length; i < len; ++i) {
        if (i === 0){
            strCarousel += '<div class="item active">';
        } else {
            strCarousel += '<div class="item">';
        }
            strCarousel += '<div class="col-md-4">';
            strCarousel += '<img src="img/metrics/' +  objWidgets[i].ICON_URL + '" alt="" style="width: 210px; height: 185px;" onClick="getDataSet({strService: \'NewWidgetDialog\', strWidgetID: \'' + objWidgets[i].WIDGET_ID + '\'});" />';
            strCarousel += '</div>';
        strCarousel += '</div>';
    }
    
    
    strCarousel += '<a class="carousel-control left" href="#widgetcarousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="carousel-control right" href="#widgetcarousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div>';
    strCarousel += '</div></div>';
    var elem = document.getElementById('metriccount');
    
    if (typeof elem !== 'undefined' && elem !== null) {
        elem.innerHTML = objWidgets.length + " Metrics";
    }
    
    var strHTML = '<table width="100%"><tr>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button1" class="inlinebuttons"><img src="img/add-widget-db.png" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 1});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button2" class="inlinebuttons"><img src="img/add-widget-custom.png" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 2});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button2" class="inlinebuttons"><img src="img/add-widget-services.png" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 7});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button3" class="inlinebuttons"><img src="img/add-widget-sensor.png" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 6});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button4" class="inlinebuttons"><img src="img/add-widget-platform.png" style="opacity:0.3;" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 3});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button5" class="inlinebuttons"><img src="img/add-widget-erp.png" style="opacity:0.3;" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 4});" /></div></td>';
    strHTML += '<td style="text-align: center; width: 14%;"><div id="button6" class="inlinebuttons"><img src="img/add-widget-crm.png" style="opacity:0.3;" onClick="getDataSet({ strService: \'GetWidgetTypes\', intWidgetGroup : 5});" /></div></td>';
    strHTML += '</tr></table><div id="carousel" style="margin-top:40px;">' + strCarousel + '</div><div id="metriccount" style="margin-top:20px; text-align: right;"></div>';
    return strHTML;
}




function showPred(dashboardwidgetid) {
    $("#dialogHTML1").innerHTML = '<img src="img/loaging.gif" />';
    getDataSet({ strService: 'WidgetForecastDialog', strDashboardWidgetID : dashboardwidgetid});
}

function showHist(dashboardwidgetid) {
    var startdt = typeof($("#startdt").val()) === 'undefined' ? getDate() : $("#startdt").val();
    var enddt = typeof($("#enddt").val()) === 'undefined' ? getDate() : $("#enddt").val();

    $("#dialogHTML1").innerHTML = '<img src="img/loaging.gif" />';
    getDataSet({ strService: 'WidgetHistoryDialog', strDashboardWidgetID : dashboardwidgetid, strStartDt: startdt, strEndDt: enddt});
}

function widgetHistoryChart(strData, dashboardwidgetid, startdt, enddt) {

    document.getElementById('dialogHTML1').innerHTML = '';
    var maxval = -1000000;
    var minval = 1000000;

    var arrData = JSON.parse(strData);

    startdt = startdt !== '' ? startdt : getDate();
    enddt = enddt !== '' ? enddt : getDate();

    var vals = [];
    for (var i = 0; i < arrData.length; ++i) {
        var date = new Date(arrData[i].YEAR, arrData[i].MONTH, arrData[i].DAY, arrData[i].HOUR, arrData[i].MIN, arrData[i].SECS, 1);
        vals.push({
            x: date,
            y: arrData[i].VALUE
        });
        maxval = parseFloat(arrData[i].VALUE) > maxval ? parseFloat(arrData[i].VALUE) : maxval;
        minval = parseFloat(arrData[i].VALUE) < minval ? parseFloat(arrData[i].VALUE) : minval;
    }

    nv.addGraph(function() {
        var data = [{
            "values": vals,
            "key": "Value",
            "color": "#5A92F9"
        }];
        var chart = nv.models.lineChart();

        chart.xAxis.axisLabel("Date & Time").tickFormat(function(d) {
            return d3.time.format("%H:%M:%S")(new Date(d))
        });
        //chart.yAxis.axisLabel("Amount").tickFormat(d3.format(","));

        $("#dialogHTML1 svg").remove();
        d3.select("#dialogHTML1").append("svg")
            .datum(data)
            .call(chart.forceY([minval, maxval]));
        $("#dialogHTML1").prepend("<table class='w-histchart-table'><tr><td class='w-histchart-td'>Start Date&nbsp;<input type='text' id='startdt' style='width: 100px;' value='" + startdt + "' />&nbsp;<img src='img/cal-icon.png' />&nbsp;&nbsp;&nbsp;End Date&nbsp;<input type='text'  style='width: 100px;' id='enddt' value='" + enddt + "' />&nbsp;<img src='img/cal-icon.png' /></td><td style='width: 1px; vertical-align: middle;'><img src='img/refresh-icon.png' onClick='showHist(" + dashboardwidgetid + ");' /></td><td style='text-align: center; width: 300px;'><img src='img/rowcount-icon.png' /> " + arrData.length + "</td><td style='text-align: right;'><img src='img/forecast-icon-small.png' onClick='showPred(" + dashboardwidgetid + ");' />&nbsp;Forecast</td></tr></table>");
        return chart;
    });

}

function widgetForecastChart(strData, dashboardwidgetid) {
    var d = new Date();
    document.getElementById('dialogHTML1').innerHTML = '';
    var maxval = -1000000;
    var minval = 1000000;

    var arrData = JSON.parse(strData);

    var vals = [];
    for (var i = 0; i < arrData.length; ++i) {
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDay(), arrData[i].ID, 00, 00, 1);
        vals.push({
            x: date,
            y: arrData[i].VALUE
        });
        maxval = parseFloat(arrData[i].VALUE) > maxval ? parseFloat(arrData[i].VALUE) : maxval;
        minval = parseFloat(arrData[i].VALUE) < minval ? parseFloat(arrData[i].VALUE) : minval;
    }

    nv.addGraph(function() {
        var data = [{
            "values": vals,
            "key": "Value",
            "color": "#5A92F9"
        }];
        
        chart.xAxis.axisLabel("Date & Time").tickFormat(function(d) {
            return d3.time.format("%H:%M:%S")(new Date(d));
        });
        
        $("#dialogHTML1 svg").remove();
        d3.select("#dialogHTML1").append("svg")
            .datum(data)
            .call(chart.forceY([minval, maxval]));
        $("#dialogHTML1").prepend("<table style='text-align: left;' class='w-histchart-table'><tr><td></td><td style='text-align: right;'><img src='img/history-icon-small.png'  onClick='showHist(" + dashboardwidgetid + ");'>&nbsp;History</td></tr></table>");
        return chart;
    });

}



function alertHistory(alertid) {
    getDataSet({ strService: 'AlertHistoryDialog', strAlertID: alertid});
}

function alertHistoryTable(displaytype) {

    document.getElementById('dialogHTML1').innerHTML = strHistoryTable;

    if (displaytype == 1) {
        $('#table2 td').wrapInner('<span/>').graphup({
            colorMap: 'burn',
            callBeforePaint: function() {
                // Make opacity match the percentage
                $('span', this).css('opacity', this.data('percent') / 100);
            }
        });
    } else if (displaytype == 2) {
        $('#table2 td').graphup({
            painter: 'bubbles',
            bubblesDiameter: 80, // px
            callBeforePaint: function() {
                // Hide all values under 50%
                if (this.data('percent') < 50) {
                    this.text('');
                }
            }
        });
    } else if (displaytype == 3) {
        $('#table2 td').graphup({
            painter: 'bars',
            barsAlign: 'hcenter'
        });
    }
}

function saveDialog(strFunction) {
    var refreshrate = 0;
    var strSQL = '';
    if (strFunction == 'New Widget') {
        var paramCount = 0;
        refreshrate = document.getElementById('refreshrate').value;
        if (refreshrate === '') refreshrate = 0;
        
        getDataSet({
            strService: "Insert",
            strSQL: "Insert into metric2.m2_dashboard_widget (dashboard_widget_id, dashboard_id, widget_id, title, width, height, row_pos, col_pos, refresh_rate) VALUES (metric2.dashboard_widget_id.NEXTVAL, " + intCurrentDashboardID + ", " + document.getElementById('widgetid').value + ",'" + document.getElementById('widgettitle').value + "'," + document.getElementById('widgetwidth').value + "," + document.getElementById('widgetheight').value + ",1,1," + refreshrate + ")"
        })
        paramCount = $("[id^=pid_]").size();
        setTimeout(function() {
            //Once we have inserted the widget, then loop and do each param, give HANA time to insert to avoid issue
            $("[id^=pid_]").each(function() {
                var val = replaceAll("'", "MET2", this.value);
                val = replaceAll("%", "MET3", val);
                val = encodeURIComponent(val);
                getDataSet({
                    strService: "Insert",
                    strSQL: "Insert into metric2.m2_dashboard_widget_params (dashboard_widget_param_id, dashboard_widget_id, param_id, value, widget_id, dt_added) VALUES (metric2.dashboard_widget_param_id.NEXTVAL, (SELECT TOP 1 dashboard_widget_id FROM metric2.m2_dashboard_widget ORDER BY dashboard_widget_id desc)," + this.id.substring(4) + ", '" + val + "'," + document.getElementById('widgetid').value + ", current_utcdate);",
                    strReload: "dashboard"
                })
            });
            /*
            getDataSet({
                strService: "Insert",
                strSQL : strSQL
            })
            */
        }, 1000);
        
        getContent(intCurrentDashboardID);
    } else if (strFunction == 'Edit Widget') {
        refreshrate = document.getElementById('refreshrate').value;
        var updateStatements = '';
        if (refreshrate === '') refreshrate = 0;

        $("[id^=pid_]").each(function() {
            var val = replaceAll("'", "MET2", this.value);
            val = replaceAll("%", "MET3", val);
            val = encodeURIComponent(val);
            updateStatements += "UPDATE metric2.m2_dashboard_widget_params SET value = '" + val + "' WHERE dashboard_widget_id =" + document.getElementById('dashboardwidgetid').value + " AND param_id =" + this.id.substring(4) + ";";
        });
        
        getDataSet({
            strService: "Update",
            strSQL: updateStatements
        })
        
        getDataSet({
            strService: "Update",
            strSQL: "UPDATE metric2.m2_dashboard_widget SET width =" + document.getElementById('widgetwidth').value + ", height =" + document.getElementById('widgetheight').value + ", refresh_rate = " + refreshrate + ", title = '" + document.getElementById('widgettitle').value + "' WHERE dashboard_widget_id =" + document.getElementById('dashboardwidgetid').value,
            strReload: "dashboard"
        })
    } else if (strFunction == 'Add Dashboard') {
        getDataSet({
            strService: "CreateDashboard",
            strSQL: "Insert into metric2.m2_dashboard (dashboard_id, title, subtitle, user_id) VALUES (metric2.dashboard_id.NEXTVAL, '" + document.getElementById('dashboardtitle').value + "', '',999)",
            strReload: "dashboards", 
            strMisc: document.getElementById('dashboardtitle').value
        })
    } else if (strFunction == 'Edit Dashboard') {
        getDataSet({
            strService: "UpdateDashboard",
            strSQL: "Update metric2.m2_dashboard SET title = '" + document.getElementById('dashboardtitle').value + "', subtitle = '' WHERE dashboard_id =" + document.getElementById('dashboardid').value,
            strReload: "dashboards"
        })
        $('#dashboardname').html('<a href="#">' + document.getElementById('dashboardtitle').value + '</a>');
    } else if (strFunction == 'Add Alert') {
        getDataSet({
            strService: "CreateAlert",
            strSQL: "Insert into metric2.m2_alert (alert_id, dashboard_widget_id, cond, operator, value, notify, created_on, user_id) VALUES (metric2.alert_id.NEXTVAL, " + document.getElementById('widgetid').value + ", '" + document.getElementById('condition').value + "', '" + document.getElementById('operator').value + "','" + document.getElementById('value').value + "', '" + document.getElementById('notify').value + "', current_timestamp, 999)",
            strReload: "alerts"
        })
    } else if (strFunction == 'Edit Alert') {
        getDataSet({
            strService: "Update",
            strSQL: "Update metric2.m2_alert SET cond = '" + document.getElementById('condition').value + "', operator = '" + document.getElementById('operator').value + "', value = '" + document.getElementById('value').value + "', notify = '" + document.getElementById('notify').value + "' WHERE alert_id = " + document.getElementById('alertid').value,
            strReload: "alerts"
        })
    } else {
        console.log("No Function Defined Yet");
    }
    $('#myModal').modal('hide');
}

function deleteDialog(strFunction) {
    if (strFunction == 'Edit Dashboard') {
        getDataSet({
            strService: "CallSP",
            strSQL: "CALL METRIC2.M2_P_DELETE_DASHBOARD(" + intCurrentDashboardID + ")",
            strReload: 'dashboards'
        })
        saveFeedEvent("Dashboard deleted", 3);
    } else if (strFunction == 'Edit Widget') {
       var dashboardwidgetid = document.getElementById('dashboardwidgetid').value;
       getDataSet({
            strService: 'CallSP', 
            strSQL: "CALL METRIC2.M2_P_DELETE_WIDGET(" + dashboardwidgetid + ")",
            strReload: 'dashboard'
        });
        saveFeedEvent("Metric deleted", 3);
    } else if (strFunction == 'Edit Alert') {
        var alertID = document.getElementById('alertid').value;
        getDataSet({
            strService: 'DeleteAlert',
            strAlertID: alertID
        });
    }
}