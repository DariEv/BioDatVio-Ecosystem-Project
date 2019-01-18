/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */

$( document ).ready(function() {
    
    
    if (window.location.href == "http://127.0.0.1:5000/project") {
        
        $("#proj").addClass("active")
        
    } else if (window.location.href == "http://127.0.0.1:5000/dataExploration") {
        
          $("#prof").addClass("active")
        
    } else if (window.location.href == "http://127.0.0.1:5000/metadataOverview") {
        
          $("#meta").addClass("active")
        
    } else {
        
          $("#pcoa").addClass("active")
        
    }
    
    
    $("a").on("click", function(){
        console.log(window.location.href);
  $(".nav").find(".active").removeClass("active");
  $(this).parent().addClass("active");
});
   
    
});



