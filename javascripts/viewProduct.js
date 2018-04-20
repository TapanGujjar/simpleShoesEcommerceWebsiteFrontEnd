var baseUrl="http://18.219.161.206:9000/";




$(document).ready(function(){


    function replacer(value) {
        return value.replace(/[^\w\s]/gi, '');
    }
      
    url=baseUrl+"api/product/color?productColorID="+replacer(sessionStorage.getItem("productColorID"));
    


    function errorHandler(){

    }

    function productFetch(data,parameterArray){
        var productColor=null;
        var productSizeList=null;
        if(data.success=="1"){
            productColor=JSON.parse(data.productColor);
            productSizeList=JSON.parse(data.sizeList);
            console.log("productColor="+JSON.stringify(productColor));
            console.log("image url="+JSON.stringify(productSizeList[0]));;
            $("."+parameterArray[0]).append(`<img src=`+productColor.productImageUrl+`\>`)

            var htmlSnippet=`<h2>`+productColor['product']['productName']+`</h2>
            <h3>By `+productColor['product']['manufacturers']['companyName']+`</h3>`;

            htmlSnippet=htmlSnippet+`<div class="sizeContainer`;
            htmlSnippet=htmlSnippet+ `<div class="form-group"><select id="productSizeSelect" class="form-control" name="productSizeSelect placeholder="Select Size" ></select></div></div>`;

            $("."+parameterArray[1]).append(htmlSnippet);

            for(i=0;i<productSizeList.length;i++){
                $("#productSizeSelect").append(new Option(productSizeList[i]['size'],productSizeList[i]['productSizeID']+"_"+productSizeList[i]['size']));
            }

            htmlSnippet=`
            <div class="buttonContainer">
            <div class="form-group">
            <button class="btn btn-primary form-control"id="buynow_button"  type="button">Buy Now</button>
            </div>
            <div class="form-group">
            <button class="btn btn-primary form-control" id="addToCart_button" type="button">Add To Cart</button>
            </div>
            <div class="form-group">
            <button class="btn btn-primary form-control" id="addTowishlist_button" type="button">Add To Wishlist</button>
            </div></div>`;

            $("."+parameterArray[1]).append(htmlSnippet);

            htmlSnippet=`<h2 class="text-center">Product Description</h2>
            <h5 class="text-center">`+productColor['product']['productDesc']+`</h5>`;

            $(".productDescContainer").append(htmlSnippet);


        
            keys=Object.keys(productColor['product']);

            for(i=0;i<keys.length;i++){
                // console.log(typeof(productColor['product'][keys[i]]));
                if(typeof(productColor['product'][keys[i]])=="object"){
                    // if(productColor[keys[i]]){
                    console.log(productColor['product'][keys[i]]==null);
                    if(productColor['product'][keys[i]]!=null){
                        newKeys=Object.keys(productColor['product'][keys[i]]);
                        $("#attributeTable").append("<tr><th>"+newKeys[1]+"</th><th>"+productColor['product'][keys[i]][newKeys[1]]+"</th>");
                        
                        
                    }
                }

                else{
                    
                    $("#attributeTable").append("<tr><th>"+keys[i]+"</th><th>"+productColor['product'][keys[i]]+"</th><tr>");
                }
            }

            // console.log(keys);
        }
    }
    
    formSubmissionGet(url,productFetch,["imageContainer","contentContainer"],errorHandler);

    function cartAdd(data,parameterArray){
        console.log("cart addd");
        console.log(typeof(data));
        alert(data.message);
        if(data.success=="1"){
            sessionStorage.removeItem("productID");
            sessionStorage.removeItem("productSizeID");
            window.location.replace("shop.html");
        }
    }

    $(document).on("click","#addToCart_button",function(e){
        userID=localStorage.getItem("userID");
        if(userID==null){
            alert("Please Login to add product to cart");
        }
        productSizeID=$("#productSizeSelect option:selected").val().split("_")[0];
        console.log(productSizeID);
        url=baseUrl+"api/product/addToCart?userID="+userID+"&productSizeID="+productSizeID;
        formSubmissionGet(url,cartAdd,null,cartAdd);

     });
    

    var navHeight=$(".navbar").height();
    $(".viewProductContainer").css({'margin-top':2*navHeight+"px"});

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