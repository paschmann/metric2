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
