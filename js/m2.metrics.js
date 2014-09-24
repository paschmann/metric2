function getScalarVal(sql, obj, property){
    var resp = JSON.parse(sql[obj]);
    return resp[0][property];
}



// --------------------------------------- Common metrics UI ----------------------------------------------------- //

function widgetJSONServiceTable(data){
    //Requires data.dwid, data.URL
	var value = '';
	authtoken = '';
	
	$.ajax 
	({
		type: "GET",
		url: data.URL,
		dataType: 'json',
		async: false,
		error: function() { $('#t1-widget-container' + data.dwid).html('Error'); },
        beforeSend: function (xhr) {
			xhr.setRequestHeader(authtoken);
		},
		success: function (resp){
			var items = [];
			var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
			$.each( resp, function( key, val ) {
				try{
					if (typeof val === 'object'){
						$.each( val, function( key1, val1 ) {
							html += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
						});
					} else {
						html += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
					}
				} catch (err) {
						
				}
			});
			html += "</table>";
			$('#t1-widget-container' + data.dwid).html(html);
		}
	});
}

function widgetDateTime(data){
    //Requires data.dwid
	showClock(data.dwid);
	timer = $.timer(function() { showClock(data.dwid); }); timer.set({ time : 1000, autostart : true });
}

function widgetTextAndFooter(data){
    //Requires data.dwid, data['Large Text Value'], data['Footer Text Value']
    var html = "<div class='t1-widget-text-big'>" + data['Large Text Value']  + "</div>";
    html += "<div class='t1-widget-footer'>";
    html += "<div class='t1-widget-percent-medium-grey'>" + data['Footer Text Value'] + "</div>";
	html += "</div>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetStockPrice(data){
    //Requires data.dwid, data.TICKER
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + data.TICKER + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON(url, function(resp) {           
            var items = [];
            var price = resp.query.results.quote.LastTradePriceOnly;
			var change = resp.query.results.quote.Change;
			
			
			var html = '<div id="stock" style="line-height: 1.0;"><div class="t1-widget-text-medium">';
			if (change > 0){
				html += '<p style="color: #5BD993; margin-top: 20px;">&#9650<br />';	
			} else if (change == 0){
				html += '<p style="color: #FFDD72; margin-top: 20px;">&#9668<br />';	
			} else {
				html += '<p style="color: #F55B4C; margin-top: 20px;">&#9660<br />';	
			}
				
			html += parseFloat(change).toFixed(2) + '';
			html += '</p></div>';
			  html += '<div class="t1-widget-datetime">$' + parseFloat(price).toFixed(2) + '';
			  html += '</div>';
			  $('#t1-widget-container' + data.dwid).html(html);
        });
}


