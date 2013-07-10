$("input").on("focus", function() {
	$(this).select();
}).mouseup(function(e) {
	e.preventDefault();
});

$("#addMake .submit").on("click", function() {
	$(".result").fadeOut(300).fadeIn(1000);
	$.ajax({
		type: 'POST',
		url: 'controller.php',
		data: $("#addMake").serialize(),
		success: function(data) {
			console.log(arguments);
			$(".result").empty().html(data);
		},
		error: function() {
			console.log(arguments[0]);
		}
	});
});