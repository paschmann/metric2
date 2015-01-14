// -------------------------   Dialog Functions ----------------------- //
	
function dialogConstructor(strDialogTitle, boolDeleteBtn, boolSaveBtn, strData, intSize, boolDisplay, boolCloneBtn, boolDeleteHistoryBtn){
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
    
    if (boolCloneBtn){
        $('#btnModalClone').show();
    } else {
        $('#btnModalClone').hide();
    }
    
    if (boolDeleteHistoryBtn){
        $('#btnModalDeleteHistory').show();
    } else {
        $('#btnModalDeleteHistory').hide();
    }

    $('#modal-header').html(strDialogTitle);
    $('#dialogHTML1').html(strData);
    $('#dialogMsg1').html('');
            
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
            $('#modaldlg').css('width','820px');
            break;
    }
            
    if (boolDisplay){
        $('#myModal').appendTo("body").modal('show');
        $('#dialogMsg1').html('');
    }
    
    $('#myModal').on('shown.bs.modal', function (e) {
        if (strDialogTitle == "Widget History"){
            chart.update();
        }
    });
}

function loadAlertList(){
    $('#myAlertModal').appendTo('body').modal('show');
    $('#alertdialoglist').html('');
    
    var maxlist = 0;
    if (alertlist.length > 5){
        maxlist = 5;
    } else {
        maxlist = alertlist.length;
    }
    
    for (i = 0; i <= maxlist - 1; i++){
        var objAlert = alertlist[i];
        var type = '';
        switch (objAlert.type) {
            case 0:
                note = 'Success';
                type = 'fa-check';
                break;
            case 1:
                note = 'Information';
                type = 'fa-exclamation-triangle';
                break;
            case 2:
                note = 'Error';
                type = 'fa-times';
                break;
            case 3:
                note = 'Error';
                type = 'fa-times';
                break;
            default:
                type = null;
                break;
        }
        var html = '<li><section class="thumbnail-in"><div class="widget-im-tools tooltip-area pull-right"><span>';
        html += '<time class="timeago lasted" title="when you opened the page">' + jQuery.timeago(objAlert.timestamp) + '</time>';
        html += '</span></div>';
        html += '<h4 onclick="loadAlertScreen();">' +  note + '</h4>';
        html += '<div class="im-thumbnail bg-theme-inverse"><i class="fa ' + type + ' notification-background-' + note + '""></i></div>';
        html += '<div class="pre-text">' + objAlert.msg + '</div></section></li>';
        $('#alertdialoglist').append(html);
    }
}

function showNewWidgetDialog(intWidgetGroup){
    var strHTML = '<div class="row">';
        strHTML += '<div class="col-md-2">';
            strHTML += '<div class="list-group">';
                strHTML += '<a href="#" class="list-group-item" data-id="0"><input type="text" class="form-control" id="searchmetrics" placeholder="Search"></a>';
                strHTML += '<a href="#" class="list-group-item active" data-id="0">All</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="1">SAP HANA</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="2">Custom</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="7">Web Services</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="6">IoT and Sensors</a>';
                strHTML += '<a href="#" class="list-group-item disabled" data-id="3">SAP HANA Cloud</a>';
                strHTML += '<a href="#" class="list-group-item disabled" data-id="4">SAP ERP</a>';
                strHTML += '<a href="#" class="list-group-item disabled" data-id="5">SAP CRM</a>';
            strHTML += '</div>';
        strHTML += '</div>';
        strHTML += '<div class="col-md-10" style="overflow-y:scroll; max-height: 740px;" id="metriclist"></div>';
    strHTML += '</div>';
    
    dialogConstructor("Select a Metric", false, false, strHTML, 2, true, false);
    
    loadNewWidgetList(intWidgetGroup, '');
}

