<?php

namespace developerZone;

class Model_Method extends \SQL_Model{
	public $table ="developerZone_entity_methods";

	function init(){
		parent::init();

		$this->hasOne('developerZone\Entity');

		$this->addField('method_type')->enum(array('Public','Private','Protected'));
		
		$this->addField('name');
		$this->addField('params');
		$this->addField('properties');

		$this->hasMany('developerZone/CodeFlow');

		$this->add('dynamic_model/Controller_AutoCreator');

	}

	function generateCode(){
		$arguments="";
		if($this['params'])
			$arguments = implode(",", $this['params']);
		$method_name = $this['method_type']. " function ". $this['name']. "($arguments)";
		$method_block = $this->add('developerZone/Code');
		$method_block->hasBlock();
		$method_block->addBlockStarter($method_name);

		$code_flow = $this->ref('developerZone/CodeFlow');
		// $code_flow->_dsql()->set('is_processed',0)->do_update();

		$code ="";

		$code_flow->addCondition('parent_block_id',null);
		$code_flow->addCondition('connections_in',0);

		foreach ($code_flow as $cf) {
			$code .= $cf->geterateCode();
		}

		$method_block->addCode($code);

		return $method_block->generateCode();
	}
}