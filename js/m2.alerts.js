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
    getDataSet({
        strService: 'ClearAlert',
        strAlertID: alertID
    });	
}


function saveFeedEvent(strText, intIcon) {
    var strIcon = '';
    switch (intIcon) {
        case 0:
            strIcon = 'ok-icon-small';
            break;
        case 1:
            strIcon = 'info-icon-small';
            break;
        case 2:
            strIcon = 'warning-icon-small';
            break;
        default:
        case 3:
            strIcon = 'error-icon-small';
            break;
    }

    $.bootstrapGrowl(strText, {
          ele: 'body', // which element to append to
          type: 'success', // (null, 'info', 'danger', 'success')
          offset: {from: 'top', amount: 5}, // 'top', or 'bottom'
          align: 'center', // ('left', 'right', or 'center')
          width: 350, // (integer, or 'auto')
          delay: 2000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
          allow_dismiss: true, // If true then will display a cross to close the popup.
          stackup_spacing: 10 // spacing between consecutively stacked growls.
    });
    // Future: Append data to Event Feed Table (Right side menu)
}

function loadAlerts(objData){
    try{
    var strHTML = "";
	strHTML += "<div class='row' style='margin-top: 20px;'>";
        strHTML += "<div class='col-md-12'>"
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>User Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Dashboard</th><th>Widget Name</th><th>Status</th><th>Operator</th><th>Value</th><th>Notify</th><th>Alert Count</th><th>Modify</th><th>Clear</th></tr></thead><tbody>";
        var userAlerts = jQuery.parseJSON(objData.userAlerts);
        $.each(userAlerts, function(key, value) {
            if (userAlerts[key].STATUS === '1') { strStatus = 'Enabled'; strSetStatus = 'Disable'; intStatus = 0;} else { strStatus = 'Disabled'; strSetStatus = 'Enable'; intStatus = 1;}
            strHTML += "<tr><td>" + userAlerts[key].DASHBOARDTITLE + "</td><td>" + userAlerts[key].TITLE + "</td><td>" + strStatus + "</td><td>" + userAlerts[key].OPERATOR + "</td><td>" + userAlerts[key].VALUE + "</td><td>On-Screen</td><td><a href='#' id='alertID" + userAlerts[key].ALERTID + "' onclick='alertHistory(" + userAlerts[key].ALERTID + ");'>" + userAlerts[key].ALERTCOUNT + "</a></td><td><a href='#' onclick='setAlert(" + userAlerts[key].ALERTID + ", " + intStatus + ");'>" + strSetStatus + "</a> | <a href='#' onclick='editAlert(" + userAlerts[key].ALERTID + ");'>Edit Alert</a></td><td><a href='#' onclick='clearAlert(" + userAlerts[key].ALERTID + ");'>Clear History</a></td></tr>";
        });
        
        strHTML += "</tbody></table></div>";
        strHTML += "<div id='alerttable'>";
        strHTML += "<h1>System Alerts</h1>";
        strHTML += "<table class='table table-striped' style='margin-top: 20px;margin-bottom: 40px;'><thead><tr><th>Host</th><th>Rating</th><th>Last Check</th><th>Alert Details</th></tr></thead><tbody>";
        var systemAlerts = jQuery.parseJSON(objData.sysAlerts);
        $.each(systemAlerts, function(key, value) {
            strHTML += "<tr><td>" + systemAlerts[key].HOST + "</td><td>" + systemAlerts[key].ALERTRATING + "</td><td>" + systemAlerts[key].TIME + "</td><td>" + systemAlerts[key].ALERTDETAILS + "</td></tr>";
        });

        strHTML += "</tbody></table></div></div>";
     $("#grid").html(strHTML);
    } catch (err) {
        strHTML += "Error loading all Alerts";
        $("#grid").html(strHTML);
        console.log(err);
    }
}


function addNotification(strMsg, i) {
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