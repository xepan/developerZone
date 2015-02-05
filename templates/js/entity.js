jQuery.widget("ui.entity",{
	
	_create: function(){
		$(this.element).css('border','2px solid green');
		$(this.element).draggable({
			helper: 'clone'
		});
	}
	
});