// -------------------------   Global Vars and Initialize ----------------------- //
var userToken = 0;
var intCurrentDashboardID = 1;
var timers = new Array();
var gridsterloaded = 0;
var strNotificationTable = '';
var strCarousel = '';
var strHistoryTable = '';
var chart = nv.models.lineChart();
var navMenu = '';
var useremail = '';
var showTour = true;
var tour;

$( document ).ready(function() {
    configureLeftMenu();
    getUserToken();
    console.log(userToken);
	if (userToken === '' || userToken === 0 || !userToken){
        doLogout();
    } else {
        init();
    }
    dashboardActive(false);
    $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
    configureClickEvents();
    if (showTour == true){
        configureTour();
    }
});

function init(){
    getDataSet({ strService: 'Dashboards' });
    getDataSet({ strService: 'DBInfo' });
    getDataSet({ strService: 'UserInfo' });
}

// -------------------------   Demo/Tutorial Walk Through Tour ----------------------- //






// -------------------------   Client Side click events ----------------------- //
    
function configureClickEvents(){
    $('#btnAddWidget, #mnuAddWidget').click(function(){
        getDataSet({
            strService: 'GetWidgetTypes',
            intWidgetGroup: 0
        });
    });
                
    $('#btnAddDashboard, #mnuAddDashboard').click(function(){
        getDataSet({ strService: 'AddDashboardDialog'});
    });
                
    $('#btnEditDashboard').click(function(){
        getDataSet({ 
            strService: 'EditDashboardDialog',
            strDashboardID: intCurrentDashboardID    
        });
    });
    
    $('#mnuProfile, btnProfile').click(function(){
        getDataSet({ strService: 'EditProfileDialog'});
    });
    
    $('#mnuSettings, btnSettings').click(function(){
        getDataSet({ strService: 'EditSettingsDialog'});
    });
    
     $('#btnShowHelp').click(function(){
        tour.restart();
    });
                
    $('#mnuLogout').click(function(){
        doLogout();
    });
                
    $('#mnuShowFullscreen').click(function(){
        $('#main').toggleFullScreen();
    });
                
    $('#btnShowAlerts, #mnuShowAlerts').click(function(){
        getDataSet({ strService: 'Alerts'});
    });
                
    $('#chkStreaming').click(function(){
        toggleStreaming();
    });
                
    $('#btnModalDelete').click(function(){
        deleteDialog($('#modal-header').html());
    });
                
    $('#btnModalSave').click(function(e){
        saveDialog($('#modal-header').html());
        e.stopImmediatePropagation();
    });
                
    $('body').on("click",".toggle-menu",function( e ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $('nav#menu').trigger( 'open.mm' );
    });
    
    $('#btnSideBar').click(function(e){
        if ($('#logoarea').css("display") == "block"){
            $('#logoarea').css("display", "none");
            $('#main').css("margin-left","0");
            /*$('#header .tools-bar').css("margin-left","0");*/
        } else {
            $('#logoarea').css("display", "block");
            $('#main').css("margin-left","270px");
            /*$('#header .tools-bar').css("margin-left","250px");*/
        }
    });
}

function configureGristerClickEvents(){
    $("[id^=tile_]").mouseover(function(e) {
        var tileID = this.id.substring(5);
        $('#editicon' + tileID).animate({ 'opacity': 1 },0);
        $('#historyicon' + tileID).animate({ 'opacity': 1 },0);
    });
                    
    $("[id^=tile_]").mouseout(function(e) {
        var tileID = this.id.substring(5);
        $('#editicon' + tileID).animate({ 'opacity': 0 },0);
        $('#historyicon' + tileID).animate({ 'opacity': 0 },0);
    });
                
    $("[id^=editicon]").click(function(e) {
        getDataSet({
            strService: 'EditWidgetDialog',
            strDashboardWidgetID: this.id.substring(8)
        })
        e.stopPropagation();
    });
					
    $("[id^=historyicon]").click(function(e) {
        showHist(this.id.substring(11));
        e.stopPropagation();
    });
                    
	$("[id^=refreshicon]").click(function(e) {
        getDataSet({
            strService: 'RefreshWidget',
            strDashboardWidgetID: this.id.substring(11)
        });
        e.stopPropagation();
    });
                    
    $("[id^=tile_]").click(function(e) {
		saveGridPosition();
    });
}


// -------------------------   Profile ----------------------- //

