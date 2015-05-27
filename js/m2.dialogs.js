/*global window browser:true */

// -------------------------   Dialog Functions ----------------------- //
	
function dialogConstructor(strDialogTitle, boolDeleteBtn, boolSaveBtn, strData, intSize, boolDisplay, boolCloneBtn, boolDeleteHistoryBtn){
    if (boolDeleteBtn){
        $("#btnModalDelete").show();
    } else {
        $("#btnModalDelete").hide();
    }

    if (boolSaveBtn){
        $("#btnModalSave").show();
    } else {
        $("#btnModalSave").hide();
    }
    
    if (boolCloneBtn){
        $("#btnModalClone").show();
    } else {
        $("#btnModalClone").hide();
    }
    
    if (boolDeleteHistoryBtn){
        $("#btnModalDeleteHistory").show();
    } else {
        $("#btnModalDeleteHistory").hide();
    }

    $("#modal-header").html(strDialogTitle);
    $("#dialogHTML1").html(strData);
    $("#dialogMsg1").html("");
            
    switch (intSize){
        case 1:
            //Small
            $("#modaldlg").css("height","auto");
            $("#modaldlg").css("width","600px");
            $("#dialogHTML1").css("height","auto");
            break;
        case 2:
            //Large
            $("#dialogHTML1").css("height","84%");
            $("#modaldlg").css("height","900px");
            $("#modaldlg").css("width","80%");
            break;
        case 3:
            //Wide
            $("#dialogHTML1").css("height","auto");
            $("#modaldlg").css("height","auto");
            $("#modaldlg").css("width","820px");
            break;
    }
            
    if (boolDisplay){
        $("#myModal").appendTo("body").modal("show");
        $("#dialogMsg1").html("");
    }
    
    $("#myModal").on("shown.bs.modal", function (e) {
        if (strDialogTitle == "Widget History"){
            chart.update();
        }
    });
}

