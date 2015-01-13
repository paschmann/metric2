function toggleForm(){
    $('#login').toggle();
    $('#create').toggle();
}

$(document).ready(function () {
    var CSRFToken = '';

        $("#loginform").submit(function (e) {
            $.ajax({
            	url: "lib/api.xsjs",
            	type: "POST",
            	data: {
            	    service: "DoLogin",
            	    email: $('#email').val(),
                	password: $('#password').val()
                },
                success: function(data, textStatus, XMLHttpRequest) {
                    if (data != 0 && data != 999){
                	    $.cookie('userToken', data);
                		window.location = 'index.html';
                	} else {
                	    $('#msg').html('Incorrect Email or Password');
                	}
                }, error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    $('#msg').html('Status: ' + textStatus + " Error: " + errorThrown);
                } 
            });
            return false;
        });
        
        
        $("#createform").submit(function (e) {
            //Check if 2 passwords match/strength
            $.ajax({
                url: "lib/api.xsjs",
                type: "POST",
                data:{
                    service: "CreateUser",
                    email: $('#createemail').val(),
                    password: $('#createpassword').val(),
                    name: $('#createname').val(),
                    lname: $('#createlname').val(),
                    company: $('#createcompany').val()
                },
                success: function(data, textStatus, XMLHttpRequest) {
                	if (data == '-1'){
                	    $('#createmsg').html('Account already exists');
                	} else if (data == '0') {
                	    $('#createmsg').html('Error creating the account');
                	} else if (data == '1') {
                	    toggleForm();
                	    $('#msg').html('Account created, please login');
                	}
                }, error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    $('#createmsg').html('Status: ' + textStatus + " Error: " + errorThrown);
                } 
            });
            return false;
        });
});