var baseUrl="http://18.219.161.206:9000/";



productData=[];
$(document).ready(function(){
    var navHeight=$(".navbar").height();
    $(".contentContainer").css({'margin-top':2*navHeight+"px"});
    userID=localStorage.getItem("userID");
    if(userID==null){
        alert("Login Bitch. You are tresspassing");
    }
    else{
        url=baseUrl+"api/product/getMyCart?userID="+userID;

        formSubmissionGet(url,getMyCart,['cartContainer'],getMyCart);
    }


    function addProductToHtml(dataObjects,parameterArray){
        console.log(dataObjects);
        var htmlSnippet=``;

        for(i=0;i<dataObjects.length;i++){
            htmlSnippet=htmlSnippet+`<div class="col-md-4">
            <img  class="searchItemImage"src="`+dataObjects[i].element.productColorElement.productImageUrl+`">
            <h4 class="searchItemName">`+dataObjects[i].element.productColorElement.product.productName+`</h4>
            <h6 class="searchItemPrice">`+dataObjects[i].element.productColorElement.price+`</h6>
            
                        <button class="btn btn-primary form-control" id=viewProduct_"`+dataObjects[i].element.productColorElement.productID+`_`+dataObjects[i].element.productColorElement.productColorID+`">ViewProduct</button>
            
            
            </div>`;
        }

        // htmlSnippet=htmlSnippet+`<br><br><button class="btn btn-primary form-control" id="loadMoreButton">Load More<button>`
    
        productData.concat(dataObjects);

        $("."+parameterArray[0]).append(htmlSnippet);

        // changeAddMore(parameterArray);

    }
    function getMyCart(data,parameterArray){
        addProductToHtml(data,parameterArray);
    }

    $(document).on("click",function(event){
        // times=times+1;
        // if(event.target.id=="loadMoreButton"){
        //     formSubmissionGet(baseUrl+"api/product/all?offset="+limit*times,addProductToHtml,['searchContent'],null);            
        
        // }
        target=event.target.id;
        target=target.split("_");
        if(target[0]=="viewProduct"){
            sessionStorage.setItem("productID",target[1]);
            sessionStorage.setItem("productColorID",target[2]);
            window.location.replace("viewProduct.html");
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