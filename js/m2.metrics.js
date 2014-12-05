function getScalarVal(sql, obj, property) {
    var resp = JSON.parse(sql[obj]);
    return resp[0][property];
}



// --------------------------------------- Common metrics UI ----------------------------------------------------- //

function widgetJSONServiceTable(data) {
    //Requires data.dwid, data.URL
    var value = '';
    authtoken = '';

    try {
        $.ajax({
            type: "GET",
            url: data.URL,
            dataType: 'json',
            async: false,
            error: function() {
                $('#t1-widget-container' + data.dwid).html('Error');
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader(authtoken);
            },
            success: function(resp) {
                var items = [];
                var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
                $.each(resp, function(key, val) {
                    try {
                        if (typeof val === 'object') {
                            $.each(val, function(key1, val1) {
                                html += "<tr><td>" + key1 + "</td><td>" + val1 + "</td></tr>";
                            });
                        } else {
                            html += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
                        }
                    } catch (err) {

                    }
                });
                html += "</table>";
                
            }
        });
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetDateTime(data) {
    //Requires data.dwid
    try {
        showClock(data.dwid);
        var timer = $.timer(function() {
            showClock(data.dwid);
        });
        timer.set({
            time: 1000,
            autostart: true
        });
    } catch (err) {
        
    }
}

function metricClock(data) {
    try {
        var html = '<div class="t1-metric-clock-top"><span id="clock-dt"></span><br /><span id="clock-time"></span></div>';
        html += '<ul id="clock">';
        html += '<li id="sec"></li>';
        html += '<li id="hour"></li>';
        html += '<li id="min"></li>';
        html += '</ul>';

        html += '<ul>';
        html += '<li id="clock-timezones"><i class="fa fa-clock-o"></i><br /><span id="clock-tz1"></span></li>';
        html += '<li id="clock-timezones"><i class="fa fa-clock-o"></i><br /><span id="clock-tz2"></span></li>';
        html += '<li id="clock-timezones"><i class="fa fa-clock-o"></i><br /><span id="clock-tz3"></span></li>';
        html += '<li id="clock-timezones"><i class="fa fa-clock-o"></i><br /><span id="clock-tz4"></span></li>';
        html += '</ul>';
    } catch (err) {
        html = 'Error';
    }

    $('#t1-widget-container' + data.dwid).html(html);

    setInterval(function() {
        var seconds = new Date().getSeconds();
        var sdegree = seconds * 6;
        var srotate = "rotate(" + sdegree + "deg)";

        $("#sec").css({
            "-moz-transform": srotate,
            "-webkit-transform": srotate
        });

    }, 1000);


    setInterval(function() {
        var hours = new Date().getHours();
        var mins = new Date().getMinutes();
        var hdegree = hours * 30 + (mins / 2);
        var hrotate = "rotate(" + hdegree + "deg)";

        $("#clock-time").html(hours + ":" + (mins<10?'0':'') + mins);
        $("#clock-dt").html(new Date().toDateString());

        $("#clock-tz1").html(calcTime(+2) + "<br /><b>Cape Town</b>");
        $("#clock-tz2").html(calcTime(-4) + "<br /><b>New York</b>");
        $("#clock-tz3").html(calcTime(+11) + "<br /><b>Sydney</b>");
        $("#clock-tz4").html(calcTime(+8) + "<br /><b>Shanghai</b>");

        $("#hour").css({
            "-moz-transform": hrotate,
            "-webkit-transform": hrotate
        });

    }, 1000);


    setInterval(function() {
        var mins = new Date().getMinutes();
        var mdegree = mins * 6;
        var mrotate = "rotate(" + mdegree + "deg)";

        $("#min").css({
            "-moz-transform": mrotate,
            "-webkit-transform": mrotate
        });

    }, 1000);
}

function calcTime(offset) {

    // create Date object for current location
    d = new Date();

    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000 * offset));

    return nd.toLocaleFormat("%c");

    // return time as a string
    //return nd.toLocaleString();

}


