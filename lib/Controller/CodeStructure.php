<?php

namespace developerZone;

class Method{
	public $name;
	public $nodes=array();
	public $ports=array();
	public $connections=array();

	function __construct($name){
		$this->name = $name;
	}

	function addNode($node_data){
		$n = new Node($node_data);
		$n->owner = $this;

		foreach ($node_data->Nodes as $internal_n) {
			$n->addNode($internal_n->name);
		}

		foreach ($node_data->Ports as $p) {
			$n->addPort($p);
		}

		$this->nodes[] = $n;
	}

	function addPort($port_data){
		$p = new Port($port_data);
		$p->parent_node = $this;
		$p->method = $this->method;
		$this->ports[] = $p;
	}

	function addConnection($cd){
		// flood($connection_data);
		$c = new Connection($cd->sourceId,$cd->sourceParentId,$cd->targetId,$cd->taggetParentId, $this);
		$this->connections[] = $c;
	}

	function findPort($uuid){
		// xxep ???
		$uuid = str_replace("xxep_", "", $uuid);
		
		foreach ($this->ports as $p) {
			if($found = $p->findPort($uuid)) return $found;
		}

		foreach ($this->nodes as $n) {
			if($found= $n->findPort($uuid)) return $found;
		}


		return false;
	}

	function findNode($uuid){
		foreach ($this->nodes as $n) {
			if($found = $n->findNode($uuid)) return $found;
		}

		return false;
	}

	function setBranches(){
		// get root nodes
		// set Branch call
	}


}

class Node {
	public $uuid;
	public $name;
	public $type;
	public $js_widget;
	public $tool_id;
	public $entity_id;
	public $nodes=array();
	public $ports=array();
	public $owner=null;
	public $method=null;

	function __construct($node_data){
		$this->name = $node_data->name;
		$this->uuid = $node_data->uuid;
		$this->type = $node_data->type;
		$this->js_widget = $node_data->js_widget;
		$this->tool_id = isset($node_data->tool_id)?$node_data->tool_id:null;
		$this->entity_id = isset($node_data->entity_id)?$node_data->entity_id:null;
	}

	function addNode($node_data){
		$n = new Node($node_data);
		$n->owner = $this;

		foreach ($node_data->Nodes as $n) {
			$n->addNode($n);
		}

		$this->nodes[] = $n;
	}

	function addPort($port_data){
		$p = new Port($port_data);
		$p->parent_node = $this;
		$p->method = $this->method;
		$this->ports[] = $p;
	}

	function findNode($uuid){
		if($this->uuid == $uuid) return $this;
		foreach ($this->nodes as $n) {
			if($found = $n->findNode($uuid)) return $found;
		}

		return false;
	}

	function findPort($uuid){
		foreach ($this->ports as $p) {
			if($p->uuid == $uuid) return $p;
		}

		foreach ($this->nodes as $n) {
			if($found = $n->findPort()) return $found;
		}
		return false;
	}
}

class Port {
	public $uuid;
	public $name;
	public $type;
	public $parent_node=null;
	public $method;
	public $creates_block;

	public $connections=array();

	public $source_ports=array();
	public $source_nodes=array();
	public $target_ports=array();
	public $target_nodes=array();


	function __construct($port_data){
		$this->type= $port_data->type;
		$this->uuid= $port_data->uuid;
		$this->name= $port_data->name;
		$this->creates_block= isset($port_data->creates_block)? $port_data->creates_block : "";
	}

	function findPort($uuid){
		if($this->uuid == $uuid) return $this;
	}
}

class Connection{
	public $source_port;
	public $source_node;
	public $target_port;
	public $target_node;

	public $method;

	function __construct($source_port,$source_node,$target_port,$target_node, $method){
		$this->method= $method;

		$this->source_port = $source_port;
		$this->source_node = $source_node;
		$this->target_port = $target_port;
		$this->target_node = $target_node;

		$source_port = $this->method->findPort($source_port);


	}

}


class Branch {
	public $nodes =array();
	public $branches=array();
	public $owner = null;

	function addNode(&$n){
		$n->branch->removeNode($n->uuid);
		$this->nodes[$n->uuid] = $n;
	}

	function addBranch($name){
		$new_branch = new Branch();
		$new_branch->owner = $this;
		$this->branches[$name] = $new_branch;
	}

	function removeNode($uuid){
		$n = $this->node[$uuid];
		$n->branch = null;
		unset($this->nodes[$uuid]);
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


		foreach ($structure->Method as $m) {
			$mc = new Method($m->name);
				
			foreach ($m->Ports as $p) {
				$mc->addPort($p);
			}

			foreach ($m->Nodes as $n) {
				$mc->addNode($n);
			}

			foreach ($m->Connections as $c) {
				$mc->addConnection($c);
			}

					
		}
			// set branches

			// fetch to array // ??? variable names set 

		// return $structure;
		return $mc;
	}
}

function flood($data){
	echo "<pre>";
	print_r($data);
	echo "</pre>";

}