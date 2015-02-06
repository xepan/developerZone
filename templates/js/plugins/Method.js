Method_Count= 0;

Method = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.options = {
		name:undefined,
		uuid:undefined,
		ports:{
			inPorts:[],
			outPorts:[]
		},
		x:0,
		y:0
	};

	this.init = function(dropped,parent_element,ui,editor){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;
		$(self).uniqueId();

		var dropped_name = prompt("Please enter name");
			if(dropped_name == null) return;

		self.options.name = dropped_name;	
		self.options.uuid = $(self).attr('id');	
		var inports=dropped.data('inports');
		var outports=dropped.data('outports');
		self.options.ports.inPorts = inports;
		self.options.ports.outPorts = outports;
	}

	this.insertNode = function(parent_uuid,obj){
		
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			Method_Count++;
			this.element = $('<div data-type="Method" count="'+Method_Count+'" style="background-color:#fff8dc"><span class="label label-success">'+self.options.name+'</span>');
			$(this.element).uniqueId();

			this.element.appendTo(self.parent);
			
			// Push Into Editor.options.methods
			methods = self.editor.options.methods;
			temp_obj = {};
			temp_obj['uuid'] = self.options.uuid;
			temp_obj['Ports'] = {};
			temp_obj.Ports['In'] = {};
			temp_obj.Ports['Out'] = {};
			temp_obj['Nodes'] = [];
			temp_obj['Connections'] = [];

			methods[self.options.name] = temp_obj;

			$.each(self.options.ports.inPorts,function(port_type ,label){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red;">').appendTo(self.element);
				jsPlumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.ports.outPorts,function(port_type ,label){
				var new_outport = $('<div style="width:20px; height:20px; background-color:blue;">').appendTo(self.element);
				jsPlumb.makeSource(new_outport, {
			      anchor: 'Continuous',
			    });
			})

			this.element.draggable({
		            containment: 'parent',
		            stop:function(e){
		            	// console.log($(this).find('._jsPlumb_endpoint_anchor'));
			   //  	   	$(this).find('._jsPlumb_endpoint_anchor').each(function(i,e){ 
		    //                 if($(e).hasClass("connect"))
		    //                     jsPlumb.repaint($(e).parent());
		    //                 else
		    //                     jsPlumb.repaint($(e));
						// });			
						jsPlumb.repaintEverything();							
		            }
		        })
				.resizable({

				})
				.droppable({
					greedy: true,
					drop: function(event,ui){
						if(!ui.draggable.hasClass('createNew')) return; 
						
						dropped = ui.draggable;
						var new_node = new window[dropped.data('type')]();
						new_node.init(dropped,self.element,ui,self.editor);
						new_node.render();
						//Push Into Parent editor methods as node
						current_method_nodes = self.editor.options.methods[self.options.name].Nodes;
						current_method_nodes.push(new_node.options);
						jsPlumb.repaintEverything();
					}
				});
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}