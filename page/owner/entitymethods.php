<?php

class page_developerZone_page_owner_entitymethods extends Page {
	
	function init(){
		parent::init();


		$e = $this->add('developerZone/Model_Entity')->load($_GET['entity_id']);
		$methods_array = array();

		foreach ($e->ref('developerZone/Method') as $methods) {
			$methods_array[$methods['name']]=json_decode($methods['default_ports'],true);
		}

		echo json_encode($methods_array);
		exit;

	}
}