function loadNewWidgetList(intWidgetGroup, strSearchTerm){
    var strMetrics = '';
    
    for (var i = 0, len = objWidgetList.length; i < len; ++i) {
        if ((intWidgetGroup === parseInt(objWidgetList[i].WIDGET_GROUP) || intWidgetGroup === 0 && strSearchTerm === '') || (intWidgetGroup === 0 && strSearchTerm !== '' && (objWidgetList[i].NAME.indexOf(strSearchTerm) > 0 || objWidgetList[i].DESCRIPTION.indexOf(strSearchTerm) > 0))) {
            strMetrics += '<div class="col-md-4" style="cursor: pointer; height: 196px; margin-bottom: 20px;" onClick="getDataSet({strService: \'NewWidgetDialog\', strWidgetID: \'' + objWidgetList[i].WIDGET_ID + '\'});">';
                strMetrics += '<div class="thumbnail" style="height: 100%;">'
                strMetrics += '<div class="col-md-6"><img src="img/metrics/' +  objWidgetList[i].ICON_URL + '" class="img-responsive" /></div>';
                strMetrics += '<div class="caption col-md-6">';
                    strMetrics += '<h4>' + objWidgetList[i].NAME + '</h4>';
                    strMetrics += '<p>' + objWidgetList[i].DESCRIPTION + '</p>';
                strMetrics += '</div>';
                strMetrics += '</div>';
            strMetrics += ' </div>';
        }
    }
    
    if (intWidgetGroup === 3 || intWidgetGroup === 4 || intWidgetGroup === 5){
        strMetrics += '<p align="center">Please check <a href="http://www.metric2.com" target="_blank">http://www.metric2.com</a> for new metric packs as we are frequently updating and adding new metrics.</p>';
    }
    
    var elem = $('#metriccount');
    
    if (typeof elem !== 'undefined' && elem !== null) {
        elem.innerHTML = objWidgetList.length + " Metrics";
    }
    
    $('#metriclist').html(strMetrics);
}

function showPred(dashboardwidgetid) {
    $("#dialogHTML1").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    getDataSet({ strService: 'WidgetForecastDialog', strDashboardWidgetID : dashboardwidgetid});
}

function showHist(dashboardwidgetid) {
    var startdt = typeof($("#startdt").val()) === 'undefined' ? getDate() : $("#startdt").val();
    var enddt = typeof($("#enddt").val()) === 'undefined' ? getDate() : $("#enddt").val();

    $("#dialogHTML1").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    getDataSet({ strService: 'WidgetHistoryDialog', strDashboardWidgetID : dashboardwidgetid, strStartDt: startdt, strEndDt: enddt});
}

function widgetHistoryChart(strData, dashboardwidgetid, startdt, enddt) {
    dialogConstructor("Widget History", true, false, null, 2, false, false);
                
    $('#dialogHTML1').innerHTML = '';
    var maxval = -1000000;
    var minval = 1000000;

    var arrData = JSON.parse(strData);

    startdt = startdt !== '' ? startdt : getDate();
    enddt = enddt !== '' ? enddt : getDate();

    var vals = [];
    for (var i = 0; i < arrData.length; ++i) {
        var date = new Date(arrData[i].YEAR, arrData[i].MONTH - 1, arrData[i].DAY, arrData[i].HOUR, arrData[i].MIN, arrData[i].SECS, 1);
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
            return d3.time.format("%m/%d %H:%M")(new Date(d));
        });
        
        $("#dialogHTML1 svg").remove();
        d3.select("#dialogHTML1").append("svg")
            .datum(data)
            .call(chart.forceY([minval, maxval]));
        $("#dialogHTML1").prepend("<table class='w-histchart-table'><tr><td class='w-histchart-td'>Start Date&nbsp;<input type='text' id='startdt' style='width: 100px;' value='" + startdt + "' />&nbsp;&nbsp;&nbsp;End Date&nbsp;<input type='text'  style='width: 100px;' id='enddt' value='" + enddt + "' /><span id='btnSearchHist' style='font-size: 20px; margin-left: 10px;' class='glyphicon glyphicon-search' onClick='showHist(" + dashboardwidgetid + ");' /></span></td><td style='width: 1px; vertical-align: middle;'></td><td style='text-align: center; width: 300px;'><span style='font-size: 20px;' class='glyphicon glyphicon-list'></span> " + arrData.length + " Records</td><td style='text-align: right;'><button type='button' class='btn btn-default btn-med' id='btnShowPred' onClick='showPred(" + dashboardwidgetid + ");' ><span style='font-size: 20px; margin-right: 10px;' class='glyphicon glyphicon-road'/>Predictive Forecast</span></button></td></tr></table>");
        $("#dialogHTML1").append("<input type='hidden' id='dashboardwidgetid' value='" + dashboardwidgetid + "' />");
        $('#startdt').datepicker();
        $('#enddt').datepicker({autoclose: true});
        
        return chart;
    });
    
    $('#myModal').appendTo("body").modal('show');
    $('#modal-header').html($('#widget-header' + dashboardwidgetid).text() + ' History');
}