function loadAlertList(){
    $("#myAlertModal").appendTo("body").modal("show");
    $("#alertdialoglist").html("");
    
    var maxlist = 0;
    if (alertlist.length > 5){
        maxlist = 5;
    } else {
        maxlist = alertlist.length;
    }
    
    for (var i = 0; i <= maxlist - 1; i++){
        var objAlert = alertlist[i];
        var type = "";
        switch (objAlert.type) {
            case 0:
                note = "Success";
                type = "fa-check";
                break;
            case 1:
                note = "Information";
                type = "fa-exclamation-triangle";
                break;
            case 2:
                note = "Error";
                type = "fa-times";
                break;
            case 3:
                note = "Error";
                type = "fa-times";
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
        strHTML += '<div class="col-md-12">';
            strHTML += '<ul class="nav nav-pills metric-step">';
                strHTML += '<li id="integration" role="presentation" class="active"><a><i id="integrationicon" class="fa fa-circle"></i>  Select Integration</a></li>';
                strHTML += '<li role="leaseresentation"><a class="metric-step-arrow"><i class="fa fa-chevron-right"></i></a></li>';
                strHTML += '<li id="selectmetric" role="presentation"><a><i class="fa fa-circle-thin"></i>  Select Metric</a></li>';
                strHTML += '<li role="presentation"><a class="metric-step-arrow"><i class="fa fa-chevron-right"></i></a></li>';
                strHTML += '<li id="configuremetric" role="presentation"><a><i class="fa fa-circle-thin"></i>  Configure Metric</a></li>';
            strHTML += '</ul>';
        strHTML += '</div>';
    strHTML += '</div>';
    strHTML += '<div class="row" style="margin-top: 20px;">';
        strHTML += '<div class="col-md-2">';
            strHTML += '<div class="list-group">';
                strHTML += '<a href="#" class="list-group-item" data-id="0"><b>Integration Groups</b></a>';
                strHTML += '<a href="#" class="list-group-item" data-id="0"><input type="text" class="form-control" id="searchmetrics" placeholder="Filter"></a>';
                strHTML += '<a href="#" class="list-group-item active" data-id="0">All Metrics</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="1">SAP HANA</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="4">SAP ERP</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="2">Custom</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="7">Web Services</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="6">IoT and Sensors</a>';
                strHTML += '<a href="#" class="list-group-item" data-id="8">External API\'s</a>';
                strHTML += '<a href="#" class="list-group-item disabled" data-id="3">SAP HANA Cloud</a>';
                strHTML += '<a href="#" class="list-group-item disabled" data-id="5">SAP CRM</a>';
            strHTML += '</div>';
            strHTML += '<span id="metriccount" class="pull-right">0 Metrics Shown</span>'
        strHTML += '</div>';
        strHTML += '<div class="col-md-10" id="metriclist"></div>';
    strHTML += '</div>';
    
    dialogConstructor("Select a Metric", false, false, strHTML, 2, true, false);
    
    loadNewWidgetList(intWidgetGroup, '');
}

function loadNewWidgetList(intWidgetGroup, strSearchTerm){
    var strMetrics = '';
    var intMetricCount = 0;
    
    for (var i = 0, len = objWidgetList.length; i < len; ++i) {
        if ((intWidgetGroup === parseInt(objWidgetList[i].WIDGET_GROUP) || intWidgetGroup === 0 && strSearchTerm === '') || (intWidgetGroup === 0 && strSearchTerm !== '' && (objWidgetList[i].NAME.indexOf(strSearchTerm) > 0 || objWidgetList[i].DESCRIPTION.indexOf(strSearchTerm) > 0))) {
            strMetrics += '<div class="col-md-4 btnAddMetricThumbnail" data-id="' + objWidgetList[i].WIDGET_ID + '">';
                strMetrics += '<div class="thumbnail metricThumbnailGroup">'
                    strMetrics += '<div class="col-md-6 metricThumbnailImg"><img src="img/metrics/' +  objWidgetList[i].ICON_URL + '" class="img-responsive" /></div>';
                    strMetrics += '<div class="caption col-md-6"><h4>' + objWidgetList[i].NAME + '</h4><p>' + objWidgetList[i].DESCRIPTION + '</p></div>';
                strMetrics += '</div>';
            strMetrics += ' </div>';
            intMetricCount++;
        }
    }
    
    if (intWidgetGroup === 3 || intWidgetGroup === 5){
        strMetrics += '<p align="center">Please check <a href="http://www.metric2.com" target="_blank">http://www.metric2.com</a> for new metric packs as we are frequently updating and adding new metrics.</p>';
    }
    
    $('#metriclist').html(strMetrics);
    $('#metriccount').html(intMetricCount + " Metrics Shown");
}

function showPred(dashboardwidgetid) {
    $("#dialogHTML1").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    getDataSet({ service: 'WidgetForecastDialog', dashboardwidgetid : dashboardwidgetid});
}

function showHist(dashboardwidgetid) {
    var startdt = typeof($("#startdt").val()) === 'undefined' ? getDate() : $("#startdt").val();
    var enddt = typeof($("#enddt").val()) === 'undefined' ? getDate() : $("#enddt").val();

    $("#dialogHTML1").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    getDataSet({ service: 'WidgetHistoryDialog', dashboardwidgetid : dashboardwidgetid, startdt: startdt, enddt: enddt});
}

function widgetHistoryChart(strData, dashboardwidgetid, startdt, enddt) {
    dialogConstructor("Widget History", true, false, null, 2, false, false);
    $('#dialogHTML1').innerHTML = '';
    var maxval = -1000000;
    var minval = 1000000;
        
    try {
        
        var arrData = JSON.parse(strData);
        var strTable = "<table class='w-histchart-table'><tr><td class='w-histchart-td'>Start Date&nbsp;<input type='text' id='startdt' style='width: 100px;' value='" + startdt + "' />&nbsp;&nbsp;&nbsp;End Date&nbsp;<input type='text'  style='width: 100px;' id='enddt' value='" + enddt + "' /><i id='btnSearchHist' style='font-size: 20px; margin-left: 10px;' class='fa fa-search' onClick='showHist(" + dashboardwidgetid + ");' /></i></td><td style='width: 1px; vertical-align: middle;'></td><td style='text-align: center; width: 300px;'><i style='font-size: 20px;' class='fa fa-reorder'></i> " + arrData.length + " Records</td><td style='text-align: right;'><button type='button' class='btn btn-default btn-med' id='btnShowPred' onClick='showPred(" + dashboardwidgetid + ");' ><i style='font-size: 20px; margin-right: 10px;' class='fa fa-line-chart'></i>Predictive Forecast</button></td></tr></table>";
        
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
            $("#dialogHTML1").prepend(strTable);
            $("#dialogHTML1").append("<input type='hidden' id='dashboardwidgetid' value='" + dashboardwidgetid + "' />");
            $('#startdt').datepicker();
            $('#enddt').datepicker({autoclose: true});
            
            return chart;
        });
    } catch (err) {
        $("#dialogHTML1").prepend(strTable);
        $("#dialogHTML1").append(strData);
    }
    
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
        $("#dialogHTML1").prepend("<table style='text-align: left;' class='w-histchart-table'><tr><td></td><td style='text-align: right;'><button type='button' class='btn btn-default btn-med' onClick='showHist(" + dashboardwidgetid + ");' ><i style='font-size: 20px; margin-right: 10px;' class='fa fa-area-chart'></i>History</button></td></tr></table>");
        return chart;
    });
}

