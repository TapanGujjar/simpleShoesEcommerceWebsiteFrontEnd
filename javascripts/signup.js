var errors = [],

// Validation configuration
conf = {
    onElementValidate : function(valid, $el, $form, errorMess) {
        if( !valid ) {
            // gather up the failed validations
            errors.push({el: $el, error: errorMess});
        }
    }
},

// Optional language object
lang = {
    
};


var baseUrl="http://18.219.161.206:9000/";

$(document).ready(function(){

    //Setting up the form validator
    $.validate({
        modules : 'security'
      });
    // Restrict presentation length
    $('#presentation').restrictLength( $('#pres-max-length') );


    var height=window.innerHeight;
    var width=window.innerWidth;
    var navHeight=$(".navbar").height();
    console.log("navHeight="+navHeight);
    $(".mainContainer").css({'top':3*navHeight+"px"});

    function onSignUpSubmit(data,status,jqxhr){
        
        console.log(typeof(data));
        if(status=="success"){
            // alert(JSON.stringify(data));
            alert("Successfully Login");
        }
        else{
            data=data.responseText;
            data=JSON.parse(data);
            alert(data['message']);
        }
    }

    $("#signupBtn").on("click",function(event){
        // event.pree
        console.log("Sign up Button Clicked");
        errors=[];
        if(!$("#signupForm").isValid(lang,conf,true)){

        }
        else{
            console.log("Form Submission ");
            
            var fname=$("#signupFname").val();
            var lname=$("#signupLname").val();
            var email=$("#signupEmail").val();
            var password=$("#signupRepeatPassword").val();

            var json={};
            json['fname']=fname;
            json['lname']=lname;
            json['email']=email;
            json['password']=password;

            var url=baseUrl+"api/user/signup";

            formSubmissionPost(url,json,onSignUpSubmit);

        }
    });

    function onLoginSuccess(data,status,jqxhr){
        

        if(status=="success"){
            localStorage.userID=data.userID;
            localStorage.email=data.email;
            localStorage.accessKey=data.accessKey;
            alert("Successfully LoggedIN");
            window.location.replace("home.html");
        }
        else{
            alert("Sorry! Login Failed");
        }
    }

    $("#loginButton").on("click",function(event){
        console.log("Login Button Clicked");
        errors = [];
        if( !$('#loginForm').isValid(lang, conf, true) ) {
        
        }else{
            var email=$("#loginEmail").val();
            var password=$("#loginPassword").val();

            var json={};
            json['email']=email;
            json['password']=password;
            
            var url=baseUrl+"api/user/login";
            formSubmissionPost(url,json,onLoginSuccess)
        }
    });
});

function formSubmissionPost(url,data,successFunction){
    console.log("DDD="+JSON.stringify(data));
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",    
        success: successFunction,
        error:successFunction,
        dataType: "json"
      });
      
      
}

function formSubmissionGet(url,successFunction,functionParameter,errorFunction){
    $.get(url,function(data,status){
        if(status=="success"){
            successFunction(data,functionParameter);
        }
        else{
            alert("Error in Fetching from database");
        }
    })
}