
// -------------------------   Client Side click events ----------------------- //


function configureGristerClickEvents() {
    if (!viewmode.length > 0){
        $("[id^=tile_]").mouseover(function(e) {
            var tileID = this.id.substring(5);
            $("#editicon" + tileID).animate({
                "opacity": 1
            }, 0);
            $("#historyicon" + tileID).animate({
                "opacity": 1
            }, 0);
        });
    
        $("[id^=tile_]").mouseout(function(e) {
            var tileID = this.id.substring(5);
            $("#editicon" + tileID).animate({
                "opacity": 0
            }, 0);
            $("#historyicon" + tileID).animate({
                "opacity": 0
            }, 0);
        });
    
        $("[id^=editicon]").click(function(e) {
            getDataSet({
                service: "EditWidgetDialog",
                dashboardwidgetid: this.id.substring(8)
            })
            e.stopPropagation();
        });
    
        $("[id^=historyicon]").click(function(e) {
            showHist(this.id.substring(11));
            e.stopPropagation();
        });
    
        $("[id^=tile_]").click(function(e) {
            saveGridPosition();
        });
    }
}


function configureClickEvents() {
    
    $(document).on("click","#chkShareDashboard",function(){
        if ($(this).is(":checked")){
            getDataSet({service: "SetDashboardSharingURL", dashboardid: $("li.active").data("id")});
        } else {
            getDataSet({service: "DisableDashboardSharingURL", dashboardid: $("li.active").data("id")});
        }
    });
    
    $(document).on("click","#chkShareMetric",function(){
        if ($(this).is(":checked")){
            getDataSet({service: "SetMetricSharingURL", dashboardwidgetid: $(this).data("id")});
        } else {
            getDataSet({service: "DisableMetricSharingURL", dashboardwidgetid: $(this).data("id")});
        }
    })
    
    $("#btnShowAlertList").click(function() {
        loadAlertList();
    });
    
    $(document).on("click",".btnAuthenticateOAuth",function(e){
        openOAuthWindow($(this).data("id"), $(this).attr("id"), false, false);
    });
    
    $(document).on("click",".btnRevokeOAuth",function(e){
        openOAuthWindow($(this).data("id"), $(this).attr("id"), false, true);
    });
    
    $(document).on("click","#btnChangePassword",function(e){
        var output = "<div class='form-group'><label for='password1' class='col-sm-3 control-label'>New Password:</label><div class='col-sm-5'><input type='text' class='form-control' required='true' placeholder='Password' name='password'  id='password' /></div></div>";
        output += "<div class='form-group'><label for='password2' class='col-sm-3 control-label'>Repeat Password:</label><div class='col-sm-5'><input type='text' class='form-control' required='true' placeholder='Repeat Password' name='password1'  id='password1' /></div></div>";
        $("#divChangePassword").html(output);
    });
    
    $("#btnAddWidget, #mnuAddWidget").click(function() {
        getDataSet({ service: "GetWidgetTypes", widgetgroup: 0});
    });
    
    $("#btnAddAlert").click(function() {
        addAlertDialog();
    });
    
     $(document).on("keypress","#searchmetrics",function(e){
        loadNewWidgetList(0, $("#searchmetrics").val());
    });
    
    $(document).on("click",".btnAddMetricThumbnail",function(){
        getDataSet({service: "NewWidgetDialog", widgetid: $(this).data("id")});
    });
    
    
    $(document).on("click",".list-group-item",function(e){
        var previous = $(this).closest(".list-group").children(".active");
        previous.removeClass("active"); // previous list-item
        $(e.target).addClass("active"); // activated list-item
        loadNewWidgetList($(this).data("id"), "");
        
        //Update breadcrumb at the top
        $("#integration").removeClass("active");
        $("#integrationicon").removeClass("fa-circle");
        $("#integrationicon").addClass("fa-check-circle");
        $("#selectmetric").addClass("active");
    });

    $(document).on("click","#btnExecuteSQL",function(){
        getDataSet({ service: "Select", sql: document.getElementById("txtSQL").value })
    });
    
    $(document).on("click","#btnExecuteOData",function(){
        executeODataRequest();
    });
    
    $(document).on("click","#btnExecuteWS",function(){
        executeWSRequest();
    });
    
    $(document).on("click","#btnShowSQLBuilder",function(){
        var sql = $(this).offsetParent()[0].firstChild.value;
        strInputControl = $(this).offsetParent()[0].firstChild;
        showSQLBuilder(sql, "Single Value","","");
    });
    
    $(document).on("click","#btnShowODataBuilder",function(){
        var odata = $(this).offsetParent()[0].firstChild.value;
        strInputControl = $(this).offsetParent()[0].firstChild;
        showSQLBuilder("", "Single Value", odata, "");
    });
    
    $(document).on("click","#btnShowWSBuilder",function(){
        var ws = $(this).offsetParent()[0].firstChild.value;
        strInputControl = $(this).offsetParent()[0].firstChild;
        showSQLBuilder("", "Single Value", "", ws);
    });
    
    $("#btnModalSQLSave").click(function(e) {
        var $tab = $("#tabs"), $active = $tab.find(".active > a");
        if ($active.text() === "SQL"){
            $("#" + strInputControl.id).val($("#txtSQL").val());
        } else if ($active.text() === "OData"){
            $("#" + strInputControl.id).val($("#txtOData").val());
        } else if ($active.text() === "Web Service"){
            $("#" + strInputControl.id).val($("#txtWS").val());
        }
    });

    $("#btnEditDashboard").click(function() {
        var objData = {};
        objData.DASHBOARD_ID = $("li.active").data("id");
        objData.SHARE_URL = $("li.active").data("shareurl");
        objData.BG_URL = $("li.active").data("bgurl");
        objData.TITLE = $("li.active").attr("title");
        showDashboardDialog(objData, true);
    });

    $("#mnuProfile, btnProfile").click(function() {
        getDataSet({
            service: "EditProfileDialog"
        });
    });

    $("#mnuSettings, btnSettings").click(function() {
        getDataSet({
            service: "EditSettingsDialog"
        });
    });
    
    $("#btnShowHelp").click(function() {
        tour.restart();
    });

    $("#mnuLogout").click(function() {
        doLogout();
    });

    $("#mnuShowFullscreen").click(function() {
        $("#main").toggleFullScreen();
    });

    $("#btnShowAlerts, #mnuShowAlerts").click(function() {
        loadAlertScreen();
    });

    $("#chkStreaming").click(function() {
        toggleStreaming();
    });
    
    $("#chkTheme").click(function() {
        toggleTheme();
    });

    $("#btnModalDelete").click(function() {
        deleteDialog($("#modal-header").html());
    });
    
    $("#btnModalDeleteHistory").click(function() {
        clearAlert($("#alertid").val());
    });

    $("#btnModalSave").click(function(e) {
        saveDialog($("#modal-header").html());
        e.stopImmediatePropagation();
    });
    
    $(document).on("click",".cloneMetric",function(){
        $("#btnModalClone").popover("hide");
        $("#myModal").modal("hide");
        cloneMetric($(this).data("id"));
    });
    
    $("#btnModalClone").click(function(e) {
        e.stopImmediatePropagation();
        if ($('#modal-header').text() === "Edit Dashboard"){
            $("#btnModalClone").popover("destroy");
            $("#myModal").modal("hide");
            cloneDashboard(intCurrentDashboardID);
        } else {
            var strHTML = "<ul class='list-group'>";
            $("#dashboards li").each(function() {
                if ($(this).text().length > 0){
                    strHTML += "<li class='list-group-item cloneMetric' data-id='" + $(this).data("id") + "'>" + $(this).text() + "</li>";
                }
            });
            
            strHTML += "</ul>";
            
            $("#btnModalClone").popover({
                placement : "top",
                html: "true",
                content: strHTML
            }).popover("toggle");
        }
    });
    
    $("#btnShowSideBar").click(function(e) {
        toggleSideBar();
    });

    $("body").on("click", ".toggle-menu", function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $("nav#menu").trigger("open.mm");
    });
}