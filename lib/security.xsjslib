
// --------------------------------------- Security ----------------------------------------------------- //

function getUserLoginToken() {
    var userID = sqlLib.executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "' AND password = '" + password + "'");
    // Calculate HMACSHA1-Value (160 Bits) which is returned as a Buffer of 20 Bytes
    var hmacSha1ByteBuffer = $.util.crypto.hmacSha1(userID, Math.random().toString(36).slice(2));
    // Encode ByteBuffer to Base64-String
    var userInitialToken =  $.util.convert.encodeBase64(hmacSha1ByteBuffer);
    
    if (!userID){
        userInitialToken = 999;
    } else {
        // Create a session token and update the user token in the DB
        sqlLib.executeUpdate("UPDATE metric2.m2_users set user_token = '" + userInitialToken + "' WHERE user_id = " + userID);
    }
    return userInitialToken;
}

function getUserIDfromToken(usertoken){
    return sqlLib.executeScalar("SELECT user_id FROM metric2.m2_users WHERE user_token = '" + usertoken + "'");
}

function createUser(){
    var email = $.request.parameters.get('email');
    var lname = $.request.parameters.get('lname');
    var company = $.request.parameters.get('company');
    var name = $.request.parameters.get('name');
    var password = $.request.parameters.get('password');
    var recCount = 0;
    var tmpUserID = sqlLib.executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "'");
    
    //check if user already exists
    if (tmpUserID === ''){
        var SQL = "INSERT INTO METRIC2.M2_USERS (user_ID, name, lname, email_domain, email, password, acct_type, dt_added) VALUES (metric2.user_id.NEXTVAL, '" + name + "', '" + lname + "', '" + company + "', '" + email + "', '" + password + "', '0', CURRENT_TIMESTAMP)";
        sqlLib.executeQuery(SQL);
        recCount = 1;
    } else {
        recCount = -1;
    }
    
    return recCount;
}

// --------------------------------------- Security ----------------------------------------------------- //
