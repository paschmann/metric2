function widgetList(objWidget){
    var strHTML = objWidget.SQL1;
    $('#t1-widget-container' + objWidget.dwid).html(strHTML);
}