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
            strHTML += "<button class='btn btn-sm btn-default' data-role='end'>Close</button>";
            strHTML += "</nav>";
        strHTML += "</div>";
    
    tour = new Tour({
        steps: [
            // 0
            { element: "#", title: "metric&#178; Introduction", content: "Thanks for checking out the demo of metric&#178;. metric&#178 is a web based, realtime, self service dashboard platform for SAP HANA. Since it's a platform and has multiple use cases, we have included 3 different dashboards, giving you an example of 3 possible scenarios, these include: <br /><br /><Strong>A HANA Dashboard</strong> - Perfect for a IT or DBA team wanting to ensure their HANA instance is running optimally<br /><br /><strong>Sales Dashboard</strong> - A Sales department may use to track daily progress toward a set of goals<br /><br /><strong>Internet of Things Dashboard</strong> - metric&#178; can be used as a datamart and dashboard to store data from sensors, or devices located anywhere. These sensors can be polled, or data can be pushed into metric&#178; from the sensors using the included API.<br /><br />This short guide will walk you through the basic fundamentals of using the website.<br /><br /><p style='font-size: 10px;'>If you prefer to explore on your own, just click the Close button below.</p>" },
            // 1
            { element: "#btnSideBar", title: "Navigation", content: "The Sidebar displays details about your user profile, along with some key information about the HANA instance you are running on." },
            //2
            { element: ".mm-search", title: "Navigation", content: "The Side Menu displays a list of dashboards, alerts and options to modify settings or your user profile." },
            //3
            { element: "#btnAddDashboard", title: "Navigation", content: "The Tool tip area gives users quick and easy access to many of the popular functions, including adding dashboards & metrics, showing alerts and profile changes" },
            //4
            { element: "#btnAddDashboard", title: "Dashboards", content: "Realtime dashboards are the core of metric&#178;. Adding one is as simple as clicking the + button." },
            //5
            { element: "#dashboardtitle", title: "Add a Dashboard", content: "Enter a title for your dashboard and click Save. We would recommend descriptive titles, like Sales, or Performance Dashboard." },
            //6
            { element: "#btnAddWidget", title: "Metrics", content: "Each dashboard can contain a variety of metrics, clicking the + button will show you a list of preconfigured metrics to choose from." },
            //7
            { element: "#", title: "Metrics", content: "Once a metric has been selected, customized and saved, they will apear on the dashboard." },
            //8
            { element: "#widget-header3", title: "Metrics", content: "Moving a metric is as simple as dragging and dropping it into its new location." },
            //9
            { element: "#historyicon3", title: "Metric History", content: "A metric's history will be saved automatically for you. If you would like to see the history, hover over the metric and click the History icon in the top right corner." },
            //10
            { element: "#btnSearchHist", title: "Metric History", content: "A date range can be specified at the top to narrow your selection." },
            //11
            { element: "#btnShowPred", title: "Metric History", content: "Predictive Analytics is another great feature, it can be used to forecast the change in values over the next 24 hours." },
            //12
            { element: "#btnShowAlerts", title: "Alerts", content: "Alerts are a great way to inform you if a specific condition has been met. Clicking the alerts button in the top right corner will show you a list of user, and system alerts." },
            //13
            { element: "#btnAddAlert", title: "Alerts", content: "Alerts are based on metrics, and simple to create. Click on Add Alert from the left menu, to get started." },
            //14
            { element: "#alertID16", title: "Alerts", content: "An alert history can also be viewed by clicking on the number displayed in the center of the table, in the column Alert Count. This will open the alert history screen for analysis." },
            //15
            { element: "#", title: "Alerts", content: "You can change the table format by clicking on the icons in the top right corner." },
            //16
            { element: "#", title: "Tour complete", content: "Thanks for letting us show you around, please feel free to <a href='http://metric2.com/#contact' target='_blank'>contact us</a> if you have any questions or comments." }
        ],
        backdrop: true,
        orphan: true,
        onNext: function (tour) {
            
            switch (tour.getCurrentStep()){
                case 0:
                    $('#btnSideBar').click();
                    break;
                case 1:
                    $('#btnSideBar').click();
                    $('.toggle-menu').click();
                    break;
                case 4:
                    getDataSet({ strService: 'AddDashboardDialog'});
                    break;
                case 6:
                    getDataSet({
                        strService: 'GetWidgetTypes',
                        intWidgetGroup: 0
                    });
                    break;
                case 5:
                case 7:
                case 11:
                    $('#myModal').modal('hide');
                    break;
                case 9:
                    showHist(3);
                    break;
                case 10:
                    showPred(3);
                    break;
                case 12:
                    getDataSet({ strService: 'Alerts'});
                    break;
                case 14:
                    alertHistory(16);
                    break;
                case 15:
                    window.location = "index.html";
                    break;
            }
        },
        template: strHTML
    });
    
    // Initialize the tour
    tour.init();
    
    // Start the tour
    tour.start();
}