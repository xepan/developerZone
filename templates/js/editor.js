jQuery.widget("ui.editor",{
	
	options:{
		logic:{},
	},

	_create: function(){
		var self = this;
		self.setupEditor();
		self.loadDesign();
		self.render();
	}
	
});