<?php

namespace developerZone;

class Method{
	public $raw_data;
	public $name;
	public $nodes=array();
	public $connections=array();

	function __construct($name){
		$this->name = $name;
	}

	function addNode($node_data){
		$n = new Node($node_data->name);
		$n->owner = $this;

		foreach ($node_data->Nodes as $internal_n) {
			$n->addNode($internal_n->name);
		}

		foreach ($node_data->Ports as $p) {
			$n->addPort($p);
		}

		$this->nodes[] = $n;
	}

	function addConnection($connection){
		$this->connections[] = $connection;
	}

	function rawData($data_obj){
		$this->raw_data = $data_obj;
		foreach ($data_obj as $x) {
		}
	}

}

class Node {
	public $ports=array();
	public $nodes=array();
	public $owner=null;
	public $method=null;
	public $name;

	function __construct($name){
		$this->name = $name;
	}

	function addNode($node_data){
		$n = new Node($node_data->name);
		$n->owner = $this;

		foreach ($node_data->Nodes as $n) {
			$n->addNode($n);
		}

		$this->nodes[] = $n;
	}

	function addPort($port_data){
		$p = new Port($port_data);
		$p->parent_node = $this;
		$this->ports[] = $p;

	}
}

class Port {
	public $connections=array();
	public $parent_node=null;
	public $type;
	public $target_nodes=array();
	public $source_nodes=array();
	public $target_ports=array();
	public $source_ports=array();


	function __construct($port_data){
		$this->type= $port_data->type;

		// get All source nodes and ports
		// get all target nodes and ports

	}
}

class Connection{
	public $source_port;
	public $source_node;
	public $target_port;
	public $target_node;

	function __construct($source_port,$source_node,$target_port,$target_node){
		$this->source_port = $source_port;
		$this->source_node = $source_node;
		$this->target_port = $target_port;
		$this->target_node = $target_node;
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
			foreach ($m->Nodes as $n) {
				$mc->addNode($n);
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