<?php

class page_developerZone_page_owner_saveentity extends Page {
	
	function init(){
		parent::init();


		$e = $this->add('developerZone/Model_Entity')->load($this->api->recall('entity_id'));
		$e['code_structure'] = $_POST['entity_code'];
		$e->save();
		$code = json_decode($_POST['entity_code'],true);


		$e->ref('developerZone/Method')->deleteAll();
		
		foreach ($code['Method'] as $key => $value) {
			$method = $this->add('developerZone/Model_Method');
			$method->addCondition('developerZone_entities_id',$e['id']);
			$method->addCondition('name',$value['name']);
			$method->tryLoadAny();
			$method['method_type'] = $e['method_type']?$this['method_type']:'public';

			$i=0;
			$port_jsons=array();
			$ports_json_str="[";
			foreach ($value['Ports'] as &$p) {
				unset($p['uuid']);
				
				if($p['type']=='in-out') unset($value['Ports'][$i]);
				
				if($p['type']=="In") $p['type']="Out";
				if($p['type']=="Out") $p['type']="In";

				$ports_jsons[] = json_encode($p);
				$i++;
			}
			$ports_json_str .= implode(",", $ports_jsons);
			$ports_json_str.="]";
			$method['default_ports'] = $ports_json_str;
			$method->save();

		}


		echo $this->js(true)->univ()->successMessage("Done");
		exit;

	}
}