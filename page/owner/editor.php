<?php

class page_developerZone_page_owner_editor extends page_developerZone_page_owner_main{
	
	function init(){
		parent::init();

		$btn = $this->app->layout->add('Button')->set('SAVE');
		$btn->js('click')->univ()->saveCode();

		$cols = $this->app->layout->add('Columns');
		$entities_col = $cols->addColumn(2);
		$editor_col = $cols->addColumn(8);
		$tools_col = $cols->addColumn(2);

		$entities_model = $this->add('developerZone/Model_Entity');
		
		$ul=$entities_col->add('View')->setElement('ul');
		
		$uls=array();
		$li= $ul->add('View')->setElement('li');
		$li->add('Text')->set('Models');
		$uls['Model'] = $li->add('View')->setElement('ul');

		$li= $ul->add('View')->setElement('li');
		$li->add('Text')->set('Pages');
		$uls['page'] = $li->add('View')->setElement('ul');

		$li= $ul->add('View')->setElement('li');
		$li->add('Text')->set('Views');
		$uls['View'] = $li->add('View')->setElement('ul');
		
		foreach ($entities_model as $id => $ent) {
			if(!isset($uls[$ent['type']])) continue;
			
			$add_to = $uls[$ent['type']];
			$add_to = $add_to->add('View')->setElement('li');
			$en = $add_to->add('View')->set($ent['name'])->addClass('entity')->addClass('createNew');
			$en->setAttr(
					array(
						'data-inports'=>$ent['instance_inports'],
						'data-outports'=>$ent['instance_outports'],
						'data-type'=>$ent['type']
						)
				);
		}

		$entities_col->addClass('maketree');
		$ul->js(true)->univ()->makeTree();

		$this->api->layout->add('View')
			->setStyle(array('width'=>'100%','height'=>'500px'))
			->addClass('editor-document')
			->js(true)->editor();


		foreach ($this->add('developerZone/Model_Tools') as $tool) {
			$tools_col->add('View')->set($tool['name'])
				->setAttr(
					array(
						'data-inports'=>'{}',
						'data-outports'=>'{}',
						'data-type'=>$tool['js_plugin']
						))
				->addClass('editortool createNew')
				->addClass($tool['icon']);
				;
		}

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
			->_load('entityinstance')
			->_load('editor')
			->_load('jPlumbInit')
			->_load('saveCode')
			->_load('ultotree')
			;
		return parent::defaultTemplate();
	}

	function render(){

		$this->js(true)->_selector('.entity')->entity();
		$this->js(true)->_selector('.editortool')->editortool();

		parent::render();
	}
}