function widgetForecastChart(strData, dashboardwidgetid) {
    dialogConstructor("Widget Forecast (Avg/h)", false, false, null, 2, true, false);
    $('#modal-header').html($('#widget-header' + dashboardwidgetid).text() + ' Forecast (Avg/h)');
    
    var d = new Date();
    $('#dialogHTML1').innerHTML = '';
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
            "key": "Forecasted Value",
            "color": "#5A92F9"
        }];
        
        chart.xAxis.axisLabel("Date & Time").tickFormat(function(d) {
            return d3.time.format("%m/%d %H:%M")(new Date(d));
        });
        
        $("#dialogHTML1 svg").remove();
        d3.select("#dialogHTML1").append("svg")
            .datum(data)
            .call(chart.forceY([minval, maxval]));
        $("#dialogHTML1").prepend("<table style='text-align: left;' class='w-histchart-table'><tr><td></td><td style='text-align: right;'><button type='button' class='btn btn-default btn-med' onClick='showHist(" + dashboardwidgetid + ");' ><span style='font-size: 20px; margin-right: 10px;' class='glyphicon glyphicon-road'/>History</span></button></td></tr></table>");
        return chart;
    });
}

function showSettingsDialog(objData) {
    var output = "<form class='form-horizontal'>";
    output += "<input type='" + debugmode + "' value = '" + objData[0].USER_ID + "' id='userid' />";
    output += "<div class='form-group'><label for='domain' class='col-sm-3 control-label'>User Domain</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Domain Name' id='domain' value = '" + objData[0].EMAIL_DOMAIN + "' /></div></div>";
    output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>App Version</label><div class='col-sm-9'><p class='form-control-static'>" + m2version + "</p></div></div>";
    
    dialogConstructor("Edit Settings", false, true, output, 1, true, false);
}



