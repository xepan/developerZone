<?php

namespace developerZone;

class Model_CodeFlow extends \SQL_Model{
	public $table = "developerZone_code_flows";
	public $compiled_code =" // Compiled Code !!! :)";
	public $scope_variables = array();

	function init(){
		parent::init();

		$this->hasOne('developerZone/Method');
		$this->hasOne('developerZone/Entity');

		$this->addField('parent_block_id');
		$this->addField('reference_obj');
		$this->addField('name');
		$this->addField('action')->enum(array('Block','Add','MethodCall','FunctionCall','Statement'));
		$this->addField('inputs');
		$this->addField('outputs');
		$this->addField('is_processed')->type('boolean')->defaultValue(true);

		$this->addExpression('connections_in')->set(function($m,$q){
			return $m->add('developerZone/Model_CodeFlowConnections')->addCondition('destination_codeflow_id',$q->getField('id'))->count();
		});

		$this->hasMany('developerZone/CodeFlowConnections');

		$this->add('dynamic_model/Controller_AutoCreator');

	}

	function geterateCode(){
		switch ($this['action']) {
			case 'Block':
				return $this->add('developerZone/Code_Block')->load($this->id)->set('is_processed',true)->save()->generateCode();
				break;
			
			case 'Add':
				return $this->add('developerZone/Code_Add')->load($this->id)->set('is_processed',true)->save()->generateCode();
				break;
			

			default:
				# code...
				break;
		}

		return "";
	}

	function generateVariableName(){
		$variables = $this->api->recall('code_variables',array());
		$to_find = $this->api->normalizeName(strtolower($this['name']));
		$variables[$this->id] = $to_find.'_'.$this->id;
		$this->api->memorize('code_variables',$variables);
		return $to_find;
	}

	function getVariableName($id){
		$variables = $this->api->recall('code_variables',array());
		return $variables[$id];		
	}

	function loadNext1($under_block=null){

		$code_flow = $this->add('developerZone/Model_CodeFlow');
		$code_flow->addCondition('developerZone_entity_methods_id',$this['developerZone_entity_methods_id']);
		$code_flow->addCondition('is_processed',false);

		if($under_block)
			$code_flow->addCondition('parent_block_id',$under_block);

		$code_flow->tryLoadAny();

		if(!$code_flow->loaded()){
			return false;
		}

		return $code_flow;

	}

	function getConnectedDestinationPorts(){

	}

	function getConnectedSourcePorts(){

	}
}