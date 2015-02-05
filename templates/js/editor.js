jQuery.widget("ui.editor",{
	
	_create: function(){
		var self = this;
		$(self.element).css('border','2px solid blue');
		$(self.element).droppable({
				drop: function(event,ui){
					$('<div>').html($(ui.helper.context.outerHTML).html()).appendTo(self.element).entityinstance();	
				}
			});
	}
	
});