function widgetDataMap(data){
    //Requires data.dwid, data.SQL1 (objDataSet[0].LABEL, objDataSet[0].VALUE)
	var objDataSet = JSON.parse(data.SQL1);
	$('#t1-widget-container' + data.dwid).html('<div id="map"></div>');
	var R = Raphael("map", 400, 300),
      attr = {
      "fill": "#d3d3d3",
      "stroke": "#fff",
      "stroke-opacity": "1",
      "stroke-linejoin": "round",
      "stroke-miterlimit": "4",
      "stroke-width": "0.75",
      "stroke-dasharray": "none"
    },
    usRaphael = {},
    states = R.set();

    //Draw Map and store Raphael paths
    for (var state in usMap) {
      usRaphael[state] = R.path(usMap[state]).attr(attr);
      states.push(usRaphael[state]);
    }
	states.scale("0.5,0.5 0,0");
	
               R.getXY = function (lat, lon) {
                    return {
                        cx: lon * 2.6938 + 390.41,
                        cy: lat * -2.6938 + 254.066
                    };
                };
                R.getLatLon = function (x, y) {
                    return {
                        lat: (y - 227.066) / -2.6938,
                        lon: (x - 465.4) / 2.6938
                    };
                };
				
				R.parseLatLon = function (latlon) {
                    var m = String(latlon).split(latlonrg),
                        lat = m && +m[1] + (m[2] || 0) / 60 + (m[3] || 0) / 3600;
                    if (m[4].toUpperCase() == "S") {
                        lat = -lat;
                    }
                    var lon = m && +m[6] + (m[7] || 0) / 60 + (m[8] || 0) / 3600;
                    if (m[9].toUpperCase() == "W") {
                        lon = -lon;
                    }
                    return this.getXY(lat, lon);
                };
				
				var latlonrg = /(\d+(?:\.\d+)?)[\xb0\s]?\s*(?:(\d+(?:\.\d+)?)['\u2019\u2032\s])?\s*(?:(\d+(?:\.\d+)?)["\u201d\u2033\s])?\s*([SNEW])?/i;
                R.parseLatLon = function (latlon) {
                    var m = String(latlon).split(latlonrg),
                        lat = m && +m[1] + (m[2] || 0) / 60 + (m[3] || 0) / 3600;
                    if (m[4].toUpperCase() == "S") {
                        lat = -lat;
                    }
                    var lon = m && +m[6] + (m[7] || 0) / 60 + (m[8] || 0) / 3600;
                    if (m[9].toUpperCase() == "W") {
                        lon = -lon;
                    }
                    return this.getXY(lat, lon);
                };
				
				//R.circle().attr({fill: "none", stroke: "#f00", r: 5}).attr(R.getXY(36.12135, -115.17021));
				R.circle().attr(
								{fill: "#C6D9FD", 
								opacity: "0.5",
								stroke: "#4D89F9", 
								title: objDataSet[0].LABEL,
								r: parseFloat(objDataSet[0].VALUE
								)
								}).attr(
									R.getXY(parseFloat(objDataSet[0].LAT), parseFloat(objDataSet[0].LONG))
								);
				
					
				
}



function widgetJSONService(data){
    //Requires data.dwid, data.URL, data.OBJKEY, data.TEXT1
    var value = '';
    $.getJSON(data.URL, function( resp ) {
        var items = [];
        $.each( resp, function( key, val ) {
        if (key == data.OBJKEY){
            value = val;
        }
    });
        var html = "<div class='t1-widget-text-small' style='margin-top: 35%; font-size: 26px;'>" + value + "</div><div class='t1-widget-footer' style='width: 90%; font-size: 20px;'>" + data.TEXT1 + "</div>";
        $('#t1-widget-container' + data.dwid).html(html);
    });
}


function widgetWeather(data){
    //Requires data.dwid, data.ZIPCODE
    $.simpleWeather({
	zipcode: data.ZIPCODE,
	woeid: data.ZIPCODE,
	location: '',
	unit: 'f',
	success: function(weather) {
		var cur = weather.currently;
        html = '<div class="t1-widget-text-big" style="top: 90px;">' + weather.temp + '<sup>&deg;F</sup>' + '</div>';
        html += '<div class="t1-widget-datetime">';
        html += '<br /><img src="' + weather.thumbnail + '" /></div>';
        html += '</div>';
        
        $('#t1-widget-container' + data.dwid).html(html);
	},
	error: function(error) {
        $('#t1-widget-container' + data.dwid).html('<p>'+error+'</p>');
	}
  });
}


function showClock(data){
    //Requires data.dwid
    var Digital = new Date();
	var hours = Digital.getHours();
	var minutes = Digital.getMinutes();
	var seconds = Digital.getSeconds();
	var dn="PM";
	
	if (hours < 12)
		dn = "AM";
	if (hours > 12)
		hours = hours - 12;
	if (hours === 0)
		hours = 12;
	if (minutes <= 9)
		minutes = "0" + minutes;
	if (seconds <= 9)
		seconds = "0" + seconds;
	
	var ctime = hours + ":" + minutes;
	document.getElementById("t1-widget-container" + data).innerHTML = "<div class='t1-widget-text-big' style='top: 40%'>" + ctime +"</div><div class='t1-widget-datetime'>" + dateFormat(Digital, "dddd, mmmm dS") +"</div>";
}


function widgetTwitter(data){
    //Requires data.dwid, data.HANDLE, data.NUMTWEETS
    var html = "<a style='margin: 5px;' class='twitter-timeline' href='https://twitter.com/" + data.HANDLE + "' width='450' height='420'  data-tweet-limit='" + data.NUMTWEETS + "' data-chrome='nofooter noheader transparent' data-widget-id='" + data.WIDID + "'>Tweets by " +  data.HANDLE + "</a>";
    $('#t1-widget-container' + data.dwid).html(html);
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	twttr.widgets.load()
}



function widgetPing(data){
    //Requires data.dwid, data.IP
	//jQuery.ajax({
//		url:ip,
//		//dataType: 'html script',
//		type: 'POST',
//		success: function(data) {
//			ping = new Date - ping;
			var html = '<div class="t1-widget-text-medium" style="margin-top: 60px;">' + Math.floor(Math.random() * (300 - 50) + 50) + '<sup>ms</sup></div>';
			$('#t1-widget-container' + data.dwid).html(html);
//		}
//	});
}

function widgetAlertRotator(){
				var aniSpd01 = 5000;
				var fadeSpd01 = 500;
				var startIndex = 0;
				var endIndex = $('#aniHolder div').length;
				
				$('#aniHolder div:first').fadeIn(fadeSpd01);
			
				window.setInterval(function() {
				$('#aniHolder div:eq(sysalert' + startIndex + ')').fadeOut(fadeSpd01);
					startIndex++;
					$('#aniHolder div:eq(sysalert' + startIndex + ')').fadeIn(fadeSpd01);
					if (endIndex == startIndex) startIndex = 0;
				}, aniSpd01);
			}
			
			
function widgetUserAlertRotator(){
				var aniSpd01 = 5000;
				var fadeSpd01 = 500;
				var startIndex = 0;
				var endIndex = $('#userAlert div').length;
				
				$('#userAlert div:first').fadeIn(fadeSpd01);
			
				window.setInterval(function() {
				$('#userAlert div:eq(useralert' + startIndex + ')').fadeOut(fadeSpd01);
					startIndex++;
					$('#userAlert div:eq(useralert' + startIndex + ')').fadeIn(fadeSpd01);
					if (endIndex == startIndex) startIndex = 0;
				}, aniSpd01);
}

function metricGauge(data){
    //Requires data.dwid, data.SQL1 (objData[0].VALUE, objData[0].MIN, objData[0].MAX, objData[0].TITLE, objData[0].LABEL)
    try {
        var objData = jQuery.parseJSON(data.SQL1);
        $('#t1-widget-container' + data.dwid).html("<div id='gauge" + data.dwid + "'></div>");
        var g = new JustGage({
            id: "gauge" + data.dwid, 
            value: objData[0].VALUE,
            min: parseInt(objData[0].MIN),
            max: parseInt(objData[0].MAX),
            title: objData[0].TITLE,
            label: objData[0].LABEL,
            showInnerShadow: false,
            levelColors: ['#5BD993', '#FFDD72', '#F55B4C']
        }); 
        console.log(g);
    } catch (err) {
		$('#t1-widget-container' + data.dwid).html(err);
	}
}

function widgetTable(data){
    //Requires data.dwid, data.SQL1
    if (data.SQL1 != '[]'){
        var resp = JSON.parse(data.SQL1);
        var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
			$.each( resp, function( key, val ) {
				try{
					if (typeof val === 'object'){
						$.each( val, function( key1, val1 ) {
							html += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
						});
					} else {
						html += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
					}
				} catch (err) {
						
				}
			});
			html += "</table>";
        $('#t1-widget-container' + data.dwid).html(html);
    }
}

function widgetList(data){
    //Requires data.dwid, data.SQL1
    if (data.SQL1 != '[]'){
        var resp = JSON.parse(data.SQL1);
        var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
			$.each( resp, function( key, val ) {
				try{
					if (typeof val === 'object'){
						$.each( val, function( key1, val1 ) {
							html += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
						});
					} else {
						html += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
					}
				} catch (err) {
						
				}
			});
			html += "</table>";
        $('#t1-widget-container' + data.dwid).html(html);
    }
}

function widgetNumberAndText(data){
    //Requires data.dwid, data.SQL1 (VALUE)
    var html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE');
    html += "<p class='t1-widget-text-small'>" + data.TEXT1 + "</p></div>";
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetIcon(data){
     //Requires data.dwid, data.SQL1 (VALUE), data.TEXT1, data.ICONURL
    var html = "<img class='w-icon-img' src='" + data.ICONURL + "' >";
	html += "<p class='w-icon-datapoint'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</p>";
	html += "<p class='w-icon-text1'>" + data.TEXT1 + "</p>";
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetAllServicesStarted(data){
     //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (STATUS)
    var html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</div><br />";
	html += "<div class='t1-widget-footer'>";
    html += "<div class='t1-widget-percent-medium-grey'>" + getScalarVal(data, 'SQL2', 'STATUS') + "</div>";
	html += "</div>";
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetImageBox(data){
     //Requires data.dwid, data.URL
	var html = "<img class='w-icon-img' src='" + data.URL + "' >";
	$('#t1-widget-container' + data.dwid).html(html);
}



function widgetNumberChange(data){
    //Requires data.dwid, data.SQL1 (VALUE), data.UOM1, data.DECPLACE
	var fltPrevValue = parseInt($('#t1-widget-container' + data.dwid + ' .t1-widget-text-big').html());
	if (isNaN(fltPrevValue)){
	    fltPrevValue = 0;
	}
	var strUOM = data.UOM1;
	var intDecPlace = parseInt(data.DECPLACE);
	
	var html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</div>";
	var fltCurValuedata = parseFloat(getScalarVal(data, 'SQL1', 'VALUE'));
	var strFooter = "";
	
	
	try{
            var fltChangeValue = (fltCurValuedata - fltPrevValue);
			fltChangeValue = fltChangeValue.toFixed(intDecPlace);
			html += "<div class='t1-widget-footer' style='margin-top: 30px;'>";
			if (fltChangeValue > 0){
				strFooter = "<div class='t1-widget-percent-medium-green'>&#9650 " + fltChangeValue + " " + strUOM + "</div>";
			} else if (data.SQL1 == fltPrevValue) {
				strFooter = "<div class='t1-widget-percent-medium-grey'>&#9668 " + strUOM + "</div>";
			} else {
				strFooter = "<div class='t1-widget-percent-medium-red'>&#9660" + fltChangeValue + " " + strUOM + "</div>";
			}
	} catch (err) {
		strFooter = err;
		html += "</div>";
	}
	
	$('#t1-widget-container' + data.dwid).html(html + strFooter);
}


function widgetHistChart(data){
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL1_Hist (VALUE), data.CHARTTYPE, data.UOM1, data.RECLIMIT
	try{
		var strHistData = new Array([]);
		var datapoint = getScalarVal(data, 'SQL1', 'VALUE'); //last value?
		var reclimit = data.RECLIMIT;
		var uom = data.UOM1;
		strHistData = JSON.parse(data.SQL1_Hist);
		var strChartType = data.CHARTTYPE;
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var html = "<div class='t1-widget-percent-medium-grey w-historychart-datapoint'>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></div>";
		html += "<span class='peity" + data.dwid + "'>" + strData + "</span>";
		
		$('#t1-widget-container' + data.dwid).html(html);
		
		$('.peity' + data.dwid).peity(strChartType, {
		    width: parseInt(1) * 200,
		    height: parseInt(1) * 130
		});
		
		
	} catch (err) {
		return err;
	}
}


function widgetHistorySmall(data){
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL1_Hist (VALUE), data.CHARTTYPE, data.UOM1, data.RECLIMIT,  data.ICONURL, data.LINECOL
    try{
		var strHistData = new Array([]);
		var datapoint = getScalarVal(data, 'SQL1', 'VALUE'); //just the last point?
		var reclimit = data.RECLIMIT;
        var uom = data.UOM1;
        var imgURL = data.ICONURL;
        var strSparkColor = data.LINECOL;
		strHistData = JSON.parse(data.SQL1_Hist); //too many points?
		var strData = '';
        
        strHistData.reverse();
						
		for(var i=0; i<strHistData.length; i++) {
			strData += parseFloat(strHistData[i].VALUE, 10) + ',';
		}
		strData = strData.substring(0, strData.length - 1);
		
		var html = "<div class='t1-widget-text-big' style='top: 65px;'><table style='width: 100%;'><tr>";
        if (imgURL){
            html += "<td><img src='" + imgURL + "' /> </td>";
        }
        html += "<td>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></td></tr></table></div>";
		html += "<div class='t1-widget-footer' style='text-align:center'><span class='peity" + data.dwid + "'>" + strData + "</span></div>";
		
		$('#t1-widget-container' + data.dwid).html(html);
		
		$('.peity' + data.dwid).peity('line', {
		    width: parseInt(2) * 185,
		    height: parseInt(1) * 60,
		    strokeColour: strSparkColor, colour: '#FFFFFF'
		});
		
		
	} catch (err) {
		return err;
	}
}


function widgetProgressBar(data){
    //Requires data.dwid, data.SQL1 (VALUE, LABEL), data.ICONURL
	var datapoints = JSON.parse(data.SQL1);
	var imgUrl = data.ICONURL;
	var html = "<table style='width: 100%;'><tr><td>";
	
	if (imgUrl !== ''){
        html += "<img class='w-icon-img' src='" + imgUrl + "'>";
	} else {
        html += "&nbsp;";
	}
	
	html += "</td><td><div class='widget-progressbar-percent'>" + datapoints[0].VALUE + "%</div>";
	html += "<div class='widget-progressbar'>" + datapoints[0].LABEL + "</div></td></tr></table>";
	html += "<div style='width: 94%; margin: 0 auto;'><table style='width: 100%; border: 1px solid #BBB; height: 30px; border-spacing: 5px;'>";
	html += "<tr><td class='widget-progressbar-td' style='background-color: #DDD; width:" + datapoints[0].VALUE + "%;'>&nbsp;</td><td></td></tr>";
	html += "</table></div>";
    $('#t1-widget-container' + data.dwid).html(html);
}



function widgetRSSFeed(data){
    //Requires data.dwid, data.FEEDCOUNT, data.URL
	var html = "<div id='rss'></div>";
	$('#t1-widget-container' + data.dwid).html(html);
	$('#rss').FeedEk({
		FeedUrl : data.URL,
		MaxCount : data.FEEDCOUNT,
		ShowDesc : true,
		ShowPubDate:true,
		DescCharacterLimit:100,
		TitleLinkTarget:'_blank'
    });
}


// --------------------------------------- HANA specific metrics UI ----------------------------------------------------- //


function widgetRecentUnConnections(data){
     //Requires data.dwid, data.SQL1 (VALUE)
	var html = "<div class='iconframe'><img src='img/icon-lock.png' class='w-unsuccesfulconns-img'>";
    html += "<p class='w-unsuccesfulconns-datapoint'>" + getScalarVal(data, 'SQL1', 'VALUE') + " Attempts</p></div>";
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetIconDistributed(data){
    //Requires data.dwid, data.SQL1 (VALUE)
    var html = "<div class='iconframe'>";
	var strText = '';
	if (getScalarVal(data, 'SQL1', 'VALUE') == 'Yes'){
		html += "<img src='img/distributedicon.png' class='w-distributed-img' />";
		strText = 'Distributed';
	} else {
		html += "<img src='img/singleicon.png' class='w-distributed-img' />";
		strText = 'Single';
	}
	html += "<p class='w-distributed-datapoint'>" + strText + "</p></div>";
	$('#t1-widget-container' + data.dwid).html(html);
}


function widgetBullet(data){
    //Requires data.dwid, data.SQL1, SQL2, SQL3 (VALUE, datadisk[0].DATA_SIZE, datadisk[0].USED_SIZE)
    var datadisk = JSON.parse(data.SQL1);
    var logdisk = JSON.parse(data.SQL2);
    var tracedisk = JSON.parse(data.SQL3);
    
	var data1 = '{"title": "Data Size", "subtitle": "' + datadisk[0].DATA_SIZE + ' Gb","ranges": [' + datadisk[0].USED_SIZE + ', ' + datadisk[0].DISK_SIZE + ', ' + datadisk[0].DISK_SIZE + '],"measures": [' + datadisk[0].DATA_SIZE + '],"markers": [' + datadisk[0].DISK_SIZE + ']}';
	var data2 = '{"title": "Log Size", "subtitle": "' + logdisk[0].DATA_SIZE + ' Gb","ranges": [' + logdisk[0].USED_SIZE + ', ' + logdisk[0].DISK_SIZE + ', ' + logdisk[0].DISK_SIZE + '],"measures": [' + logdisk[0].DATA_SIZE + '],"markers": [' + logdisk[0].DISK_SIZE + ']}';
	var data3 = '{"title": "Trace Size", "subtitle": "' + tracedisk[0].DATA_SIZE + ' Gb","ranges": [' + tracedisk[0].USED_SIZE + ', ' + tracedisk[0].DISK_SIZE + ', ' + tracedisk[0].DISK_SIZE + '],"measures": [' + tracedisk[0].DATA_SIZE + '],"markers": [' + tracedisk[0].DISK_SIZE + ']}';
	
	var strContent = '<div id="bullet' + data.dwid + '1" class="diskbullet" style="margin-top:40px;"><svg></svg></div><div id="bullet' + data.dwid + '2" class="diskbullet"><svg></svg></div><div id="bullet' + data.dwid + '3" class="diskbullet"><svg></svg></div>';
	data1 = JSON.parse(data1);
	data2 = JSON.parse(data2);
	data3 = JSON.parse(data3);
	nv.addGraph(function() {
    	var chart = nv.models.bulletChart();
    	
    	d3.select('#bullet' + data.dwid + '1 svg')
    			.datum(data1)
    			.call(chart);
    			
    	d3.select('#bullet' + data.dwid + '2 svg')
    			.datum(data2)
    			.call(chart);
    	
    	d3.select('#bullet' + data.dwid + '3 svg')
    			.datum(data3)
    			.call(chart);
    	
    	return chart;
	});
	$('#t1-widget-container' + data.dwid).html(strContent);
}

function widgetInstanceDetails(data){
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (VALUE)
    var html = "<table><tr><td><p class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE');
    html += "</td></tr><tr><td><font style='font-size: 40px; color: #999;'>" + getScalarVal(data, 'SQL2', 'VALUE') + "</font></p></td></tr></table>";
	html += "";
    
    $('#t1-widget-container' + data.dwid).html(html);
}


function widgetUsedMemoryPie(data){
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (VALUE)
	var intPhysicalMem = getScalarVal(data, 'SQL1', 'VALUE');
	var intFreePhysicalMem = getScalarVal(data, 'SQL2', 'VALUE');
    var html = "";
	html += "<div class='t1-widget-peity'>";
	html += "<table width='100%'><tr>";
	html += "<td><span class='pie-memory' data-diameter='120'>" + intFreePhysicalMem + "/" + intPhysicalMem + "</span></td>";
	html += "</tr><tr>";
	html += "<td class='w-usedmem-datapoint'><br />" + intFreePhysicalMem + " of " + intPhysicalMem + "Gb</td>";
	html += "</tr></table>";
	html += "</div>";
	
	$('#t1-widget-container' + data.dwid).html(html);
	
	$('.pie-memory').peity('pie', {
		colours: function(_, i, all) {
				var col = '';
				if (i == 0){
					if (parseInt(all[i]) >= parseInt(all[all.length - 1])) {
						col = '#009DE0';
					} else if ((parseInt(all[i])/parseInt(all[all.length - 1])*100) > 90) {
						col = '#4D89F9';
					} else {
					    col = '#4D89F9';
					}
				} else {
					col = '#D4D4D4';
				}
				return col;
			}
	}
	);
}

function widgetComponentOverview(data){
    //Requires data.dwid, data.SQL1 (STATUS)
	var datapoints = JSON.parse(data.SQL1);
	var html = "<table width='100%'><tr>";
	
	html += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[0].STATUS) + "</div><br />";
	html += "<p class='t1-widget-icon-text'>CPU</p></td>";
	
	html += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[1].STATUS) + "</div><br />";
    html += "<p class='t1-widget-icon-text'>Data Disk</p></td>";
	
	html += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[2].STATUS) + "</div><br />";
    html += "<p class='t1-widget-icon-text'>Log Disk</p></td>";
	
	html += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[3].STATUS) + "</div><br />";
    html += "<p class='t1-widget-icon-text'>Trace Disk</p></td>";
	
	html += "<td><div class='t1-widget-icon'>" +  getIconForStatus(datapoints[4].STATUS) + "</div><br />";
    html += "<p class='t1-widget-icon-text'>Statistics</p></td>";
		
	html += "</tr></table>";
    $('#t1-widget-container' + data.dwid).html(html);
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

function widgetSystemOverview(data){
    //Requires data.dwid, data.SQL1 (SM), data.SQL2 (SM), data.SQL3 (VALUE), data.SQL4 (VALUE)
	var html = "<table class='w-misc-table'>";
	
	html += "<tr><td><div class='t1-widget-text-medium'>" +  getScalarVal(data, 'SQL1', 'SM') + "%</div></td>";
	html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  getScalarVal(data, 'SQL2', 'SM') + "GB</div></td>";
	html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  getScalarVal(data, 'SQL3', 'VALUE') + "</div></td>";
	html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  getScalarVal(data, 'SQL4', 'VALUE') + "</div></td></tr>";
	
	html += "<tr><td class='t1-widget-text-table'>Total CPU</td>";
	html += "<td class='t1-widget-text-table'>Memory</td>";
	html += "<td class='t1-widget-text-table'>Services Started</td>";
	html += "<td class='t1-widget-text-table'>Distributed</td></tr>";
		
	html += "</table>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetTableSizes(data){
    //Requires data.dwid, data.SQL1 (ROWS, COLS)
	var datapoints = JSON.parse(data.SQL1);
	var html = "<table class='w-misc-table' style='margin-top: 25px;'>";
	
	html += "<tr><td><div class='t1-widget-text-medium'>" + datapoints[0].rows  + "<sup>GB</sup></div></td>";
	html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" +  datapoints[0].cols + "<sup>GB</sup></div></td>";
	
	html += "<tr><td class='t1-widget-text-table'><img src='img/row-tables.png' />&nbsp;&nbsp;Rows</td>";
	html += "<td class='t1-widget-text-table'><img src='img/col-tables.png' />&nbsp;&nbsp;Cols</td>";
		
	html += "</table>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetDBMemoryOverview(data){
    //Requires data.dwid, data.SQL1 (ALLOCATION_LIMIT, PEAK, TOTAL_MEMORY_USED_SIZE)
	var datapoints = JSON.parse(data.SQL1);
	var html = "<table width='100%' style='align: center;'>";
	
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].ALLOCATION_LIMIT + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Allocated</td></tr>";
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PEAK + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Peak</td></tr>";
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY_USED_SIZE + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Used</td></tr>";

	html += "</table>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetResMemoryOverview(data){
    //Requires data.dwid, data.SQL1 (TOTAL_PHYSICAL_MEMORY, TOTAL_MEMORY, PHYSICAL_MEMORY)
	var datapoints = JSON.parse(data.SQL1);
	var html = "<table width='100%' style='align: center;'>";
	
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Physical</td></tr>";
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].TOTAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Total Resident</td></tr>";
	html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" +  datapoints[0].PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB DB Resident</td></tr>";

	html += "</table>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetFunnel(data){
    //Requires data.dwid, data.SQL1 (STATUS)
	var datapoints = JSON.parse(data.SQL1);
	var html = "<table class='w-funnel-table'>";
	
	var itemmax = datapoints[0].STATUS;
	var itemmid = Math.round(((datapoints[1].STATUS/itemmax)*100));
	var itemmin = Math.round((datapoints[2].STATUS/itemmax)*100);
	var permax = (100 - (itemmid + itemmin));
	
	html += "<tr><td style='background-color: #f55b4c; width: 50px;'></td><td class='t1-widget-text-table' style='width: 50px; text-align:left; width: 70px; color: #f55b4c;padding-left: 10px; height: " + permax + "%;'>" +  datapoints[0].STATUS + " Connections</td>";
	html += "<td rowspan='3' style='width: 200px;'><img src='img/funnel-summary.png' /><font style='font-size: 40px; color: #CCC;'>&nbsp;&nbsp;" + (parseInt(datapoints[0].STATUS) + parseInt(datapoints[1].STATUS) + parseInt(datapoints[2].STATUS)) + "</font></td><td rowspan='3'></td></tr>";
	html += "<tr><td style='background-color: #FFDD72; width: 50px;'></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #FFDD72; height: " + itemmid + "%'>" +  datapoints[1].STATUS + " Idle</td></tr>";
	html += "<tr><td style='background-color: #5BD993; width: 50px;'></td></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #5BD993; height: " + itemmin + "%'>" +  datapoints[2].STATUS + " Running</td></tr>";

	html += "</table>";
    $('#t1-widget-container' + data.dwid).html(html);
}



function widgetSystemAlerts(data){
    //Requires data.dwid, 
	var html = '';
	var img = '';
	//var rs = data.SQL1;
	var count = 0;
	
	/*
	html += "<div id='aniHolder'>";
        while (rs.next()){
			count++;
			if (rs.getString(2) === '4') {
				img = '<img src="img/ERRORIcon.png">';
			} else if (rs.getString(2) === '2'){
				img = '<img src="img/WARNINGIcon.png">';
			} else {
				img = '<img src="img/OKIcon.png">';
			}
	
            html += "<div id='" + rs.getString(1) + "'>";
				html += "<table class='w-sysalerts-table'>";
					html += "<tr>";
						html += "<td class='w-sysalerts-td'>" + img + "</td>";
						html += "<td class='w-sysalerts-text'>" + rs.getString(6) + "<br /><b>" + rs.getString(1) + "</b></td>";
					html += "</tr>";
				html += "</table>";
			html += "</div>";
		}
		
	if (count === 0){
		html += "<div id='sysalert" + count + "'>";
				html += "<table class='w-sysalerts-table'>";
					html += "<tr>";
						html += "<td class='w-sysalerts-td'><img src='img/OKIcon.png'></td>";
						html += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					html += "</tr>";
				html += "</table>";
			html += "</div>";
	}
	*/
	
	html += "</div>";
	html += "<script type='text/javascript' id='evalcode" + data + "' name='script'>widgetAlertRotator();</script>";
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetUserAlerts(data){
    //Requires data.dwid, 
	var html = '';
	var img = '';
	//var rs = data.SQL1;
	var count = 0;
	
	/*
	html += "<div id='userAlert'>";
        while (rs.next()){
			count++;
			html += "<div id='useralert" + count + "'>";
				html += "<table class='w-sysalerts-table'>";
					html += "<tr>";
						html += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/WARNINGIcon.png'></td>";
						html += "<td class='w-sysalerts-text'>" +  rs.getString(5) + "<br />" + rs.getString(9) + "<br />Condition: <b>" + rs.getString(4) + " " + rs.getString(2) + " " + rs.getString(6) + "</b></td>";
					html += "</tr>";
				html += "</table>";
			html += "</div>";
		}
		
	if (count === 0){
		html += "<div id='useralert" + count + "'>";
				html += "<table class='w-sysalerts-table'>";
					html += "<tr>";
						html += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/OKIcon.png'></td>";
						html += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
					html += "</tr>";
				html += "</table>";
			html += "</div>";
	}
	*/
	
	html += "</div>";
	widgetUserAlertRotator();
	$('#t1-widget-container' + data.dwid).html(html);
}

function widgetSensorPoll(data){
    //Requires data.dwid, 
    $('#t1-widget-container' + data.dwid).html('');
}
	
	
function widgetSensorAPI(data){
    //Requires data.dwid, data.VALUE, data.UOM1, data.TEXT1
    try {
        var html = '<div class="t1-widget-text-big">' + data.VALUE + '<sup>' + data.UOM1 + '</sup></div>';
        html += "<p class='w-sensor-text1'>" + data.TEXT1 + "</p>";	
        $('#t1-widget-container' + data.dwid).html(html);
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html(err);
    }
}