function configureGravatar(){
    if(typeof $gravatarEmail != 'undefined'){
		if ($gravatarEmail.length > 0){
			$imgTmp = $.gravatar($gravatarEmail);
            $imgTmp2 = $.gravatar($gravatarEmail);
            $('#gravSm').empty().append($imgTmp2);
            $('#gravSm img').addClass('circular-avatar-sm');
            $('#grav').empty().append($imgTmp);
            $('#grav img').addClass('circular-avatar-bg');
        }
	}
}


// -------------------------   Menus/toolbars ----------------------- //
    
function configureLeftMenu(){
    navMenu=$("nav#menu");

    navMenu.each(function(i) {
        var nav=$(this), data=nav.data();
        nav.mmenu({
            searchfield   :  true,
            slidingSubmenus : true
        }).on( "closing.mm", function(){
            var highest=$(this).find("ul.mm-highest");
            highest.find(".mm-subclose").trigger('click');
            setTimeout(function () { closeSub() }, 200);
        });
    });
    
    $("body").append('<div class="toggle-menu"/>');
}


function dashboardActive(boolState){
    if (boolState){
        $('#btnAddWidget').show();
        $('#btnEditDashboard').show();
        $('#btnAddDashboard').addClass('h-seperate');
    } else {
        $('#btnAddWidget').hide();
        $('#btnEditDashboard').hide();
        $('#btnAddDashboard').removeClass('h-seperate');
        $('#dashboardname').html('');
	}
}
	
function closeLeftMenu(){
    closeSub();
}
   
   
function toggleFullscreen() {
    $(document).toggleFullScreen();
}
   
    
// function Auto close sub menu
function closeSub(){
    if(navMenu.hasClass("mm-vertical")){
        navMenu.find("li").each(function(i) {
            $(this).removeClass("mm-opened");	
        });
    }else{
        navMenu.find("ul").each(function(i) {
            if(i === 0){
                $(this).removeClass("mm-subopened , mm-hidden").addClass("mm-current");	
            }else{
                $(this).removeClass("mm-opened , mm-subopened , mm-current  , mm-highest").addClass("mm-hidden");						
            }	
        });
    }
}

function toggleStreaming(){
    if ($('#streaming').is(':checked')){
        //Switch streaming on
        loadDynamicJScript('script', '');
    } else {
        //Switch it off
        clearTimers();
    }
}



function loadInstanceData(arrData){
    var osversion = arrData[4]['VALUE'];
	var dt = arrData[6]['VALUE'].split(' ');
	var dbversion = arrData[3]['VALUE'].split(' ')[0];
	osversion = osversion.replace('SUSE Linux Enterprise Server', 'SLES');
						
	$("#serverinfo").append('<li><div class="pull-right">' + arrData[0]['VALUE'] + '</div><label>Instance ID</label></li>');
	$('#instanceid').html('on ' + arrData[0]['VALUE']);
	$("#serverinfo").append('<li><div class="pull-right">' + arrData[1]['VALUE'] + '</div><label>Instance No</label></li>');
	$("#serverinfo").append('<li>&nbsp;</li>');
	$("#serverinfo").append('<li><div class="pull-right">' + dbversion + '</div><label>DB Version</label></li>');
	$("#serverinfo").append('<li><div class="pull-right">' + osversion + '</div><label>OS Version</label></li>');
	$("#serverinfo").append('<li>&nbsp;</li>');
	$("#serverinfo").append('<li><div class="pull-right">' + dt[0] + '</div><label>Start Date</label></li>');
	$("#serverinfo").append('<li><div class="pull-right">' + dt[1].split('.')[0] + '</div><label>Start Time</label></li>');
}


// -------------------------   User functions ----------------------- //


function doLogout(){
    userToken = '';
	$.removeCookie('userToken');
	window.location = "login.html";
}

function getUserToken(){
    userToken = $.cookie('userToken');
    $gravatarEmail = $.cookie('tmpEmail');
}

function loadUserData(arrData){
    $gravatarEmail = arrData[0]['EMAIL'];
	configureGravatar();
	$('#usersname em').html(arrData[0]['NAME'] + ' ' + arrData[0]['LNAME']);
	$('#gravUsersname').html(arrData[0]['NAME'] + ' ' + arrData[0]['LNAME']);
}


// -------------------------   Client Side Dashboard functions (loading, processing, etc.) ----------------------- //
	
