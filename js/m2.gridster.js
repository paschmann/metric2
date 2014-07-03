function loadGridster(){
    var gridster = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_selector: '[id^=tile_]',
        widget_base_dimensions: [230, 230],
        min_cols: 10,
        min_rows: 15,
    	avoid_overlapped_widgets: true,
        serialize_params: function($w, wgd) {
            return {
                id: wgd.el[0].id,
                col: wgd.col,
                row: wgd.row,
                width: wgd.size_x,
                height: wgd.size_y
            };
        },
        shift_larger_widgets_down: true
    });
                                
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
            
function saveGridPosition() {
    var gridster = $(".gridster ul").gridster().data('gridster');
	var strGridPos = JSON.stringify(gridster.serialize());
	getDataSet({
        strService: 'Position', 
        strDashboardID: intCurrentDashboardID,
        strGridPos: strGridPos
    });
}