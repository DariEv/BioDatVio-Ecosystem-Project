/* Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19 */

$( document ).ready(function() {


    if (window.location.href == "http://127.0.0.1:5000/project") {

        $("#proj").addClass("active")

    } else if (window.location.href == "http://127.0.0.1:5000/dataExploration") {

          $("#prof").addClass("active")

    } else if (window.location.href == "http://127.0.0.1:5000/metadataOverview") {

          $("#meta").addClass("active")

    } else if (window.location.href == "http://127.0.0.1:5000/PCoA"){

          $("#pcoa").addClass("active")
    }

    //filter
    $(".dropdown-menu li a").on('click', function() {
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
		$(this).parents(".dropdown").find('.btn').val($(this).attr('value'));
	});
	document.querySelector('#FROM').addEventListener('input', function(){
		if(this.value>=0){
		document.querySelector('#FROM').setAttribute('value',this.value);
		}
		else{alert("Out of range! Stay above 0.")}
	});
	document.querySelector('#TO').addEventListener('input', function(){
		if(this.value>=0){
		document.querySelector('#TO').setAttribute('value',this.value);
		}
		else{alert("Out of range! Stay above 0.")}
	});

  $("a").on("click", function(){
  $($(this).parent().parent()).find('.active').removeClass('active');
  $(this).parent().addClass("active");
});


});
