Node = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
	this.options = {
		name: undefined,
		uuid:undefined,
		type:'Method',
		js_widget:'Node',
		Ports: [],
		Nodes: [],
		Connections: [],
		top:0,
		left:0,
		width:100,
		height:50,
		ports_obj:[]
	};

	this.createNew = function(dropped,parent_element,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined){
			self.options=options;
		}else{
			self.options.uuid = undefined;
			self.options.name = dropped.data('name');
			self.options.type = dropped.data('type');
			self.options.js_widget = dropped.data('js_widget');

			// default flow in port
			var flow_in = {
							uuid:undefined,
							type:'in-out',
							name:'Flow In',
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							left:0,
							top:0,
							creates_block: false
						};
			self.options.Ports.push(flow_in);

			var prts = jQuery.extend(true, {}, dropped.data('ports'));

			$.each(prts, function (index, port){
				self.options.Ports.push(port);
			});
			$(parent_element).data('options').Nodes.push(self.options);
		}


		self.render();
	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			this.element = $('<div data-type="'+self.options.type+'" class="node">');
			var remove_btn  = $('<div class="glyphicon glyphicon-remove-circle pull-right remove-btn">').appendTo(this.element);

			if(self.options.type == 'Method') this.element.addClass('entity-method');
			
			var name = $('<div class="name" >'+self.options.name+'</div>').appendTo(this.element);
					
			$(name).click(function(e){
				$(this).attr('contenteditable',"true");
				$(this).focus();
				e.preventDefault();
			}).blur(function(e){
				$(this).attr('contenteditable',"false");
				e.preventDefault();
				self.options.name = $(this).html();		
			});

			if(self.options.uuid == undefined){
				// console.log('UUID not found');
				$(this.element).attr('id',$(this).xunique());
				self.options.uuid = $(this.element).attr('id');
			}else{
				// console.log('UUID found');
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',self.options);
			this.element.appendTo(self.parent);
			

			$.each(self.options.Ports,function(index ,port_options){
				// createNew Port by providing options
				p = new Port();
				p.createNew(undefined,self.element,self.editor,port_options);
			})

        	var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
        	// console.log(container_id);
			self.jsplumb = jsPlumbs[container_id];
			
			// jsplumb.draggable(this.element.attr('id'),{containment: 'parent'});

			this.element
			.draggable({
				containment: 'parent',
				drag: function(event,ui){
					self.jsplumb.repaintEverything();
					self.options.top = ui.position.top; 
					self.options.left = ui.position.left;
				}
			})
			.resizable({
				handles: "se",
				containment: self.parent,
				resize: function(event, ui){
						self.options.width = $(this).width();
						self.options.height = $(this).height();
					}
			})
			.droppable({
				accept: ".port",
				greedy: true,
				drop: function(event,ui){
					var new_port = {
							uuid:undefined,
							type: ui.draggable.data('type'),
							name:'New Port',
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							left:0,
							top:0
						};
					self.options.Ports[ui.draggable.data('type')].push(new_port);
					self.jsplumb.repaintEverything();
				}
			})
			;

			$(this.element).css("top",self.options.top + "px");
			$(this.element).css("left",self.options.left +"px");
			$(this.element).css("width",self.options.width +"px");
			$(this.element).css("height",self.options.height + "px");

			$(remove_btn).click(function(){
				self.remove();
			});
		}
	},

	this.remove= function(){
		var self=this;

		var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
		self.jsplumb = jsPlumbs[container_id];
		
		self.jsplumb.detachAllConnections($(self.element));

		$.each(self.options.ports_obj, function(index,ep){
			self.jsplumb.deleteEndpoint(ep);
		});

		
		$.each($(self.element).closest('.node').data('options').Nodes, function(index,node){
			if(self.options.uuid == node.uuid){
				$(self.element).closest('.node').data('options').Nodes.splice(index,1);
				return;
			}
		});

		$(self.element).remove();
	}
}