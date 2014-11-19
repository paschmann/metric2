function showSQLBuilder(sql, datatype){
    var output = '';
    
    output += "<div role='tabpanel'>";

        output += "<ul class='nav nav-tabs' role='tablist'>";
        output += "<li role='presentation' class='active'><a href='#SQL' aria-controls='home' role='tab' data-toggle='tab'>SQL</a></li>";
        //output += "<li role='presentation'><a href='#OData' aria-controls='OData' role='tab' data-toggle='tab'>OData</a></li>";
        //output += "<li role='presentation'><a href='#WS' aria-controls='WS' role='tab' data-toggle='tab'>Web Service</a></li>";
        output += "</ul>";

        output += "<div class='tab-content'>";
            output += "<div role='tabpanel' class='tab-pane active' id='SQL'>";
                output += "<form class='form-horizontal' role='form' style='margin-top: 30px;' id='SQL'>";
                    output += "<input type='" + debugmode + "' value='" + "" + "' id='dashboardwidgetid' />";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>Data Type: </label><label id='datatype' class='col-md-1 control-label'>" + datatype + "</label></div>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>SQL Statement: </label>";
                        output += "<div class='col-md-10'><textarea class='form-control' rows='3' id='txtSQL'>" + sql + "</textarea></div>"
                        output += "<div class='col-md-1'><button type='button' id='btnExecuteSQL' class='btn btn-success' style='margin-top: 20px;'>Execute</button></div>";
                    output += "</div>";
                    output += "<div id='dialogSQLMsg' class='col-md-10 col-md-offset-1'></div>";
                    output += "<div id='output'></div>";
                output += "</form>";
            output += "</div>";
            output += "<div role='tabpanel' class='tab-pane' id='OData'>OData</div>";
            output += "<div role='tabpanel' class='tab-pane' id='WS'>Web Services</div>";
        output += "</div>";
    output += "</div>";
    
    $('#modal-sql-header').html("Data Builder");
    $('#dialogSQLHTML').html(output);
    $('#dialogSQLMsg').html('');
    $('#dialogSQLHTML').css('height','840px');
    $('#modalsqldlg').css('height','auto');
    $('#modalsqldlg').css('width','85%');
    $('#mySQLBuilderModal').appendTo("body").modal('show');

}

function showSQLResults(data){
    
    try{
        var objData = jQuery.parseJSON(data);
        var intRecCount = 0;
        var html = "<table style='' class='stripe' id='datatable'>";
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
        
        $('#output').html(html);
        $('#dialogSQLMsg').html('');
        $('#datatable').DataTable({bFilter: false, deferRender:    true, dom: "C<'clear'>frtiS", scrollY: 600, scrollCollapse: true, stateSave: true,  paginate: false, scrollCollapse: true});
    } catch (e) {
        $('#dialogSQLMsg').html("<div class='alert alert-warning' role='alert'>" + data + "</div>");
    }
    
    $('#datatable_info').hide();
    $('#datatable_length').hide();
    $('#lblFooterLeft').html($('#datatable_info').html());
}