// -------------------------   Global Vars and Initialize ----------------------- //
var m2version = "Version 2.5.2";
var sessionToken = 0;
var intCurrentDashboardID = 1; //If this equals 1, the first dashboard will be loaded
var arrActiveTimers = [];
var arrActiveTimersIDList = [];
var alertlist = [];
var timers = [];
var gridsterloaded = 0;
var strNotificationTable = "";
var strCarousel = "";
var strHistoryTable = "";
var chart = nv.models.lineChart();
var navMenu = "";
var useremail = "";
var showTour = true;
var viewmode = "";
var tour;
var debugmode = "hidden"; /*display*/
var strNoDashboardMsg = "<p align='center' style='padding: 10px;'>Hmmm, it looks like you dont have any dashboards,<br /> click on the <i class='fa fa-plus fa-2x' style='padding: 0 10px 10px;'></i> icon to get started.</li>";
var strNoWidgetMsg = "<p align='center' style='padding: 10px;'>Your dashboard would look way better with some data,<br /> click on the <i class='fa fa-tachometer fa-2x' style='padding: 0 10px 10px;'></i> icon to add a few metrics.</li>";
var strInputControl = "";
var intGoogleAPIValidationAttempts = 0;
var intGithubPIValidationAttempts = 0;

var objWidgets = {};
var objWidgetList = {};

$(document).ready(function() {
    init();
});

function init() {
    
    $('[data-toggle="popover"]').popover();
    
    if (parseParams("did").length > 0) {
        viewmode = "dashboard";
        sessionToken = "temp";
        showTour = false;
        //Show single, read only dashboard
        // 1. Check if token valid -> otherwise logout
    } else if (parseParams("mid").length > 0) {
        //This is metric view mode, only server up iframe of single metric
        $("#body").css("background-color", "rgba(247,247,247,0.0)");
        $("#body").html("<div id='grid'></div>");
        viewmode = "metric";
        sessionToken = "temp";
        showTour = false;
    } else {
        viewmode = "";
        getSessionToken();
    }
    
    if (sessionToken === "" || sessionToken === 0 || !sessionToken) {
        doLogout();
    }
    
    configureLeftMenu();
    
    if (viewmode === "metric"){
        getDataSet({
            service: "InitViewMetric",
            dashboardwidgetid: parseParams("mid")
        });
    } else {
        getDataSet({
            service: "Init",
            dashboardid: parseParams("did")
        });
    }
    
    if (viewmode === "dashboard" || viewmode === "metric"){
        $(".navbar-right").html("<li><a>View Mode</a></li>");
    } else {
        dashboardActive(true);
        configureClickEvents();
    }
    
    
    $("[data-toggle='tooltip']").tooltip({
        "placement": "bottom"
    });
    
    if (showTour === true) {
        configureTour();
    }
}

// -------------------------   Demo/Tutorial Walk Through Tour ----------------------- //

function toggleSideBar(){
    if ($("#logoarea").css("display") == "block") {
        $("#logoarea").css("display", "none");
        $("#main").css("margin-left", "0");
    } else {
        $("#logoarea").css("display", "block");
        $("#main").css("margin-left", "270px");
    }
}


// -------------------------   Profile ----------------------- //

function configureGravatar() {
    if (typeof $gravatarEmail != "undefined") {
        if ($gravatarEmail.length > 0) {
            $imgTmp = $.gravatar($gravatarEmail);
            $imgTmp2 = $.gravatar($gravatarEmail);
            $("#gravSm").empty().append($imgTmp2);
            $("#gravSm img").addClass("circular-avatar-sm");
            $("#grav").empty().append($imgTmp);
            $("#grav img").addClass("circular-avatar-bg");
        }
    }
}


// -------------------------   Menus/toolbars ----------------------- //

function configureLeftMenu() {
    navMenu = $("nav#menu");

    navMenu.each(function(i) {
        var nav = $(this),
            data = nav.data();
        nav.mmenu({
            searchfield: true,
            slidingSubmenus: true
        }).on("closing.mm", function() {
            var highest = $(this).find("ul.mm-highest");
            highest.find(".mm-subclose").trigger("click");
            setTimeout(function() {
                closeSub()
            }, 200);
        });
    });

    $("body").append("<div class='toggle-menu' />");
}


