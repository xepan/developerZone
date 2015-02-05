jQuery.widget("ui.editor",{
	
	options:{
		logic:{
			nodes:[],
			connections:[]
		},
		includePlugins:['Model']
	},

	_create: function(){
		var self = this;
		self.loadPlugins();
		self.setupEditor();
		self.loadDesign();
		self.render();
		console.log(self);
	},

	setupEditor: function(){
		var self = this;
		// Setup Plugins
		//Make Editor droppable
		$(self.element).css('border','2px solid blue');
		// $(self.element).css('position','relative');
		$(self.element).droppable({
			
			drop: function(event,ui){
				if(!ui.draggable.hasClass('createNew')) return;
				dropped = ui.draggable;
				var new_node = new window[dropped.data('type')]();
				new_node.init(dropped,self.element,ui);
				self.options.logic.nodes.push(new_node);
				new_node.render();
				jsPlumb.repaintEverything();
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