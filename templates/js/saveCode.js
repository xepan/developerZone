$.each({
	
	unsetPortObj: function(options){
		options.ports_obj= [];
		if(options.parent != undefined) delete options.parent;
		$.each(options.Nodes, function (index,node_options){
			$.univ().unsetPortObj(node_options);
		});
	},

	saveCode : function(){
		editor = $('.editor-document').data('uiEditor');
		sentized_json = jQuery.extend(true, {}, editor.options.entity);

		$.each(sentized_json.Method,function(index,m){
			$.univ().unsetPortObj(m);
		})

		$.ajax({
					url: 'index.php?page=developerZone_page_owner_saveentity',
					type: 'POST',
					datatype: "json",
					data: { entity_code : JSON.stringify(sentized_json), entity_id: editor.options.entity.id},
				})
				.done(function(ret) {
					if(ret==='true'){
						$.univ().successMessage('Saved Successfully');
						console.log('Item Design Saved Successfully');
					}
					else if(ret.indexOf('false')===0){
						$.univ().errorMessage('Not Saved, some thing wrong');
					}else{
						if(!isNaN(+ret)){
							self.designer_tool.options.item_member_design_id = ret;
							if(self.designer_tool.cart != undefined || self.designer_tool.cart != '0'){
								self.designer_tool.cart.xepan_xshop_addtocart('option','item_member_design_id',ret);
								// console.log(self.designer_tool.cart.options);
							}
							// window.history.pushState('page', 'saved_page', 'replace url');
							$.univ().successMessage('Saved Successfully');
						}else{
							eval(ret);
						}
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
	}
}, $.univ._import);