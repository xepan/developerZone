<?php

namespace developerZone;

class Model_CodeFlowConnections extends \SQL_Model{
	public $table = "developerZone_code_flows_connections";
	public $compiled_code =" // Compiled Code !!! :)";

	function init(){
		parent::init();

		$this->hasOne('developerZone/CodeFlow','source_codeflow_id');
		$this->hasOne('developerZone/CodeFlow','destination_codeflow_id');

		$this->addField('name');

		$this->addField('my_port');
		$this->addField('my_port_type')->enum(array('IN','OUT','FLOW'));

		$this->addField('other_port');
		$this->addField('other_port_type')->enum(array('IN','OUT','FLOW'));

		$this->add('dynamic_model/Controller_AutoCreator');
	}
}