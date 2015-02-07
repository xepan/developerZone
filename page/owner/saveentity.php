<?php

class page_developerZone_page_owner_saveentity extends Page {
	
	function init(){
		parent::init();

		$e = $this->add('developerZone/Model_Entity')->load($this->api->recall('entity_id'));
		$e['code_structure'] = $_POST['entity_code'];
		$e->save();
		echo $this->js(true)->univ()->successMessage("Done");
		exit;

	}
}