function dashboardActive(boolState) {
    if (boolState) {
        $("#btnAddWidget").show();
        $("#btnEditDashboard").show();
        $("#btnAddDashboard").addClass("h-seperate");
        $("#btnAddAlert").hide();
    } else {
        $("#btnAddAlert").show();
        $("#btnAddWidget").hide();
        $("#btnEditDashboard").hide();
        $("#btnAddDashboard").removeClass("h-seperate");
        $("li.active").removeClass("active");
        clearTimers();
    }
}

function closeLeftMenu() {
    closeSub();
}


function loadAlertScreen(){
    $("#myAlertModal").modal("hide");
    dashboardActive(false);
    getDataSet({
        service: "Alerts"
    });
}

function toggleFullscreen() {
    $(document).toggleFullScreen();
}


// function Auto close sub menu
function closeSub() {
    if (navMenu.hasClass("mm-vertical")) {
        navMenu.find("li").each(function(i) {
            $(this).removeClass("mm-opened");
        });
    } else {
        navMenu.find("ul").each(function(i) {
            if (i === 0) {
                $(this).removeClass("mm-subopened , mm-hidden").addClass("mm-current");
            } else {
                $(this).removeClass("mm-opened , mm-subopened , mm-current  , mm-highest").addClass("mm-hidden");
            }
        });
    }
}

function toggleStreaming() {
    if ($("#chkStreaming").is(":checked")) {
        //Switch streaming on
        loadTimers();
    } else {
        //Switch it off
        clearTimers();
    }
}

function loadTimers(){
    $.each(objWidgets, function(key, value) {
        if (objWidgets[key].refresh !== 0) {
            arrActiveTimersIDList.push(objWidgets[key].dwid);
            arrActiveTimers.push(setTimeout(function() {
                getDataSet({
                    service: "RefreshWidget",
                    dashboardwidgetid: objWidgets[key].dwid
                });
            }, objWidgets[key].refresh));
        }
    });
}



function loadInstanceData(arrData) {
    var osversion = arrData[4]["VALUE"];
    var dt = arrData[6]["VALUE"].split(" ");
    var dbversion = arrData[3]["VALUE"].split(" ")[0];
    osversion = osversion.replace("SUSE Linux Enterprise Server", "SLES");

    $("#serverinfo").append("<li><div class='pull-right'>" + arrData[0]["VALUE"] + "</div><label>Instance ID</label></li>");
    $('#instanceid').html("on " + arrData[0]['VALUE']);
    $("#serverinfo").append("<li><div class='pull-right'>" + arrData[1]["VALUE"] + "</div><label>Instance No</label></li>");
    $("#serverinfo").append("<li>&nbsp;</li>");
    $("#serverinfo").append("<li><div class='pull-right'>" + dbversion + "</div><label>DB Version</label></li>");
    $("#serverinfo").append("<li><div class='pull-right'>" + osversion + "</div><label>OS Version</label></li>");
    $("#serverinfo").append("<li>&nbsp;</li>");
    $("#serverinfo").append("<li><div class='pull-right'>" + dt[0] + "</div><label>Start Date</label></li>");
    $("#serverinfo").append("<li><div class='pull-right'>" + dt[1].split(".")[0] + "</div><label>Start Time</label></li>");
}


// -------------------------   User functions ----------------------- //


function doLogout() {
    sessionToken = "";
    $.removeCookie("sessionToken");
    window.location = "./login";
}

function getSessionToken() {
    sessionToken = $.cookie("sessionToken");
    $gravatarEmail = $.cookie("tmpEmail");
}

function loadUserData(arrData) {
    $gravatarEmail = arrData[0]["EMAIL"];
    configureGravatar();
    $("#usersname em").html(arrData[0]["NAME"] + " " + arrData[0]["LNAME"]);
    $("#gravUsersname").html(arrData[0]["NAME"] + " " + arrData[0]["LNAME"]);
}


