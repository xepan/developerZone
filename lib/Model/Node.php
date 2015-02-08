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

		$this->addField('parent_node_id');
		$this->addField('reference_obj');
		$this->addField('name');
		$this->addField('action')->enum(array('Block','Add','MethodCall','FunctionCall','Statement'));
		$this->addField('inputs');
		$this->addField('outputs');
		$this->addField('branch');
		$this->addField('total_ins');
		$this->addField('input_resolved_for_branch');

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
		return $this['parent_node_id']?:false;
	}

	function previousNodes($skip_blocks=true,$return_id_array=false){

		$previous_nodes_id=array();

		foreach ($this->ports('IN') as $p_in) {
			foreach ($p_in->previousPorts($skip_blocks,true) as $p_in_pp) {
					$previous_nodes_id[] = $p_in_pp['node_id'];
				}
			}

		if($return_id_array) return $previous_nodes_id;

		$previous_nodes = $this->add('developerZone/Model_Node');
		$previous_nodes->addCondition('id',$previous_nodes_id);
		return $previous_nodes;
	}

	function nextNodes($skip_blocks=true,$return_id_array=false){
		$next_nodes_id=array();

		foreach ($this->ports('OUT') as $p_out) {
			foreach ($p_out->nextPorts($skip_blocks,true) as $p_out_pp) {
					$next_nodes_id[] = $p_out_pp['node_id'];
				}
			}

		if($return_id_array) return $next_nodes_id;

		$next_nodes = $this->add('developerZone/Model_Node');
		$next_nodes->addCondition('id',$next_nodes_id);
		return $next_nodes;

	}

	function getBranch(){
		// return branch :from which: this node belongs

	}

	function ports($type=false){
		$p=$this->ref('developerZone/Port');
		if($type) $p->addCondition('type',$type);

		return $p;
	}

	function type(){
		return $this['action'];
	}
}