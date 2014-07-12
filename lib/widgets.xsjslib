// --------------------------------------- Widgets ----------------------------------------------------- //


function showWidgets(){
    
    try{
        // Loop through all our widgets for this dashboard and display them in the grid + gridster Div
        var rs = sqlLib.executeReader("SELECT title, width, dashboard_widget_id, type, height, code_type, col_pos, row_pos, code, hist_enabled from metric2.m2_dashboard_widget dw INNER JOIN metric2.m2_widget w ON w.widget_id = dw.widget_id where dashboard_id = " + dashboardid + " order by dashboard_widget_id");
        
        strContent = "<div class='gridster' id='gridster'><ul id='gridtiles'>";
        
            while (rs.next()){
                var intDashboardWidgetID = rs.getString(3);
                strContent += "<li  id='tile_" + intDashboardWidgetID + "' data-row='" + rs.getString(8) + "' data-col='" + rs.getString(7) + "' data-sizex='" + rs.getString(2) + "' data-sizey='" + rs.getString(5) + "'>";
                    strContent += "<div class='t1-widget-div'><div class='t1-widget-header-div'>";
                        strContent += "<header class='t1-widget-header' id='widget-header" + intDashboardWidgetID + "'>" + rs.getString(1);
                            if (rs.getString(10) == '1'){
                                strContent += "<img class='t1-historyicon-img' id='historyicon" + intDashboardWidgetID + "' src='img/history-icon.png'>";
                            }				
                            strContent += "<img class='t1-editicon-img' id='editicon" + intDashboardWidgetID + "' src='img/settings-icon.png'>";
                        strContent += "</header>";
                    strContent += "</div>";
                    strContent += "<section class='t1-widget-section'>";
                        strContent += "<div id='t1-widget-container" + intDashboardWidgetID + "' class='t1-widget-container'>";
                            //Change: 001
                            strContent += showWidgetContents(intDashboardWidgetID, rs.getString(9));
                        strContent += "</div>";
                    strContent += "</section>";
                strContent += "</li>";
            }
            rs.close();
        strContent += "</ul></div>";
    } catch (err) {
        strContent += err;
    }
}


function getListOfWidgets(dashboardid){
	return sqlLib.executeRecordSetObj("SELECT title FROM METRIC2.m2_DASHBOARD_WIDGET WHERE dashboard_id = " + dashboardid);
}

//Experimental
function showWidgetDiv(intDashboardWidgetID){
        var data = {};
        var codetype = getWidgetCodeType(intDashboardWidgetID);
        var rs = sqlLib.executeReader("SELECT WP.name, WP.param_id, WP.hist_enabled FROM metric2.m2_widget_param as WP INNER JOIN metric2.m2_dashboard_widget_params as DWP ON WP.widget_id = DWP.widget_id  WHERE DWP.dashboard_widget_id =" + intDashboardWidgetID);
        data['dwid'] = intDashboardWidgetID;
	    data['codetype'] = codetype;
    	data['refresh'] = parseInt(getWidgetRefreshRate(intDashboardWidgetID));
    	    
        while (rs.next()){
            data['paramid'] = rs.getString(2);
            var paramname = rs.getString(1);
            var datapoint = '';
            if (rs.getString(1).indexOf('SQL') >= 0){
                datapoint = sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName(paramname, intDashboardWidgetID));
            } else {
                datapoint = getWidgetParamValueFromParamNameObj(paramname, intDashboardWidgetID);
            }
            data[paramname] = datapoint;
            if (rs.getString(3) == '1'){
               insertWidgetHistory(intDashboardWidgetID, paramname, datapoint);
            }
    	}
    	rs.close();
    	
    	//data['alert'] = alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
    	
    	return data;
}

//Experimental
function showWidgetContentsExp(){
	try{
	    var strContent = '';
	    //Change: 001 
	    
	    var dataArray = new Array();
    
	    var rs2 = sqlLib.executeReader("SELECT title, width, dashboard_widget_id, type, height, code_type, col_pos, row_pos, code, hist_enabled from metric2.m2_dashboard_widget dw INNER JOIN metric2.m2_widget w ON w.widget_id = dw.widget_id where dashboard_id = " + dashboardid + " order by dashboard_widget_id");
        while (rs2.next()){
            var data = showWidgetDiv(rs2.getString(3));  		
    		dataArray.push(data);
        }
        //alertLib.checkWidgetAlert(dashboardwidgetid, datapoint); need a way to process on client side
        strContent = JSON.stringify(dataArray);
	} catch (err) {
        // If any widget throws an error, simply display the loading icon
        strContent += err; // Useful for debugging
        //strContent += "<img style='margin-top: 50px;' src='img/loading.gif' />";
	}
	return strContent;
}


