CodeBlock = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	this.jsplumb=undefined;
	
	this.options = {
		name: "Process",
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

	this.createNew = function(dropped,parent_element,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined){
			// Loaded
			self.options=options;
		}else{
			// Dropped
			self.options = {
							uuid:undefined,
							type: dropped.data('type'),
							Ports: {
								In: [],
								Out: []
							},
							Nodes: [],
							Connections: [],
							x:0,
							y:0
						};

			// Create dropped data ports from data('inports/outports')

		}

		if(self.parent.hasClass('editor-document'))
			self.options.type='Method'; // Otherwise I m already Process

		self.render();
		
		if(self.options.type == 'Method'){
			self.editor.options.entity.Method[self.options.uuid] = self.options ;
			var dropped_name = prompt("Please enter name");
				if(dropped_name == null) return;
			self.options.name = dropped_name;
			self.element.find('.name').text(dropped_name);
		}else{
			$(parent_element).data('options').Nodes.push(self.options);
		}
	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			this.element = $('<div data-type="'+self.options.type+'" class="entity-container" >');

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
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',self.options);
			this.element.appendTo(self.parent);

			self.jsplumb = $.univ().newjsPlumb($(this.element).attr('id'));

			$.each(self.options.Ports.In,function(index ,port_options){
				p = new Port();
				p.createNew(dropped,self.element,self.editor,port_options);
			})

			$.each(self.options.Ports.Out,function(index ,port_options){
				p = new Port();
				p.createNew(dropped,self.element,self.editor,port_options);
			})


			this.element.draggable({
	            containment: 'parent',
				})
				.droppable({
					greedy: true,
					drop: function(event,ui){
						if(!ui.draggable.hasClass('createNew')) return; 
						
						dropped = ui.draggable;
						
						var new_node = new window[dropped.data('js_widget')]();						
						new_node.createNew(dropped,self.element,self.editor);
					}
				})
				.resizable({

				});
		}
	}
}