// -------------------------   Client Side Dashboard functions (loading, processing, etc.) ----------------------- //

function loadDashboards(objDashboards) {
    var len = objDashboards.length;

    $("ul:eq(1)").empty();
    $("ul:eq(1)").append("<li><a href='#' id='mnuAddDashboard'><i class='icon fa fa-plus'></i> Add a Dashboard </a></li>");
    $("#dashboards").empty();
    $("#dashboards").append("<li><a href='#sidebar' id='btnSideBar' class='icon-toolsbar'><i class='fa fa-bars'></i></a></li>");
    
    if (len > 0) {
        for (var i = 0; i < len; ++i) {
            var dashboardid = objDashboards[i].DASHBOARD_ID;
            var shareurl = objDashboards[i].SHARE_URL;
            var bgurl = objDashboards[i].BG_URL;
            //Load top menu bar with dashboards
            $("#dashboards").append("<li id='dashboard" + dashboardid + "' data-id='" + dashboardid + "' data-shareurl='" + shareurl + "' data-bgurl='" + bgurl + "'><a href='#'>" + objDashboards[i].TITLE + "</a></li>");
            $("#dashboard" + dashboardid).click(function() {
                getContent($(this).data("id"));
                intDashboardID = $(this).data("id");
                return false;
            });
            //Load left menu with dashboards
            $("ul:eq( 1 )").append("<li id='dashboardmenu" + dashboardid + "' data-id='" + dashboardid + "' data-shareurl='" + shareurl + "' data-bgurl='" + bgurl + "' title='" + objDashboards[i].TITLE + "'><a href='#' ><i class='icon fa fa-th'></i>" + objDashboards[i].TITLE + "</a></li>");
            $("#dashboardmenu" + dashboardid).click(function() {
                getContent($(this).data("id"));
                intDashboardID = $(this).data("id");
                closeLeftMenu();
                return false;
            });
        }
    }
    
    $("#btnSideBar").click(function(e) {
        toggleSideBar();
    });
    
    $("#mnuAddDashboard, #btnAddDashboardTab").click(function() {
        showDashboardDialog(null, false);
    });
    
    if (intCurrentDashboardID == 1) {
        getContent($("#dashboards li:eq(1)").data("id"));
    } else if (intCurrentDashboardID !== "") {
        $("li[data-id='" + intCurrentDashboardID +"']").addClass("active");
    }
    
    if ($("#grid").html().indexOf("looks like") > 0) {
        $("#grid").html(strNoWidgetMsg);
    }
    
    loadDashboardSortable();
}

function loadDashboardSortable(){
    $( "#dashboards" ).sortable({
        helper : "clone"
    });
    $( "#dashboards" ).disableSelection();
    $( "#dashboards" ).sortable({
        stop: function( ) {
            var order = JSON.stringify($("#dashboards").sortable("toArray"));
            getDataSet({
                service: "SaveDashboardPositions", 
                dashboardpos: order
            });
        }
    });
}

function loadBGImg(){
    if ($("li.active").data("bgurl") !== "" && typeof $("li.active").data("bgurl") !== "undefined"){
        $("#content").css("background", "url(" + $("li.active").data("bgurl") + ")  no-repeat center center fixed");
        $("#content").addClass("dashboardbackground");
        $(".t1-widget-div").addClass("metricopacity");
    } else {
        $("#content").css("background", "none");
        $("#content").removeClass("dashboardbackground");
        $(".t1-widget-div").removeClass("metricopacity");
    }
}

function getContent(sId) {
    intCurrentDashboardID = sId;
    
    $("li.active").removeClass("active");
    $("li[data-id='" + sId +"']").addClass("active");
    
    if (typeof sId != "undefined") {
        clearTimers();
        getDataSet({
            service: "Widgets",
            dashboardid: intCurrentDashboardID
        });
    } else {
        $("#grid").html(strNoDashboardMsg);
    }
}

