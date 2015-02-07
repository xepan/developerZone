<?php

class page_developerZone_page_owner_editor extends page_developerZone_page_owner_main{
	
	function init(){
		parent::init();

		$entity_model =$this->add('developerZone/Model_Entity');
		$entity_model->load($this->api->stickyGET('entity_id'));
		$this->api->memorize('entity_id',$_GET['entity_id']);

		$btn = $this->app->layout->add('Button')->set('SAVE');
		$btn->js('click')->univ()->saveCode();

		$cols = $this->app->layout->add('Columns');
		$entities_col = $cols->addColumn(2);
		$editor_col = $cols->addColumn(8);
		$tools_col = $cols->addColumn(2);

		$entities_model = $this->add('developerZone/Model_Entity');
		
		$ul=$entities_col->add('View')->setElement('ul');
		$uls=array();
		foreach ($entities_model as $id => $ent) {
			if(!isset($uls[$ent['type']])) {
				$li= $ul->add('View')->setElement('li');
				$li->add('Text')->set($ent['type']);
				$uls[$ent['type']] = $li->add('View')->setElement('ul');
			}
			
			$add_to = $uls[$ent['type']];
			$add_to = $add_to->add('View')->setElement('li');
			$en = $add_to->add('View')->set($ent['name']);
			$en->setAttr(
					array(
						'data-inports'=>$ent['instance_inports'],
						'data-outports'=>$ent['instance_outports'],
						'data-name'=>$ent['name'],
						'data-type'=>$ent['type'],
						'data-js_widget'=>$ent['js_widget'],
						'data-can_add_ports'=>false
						)
				);
			$en->addClass('entity')->addClass('createNew');
		}

		$entities_col->addClass('maketree entities');


		$ul=$tools_col->add('View')->setElement('ul');
		$categories =array();
		foreach ($this->add('developerZone/Model_Tools') as $tool) {
			if(!isset($categories[$tool['category']])){
				$li= $ul->add('View')->setElement('li');
				$li->add('Text')->set($tool['category']);
				$categories[$tool['category']] = $li->add('View')->setElement('ul');
			}
			$add_to = $categories[$tool['category']];
			$add_to = $add_to->add('View')->setElement('li');

			$tool_view = $add_to->add('View')
				->setAttr(
					array(
						'data-inports'=>$tool['instance_inports'],
						'data-outports'=>$tool['instance_outports'],
						'data-name'=>$tool['name'],
						'data-type'=>$tool['type'],
						'data-js_widget'=>$tool['js_widget'],
						'data-can_add_ports'=>$tool['can_add_ports']
						))
				->addClass('editortool createNew')
				->addClass($tool['icon']);
				;
			if(!$tool['icon']) $tool_view->set($tool['name']);
			if($tool['is_for_editor']) $tool_view->addClass('for-editor');
		}
		$tools_col->addClass('maketree tools');

		$code_structure = $this->add('developerZone/Model_Entity')->load($_GET['entity_id'])->get('code_structure');
		$code_structure = json_decode($code_structure,true);

		
		$code_structure = array('entity'=>$code_structure);
		// entity:{
		// 	"name":"entity_name",
		// 	"class":"Default_name",
		// 	attributes:[],
		// 	Method: []
		// },

		if(!isset($code_structure['name'])) $code_structure['name']="init";
		if(!isset($code_structure['class'])) $code_structure['class']="View";
		if(!isset($code_structure['attributes'])) $code_structure['attributes']=array();
		if(!isset($code_structure['Method'])) $code_structure['Method']=array();

		$this->api->layout->add('View')
			->addClass('editor-document')
			->js(true)
			->_load('editor')
			->editor($code_structure);



		$this->js(true)->univ()->makeTree();
	}

	function defaultTemplate(){
		$this->app->pathfinder->base_location->addRelativeLocation(
		    'epan-components/developerZone', array(
		        'php'=>'lib',
		        'template'=>'templates',
		        'css'=>'templates/css',
		        'js'=>'templates/js',
		    )
		);
		$this->js(true)
			->_load('entity')
			->_load('jquery.jsPlumb-1.7.2-min')
			->_load('editortool')
			->_load('jPlumbInit')
			->_load('saveCode')
			->_load('ultotree')
			;
		return parent::defaultTemplate();
	}

	function render(){
		$this->api->jquery->addStaticStyleSheet('editor');
		$this->js(true)->_selector('.entity')->entity();
		$this->js(true)->_selector('.editortool')->editortool();

		parent::render();
	}
}