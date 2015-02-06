jQuery.widget("ui.editor",{
	
	options:{
		entity:{
			"name":"entity_name",
			"class":"Default_name",

			attributes:{
				attribute:{
					'type': "Dumy_table",
					'name': "Dumy_table_name",
					'accessMode' : "Dumy_accessMode"
				}
			},

			Method:{}
		},


		includePlugins:['Model','Process','Method']
	},

	_create: function(){
		var self = this;

		self.loadPlugins();
		self.setupEditor();
		self.loadDesign();
		self.render();
		// console.log(self.options);
	},

	setupEditor: function(){
		var self = this;
		// Setup Plugins
		//Make Editor droppable
		$(self.element).css('border','2px solid blue');
		// $(self.element).css('position','absolute');
		$(self.element).droppable({
			
			drop: function(event,ui){
				if(!ui.draggable.hasClass('createNew')) return;

				dropped = ui.draggable;
				var new_node = new window[dropped.data('type')]();

				new_node.init(dropped,self.element,ui,self);
				new_node.render();

				// self.options.entity[dropped.data('type')] = new_node.options;
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

	},

	moveNode: function(node_array,from_index,to_index){
  	  	var self = this;
  	  	
  	  	var element = node_array[from_index]
    	node_array.splice(from_index, 1);
    	node_array.splice(to_index, 0, element);
	}
	
});