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
		left:0,
		top:0,
		width:200,
		height:100,
		ports_obj:[],
		js_widget:"CodeBlock"
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
							name:'Flow',
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							left:0,
							top:0,
							width:0,
							height:0,
							creates_block: false
						};
			self.options.Ports.push(flow_in);

			// Create dropped data ports from data('inports/outports')
			if(self.parent.hasClass('editor-document'))
				self.options.type='Method'; // Otherwise I m already Process
			
			if(self.options.type == 'Method'){
				var dropped_name = prompt("Please enter name");
					if(dropped_name == null) return;
				self.options.name = dropped_name;
				self.editor.options.entity.Method.push(self.options) ;
			}else{
				$(parent_element).data('options').Nodes.push(self.options);
			}

		}

		self.render();

		if(self.options.type == 'Method'){
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
			});

			//Remove BTN
			var remove_btn  = $('<div class="glyphicon glyphicon-remove-circle pull-right remove-btn">').appendTo(draggable_div);
			$(remove_btn).click(function(){

				//Check if Method
				var delete_done=0;
				if(self.options.type == "Method"){
					$.each(self.editor.options.entity.Method, function(index,method_obj){
						if(delete_done) return;
						if(method_obj.uuid == self.options.uuid){
							self.editor.options.entity.Method.splice(index,1);
							$(self.element).parent().remove();
							delete_done = 1;
						}
					});
				}else{
					//First remove it's all connection as source or target
					// get all uuids of child
					$(self.element).find('.remove-btn:first-of-type').click();
					self.remove();
				}
			});


			//Minimize Button
			var min_max_btn  = $('<div class="glyphicon glyphicon-plus pull-right min-max-btn">').appendTo(draggable_div);
			$(min_max_btn).click(function(){
					new_div = $('<div class="min-max">'+self.options.name).appendTo(self.element);
					new_div.height(self.options.height);
					new_div.width(self.options.width);
					$(new_div).addClass('entity-method-cover');
					$(new_div).css('z-index','100');
					$(new_div).css('position','relative');
				
				if($(this).hasClass('glyphicon glyphicon-minus')){
					$(this).removeClass('glyphicon glyphicon-minus').addClass('glyphicon glyphicon-plus');
					$(self.element).children('.min-max').remove();
				}else{
					$(this).removeClass('glyphicon glyphicon-plus').addClass('glyphicon glyphicon-minus');
				}	
			});


			draggable_div
			.draggable(
			{
				containment: 'parent',
				drag: function(event,ui){
					self.jsplumb.repaintEverything();
					self.options.top = ui.position.top; 
					self.options.left = ui.position.left; 
				}
			}).resizable({
					handles: "se",
					containment: self.parent,
					resize: function(event, ui){
						$(this).children('.entity-container').width($(this).width());
						$(this).children('.entity-container').height($(this).height());
						self.options.width = $(this).width();
						self.options.height = $(this).height();
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

			// $(this.element).css("top",self.options.top + "px");
			// $(this.element).css("left",self.options.left + "px");
			$(this.element).width(self.options.width);
			$(this.element).height(self.options.height);
			$(draggable_div).css("top",self.options.top + "px");
			$(draggable_div).css("left",self.options.left + "px");
			$(draggable_div).width(self.options.width);
			$(draggable_div).height(self.options.height);
			// $(draggable_div).height($(draggable_div).children('.entity-container').height());
			// $(draggable_div).width($(draggable_div).children('.entity-container').width());

			// this.element.dblclick(function(){
			// 	if(self.show_content){
			// 		self.show_content=false;
			// 		// console.log(self.jsplumb.getAllConnections());
			// 		$(this).find('.node').each(function(index,n){
			// 			self.jsplumb.hide(n);
			// 			$(n).hide();
			// 		});
			// 	}else{
			// 		self.show_content=true;
			// 		$(this).find('.node').each(function(index,n){
			// 			self.jsplumb.show(n);
			// 			$(n).show();
			// 		});
			// 	}
			// })

		}
	}

	this.remove= function(){
		var self=this;

		var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
		self.jsplumb = jsPlumbs[container_id];
		
		self.jsplumb.detachAllConnections($(self.element));

		$.each(self.options.ports_obj, function(index,ep){
			self.jsplumb.deleteEndpoint(ep);
		});

		editor = $('.editor-document').data('uiEditor');
		var method_id = $('#'+self.options.uuid).closest('.entity-method').attr('id');
		$.each(editor.options.entity.Method, function(index,method_obj){
			if(method_obj.uuid == method_id){
				var nodes = editor.options.entity.Method[index].Nodes;
				$.each(nodes,function(key,node){
					if(node.uuid == self.options.uuid){
						editor.options.entity.Method[index].Nodes.splice(key,1);
						return;
					}
				});
			}
		});	
		$(self.element).parent().remove();
	}
}