function showSettingsDialog(objData) {
    var githubclientid = "";
    var githubclientsecret = "";
    var githubaccesstoken = "";
    var googleclientid = "";
    var googleclientsecret = "";
    var googleaccesstoken = "";
    
    try {
            githubclientid = JSON.parse(objData.githubAPI)[0].CLIENT_ID;
            githubclientsecret = JSON.parse(objData.githubAPI)[0].CLIENT_SECRET;
            githubaccesstoken = JSON.parse(objData.githubAPI)[0].ACCESS_TOKEN;
    } catch (e) {
            
    }
    
    try {
            googleclientid = JSON.parse(objData.googleAPI)[0].CLIENT_ID;
            googleclientsecret = JSON.parse(objData.googleAPI)[0].CLIENT_SECRET;
            googleaccesstoken = JSON.parse(objData.googleAPI)[0].ACCESS_TOKEN;
    } catch (e) {
            
    }
    
    
    var output = "<form class='form-horizontal'>";
        output += "<h4><i class='fa fa-wrench'></i>  App Settings<i class='fa fa-chevron-down pull-right' data-toggle='collapse' data-target='#appsettings' aria-expanded='true'></i></h2>";
        output += "<div id='appsettings'>";
            output += "<hr />";
            output += "<input type='" + debugmode + "' value = '" + JSON.parse(objData.userInfo)[0].USER_ID + "' id='userid' />";
            output += "<div class='form-group'><label for='domain' class='col-sm-3 control-label'>User Domain</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Domain Name' id='domain' value = '" + JSON.parse(objData.userInfo)[0].EMAIL_DOMAIN + "' /></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>App Version</label><div class='col-sm-9'><p class='form-control-static'>" + m2version + "</p></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>Default Theme</label><div class='col-sm-9'>";
                output += "<select id='theme' class='form-control'>";
                if (JSON.parse(objData.userInfo)[0].USER_THEME === 'Dark'){
                    output += "<option id='Dark' selected>Dark</option>";
                    output += "<option id='Light'>Light</option>";
                } else {
                    output += "<option id='Dark'>Dark</option>";
                    output += "<option id='Light' selected>Light</option>";
                }
            output += "</select></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>metric² Disk Used</label><div class='col-sm-4'><p class='form-control-static'>" + JSON.parse(objData.m2Size)[0].M2SIZE + "MB <br /><br />" + JSON.parse(objData.diskSize)[0].DISKSIZE + "GB</p></div><div class='col-sm-4' id='peitysvg'><span class='usagePeity'>" + JSON.parse(objData.m2Size)[0].M2SIZE + "/" + JSON.parse(objData.diskSize)[0].DISKSIZE + "</span></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'></label></div>";
        output += "</div>";
        
        
        output += "<br /><h4><i class='fa fa-google-plus'></i>  Google API<i class='fa fa-chevron-down pull-right' data-toggle='collapse' data-target='#googleapi'></i></h2>";
        output += "<div id='googleapi' class='collapse'>";
            output += "<hr />";
            output += "<div class='form-group'><label for='googleclientid' class='col-sm-3 control-label'>Client ID</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Client ID' id='googleclientid' value = '" + googleclientid + "' /></div></div>";
            output += "<div class='form-group'><label for='googleclientsecret' class='col-sm-3 control-label'>Client Secret</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Client Secret' id='googleclientsecret' value = '" + googleclientsecret + "' /></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>Status</label><div class='col-sm-9'>";
            if (googleaccesstoken.length > 0){
                output += "Authenticated <button type='button' id='GoogleAPI'  data-id='" + googleaccesstoken + "' class='btn btn-default btnRevokeOAuth pull-right'><i class='fa fa-times'></i></button>";
            } else {
                output += "<button type='button' id='GoogleAPI' data-id='" + googleclientid + "' class='btn btn-danger btnAuthenticateOAuth'>Authenticate GoogleAPI</button>";
            }
            output += "</div></div>";
        output += "</div>";
        
        
        output += "<br /><h4><i class='fa fa-github'></i>  Github API <i class='fa fa-chevron-down pull-right' data-toggle='collapse' data-target='#githubapi'></i></h2>";
        output += "<div id='githubapi' class='collapse'>";
            output += "<hr />";
            output += "<div class='form-group'><label for='githubclientid' class='col-sm-3 control-label'>Client ID</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Client ID' id='githubclientid' value = '" + githubclientid + "' /></div></div>";
            output += "<div class='form-group'><label for='githubclientsecret' class='col-sm-3 control-label'>Client Secret</label><div class='col-sm-9'><input type='text' class='form-control' placeholder='Client Secret' id='githubclientsecret' value = '" + githubclientsecret + "' /></div></div>";
            output += "<div class='form-group'><label for='version' class='col-sm-3 control-label'>Status</label><div class='col-sm-9'>";
            if (githubaccesstoken.length > 0){
                output += "Authenticated <button type='button' id='GithubAPI'  data-id='" + githubaccesstoken + "' class='btn btn-default btnRevokeOAuth pull-right'><i class='fa fa-times'></i></button>";
            } else {
                output += "<button type='button' id='GithubAPI' data-id='" + githubclientid + "' class='btn btn-danger btnAuthenticateOAuth'>Authenticate GithubAPI</button>";
            }
            output += "</div></div>";
        output += "</div>";
        
    dialogConstructor("Edit Settings", false, true, output, 1, true, false);
    
    $('.usagePeity').peity("pie", {
        height: "50px",
        width: "50px",
        fill: ["#EEE", "#C6D9FD"]
    });
}