function showWidgetContents(intDashboardWidgetID, codetype){
	try{
	    var strContent = '';
	    // if codetype is blank, this is a refresh, and needs to get from db
        if (codetype === ''){
	    	codetype = getWidgetCodeType(intDashboardWidgetID);
	    }
	
		switch (codetype) {
        case 'widgetTextAndFooter':
            strContent += widgetLib.widgetTextAndFooter(intDashboardWidgetID);
            break;
        case 'widgetList':
            strContent += widgetLib.widgetList(intDashboardWidgetID);
            break;
        case 'widgetNumberAndText':
            strContent += widgetLib.widgetNumberAndText(intDashboardWidgetID);
            break;
        case 'widgetAllServicesStarted':
            strContent += widgetLib.widgetAllServicesStarted(intDashboardWidgetID);
            break;
        case 'widgetIcon':
            strContent += widgetLib.widgetIcon(intDashboardWidgetID);
            break;
        case 'widgetNumberChange':
            strContent += widgetLib.widgetNumberChange(intDashboardWidgetID);
            break;
        case 'widgetInstanceDetails':
            strContent += widgetLib.widgetInstanceDetails(intDashboardWidgetID);
            break;
        case 'widgetHistoryChart':
            strContent += widgetLib.widgetHistoryChart(intDashboardWidgetID, '%');
            break;
        case 'widgetBlockedTransactions':
            strContent += widgetLib.widgetNumberChange(intDashboardWidgetID);
            break;
        case 'widgetBlockedTransactionsList':
            strContent += widgetLib.widgetList(intDashboardWidgetID);
            break;
        case 'widgetComponentOverview':
            strContent += widgetLib.widgetComponentOverview(intDashboardWidgetID);
            break;
        case 'widgetUsedMemoryPie':
            strContent += widgetLib.widgetUsedMemoryPie(intDashboardWidgetID);
            break;
        case 'widgetMemoryUsedHistory':
            strContent += widgetLib.widgetHistoryChart(intDashboardWidgetID, 'GB');
            break;
        case 'widgetDateTime':
			strContent += widgetLib.widgetDateTime(intDashboardWidgetID);
			//strContent += 'Refreshed';
			break;
        case 'widgetConnectionHistory':
			strContent += widgetLib.widgetHistoryChart(intDashboardWidgetID, '');
			break;
        case 'widgetWeather':
			strContent += "<div id='weather'></div><script type='text/javascript' id='evalcodeShowWeather' name='script'>widgetWeather(" + getWidgetParamValueFromParamName('ZIPCODE', intDashboardWidgetID) + ");</script>";
			break;
        case 'widgetStockPrice':
			strContent += "<div id='stock'></div><script type='text/javascript' id='evalcodeShowStock' name='script'>widgetStockPrice('" + getWidgetParamValueFromParamName('TICKER', intDashboardWidgetID) + "');</script>";
			break;
        case 'widgetBullet':
			strContent += widgetLib.widgetBullet(intDashboardWidgetID);
			break;
        case 'widgetSystemOverview':
			strContent += widgetLib.widgetSystemOverview(intDashboardWidgetID);
			break;
        case 'widgetIconDistributed':
			strContent += widgetLib.widgetIconDistributed(intDashboardWidgetID);
			break;
        case 'widgetRecentUnConnections':
			strContent += widgetLib.widgetRecentUnConnections(intDashboardWidgetID);
			break;
        case 'widgetDBMemoryOverview':
			strContent += widgetLib.widgetDBMemoryOverview(intDashboardWidgetID);
			break;
        case 'widgetResMemoryOverview':
			strContent += widgetLib.widgetResMemoryOverview(intDashboardWidgetID);
			break;
        case 'widgetPing':
			strContent += "<div id='ping'></div><script type='text/javascript' id='evalcodeShowPing' name='script'>widgetPing('ping', '" + getWidgetParamValueFromParamName('IP', intDashboardWidgetID) + "');</script>";
			break;
        case 'widgetFunnel':
			strContent += widgetLib.widgetFunnel(intDashboardWidgetID);
			break;
        case 'widgetSystemAlerts':
			strContent += widgetLib.widgetSystemAlerts(intDashboardWidgetID);
			break;
        case 'widgetUserAlerts':
			strContent += widgetLib.widgetUserAlerts(intDashboardWidgetID);
			break;
        case 'widgetSensorAPI':
			strContent += widgetLib.widgetSensorAPI(intDashboardWidgetID);
			break;
        case 'widgetTwitter':
			var twitterhandle = getWidgetParamValueFromParamName('HANDLE', intDashboardWidgetID);
			strContent += '<a style="margin: 5px;" class="twitter-timeline" href="https://twitter.com/' + twitterhandle + '" width="450" height="420"  data-tweet-limit="' + getWidgetParamValueFromParamName('NUMTWEETS', intDashboardWidgetID) + '" data-chrome="nofooter noheader transparent" data-widget-id="' + getWidgetParamValueFromParamName('WIDID', intDashboardWidgetID) + '">Tweets by ' +  twitterhandle + '</a><script type="text/javascript" id="evalcodeShowTweets" name="script">widgetTwitter();</script>';
			break;
        case 'widgetHistorySmall':
			strContent += widgetLib.widgetHistorySmall(intDashboardWidgetID);
			break;
        case 'widgetTableSizes':
			strContent += widgetLib.widgetTableSizes(intDashboardWidgetID);
			break;
		case 'widgetJSONService':
			strContent += "<div id='widgetJSONService" + intDashboardWidgetID + "'></div><script type='text/javascript' id='evalOData' name='script'>widgetJSONService('" + getWidgetParamValueFromParamName('URL', intDashboardWidgetID) + "', '#widgetJSONService" + intDashboardWidgetID + "','" + getWidgetParamValueFromParamName('OBJKEY', intDashboardWidgetID) + "','" + getWidgetParamValueFromParamName('TEXT1', intDashboardWidgetID) + "');</script>";
			break;
		case 'widgetJSONServiceTable':
			strContent += "<div id='widgetJSONService" + intDashboardWidgetID + "'></div><script type='text/javascript' id='evalOData' name='script'>widgetJSONServiceTable('" + getWidgetParamValueFromParamName('URL', intDashboardWidgetID) + "', '#widgetJSONService" + intDashboardWidgetID + "');</script>";
			break;
		case 'widgetConnectionList':
			strContent += sqlLib.executeRecordSet(getWidgetParamValueFromParamName('SQL1', intDashboardWidgetID));
			break;
		case 'widgetDataMap':
			strContent += "<div id='map'></div><script type='text/javascript' id='evalcodeShowMap' name='script'>widgetDataMap('map','" + sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', intDashboardWidgetID)) + "');</script>";
			break;
		case 'widgetProgressBar':
			strContent += widgetLib.widgetProgressBar(intDashboardWidgetID);
			break;
		case 'widgetRSSFeed':
			strContent += widgetLib.widgetRSSFeed(intDashboardWidgetID);
			break;
		case 'widgetImageBox':
			strContent += widgetLib.widgetImageBox(intDashboardWidgetID);
			break;
		}
		
		var refreshrate = parseInt(getWidgetRefreshRate(intDashboardWidgetID));
		if (refreshrate !== 0){
			strContent += "<script type='text/javascript' id='timercode" + intDashboardWidgetID + "' name='script'>";
			strContent += "timers.push(setTimeout(function() {getDataSet({strService: 'RefreshWidget', strDashboardWidgetID: '" + intDashboardWidgetID + "'});}, " + refreshrate + "));";
			strContent += "</script>"; 
		}

	} catch (err) {
        // If any widget throws an error, simply display the loading icon
        strContent += err; // Useful for debugging
        //strContent += "<img style='margin-top: 50px;' src='img/loading.gif' />";
	}
	return strContent;
}


