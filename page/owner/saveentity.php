<?php

class page_developerZone_page_owner_saveentity extends Page {
	
	function init(){
		parent::init();


		$e = $this->add('developerZone/Model_Entity')->load($this->api->recall('entity_id'));
		$e['code_structure'] = $_POST['entity_code'];
		$e->save();

		$code = json_decode($_POST['entity_code'],true);
		foreach ($code['Method'] as $key => $value) {
			$method = $this->add('developerZone/Model_Method');
			$method->addCondition('developerZone_entities_id',$e['id']);
			$method->addCondition('name',$value['name']);
			$method->tryLoadAny();
			$method['method_type'] = $e['method_type']?$this['method_type']:'public';
			$method->saveAndUnload();
		}

		echo $this->js(true)->univ()->successMessage("Done");
		exit;

	}
}