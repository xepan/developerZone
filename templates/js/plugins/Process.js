Process_Count= 0;

Process = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.options = {
		name: undefined,
		uuid:undefined,
		type:'Process',
		Ports: {
			In: [],
			Out: []
		},
		Nodes: [],
		// Connections: [],
		x:0,
		y:0
	};

	this.init = function(dropped,parent_element,ui,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;
		if(options != undefined)
			this.options = options;
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			this.element = $('<div data-type="Process" style="background-color: lightblue">');
			
			if(self.options.uuid == undefined){
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('obj',this);

			this.element.appendTo(self.parent);
			//Push into editor.options.methods.entity.nodes.node
			//First get the parent uuid and name

			$.each(self.options.Ports.In,function(port_type ,label){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red;">').appendTo(self.element);
				jsPlumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.Ports.Out,function(port_type ,label){
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

						self.options.Nodes.push(new_node.options);
						jsPlumb.repaintEverything();
					}
				});
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}