function updateWidgetPositions(objGridPos){
    for (var i = 0, len = objGridPos.length; i < len; ++i) {
        var intDashboardWidgetID = objGridPos[i].id.substring(5);
        sqlLib.executeUpdate("UPDATE metric2.m2_dashboard_widget SET row_pos =" + objGridPos[i].row + ", col_pos =" + objGridPos[i].col + " WHERE dashboard_widget_id =" + intDashboardWidgetID);
    }
}


function deleteWidget(){
    executeQuery("DELETE FROM metric2.m2_dashboard_widget WHERE dashboard_widget_id =" + dashboardwidgetid);
    executeQuery("DELETE FROM metric2.m2_dwp_history where metric2.m2_dwp_history.dashboard_widget_param_id IN (SELECT dashboard_widget_param_id FROM metric2.m2_dashboard_widget_params WHERE metric2.m2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid + ")");
    executeQuery("DELETE FROM metric2.m2_dashboard_widget_params WHERE dashboard_widget_id =" + dashboardwidgetid);
	executeUpdate("DELETE FROM metric2.m2_alert WHERE dashboard_widget_id =" + dashboardwidgetid);
    strContent += 'Deleted';
}


function getWidgetTypes(widgetGroup){
    try{
    var SQL = "";
        if (widgetGroup == '0'){
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget ORDER BY widget_id";
        } else {
            SQL = "Select widget_id, name, icon_url, type, code, code_type, description, widget_group FROM metric2.m2_widget WHERE widget_group = " + widgetGroup + " ORDER BY widget_id";
        }
        return sqlLib.executeRecordSetObj(SQL);
    } catch (err) {
        return 'Error getting widget types (getWidgetTypes:getDataSet.xsjs)';
    }
}



