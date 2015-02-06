Method_Count= 0;

Method = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.options = {
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
		var inports=dropped.data('inports');
		var outports=dropped.data('outports');
		self.options.ports.inPorts = inports;
		self.options.ports.outPorts = outports;
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			Method_Count++;
			this.element = $('<div data-type="Method" count="'+Method_Count+'" style="background-color:#fff8dc">');
			$(this.element).uniqueId();

			this.element.appendTo(self.parent);

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
						new_node.init(dropped,self.element,ui);
						self.editor.options.logic.nodes.push(new_node);
						$(new_node).attr('parent_uuid',self.id);
						new_node.render();
						jsPlumb.repaintEverything();
					}
				});
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}