function showWidgetDialog(objData, edit){
    var output = '';
    var webserviceparamid = '';
    
    if (!edit) {
        var strHTML = '<div class="row">';
        strHTML += '<div class="col-md-12">';
            strHTML += '<ul class="nav nav-pills metric-step">';
                strHTML += '<li id="integration" role="presentation"><a><i id="integrationicon" class="fa fa-check-circle"></i>  Select Integration</a></li>';
                strHTML += '<li role="leaseresentation"><a class="metric-step-arrow"><i class="fa fa-chevron-right"></i></a></li>';
                strHTML += '<li id="selectmetric" role="presentation"><a><i class="fa fa fa-check-circle"></i>  Select Metric</a></li>';
                strHTML += '<li role="leaseresentation"><a class="metric-step-arrow"><i class="fa fa-chevron-right"></i></a></li>';
                strHTML += '<li id="configuremetric" role="presentation" class="active"><a><i class="fa fa-circle"></i>  Configure Metric</a></li>';
            strHTML += '</ul>';
        strHTML += '</div>';
        strHTML += '</div>';
        output += strHTML;
    }
    
    output += "<form class='form-horizontal' role='form' style='margin-top: 20px;'>";
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
        if (objData.param[i].required === '1'){
            required = 'required="true"';
        }
        
        if (objData.param[i].visible === 'true'){
			output += "<div class='form-group'>";
            output += "<label for='pid_" + objData.param[i].paramid + "' class='col-sm-3 control-label'>" + objData.param[i].displayname + "</label>";
                output += "<div class='col-sm-9'>";
                if (objData.param[i].type === 'OPTION'){
                    output += "<select class='form-control' id='pid_" + objData.param[i].paramid + "'>" + showParamOption('', value, objData.param[i].options) + "</select>";
                } else if (objData.param[i].type === 'OAUTH'){
                    output += "<input class='form-control' type='" + debug + "' id='pid_" + objData.param[i].paramid + "' value='OAUTH'/>";
                } else {
                    var inputtype = objData.param[i].displayname.toLowerCase().indexOf("password") >= 0 ? "password" : "text";
                    var inputcontrol = "<input class='form-control' type='" + inputtype + "'" + required + "  value='" + value + "' placeholder='" + objData.param[i].placeholder + "' id='pid_" + objData.param[i].paramid + "' />";
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
	
	if (edit) {
    	output += "<div class='form-group'><label for='chkShareMetric' class='col-sm-3 col-sm-3 control-label'>Sharing Enabled</label><div class='col-sm-1'>";
    	if (objData.shareurl){
    	    output += "<input type='checkbox' data-id='" + objData.dashboardwidgetid + "' id='chkShareMetric' checked></label></div><div class='col-sm-8'><input class='form-control' type='text' placeholder='URL' id='metricshareurl' value = '" + getMetricShareURL(objData.shareurl) + "'/>";
    	} else {
    	    output += "<input type='checkbox' data-id='" + objData.dashboardwidgetid + "' id='chkShareMetric'></label></div><div class='col-sm-8'><input class='form-control' type='text' placeholder='URL' id='metricshareurl' value = '' disabled/>";
    	}
    	output += "</div></div>";
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
	output += "<div class='form-group'><label for='password' class='col-sm-3 control-label'>Password:</label><div class='col-sm-9'>*********<button type='button' class='btn btn-default btn-med pull-right' id='btnChangePassword'>Change Password</button></div></div>";
    output += "<div id='divChangePassword'></div>";
    dialogConstructor("Edit Profile", false, true, output, 1, true, false);
}


function showDashboardDialog(objData, edit){
    var dashboardid = "";
    var dashboardtitle = "";
    var shareurl = "";
    var bgurl = "";
    var dashboardtimezone = "";
    
    if (edit){
        dashboardid = objData.DASHBOARD_ID;
        dashboardtitle = objData.TITLE;
        shareurl = objData.SHARE_URL;
        bgurl = objData.BG_URL;
        dashboardtimezone = objData.TIME_ZONE;
    }
    
    var output = "<form class='form-horizontal' role='form'>";
	output += "<input type='" + debugmode + "' value='" + dashboardid + "' id='dashboardid' />";
	output += "<div class='form-group'><label for='dashboardtitle' class='col-sm-3 col-sm-3 control-label'>Title</label><div class='col-sm-9'><input class='form-control' required='true' type='text' placeholder='Title' id='dashboardtitle' value = '" + dashboardtitle + "' /></div></div>";
	output += "<div class='form-group'><label for='dashboardbgurl' class='col-sm-3 col-sm-3 control-label'>Background Image</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='Background Image URL' id='dashboardbgurl' value = '" + bgurl + "' /></div></div>";
	if (shareurl){
	    output += "<div class='form-group'><label for='sharingenabled' class='col-sm-3 col-sm-3 control-label'>Sharing Enabled</label><div class='col-sm-9'><input type='checkbox' id='chkShareDashboard' checked></label></div></div>";
	    output += "<div class='form-group'><label for='dashboardtitle' class='col-sm-3 col-sm-3 control-label'>Share URL</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='URL' id='dashboardshareurl' value = '" + getDashboardShareURL(shareurl) + "'/></div></div>";
	} else if (edit) {
	    output += "<div class='form-group'><label for='sharingenabled' class='col-sm-3 col-sm-3 control-label'>Sharing Enabled</label><div class='col-sm-9'><input type='checkbox' id='chkShareDashboard'></label></div></div>";
	    output += "<div class='form-group'><label for='dashboardtitle' class='col-sm-3 col-sm-3 control-label'>Share URL</label><div class='col-sm-9'><input class='form-control' type='text' placeholder='URL' id='dashboardshareurl' value = '' disabled/></div></div>";
	}
	output += "<div class='form-group'><label for='dashboardtimezone' class='col-sm-3 col-sm-3 control-label'>Timezone</label><div class='col-sm-9'><input class='form-control' required='false' type='text' placeholder='Timezone' id='dashboardtimezone' value = '" + dashboardtimezone + "' /></div></div>";
    output += "</form>";
    
    
    if (edit){
        dialogConstructor("Edit Dashboard", true, true, output, 1, true, true);
    } else {
        dialogConstructor("Add Dashboard", false, true, output, 1, true, false);
    }
}

/*
function showTimezoneDropdown(selected){
    var output = '';
	
	output += selected == '>' ? "<option selected>></option>" : "<option>></option>";
	output += selected == '<' ? "<option selected><</option>" : "<option><</option>";
	output += selected == '<=' ? "<option selected><=</option>" : "<option><=</option>";
	output += selected == '>=' ? "<option selected>>=</option>" : "<option>>=</option>";
		
	return output;
}
*/


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
    getDataSet({ service: 'AlertHistoryDialog', alertid: alertid});
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

function cloneMetric(dashboardid){
    getDataSet({
        service: "CloneMetric",
        dashboardid: dashboardid,
        dashboardwidgetid: document.getElementById('dashboardwidgetid').value
    });
}

function cloneDashboard(dashboardid){
    getDataSet({
        service: "CloneDashboard",
        dashboardid: dashboardid
    });
}

function saveDialog(strFunction) {
    var checkParams = checkParamValidation();
    if (checkParams == "false"){
        if (strFunction == 'New Metric') {
            var params = {};
            params.service = "CreateMetric";
            params.dashboardid = intCurrentDashboardID;
            params.widgetid = document.getElementById('widgetid').value;
            params.widgettitle = document.getElementById('widgettitle').value;
            params.widgetheight = document.getElementById('widgetheight').value;
            params.widgetwidth = document.getElementById('widgetwidth').value;
            params.refreshrate = (document.getElementById('refreshrate').value === '') ? 0 : document.getElementById('refreshrate').value;
            
            $("[id^=pid_]").each(function() {
                var val = this.value.replace(/'/g, "MET2");
                val = val.replace(/'/g, "MET3");
                params["pid" + this.id.substring(4)] = val;
            });
            
            getDataSet(params);
            
        } else if (strFunction == 'Edit Metric') {
            refreshrate = (document.getElementById('refreshrate').value === '') ? 0 : document.getElementById('refreshrate').value;
            
            var params = {};
            
            params.service = "EditMetric";
            params.dashboardid = intCurrentDashboardID;
            params.dashboardwidgetid = document.getElementById('dashboardwidgetid').value;
            params.widgettitle = document.getElementById('widgettitle').value;
            params.widgetheight = document.getElementById('widgetheight').value;
            params.widgetwidth = document.getElementById('widgetwidth').value;
            params.refreshrate = refreshrate;
            
            $("[id^=pid_]").each(function() {
                var val = this.value.replace(/'/g, "MET2");
                val = val.replace(/'/g, "MET3");
                params["pid" + this.id.substring(4)] = val;
            });
            
            getDataSet(params);
            
        } else if (strFunction == 'Add Dashboard') {
            getDataSet({
                service: "CreateDashboard",
                dashboardtitle: document.getElementById('dashboardtitle').value,
                dashboardbgurl: document.getElementById('dashboardbgurl').value
            });
        } else if (strFunction == 'Edit Dashboard') {
            getDataSet({
                service: "UpdateDashboard",
                dashboardid: document.getElementById('dashboardid').value,
                dashboardtitle: document.getElementById('dashboardtitle').value,
                dashboardbgurl: document.getElementById('dashboardbgurl').value
            });
        } else if (strFunction == 'Add Alert') {
            getDataSet({
                service: "CreateAlert",
                widgetid: document.getElementById('widgetid').value,
                condition: document.getElementById('condition').value,
                operator: document.getElementById('operator').value,
                value: document.getElementById('value').value,
                notify: document.getElementById('notify').value
            });
        } else if (strFunction == 'Edit Alert') {
            getDataSet({
                service: "EditAlert",
                widgetid: document.getElementById('widgetid').value,
                condition: document.getElementById('condition').value,
                operator: document.getElementById('operator').value,
                value: document.getElementById('value').value,
                notify: document.getElementById('notify').value,
                alertid: document.getElementById('alertid').value
            });
        } else if (strFunction == 'Edit Profile') {
            getDataSet({
                service: "UpdateUser",
                email: document.getElementById('email').value,
                lname : document.getElementById('lname').value,
                name: document.getElementById('name').value
            });
        } else if (strFunction == 'Edit Settings') {
            getDataSet({
                service: "EditSettings",
                theme: document.getElementById('theme').value,
                domain: document.getElementById('domain').value,
                googleclientid: document.getElementById('googleclientid').value,
                googleclientsecret: document.getElementById('googleclientsecret').value,
                githubclientid: document.getElementById('githubclientid').value,
                githubclientsecret: document.getElementById('githubclientsecret').value
            });
            theme = document.getElementById('theme').value;
            toggleTheme(theme);
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
            service: "DeleteDashboard",
            dashboardid: intCurrentDashboardID
        });
        intCurrentDashboardID = 1; /* This will load the first dashboard since the current one is now deleted */
    } else if (strFunction == 'Edit Metric') {
       getDataSet({
            service: 'DeleteWidget',
            dashboardid: intCurrentDashboardID,
            dashboardwidgetid: document.getElementById('dashboardwidgetid').value
        });
    } else if (strFunction == 'Edit Alert') {
        getDataSet({
            service: 'DeleteAlert',
            alertid: $('#alertid').val()
        });
    }  else if (strFunction.indexOf('History') > 0) {
       getDataSet({
            service: 'DeleteMetricHistory', 
            dashboardwidgetid: document.getElementById('dashboardwidgetid').value,
            reload: 'dashboard'
        });
    }
} 