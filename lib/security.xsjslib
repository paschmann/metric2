// --------------------------------------- Security ----------------------------------------------------- //

function getUserLoginToken() {
    // Get the salt from the useraccount, apply it, and test the password
    var hash = sqlLib.executeScalar("SELECT HASH_SHA256 (TO_BINARY('" + password + "'), to_BINARY(DT_ADDED)) from METRIC2.M2_Users where email = '" + email + "'");
    var userID = sqlLib.executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "' AND password = '" + hash + "'");
    
    //Handles changes to $.util in SPS09
    // Calculate HMACSHA1-Value (160 Bits) which is returned as a Buffer of 20 Bytes
    // Encode ByteBuffer to Base64-String
    if (intHanaVersion >= 9){
        var hmacSha1ByteBuffer = $.security.crypto.sha1(userID, Math.random().toString(36).slice(2));
        
        var userInitialToken =  $.util.codec.encodeBase64(hmacSha1ByteBuffer);
    } else {
        var hmacSha1ByteBuffer = $.util.crypto.hmacSha1(userID, Math.random().toString(36).slice(2));
        // Encode ByteBuffer to Base64-String
        var userInitialToken =  $.util.convert.encodeBase64(hmacSha1ByteBuffer);
    }
    
    //if the userID and password are correct, we will return a hashed user token otherwise the 999 number
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

function updateUser(){
    var email = $.request.parameters.get('email');
    var lname = $.request.parameters.get('lname');
    var company = $.request.parameters.get('company');
    var name = $.request.parameters.get('name');
    var password = $.request.parameters.get('password');
    var tmpUserID = sqlLib.executeScalar("SELECT user_id FROM metric2.m2_users WHERE email = '" + email + "'");
    
    if (password.length > 0){
        var dt = sqlLib.executeScalar("SELECT CURRENT_TIMESTAMP from DUMMY");
        password = hash(password, dt);
        var SQL = "UPDATE METRIC2.M2_USERS SET password = '" + password + "', dt_added = '" + dt + "' WHERE user_id = " + tmpUserID;
        sqlLib.executeQuery(SQL);
    }
    
    var SQL = "UPDATE METRIC2.M2_USERS SET name =  '" + name + "', lname = '" + lname + "', email = '" + email + "' WHERE user_id = " + tmpUserID;
    sqlLib.executeQuery(SQL);
    return SQL;
}

function hash(password, dt){
    var hash = sqlLib.executeScalar("SELECT HASH_SHA256 (TO_BINARY('" + password + "'), to_BINARY('" + dt + "')) from DUMMY");
    return hash;
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
        //need to hash + salt the password before storing, also store the salt
        var dt = sqlLib.executeScalar("SELECT CURRENT_TIMESTAMP from DUMMY");
        password = hash(password, dt);
        var SQL = "INSERT INTO METRIC2.M2_USERS (user_ID, name, lname, email_domain, email, password, acct_type, dt_added) VALUES (metric2.user_id.NEXTVAL, '" + name + "', '" + lname + "', '" + company + "', '" + email + "', '" + password + "', '0', '" + dt + "')";
        var msg = sqlLib.executeQuery(SQL);
        recCount = 1;
    } else {
        recCount = -1;
    }
    
    return recCount;
}

// --------------------------------------- Security ----------------------------------------------------- //