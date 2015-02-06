<?php

namespace developerZone;

class Model_Port extends \SQL_Model{
	public $table = "developerZone_method_node_ports";

	function init(){
		parent::init();

		$this->hasOne('developerZone/Node','node_id');

		$this->addField('name');

		$this->addField('type')->enum(array('DATA-IN','DATA-OUT','FLOW-IN','FLOW-OUT','internal'));

		$this->add('dynamic_model/Controller_AutoCreator');
	}

	function getVariableName($for_node){
		return $this->api->normalizeName($for_node['name']).'_'.$this->api->normalizeName($this['name']);
	}

	function previousPorts($skip_block=false,$return_id_array=false){
		$ports_connections = $this->add('Model_NodeConnections');
		$ports_connections->addCondition('to_port_id',$this->id);

		$port_ids=array();

		foreach ($ports_connections as $pcon) {
			if($skip_block AND $pcon->port('from')->node()->type()=='Block'){
				$port_ids = array_merge($port_ids, $pcon->port('from')->previousPorts($skip_block,true));
			}else{
				$port_ids[] = $pcon['from_port_id'];
			}
		}

		if($return_id_array) return $port_ids;

		$previous_ports = $this->add('developerZone/Model_Node');
		$previous_ports->addCondition('id',$port_ids);

		return $previous_ports;
	}

	function nextPorts($skip_block=false, $return_id_array=false){
		$ports_connections = $this->add('Model_NodeConnections');
		$ports_connections->addCondition('from_port_id',$this->id);

		$port_ids=array();

		foreach ($ports_connections as $pp) {
			if($skip_block AND $pcon->port('to')->node()->type()=='Block'){
				$port_ids = array_merge($port_ids, $pcon->port('from')->previousPorts($skip_block,true));
			}else{
				$port_ids[] = $pcon['to_port_id'];
			}
		}

		if($return_id_array) return $port_ids;

		$next_ports = $this->add('developerZone/Model_Node');
		$next_ports->addCondition('id',$port_ids);
		
		return $next_ports;
	}

	function previousNodes(){
		$previous_node_ids=array();
		foreach ($this->previousPorts() as $pp) {
			$previous_node_ids[] = $pp['node_id'];
		}

		$previous_nodes = $this->add('developerZone/Model_Node');
		$previous_nodes->addCondition('id',$previous_node_ids);

		return $previous_nodes;

	}

	function nextNodes(){
		$next_node_ids=array();
		foreach ($this->nextPorts() as $np) {
			$next_node_ids[] = $np['node_id'];
		}

		$next_nodes = $this->add('developerZone/Model_Node');
		$next_nodes->addCondition('id',$next_node_ids);

		return $next_nodes;
	}

	function node(){
		return $this->ref('node_id');
	}
}