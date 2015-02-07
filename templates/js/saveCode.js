$.each({
	saveCode : function(){
		editor = $('.editor-document').data('uiEditor');
		$.ajax({
					url: 'index.php?page=developerZone_page_owner_saveentity',
					type: 'POST',
					datatype: "json",
					data: { entity_code : JSON.stringify(editor.options.entity)},
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