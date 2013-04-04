window.onload = function() {	
	$('.tool-info').tooltip();
	
	/*$(".container-switch").click(function(e){
		e.preventDefault();
		var parent = $(this).parent();
		var active = parent.parent().children().
		if (parent.attr("class") != "active"){
			active.removeAttr("class");
			parent.attr("class", "active");
			$(".containerView").hide("slow");
		}
		
		
		
		if ($(this).parent().attr("class") != "sel"){
			var $active = $(".sel");
			$active.removeAttr('class');
			$active.css({"color": "#c01a32", "background-color":"transparent"});
			$(this).attr("class", "sel");
			$(this).css({"color": "#fff699", "background-color":"#222"});
			$(".contentView").hide("slow");
			var $this = $(this).text();
			$("#"+$this).show("slow");
		}*/
	});
}