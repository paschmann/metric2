function getAPISetting(strAPIName, strAPIDetail){
    return sqlLib.executeScalar("SELECT " + strAPIDetail + " FROM metric2.m2_user_connections WHERE API_NAME = '" + strAPIName + "'"); //AND user_id = " + userid
}

function saveAPISetting(strAPIName, strAPIDetail, strAPIValue){
    return sqlLib.executeUpdate("UPDATE metric2.m2_user_connections SET " + strAPIDetail + " = '" + strAPIValue + "' WHERE API_NAME = '" + strAPIName + "'"); // AND user_id = " + userid
}

function revokeAPIToken() {
    return sqlLib.executeUpdate("UPDATE metric2.m2_user_connections SET REFRESH_TOKEN = '', ACCESS_TOKEN = '' WHERE API_NAME = '" + $.request.parameters.get("apiname") + "'");  // AND user_id = " + userid
}

function showErrorMessage(context){
    return "<h1>Error</h1><p>We seem to have an error trying to authenticate your API key, please close this window, check your settings and try again.</p><p>Error: " + context + "</p>";
}

function showSuccessMessage(context){
    return "<h1>Success!</h1><p>You can close this window now.</p><p>" + context + "</p>";
}

function saveGoogleAPIAccessToken()  {
    oauthLib.saveAPISetting("GoogleAPI", "ACCESS_TOKEN", $.request.parameters.get("accesstoken"));
    return "New Access Token Saved";
}

function processGithubAPIoAuth() {
    try {  
        var destination = $.net.http.readDestination("lilabs.metric2.lib", "githubAPI");  
        var client = new $.net.http.Client();
        
        var requeststring = "/login/oauth/access_token?code=" + $.request.parameters.get("code") + "&client_id=" + oauthLib.getAPISetting("GithubAPI", "CLIENT_ID") + "&client_secret=" + oauthLib.getAPISetting("GithubAPI", "CLIENT_SECRET") + "&redirect_uri=http://dev.metric2.us.to:8000/lilabs/metric2/API/V1/GITHUBTOKEN/";
        var request = new $.net.http.Request($.net.http.POST, requeststring);
        request.headers.set('Accept', 'application/json');
        var response = client.request(request, destination).getResponse();  
        var myBody;
        if(response.body){
            try{  
                 myBody = JSON.parse(response.body.asString());
                 if (myBody.access_token.length > 0) {
                    oauthLib.saveAPISetting("GithubAPI", "ACCESS_TOKEN", myBody.access_token);
                 }
            }  
            catch(e){  
                return showErrorMessage(response.body.asString() + "   "  + requeststring);
            }
        }
        return showSuccessMessage('');
    }  
    catch (e) {  
        return e.message + " " + requeststring;
    }  
}

function processGoogleAPIoAuth() {
    try {  
        var destination = $.net.http.readDestination("lilabs.metric2.lib", "googleAPI");  
        var client = new $.net.http.Client();
          
        var request = new $.net.http.Request($.net.http.POST, "/oauth2/v3/token");  
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        var body = "code=" + $.request.parameters.get("code") + "&client_id=" + oauthLib.getAPISetting("GoogleAPI", "CLIENT_ID") + "&client_secret=" + oauthLib.getAPISetting("GoogleAPI", "CLIENT_SECRET") + "&redirect_uri=http://dev.metric2.us.to:8000/lilabs/metric2/API/V1/GOOGLETOKEN/&grant_type=authorization_code&state=" + $.request.parameters.get("state");
        request.setBody(body);
          
        var response = client.request(request, destination).getResponse();  
         
        var myBody;   
        
        if(response.body){
            try{  
                 myBody = JSON.parse(response.body.asString());
                 if (myBody.access_token.length > 0) {
                    oauthLib.saveAPISetting("GoogleAPI", "ACCESS_TOKEN", myBody.access_token);
                    oauthLib.saveAPISetting("GoogleAPI", "REFRESH_TOKEN", myBody.refresh_token);
                 }
            }  
            catch(e){  
                return showErrorMessage(response.body.asString());
            }
        }
        return showSuccessMessage('');
    }  
    catch (e) {  
        return e.message;
    }  
}