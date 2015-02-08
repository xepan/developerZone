<?php

namespace developerZone;

class Controller_CodeStructure extends \AbstractController{
	public $entity;

	function init(){
		parent::init();

		if(!$this->entity) throw new \Exception("Define entity first", 1);
		

	}

	function getStructure(){
		// $e=$this->entity;
		// $structure=array();
		
		// // add entity entry 
		// $structure[$e['name']]=array('type'=>$e['type']);
		
		// // add attributes entries
		// $structure['attributes']=array();
		// foreach ($e->ref('developerZone/Attribute') as $id => $attr) {
		// 	$structure['attributes'][] = $attr->getStructure();
		// }
		// // add Methods Entry
		// $structure['methods']=array();

		// foreach ($e->ref('developerZone/Method') as $m) {

		// 	$structure['methods'][]=$m->getStructure();
		// }
			// foreach method
				// generateStructure

		$structure=json_decode($this->entity['code_structure']);

		return $structure;
	}
}