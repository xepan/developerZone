<?php

namespace developerZone;

class Model_NodeConnections extends \SQL_Model{
	public $table = "developerZone_method_nodes_connections";

	function init(){
		parent::init();

		$this->hasOne('developerZone/Port','from_port_id');
		$this->hasOne('developerZone/Port','to_port_id');

		$this->addField('name');


		$this->add('dynamic_model/Controller_AutoCreator');
	}

	function port($type){
		return $this->ref($tyep.'_port_id');
	}
}