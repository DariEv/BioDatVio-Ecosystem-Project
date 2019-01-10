$( document ).ready(function() {
    $(".dropdown-menu li a").on('click', function() {
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
		$(this).parents(".dropdown").find('.btn').val($(this).attr('value'));
	});
});
