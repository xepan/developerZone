<?php

class page_developerZone_page_owner_editor extends page_developerZone_page_owner_main{
	
	function init(){
		parent::init();

		$cols = $this->app->layout->add('Columns');
		$entities_col = $cols->addColumn(2);
		$editor_col = $cols->addColumn(8);
		$tools_col = $cols->addColumn(2);

		$entities_model = $this->add('developerZone/Model_Entity');
		foreach ($entities_model as $id => $ent) {
			$en = $entities_col->add('View')->set($ent['name'])->addClass('entity')->addClass('createNew');
			$en->setAttr(
					array(
						'data-inports'=>$ent['instance_inports'],
						'data-outports'=>$ent['instance_outports'],
						'data-type'=>$ent['type']
						)
				);
		}

		$editor_col->add('View')
			->setStyle(array('width'=>'100%','height'=>'500px'))
			->addClass('editor-document')
			->js(true)->editor();

		$tools_col->add('View')->set('Process')->addClass('editortool');
		$tools_col->add('View')->set('inPort')->addClass('editortool');
		$tools_col->add('View')->set('outPort')->addClass('editortool');
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
			->load('jPlumbInit')
			;
		return parent::defaultTemplate();
	}

	function render(){

		$this->js(true)->_selector('.entity')->entity();
		$this->js(true)->_selector('.editortool')->editortool();

		parent::render();
	}
}