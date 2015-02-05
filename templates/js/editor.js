jQuery.widget("ui.editor",{
	
	options:{
		logic:{},
		includePlugins:['Model']
	},

	_create: function(){
		var self = this;
		self.setupEditor();
		self.loadDesign();
		self.render();
	},

	setupEditor: function(){
		var self = this;
		// Setup Plugins
		self.loadPlugins();
		//Make Editor droppable
		$(self.element).css('border','2px solid blue');
		$(self.element).droppable({
			
			drop: function(event,ui){
				if(!ui.draggable.hasClass('newInstance')){
					// console.log(ui.draggable.data("type"));
					//Update Logic
					$('<div class="newInstance">').html($(ui.helper.context.outerHTML).html()).appendTo(self.element);
				}

			}

		});
	},

	loadPlugins: function(){
		var self = this;
		$.each(this.options.includePlugins, function(index, js_file) {
			$.atk4.includeJS("epan-components/developerZone/templates/js/plugins/"+js_file+".js");
		});
	},


	loadDesign: function(){

	},

	render: function(){

	}
	
});