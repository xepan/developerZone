CodeBlock = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.jsplumb=undefined;
	this.show_content=true;
	
	this.options = {
		name: "Process",
		uuid:undefined,
		type:'Method',
		Ports: [],
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
			// Loaded
			self.options=options;
		}else{
			// Dropped
			self.options.type= dropped.data('type');

			var flow_in = {
							uuid:undefined,
							type: 'in-out',
							name:'Flow In',
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							x:0,
							y:0
						};
			self.options.Ports.push(flow_in);

			// Create dropped data ports from data('inports/outports')
			if(self.parent.hasClass('editor-document'))
				self.options.type='Method'; // Otherwise I m already Process
			
			if(self.options.type == 'Method'){
				var dropped_name = prompt("Please enter name");
					if(dropped_name == null) return;
				self.options.name = dropped_name;
			}else{
				$(parent_element).data('options').Nodes.push(self.options);
			}

		}

		self.render();

		if(self.options.type == 'Method'){
			self.editor.options.entity.Method.push(self.options) ;
			self.element.find('.name').text(self.options.name);
		}
		
	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			draggable_div =$('<div class="entity-container-draggable">').appendTo(self.parent);
			this.element = $('<div data-type="'+self.options.type+'" class="entity-container" >')
				.appendTo(draggable_div);
			// this.element.appendTo(self.parent);

			if(self.options.type == 'Method'){
				this.element.addClass('entity-method');	
			} 
			
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
				$(this.element).attr('id',$(this).xunique());
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',self.options);

			draggable_div.attr('id','dd_'+self.options.uuid);

			var container_id = 'dd_'+self.options.uuid;
			if(self.options.type == 'Method'){
				$.univ().newjsPlumb(container_id);
				self.jsplumb = jsPlumbs[container_id];
			}else{
				var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
	        	// console.log(container_id);
				self.jsplumb = jsPlumbs[container_id];
			}

			$.each(self.options.Ports,function(index ,port_options){
				p = new Port();
				p.createNew(undefined,self.element,self.editor,port_options);
			})


			// jsplumb.draggable(this.element.attr('id'),{containment: 'parent'});
			
			draggable_div
			.draggable(
			{
				containment: 'parent',
				drag: function(event,ui){
					self.jsplumb.repaintEverything();
				}
			}).resizable({
					resize: function(event, ui){
						$(this).children('.entity-container').width($(this).width());
						$(this).children('.entity-container').height($(this).height());
					}
				});

			this.element
			.droppable({
					greedy: true,
					drop: function(event,ui){
						if(!ui.draggable.hasClass('createNew')) return; 
						
						dropped = ui.draggable;

						var new_node = new window[dropped.data('js_widget')]();						
						new_node.createNew(dropped,self.element,self.editor);
						if(!self.show_content) self.element.dblclick();
					}
				});

			this.element.dblclick(function(){
				if(self.show_content){
					self.show_content=false;
					// console.log(self.jsplumb.getAllConnections());
					$(this).find('.node').each(function(index,n){
						self.jsplumb.hide(n);
						$(n).hide();
					});
				}else{
					self.show_content=true;
					$(this).find('.node').each(function(index,n){
						self.jsplumb.show(n);
						$(n).show();
					});
				}
			})

		}
	}
}