	jsPlumb.Defaults.Container= $("#web_layout_fluid_view");
	jsPlumb.Defaults.PaintStyle = { strokeStyle:"#F09E30", lineWidth:2, dashstyle: '3 3', };
	jsPlumb.Defaults.EndpointStyle = { radius:7, fillStyle:"#F09E30" };
	jsPlumb.importDefaults({Connector : [ "Bezier", { curviness:50 } ]});
	
	//Connector Called
	jsPlumb.bind("connection", function(info) {
		method_uuid = $('#'+info.sourceId).closest('.enitity-method').attr('id');
		editor = $('.editor-document').data('uiEditor');
		editor.options.entity.Method[method_uuid].Connections.push(info);
	});

	//connections detached
	jsPlumb.bind("connectionDetached",function(info,originalEvent){
		editor = $('.editor-document').data('uiEditor');
		method_uuid = $('#'+info.sourceId).closest('.enitity-method').attr('id');
		connections = editor.options.entity.Method[method_uuid].Connections;
		$.each(connections, function(index, obj) {
			if(obj.sourceId === info.sourceId && obj.targetId === info.targetId)
				editor.options.entity.Method[method_uuid].Connections.splice(index,1);
		});
		//Remove Detached Connection form the editor.options.connections
	});