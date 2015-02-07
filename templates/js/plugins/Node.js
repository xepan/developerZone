Node = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
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
							Ports: {
								In: [],
								Out: []
							},
							Nodes: [],
							Connections: [],
							x:0,
							y:0
						};

			$.each(dropped.data('inports'), function (index, port){
				self.options.Ports.In.push(port);
			});

			$.each(dropped.data('outports'), function (index, port){
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
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',this);
			this.element.appendTo(self.parent);

			$.each(self.options.Ports.In,function(index ,port_options){
				// createNew Port by providing options
				p = new Port();
				p.createNew(dropped,self.element,self.editor,port_options);
			})

			$.each(self.options.Ports.Out,function(index ,port_options){
				// createNew Port by providing options
				p = new Port();
				p.createNew(dropped,self.element,self.editor,port_options);
			})


			this.element.draggable({
	            containment: 'parent',
	            stop: function(){
	            	jsplumb = $.univ().getjsPlumb($(self.parent).closest('.entity-container').attr('id'));
	            	jsplumb.repaintEverything();
	            }
			})
			.resizable({

			});
		}
	}
}