function showWidgetDialog(objData, edit){
    var output = '';
    var webserviceparamid = '';
    
    output += "<form class='form-horizontal' role='form'>";
        output += "<input type='" + debugmode + "' value='newwidget' id='action' />";
        output += "<input type='" + debugmode + "' value='" + intCurrentDashboardID + "' id='dashboardid' />";
        output += "<input type='" + debugmode + "' value='" + objData.widgetid + "' id='widgetid' />";
        output += "<input type='" + debugmode + "' value='" + objData.dashboardwidgetid + "' id='dashboardwidgetid' />";
        output += "<div class='form-group'><label class='col-sm-3 control-label'>Metric Type</label><div class='col-sm-9'>" + objData.widgetname + "</div></div>";
        output += "<div class='form-group'><label for='widgettitle' class='col-sm-3 col-sm-3 control-label'>Title</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='Title' id='widgettitle' value = '" + objData.widgettitle + "' /></div></div>";
	
        output += "<div class='form-group'><label for='widgetwidth' class='col-sm-3 control-label'>Width</label><div class='col-sm-9'><select class='form-control' id='widgetwidth' style='width: 100px;'";
        output += objData.defaultwidgetwidth ? ' disabled ' : '';
        output += ">" + showWidgetSizeDropdown(objData.widgetwidth) + "</select></div></div>";
    
        output += "<div class='form-group'><label for='widgetheight' class='col-sm-3 control-label'>Height</label><div class='col-sm-9'><select class='form-control' id='widgetheight' style='width: 100px;'";
        output += objData.defaultwidgetheight ? ' disabled ' : '';
        output += ">" + showWidgetSizeDropdown(objData.widgetheight) + "</select></div></div>";
	
	output += "<div class='form-group'><label for='refreshrate' class='col-sm-3 control-label'>Refresh Rate</label><div class='col-sm-4'><div class='input-group'><input class='form-control' type='text' placeholder='0' id='refreshrate' value = '" + objData.widgetrefresh + "'><div class='input-group-addon'>Seconds</div></div></div></div>";
	
	for (var i = 0; i <= objData.param.length - 1; i++){
        var required = '';
        var value = objData.param[i].setvalue;
        if (objData.param[i].required == '1'){
            required = 'required="true"';
        }
        
        if (objData.param[i].visible == 'true'){
			output += "<div class='form-group'>";
            output += "<label for='pid_" + objData.param[i].paramid + "' class='col-sm-3 control-label'>" + objData.param[i].displayname + "</label>";
                output += "<div class='col-sm-9'>";
                if (objData.param[i].type == 'OPTION'){
                    output += "<select class='form-control' id='pid_" + objData.param[i].paramid + "'>" + showParamOption('', value, objData.param[i].options) + "</select>";
                } else {
                    var inputcontrol = "<input class='form-control' type='text' " + required + "  value='" + value + "' placeholder='" + objData.param[i].placeholder + "' id='pid_" + objData.param[i].paramid + "' />";
                    if (objData.param[i].displayname.indexOf("QL") > 0){
                        output += "<div class='input-group'>" + inputcontrol + " <span class='input-group-addon' id='btnShowSQLBuilder'><i class='fa fa-table'></i></span></div>";
                    } else if (objData.param[i].displayname.indexOf("RL") > 0){
                        output += "<div class='input-group'>" + inputcontrol + " <span class='input-group-addon' id='btnShowWSBuilder'><i class='fa fa-file-code-o'></i></span></div>";
                    } else {
                        output += inputcontrol;
                    }
                }
                output += "</div>";
			output += "</div>";
		} else {
            output += "<input class='form-control' type='" + debugmode + "' value='" + value + "' placeholder='" + objData.param[i].placeholder + "' id='pid_" + objData.param[i].paramid + "' />";    
		}
    }

	
	if (objData.type == 'WebService'){
		var serviceurl = 'lib/api.xsjs?service=SaveDataPoint&dashboardwidgetparamid=' + objData.dashboardwidgetparamid + '&datapoint=0';
		output += "<div class='form-group'><label for='pid_serviceurl'  class='col-sm-3 control-label'>API Url</label><div class='col-sm-9'><a href='" + serviceurl + "'>" + serviceurl + "</div></div>";
	}
    output += "</form>";
    
    if (edit){
        dialogConstructor("Edit Metric", true, true, output, 1, true, true);
    } else {
        dialogConstructor("New Metric", false, true, output, 3, true, false);
    }
}


function showWidgetSizeDropdown(selected){
	var output = '';
	output += selected == 1 ? "<option selected>1</option>" : "<option>1</option>";
	output += selected == 2 ? "<option selected>2</option>" : "<option>2</option>";
	output += selected == 3 ? "<option selected>3</option>" : "<option>3</option>";
	output += selected == 4 ? "<option selected>4</option>" : "<option>4</option>";
	output += selected == 5 ? "<option selected>5</option>" : "<option>5</option>";	
	output += selected == 6 ? "<option selected>6</option>" : "<option>6</option>";	
	output += selected == 7 ? "<option selected>7</option>" : "<option>7</option>";	
	return output;
}

function showParamOption(optiongroup, value, objData){
	var strHTML = '';
	for (var i = 0; i <= objData.length - 1; i++){
		var selected = objData[i].value == value ? ' selected ' : '';
		strHTML += "<option value = '" + objData[i].value + "'" + selected + ">" + objData[i].display + "</option>";
	}
	return strHTML;
}



