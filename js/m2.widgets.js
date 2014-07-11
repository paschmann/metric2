
// --------------------------------------- Widgets UI ----------------------------------------------------- //

function widgetTextAndFooter(objWidgets){
    var strHTML = "<div class='t1-widget-text-big'>" + objWidgets[ 'Large Text Value' ]  + "</div>";
    strHTML += "<div class='t1-widget-footer'>";
    strHTML += "<div class='t1-widget-percent-medium-grey'>" + objWidgets[ 'Footer Text Value' ] + "</div>";
	strHTML += "</div>";
    
    var divid = 0;
    $('#t1-widget-container' + objWidgets.dwid).html(strHTML);
}


function widgetStockPrice(Ticker){
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + Ticker + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON(url, function(data) {           
            var items = [];
            $('#stock').html('');
            var price = data.query.results.quote.LastTradePriceOnly;
			var change = data.query.results.quote.Change;
			
			
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
			  $('#stock').html(html);
        });
}

function make_base_auth(user, password) {
	  var tok = user + ':' + password;
	  var hash = btoa(tok);
	  return "Basic " + hash;
}

function widgetJSONServiceTable(url, elemID, username, password){
	var value = '';
	//username = 'p066797';
	//password = 'P9909711';
	authtoken = ''; //make_base_auth(username, password);
	
	$.ajax 
	({
		type: "GET",
		url: url,
		dataType: 'json',
		async: false,
		error: function() { $(elemID).html('Error'); },
        beforeSend: function (xhr) {
			xhr.setRequestHeader(authtoken);
		},
		success: function (data){
			var items = [];
			var strHTML = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
			$.each( data, function( key, val ) {
				try{
					if (typeof val === 'object'){
						$.each( val, function( key1, val1 ) {
							strHTML += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
						});
					} else {
						strHTML += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
					}
				} catch (err) {
						
				}
			});
			strHTML += "</table>";
			$(elemID).html(strHTML);
		}
	});
	
	/*
	$.getJSON(url, function( data ) {
        var items = [];
		var strHTML = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
        $.each( data, function( key, val ) {
			try{
				if (typeof val === 'object'){
					$.each( val, function( key1, val1 ) {
						strHTML += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
					});
				} else {
					strHTML += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
				}
			} catch (err) {
					
			}
    	});
		strHTML += "</table>";
        $(elemID).html(strHTML);
    });
	*/
}


function widgetRSSFeed(feedcount, url, elemID){
	$('#' + elemID).FeedEk({
		FeedUrl : url,
		MaxCount : feedcount,
		ShowDesc : true,
		ShowPubDate:true,
		DescCharacterLimit:100,
		TitleLinkTarget:'_blank'
  	});
}

function widgetDataMap(elemID, dataSet, radius){
		var objDataSet = JSON.parse(dataSet);
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



function widgetJSONService(url, elemID, objkey, text1){
    var value = '';
    $.getJSON(url, function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
        if (key == objkey){
            value = val;
        }
    });
        var strHTML = "<div class='t1-widget-text-small' style='margin-top: 35%; font-size: 26px;'>" + value + "</div><div class='t1-widget-footer' style='width: 90%; font-size: 20px;'>" + text1 + "</div>";
        $(elemID).html(strHTML);
    });
}


function widgetWeather(strZipCode){		
  $.simpleWeather({
	zipcode: strZipCode,
	woeid: '28012',
	location: '',
	unit: 'f',
	success: function(weather) {
		var cur = weather.currently;
	  html = '<div class="t1-widget-text-big" style="top: 90px;">' + weather.temp + '<sup>&deg;F</sup>' + '</div>';
	  html += '<div class="t1-widget-datetime">'
      //html += cur;
	  html += '<br /><img src="' + weather.thumbnail + '" /></div>';
	  //html += '<li>'+weather.tempAlt+'&deg;C</li></ul>';
	  html += '</div>';
  
	  $("#weather").html(html);
	},
	error: function(error) {
	  $("#weather").html('<p>'+error+'</p>');
	}
  });
}


function widgetBullet(elemID, data1, data2, data3) {
	var strContent = '<div id="bullet' + elemID + '1" class="diskbullet" style="margin-top:40px;"><svg></svg></div><div id="bullet' + elemID + '2" class="diskbullet"><svg></svg></div><div id="bullet' + elemID + '3" class="diskbullet"><svg></svg></div>';
	data1 = JSON.parse(data1);
	data2 = JSON.parse(data2);
	data3 = JSON.parse(data3);
	nv.addGraph(function() {
	var chart = nv.models.bulletChart();
	
	d3.select('#bullet' + elemID + '1 svg')
			.datum(data1)
			.call(chart);
			
	d3.select('#bullet' + elemID + '2 svg')
			.datum(data2)
			.call(chart);
	
	d3.select('#bullet' + elemID + '3 svg')
			.datum(data3)
			.call(chart);
	
	return chart;
	});
	document.getElementById(elemID).innerHTML = strContent;
}// JavaScript Document




function showClock(dashboardwidgetid){
						
						var Digital=new Date()
						var hours=Digital.getHours()
						var minutes=Digital.getMinutes()
						var seconds=Digital.getSeconds()
						var dn="PM"
						if (hours<12)
						dn="AM"
						if (hours>12)
						hours=hours-12
						if (hours==0)
						hours=12
						if (minutes<=9)
						minutes="0"+minutes
						if (seconds<=9)
						seconds="0"+seconds
						var ctime=hours+":"+minutes //+" <sub>"+ dn + "</sub>"
						
						document.getElementById("t1-widget-container" + dashboardwidgetid).innerHTML = "<div class='t1-widget-text-big' style='top: 40%'>" + ctime +"</div><div class='t1-widget-datetime'>" + dateFormat(Digital, "dddd, mmmm dS") +"</div>";
}


function widgetTwitter(){
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	twttr.widgets.load()
}



function widgetPing(elemID, ip){

	//jQuery.ajax({
//		url:ip,
//		//dataType: 'html script',
//		type: 'POST',
//		success: function(data) {
//			ping = new Date - ping;
			var html = '<div class="t1-widget-text-medium" style="margin-top: 60px;">' + Math.floor(Math.random() * (300 - 50) + 50) + '<sup>ms</sup></div>';
			document.getElementById(elemID).innerHTML = html;
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