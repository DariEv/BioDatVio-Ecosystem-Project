$( document ).ready(function() {
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
});