function showAlertHistoryDialog(arrData){
    var alertid = arrData[0];
    var strSQL = "SELECT * FROM METRIC2.M2_ALERT_HISTORY WHERE ALERT_ID = " + alertid + " ORDER BY ADDED DESC LIMIT 100";
    var strHTML = "<table class='w-histchart-table'><tr><td style='text-align: right;'>";
	strHTML += "<img src='img/hist-icon-table.png' class='alert-menu-img' onClick='alertHistoryTable(1);' />";
	strHTML += "<img src='img/hist-icon-bubble.png' class='alert-menu-img' onClick='alertHistoryTable(2);' />";
	strHTML += "<img src='img/hist-icon-expand.png' class='alert-menu-img' onClick='alertHistoryTable(3);' />";
	strHTML += "<img src='img/hist-icon-data.png' class='alert-menu-img' onClick='showSQLBuilder(&quot;" + strSQL + "&quot;, &quot;Single Value&quot;, &quot;&quot;, &quot;&quot;);' />";
	strHTML += "</td></tr></table>";
	strHTML += "<div id='alerttable' style='margin-left: 0px;'>";
		strHTML += "<table class='table table-striped' id='table2'>";
			strHTML += "<thead><tr><th>Hour</th><th style='text-align: center;'>Monday</th><th style='text-align: center;'>Tuesday</th><th style='text-align: center;'>Wednesday</th>";
			strHTML += "<th style='text-align: center;'>Thursday</th><th style='text-align: center;'>Friday</th><th style='text-align: center;'>Saturday</th><th style='text-align: center;'>Sunday</th></tr></thead><tbody>";
				var hour = 0;
				var rowcount = 0;
				var daycounter = 1;
				for (var i = 1; i <= arrData.length - 1; i++){
                    if (daycounter == 1){
                        strHTML += "<tr><th scope='row'>" + rowcount + ":00 - " + (rowcount + 2) + ":00</th>";
                        rowcount = rowcount + 2;
                    }
					strHTML += "<td style='text-align: center;'>" + arrData[i] + "</td>";

                    if (daycounter == 7){
                        strHTML += "</tr>";
                        daycounter = 1;
                    } else {
                        daycounter ++;
                    }
				}
			strHTML += "</tbody>";
		strHTML += "</table>";
		strHTML += "<input type='hidden' id='alertid' value='" + alertid + "' />"; //Used for deleting the history via the button
	strHTML += "</div>";
	
	dialogConstructor("Alert History", false, false, strHTML, 2, true, false, true);
    strHistoryTable = strHTML;
    alertHistoryTable(1);
}





function showProfileDialog(objData){
    var output = "<form class='form-horizontal'>";
    output += "<input type='" + debugmode + "' value = '" + objData[0].USER_ID + "' id='userid' name='userid'/>";
    output += "<input type='" + debugmode + "' value = 'UpdateUser' name='service' id='service' />";
	output += "<div class='form-group'><label for='name' class='col-sm-3 control-label'>Name:</label><div class='col-sm-5'><input type='text' class='form-control' placeholder='First name' id='name' name='name' value = '" + objData[0].NAME + "' /></div></div>";
	output += "<div class='form-group'><label for='lname' class='col-sm-3 control-label'>Last Name:</label><div class='col-sm-5'><input type='text' class='form-control' required='true' placeholder='Last name' name='lname'  id='lname' value = '" + objData[0].LNAME + "' /></div></div>";
	output += "<div class='form-group'><label for='email' class='col-sm-3 control-label'>Email:</label><div class='col-sm-9'><input type='text' class='form-control' required='true' placeholder='Email Address' name='email' id='email' value = '" + objData[0].EMAIL + "' /></div></div>";
	//output += "<div class='form-group'><label for='company' class='col-sm-3 control-label'>Company:</label><div class='col-sm-5'><input type='text' class='form-control' required='true' placeholder='Company' name='company' id='company' value = '" + objData[0].EMAIL_DOMAIN + "' /></div></div>";
    output += "<div class='form-group'><label for='password' class='col-sm-3 control-label'>Password:</label><div class='col-sm-5'><input type='password' class='form-control' placeholder='Password' name='password' id='password' value = '' /></div></div>";
    dialogConstructor("Edit Profile", false, true, output, 1, true, false);
}


