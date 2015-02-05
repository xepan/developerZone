<?php

namespace developerZone;


class Controller_Compiler extends \AbstractController{
	
	function init(){
		parent::init();

		$component_id= $_GET['component_id'];

		$this->add('developerZone/Model_CodeFlowConnections');
		$entities = $this->add('developerZone/Model_Entity')->addCondition('is_class',true)->addCondition('is_framework_class',false);
		foreach ($entities as $id => $entity) {
			$entity->compile();
		}
	}
}