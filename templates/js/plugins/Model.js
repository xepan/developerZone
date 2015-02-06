Model_Count= 0;

Model = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;

	this.options = {
		name: undefined,
		uuid:undefined,
		type:'Model',
		Ports: {
			In: ['InPort'],
			Out: ['Outport']
		},
		Nodes: [],
		Connections: [],
		x:0,
		y:0
	};

	this.init = function(dropped,parent_element,ui,editor,options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined)
			self.options=options;
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			Model_Count++;
			this.element = $('<div data-type="Model" count="'+Model_Count+'">');
			
			if(self.options.uuid == undefined){
				$(this.element).uniqueId();
				self.options.uuid = $(this.element).attr('id');
			}else{
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.appendTo(self.parent);
			// this.element.css('position','absolute');

			$.each(self.options.Ports.In,function(index ,port){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red;">').appendTo(self.element);
				jsPlumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.Ports.Out,function(index ,port){
				var new_outport = $('<div style="width:20px; height:20px; background-color:blue;">').appendTo(self.element);
				jsPlumb.makeSource(new_outport, {
			      anchor: 'Continuous',
			      parent: new_outport,
			    });
			})

			this.element.draggable({
		            containment: 'parent',
		            stop:function(e){
		            	// console.log($(this).find('._jsPlumb_endpoint_anchor'));
			   //  	   	$('._jsPlumb_endpoint').each(function(i,e){ 
			   //  	   		console.log($(e));
		    //                 if($(e).hasClass("connect"))
		    //                     jsPlumb.repaint($(e).parent());
		    //                 else
		    //                     jsPlumb.repaint($(e));
						// });			
						jsPlumb.repaintEverything();							
		            }
		        });
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}