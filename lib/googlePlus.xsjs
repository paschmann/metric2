    var callGoogle = function() {  
        // you need to add yourGoogleID right here (get it via https://plus.google.com/ -> Profile -> copy the long number)  
        var yourGoogleID = "113228723232930580581";  
        var response;  
        // the HTTP client to send requests  
        var oHttpClient = new $.net.http.Client();  
        // load the library handling the OAuth protocol  
        var oAuthClientLib = $.import("sap.hana.xs.oAuth.lib", "oAuthClient");  
        // Google + API specific endpoints  
        var suffix = "/plus/v1/people/";  
        suffix += yourGoogleID;  
        // where we want to go  
        var request = new $.net.http.Request($.net.http.GET, suffix);  
        // initialize the HTTP destination and OAuth client  
        var myDestObj = $.net.http.readDestination("lilabs.metric2.lib", "googleAPI");  
        var oaC = new oAuthClientLib.OAuthClient("lilabs.metric2.lib", "googleAPI");  
        // SCOPES -> configure via XS Admin in the OAuth configuration package  
        //https://www.googleapis.com/auth/plus.me  
        // if you want to start from scratch, just set a breakpoint here and call this method  
        // oaC.userRevokeAccess();  
        // initialize the OAuth authorization code flow (and trace a debug message)  
        // do you know what happens if you call this URL via your Browser?  
        var url = oaC.userAuthorizeUri("https://hanasp09:4300/lilabs/metric2/lib/googlePlus.xsjs");  
        $.trace.debug("Auth URL is: " + url);  
        // if you called the URL via your browser paste the authorization code response into the 'code' variable (after uncommenting of course)  
        // var code;  
        // this is an alternative way to get the access tokens  
        // oaC.userGrantAccess(code);  
        // is our access token still valid, do we need to refresh it or didn't we receive anyone at all?  
        var validAT = oaC.hasValidAccessToken();  
        if (validAT) {  
            // call the API  
            response = oaC.processData(oHttpClient, request, myDestObj);  
        } else {  
            var validRT = oaC.hasValidRefreshToken();  
            if (validRT) {  
                var refreshStatus = oaC.userRefreshAccess();  
                if (refreshStatus === 200) {  
                    // call the API  
                    response = oaC.processData(oHttpClient, request, myDestObj);  
                }  
            } else {  
                $.response.setBody(JSON.stringify({  
                    error: false,  
                    errorDescription: "There are no tokens (access or refresh) for this application/user context available",  
                    solution: "Authorize yourself via the following authorization URL",  
                    authorizationURL: url  
                }));  
                return;  
            }  
        }  
        if (response) {  
            // display googles response  
            var myBody;  
            if (response.body) { 
                try {  
                    myBody = JSON.parse(response.body.asString());  
                } catch (e) {  
                    myBody = response.body.asString();  
                }  
            }
            $.response.contentType = "application/json";  
            $.response.status = 200;  
            $.response.setBody(JSON.stringify({  
                "status": response.status,  
                "body": myBody  
            }));  
        }  
    };  
    
    try {  
        callGoogle();  
    } catch (err) {  
        $.response.setBody("Failed to execute action: " + err.toString());  
    }  