function showDashboardDialog(objData, edit){
    var dashboardid = '';
    var dashboardtitle = '';
    
    if (edit){
        dashboardid = objData.DASHBOARD_ID;
        dashboardtitle = objData.TITLE;
    }
    
    var output = "<form class='form-horizontal' role='form'>";
	output += "<input type='" + debugmode + "' value='" + dashboardid + "' id='dashboardid' />";
	output += "<div class='form-group'><label for='dashboardtitle' class='col-sm-3 col-sm-3 control-label'>Title</label><div class='col-sm-9'><input class='form-control' required='true' type='text' placeholder='Title' id='dashboardtitle' value = '" + dashboardtitle + "' /></div></div>";
    output += "</form>";
    
    
    if (edit){
        dialogConstructor("Edit Dashboard", true, true, output, 1, true, false);
    } else {
        dialogConstructor("Add Dashboard", false, true, output, 1, true, false);
    }
}


function showAlertOperatorDropdown(selected){
    var output = '';
	
	output += selected == '>' ? "<option selected>></option>" : "<option>></option>";
	output += selected == '<' ? "<option selected><</option>" : "<option><</option>";
	output += selected == '<=' ? "<option selected><=</option>" : "<option><=</option>";
	output += selected == '>=' ? "<option selected>>=</option>" : "<option>>=</option>";
		
	return output;
}

function showAlertWidgetNameDropDown(objWidgetList, dashboardwidgetid){
    var strHTML = "<select id='widgetid' class='form-control'>";
    var widgetList = jQuery.parseJSON(objWidgetList);
    
    $.each(widgetList, function(key, value) {
        strHTML += "<option ";
		if (dashboardwidgetid == widgetList[key].DASHBOARD_WIDGET_ID){
			strHTML += ' selected ';
		}
		strHTML += " value=" + widgetList[key].DASHBOARD_WIDGET_ID + ">" + widgetList[key].DTITLE + " - " + widgetList[key].TITLE + "</option>";
	});
	
	strHTML += "</select>";
	return strHTML;
}

function showAlertDialog(objData, edit){
    var dashboardwidgetid = '';
	var operator = '=';
	var notify = '';
	var value = '';
	var cond = '';
	var alertid = '';

	if (edit){
		//This is an edit
		var alertDetail = jQuery.parseJSON(objData.alertDetail);
		alertid = alertDetail[0].ALERT_ID;
		dashboardwidgetid = alertDetail[0].DASHBOARD_WIDGET_ID;
		cond = alertDetail[0].COND;
		operator = alertDetail[0].OPERATOR;
		notify = alertDetail[0].NOTIFY;
		value = alertDetail[0].VALUE;
	}
	
	var output = "<form class='form-horizontal'>";
	output += "<input type='" + debugmode + "' value = 'value' id='condition' />";
	output += "<input type='" + debugmode + "' value = '" + alertid + "' id='alertid' />";
    output += "<div class='form-group'><label class='col-sm-3 control-label'>Widget: </label><div class='col-sm-9'>" + showAlertWidgetNameDropDown(objData.alertWidgets, dashboardwidgetid) + "</div></div>";
    output += "<div class='form-group'><label for='operator' class='col-sm-3 control-label'>Operator:</label><div class='col-sm-3'><select id='operator' class='form-control'>" + showAlertOperatorDropdown(operator) + "</select></div></div>";
	output += "<div class='form-group'><label for='value' class='col-sm-3 control-label'>Value:</label><div class='col-sm-9'><input type='text' class='form-control' required='true' placeholder='Value' id='value' value = '" + value + "' /></div></div>";
	output += "<div class='form-group'><label for='notify' class='col-sm-3 control-label'>Notify:</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Email' id='notify' value = '" + notify + "'/></div></div>";
	
	if (edit){
        dialogConstructor("Edit Alert", true, true, output, 1, true, false);
    } else {
        dialogConstructor("Add Alert", false, true, output, 1, true, false);
    }
}

