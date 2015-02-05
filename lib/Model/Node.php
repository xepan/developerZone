<?php

namespace developerZone;

class Model_Node extends \SQL_Model{
	public $table = "developerZone_method_nodes";
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

		// $this->addExpression('connections_in')->set(function($m,$q){
		// 	return $m->add('developerZone/Model_NodeConnections')->addCondition('destination_codeflow_id',$q->getField('id'))->count();
		// });

		$this->hasMany('developerZone/NodeConnections');
		$this->hasMany('developerZone/Port');

		$this->add('dynamic_model/Controller_AutoCreator');

	}

	function dependsOn(){
		
	}

	function parent(){
		return $this['parent_block_id'];
	}

	function previousNodes(){
		$me = $this->add('developerZone/Model_Node');
		$ports_j = $me->join('developerZone_method_node_ports.node_id');
		$ports_j->addField('node_port_id','id');
		$ports_j->addField('node_port_type','type');
		$me->addCondition('id',$this->id);
		$me->addCondition('node_port_type','IN');
		$port_ids_rows = $me->getRows();

		$port_ids = array();
		foreach ($port_ids_rows as $pi) {
			$port_ids[] = $pi['node_port_id'];
		}
		
		$previous_nodes = $this->add('developerZone/Model_Node');
		$ports_j = $previous_nodes->join('developerZone_method_node_ports.node_id');
		$ports_j->addField('node_port_id','id');
		$ports_j->addField('node_port_type','type');
		
		$port_conn_j = $ports_j->join('developerZone_method_nodes_connections.from_port_id');
		$port_conn_j->addField('to_port_id');

		$previous_nodes->addCondition('to_port_id',$port_ids);

		if($previous_nodes->count()->getOne() == 0 ) return false;

		return $previous_nodes;

		echo "<pre>";
		print_r($p_n_ids);
		echo "</pre>";


	}

	function geterateCode(){
		// echo "working on ". $this['name']. "<br/>";
		switch ($this['action']) {
			case 'Block':
				return $this->add('developerZone/Code_Block')->load($this->id)->set('is_processed',true)->save()->generateCode();
				break;
			
			case 'Add':
				return $this->add('developerZone/Code_Add')->load($this->id)->set('is_processed',true)->save()->generateCode();
				break;

			case 'Variable':
				return $this->add('developerZone/Code_Variable')->load($this->id)->set('is_processed',true)->save()->generateCode();
				break;
			

			default:
				# code...
				break;
		}

		return "";
	}

	function generateVariableName($prefix=""){
		$variables = $this->api->recall('code_variables',array());
		$to_find = $this->api->normalizeName(strtolower($prefix.$this['name']));
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
		$connections = $this->add('developerZone/Model_CodeFlowConnections');
		$connections->addCondition('source_code_flow_id',$this->id);
		return $connections;
	}

	function getConnectedSourcePorts(){

	}
}