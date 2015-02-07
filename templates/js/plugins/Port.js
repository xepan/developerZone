Port = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
	this.options = {
		type:'Method',
		name: undefined,
		uuid:undefined,
		caption: undefined,
		mandatory: undefined,
		is_singlaton: undefined,
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
							type: dropped.data('type'),
							name: undefined,
							caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							x:0,
							y:0
						};
			$(self.parent).data('options').Ports[self.options.type].push(self.options);
		}
		
		self.render();

		if(self.options.type=="DATA-IN")
			self.makeTarget();
		else
			self.makeSource();

	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			this.element = $('<div data-type="'+self.options.type+'" class="port '+self.options.type+' '+ $(self.parent).closest('.entity-container').attr('id')+'">');
			
			var handler = $('<div class="move-handler">x</div>').appendTo(this.element);
			var name = $('<div class="name" >'+self.options.name+'</div>').appendTo(this.element);
			var caption = $('<div class="caption" >'+self.options.caption+'</div>').appendTo(this.element);
					
			$(caption).click(function(e){
				$(this).attr('contenteditable',"true");
				$(this).focus();
				e.preventDefault();
			}).blur(function(e){
				$(this).attr('contenteditable',"false");
				e.preventDefault();
				self.options.caption = $(this).html();		
			});

			if(self.options.uuid == undefined){
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',this);
			this.element.appendTo(self.parent);

			this.element.draggable({
	            containment: 'parent',
	            handle: '> .move-handler'
				});
		}
	}

	this.makeSource = function(){
		var self=this;

		jsplumb = $.univ().getjsPlumb($(self.parent).closest('.entity-container').attr('id'));

		// jsplumb = jsPlumbs[$(self.parent).closest('.entity-container').attr('id')];
		
		// console.log(jsPlumbs);
		// console.log($(self.parent).closest('.entity-container').attr('id'));
		// console.log(jsplumb);

		jsplumb.makeSource(self.element.attr('id'),{
			anchor: "Continuous",
			parent: self.element.attr('id')
		})
	}

	this.makeTarget = function(){
		var self=this;
		jsplumb = $.univ().getjsPlumb($(self.parent).closest('.entity-container').attr('id'));

		jsplumb.makeTarget(self.element.attr('id'),{
			anchor: "Continuous",
		})
	}



}