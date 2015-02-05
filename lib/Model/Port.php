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

	function hasMultiBranchOutput(){
		
	}
}