function updateWigetValue(){
    widgetLib.insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint, dashboardwidgetparamid);
}


// --------------------------------------- End Widgets ----------------------------------------------------- //


// --------------------------------------- Widget UI's ----------------------------------------------------- //

function widgetTextAndFooter(dashboardwidgetid){
    var strHTML = "<div class='t1-widget-text-big'>" + getWidgetParamValueFromParamName('Large Text Value', dashboardwidgetid)  + "</div>";
    strHTML += "<div class='t1-widget-footer'>";
    strHTML += "<div class='t1-widget-percent-medium-grey'>" + getWidgetParamValueFromParamName('Footer Text Value', dashboardwidgetid) + "</div>";
	strHTML += "</div>";
    
    return strHTML;
}

function widgetList(dashboardwidgetid){
    return sqlLib.executeRecordSet(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
}

function widgetNumberAndText(dashboardwidgetid){
	var datapoint = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<div class='t1-widget-text-big'>" + datapoint + "";
    strHTML += "<p class='t1-widget-text-small'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p></div>";
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
    return strHTML;
}

function widgetInstanceDetails(dashboardwidgetid){
    var strHTML = "<table style='height: 100%'><tr><td><p class='t1-widget-text-big'>" + sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
    strHTML += "</td></tr><tr><td><font style='font-size: 40px; color: #999;'>" + sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)) + "</font></p></td></tr></table>";
	strHTML += "";
    
    return strHTML;
}


function widgetDateTime(dashboardwidgetid){
	var strHTML = "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
	strHTML += "showClock(" + dashboardwidgetid + ");";
	strHTML += "timer = $.timer(function() { showClock(" + dashboardwidgetid + "); }); timer.set({ time : 1000, autostart : true });";
    //strHTML += "timers.push(timer);"
    strHTML += "</script>";
	return strHTML;
}


function widgetAllServicesStarted(dashboardwidgetid){
	// Get system connection and execute these queries against it
	//Save query value to a history table for later review
	var value1 = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var value2 = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid));
	
	var strHTML = "<div class='t1-widget-text-big'>" + value1 + "</div><br />";
	strHTML += "<div class='t1-widget-footer'>";
        strHTML += "<div class='t1-widget-percent-medium-grey'>" + value2 + "</div>";
	strHTML += "</div>";
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, value1);
    return strHTML;
}

function widgetIcon(dashboardwidgetid){
	var datapoint = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<img class='w-icon-img' src='" + getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid) + "' >";
	strHTML += "<p class='w-icon-datapoint'>" + datapoint + "</p>";
	strHTML += "<p class='w-icon-text1'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p>";
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
	return strHTML;
}

function widgetImageBox(dashboardwidgetid){
	var strHTML = "<img class='w-icon-img' src='" + getWidgetParamValueFromParamName('URL', dashboardwidgetid) + "' >";
	return strHTML;
}

function widgetRecentUnConnections(dashboardwidgetid){
	var data = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
    var strHTML = "<div class='iconframe'><img src='img/icon-lock.png' class='w-unsuccesfulconns-img'>";
    strHTML += "<p class='w-unsuccesfulconns-datapoint'>";
	strHTML += data + " Attempts</p></div>";
	
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, data);
	return strHTML;
}

function widgetIconDistributed(dashboardwidgetid){
    var strHTML = "<div class='iconframe'>";
	var boolDistributed = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var strText = '';
	if (boolDistributed == 'Yes'){
		strHTML += "<img src='img/distributedicon.png' class='w-distributed-img' />";
		strText = 'Distributed';
	} else {
		strHTML += "<img src='img/singleicon.png' class='w-distributed-img' />";
		strText = 'Single';
	}
	strHTML += "<p class='w-distributed-datapoint'>" + strText + "</p></div>";
	return strHTML;
}


