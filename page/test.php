<?php

class page_developerZone_page_test extends \Page {

	function init(){
		parent::init();

		// $this->add('developerZone/Model_Node')->load(5)->previousNodes();
		// exit;

		// $this->add('developerZone/Model_Port');
		// $this->add('developerZone/Model_NodeConnections');

		$entity = $this->add('developerZone/Model_Entity')->load(2);
		$cont = $this->add('developerZone/Controller_CodeStructure',array('entity'=>$entity));

		$array = $cont->getStructure();
		echo "<pre>";
		print_r($array);
		echo "</pre>";
		exit;

	}

}