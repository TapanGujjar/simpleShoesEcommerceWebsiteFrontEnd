$(document).ready(function(){

    if(localStorage.getItem("userID")!=undefined || localStorage.getItem("userID")!=null){
        $('.rightNav').append(`<li><a href="myAccount.html">MyCart</a></li>`);
    }
    else{
        $('.rightNav').append(`<li><a href="signup.html">Login</a></li>
        <li><a href="signup.html">Signup</a></li>`);
    }
});