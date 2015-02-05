jQuery.widget("ui.entityinstance",{
	
	_create: function(){
		var self = this;
		$(this.element).css('border','2px solid yellow');
		$(this.element).css('width','20%');
		$(this.element).css('height','20%');

		$(this.element).draggable({
			helper: 'clone',
			containment: "parent"
		}).droppable({
			drop: function(event,ui){
				console.log(event);
				$('<div>').html($(ui.helper.context.outerHTML).html()).appendTo(self.element).entityinstance();
				event.stopPropagation();
			}
		});
	}
	
});