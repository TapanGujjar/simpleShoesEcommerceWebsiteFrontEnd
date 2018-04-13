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


$(document).ready(function(){
    //Setting up the form validator
    $.validate();
    // Restrict presentation length
    $('#presentation').restrictLength( $('#pres-max-length') );
    

    function formResponse(data,status,jqxhr){
        console.log("S="+status);
        console.log("D="+JSON.stringify(data));
    }
    
    //Form Button Button
    $("#formSubmit").on("click",function(){
        //Checking Error in form before submitting
        errors = [];
        if( !$('#addProductForm').isValid(lang, conf, true) ) {
        
        } else {
            console.log("No Errror");
            // The form is valid

            var data = $('#addProductForm').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            console.log("data="+data);

            // $.post("http://localhost:9000/api/products/add",data,formResponse,JSON);


            formSubmissionPost("http://localhost:9000/api/products/add",data,formResponse)
        }
    });

    //the id of div is added in parameterArray[0]
    function addSelectOption(optionDataObjects,parameterArray){
        console.log("sda Gujjar");
        for(i=0;i<optionDataObjects.length;i++){
            console.log(Object.keys(optionDataObjects[0]));
            keys=Object.keys(optionDataObjects[i]);
            $("#"+parameterArray[0]).append(new Option(optionDataObjects[i][keys[1]],optionDataObjects[i][keys[0]]));
        }
    }
    formSubmissionGet("http://localhost:9000/api/category/all",addSelectOption,['productCategory'],null);

    formSubmissionGet("http://localhost:9000/api/company/all",addSelectOption,['productManufacturer'],null);
    
    formSubmissionGet("http://localhost:9000/api/occasion/all",addSelectOption,['productOccasion'],null);
    

            
    
});


function formSubmissionPost(url,data,successFunction){
    console.log("DDD="+JSON.stringify(data));
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: successFunction,
        dataType: "json"
      });
      
      
}

function formSubmissionGet(url,successFunction,functionParameter,errorFunction){
    $.get(url,function(data,status){
        if(status=="success"){
            successFunction(data,functionParameter);
        }
    })
}