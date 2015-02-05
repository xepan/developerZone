jQuery.widget("ui.entityinstance",{
	
	_create: function(){
		var self = this;
		$(this.element).css('border','2px solid gray');
		$(this.element).css('width','20%');
		$(this.element).css('height','20%');

		$(this.element).draggable({
			containment: "parent"
		}).droppable({
			greedy: true,
			drop: function(event,ui){
				// create Element
				$('<div>').html($(ui.helper.context.outerHTML).html()).appendTo(self.element).entityinstance();
				event.stopPropagation();
			}
		});
	}
	
});