function widgetTextAndFooter(data) {
    //Requires data.dwid, data['Large Text Value'], data['Footer Text Value']
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

function widgetStockPrice(data) {
    //Requires data.dwid, data.TICKER
    try {
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + data.TICKER + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON(url, function(resp) {
            var items = [];
            var price = resp.query.results.quote.LastTradePriceOnly;
            var change = resp.query.results.quote.Change;


            var html = '<div id="stock" style="line-height: 1.0;"><div class="t1-widget-text-medium">';
            if (change > 0) {
                html += '<p style="color: #5BD993; margin-top: 20px;">&#9650<br />';
            } else if (change == 0) {
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
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html('Error');
    }
}


function widgetDataMap(data) {
    //Requires data.dwid, data.SQL1 (objDataSet[0].LABEL, objDataSet[0].VALUE)
    try {
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

        R.getXY = function(lat, lon) {
            return {
                cx: lon * 2.6938 + 390.41,
                cy: lat * -2.6938 + 254.066
            };
        };
        R.getLatLon = function(x, y) {
            return {
                lat: (y - 227.066) / -2.6938,
                lon: (x - 465.4) / 2.6938
            };
        };

        R.parseLatLon = function(latlon) {
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
        R.parseLatLon = function(latlon) {
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
        R.circle().attr({
            fill: "#C6D9FD",
            opacity: "0.5",
            stroke: "#4D89F9",
            title: objDataSet[0].LABEL,
            r: parseFloat(objDataSet[0].VALUE)
        }).attr(
            R.getXY(parseFloat(objDataSet[0].LAT), parseFloat(objDataSet[0].LONG))
        );
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html('Error');
    }
}



function widgetJSONService(data) {
    //Requires data.dwid, data.URL, data.OBJKEY, data.TEXT1
    var html;
    try {
        var value = '';
        $.getJSON(data.URL, function(resp) {
            var items = [];
            $.each(resp, function(key, val) {
                if (key == data.OBJKEY) {
                    value = val;
                }
            });
            html = "<div class='t1-widget-text-small' style='margin-top: 35%; font-size: 26px;'>" + value + "</div><div class='t1-widget-footer' style='width: 90%; font-size: 20px;'>" + data.TEXT1 + "</div>";
            $('#t1-widget-container' + data.dwid).html(html);
        });
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html("Error");
    }
}


function widgetWeather(data) {
    //Requires data.dwid, data.ZIPCODE
    var html;
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
            $('#t1-widget-container' + data.dwid).html("Error");
        }
    });
    
}


function showClock(data) {
    //Requires data.dwid
    var Digital = new Date();
    var hours = Digital.getHours();
    var minutes = Digital.getMinutes();
    var seconds = Digital.getSeconds();
    var dn = "PM";

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
    $("#t1-widget-container" + data).html("<div class='t1-widget-text-big' style='top: 40%'>" + ctime + "</div><div class='t1-widget-datetime'>" + dateFormat(Digital, "dddd, mmmm dS") + "</div>");
}


function widgetTwitter(data) {
    //Requires data.dwid, data.HANDLE, data.NUMTWEETS
    var html;
    try {
        html = "<a style='margin: 5px;' class='twitter-timeline' href='https://twitter.com/" + data.HANDLE + "' width='450' height='420'  data-tweet-limit='" + data.NUMTWEETS + "' data-chrome='nofooter noheader transparent' data-widget-id='" + data.WIDID + "'>Tweets by " + data.HANDLE + "</a>";
    } catch (err) {
        html = 'Error';
    }

    $('#t1-widget-container' + data.dwid).html(html);
    
    ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + "://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, "script", "twitter-wjs");
    twttr.widgets.load();
}



function widgetPing(data) {
    //Requires data.dwid, data.IP
    //jQuery.ajax({
    //		url:ip,
    //		//dataType: 'html script',
    //		type: 'POST',
    //		success: function(data) {
    //			ping = new Date - ping;
    try {
        var html = '<div class="t1-widget-text-medium" style="margin-top: 60px;">' + Math.floor(Math.random() * (300 - 50) + 50) + '<sup>ms</sup></div>';
        $('#t1-widget-container' + data.dwid).html(html);
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html(err);
    }
    //		}
    //	});
}

function widgetAlertRotator() {
    var aniSpd01 = 5000;
    var fadeSpd01 = 500;
    var startIndex = 0;
    var endIndex = $('#w-sysalerts-rotator div').length;

    try {
        $('#w-sysalerts-rotator div:first').fadeIn(fadeSpd01);

        timers.push(setInterval(function() {
            $('#sysalert' + startIndex).fadeOut(fadeSpd01);
            startIndex++;
            $('#sysalert' + startIndex).fadeIn(fadeSpd01);
            if (endIndex == startIndex) startIndex = 0;
        }, aniSpd01));
    } catch (err) {
        console.log(err);
    }
}


function widgetUserAlertRotator() {
    var aniSpd01 = 5000;
    var fadeSpd01 = 500;
    var startIndex = 0;
    var endIndex = $('#w-useralerts-rotator div').length;

    try {
        $('#w-useralerts-rotator div:first').fadeIn(fadeSpd01);

        timers.push(setInterval(function() {
            $('#useralert' + startIndex).fadeOut(fadeSpd01);
            startIndex++;
            $('#useralert' + startIndex).fadeIn(fadeSpd01);
            if (endIndex == startIndex) startIndex = 0;
        }, aniSpd01));
    } catch (err) {
        console.log(err);
    }
}

function metricGauge(data) {
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
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html(err);
    }
}

function widgetTable(data) {
    //Requires data.dwid, data.SQL1
    var intRecCount = 0;
    var objData = jQuery.parseJSON(data.SQL1);
    var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
    $.each(objData, function(key, val) {
        try {
            if (typeof val === 'object') {
                if (intRecCount === 0){
                    html += "<thead><tr>";
                    $.each(val, function(key1, val1) {
                        html += "<th>" + key1 + "</th>";
                    });
                    html += "</tr></thead><tbody>";
                }
                html += "<tr>";
                $.each(val, function(key1, val1) {
                    html += "<td>" + val1 + "</td>";
                });
                html += "</tr>";
            }
                
            intRecCount++;
        } catch (err) {
    
        }
    });
    html += "</tbody></table>";

    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetList(data) {
    //Requires data.dwid, data.SQL1
    var intRecCount = 0;
    var objData = jQuery.parseJSON(data.SQL1);
    var html = "<table style='text-align: left; margin: 10px; width: inherit;' class='table table-striped'>";
    $.each(objData, function(key, val) {
        try {
            if (typeof val === 'object') {
                if (intRecCount === 0){
                    html += "<thead><tr>";
                    $.each(val, function(key1, val1) {
                        html += "<th>" + key1 + "</th>";
                    });
                    html += "</tr></thead><tbody>";
                }
                html += "<tr>";
                $.each(val, function(key1, val1) {
                    html += "<td>" + val1 + "</td>";
                });
                html += "</tr>";
            }
                
            intRecCount++;
        } catch (err) {
    
        }
    });
    html += "</tbody></table>";
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetNumberAndText(data) {
    //Requires data.dwid, data.SQL1 (VALUE)
    var html;
    try {
        html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE');
        html += "<p class='t1-widget-text-small'>" + data.TEXT1 + "</p></div>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetIcon(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.TEXT1, data.ICONURL
    //var html = "<img class='w-icon-img' src='" + data.ICONURL + "' >";
    var html;
    try {
        html = "<i class='fa fa-" + data.ICONURL + "  fa-5x' style='margin: 15px;'></i>";
        html += "<p class='w-icon-datapoint'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</p>";
        html += "<p class='w-icon-text1'>" + data.TEXT1 + "</p>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetAllServicesStarted(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (STATUS)
    var html;
    try {
        html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</div><br />";
        html += "<div class='t1-widget-footer'>";
        html += "<div class='t1-widget-percent-medium-grey'>" + getScalarVal(data, 'SQL2', 'STATUS') + "</div>";
        html += "</div>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetImageBox(data) {
    //Requires data.dwid, data.URL
    var html;
    try {
        html = "<img class='' style='width: 100%; height: 100%; padding: 5px;' src='" + data.URL + "' >";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}



function widgetNumberChange(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.UOM1, data.DECPLACE
    var html;
    try {
        var fltPrevValue = parseInt($('#t1-widget-container' + data.dwid + ' .t1-widget-text-big').html());
        if (isNaN(fltPrevValue)) {
            fltPrevValue = 0;
        }
        var strUOM = data.UOM1;
        var intDecPlace = parseInt(data.DECPLACE);

        html = "<div class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE') + "</div>";
        var fltCurValuedata = parseFloat(getScalarVal(data, 'SQL1', 'VALUE'));
        var fltChangeValue = (fltCurValuedata - fltPrevValue);
        fltChangeValue = fltChangeValue.toFixed(intDecPlace);
        var strFooter = "";
        
        html += "<div class='t1-widget-footer' style='margin-top: 30px;'>";
        if (fltChangeValue > 0) {
            strFooter = "<div class='t1-widget-percent-medium-green'>&#9650 " + fltChangeValue + " " + strUOM + "</div>";
        } else if (fltCurValuedata == fltPrevValue) {
            strFooter = "<div class='t1-widget-percent-medium-grey'>&#9668 " + strUOM + "</div>";
        } else {
            strFooter = "<div class='t1-widget-percent-medium-red'>&#9660 " + fltChangeValue + " " + strUOM + "</div>";
        }
    } catch (err) {
        strFooter = err;
        html += "</div>";
    }

    $('#t1-widget-container' + data.dwid).html(html + strFooter);
}


function widgetHistChart(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL1_Hist (VALUE), data.CHARTTYPE, data.UOM1, data.RECLIMIT
    var html;
    try {
        var strHistData = new Array([]);
        var datapoint = getScalarVal(data, 'SQL1', 'VALUE'); //last value?
        var reclimit = data.RECLIMIT;
        var uom = data.UOM1;
        strHistData = JSON.parse(data.SQL1_Hist);
        var strChartType = data.CHARTTYPE;
        var strData = '';

        strHistData.reverse();

        for (var i = 0; i < strHistData.length; i++) {
            strData += parseFloat(strHistData[i].VALUE, 10) + ',';
        }
        strData = strData.substring(0, strData.length - 1);

        html = "<div class='t1-widget-percent-medium-grey w-historychart-datapoint'>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></div>";
        html += "<span class='peity" + data.dwid + "'>" + strData + "</span>";
        
        $('#t1-widget-container' + data.dwid).html(html);

        $('.peity' + data.dwid).peity(strChartType, {
            width: parseInt(data.width) * 200,
            height: '75%',
            fill: ["#C6D9FD"]
        });
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html('Error');
    }

    
}


function widgetHistorySmall(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL1_Hist (VALUE), data.CHARTTYPE, data.UOM1, data.RECLIMIT,  data.ICONURL, data.LINECOL
    var html;
    try {
        var strHistData = [];
        var datapoint = getScalarVal(data, 'SQL1', 'VALUE'); //just the last point?
        var reclimit = data.RECLIMIT;
        var uom = data.UOM1;
        var imgURL = data.ICONURL;
        var strSparkColor = data.LINECOL;
        strHistData = JSON.parse(data.SQL1_Hist); //too many points?
        var strData = '';

        strHistData.reverse();

        for (var i = 0; i < strHistData.length; i++) {
            strData += parseFloat(strHistData[i].VALUE, 10) + ',';
        }
        strData = strData.substring(0, strData.length - 1);

        html = "<div class='t1-widget-text-big' style='top: 55px;'><table style='width: 100%;'><tr>";
        if (imgURL) {
            html += "<td><i class='fa fa-" + imgURL + "' style='margin: 15px; color: #ccc;'></i></td>";
        }
        html += "<td>" + parseFloat(parseFloat(datapoint).toFixed(2)) + "<sup>" + uom + "</sup></td></tr></table></div>";
        html += "<div class='t1-widget-footer' style='text-align:center; margin-top: 0px;'><span class='peity" + data.dwid + "'>" + strData + "</span></div>";
    } catch (err) {
        html = 'Error';
    }

    $('#t1-widget-container' + data.dwid).html(html);

    $('.peity' + data.dwid).peity('line', {
        width: parseInt(data.width) * 185,
        height: parseInt(data.height) * 60,
        strokeColor: strSparkColor,
        fill: ["#FFFFFF"]
    });
}


function widgetProgressBar(data) {
    var html;
    //Requires data.dwid, data.SQL1 (VALUE, LABEL), data.ICONURL
    try {
        var datapoints = JSON.parse(data.SQL1);
        var imgURL = data.ICONURL;
        html = "<table style='width: 100%;'><tr><td>";

        if (imgURL !== '') {
            html += "<i class='fa fa-" + imgURL + "  fa-5x' style='margin: 15px; color: #ccc;'></i>";
        } else {
            html += "&nbsp;";
        }

        html += "</td><td><div class='widget-progressbar-percent'>" + datapoints[0].VALUE + "%</div>";
        html += "<div class='widget-progressbar'>" + datapoints[0].LABEL + "</div></td></tr></table>";
        html += "<div style='width: 94%; margin: 0 auto;'><table style='width: 100%; border: 1px solid #BBB; height: 30px; border-spacing: 5px;'>";
        html += "<tr><td class='widget-progressbar-td' style='background-color: #DDD; width:" + datapoints[0].VALUE + "%;'>&nbsp;</td><td></td></tr>";
        html += "</table></div>";
    } catch (err) {
        html = err;
    }
    $('#t1-widget-container' + data.dwid).html(html);

}



function widgetRSSFeed(data) {
    //Requires data.dwid, data.FEEDCOUNT, data.URL
    try {
        var html = "<div id='rss'></div>";
        $('#t1-widget-container' + data.dwid).html(html);
        $('#rss').FeedEk({
            FeedUrl: data.URL,
            MaxCount: data.FEEDCOUNT,
            ShowDesc: true,
            ShowPubDate: true,
            DescCharacterLimit: 100,
            TitleLinkTarget: '_blank'
        });
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html(err);
    }
}


// --------------------------------------- HANA specific metrics UI ----------------------------------------------------- //


function widgetRecentUnConnections(data) {
    //Requires data.dwid, data.SQL1 (VALUE)
    var html;
    try {
        html = "<div class='iconframe'><img src='img/icon-lock.png' class='w-unsuccesfulconns-img'>";
        html += "<p class='w-unsuccesfulconns-datapoint'>" + getScalarVal(data, 'SQL1', 'VALUE') + " Attempts</p></div>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetIconDistributed(data) {
    //Requires data.dwid, data.SQL1 (VALUE)
    var html;
    try {
        html = "<div class='iconframe'>";
        var strText = '';
        if (getScalarVal(data, 'SQL1', 'VALUE') == 'Yes') {
            html += "<img src='img/distributedicon.png' class='w-distributed-img' />";
            strText = 'Distributed';
        } else {
            html += "<img src='img/singleicon.png' class='w-distributed-img' />";
            strText = 'Single';
        }
        html += "<p class='w-distributed-datapoint'>" + strText + "</p></div>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}


function widgetBullet(data) {
    //Requires data.dwid, data.SQL1, SQL2, SQL3 (VALUE, datadisk[0].DATA_SIZE, datadisk[0].USED_SIZE)
    var html;
    try {
        var datadisk = JSON.parse(data.SQL1);
        var logdisk = JSON.parse(data.SQL2);
        var tracedisk = JSON.parse(data.SQL3);

        var data1 = '{"title": "Data", "subtitle": "' + datadisk[0].DATA_SIZE + ' Gb","ranges": [' + datadisk[0].USED_SIZE + ', ' + datadisk[0].DISK_SIZE + ', ' + datadisk[0].DISK_SIZE + '],"measures": [' + datadisk[0].DATA_SIZE + '],"markers": [' + datadisk[0].DISK_SIZE + ']}';
        var data2 = '{"title": "Log", "subtitle": "' + logdisk[0].DATA_SIZE + ' Gb","ranges": [' + logdisk[0].USED_SIZE + ', ' + logdisk[0].DISK_SIZE + ', ' + logdisk[0].DISK_SIZE + '],"measures": [' + logdisk[0].DATA_SIZE + '],"markers": [' + logdisk[0].DISK_SIZE + ']}';
        var data3 = '{"title": "Trace", "subtitle": "' + tracedisk[0].DATA_SIZE + ' Gb","ranges": [' + tracedisk[0].USED_SIZE + ', ' + tracedisk[0].DISK_SIZE + ', ' + tracedisk[0].DISK_SIZE + '],"measures": [' + tracedisk[0].DATA_SIZE + '],"markers": [' + tracedisk[0].DISK_SIZE + ']}';

        html = '<div id="bullet' + data.dwid + '1" class="diskbullet" style="margin-top:40px;"><svg></svg></div><div id="bullet' + data.dwid + '2" class="diskbullet"><svg></svg></div><div id="bullet' + data.dwid + '3" class="diskbullet"><svg></svg></div>';
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
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetInstanceDetails(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (VALUE)
    try {
        var html = "<table><tr><td><p class='t1-widget-text-big'>" + getScalarVal(data, 'SQL1', 'VALUE');
        html += "</td></tr><tr><td><font style='font-size: 40px; color: #999;'>" + getScalarVal(data, 'SQL2', 'VALUE') + "</font></p></td></tr></table>";
        html += "";
    } catch (err) {
        strContent = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}


function widgetUsedMemoryPie(data) {
    //Requires data.dwid, data.SQL1 (VALUE), data.SQL2 (VALUE)
    var html = "";
    try {
        var intPhysicalMem = getScalarVal(data, 'SQL1', 'VALUE');
        var intFreePhysicalMem = getScalarVal(data, 'SQL2', 'VALUE');
        html += "<div class='t1-widget-peity'>";
        //html += "<table width='100%'><tr>";
        html += "<span class='pie-memory' id='pie" + data.dwid + "'>" + intFreePhysicalMem + "/" + intPhysicalMem + "</span>";
        html += "<span class='w-usedmem-datapoint'><br />" + intFreePhysicalMem + " of " + intPhysicalMem + "Gb</span>";
        html += "</div>";
        $('#t1-widget-container' + data.dwid).html(html);
    } catch (err) {
        $('#t1-widget-container' + data.dwid).html('Error');
    }

    $('#pie' + data.dwid).peity('pie', {
        fill: function(_, i, all) {
            var col = '';
            if (i === 0) {
                if (parseInt(all[i]) >= parseInt(all[all.length - 1])) {
                    col = '#009DE0';
                } else if ((parseInt(all[i]) / parseInt(all[all.length - 1]) * 100) > 90) {
                    col = '#4D89F9';
                } else {
                    col = '#4D89F9';
                }
            } else {
                col = '#D4D4D4';
            }
            return col;
        }
    });
}

function widgetComponentOverview(data) {
    //Requires data.dwid, data.SQL1 (STATUS)
    var html;
    try {
        var datapoints = JSON.parse(data.SQL1);
        html = "<table width='100%'><tr>";

        html += "<td><div class='t1-widget-icon'>" + getIconForStatus(datapoints[0].STATUS) + "</div><br />";
        html += "<p class='t1-widget-icon-text'>CPU</p></td>";

        html += "<td><div class='t1-widget-icon'>" + getIconForStatus(datapoints[1].STATUS) + "</div><br />";
        html += "<p class='t1-widget-icon-text'>Data Disk</p></td>";

        html += "<td><div class='t1-widget-icon'>" + getIconForStatus(datapoints[2].STATUS) + "</div><br />";
        html += "<p class='t1-widget-icon-text'>Log Disk</p></td>";

        html += "<td><div class='t1-widget-icon'>" + getIconForStatus(datapoints[3].STATUS) + "</div><br />";
        html += "<p class='t1-widget-icon-text'>Trace Disk</p></td>";

        html += "<td><div class='t1-widget-icon'>" + getIconForStatus(datapoints[4].STATUS) + "</div><br />";
        html += "<p class='t1-widget-icon-text'>Statistics</p></td>";

        html += "</tr></table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function getIconForStatus(strStatus) {
    if (strStatus === 'OK') {
        return '<img src="img/OKIcon.png">';
    } else if (strStatus === 'WARNING') {
        return '<img src="img/WARNINGIcon.png">';
    } else {
        return '<img src="img/ERRORIcon.png">';
    }
}

function widgetSystemOverview(data) {
    //Requires data.dwid, data.SQL1 (SM), data.SQL2 (SM), data.SQL3 (VALUE), data.SQL4 (VALUE)
    var html;
    try {
        html = "<table class='w-misc-table'>";
        
        html += "<tr><td><div class='t1-widget-text-medium'>" + getScalarVal(data, 'SQL1', 'SM') + "%</div></td>";
        html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" + getScalarVal(data, 'SQL2', 'SM') + "GB</div></td>";
        html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" + getScalarVal(data, 'SQL3', 'VALUE') + "</div></td>";
        html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" + getScalarVal(data, 'SQL4', 'VALUE') + "</div></td></tr>";
    
        html += "<tr><td class='t1-widget-text-table'>Total CPU</td>";
        html += "<td class='t1-widget-text-table'>Memory</td>";
        html += "<td class='t1-widget-text-table'>Services Started</td>";
        html += "<td class='t1-widget-text-table'>Distributed</td></tr>";
    
        html += "</table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetTableSizes(data) {
    //Requires data.dwid, data.SQL1 (ROWS, COLS)
    var html;
    try {
        var datapoints = JSON.parse(data.SQL1);
        html = "<table class='w-misc-table' style='margin-top: 25px;'>";
    
        html += "<tr><td><div class='t1-widget-text-medium'>" + datapoints[0].rows + "<sup>GB</sup></div></td>";
        html += "<td class='w-misc-td'><div class='t1-widget-text-medium'>" + datapoints[0].cols + "<sup>GB</sup></div></td>";
    
        html += "<tr><td class='t1-widget-text-table'><img src='img/row-tables.png' />&nbsp;&nbsp;Rows</td>";
        html += "<td class='t1-widget-text-table'><img src='img/col-tables.png' />&nbsp;&nbsp;Columns</td>";
    
        html += "</table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetDBMemoryOverview(data) {
    //Requires data.dwid, data.SQL1 (ALLOCATION_LIMIT, PEAK, TOTAL_MEMORY_USED_SIZE)
    var html;
    try {
        var datapoints = JSON.parse(data.SQL1);
        html = "<table width='100%' style='align: center;'>";
    
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].ALLOCATION_LIMIT + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Allocated</td></tr>";
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].PEAK + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Peak</td></tr>";
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].TOTAL_MEMORY_USED_SIZE + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Used</td></tr>";
    
        html += "</table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetResMemoryOverview(data) {
    //Requires data.dwid, data.SQL1 (TOTAL_PHYSICAL_MEMORY, TOTAL_MEMORY, PHYSICAL_MEMORY)
    var html;
    try {
        var datapoints = JSON.parse(data.SQL1);
        html = "<table width='100%' style='align: center;'>";
    
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].TOTAL_PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Physical</td></tr>";
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].TOTAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB Total Resident</td></tr>";
        html += "<tr><td><div class='w-mem-td t1-widget-text-medium' style='text-align:right; line-height: 1.05;'>" + datapoints[0].PHYSICAL_MEMORY + "</div></td><td class='t1-widget-text-table w-memtext-td' style='text-align: left;'>&nbsp;GB DB Resident</td></tr>";
    
        html += "</table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}

function widgetFunnel(data) {
    //Requires data.dwid, data.SQL1 (STATUS)
    var html;
    try {
        var datapoints = JSON.parse(data.SQL1);
        html = "<table class='w-funnel-table'>";
    
        var itemmax = datapoints[0].STATUS;
        var itemmid = Math.round(((datapoints[1].STATUS / itemmax) * 100));
        var itemmin = Math.round((datapoints[2].STATUS / itemmax) * 100);
        var permax = (100 - (itemmid + itemmin));
    
        html += "<tr><td style='background-color: #f55b4c; width: 50px;'></td><td class='t1-widget-text-table' style='width: 50px; text-align:left; width: 70px; color: #f55b4c;padding-left: 10px; height: " + permax + "%;'>" + datapoints[0].STATUS + " Connections</td>";
        html += "<td rowspan='3' style='width: 200px;'><img src='img/funnel-summary.png' /><font style='font-size: 40px; color: #CCC;'>&nbsp;&nbsp;" + (parseInt(datapoints[0].STATUS) + parseInt(datapoints[1].STATUS) + parseInt(datapoints[2].STATUS)) + "</font></td><td rowspan='3'></td></tr>";
        html += "<tr><td style='background-color: #FFDD72; width: 50px;'></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #FFDD72; height: " + itemmid + "%'>" + datapoints[1].STATUS + " Idle</td></tr>";
        html += "<tr><td style='background-color: #5BD993; width: 50px;'></td></td><td class='t1-widget-text-table' style='text-align:left; padding-left: 10px; color: #5BD993; height: " + itemmin + "%'>" + datapoints[2].STATUS + " Running</td></tr>";
    
        html += "</table>";
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}



function widgetSystemAlerts(data) {
    //Requires data.dwid,
    var html;
    try {
        var arrAlerts = new Array([]);
        arrAlerts = JSON.parse(data.SQL1);
    
        //"[{"ALERT_DETAILS":"Error reading data from table STATISTICSSERVER.STAT_VIEW_HOST_BLOCKED_TRANSACTIONS (139 current operation cancelled by request and transaction rolled back:  [2625] execution plan aborted (HY000))","ALERT_RATING":"5","ALERT_TIMESTAMP":"2014-09-24 13:32:01.0000000","HOST":"*","ALERT_ID":"0","ALERT_NAME":"Internal statistics server problem","ALERT_DESCRIPTION":"Identifies internal statistics server problem.","ALERT_USERACTION":"Resolve the problem. For more information, see the trace files. You may need to activate tracing first."},{"ALERT_DETAILS":"1 new runtime dump file(s) found on host saphana","ALERT_RATING":"4","ALERT_TIMESTAMP":"2014-09-24 13:31:33.0000000","HOST":"*","ALERT_ID":"46","ALERT_NAME":"RTEdump files","ALERT_DESCRIPTION":"Identifies new runtime dump files (*rtedump*) have been generated in the trace directory of the system. These contain information about, for example, build, loaded modules, running threads, CPU, and so on.","ALERT_USERACTION":"Check the contents of the dump files."},{"ALERT_DETAILS":"Error reading data from table STATISTICSSERVER.HOST_VOLUME_IO_DETAILED_STATISTICS (3584 distributed SQL error:  [2617] executor: plan operation execution failed with an exception (HY000))","ALERT_RATING":"5","ALERT_TIMESTAMP":"2014-09-24 13:31:32.0000000","HOST":"*","ALERT_ID":"0","ALERT_NAME":"Internal statistics server problem","ALERT_DESCRIPTION":"Identifies internal statistics server problem.","ALERT_USERACTION":"Resolve the problem. For more information, see the trace files. You may need to activate tracing first."},{"ALERT_DETAILS":"There are currently 502 diagnosis files. This might indicate a problem with trace file rotation, a high number of crashes, or another issue.","ALERT_RATING":"2","ALERT_TIMESTAMP":"2014-09-24 13:16:46.0000000","HOST":"*","ALERT_ID":"50","ALERT_NAME":"Number of diagnosis files","ALERT_DESCRIPTION":"Determines the number of diagnosis files written by the system. An unusually large number of files can indicate a problem with the database (for example, problem with trace file rotation or a high number of crashes).","ALERT_USERACTION":"Investigate the diagnosis files."},{"ALERT_DETAILS":"The SAP_INTERNAL_HANA_SUPPORT role is currently granted to 1 user(s).","ALERT_RATING":"2","ALERT_TIMESTAMP":"2014-09-24 13:16:46.0000000","HOST":"*","ALERT_ID":"63","ALERT_NAME":"Granting of SAP_INTERNAL_HANA_SUPPORT role","ALERT_DESCRIPTION":"Determines if the internal support role (SAP_INTERNAL_HANA_SUPPORT) is currently granted to any database users.","ALERT_USERACTION":"Check if the corresponding users still need the role. If not, revoke the role from them."},{"ALERT_DETAILS":"Data backup does not exist. Without a data backup, your database cannot be recovered.","ALERT_RATING":"4","ALERT_TIMESTAMP":"2014-09-24 08:16:31.0000000","HOST":"*","ALERT_ID":"35","ALERT_NAME":"Existence of data backup","ALERT_DESCRIPTION":"Determines whether or not a data backup exists. Without a data backup, your database cannot be recovered.","ALERT_USERACTION":"Perform a data backup as soon as possible."},{"ALERT_DETAILS":"Your license will expire in 14 days. Once your license expires, you can no longer use the system, except to install a new license.","ALERT_RATING":"3","ALERT_TIMESTAMP":"2014-09-23 20:00:14.0000000","HOST":"*","ALERT_ID":"31","ALERT_NAME":"License expiry","ALERT_DESCRIPTION":"Determines how many days until your license expires. Once your license expires, you can no longer use the system, except to install a new license.","ALERT_USERACTION":"Obtain a valid license and install it. For the exact expiration date, see the monitoring view M_LICENSE."}]"
    
        html = "<div id='w-sysalerts-rotator'>";
    
        for (var i = 0; i < arrAlerts.length; i++) {
            var img;
            if (arrAlerts[i].ALERT_RATING === '4') {
                img = '<img src="img/ERRORIcon.png">';
            } else if (arrAlerts[i].ALERT_RATING === '2') {
                img = '<img src="img/WARNINGIcon.png">';
            } else {
                img = '<img src="img/OKIcon.png">';
            }
    
            html += "<div id='sysalert" + i + "'>";
            html += "<table class='w-sysalerts-table'>";
            html += "<tr>";
            html += "<td class='w-sysalerts-td'>" + img + "</td>";
            html += "<td class='w-sysalerts-text'>" + arrAlerts[i].ALERT_TIMESTAMP + "<br /><b>" + arrAlerts[i].ALERT_NAME + "</b><br />" + arrAlerts[i].ALERT_DETAILS + "</td>";
            html += "</tr>";
            html += "</table>";
            html += "</div>";
        }
    
        if (arrAlerts.length === 0) {
            html += "<div id='sysalert0'>";
            html += "<table class='w-sysalerts-table'>";
            html += "<tr>";
            html += "<td class='w-sysalerts-td'><img src='img/OKIcon.png'></td>";
            html += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
            html += "</tr>";
            html += "</table>";
            html += "</div>";
        }
    
        html += "</div>"; /* Close <div id="aniHolder"> */
    } catch (err) {
        html = 'Error';
    }
    
    $('#t1-widget-container' + data.dwid).html(html);

    widgetAlertRotator();
}

function widgetUserAlerts(data) {
    //Requires data.dwid, 
    var html;
    try {
        var arrAlerts = new Array([]);
        arrAlerts = JSON.parse(data.SQL1);
    
        //"[{"ALERT_ID":"17","OPERATOR":">","V1":"80","ACTUAL":"81","TO_CHAR(ADDED,'MM/DD/YY HH:MM:SS')":"09/05/14 12:09:15","VALUE":"80","NOTIFY":"","COND":"value","TITLE":"Sensor 1"},{"ALERT_ID":"17","OPERATOR":">","V1":"80","ACTUAL":"81","TO_CHAR(ADDED,'MM/DD/YY HH:MM:SS')":"09/04/14 10:09:15","VALUE":"80","NOTIFY":"","COND":"value","TITLE":"Sensor 1"},{"ALERT_ID":"17","OPERATOR":">","V1":"80","ACTUAL":"81","TO_CHAR(ADDED,'MM/DD/YY HH:MM:SS')":"08/29/14 12:08:24","VALUE":"80","NOTIFY":"","COND":"value","TITLE":"Sensor 1"},{"ALERT_ID":"17","OPERATOR":">","V1":"80","ACTUAL":"81","TO_CHAR(ADDED,'MM/DD/YY HH:MM:SS')":"08/29/14 10:08:08","VALUE":"80","NOTIFY":"","COND":"value","TITLE":"Sensor 1"},{"ALERT_ID":"17","OPERATOR":">","V1":"80","ACTUAL":"81","TO_CHAR(ADDED,'MM/DD/YY HH:MM:SS')":"08/29/14 10:08:13","VALUE":"80","NOTIFY":"","COND":"value","TITLE":"Sensor 1"}]"
    
        html = "<div id='w-useralerts-rotator'>";
    
        for (var i = 0; i < arrAlerts.length; i++) {
            var img;
            html += "<div id='useralert" + i + "'>";
            html += "<table class='w-sysalerts-table'>";
            html += "<tr>";
            html += "<td class='w-sysalerts-td' style='width: 1px;'><img src='img/WARNINGIcon.png'></td>";
            html += "<td class='w-sysalerts-text'>" + arrAlerts[i].ALERT_TIMESTAMP + "<br />" + arrAlerts[i].TITLE + "<br />Condition: <b>" + arrAlerts[i].ACTUAL + " " + arrAlerts[i].OPERATOR + " " + arrAlerts[i].VALUE + "</b></td>";
            html += "</tr>";
            html += "</table>";
            html += "</div>";
        }
    
        if (arrAlerts.length === 0) {
            html += "<div id='useralert0'>";
            html += "<table class='w-useralerts-table'>";
            html += "<tr>";
            html += "<td class='w-sysalerts-td'><img src='img/OKIcon.png'></td>";
            html += "<td class='w-sysalerts-text'><br /><b>No Alerts</b></td>";
            html += "</tr>";
            html += "</table>";
            html += "</div>";
        }
    
        html += "</div>"; /* Close <div id="aniHolder"> */
    } catch (err) {
        html = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);

    widgetUserAlertRotator();
}


function widgetSensorAPI(data) {
    //Requires data.dwid, data.VALUE, data.UOM1, data.TEXT1
    var html;
    try {
       html = '<div class="t1-widget-text-big">' + data.VALUE + '<sup>' + data.UOM1 + '</sup></div>';
        html += "<p class='w-sensor-text1'>" + data.TEXT1 + "</p>";
    } catch (err) {
        html = err;
    }
    $('#t1-widget-container' + data.dwid).html(html);
}


function metricHANAOverview(data) {
    //Requires data.dwid
    try {
        
        if (typeof window.m2DiskData === 'undefined') {
            window.m2DiskData = [];
            window.m2RAMData = [];
            window.m2CPUData = [];
            window.m2ConnectionsData = [];
            window.m2ActiveUsers = [];
            window.m2Timestamps = [];
        }
        
        window.m2Timestamps.push(moment().format('ll h:mm:ss a')); // Peity
        window.m2DiskData.push(getScalarVal(data, 'SQL1', 'DATA_DISK_SIZE')); // Peity
        window.m2RAMData.push(getScalarVal(data, 'SQL1', 'MEM')); // Peity
        window.m2ConnectionsData.push(getScalarVal(data, 'SQL1', 'RUNNING'));  // Peity
        window.m2ActiveUsers.push(getScalarVal(data, 'SQL1', 'ACTIVE'));
        window.m2CPUData.push(getScalarVal(data, 'SQL1', 'CPU')); // Peity
    
        //Trim large graphs to length
        if (window.m2DiskData.length > 50){
            window.m2DiskData.splice(0, 1);
            window.m2RAMData.splice(0, 1);
            window.m2CPUData.splice(0, 1);
            window.m2Timestamps.splice(0,1);
        }
        
        //Trim background/small graphs to length
        if (window.m2ConnectionsData.length > 10){
            window.m2ConnectionsData.splice(0, 1);
            window.m2ActiveUsers.splice(0, 1);
        }
    
    
        var html = "<div class='col-md-3' style='margin-top: 15px;'>";
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-11' id='connGraph' style='position: absolute; margin-top: 41px;'>";
                                html += "<span class='connections" + data.dwid + "'>" + window.m2ConnectionsData.toString() + "</span>";
                            html += "</div>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>Connections</div>";
                                html += "<div class='huge'>" + window.m2ConnectionsData[window.m2ConnectionsData.length - 1] + "</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-11' id='connGraph' style='position: absolute; margin-top: 41px;'>";
                                html += "<span class='activeusers" + data.dwid + "'>" + window.m2ActiveUsers.toString() + "</span>";
                            html += "</div>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>Active Users</div>";
                                html += "<div class='huge'>" + window.m2ActiveUsers[window.m2ActiveUsers.length - 1] + "</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>All Services Started</div>";
                                html += "<div class='huge'>OK</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>Blocked Transactions</div>";
                                html += "<div class='huge'>" + getScalarVal(data, 'SQL1', 'BLOCKED') + "</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>Unsuccessful Connections</div>";
                                html += "<div class='huge'>" + getScalarVal(data, 'SQL1', 'INVALID_CONS') + "</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
                html += "<div class='panel panel-primary'>";
                    html += "<div class='panel-heading'>";
                        html += "<div class='row'>";
                            html += "<div class='col-xs-12 text-left'>";
                                html += "<div>System Type</div>";
                                html += "<div class='huge'>Single</div>";
                            html += "</div>";
                        html += "</div>";
                    html += "</div>";
                html += "</div>";
                
            html += "</div>";
            
            html += "<div class='col-md-9' style='padding-right: 60px;'>";
                html += "<div class='row' style='margin-top: 30px;'>";
                    html += "<span class='pull-right'><h4 id='dt'>" + moment().format('ll h:mm:ss a') + "</h4></span>";
                html += "</div>";
                html += "<div class='row' style='margin-top: 50px;'>";
                    html += "<h3 class='pull-left' style='color: #999; z-index: 9992; margin-bottom: 10px;'>CPU</h3><span class='label label-default pull-right' style='z-index: 9993;'>" + window.m2CPUData[window.m2CPUData.length - 1] + "%</span>";
                    html += "<span class='cpu" + data.dwid + "'>" + window.m2CPUData.toString() + "</span>";
                html += "</div>";
                html += "<div class='row' style='margin-top: 50px;'>";
                    html += "<h3 class='pull-left' style='color: #999; z-index: 9990; margin-bottom: 10px;'>Memory</h3><span class='label label-default pull-right' style='z-index: 9991;'>" + window.m2RAMData[window.m2RAMData.length - 1] + "GB</span>";
                    html += "<span class='ram" + data.dwid + "'>" + window.m2RAMData.toString() + "</span>";
                html += "</div>";
                html += "<div class='row' style='margin-top: 50px;'>";
                    html += "<h3 class='pull-left' style='color: #999; z-index: 9994; margin-bottom: 10px;'>Data Disk</h3><span class='label label-default pull-right' style='z-index: 9995;'>" + window.m2DiskData[window.m2DiskData.length - 1] + "GB</span>";
                    html += "<span class='disk" + data.dwid + "'>" + window.m2DiskData.toString() + "</span>";
                html += "</div>";
            html += "</div>";
            
        $('#t1-widget-container' + data.dwid).html(html);
        
        //Small background charts
        $('.connections' + data.dwid).peity('bar', {
                width: $("#connGraph").width(),
                height: 40,
                fill: ["#F7F7F7"]
        });
        
        $('.activeusers' + data.dwid).peity('bar', {
                width: $("#connGraph").width(),
                height: 40,
                fill: ["#F7F7F7"]
        });
        
        
        //Larger Charts
        $('.cpu' + data.dwid).peity('bar', {
                width: parseInt(data.width) * 175,
                height: 200,
                fill: ["#2A89C1"]
        });
        
        $('.ram' + data.dwid).peity('bar', {
                width: parseInt(data.width) * 175,
                height: 200,
                fill: ["#8FBC8F"]
        });
        
        $('.disk' + data.dwid).peity('line', {
                width: parseInt(data.width) * 175,
                height: 200,
                fill: ["#778899"]
        });
        
        $('rect').hover(
            function(){
                $("#dt").html(window.m2Timestamps[$(this).index()]);
            }
        );
        
        
    } catch (err) {
        html = err;
    }
    
}

function metricLabel(data) {
    //Requires data.dwid, data.TEXT
    try {
        var html = "<p class='metric-label' style='color: " + data.FONTCOLOR + "; font-size: " + data.FONTSIZE + "; text-align: " + data.FONTALIGN + ";'>" + data.TEXT1 + "</p>";
    } catch (err) {
        strContent = 'Error';
    }
    $('#t1-widget-container' + data.dwid).html(html);
}
