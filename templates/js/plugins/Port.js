Port = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
	this.options = {
		type:'in-out',
		name: undefined,
		uuid:undefined,
		// caption: undefined,
		mandatory: undefined,
		is_singlaton: undefined,
		left:0,
		top:0,
		creates_block: false
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
							// caption: undefined,
							mandatory: undefined,
							is_singlaton: undefined,
							left:0,
							top:0,
							creates_block: false
						};
			$(self.parent).data('options').Ports.push(self.options);
		}
		

		self.render();

		var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
		jsplumb = jsPlumbs[container_id];

		var startpointOptions = {	
						anchors: ["Continuous", { faces:[ "right","bottom" ] } ],
						maxConnections:-1, 
						isSource:true, 
						// isTarget:true, 
						endpoint:["Dot", {radius:5, cssClass:"port DATA-IN"}], 
						overlays:[ ["Label", { label: self.options.name, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
						paintStyle:{fillStyle:"black"},
						connectorStyle : {  lineWidth: 2, strokeStyle:"#222222" },
						connector : ["Straight"],
						setDragAllowedWhenFull:true,
						connectorOverlays:[ 
							[ "Arrow", { width:10, length:15, location:1, id:"arrow" } ], 
							[ "Label", { label: "", id:"label" } ]
						]	,
						container:$('#' + container_id)			
						};

		var endpointOptions = {	
						anchors: ["Continuous", { faces:["left","top" ] } ],
						maxConnections:-1, 
						// isSource:true, 
						isTarget:true, 
						endpoint:["Dot", {radius:5}], 
						overlays:[ ["Label", { label: self.options.name, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
						paintStyle:{fillStyle:"green"},
						connectorStyle : {  lineWidth: 3, strokeStyle:"#5b9ada" },
						connector : ["Straight"],
						setDragAllowedWhenFull:true,
						connectorOverlays:[ 
							[ "Arrow", { width:20, length:30, location:1, id:"arrow" } ], 
							[ "Label", { label:"", id:"label" } ]
						]	,
						container:$('#' + container_id)			
						}

		var type = self.options.type.toLowerCase();
		// if both 
		if(type.indexOf("in") !=-1 && type.indexOf("out")!=-1){
			// selected_endpoint_options = endpoint + isSource:true
			selected_endpoint_options = endpointOptions;
			selected_endpoint_options.isSource = true;
			selected_endpoint_options.anchors = ["Continuous",{ faces:["left","top","right","bottom" ] }];
		}else{// else
			if(type.indexOf("in") !=-1){
			// if in
				selected_endpoint_options = endpointOptions;
			}else{
			// else
				selected_endpoint_options = startpointOptions;
			}
		}


		ep=jsplumb.addEndpoint(self.element.parent().attr('id'), selected_endpoint_options);

		$(parent_element).data('options').ports_obj.push(ep);
		// if(self.options.type=="DATA-IN" || self.options.type == "FLOW-IN" || self.options.type=='In')
		// 	self.makeTarget();
		// else
		// 	self.makeSource();

	}

	
	this.render = function(){
		var self = this;
		if(this.element == undefined){
			
			this.element = $('<div>');// data-type="'+self.options.type+'" class="port '+self.options.type+' '+ $(self.parent).closest('.entity-container').attr('id')+'">');
			// var name = $('<div class="name" >'+self.options.name+'</div>').appendTo(this.element);
			
			// var caption = $('<div class="caption" >'+self.options.caption+'</div>').appendTo(this.element);
					
			// $(caption).click(function(e){
			// 	$(this).attr('contenteditable',"true");
			// 	$(this).focus();
			// 	e.preventDefault();
			// }).blur(function(e){
			// 	$(this).attr('contenteditable',"false");
			// 	e.preventDefault();
			// 	self.options.caption = $(this).html();		
			// });
			// console.log(self.options);
			if(self.options.uuid == undefined){
				// console.log('UUID giving');
				$(this.element).attr('id',$(this).xunique());
				self.options.uuid = $(this.element).attr('id');
			}else{
				// console.log('UUID NOT giving');
				$(this.element).attr('id',self.options.uuid);
			}

			this.element.data('options',self.options);
			this.element.appendTo(self.parent);

			// this.element.draggable({
	  //           containment: 'parent',
	  //           handle: '> .move-handler'
			// 	});
		}
	}

	// this.makeSource = function(){
	// 	var self=this;

	// 	var container_id = $(self.parent).closest('.entity-method').parent().attr('id');

	// 	jsplumb = jsPlumbs[container_id];

	// 	// jsplumb = jsPlumbs[$(self.parent).closest('.entity-container').attr('id')];
		
	// 	// console.log(jsPlumbs);
	// 	// console.log($(self.parent).closest('.entity-container').attr('id'));
	// 	// console.log(jsplumb);
	// 	// console.log('Adding Source endpoint at ' + self.element.attr('id'));
	// 	var startpointOptions = { isSource:true, container:$('#'+container_id)};
	// 	var startpointOptions = {	
	// 					anchors: ["Continuous", { faces:[ "right","bottom" ] } ],
	// 					maxConnections:-1, 
	// 					isSource:true, 
	// 					// isTarget:true, 
	// 					endpoint:["Dot", {radius:5, cssClass:"port DATA-IN"}], 
	// 					overlays:[ ["Label", { label: self.options.name, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
	// 					paintStyle:{fillStyle:"black"},
	// 					connectorStyle : {  lineWidth: 2, strokeStyle:"#222222" },
	// 					connector : ["Straight"],
	// 					setDragAllowedWhenFull:true,
	// 					connectorOverlays:[ 
	// 						[ "Arrow", { width:10, length:15, location:1, id:"arrow" } ], 
	// 						[ "Label", { label: "", id:"label" } ]
	// 					]	,
	// 					container:$('#' + container_id)			
	// 					}
	// 	jsplumb.addEndpoint(self.element.parent().attr('id'), startpointOptions);
	// }

	// this.makeTarget = function(){
	// 	var self=this;

	// 	var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
	// 	// console.log(container_id);
	// 	jsplumb = jsPlumbs[container_id];

	// 	// console.log('Adding Target endpoint at ' + self.element.attr('id'));
	// 	var endpointOptions = { isTarget:true,container:$('#' + container_id)};
	// 	var endpointOptions = {	
	// 					anchors: ["Continuous", { faces:["left","top" ] } ],
	// 					maxConnections:-1, 
	// 					// isSource:true, 
	// 					isTarget:true, 
	// 					endpoint:["Dot", {radius:5}], 
	// 					overlays:[ ["Label", { label: self.options.name, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
	// 					paintStyle:{fillStyle:"green"},
	// 					connectorStyle : {  lineWidth: 3, strokeStyle:"#5b9ada" },
	// 					connector : ["Straight"],
	// 					setDragAllowedWhenFull:true,
	// 					connectorOverlays:[ 
	// 						[ "Arrow", { width:20, length:30, location:1, id:"arrow" } ], 
	// 						[ "Label", { label:"", id:"label" } ]
	// 					]	,
	// 					container:$('#' + container_id)			
	// 					}
	// 	jsplumb.addEndpoint(self.element.parent().attr('id'), endpointOptions);
	// }



}