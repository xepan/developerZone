MethodCall = function (params){
	this.editor= undefined;
	this.parent= undefined;
	this.element=undefined;
	
	this.options = {
		name: undefined,
		uuid:undefined,
		type:'MethodCall',
		js_widget:'MethodCall',
		Ports: [],
		Nodes: [],
		Connections: [],
		top:0,
		left:0,
		width:100,
		height:50,
		entity_id:undefined,
		tool_id:undefined,
		is_framework_class:'1',
		css_class: undefined,
		ports_obj:[],
		method_list:[]
	};

	this.createNew = function(dropped,parent_element,editor, options){
		var self = this;
		self.parent=parent_element;
		self.editor=editor;

		if(options != undefined){
			self.options=options;
		}else{
			self.options.uuid = undefined;
			self.options.name = dropped.data('name');
			self.options.type = dropped.data('type');
			self.options.js_widget = dropped.data('js_widget');
			self.options.entity_id = dropped.data('entity_id');
			self.options.is_framework_class = dropped.data('is_framework_class');
			self.options.tool_id = dropped.data('tool_id');
			self.options.css_class = dropped.data('css_class');

			// default flow in port
			// var flow_in = {
			// 				uuid:undefined,
			// 				type: 'in-out',
			// 				name:'Flow',
			// 				// caption: undefined,
			// 				mandatory: undefined,
			// 				is_singlaton: undefined,
			// 				left:0,
			// 				top:0,
			// 				creates_block: false
			// 			};
			// self.options.Ports.push(flow_in);

			var prts = jQuery.extend(true, {}, dropped.data('ports'));
			$.each(prts, function (index, port){
				self.options.Ports.push(port);
			});
			$(parent_element).data('options').Nodes.push(self.options);
		}


		self.render();
	}

	this.populateMethodListAndDropDown = function(entity_id_to_get){
		var self = this;
		// get Ajax
		$.ajax({
			url: 'index.php?page=developerZone_page_owner_entitymethods',
			type: 'GET',
			datatype: "json",
			data: { entity_id : entity_id_to_get},
		})
		.done(function(ret) {
			// set in options
			self.options.method_list=JSON.parse(ret);
			
			select = $(self.element).find('select');
			select.html();
			
			$.each(self.options.method_list,function(method_name,ports){
					$('<option value="'+method_name+'">'+method_name+'</option>').appendTo(select);
			});

		});

	}
	
	this.render = function(){
		var self = this;
		if(this.element == undefined){

			var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
        	// console.log(container_id);
			self.jsplumb = jsPlumbs[container_id];
			
			this.element = $('<div data-type="'+self.options.type+'" class="node '+ self.options.css_class +'">');
			var remove_btn  = $('<div class="glyphicon glyphicon-remove-circle pull-right remove-btn">').appendTo(this.element);
			var method_dropdown  = $('<select/>').appendTo(this.element);

			method_dropdown.on('change',function(event){
				// remove all connections with me
				$.each(self.options.ports_obj, function(index,ep){
					if(ep.getOverlays()[0].getLabel() != 'obj/this'){
						self.jsplumb.deleteEndpoint(ep);
						delete (self.options.ports_obj[index]);
					}
				});

				self.options.Ports=[];


				var prts = self.options.method_list[$(this).val()];
				// console.log(self.options.method_list);
				// console.log($(this).val());

				$.each(prts, function (index, port){
					self.options.Ports.push(port);
				});

				$.each(self.options.Ports,function(index ,port_options){
					// createNew Port by providing options
					p = new Port();
					p.createNew(undefined,self.element,self.editor,port_options);
				});

				self.options.name = $(this).val();
				// remove all entpoints
				// add Ports as per selected (from emthodlist)
				// console.log(event);
			});
			// populate entities methods in self.options.method_list
			editor = $('.editor-document').data('uiEditor');
			entity_id= editor.options.entity.id;
			self.populateMethodListAndDropDown(entity_id);


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
			

			$.each(self.options.Ports,function(index ,port_options){
				// createNew Port by providing options
				p = new Port();
				p.createNew(undefined,self.element,self.editor,port_options);
			})

        	

			self.jsplumb.bind('beforeDrop',function(info){
				console.log(info);

				// if my port is obj/this
					// other node's enitityid
					// send to a agile page to get json boject (available methods and their ports)
					// detechall connections with me
					// remove all nodes
					// pupolate my dropdown

				return true;
			});

			// jsplumb.draggable(this.element.attr('id'),{containment: 'parent'});

			this.element
			.draggable({
				containment: 'parent',
				drag: function(event,ui){
					self.jsplumb.repaintEverything();
					self.options.top = ui.position.top; 
					self.options.left = ui.position.left;
				}
			})
			.resizable({
				handles: "se",
				containment: self.parent,
				resize: function(event, ui){
						self.options.width = $(this).width();
						self.options.height = $(this).height();
					}
			})
			// .droppable({
			// 	accept: ".port",
			// 	greedy: true,
			// 	drop: function(event,ui){
			// 		var new_port = {
			// 				uuid:undefined,
			// 				type: ui.draggable.data('type'),
			// 				name:'New Port',
			// 				// caption: undefined,
			// 				mandatory: undefined,
			// 				is_singlaton: undefined,
			// 				left:0,
			// 				top:0
			// 			};
			// 		self.options.Ports[ui.draggable.data('type')].push(new_port);
			// 		self.jsplumb.repaintEverything();
			// 	}
			// })
			;

			$(this.element).css("top",self.options.top + "px");
			$(this.element).css("left",self.options.left +"px");
			$(this.element).css("width",self.options.width +"px");
			$(this.element).css("height",self.options.height + "px");

			$(remove_btn).click(function(){
				self.remove();
			});


			if(self.options.is_framework_class=='0'){
				$(this.element).dblclick(function(e){
					alert(self.options.is_framework_class);
				});
			}

			//Context Menu
			// $("#"+self.options.uuid).contextmenu({
			// 	preventContextMenuForPopup: true,
			// 	preventSelect: true,
			// 	taphold: true,
			// 	menu: [
			// 		{title: "Extend", cmd: "Extend", uiIcon: "ui-icon-scissors"},
			// 		{title: "Edit", cmd: "Edit", uiIcon: "fa fa-pencil"},
			// 		// {title: "More", children: [
			// 		// 	{title: "Sub 1 (using callback)", action: function(event, ui) { alert("action callback sub1");} },
			// 		// 	{title: "Sub 2", cmd: "sub2"}
			// 			// ]}
			// 		],
			// 	// Handle menu selection to implement a fake-clipboard
			// 	select: function(event, ui) {
			// 		var $target = ui.target;
			// 		switch(ui.cmd){

			// 		case "Extend":
			// 			var extend_class_name = prompt("Please enter name");
			// 			if(extend_class_name == null) return;
						
			// 			$.ajax({
			// 					url: 'index.php?page=developerZone_page_owner_extend',
			// 					type: 'POST',
			// 					data: {
			// 							class_name : extend_class_name,
			// 							entity_id : self.options.entity_id
			// 						},
			// 				})
			// 				.done(function(ret) {
			// 					if(ret!='undefined'){
			// 						self.options.entity_id = ret;
			// 						self.options.name = extend_class_name;
			// 						self.options.is_framework_class = '0';
			// 						self.element.children('.name').text(extend_class_name);
			// 						$.univ().successMessage('Extend Successfully');
			// 					}
			// 				})
			// 				.fail(function() {
			// 					console.log("error");
			// 				});
			// 				// alert("select " + ui.cmd + " on " + $target.text());
			// 				break
						
			// 			//Edit 
			// 			case "Edit":
			// 				var url = ""+$(location).attr('pathname')+"?page=developerZone_page_owner_editor&entity_id="+self.options.entity_id;
			// 				window.open(url,"entity_"+self.options.entity_id);
			// 			break
			// 			}
			// 		},
					
			// 		beforeOpen: function(event, ui) {
			// 			// console.log(ui);
			// 			if(self.options.is_framework_class =='1' || self.options.tool_id != undefined){
			// 				$('#'+self.options.uuid).contextmenu("enableEntry", "Edit", false);
							
			// 				if(self.options.tool_id != undefined)
			// 					$('#'+self.options.uuid).contextmenu("enableEntry", "Extend", false);

			// 			}else{
			// 				$('#'+self.options.uuid).contextmenu("enableEntry", "Edit", true);	
			// 			}
			// 		}
			// });


		}
	},

	this.remove= function(){
		var self=this;

		var container_id = $(self.parent).closest('.entity-method').parent().attr('id');
		self.jsplumb = jsPlumbs[container_id];
		
		self.jsplumb.detachAllConnections($(self.element));

		$.each(self.options.ports_obj, function(index,ep){
			self.jsplumb.deleteEndpoint(ep);
		});

		// editor = $('.editor-document').data('uiEditor');
		// var method_id = $('#'+self.options.uuid).closest('.entity-method').attr('id');
		// $.each(editor.options.entity.Method, function(index,method_obj){
		// 	if(method_obj.uuid == method_id){
		// 		var nodes = editor.options.entity.Method[index].Nodes;
		// 		$.each(nodes,function(key,node){
		// 			if(node.uuid == self.options.uuid){
		// 				editor.options.entity.Method[index].Nodes.splice(key,1);
		// 				return;
		// 			}
		// 		});
		// 	}
		// });
		var node_deleted=0;
		$.each($(self.element).closest('.entity-container').data('options').Nodes, function(index,node){
			if(node_deleted) return;
			if(self.options.uuid == node.uuid){
				$(self.element).closest('.entity-container').data('options').Nodes.splice(index,1);
				node_deleted = 1;
				return;
			}
		});

		$(self.element).remove();
	}
}