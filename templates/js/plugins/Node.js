Node = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
	this.options = {
		name: undefined,
		uuid:undefined,
		type:'Method',
		js_widget:'Node',
		Ports: {
			In: [],
			Out: []
		},
		Nodes: [],
		Connections: [],
		x:0,
		y:0
	};

	this.createNew = function(dropped,parent_element,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined){
			self.options=options;
		}else{
			self.options = {
							uuid:undefined,
							name: dropped.data('name'),
							type: dropped.data('type'),
							js_widget: dropped.data('js_widget'),
							Ports: {
								In: [],
								Out: []
							},
							Nodes: [],
							Connections: [],
							x:0,
							y:0
						};

			// default flow in port
			var flow_in = {
							uuid:undefined,
							type: 'FLOW-IN',
							name:'Flow In',
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							x:0,
							y:0
						};
			self.options.Ports['In'].push(flow_in);

			var inp = jQuery.extend(true, {}, dropped.data('inports'));
			// console.log(inp);
			var outp = jQuery.extend(true, {}, dropped.data('outports'));

			$.each(inp, function (index, port){
				self.options.Ports.In.push(port);
			});

			$.each(outp, function (index, port){
				self.options.Ports.Out.push(port);
			});
		}

		$(parent_element).data('options').Nodes.push(self.options);

		self.render();
	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			this.element = $('<div data-type="'+self.options.type+'" class="node">');

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
			

			$.each(self.options.Ports.In,function(index ,port_options){
				// createNew Port by providing options
				p = new Port();
				p.createNew(undefined,self.element,self.editor,port_options);
			})

			$.each(self.options.Ports.Out,function(index ,port_options){
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
				}
			})
			.resizable({
				handles: "se",
				containment: self.parent
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
							x:0,
							y:0
						};
					self.options.Ports[ui.draggable.data('type')].push(new_port);
					self.jsplumb.repaintEverything();
				}
			})
			;
		}
	}
}