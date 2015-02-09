<?php

namespace developerZone;

class Model_Method extends \SQL_Model{
	public $table ="developerZone_entity_methods";

	function init(){
		parent::init();

		$this->hasOne('developerZone\Entity');

		$this->addField('method_type')->enum(array('Public','Private','Protected'));
		
		$this->addField('name');
		$this->addField('default_ports')->type('text'); // [[label,type,mandatory]]
		$this->addField('properties');

		$this->hasMany('developerZone/Node');

		$this->add('dynamic_model/Controller_AutoCreator');

	}

	function getStructure(){
		$code=array();
		return array('name'=>$this['name'],'parameters'=>array('a','b'),'code'=>$code);
	}

	function generateCode(){
		$arguments="";
		if($this['params'])
			$arguments = implode(",", $this['params']);

		$method_name = $this['method_type']. " function ". $this['name']. "($arguments)";
		$method_block = $this->add('developerZone/Code');
		$method_block->hasBlock();
		$method_block->addBlockStarter($method_name);

		// $code_flow->_dsql()->set('is_processed',0)->do_update();

		$this->add('developerZone/Model_CodeFlow')->addCondition('developerZone_entity_methods_id',$this->id)->_dsql()->set('is_processed',0)->do_update();

		$code ="";

		$code_flow = $this->add('developerZone/Model_CodeFlow');
		$code_flow->addCondition('parent_block_id',0);
		$code_flow->addCondition('connections_in',0);
		$code_flow->addCondition('action','<>',array('methodCall'));
		$code_flow->addCondition('developerZone_entity_methods_id',$this->id);

		foreach ($code_flow as $cf) {
			// echo "Rooted " . $cf['name'] ." for " . $cf['id'] ."<br/>";
			$code .= $cf->geterateCode();
		}

		$method_block->addCode($code);

		return $method_block->generateCode();
	}
}