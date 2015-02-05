jQuery.widget("ui.entityinstance",{
	
	_create: function(){
		$(this.element).css('border','2px solid yellow');
		$(this.element).draggable({
			helper: 'clone'
		});
	}
	
});