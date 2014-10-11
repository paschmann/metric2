$.import("lilabs.metric2.lib","alerts");
$.import("lilabs.metric2.lib","sql");
var sqlLib = $.lilabs.metric2.lib.sql;
var alertLib = $.lilabs.metric2.lib.alerts;
var strDashboardUser = "lilabs.metric2.lib::metricuser";

function alertJob(){
    alertLib.checkAlertJob();
}