	jsPlumbs = [];
	// jsPlumb.Defaults.PaintStyle = { strokeStyle:"#F09E30", lineWidth:2, dashstyle: '3 3', };
	// jsPlumb.Defaults.EndpointStyle = { radius:7, fillStyle:"#F09E30" };
	// jsPlumb.importDefaults({Connector : [ "Bezier", { curviness:50 } ]});
	
$.each({

	newjsPlumb: function(container_id){
		var x = jsPlumb.getInstance({
			  Container: container_id
			});
		jsPlumbs[container_id] = x;

		//Connector Called
		x.bind("connection", function(info) {
			method_uuid = $('#'+info.sourceId).closest('.entity-method').attr('id');
			editor = $('.editor-document').data('uiEditor');

			var source_obj = $('#'+info.targetId);
			if(source_obj.data('options').js_widget == 'MethodCall' && info.connection.endpoints[1].getOverlays()[0].getLabel() == 'obj/this' && method_call_bind_event){
				var entity_id = $('#'+info.sourceId).data('options').entity_id;
				if(entity_id !=undefined){
					source_obj.data('object').clearPorts();
					source_obj.data('object').getMethodList(entity_id);
				}
				// source_obj.data('object').populatePorts();
			}

			//Find parent of sourceId which is codeblock or method
			parent_id = $('#'+info.sourceId).closest('.entity-method').attr('id');
			connection ={
						sourceId: info.connection.endpoints[0].getUuid(),
						sourceParentId: info.sourceId,
						targetId: info.connection.endpoints[1].getUuid(),
						taggetParentId: info.targetId
					};


			$.each(editor.options.entity.Method,function(index,obj){
				if(obj.uuid === parent_id){
					editor.options.entity.Method[index].Connections.push(connection);
				}
			});


			from_index = undefined;
			to_index = undefined;
			source_id = $('#'+info.sourceId).attr('id');
			target_id = $('#'+info.targetId).attr('id');
			parent_obj_options = $('#'+info.sourceId).parent().closest('.entity-container').data("options");
			var node_array = parent_obj_options.Nodes;
			$.each(node_array, function(index, obj){
				if(obj.uuid === source_id)
					from_index = index;
				if(obj.uuid === target_id)
					to_index = index
			});


			if(from_index > to_index){
				editor.moveNode(node_array,from_index,to_index);
			}

		});

		//connections detached
		x.bind("connectionDetached",function(info,originalEvent){
			method_call_bind_event = true;
			editor = $('.editor-document').data('uiEditor');
			method_uuid = $('#'+info.sourceId).closest('.entity-method').attr('id');
			var removing_indexes=[];
			$.each(editor.options.entity.Method,function(index,methods){
				if(methods.uuid === method_uuid){
					connections = editor.options.entity.Method[index].Connections;
					$.each(connections, function(key, conn_obj) {
						if(conn_obj.sourceId === info.connection.endpoints[0].getUuid() && conn_obj.targetId === info.connection.endpoints[1].getUuid())
							removing_indexes.push(key);							
					});
				}
				
				for (var i = removing_indexes.length -1; i >= 0; i--){
					editor.options.entity.Method[index].Connections.splice(removing_indexes[i],1);
				}

			});
			//Remove Detached Connection form the editor.options.connections

			// If Method Call type detached then populate with current entities values ($this-> ...)
			var target_obj = $('#'+info.connection.targetId);
			if(target_obj.data('options').js_widget == 'MethodCall' && info.connection.endpoints[1].getOverlays()[0].getLabel() == 'obj/this'){
				editor = $('.editor-document').data('uiEditor');
				entity_id= editor.options.entity.id;
				target_obj.data('object').clearPorts();
				target_obj.data('object').getMethodList(entity_id);
				// target_obj.data('object').populatePorts();
			}

		});

		x.bind('beforeDrop',function(info){
			method_call_bind_event = true;
			return true;
		});

		x.bind('dblclick', function (connection, e) {
		    x.detach(connection);
		});

		return x;
	},

	getjsPlumb: function(container_id){
		return jsPlumbs[container_id];
	}
	

}, $.univ._import);