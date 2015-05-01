function getGoogleAPIURL(clientid) {
    return "https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.circles.read&client_id=" + clientid + "&state=" + sessionToken + "&redirect_uri=" + location.protocol + '//' + location.host + "/lilabs/metric2/API/V1/GOOGLETOKEN/&response_type=code&access_type=offline";
}

function getGithubAPIURL (clientid) {
    return "https://github.com/login/oauth/authorize?scope=user&client_id=" + clientid + "&state=" + sessionToken + "&redirect_uri=" + location.protocol + '//' + location.host + "/lilabs/metric2/API/V1/GITHUBTOKEN/&response_type=code";
}

function openOAuthWindow(clientid, apiname, autoclose, revoke) {
    var winURL = "";
    var winsize = "height=600,width=450";
    var checkconnect;
    
        if (revoke) {
            getDataSet({service: "RevokeOAuthToken", apiname: apiname});
            setTimeout(function(){getDataSet({service: "EditSettingsDialog"});}, 2000);
            autoclose = true;
        }
    
        if (apiname === "GoogleAPI" && revoke === false){
            winURL = getGoogleAPIURL(clientid);
        } else if (apiname === "GithubAPI" && revoke === false) {
            winURL = getGithubAPIURL(clientid);
        } else if (apiname === "GoogleAPI" && revoke === true) {
            winURL = "https://accounts.google.com/o/oauth2/revoke?token=" + clientid;
        } else if (apiname === "GithubAPI" && revoke === true) {
            winURL = "https://github.com/login/oauth/revoke?token=" + clientid;
        }
        
        if (autoclose){
            winsize = "height=1,width=1";
        }
        var newWindow = window.open(winURL, 'name', winsize);
        
        if (autoclose){
            window.focus();
            setTimeout(function(){ newWindow.close(); }, 2000);
        } else {
            newWindow.focus();
        }
        
        checkConnect = setInterval(function() {
            if (!newWindow || !newWindow.closed) return;
            clearInterval(checkConnect);
            getDataSet({service: "EditSettingsDialog"});
        }, 1000);
}


                        
                    

function refreshGoogleAPIToken(data) {
    var strURL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + data.clientid + "&client_secret=" + data.clientsecret + "&refresh_token=" + data.refreshtoken + "&grant_type=refresh_token";
    
    //Attempt to refresh api token, we only try this 3 times to avoid API rate limiting
    if (intGoogleAPIValidationAttempts === 0){
        if (data.refreshtoken.length > 0 && data.refreshtoken !== "undefined") {
            $.post(strURL, "", function(resp, textStatus) {
                getDataSet({
                    service: "SaveGoogleAPIAccessToken",
                    accesstoken: resp.access_token
                });
                data.accesstoken = resp.access_token;
            }, "json");
        }
        setTimeout(function(){ getDataSet({ service: "RefreshWidget", dashboardwidgetid: data.dwid }); }, 1000);
        intGoogleAPIValidationAttempts++;
    } else {
        $('#t1-widget-container' + data.dwid).html('Error: Please check the API is enabled in Settings');
    }
}

