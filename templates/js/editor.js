jQuery.widget("ui.editor",{
	
	ports_obj:[],

	options:{
		jsplumb: undefined,
		entity:{
			"id":undefined,
			"name":"entity_name",
			"class":"Default_name",
			attributes:[],
			Method: []
		},


		includePlugins:['CodeBlock','Node','Port','MethodCall']
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
		// $(self.element).css('border','2px solid blue');
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
			// console.log('Methods uuid ' + new_node.options.uuid);
			$(this).xunique(new_node.options.uuid);
			// load its nodes
			self.loadNodes(new_node,method_options.Nodes);
			// create connections
			self.loadConnections(method_options);
		});

	},

	loadNodes: function (parent,node_array){
		var self=this;
		$.each(node_array,function(index,node){
			// console.log(node);
			var new_node = new window[node.js_widget]();
			new_node.createNew(undefined,parent.element,parent.editor,node);
			// console.log('Nodes uuid ' + new_node.options.uuid);
			$(this).xunique(new_node.options.uuid);
			self.loadNodes(new_node,node.Nodes);
		});
	},

	loadConnections: function(method_options){
		var self = this;

		jsplumb = jsPlumbs['dd_'+method_options.uuid];

		saved_connections = jQuery.extend(true, {}, method_options.Connections);
		method_options.Connections = [];
		
		$.each(saved_connections, function (index,conn){
			jsplumb.connect({ uuids:[conn.sourceId,conn.targetId] });
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

xunique_given_max=1;
jQuery.fn.xunique = function(given_value) {
		// console.log("already given " + given_value);
        if(given_value != undefined){
        	given_value = parseInt(given_value);
        	if(given_value >= xunique_given_max){
        		// console.log("greater then " + xunique_given_max);
        		xunique_given_max = given_value+1;	
        	}
        }else{
        	var x = xunique_given_max++;
        	// console.log("returning " + x);
        	return x;
        }
};

jQuery(function($) {
  function fixDiv() {
    var $cache = $('.editor_top_bar');
    if ($(window).scrollTop() > 100){
      $cache.css({
        'position': 'fixed',
        'top': '10px',
        'z-index':10,
        'left':0
      });
    }
    else
      $cache.css({
        'position': 'relative',
        'top': 'auto'
      });
  }
  $(window).scroll(fixDiv);
});
