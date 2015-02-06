$.each({
	saveCode : function(){
		editor = $('.editor-document').data('uiEditor');
		nodes = editor.options.logic.nodes;
		connections = editor.options.logic.connections;
		
		var row_code = {};
		row_code['entity'] = {};
		row_code['attributes'] = {};
		row_code['method'] = {};

		//entity Information
		row_code.entity['name'] = "entity"+Model_Count+Process_Count;
		row_code.entity['class_name'] = "entity_class_name";

		//Attributes Information
		row_code.attributes['attribute'] = {} ;
		row_code.attributes.attribute['type'] = "dumy_Table" ;
		row_code.attributes.attribute['name'] = "dumy_Table_name" ;
		row_code.attributes.attribute['accessMode'] = "dumy_Publlic" ;

		//Methods 
		$.each()
		//Nodes
		$.each(nodes, function(index,obj){

		});

		//Connections
		$.each(connections, function(index,obj){

		});

		console.log(row_code);
	}
}, $.univ._import);