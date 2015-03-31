function showSQLBuilder(sqlquery, datatype, odataquery, wsquery){
    var output = '';
    var sqlqueryactive = '';
    var odataqueryactive = '';
    var wsqueryactive = '';
    
    if (sqlquery !== ''){
        sqlqueryactive = 'active';
    } else if (odataquery !== ''){
        odataqueryactive = 'active';
    } else if (wsquery !== ''){
        wsqueryactive = 'active';
    }
    
    output += "<div role='tabpanel'>";

        output += "<ul class='nav nav-tabs' id='tabs' role='tablist'>";
        output += "<li role='presentation' class='" + sqlqueryactive + "'><a href='#SQL' aria-controls='home' role='tab' id='sqltab' data-toggle='tab'>SQL</a></li>";
        output += "<li role='presentation' class='" + odataqueryactive + "'><a href='#OData' aria-controls='OData' id='odatatab'role='tab' data-toggle='tab'>OData</a></li>";
        output += "<li role='presentation' class='" + wsqueryactive + "'><a href='#WS' aria-controls='WS' role='tab' id='wstab' data-toggle='tab'>Web Service</a></li>";
        output += "</ul>";

        output += "<div class='tab-content'>";
            output += "<div role='tabpanel' class='tab-pane " + sqlqueryactive + "' id='SQL'>";
                output += "<form class='form-horizontal' role='form' style='margin-top: 30px;' id='SQL'>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>Data Type: </label><label id='datatype' class='col-md-1 control-label'>" + datatype + "</label></div>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>SQL Statement: </label>";
                        output += "<div class='col-md-10'><textarea class='form-control' rows='3' id='txtSQL'>" + sqlquery + "</textarea></div>"
                        output += "<div class='col-md-1'><button type='button' id='btnExecuteSQL' class='btn btn-success' style='margin-top: 20px;'>Execute</button></div>";
                    output += "</div>";
                    output += "<div id='dialogSQLMsg' class='col-md-10 col-md-offset-1'></div>";
                    output += "<div id='output'></div>";
                output += "</form>";
            output += "</div>";
            output += "<div role='tabpanel' class='tab-pane " + odataqueryactive + "' id='OData'>";
                output += "<form class='form-horizontal' role='form' style='margin-top: 30px;' id='OData'>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>Data Type: </label><label id='datatype' class='col-md-1 control-label'>" + datatype + "</label></div>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>OData Query: </label>";
                        output += "<div class='col-md-10'><textarea class='form-control' rows='3' id='txtOData'>" + odataquery + "</textarea></div>"
                        output += "<div class='col-md-1'><button type='button' id='btnExecuteOData' class='btn btn-success' style='margin-top: 20px;'>Execute</button></div>";
                    output += "</div>";
                    output += "<div id='dialogODataMsg' class='col-md-11 col-md-offset-1'></div>";
                    output += "<div id='Odataoutput' style='overflow: auto; height: 600px;' class='col-md-11 col-md-offset-1'></div>";
                output += "</form>";
            output += "</div>";
            output += "<div role='tabpanel' class='tab-pane " + wsqueryactive + "' id='WS'>";
                output += "<form class='form-horizontal' role='form' style='margin-top: 30px;' id='WS'>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>Data Type: </label><label id='datatype' class='col-md-1 control-label'>" + datatype + "</label></div>";
                    output += "<div class='form-group'><label class='col-md-1 control-label'>Web Service Query: </label>";
                        output += "<div class='col-md-10'><textarea class='form-control' rows='3' id='txtWS'>" + wsquery + "</textarea></div>"
                        output += "<div class='col-md-1'><button type='button' id='btnExecuteWS' class='btn btn-success' style='margin-top: 20px;'>Execute</button></div>";
                    output += "</div>";
                    output += "<div id='dialogWSMsg' class='col-md-11 col-md-offset-1'></div>";
                    output += "<div id='WSoutput' style='overflow: auto; height: 600px;' class='col-md-11 col-md-offset-1'></div>";
                output += "</form>";
            output += "</div>";
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

function executeWSRequest(){
    $.ajax({
        type: "get",
        async: false,
        url: $('#txtWS').val(),
        success: function (data) {
            $("#WSoutput").JSONView(JSON.stringify(data));
            $('#dialogWSMsg').empty();
        },
        error: function (xhr, textStatus, errorMessage) {
            $('#dialogWSMsg').html("<div class='alert alert-warning' role='alert'>" + errorMessage + "</div>");
        }
    });
    
}

function executeODataRequest(){
    $.ajax({
        type: "get",
        async: false,
        url: $('#txtOData').val(),
        success: function (data) {
            $("#Odataoutput").JSONView(JSON.stringify(data));
            $('#dialogODataMsg').empty();
        },
        error: function (xhr, textStatus, errorMessage) {
            $('#dialogODataMsg').html("<div class='alert alert-warning' role='alert'>" + errorMessage + "</div>");
        }
    });
    
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
        $('#datatable').DataTable({bFilter: false, deferRender:    true, order: [[ 1, "desc" ]], dom: "C<'clear'>frtiS", scrollY: 570, scrollCollapse: true, stateSave: true,  paginate: false, scrollCollapse: true});
    } catch (e) {
        $('#dialogSQLMsg').html("<div class='alert alert-warning' role='alert'>" + data + "</div>");
    }
    
    $('#datatable_info').hide();
    $('#datatable_length').hide();
    $('#lblFooterLeft').html($('#datatable_info').html());
}