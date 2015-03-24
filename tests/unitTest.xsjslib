/*global jasmine, describe, beforeOnce, it, expect*/
describe("metric2 Test Suite", function() {

    var m2api = '/lilabs/metric2/lib/api.xsjs';
    var testemail = 'demo@metric2.com';
    var testpassword = 'demo';
    var sessiontoken = '';

    function callAPI(queryString) {
        var contentTypeHeader = {
            "Content-Type": "application/json",
            "sessionToken": sessiontoken
        };
        
        var response = jasmine.callHTTPService(m2api + queryString, $.net.http.GET, "", contentTypeHeader);
        return response.body ? response.body.asString() : "";
    }

    beforeOnce(function() {
        // called before running the test suite
    });

    it("API should be available", function() {
        var response = jasmine.callHTTPService(m2api);
        expect(response.status).toBe($.net.http.OK);
    });
    
    it("API: GetUserToken should return user token", function() {
        var requestQuery = '?service=Login&email=' + testemail + '&password=' + testpassword;
        var response = callAPI(requestQuery);
        expect(response).not.toMatch(/dberror/);
        sessiontoken = response;
    });
    
    it("API: UserInfo should return User Info", function() {
        var requestQuery = '?service=UserInfo';
        var response = callAPI(requestQuery);
        expect(response).not.toMatch(/dberror/);
        expect(response).toContain("LNAME");
    });
    
    it("API: DBInfo should return DB Info", function() {
        var requestQuery = '?service=DBInfo';
        var response = callAPI(requestQuery);
        expect(response).not.toMatch(/dberror/);
        expect(response).toContain("System");
    });
    
    it("API: Dashboards should return a list of dashboards", function() {
        var requestQuery = '?service=Dashboards';
        var response = callAPI(requestQuery);
        expect(response).not.toMatch(/dberror/);
        expect(response).toContain("dashboards");
    });
    
    it("API: Widgets should return a list of widgets", function() {
        var requestQuery = '?service=Widgets';
        var response = callAPI(requestQuery);
        expect(response).not.toMatch(/dberror/);
        expect(response).toContain("widgetData");
    });


});