function clearTimers() {
    for (var i = 0; i < arrActiveTimers.length; i++) {
        clearTimeout(arrActiveTimers[i]);
    }
    arrActiveTimersIDList = [];
    arrActiveTimers = [];
}

function loadClientMetrics(objData) {
    showLoadingSpinner(true, "Loading metrics");
    $.each(objData.widgetData, function(key, value) {
        window[objData.widgetData[key].code](objData.widgetData[key]);
        
        if (objData.widgetData[key].Alert) {
            addNotification(this.Alert, 1, true);
        }
        
        var itemidx = arrActiveTimersIDList.indexOf(objData.widgetData[key].dwid);
        if (itemidx > -1){
            arrActiveTimersIDList.splice(itemidx, 1);
            arrActiveTimers.splice(itemidx, 1);
        }
        
        if (objData.widgetData[key].refresh !== 0 && typeof objData.widgetData[key].refresh !== "undefined") {
            arrActiveTimersIDList.push(objData.widgetData[key].dwid);
            arrActiveTimers.push(setTimeout(function() {
                getDataSet({
                    service: "RefreshWidget",
                    dashboardwidgetid: objData.widgetData[key].dwid,
                    refreshrate: objData.widgetData[key].refresh
                });
            }, objData.widgetData[key].refresh));
        }
    });
    objWidgets = objData.widgetData;
    showLoadingSpinner(false, "");
}

function loadMetrics(objData) {
    var strContent = "<div class='gridster' id='gridster'><ul id='gridtiles'>";
    showLoadingSpinner(true, "Loading metrics");
    $.each(objData.widgetData, function(key, value) {
        var intDashboardWidgetID = objData.widgetData[key].dwid;
        var title = objData.widgetData[key].title;

        if (typeof title === undefined) {
            title = "";
        }
        
        if (objData.widgetData[key].type == "Label") {
            strContent += "<li  id='tile_" + intDashboardWidgetID + "' data-row='" + objData.widgetData[key].rowpos + "' data-col='" + objData.widgetData[key].colpos + "' data-sizex='" + objData.widgetData[key].width + "' data-sizey='" + objData.widgetData[key].height + "'>";
                strContent += "<i class='fa fa-edit t1-modify-icon-label' id='editicon" + intDashboardWidgetID + "'></i>";
                strContent += "<div id='t1-widget-container" + intDashboardWidgetID + "' class='t1-metric-label'></div>";
            strContent += "</li>";
        } else {
            strContent += "<li  id='tile_" + intDashboardWidgetID + "' data-row='" + objData.widgetData[key].rowpos + "' data-col='" + objData.widgetData[key].colpos + "' data-sizex='" + objData.widgetData[key].width + "' data-sizey='" + parseInt(objData.widgetData[key].height) * 2 + "'>";
                strContent += "<div class='t1-widget-div'><div class='t1-widget-header-div'>";
                    strContent += "<header class='t1-widget-header' id='widget-header" + intDashboardWidgetID + "'>" + title;
                        if (objData.widgetData[key].histEnabled === "1") {
                            strContent += "<i class='fa fa-history t1-modify-icon' id='historyicon" + intDashboardWidgetID + "'></i>";
                        }
                        strContent += "<i class='fa fa-edit t1-modify-icon' id='editicon" + intDashboardWidgetID + "'></i>";
                    strContent += "</header>";
                strContent += "</div>";
                strContent += "<div id='t1-widget-container" + intDashboardWidgetID + "' class='t1-widget-container'></div>";
            strContent += "</li>";
        }
    });
    strContent += "</ul></div>";
    $("#grid").html(strContent);
    showLoadingSpinner(false, "");
}

function showLoadingSpinner(visible, strText){
    if (visible){
        $(".loading").css("display", "block");
        if (debugmode !== "hidden"){
            $("#loading-text").html(strText);
        }
    } else {
        $(".loading").css("display", "none");
    }
}

function getDashboardShareURL(id){
    return location.href.replace("#", "") + "?did=" + id;
}

function getMetricShareURL(id){
    return location.href.replace("#", "") + "?mid=" + id;
}


