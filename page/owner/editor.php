<?php

class page_developerZone_page_owner_editor extends page_developerZone_page_owner_main{
	
	function init(){
		parent::init();

		$entity_model =$this->add('developerZone/Model_Entity');
		$entity_model->load($this->api->stickyGET('entity_id'));
		$this->api->memorize('entity_id',$_GET['entity_id']);

		$btn = $this->app->layout->add('Button')->set('SAVE');
		$btn->js('click')->univ()->saveCode();
		
		$page_btn = $this->app->layout->add('Button')->set(' Add New Page');
		$page_btn->js('click')->univ()->frameURL('Create New Page',$this->api->url('./new_page'));
		
		$page_btn=$this->add('Form');
		


		$cols = $this->app->layout->add('Columns')->addClass('editor-page');
		$entities_col = $cols->addColumn(2)->addClass('editor_top_bar')->addStyle(array('padding'=>0,'margin'=>0));
		$editor_col = $cols->addColumn(10)->addClass('editor-paper')->addStyle(array('padding'=>0,'margin'=>0));
		// $tools_col = $entities_col->add('View');
		$entities_col->add('View_Box')->set('Tools')->setStyle('background-color','#1c2933');

		$entities_col->js('reload')->reload();

		$entities_model = $this->add('developerZone/Model_Entity');
		
		$ul=$entities_col->add('View')->setElement('ul');
		$uls=array();
		foreach ($entities_model as $id => $ent) {
			if(!isset($uls[$ent['type']])) {
				$li= $ul->add('View')->setElement('li')->addClass('entity-header');
				$li->add('Text')->set($ent['type']);
				$uls[$ent['type']] = $li->add('View')->setElement('ul')->addClass('maketree-innner-ul');
			}
			
			$add_to = $uls[$ent['type']];
			$add_to = $add_to->add('View')->setElement('li')->addClass('entities');
			$en = $add_to->add('View')->set($ent['name']);
			$en->setAttr(
					array(
						'data-ports'=>$ent['instance_ports'],
						'data-name'=>$ent['name'],
						'data-type'=>$ent['type'],
						'data-js_widget'=>$ent['js_widget'],
						'data-can_add_ports'=>false,
						'data-entity_id'=>$ent->id,
						'data-is_framework_class'=>$ent['is_framework_class'],
						'data-css_class'=>$ent['css_class']
						)
				);
			$en->addClass('entity')->addClass('createNew');
		}

		$entities_col->addClass('maketree entities');


		$ul=$entities_col->add('View')->setElement('ul');
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
						'data-ports'=>$tool['instance_ports'],
						'data-name'=>$tool['name'],
						'data-type'=>$tool['type'],
						'data-js_widget'=>$tool['js_widget'],
						'data-can_add_ports'=>$tool['can_add_ports'],
						'data-tool_id'=>$tool->id
						))
				->addClass('editortool createNew')
				->addClass($tool['icon']);
				;
			if(!$tool['icon']) $tool_view->set($tool['name']);
			if($tool['is_for_editor']) $tool_view->addClass('for-editor');
		}
		$entities_col->addClass('maketree tools');

		$code_structure = $this->add('developerZone/Model_Entity')->load($_GET['entity_id'])->get('code_structure');
		$code_structure = json_decode($code_structure,true);

		
		if(!isset($code_structure['id'])) $code_structure['id']=$_GET['entity_id'];
		if(!isset($code_structure['name'])) $code_structure['name']="init";
		if(!isset($code_structure['class'])) $code_structure['class']="View";
		if(!isset($code_structure['attributes'])) $code_structure['attributes']=array();
		if(!isset($code_structure['Method'])) $code_structure['Method']=array();
		
		$code_structure = array('entity'=>$code_structure);
		// entity:{
		// 	"name":"entity_name",
		// 	"class":"Default_name",
		// 	attributes:[],
		// 	Method: []
		// },


		$editor_col->add('View')
			->addClass('editor-document')
			->js(true)
			->_load('editor')
			->editor($code_structure);



		$entities_col->js(true)->univ()->makeTree();
		$entities_col->js(true)->_selector('.entity')->entity();
		// $tools_col->js(true)->univ()->makeTree();
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
			->_load('jquery.ui-contextmenu')
			->_load('editortool')
			->_load('jPlumbInit')
			->_load('saveCode')
			->_load('ultotree')
			;
		return parent::defaultTemplate();
	}

	function render(){
		$this->api->jquery->addStaticStyleSheet('editor');
		
		$this->js(true)->_selector('.editortool')->editortool();

		parent::render();
	}

	function page_new_page(){
		$page_model = $this->add('developerZone/Model_Entity')->addCondition('type','page');
		$form = $this->add('Form');
		$form->addField('line','page_name');
		$form->addField('DropDown','parent_page')->setModel($page_model);
		$form->addSubmit('Create');

		if($form->isSubmitted()){
			$page_model['name'] = $form['page_name'];
			//$page_model['                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               _id'] = $form['page_name'];
			$page_model->save(); 
			$form->js(null,$this->js()->_selector('.entities')->trigger('reload'))->univ()->closeDialog()->execute();
		}

	}

}