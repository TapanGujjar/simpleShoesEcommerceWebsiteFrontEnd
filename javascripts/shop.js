var baseUrl="http://localhost:9000/";

var limit=1;
var offset=0;
var times=0;
var productData=[];
$(document).ready(function(){

    

    var navHeight=$(".navbar").height();
    $(".searchForm").css({'margin-top':2*navHeight+"px"});

    formSubmissionGet(baseUrl+"api/category/all",addCheckBox,['categoryCheckBoxContainer'],null);
    
    formSubmissionGet(baseUrl+"api/company/all",addCheckBox,['companyCheckBoxContainer'],null);
        
    formSubmissionGet(baseUrl+"api/occasion/all",addCheckBox,['occasionCheckBoxContainer'],null);

    formSubmissionGet(baseUrl+"api/product/sizes",addSizeCheckBox,['sizeCheckBoxContainer'],null);
        
    formSubmissionGet(baseUrl+"api/product/all?offset="+offset,addProductToHtml,['searchContent'],null);


    function addCheckBox(dataObjects,parameterArray){
        var htmlSnippet=``;
        for(i=0;i<dataObjects.length;i++){
            keys=Object.keys(dataObjects[i]);            
            htmlSnippet=htmlSnippet+"<input class='checkbox' type='checkbox' id="+keys[0]+":"+dataObjects[i][keys[0]]+" value="+keys[0]+":"+dataObjects[i][keys[0]]+" name="+dataObjects[i][keys[1]]+"/>"+dataObjects[i][keys[1]]+"<br>"
        }

        $('.'+parameterArray[0]).append(htmlSnippet);
    };

    function addProductToHtml(dataObjects,parameterArray){
        console.log(dataObjects);
        var htmlSnippet=``;

        for(i=0;i<dataObjects.length;i++){
            htmlSnippet=htmlSnippet+`<div class="col-md-4">
            <img  class="searchItemImage"src="`+dataObjects[i].productImageUrl+`">
            <h4 class="searchItemName">`+dataObjects[i].productName+`</h4>
            <h6 class="searchItemPrice">`+dataObjects[i].price+`</h6>
            <div class="row">
                <div class="col-md-6">
                    <button class="btn btn-danger" id=wishlist_"`+dataObjects[i].productColorID+`">Wishlist</button>
                </div>
                <div class="col-md-6">
                        <button class="btn btn-primary" id=cart_"`+dataObjects[i].productID+`_`+dataObjects[i].productColorID+`">Cart</button>
                </div>
            </div>
            </div>`;
        }

        // htmlSnippet=htmlSnippet+`<br><br><button class="btn btn-primary form-control" id="loadMoreButton">Load More<button>`
    
        productData.concat(dataObjects);

        $("."+parameterArray[0]).append(htmlSnippet);

        changeAddMore(parameterArray);

    }

    function changeAddMore(parameterArray){
        $("#loadMoreButton").remove();
        var htmlSnippet=`"<br><br><button class="btn btn-primary form-control" id="loadMoreButton">Load More</button>`;

        $("."+parameterArray).append(htmlSnippet);
    }
    
    function addSizeCheckBox(dataObjects,parameterArray){
        console.log(dataObjects);
        console.log(Object.keys(dataObjects));
        var htmlSnippet=``;
        var keys=Object.keys(dataObjects); 
        var temp;
        for(i=0;i<keys.length;i++){        
            temp=keys[i].split("_")[0];
            htmlSnippet=htmlSnippet+"<input  class='checkbox' type='checkbox' id="+temp+":"+dataObjects[keys[i]]+" value="+temp+":"+dataObjects[keys[i]]+" name="+dataObjects[keys[i]]+"/>"+dataObjects[keys[i]]+"<br>"
        }

        $('.'+parameterArray[0]).append(htmlSnippet);
    };

    function deleteSearchContent(){
        $(".searchContent").empty();
    }
    
    $('#productSearch').keypress(function (e) {
        if (e.which == 13) {
            $(".searchContent").empty();

            productData=[];
            searchTerm=$("#productSearch").val();
            formSubmissionGet(baseUrl+"api/product/search?term="+searchTerm,addProductToHtml,['searchContent'],null);            
            
            e.preventDefault();

        }
    });




    $(document).on("click",function(event){
        times=times+1;
        if(event.target.id=="loadMoreButton"){
            formSubmissionGet(baseUrl+"api/product/all?offset="+limit*times,addProductToHtml,['searchContent'],null);            
        
        }
    });

    $(document).on("click",".checkbox",function(event){
        if(event.target.checked==true){
            var i=0;
            var prop=event.target.id.split("_")[0];
            var value=event.target.id.split("_")[1]
            var newProductData=[];
            deleteSearchContent();
            
            for(i=0;i<productData.length;i++){
                if(productData[prop]==value){
                    newProductData.append(productData);
                }
            }
            productData=newProductData;
            this.addProductToHtml(productData,['searchContent']);
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