
function widgetStockPrice(Ticker){
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + Ticker + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON(url, function(data) {           
            var items = [];
            $('#stock').html('');
            var price = data.query.results.quote.LastTradePriceOnly;
			var change = data.query.results.quote.Change;
			
			
			var html = '<div id="stock" style="line-height: 1.0;"><div class="t1-widget-text-medium">';
			if (change > 0){
				html += '<p style="color: #5BD993; margin-top: 20px;">&#9650<br />';	
			} else if (change == 0){
				html += '<p style="color: #FFDD72; margin-top: 20px;">&#9668<br />';	
			} else {
				html += '<p style="color: #F55B4C; margin-top: 20px;">&#9660<br />';	
			}
				
			html += parseFloat(change).toFixed(2) + '';
			html += '</p></div>';
			  html += '<div class="t1-widget-datetime">$' + parseFloat(price).toFixed(2) + '';
			  html += '</div>';
			  $('#stock').html(html);
        });
}