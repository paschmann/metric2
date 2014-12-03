function addAlert(){
    getDataSet({
        strService: 'AddAlert'
    });
}
            
function setAlert(alertID, strStatus){
    getDataSet({
        strService: 'SetAlert',
        strAlertID: alertID,
        intAlertStatus: strStatus
    });
}
		
function editAlert(alertID){
    getDataSet({
        strService: 'EditAlert',
        strAlertID: alertID
    });
}
			
function clearAlert(alertID){
    $('#myModal').modal('hide');
    getDataSet({
        strService: 'ClearAlert',
        strAlertID: alertID
    });
}

function loadAlerts(objData){
    try{
        var strHTML = "";
        var userAlerts = jQuery.parseJSON(objData.userAlerts);
        var arrAlertData = [];
        if (userAlerts.length > 0){
            strHTML += "<div class='row' style='margin-top: 60px;'>";
                strHTML += "<div class='col-md-5 col-md-offset-1'>";
                    strHTML += "<div id='statusChart' style='min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto'></div>";
                        strHTML += "<h4 style='text-align: center; margin-top: 20px;'>Alert count by type</h4>";
                        strHTML += "<span class='text-muted'></span>";
                strHTML += "</div>";
                strHTML += "<div class='col-md-5'>";
                        strHTML += "<div id='monthChart' style='min-width: 310px; height: 400px; margin: 0 auto'></div>";
                        strHTML += "<h4 style='text-align: center; margin-top: 20px;'>Alerts by month</h4>";
                        strHTML += "<span class='text-muted'></span>";
                strHTML += "</div>";
            strHTML += "</div>";
            
        	strHTML += "<div class='row' style='margin-top: 60px;'>";
                strHTML += "<div class='col-md-12'>"
                strHTML += "<div id='alerttable'>";
                strHTML += "<h1>User Alerts</h1>";
                    strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Dashboard</th><th>Name</th><th>Trigger</th><th>Status</th><th>Action</th><th>Alert Count</th><th>Last Triggered</th><th>Next Check</th></tr></thead><tbody>";
                    $.each(userAlerts, function(key, value) {
                        if (userAlerts[key].STATUS === '1') { strStatus = 'Enabled'; strSetStatus = 'Disable'; intStatus = 0;} else { strStatus = 'Disabled'; strSetStatus = 'Enable'; intStatus = 1;}
                        var notify = userAlerts[key].NOTIFY === '' ? 'Display' : userAlerts[key].NOTIFY;
                        var lasttriggered = userAlerts[key].LASTTRIGGERED === 'null' ? '-' : userAlerts[key].LASTTRIGGERED;
                        var nextcheck = ''; //Timeago function
                        strHTML += "<tr><td>" + userAlerts[key].DASHBOARDTITLE + "</td><td><a href='#' onclick='editAlert(" + userAlerts[key].ALERTID + ");'>" + userAlerts[key].TITLE + "</a></td><td>" + userAlerts[key].OPERATOR + " " + userAlerts[key].VALUE + "</td><td><a href='#' title='Click this link to stop, or start, this alert from being triggered' onclick='setAlert(" + userAlerts[key].ALERTID + ", " + intStatus + ");'>" + strStatus + "</a></td><td>" + notify + "</td><td><a href='#' id='alertID" + userAlerts[key].ALERTID + "' onclick='alertHistory(" + userAlerts[key].ALERTID + ");'>" + userAlerts[key].ALERTCOUNT + "</a></td><td>" + lasttriggered + "</td><td>" + nextcheck + "</td></tr>";
                        var arrTmp = [];
                        arrTmp.push(userAlerts[key].TITLE);
                        arrTmp.push(parseInt(userAlerts[key].ALERTCOUNT));
                        arrAlertData.push(arrTmp);
                    });
                    strHTML += "</tbody></table></div>";
            
            var userAlertStats = jQuery.parseJSON(objData.userAlertsStats);
            var arrMonthData = [];
            var arrMonthNames = [];
            
            for (var i = 1; i <= 12; i++){
                var found = false;
                for (var t = 0; t <= 11; t++){
                    try{
                        if (userAlertStats[t].MONTH === i.toString()){
                            arrMonthData.push(parseInt(userAlertStats[t].ALERTCOUNT));
                            arrMonthNames.push(month[userAlertStats[t].MONTH]);
                            found = true;
                        }
                    } catch (e) {
                        
                    }
                }
                if (!found){
                    //arrMonthData.push(0);
                }
            }
        }
            
        var systemAlerts = jQuery.parseJSON(objData.sysAlerts);
        if (systemAlerts.length > 0){
            strHTML += "<div id='alerttable'>";
            strHTML += "<h1>System Alerts</h1>";
            strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Host</th><th>Rating</th><th>Alert Details</th><th>Last Check</th></tr></thead><tbody>";
            $.each(systemAlerts, function(key, value) {
                strHTML += "<tr><td>" + systemAlerts[key].HOST + "</td><td>" + systemAlerts[key].ALERTRATING + "</td><td>" + systemAlerts[key].ALERTDETAILS + "</td><td>" + systemAlerts[key].TIME + "</td></tr>";
            });
            
            strHTML += "</tbody></table></div></div>";
        }
        $("#grid").html(strHTML);
        
        loadEventStatusPie(arrAlertData);
        loadEventsbyMonth(arrMonthData, arrMonthNames);
    
    } catch (err) {
        $("#grid").html(strHTML);
        console.log(err);
    }
}


function loadEventStatusPie(arrData){
    $('#statusChart').highcharts({
            chart: {
                plotShadow: false,
                backgroundColor: null
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y:.0f}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Events',
            innerSize: '50%',
            data: arrData
        }]
    });
}

function loadEventsbyMonth(arrData, arrMonthNames){
    $('#monthChart').highcharts({
        chart: {
            type: 'column',
            backgroundColor: null
        },
        credits: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            categories: arrMonthNames
        },
        yAxis: {
            min: 0,
            title: {
            text: 'Event count'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Triggered',
            data: arrData
    }]
    });
}



function addNotification(strMsg, i, display) {
    var type = '';
    switch (i) {
        case 0:
            type = 'success';
            break;
        case 1:
            type = 'info';
            break;
        case 2:
            type = 'danger';
            break;
        case 3:
            type = 'danger';
            break;
        default:
            type = null;
            break;
    }
    
    if (display) {
        $.bootstrapGrowl(strMsg, {
              ele: 'body', // which element to append to
              type: type, // (null, 'info', 'danger', 'success')
              offset: {from: 'top', amount: 5}, // 'top', or 'bottom'
              align: 'center', // ('left', 'right', or 'center')
              width: 350, // (integer, or 'auto')
              delay: 2000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
              allow_dismiss: true, // If true then will display a cross to close the popup.
              stackup_spacing: 10 // spacing between consecutively stacked growls.
        });
    }
    
    var objAlert = [];
    objAlert.msg = strMsg;
    objAlert.type = i;
    objAlert.timestamp = Date.now();
    
    alertlist.unshift(objAlert);
}