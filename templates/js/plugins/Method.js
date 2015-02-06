Method_Count= 0;

Method = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.jsplumb=undefined;
	this.options = {
		name: undefined,
		uuid:undefined,
		type:'Method',
		Ports: {
			In: [],
			Out: []
		},
		Nodes: [],
		Connections: [],
		x:0,
		y:0
	};

	this.init = function(dropped,parent_element,ui,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined)
			self.options=options;

		var dropped_name = prompt("Please enter name");
			if(dropped_name == null) return;

		self.options.name = dropped_name;	
		
	}

	this.insertNode = function(parent_uuid,obj){
		
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			this.element = $('<div data-type="Method" class="entity-method entity-container" style="background-color:#fff8dc"><div class="label label-success">'+self.options.name+'</div>');
			
			if(self.options.uuid == undefined){
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',this);
			this.element.appendTo(self.parent);
			self.editor.options.entity.Method[self.options.uuid] = self.options ;
			// this.element.css('position','absolute');

			self.jsplumb = $.univ().newjsPlumb($(this.element).attr('id'));

			$(this.element).find('div').click(function(e){
				$(this).attr('contenteditable',"true");
				$(this).focus();
				e.preventDefault();
			}).blur(function(e){
				$(this).attr('contenteditable',"false");
				e.preventDefault();
			});

			$.each(self.options.Ports.In,function(index ,port){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red;">').appendTo(self.element);
				self.jsplumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.Ports.Out,function(index ,port){
				var new_outport = $('<div style="width:20px; height:20px; background-color:blue;">').appendTo(self.element);
				self.jsplumb.makeSource(new_outport, {
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
						// jsPlumb.repaintEverything();							
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
						// self.jsplumb.repaintEverything();
					}
				});
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}