function widgetBullet(dashboardwidgetid){
    
    var datadisk = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
    var logdisk = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)));
    var tracedisk = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL3', dashboardwidgetid)));
    
	var data1 = '{"title": "Data Size", "subtitle": "' + datadisk[0].DATA_SIZE + ' Gb","ranges": [' + datadisk[0].USED_SIZE + ', ' + datadisk[0].DISK_SIZE + ', ' + datadisk[0].DISK_SIZE + '],"measures": [' + datadisk[0].DATA_SIZE + '],"markers": [' + datadisk[0].DISK_SIZE + ']}';
	var data2 = '{"title": "Log Size", "subtitle": "' + logdisk[0].DATA_SIZE + ' Gb","ranges": [' + logdisk[0].USED_SIZE + ', ' + logdisk[0].DISK_SIZE + ', ' + logdisk[0].DISK_SIZE + '],"measures": [' + logdisk[0].DATA_SIZE + '],"markers": [' + logdisk[0].DISK_SIZE + ']}';
	var data3 = '{"title": "Trace Size", "subtitle": "' + tracedisk[0].DATA_SIZE + ' Gb","ranges": [' + tracedisk[0].USED_SIZE + ', ' + tracedisk[0].DISK_SIZE + ', ' + tracedisk[0].DISK_SIZE + '],"measures": [' + tracedisk[0].DATA_SIZE + '],"markers": [' + tracedisk[0].DISK_SIZE + ']}';
	var strHTML = "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetBullet('t1-widget-container" + dashboardwidgetid + "','" + data1 + "','" + data2 + "','" + data3 + "');</script>";
	return strHTML;
}


function widgetNumberChange(dashboardwidgetid){
	var data = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var fltPrevValue = parseInt(getWidgetParamSinglePastValueFromParamName('SQL1', dashboardwidgetid));
	var strUOM = getWidgetParamValueFromParamName('UOM1', dashboardwidgetid);
	var intDecPlace = parseInt(getWidgetParamValueFromParamName('DECPLACE', dashboardwidgetid));
	insertWidgetHistory(dashboardwidgetid, 'SQL1', data);
	
	var strHTML = "<div class='t1-widget-text-big'>" + data + "</div>";
	var fltCurValuedata = parseFloat(data);
	var strFooter = "";
	
	
	try{
            var fltChangeValue = (fltCurValuedata - fltPrevValue);
			fltChangeValue = fltChangeValue.toFixed(intDecPlace);
			strHTML += "<div class='t1-widget-footer' style='margin-top: 30px;'>";
			if (fltChangeValue > 0){
				strFooter = "<div class='t1-widget-percent-medium-green'>&#9650 " + fltChangeValue + " " + strUOM + "</div>";
			} else if (data == fltPrevValue) {
				strFooter = "<div class='t1-widget-percent-medium-grey'>&#9668 " + strUOM + "</div>";
			} else {
				strFooter = "<div class='t1-widget-percent-medium-red'>&#9660" + fltChangeValue + " " + strUOM + "</div>";
			}
	} catch (err) {
		strFooter = err;
		strHTML += "</div>";
	}
	
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, fltCurValuedata);
	
	return strHTML + strFooter; 
}

function widgetHistoryChart(dashboardwidgetid, uom){
	try{
		var strHistData = new Array([]);
		var datapoint = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
		var reclimit = getWidgetParamValueFromParamName('RECLIMIT', dashboardwidgetid);
		insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
		strHistData = JSON.parse(getWidgetParamRangePastValueFromParamName('SQL1', dashboardwidgetid, reclimit));
		var strChartType = getWidgetParamValueFromParamName('CHARTTYPE', dashboardwidgetid);
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var strHTML = "<div class='t1-widget-percent-medium-grey w-historychart-datapoint'>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></div>";
		strHTML += "<span class='" + dashboardwidgetid + "'>" + strData + "</span>";
		
		strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
		strHTML += "$('." + dashboardwidgetid + "').peity('" + strChartType + "', {";
			strHTML += "width: '" + parseInt(getWidgetWidth(dashboardwidgetid)) * 200 + "',";
			strHTML += "height: '" + parseInt(getWidgetHeight(dashboardwidgetid)) * 145 + "'";
		strHTML += "})";
		
		strHTML += "</script>";
		
		strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
		
		return strHTML;
	} catch (err) {
		return err;
	}
}


