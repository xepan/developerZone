Process_Count= 0;

Process = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.options = {
		uuid:undefined,
		process : {
			tool_type:"Process",
			Ports: {
				In: {},
				Out: {}
			},
			Nodeskey: [],
			Connections: []
		}
	};

	this.init = function(dropped,parent_element,ui,editor){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;
		$(self).uniqueId();
		
		self.options.uuid = $(self).attr('id');
		var inports=dropped.data('inports');
		var outports=dropped.data('outports');
		self.options.ports.inPorts = inports;
		self.options.ports.outPorts = outports;
		

	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			Process_Count++;
			this.element = $('<div data-type="Process" count="'+Process_Count+'" style="background-color: lightblue">');
			$(this.element).uniqueId();

			this.element.appendTo(self.parent);
			//Push into editor.options.methods.entity.nodes.node
			//First get the parent uuid and name

			$.each(self.options.process.Ports.In,function(port_type ,label){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red;">').appendTo(self.element);
				jsPlumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.ports.outPorts.Out,function(port_type ,label){
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

						self.editor.options.logic.nodes.push(new_node);
						jsPlumb.repaintEverything();
					}
				});
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}