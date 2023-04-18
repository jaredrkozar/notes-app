var form = '<form id="login_idx" action="/login" method="post">' +
    '<label>Username:</label><input type="text" name="username"/>' +
    '<label>Password:</label><input type="password" name="password"/>' +
    '<input type="submit" value="Log In"/></form>';
$('body').append(form);
$('body').append('<button onclick="cookieMe()">Cookie?</button>')
$('body').append('<button onclick="cookieEat()">No!</button>')
$('body').append('<button onclick="cookieSee()">See?</button>')
$('body').append('<div id="one"></div>')

var cookieMe = function(){
    $.ajax({
        url: "http://localhost:8080/set_cookie",
        type: 'GET',
        success: function( result ) {
            $( "#one" ).html( "<p>" + result + "</p>");
        }
    });
}

var cookieEat = function(){
    $.ajax({
        url: "http://localhost:8080/delete_cookie",
        type: 'DELETE',
        success: function( result ) {
            $( "#one" ).html( "<p>" + result + "</p>");
        }
    });
}

var cookieSee = function(){
    $.ajax({
        url: "http://localhost:8080/get_cookie",
        type: 'GET',
        success: function( result ) {
            $( "#one" ).html( "<p>" + result + "</p>");
        }
    });
}