jQuery.widget("ui.editortool",{
	
	_create: function(){
		// $(this.element).css('border','2px solid orange');
		$(this.element).draggable({
			helper: 'clone'
		});
	}
	
});