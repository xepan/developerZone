Model_Count= 1;

Model = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;

	this.options = {
		ports:{
			inPorts:[],
			outPorts:[]
		},
		x:0,
		y:0
	};

	this.init = function(dropped,parent_element,ui){
		var self = this;
		self.parent=parent_element;
		var inports=dropped.data('inports');
		var outports=dropped.data('outports');
		self.options.ports.inPorts = inports;
		self.options.ports.outPorts = outports;
	}

	this.render = function(){
		var self = this;
		if(this.element == undefined){
			this.element = $('<div id="Model_'+Model_Count+'">')
							.css('position','relative');
			Model_Count++;

			this.element.draggable({
		            containment: 'parent',
		            drag:function(e){
		            	console.log('sd');
			    	   	$(this).find('._jsPlumb_endpoint').each(function(i,e){ 
		                    if($(e).hasClass("connect"))
		                        jsPlumb.repaint($(e).parent());
		                    else
		                        jsPlumb.repaint($(e));
						});										
		            }
		        });

			this.element.appendTo(self.parent);

			$.each(self.options.ports.inPorts,function(port_type ,label){
				var new_inport = $('<div style="width:20px; height:20px; background-color:red; position:absolute; top:0; left:0">').appendTo(self.element);
				jsPlumb.makeTarget(new_inport, {
			      anchor: 'Continuous'
			    });
			})

			$.each(self.options.ports.outPorts,function(port_type ,label){
				var new_outport = $('<div style="width:20px; height:20px; background-color:blue; position:absolute; top:50; left:0">').appendTo(self.element);
				jsPlumb.makeSource(new_outport, {
			      anchor: 'Continuous',
			    });
			})
		}
		this.element.width('100px');
		this.element.height('100px');
		this.element.css('border','2px solid red');
	}
}