function alertHistory(alertid) {
    getDataSet({ strService: 'AlertHistoryDialog', strAlertID: alertid});
}

function alertHistoryTable(displaytype) {

    $('#dialogHTML1').html(strHistoryTable);

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
    } else {
        $('#table2 td').graphup({
            painter: 'bars',
            barsAlign: 'hcenter'
        });
    }
}

function checkParamValidation(){
    var ret = "";
    var error = "false";
    //Check no alter, update or delete statements in the parameters to avoid hacks
    $("[id^=pid_]").each(function() {
        var val = this.value.toUpperCase();
        if (val.indexOf("DELETE") > -1 || val.indexOf("ALTER") > -1 || val.indexOf("UPDATE") > -1){
            ret = "<div class='alert alert-danger'><strong>Error: </strong>Cannot use DELETE, ALTER or UPDATE statements in SQL Queries</div>";
            error = "true";
        }
    });
    
    //Check which fields are required and throw error
    $("input[required]").each(function () {
        if ($(this).val().length <= 0) {
            ret += "<div class='alert alert-danger'><strong>Required: </strong>Please complete " + $(this).attr("placeholder") + "</div>";
            error = "true";
        }
    });
    
    if (error == "true") {
        return ret;
    } else {
        return "false";
    }
}

function cloneMetric(){
    getDataSet({
        strService: "CloneMetric",
        strDashboardWidgetID: document.getElementById('dashboardwidgetid').value,
        strReload: "dashboard"
    });
}

