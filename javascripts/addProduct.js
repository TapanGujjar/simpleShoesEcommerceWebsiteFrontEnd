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

var baseUrl="http://localhost:9000/";


$(document).ready(function(){
    //Setting up the form validator
    $.validate();
    // Restrict presentation length
    $('#presentation').restrictLength( $('#pres-max-length') );
    

    function formResponse(data,status,jqxhr){
        console.log("S="+status);
        console.log("D="+JSON.stringify(data));
        if(status=="success"){
            
            alert("Successfully added Products");
            document.getElementById("addProductForm").reset();
        }
        else{
            alert("Error in adding product");
        }
    }

    function AddMoreProductVariant(){

        console.log("Add Product Variant");
        var numVariant=$('#numVariant').val();
        var variantIndex=$("#variantIndex").val();

        var numVariant=parseInt(numVariant)+1;

        console.log("Add More Product Variants");
        var htmlSnippet=`<div id="formVariant`+numVariant+`">
            <div class="form-group">
                <input type="text" id="productImageUrl`+numVariant+`" name="productImageUrl`+numVariant+`" class="form-control" placeholder="Image Url" data-validation="length" data-validation-length="5-40000">
            </div>
            <div class="form-group">
                <input type="text" id="productColor`+numVariant+`" name="productColor`+numVariant+`" class="form-control" placeholder="product Color e.g. red,brown" data-validation-length="2-100"> 
            </div>
            <div class="form-group">
                <input type="text" id="price`+numVariant+`" name="price`+numVariant+`" class="form-control" placeholder="price e.g.120" data-validation="number" data-validation-allowing="float,range[1;2000]">
            </div>
            <div class="form-group">
                <input type="text" id="size`+numVariant+`" name="size`+numVariant+`" class="form-control" placeholder="sizes e.g. 8,9,10" data-validation-length="1-100">
            </div>
            <div class="form-group">
                <input type="text" id="quantity`+numVariant+`" name="quantity`+numVariant+`" class="form-control" placeholder="prices e.g. 80,90,100" data-validation-length="2-100">
            </div>
            <div class="form-group">
                <button type="button" id="removeProductVariant_`+numVariant+`" class="btn btn-danger form-control">Remove Product Variant Button</button>
            </div>
            <div class="form-group">
                <button type="button" id="AddMoreVariantButton"  class="btn btn-primary form-control">Add More Variant Button</button>
            </div>
        </div>`;

        $("#formVariantContainer").append(htmlSnippet);

        variantIndex=variantIndex+"_"+numVariant;
        console.log("Variant index add="+variantIndex);

        $('#numVariant').val(numVariant);
        $('#variantIndex').val(variantIndex);

        //Setting up the form validator
        $.validate();
        // Restrict presentation length
        $('#presentation').restrictLength( $('#pres-max-length') );
    }

    $(document).on("click",'#AddMoreVariantButton',function(event){
        if(event.target.id=="AddMoreVariantButton"){
            AddMoreProductVariant();
        }
    });

    $(document).on("click",function(event){
        var idSplit=event.target.id.split("_");
        var numVariant,variantIndex;
        if(idSplit.length>1 && idSplit[0]=='removeProductVariant'){
            var removeId=idSplit[1];
            console.log("Remove Product Variant");
            console.log("Remove Id="+removeId);
            numVariant=$("#numVariant").val();
            variantIndex=$("#variantIndex").val();
            variantIndices=variantIndex.split("_")
            newVariantIndex="";
            console.log("old variant Indices="+variantIndices);
            variantIndices.splice(variantIndices.indexOf(removeId),1);
            console.log("new variant Indices="+variantIndices);

            for(var i=0;i<variantIndices.length;i++){
                newVariantIndex=newVariantIndex+variantIndices[i];
                if(i!=variantIndices.length-1){
                    newVariantIndex=newVariantIndex+"_";
                }
            }

            console.log("formVariant"+removeId);
            $("#formVariant"+removeId).remove();
            numVariant=parseInt(numVariant)-1;
            $('#numVariant').val(numVariant);
            $("#variantIndex").val(newVariantIndex);

            console.log("numVariant="+$("#numVariant").val());
            console.log("varaintIndex="+$("#variantIndex").val());

        }
    });
    //Form Button Button
    $("#formSubmit").on("click",function(){
        //Checking Error in form before submitting
        errors = [];
        if( !$('#addProductForm').isValid(lang, conf, true) ) {
        
        } else {
            // console.log("No Errror");
            // The form is valid

            var data = $('#addProductForm').serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            // console.log("data="+data);

            // $.post("http://localhost:9000/api/products/add",data,formResponse,JSON);


            formSubmissionPost(baseUrl+"api/products/add",data,formResponse)
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
    formSubmissionGet(baseUrl+"api/category/all",addSelectOption,['productCategory'],null);

    formSubmissionGet(baseUrl+"api/company/all",addSelectOption,['productManufacturer'],null);
    
    formSubmissionGet(baseUrl+"api/occasion/all",addSelectOption,['productOccasion'],null);
    

            
    
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