function loadDashboards(objDashboards){
	var len = objDashboards.length;
	
	$("#dashboards").html('');
	$( "ul:eq( 1 )" ).empty();
	
	$( "ul:eq( 1 )" ).append("<li><a href='#' id='mnuAddDashboard'><i class='icon fa fa-plus'></i> Add a Dashboard </a></li>");
	
	if (len > 0){
        for (var i = 0;i < len; ++i) {
            var dashboardid = objDashboards[i].DASHBOARD_ID;
			$("#dashboards").append("<li id='dashboard" + dashboardid + "' data-id='" + dashboardid + "'><a href='#'>" + objDashboards[i].TITLE + "</a></li>");
			$("#dashboard" + dashboardid).click(function() {
                getContent($(this).data('id'));
                $('#dashboardname').html($(this).html());
                return false;
            });
            
            $( "ul:eq( 1 )" ).append("<li id='dashboardmenu" + dashboardid + "' data-id='" + dashboardid + "' title='" + objDashboards[i].TITLE + "'><a href='#' ><i class='icon fa fa-th'></i>" + objDashboards[i].TITLE + "</a></li>");
            $("#dashboardmenu" + dashboardid).click(function() {
                getContent($(this).data('id'));
                $('#dashboardname').html("<a href='#'>" + $(this).attr('title') + "</a>");
                closeLeftMenu();
                return false;
            });
        }
    }
    
     $('#mnuAddDashboard').click(function(){
        getDataSet({ strService: 'AddDashboardDialog'});
    });
    
    if (intCurrentDashboardID == 1){
        getContent($("#dashboards li:first").data("id"));
        $('#dashboardname').html($("#dashboards li:first").html());
    }
}
    
function getContent(sId){
    intCurrentDashboardID = sId;
    getDataSet({
        strService: 'Widgets',
        strDashboardID: intCurrentDashboardID
    });
}
			
			
function loadDynamicJScript(elemName, elemID){
    if (elemID === ''){
        clearTimers();
                
		$("[name^=" + elemName + "]").each(function() {
            eval(this.innerHTML);
		});
    } else {
        var myScripts = document.getElementById(elemID).getElementsByTagName(elemName);
        if (myScripts.length > 0) {
			for(var i=0; i<myScripts.length; i++) {
				eval(myScripts[i].innerHTML);
			}
		}
    }
}
	
function clearTimers(){
	for (var i = 0; i < timers.length; i++)
    {
        clearTimeout(timers[i]);
    }
}


function loadWidgetContent(objWidgets){
    var len = objWidgets.length;
    var ob;
    $.ajaxSetup({
        cache: false
    });
    if (len > 0){
        for (var i = 0;i < len; ++i) {
            ob = objWidgets[i];
            var url = 'js/widgets/' + ob.codetype + '.js';
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "js/widgets/" + ob.codetype + ".css"
            }).appendTo("head");
            
            $.getScript( url, function() {
                    window[ob.codetype](ob);
                    timers.push(setTimeout(function() {getDataSet({strService: 'RefreshWidget', strDashboardWidgetID: ob.dwid});}, ob.refresh));
            });
        }
    }
}
		


// -------------------------   Server side processesing ----------------------- //
	