function saveDialog(strFunction) {
    var refreshrate = 0;
    var strSQL = '';
    var checkParams = checkParamValidation();
    if (checkParams == "false"){
        if (strFunction == 'New Metric') {
            var paramCount = 0;
            refreshrate = document.getElementById('refreshrate').value;
            if (refreshrate === '') refreshrate = 0;
            
            getDataSet({
                strService: "Insert",
                strSQL: "Insert into metric2.m2_dashboard_widget (dashboard_widget_id, dashboard_id, widget_id, title, width, height, row_pos, col_pos, refresh_rate) VALUES (metric2.dashboard_widget_id.NEXTVAL, " + intCurrentDashboardID + ", " + document.getElementById('widgetid').value + ",'" + document.getElementById('widgettitle').value + "'," + document.getElementById('widgetwidth').value + "," + document.getElementById('widgetheight').value + ",1,1," + refreshrate + ")"
            });
            paramCount = $("[id^=pid_]").size();
            setTimeout(function() {
                //Once we have inserted the widget, then loop and do each param, give HANA time to insert to avoid issues
                $("[id^=pid_]").each(function() {
                    var val = replaceAll("'", "MET2", this.value);
                    val = replaceAll("%", "MET3", val);
                    val = encodeURIComponent(val);
                    getDataSet({
                        strService: "Insert",
                        strSQL: "Insert into metric2.m2_dashboard_widget_params (dashboard_widget_param_id, dashboard_widget_id, param_id, value, widget_id, dt_added) VALUES (metric2.dashboard_widget_param_id.NEXTVAL, (SELECT TOP 1 dashboard_widget_id FROM metric2.m2_dashboard_widget ORDER BY dashboard_widget_id desc)," + this.id.substring(4) + ", '" + val + "'," + document.getElementById('widgetid').value + ", current_utcdate);",
                        strReload: "dashboard"
                    });
                });
            }, 1000);
            getContent(intCurrentDashboardID);
        } else if (strFunction == 'Edit Metric') {
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
            });
            
            getDataSet({
                strService: "Update",
                strSQL: "UPDATE metric2.m2_dashboard_widget SET width =" + document.getElementById('widgetwidth').value + ", height =" + document.getElementById('widgetheight').value + ", refresh_rate = " + refreshrate + ", title = '" + document.getElementById('widgettitle').value + "' WHERE dashboard_widget_id =" + document.getElementById('dashboardwidgetid').value,
                strReload: "dashboard"
            });
        } else if (strFunction == 'Add Dashboard') {
            getDataSet({
                strService: "CreateDashboard",
                strSQL: "Insert into metric2.m2_dashboard (dashboard_id, title, subtitle, user_id) VALUES (metric2.dashboard_id.NEXTVAL, '" + document.getElementById('dashboardtitle').value + "', '',999)",
                strReload: "dashboards", 
                strMisc: document.getElementById('dashboardtitle').value
            });
        } else if (strFunction == 'Edit Dashboard') {
            getDataSet({
                strService: "UpdateDashboard",
                strSQL: "Update metric2.m2_dashboard SET title = '" + document.getElementById('dashboardtitle').value + "', subtitle = '' WHERE dashboard_id =" + document.getElementById('dashboardid').value,
                strReload: "dashboards"
            });
        } else if (strFunction == 'Add Alert') {
            getDataSet({
                strService: "CreateAlert",
                strSQL: "Insert into metric2.m2_alert (alert_id, dashboard_widget_id, cond, operator, value, notify, created_on, user_id) VALUES (metric2.alert_id.NEXTVAL, " + document.getElementById('widgetid').value + ", '" + document.getElementById('condition').value + "', '" + document.getElementById('operator').value + "','" + document.getElementById('value').value + "', '" + document.getElementById('notify').value + "', current_timestamp, 999)",
                strReload: "alerts"
            });
        } else if (strFunction == 'Edit Alert') {
            getDataSet({
                strService: "Update",
                strSQL: "Update metric2.m2_alert SET cond = '" + document.getElementById('condition').value + "', operator = '" + document.getElementById('operator').value + "', value = '" + document.getElementById('value').value + "', notify = '" + document.getElementById('notify').value + "' WHERE alert_id = " + document.getElementById('alertid').value,
                strReload: "alerts"
            });
        } else if (strFunction == 'Edit Profile') {
            $.ajax({
                url: "lib/api.xsjs",
                type: "GET",
                data: $('form').serialize(),
                success: function(data, textStatus, XMLHttpRequest) {
                    addNotification('User Account Updated', 0);
                    getDataSet({
                        strService: 'UserInfo'
                    });
                }
            });
        } else if (strFunction == 'Edit Settings') {
            getDataSet({
                strService: "Update",
                strSQL: "Update metric2.m2_users SET email_domain = '" + document.getElementById('domain').value + "' WHERE user_id =" + document.getElementById('userid').value
            });
        } else {
            console.log("No Function Defined Yet");
        }
        $('#myModal').modal('hide');
    } else {
        $('#dialogMsg1').html(checkParams);
    };
}

function deleteDialog(strFunction) {
    if (strFunction == 'Edit Dashboard') {
        getDataSet({
            strService: "CallSP",
            strSQL: "CALL METRIC2.M2_P_DELETE_DASHBOARD(" + intCurrentDashboardID + ")",
            strReload: 'true'
        });
    } else if (strFunction == 'Edit Metric') {
       var dashboardwidgetid = document.getElementById('dashboardwidgetid').value;
       getDataSet({
            strService: 'CallSP', 
            strSQL: "CALL METRIC2.M2_P_DELETE_WIDGET(" + dashboardwidgetid + ")",
            strReload: 'dashboard'
        });
        addNotification("Metric deleted", 3, true);
    } else if (strFunction == 'Edit Alert') {
        var alertID = $('#alertid').val();
        getDataSet({
            strService: 'DeleteAlert',
            strAlertID: alertID
        });
    }  else if (strFunction == 'Metric History') {
       var dashboardwidgetid = $('#dashboardwidgetid').value;
       getDataSet({
            strService: 'CallSP', 
            strSQL: "CALL METRIC2.M2_P_DELETE_WIDGET_HISTORY(" + dashboardwidgetid + ")"
        });
        addNotification("History deleted", 3, true);
    }
} 