function widgetTextAndFooter(objWidget){
    var strHTML = "<div class='t1-widget-text-big'>" + objWidget[ 'Large Text Value' ]  + "</div>";
    strHTML += "<div class='t1-widget-footer'>";
    strHTML += "<div class='t1-widget-percent-medium-grey'>" + objWidget[ 'Footer Text Value' ] + "</div>";
	strHTML += "</div>";
    
    var divid = 0;
    $('#t1-widget-container' + objWidget.dwid).html(strHTML);
}