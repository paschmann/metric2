function loadGridster(){
    var gridster = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_selector: '[id^=tile_]',
        widget_base_dimensions: [230, 230],
        min_cols: 10,
        min_rows: 15,
        max_size_x: 7,
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
    
    configureGristerClickEvents();
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