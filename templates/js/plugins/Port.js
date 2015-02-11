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
			self.proceed();
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
							creates_block: false,
							default_value: ""
						};
			
			// Ask about ports by jQuery Dialog
			
				port_add_form = $('<div class=""> \
					Name : <input id="port_name" type="text"/> <br/> \
					Mandatory : <select id ="port_mandatory"><option value="true">true</option><option value="false">false</option></select> <br/> \
					Single Input Allowed :<select id="port_singlaton"><option value="true">true</option><option value="false">false</option></select> <br/> \
					Type :<select id="port_type"><option value="In">Argument/In</option><option value="Out">Return/Out</option><option value="in-out" style="display:none">In/Out</option></select> <br/> \
					Default Value : <input id="port_default" type="text"/> <br/> \
				</div>');
				xx = $(port_add_form).appendTo(self.parent);
				
				console.log(self.parent.data('options'));
				if(self.parent.data('options').type !='Method'){
					$('#port_mandatory').val('false');
					$('#port_singlaton').val('false');
					$('#port_type').val('in-out');
					$('#default_value').val('');

					$('#port_mandatory').hide();
					$('#port_singlaton').hide();
					$('#port_type').hide();
					$('#port_default').hide();
				}
				
				xx.dialog({
					minWidth: 800,
					modal:true,

					 buttons: [
								{
								text: "Ok",
								icons: {
								primary: "ui-icon-heart"
								},
								click: function() {
									self.options.name = $('#port_name').val();
									self.options.mandatory = $('#port_mandatory').val()=="true"?true:false;
									self.options.is_singlaton = $('#port_singlaton').val()=="true"?true:false;
									self.options.type = $('#port_type').val();
									self.options.default_value = $('#port_default').val();
								

									$('#port_name').remove();
									$('#port_mandatory').remove();
									$('#port_singlaton').remove();
									$('#port_type').remove();
									$('#port_default').remove();

									$(self.parent).data('options').Ports.push(self.options);
									self.proceed();
								$( this ).dialog( "close" );
								}
								// Uncommenting the following line would hide the text,
								// resulting in the label being used as a tooltip
								//showText: false
								}
							]
				});
			
			
			// on OK 
				// self.proceed();

		}
		
	}

	this.proceed= function(){
		var self =this;

		self.render();

		var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
		jsplumb = jsPlumbs[container_id];
		// console.log('port uuid given');

		var startpointOptions = {
						uuid: 'xxep_'+self.options.uuid,
						anchors: ["Continuous", { faces:[ "right","bottom" ] } ],
						maxConnections:-1, 
						isSource:true, 
						// isTarget:true, 
						endpoint:["Dot", {radius:5, cssClass:"port DATA-IN"}], 
						overlays:[ ["Label", { label: (self.options.name == 'Flow' ? '' : self.options.name)   /*+ ' ' + self.options.uuid */, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
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
						uuid: 'xxep_'+self.options.uuid,
						anchors: ["Continuous", { faces:["left","top" ] } ],
						maxConnections:-1, 
						// isSource:true, 
						isTarget:true, 
						endpoint:["Dot", {radius:5}], 
						overlays:[ ["Label", { label: (self.options.name == 'Flow' ? '' : self.options.name) /*+ ' ' + self.options.uuid*/, id:"label_"+self.options.uuid, cssClass:"port-label" } ]],
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
		

		if(self.parent.data('options').type == 'Method' && self.options.type != "in-out"){
			if(self.options.type == 'In'){
				self.options.type = 'Out';
			}else{
				self.options.type = "In";
			}
			startpointOptions.anchors= ["Continuous", { faces:["left","top" ] } ];
			endpointOptions.anchors= ["Continuous", { faces:[ "right","bottom" ] } ];
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
		// ep.setLabel(self.options.name);
		// self.options.uuid = ep.getUuid();
		$(self.parent).data('options').ports_obj.push(ep);
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


			// this.element.html(self.options.uuid);
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