function widgetHistorySmall(dashboardwidgetid){
    try{
		var strHistData = new Array([]);
		var datapoint = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
		var reclimit = getWidgetParamValueFromParamName('RECLIMIT', dashboardwidgetid);
        var uom = getWidgetParamValueFromParamName('UOM1', dashboardwidgetid);
        var imgURL = getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid);
        var strSparkColor = getWidgetParamValueFromParamName('LINECOL', dashboardwidgetid);
		insertWidgetHistory(dashboardwidgetid, 'SQL1', datapoint);
		strHistData = JSON.parse(getWidgetParamRangePastValueFromParamName('SQL1', dashboardwidgetid, reclimit));
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var strHTML = "<div class='t1-widget-text-big' style='top: 65px;'><table style='width: 100%;'><tr>";
        if (imgURL){
            strHTML += "<td><img src='" + imgURL + "' /> </td>";
        }
        strHTML += "<td>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></td></tr></table></div>";
		strHTML += "<div class='t1-widget-footer' style='text-align:center'><span class='" + dashboardwidgetid + "'>" + strData + "</span></div>";
		
		strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
		strHTML += "$('." + dashboardwidgetid + "').peity('line', {";
			strHTML += "width: '" + parseInt(getWidgetWidth(dashboardwidgetid)) * 185 + "',";
			strHTML += "height: '" + parseInt(getWidgetHeight(dashboardwidgetid)) * 60 + "',";
            strHTML += "strokeColour: '" + strSparkColor + "', colour: '#FFFFFF'";
		strHTML += "})";
		
		strHTML += "</script>";
		
		strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
		
		return strHTML;
	} catch (err) {
		return err;
	}
}

function getIconForStatus(strStatus){
	if (strStatus === 'OK') {
		return '<img src="img/OKIcon.png">';
	} else if (strStatus === 'WARNING'){
		return '<img src="img/WARNINGIcon.png">';
	} else {
		return '<img src="img/ERRORIcon.png">';
	}
}


function widgetUsedMemoryPie(dashboardwidgetid){
	var intPhysicalMem = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var intFreePhysicalMem = sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid));
    insertWidgetHistory(dashboardwidgetid, 'SQL1', intFreePhysicalMem);
	var strHTML = "";
	strHTML += "<div class='t1-widget-peity'>";
	strHTML += "<table width='100%'><tr>";
	strHTML += "<td><span class='pie-memory' data-diameter='120'>" + intFreePhysicalMem + "/" + intPhysicalMem + "</span></td>";
	strHTML += "</tr><tr>";
	strHTML += "<td class='w-usedmem-datapoint'><br />" + intFreePhysicalMem + " of " + intPhysicalMem + "Gb</td>";
	strHTML += "</tr></table>";
	strHTML += "</div>";
	
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>";
	strHTML += "$('.pie-memory').peity('pie', {";
			strHTML += "colours: function(_, i, all) {";
				strHTML += "var col = '';";
				strHTML += "if (i == 0){";
					strHTML += "if (parseInt(all[i]) >= parseInt(all[all.length - 1])) {";
						strHTML += "col = '#009DE0'";
					strHTML += "} else if ((parseInt(all[i])/parseInt(all[all.length - 1])*100) > 90) {";
						strHTML += "col = '#4D89F9'";
					strHTML += "} else {";
						strHTML += "col = '#4D89F9'";
					strHTML += "}";
				strHTML += "} else {";
					strHTML += "col = '#D4D4D4'";
				strHTML += "}";
				strHTML += "return col";
			strHTML += "}";
		strHTML += "}";
	strHTML += ");";
	strHTML += "</script>";
	
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, intFreePhysicalMem);

return strHTML;
}


function widgetComponentOverview(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%'><tr>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[0].STATUS) + "</div><br />";
	strHTML += "<p class='t1-widget-icon-text'>CPU</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[1].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Data Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[2].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Log Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[3].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Trace Disk</p></td>";
	
	strHTML += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[4].STATUS) + "</div><br />";
    strHTML += "<p class='t1-widget-icon-text'>Statistics</p></td>";
		
	strHTML += "</tr></table>";
    return strHTML;
}