function getDataSet(options) {
    $("#loadspinner").css('display','block');
    var html = '';
    var jURL = 'lib/api.xsjs';
    
    jQuery.ajax({
        url:jURL,
        type: 'GET',
        data:{
            service: options.strService,
            usertoken: userToken,
            dashboardid: options.strDashboardID,
            gridpos: options.strGridPos,
            dashboardwidgetid: options.strDashboardWidgetID,
            widgetid: options.strWidgetID,
            alertid: options.strAlertID,
            alertstatus: options.intAlertStatus,
            widgetgroup: options.intWidgetGroup,
            startdt: options.strStartDt,
            enddt: options.strEndDt,
            SQL: options.strSQL
        },
        success: function(data) {
            if (options.strService == 'DBInfo') {
                var objData = jQuery.parseJSON(data);
				var arrData = JSON.parse(objData.dbinfo);
				loadInstanceData(arrData);
            } else if (options.strService == 'UserInfo') {
                var objData = jQuery.parseJSON(data);
				var arrData = JSON.parse(objData.dbinfo);
				loadUserData(arrData);
            } else if (options.strService == 'Dashboards') {
                var objData = jQuery.parseJSON(data);
                loadDashboards(JSON.parse(objData.dashboards));
            } else if (options.strService == 'Position') {
                //addNotification('Positions updated', 0);
            } else if (options.strService == 'Widgets') {
                document.getElementById("grid").innerHTML = data;
                /*
                var objData = jQuery.parseJSON(data);
				document.getElementById("grid").innerHTML = objData.html;
				loadWidgetContent(JSON.parse(objData.widgets));
                */
				loadGridster();
				loadDynamicJScript('script', '');
				dashboardActive(true);
				//Change: 001
			    //getDataSet({ strService: 'WidgetContents', strDashboardID: options.strDashboardID });
			} else if (options.strService == 'WidgetContents') {
                loadWidgetContent(JSON.parse(data));
            } else if (options.strService == 'RefreshWidget') {
                var elemID = "t1-widget-container" + options.strDashboardWidgetID;
                document.getElementById(elemID).innerHTML = data;
				loadDynamicJScript('script', elemID);
				//Change: 001
				//ob = JSON.parse(data);
				//window[ob.codetype](ob)
			} else if (options.strService == 'EditWidgetDialog') {
			    //dialogConstructor(strDialogTitle, boolDeleteBtn, boolSaveBtn, strData, intSize, boolDisplay)
                dialogConstructor("Edit Widget", true, true, data, 1, true);
            } else if (options.strService == 'NewWidgetDialog') {
                dialogConstructor("New Widget", false, true, data, 3, true);
            } else if (options.strService == 'WidgetHistoryDialog') {
                dialogConstructor("Widget History", true, false, data, 2, false);
				widgetHistoryChart(data, options.strDashboardWidgetID, options.strStartDt, options.strEndDt);
				$('#myModal').appendTo("body").modal('show');
				$('#modal-header').html($('#widget-header' + options.strDashboardWidgetID).text() + ' History');
			} else if (options.strService == 'WidgetForecastDialog') {
			    dialogConstructor("Widget Forecast (Avg/h)", false, false, data, 2, true);
				widgetForecastChart(data, options.strDashboardWidgetID);
				$('#modal-header').html($('#widget-header' + options.strDashboardWidgetID).text() + ' Forecast (Avg/h)');
            } else if (options.strService == 'AlertHistoryDialog') {
                dialogConstructor("Alert History", false, false, data, 2, true);
                strHistoryTable = data; //Save for later
                alertHistoryTable(1);
			} else if (options.strService == 'DeleteWidget') {
                addNotification('Metric Deleted', 3);
            } else if (options.strService == 'AddDashboardDialog') {
                dialogConstructor("Add Dashboard", false, true, data, 1, true);
            } else if (options.strService == 'EditDashboardDialog') {
                dialogConstructor("Edit Dashboard", true, true, data, 1, true);
            } else if (options.strService == 'EditProfileDialog') {
                dialogConstructor("Edit Profile", false, true, data, 1, true);
            } else if (options.strService == 'EditSettingsDialog') {
                dialogConstructor("Edit Settings", false, true, data, 1, true);
            }  else if (options.strService == 'GetWidgetTypes') {
				dialogConstructor("Select a Widget", false, true, getNewWidgetHTML(JSON.parse(data)), 3, true);
				configureWidgetCarousel();
            }  else if (options.strService == 'Alerts') {
                dashboardActive(false);
				document.getElementById('grid').innerHTML = data;
            } else if (options.strService == 'AddAlert') {
                dialogConstructor("Add Alert", false, true, data, 1, true);
			} else if (options.strService == 'EditAlert') {
                dialogConstructor("Edit Alert", true, true, data, 1, true);
			} else if (options.strService == 'DeleteAlert') {
                document.getElementById('grid').innerHTML = data;
				addNotification('Alert Deleted', 0);
			} else if (options.strService == 'SetAlert') {
                document.getElementById('grid').innerHTML = data;
                addNotification('Alert Status Set', 0);
			} else if (options.strService == 'ClearAlert') {
                document.getElementById('grid').innerHTML = data;
				addNotification('Alert History Cleared', 0);
			} else if (options.strService == 'CreateDashboard') {
                getDataSet({ strService: 'Dashboards'});
                saveFeedEvent("Dashboard created", 0);
            } else if (options.strService == 'UpdateDashboard') {
                getDataSet({ strService: 'Dashboards'});
                saveFeedEvent("Dashboard updated", 0);
            }
            
            if (options.strReload == 'true') {
                location.reload();
            } else if (options.strReload == 'alerts') {
                getDataSet({ strService: 'Alerts' });
            } else if (options.strReload == 'dashboard') {
                getContent(intCurrentDashboardID);
            } else if (options.strReload == 'dashboards') {
                getDataSet({ strService: 'Dashboards' });
            }
			
			$("#loadspinner").css('display','none');
        },
        error : function(jqXHR, textStatus, errorThrown) {
            addNotification('Error', 3);
            console.log(textStatus);
			$("#loadspinner").css('display','none');
        }
    });
}