function configureTour(){
    
    var strHTML = "<div class='popover tour'>";
            strHTML += "<div class='arrow'></div>";
            strHTML += "<h3 class='popover-title'></h3>";
            strHTML += "<div class='popover-content'></div>";
                strHTML += "<div class='popover-navigation'>";
                    strHTML += "<div class='btn-group'>";
                    strHTML += "<button class='btn btn-sm btn-default' data-role='prev'>« Prev</button>";
                    strHTML += "<button class='btn btn-sm btn-default' data-role='next'>Next »</button>";
                strHTML += "</div>";
            strHTML += "<button class='btn btn-sm btn-default' data-role='end'>Quit</button>";
            strHTML += "</nav>";
        strHTML += "</div>";
    
    tour = new Tour({
        steps: [
            { element: "#", title: "metric&#178; Demo", content: "This short guide will walk you through the fundamentals of using metric&#178;.<br /><br /><p style='font-size: 10px;'>If you prefer to explore on your own, just click the Quit button below.</p>" },
            { element: "#btnAddDashboard", title: "Dashboards", content: "Realtime dashboards are the core of metric&#178;. Adding one is as simple as clicking the + button." },
            { element: "#dashboardtitle", title: "Add a Dashboard", content: "Enter a title for your dashboard and click Save. We would recommend descriptive titles, like Sales, or Performance Dashboard." },
            { element: "#btnAddWidget", title: "Metrics", content: "Each dashboard can contain a variety of metrics, clicking the + button will show you a list of preconfigured metrics to choose from." },
            { element: "#", title: "Metrics", content: "Once a metric has been selected, customized and saved, they will apear on the dashboard." },
            { element: "#widget-header3", title: "Metrics", content: "Moving a metric is as simple as dragging and dropping it into its new location." },
            { element: "#historyicon3", title: "Metric History", content: "A metric's history will be saved automatically for you. If you would like to see the history, hover over the metric and click the History icon in the top right corner." },
            { element: "#btnSearchHist", title: "Metric History", content: "A date range can be specified at the top to narrow your selection." },
            { element: "#btnShowPred", title: "Metric History", content: "Predictive Analytics is another great feature, it can be used to forecast the change in values over the next 24 hours." },
            { element: "#btnShowAlerts", title: "Alerts", content: "Alerts are a great way to inform you if a specific condition has been met. Clicking the alerts button in the top right corner will show you a list of user, and system alerts." },
            { element: "#btnAddAlert", title: "Alerts", content: "Alerts are based on metrics, and simple to create. Click on Add Alert from the left menu, to get started." },
            { element: "#alertID16", title: "Alerts", content: "An alert history can also be viewed by clicking on the number displayed in the center of the table, in the column Alert Count. This will open the alert history screen for analysis." },
            { element: "#", title: "Alerts", content: "You can change the table format by clicking on the icons in the top right corner." },
            { element: "#", title: "Tour complete", content: "Thanks for letting us show you around, please feel free to <a href='http://metric2.com/#contact' target='_blank'>contact us</a> if you have any questions or comments." }
        ],
        backdrop: true,
        orphan: true,
        onNext: function (tour) { 
            if  (tour.getCurrentStep() == 1) { 
                 getDataSet({ strService: 'AddDashboardDialog'});
            } else if  (tour.getCurrentStep() == 3) { 
                 getDataSet({
                    strService: 'GetWidgetTypes',
                    intWidgetGroup: 0
                });
            } else if  (tour.getCurrentStep() == 2 || tour.getCurrentStep() == 4 || tour.getCurrentStep() == 8) { 
                $('#myModal').modal('hide');
            } else if  (tour.getCurrentStep() == 6) { 
                showHist(3);
            } else if  (tour.getCurrentStep() == 7) { 
                showPred(3);
            } else if (tour.getCurrentStep() == 9) { 
                getDataSet({ strService: 'Alerts'}); 
            } else if  (tour.getCurrentStep() == 11) { 
                alertHistory(16);
            } else if  (tour.getCurrentStep() == 12) { 
                window.location = "index.html";
            }
        },
        template: strHTML
    });
    
    // Initialize the tour
    tour.init();
    
    // Start the tour
    tour.start();
}