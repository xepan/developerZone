<?php

namespace developerZone;

class Method {
	public $data;
	public $nodes = array();

	public $branched_data=array();

	function __construct(&$data){
		$this->data = $data;
		// flood($data);
	}

	function setBranches(){
		foreach ($this->data->Nodes as &$n) {
			$nc = new Node($n, $this);
			$nc->setBranch(1);
		}
	}

	function searchNode($node_id){
		foreach ($this->data->Nodes as &$n) {
			if($n->uuid == $node_id) return $n;
			$nc = new Node($n,$this);
			if($found == $nc->searchNode($node_id)) return $found;
		}
	}


	function genCode(){

	}

}

class Node {
	public $method;
	public $data;
	public $branch_id=false;
	public $total_in_connections=0;
	public $conn_done=0;
	public $ports=array();
	public $template;
	public $variables_to_set=array();

	function __construct (&$data, &$method){
		$this->data = $data;
		$this->method = $method;
		// flood($this->data);
		// echo $this->data->uuid;
		foreach ($this->method->data->Connections as $c) {
			if($c->taggetParentId == $this->data->uuid){
				$this->total_in_connections++;
			}
		}
	}

	function setBranch($branch_id){
		
		if($this->branch_id){
			$branch_id = min($this->branch_id,$branch_id);
		}

		$this->Branch = $branch_id;
		$i=1;
		foreach ($this->ports() as &$p) {
			// flood($p);
			$to_set = $branch_id;
			if(isset($p->creates_block) and $p->creates_block ==='YES'){
				$to_set = $branch_id + $i;
				$i++;
			}
			foreach ($this->nextConnectedNodes($p->uuid) as &$n) {
				$nc = new Node($n,$this->method);
				$nc->setBranch($to_set);
			}
		}
	}

	function ports(){
		// flood($this);
		return $this->data->Ports;
	}

	function nextConnectedNodes($port_id){
		$connected_nodes = array();
		foreach ($this->method->data->Connections as $c) {
			// echo "\$c->sourceId (".$c->sourceId.") == 'exp_'\$port_id (".'exp_'.$port_id.") <br>";//" AND \$c->taggetParentId (".$c->taggetParentId.") == \$this->data->uuid (".$this->data->uuid.") <br/>";
			if($c->sourceId == "xxep_".$port_id){
				$connected_nodes[] = $this->searchNode($c->taggetParentId);
			}
		}
		return $connected_nodes;
	}

	function searchNode($node_id){
		foreach ($this->data->Nodes as &$n) {
			if($n->uuid == $node_id) return $n;
			$nc = new Node($n,$this->method);
			if($found == $nc->searchNode($node_id)) return $found;
		}
	}

	function genCode(){

	}
}

class Port {
	public $data;
	public $pre_connections;
	public $name;
	// $pre_connections = array(array(node_name,port_name));
	function __construct($data, $pre_connections){

	}

	function name(){

	}
}

class Controller_CodeStructure extends \AbstractController{
	public $entity;

	function init(){
		parent::init();

		if(!$this->entity) throw new \Exception("Define entity first", 1);
		

	}

	function getStructure(){
		$structure=json_decode($this->entity['code_structure']);

		$code_structure = array();

		// comments
		// namespace
		// class definations
		// attributes
		// methods
		foreach ($structure->Method as &$m) {
			$mc = new Method($m);
			$mc->setBranches();
		}
			// set branches

			// fetch to array // ??? variable names set 


		return $structure;
	}
}

function flood($data){
	echo "<pre>";
	print_r($data);
	echo "</pre>";

}