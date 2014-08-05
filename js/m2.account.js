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
                    	if (data != 0){
                	        $.cookie('userToken', data);
                		    window.location = 'index.html';
                		} else {
                		    $('#msg').html('Incorrect email or password');
                		}
                	},
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        $('#msg').html('Status: ' + textStatus + " Error: " + errorThrown);
                    } 
                });
                return false;
            });
        
        
        $("#createform").submit(function (e) {
                $.ajax({
                    url: "lib/api.xsjs",
                    type: "POST",
                    data:{
                        service: "CreateUser",
                        email: $('#email').val(),
                        password: $('#password').val(),
                        name: $('#name').val(),
                        lname: $('#lname').val(),
                        company: $('#company').val()
                    },
                    success: function(data, textStatus, XMLHttpRequest) {
                    	if (data == '-1'){
                    	    $('#msg').html('Account already exists');
                    	} else if (data == '0') {
                    	    $('#msg').html('Error creating the account');
                    	} else if (data == '1') {
                    	    $('#msg').html('Account created, please login');
                    	}
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        $('#msg').html('Status: ' + textStatus + " Error: " + errorThrown);
                    } 
                });
                return false;
        });
});