function widgetSystemOverview(dashboardwidgetid){
	var strHTML = "<table class='w-misc-table'>";
	
	strHTML += "<tr><td><div class='t1-widget-text-medium'>" +  sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)) + "%</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL2', dashboardwidgetid)) + "GB</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL3', dashboardwidgetid)) + "</div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  sqlLib.executeScalar(getWidgetParamValueFromParamName('SQL4', dashboardwidgetid)) + "</div></td></tr>";
	
	strHTML += "<tr><td class='t1-widget-text-table'>Total CPU</td>";
	strHTML += "<td class='t1-widget-text-table'>Memory</td>";
	strHTML += "<td class='t1-widget-text-table'>Services Started</td>";
	strHTML += "<td class='t1-widget-text-table'>Distributed</td></tr>";
		
	strHTML += "</table>";
    return strHTML;
}


function widgetTableSizes(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table class='w-misc-table' style='margin-top: 25px;'>";
	
	strHTML += "<tr><td><div class='t1-widget-text-medium'>" + datapoints[0].rows  + "<sup>GB</sup></div></td>";
	strHTML += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  datapoints[0].cols + "<sup>GB</sup></div></td>";
	
	strHTML += "<tr><td class='t1-widget-text-table'><img src='img/row-tables.png' />&nbsp;&nbsp;Rows</td>";
	strHTML += "<td class='t1-widget-text-table'><img src='img/col-tables.png' />&nbsp;&nbsp;Cols</td>";
		
	strHTML += "</table>";
    return strHTML;
}




function widgetDBMemoryOverview(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%' style='align: center;'>";
	
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].ALLOCATION_LIMIT + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Allocated</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PEAK + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Peak</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY_USED_SIZE + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Used</td></tr>";

	strHTML += "</table>";
    return strHTML;
}

function widgetResMemoryOverview(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table width='100%' style='align: center;'>";
	
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Physical</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Total Resident</td></tr>";
	strHTML += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB DB Resident</td></tr>";

	strHTML += "</table>";
    return strHTML;
}

function widgetFunnel(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var strHTML = "<table class='w-funnel-table'>";
	
	var itemmax = datapoints[0].STATUS;
	var itemmid = Math.round(((datapoints[1].STATUS/itemmax)*100));
	var itemmin = Math.round((datapoints[2].STATUS/itemmax)*100);
	var permax = (100 - (itemmid + itemmin));
	
	strHTML += "<tr><td style='background-color: #f55b4c; width: 50px;'></td><td class='t1-widget-text-table' style='width: 50px; text-align:left; width: 70px; color: #f55b4c;padding-left: 10px; height: " + permax + "%;'>" +  datapoints[0].STATUS + " Connections</td>";
	strHTML += "<td rowspan='3' style='width: 200px;'><img src='img/funnel-summary.png' /><font style='font-size: 40px; color: #CCC;'>&nbsp;&nbsp;" + (parseInt(datapoints[0].STATUS) + parseInt(datapoints[1].STATUS) + parseInt(datapoints[2].STATUS)) + "</font></td><td rowspan='3'></td></tr>";
	strHTML += "<tr><td style='background-color: #FFDD72; width: 50px;'></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #FFDD72; height: " + itemmid + "%'>" +  datapoints[1].STATUS + " Idle</td></tr>";
	strHTML += "<tr><td style='background-color: #5BD993; width: 50px;'></td></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #5BD993; height: " + itemmin + "%'>" +  datapoints[2].STATUS + " Running</td></tr>";

	strHTML += "</table>";
    return strHTML;
}


function widgetProgressBar(dashboardwidgetid){
	var datapoints = JSON.parse(sqlLib.executeRecordSetObj(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid)));
	var imgUrl = getWidgetParamValueFromParamName('ICONURL', dashboardwidgetid);
	var strHTML = "<table style='width: 100%;'><tr><td>";
	
	if (imgUrl !== ''){
        strHTML += "<img class='w-icon-img' src='" + imgURL + "'>";
	} else {
        strHTML += "&nbsp;";
	}
	
	strHTML += "</td><td><div class='widget-progressbar-percent'>" + datapoints[0].PERCENT + "%</div>";
	strHTML += "<div class='widget-progressbar'>" + datapoints[0].LABEL + "</div></td></tr></table>";
	strHTML += "<div style='width: 94%; margin: 0 auto;'><table style='width: 100%; border: 1px solid #BBB; height: 30px; border-spacing: 5px;'>";
	strHTML += "<tr><td class='widget-progressbar-td' style='background-color: #DDD; width:" + datapoints[0].PERCENT + "%;'>&nbsp;</td><td></td></tr>";
	strHTML += "</table></div>";
    return strHTML;
}


