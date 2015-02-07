jQuery.widget("ui.editor",{
	
	options:{
		jsplumb: undefined,
		entity:{
			"name":"entity_name",
			"class":"Default_name",
			attributes:[],
			Method: []
		},


		includePlugins:['CodeBlock','Node','Port']
	},

	_create: function(){
		var self = this;

		self.loadPlugins();
		$.atk4(function(){
			self.setupEditor();
			self.loadDesign();
			self.render();
		});
		// console.log(self.options);
	},

	setupEditor: function(){
		var self = this;
		// Setup Plugins
		//Make Editor droppable
		$(self.element).css('border','2px solid blue');
		$(self.element).css('position','relative');
		self.options.jsplumb = $.univ().newjsPlumb($(this.element).attr('id'));
		$(self.element).droppable({
			accept: ".for-editor",
			drop: function(event,ui){
				if(!ui.draggable.hasClass('createNew')) return;

				dropped = ui.draggable;
				var new_node = new window[dropped.data('js_widget')]();
				new_node.createNew(dropped,self.element,self);

				// self.options.entity[dropped.data('type')] = new_node.options;
			}

		});

		$(this.element).data('options',self.options);

	},

	loadPlugins: function(){
		var self = this;
		$.each(this.options.includePlugins, function(index, js_file) {
			$.atk4.includeJS("epan-components/developerZone/templates/js/plugins/"+js_file+".js");
		});
	},


	loadDesign: function(){
		var self = this;
		// load methods
		$.each(self.options.entity.Method,function(id, method_options){
			var new_node = new CodeBlock();
			new_node.createNew(undefined,self.element,self,method_options);
			// load its nodes
			// self.loadNodes(new_node,method_options.Nodes);
			// create connections
		});
	},

	loadNodes: function (parent,node_array){
		var self=this;
		$.each(node_array,function(index,node){
			var new_node = new window[node.js_widget]();						
			new_node.createNew(undefined,parent.element,parent.editor,node.options);
			self.loadNodes(new_node,node.Nodes);
		});
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