function widgetSystemAlerts(dashboardwidgetid){
	var strHTML = '';
	var img = '';
	var rs = executeReader(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var count = 0;
	
	
	strHTML += "<div id='aniHolder'>";
        while (rs.next()){
			count++;
			if (rs.getString(2) === '4') {
				img = '<img src="img/ERRORIcon.png">';
			} else if (rs.getString(2) === '2'){
				img = '<img src="img/WARNINGIcon.png">';
			} else {
				img = '<img src="img/OKIcon.png">';
			}
	
            strHTML += "<div id='" + rs.getString(1) + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td'>" + img + "</td>";
						strHTML += "<td class='w-sysalerts-text'>" + rs.getString(6) + "<br /><b>" + rs.getString(1) + "</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
		}
		
	if (count === 0){
		strHTML += "<div id='sysalert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td'><img src='img/OKIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
	}
	
	strHTML += "</div>";
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetAlertRotator();</script>";
	return strHTML;
}

function widgetUserAlerts(dashboardwidgetid){
	var strHTML = '';
	var img = '';
	var rs = sqlLib.executeReader(getWidgetParamValueFromParamName('SQL1', dashboardwidgetid));
	var count = 0;
	
	
	strHTML += "<div id='userAlert'>";
        while (rs.next()){
			count++;
			strHTML += "<div id='useralert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/WARNINGIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'>" +  rs.getString(5) + "<br />" + rs.getString(9) + "<br />Condition: <b>" + rs.getString(4) + " " + rs.getString(2) + " " + rs.getString(6) + "</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
		}
		
	if (count === 0){
		strHTML += "<div id='useralert" + count + "'>";
				strHTML += "<table class='w-sysalerts-table'>";
					strHTML += "<tr>";
						strHTML += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/OKIcon.png'></td>";
						strHTML += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					strHTML += "</tr>";
				strHTML += "</table>";
			strHTML += "</div>";
	}
	
	strHTML += "</div>";
	strHTML += "<script type='text/javascript' id='evalcode" + dashboardwidgetid + "' name='script'>widgetUserAlertRotator();</script>";
	return strHTML;
}
	
	
function widgetSensorAPI(dashboardwidgetid){
    var datapoint = getWidgetParamSinglePastValueFromParamName('VALUE', dashboardwidgetid);
    var strHTML = '<div class="t1-widget-text-big">' + datapoint + '<sup>' + getWidgetParamValueFromParamName('UOM1', dashboardwidgetid) + '</sup></div>';
	strHTML += "<p class='w-sensor-text1'>" + getWidgetParamValueFromParamName('TEXT1', dashboardwidgetid) + "</p>";	
	strHTML += alertLib.checkWidgetAlert(dashboardwidgetid, datapoint);
	insertWidgetHistory(dashboardwidgetid, 'VALUE', datapoint);
	return strHTML;
}


function widgetRSSFeed(dashboardwidgetid){
	var strHTML = "<div id='rss'></div><script type='text/javascript' id='evalcodeRSSFeeds' name='script'>widgetRSSFeed(" + getWidgetParamValueFromParamName('FEEDCOUNT', dashboardwidgetid) + ",'" + getWidgetParamValueFromParamName('URL', dashboardwidgetid) + "','rss');</script>";
	return strHTML;
}



function insertWidgetHistory(dashboardwidgetid, paramname, value, dashboardwidgetparamid){
	try {
		if (!dashboardwidgetparamid && value !== 'NaN' && value !== 'Undefined' && value !== ''){
				dashboardwidgetparamid = sqlLib.executeScalar("SELECT DASHBOARD_WIDGET_PARAM_ID FROM metric2.M2_dashboard_widget_params INNER JOIN metric2.M2_WIDGET_PARAM ON metric2.M2_WIDGET_PARAM.param_id = metric2.m2_dashboard_widget_params.param_id WHERE metric2.m2_widget_param.name = '" + paramname + "' AND metric2.M2_dashboard_widget_params.dashboard_widget_id =" + dashboardwidgetid);
		}
		executeQuery("INSERT INTO metric2.M2_DWP_HISTORY (dwp_hist_id, dashboard_widget_param_id, value) VALUES (metric2.dwp_history_id.NEXTVAL, " + dashboardwidgetparamid + ", '" + value + "')");
		return '';
	} catch (err) {
		return err.message;
	}
}
	



// --------------------------------------- End Widget UI's ----------------------------------------------------- //