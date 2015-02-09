<?php

class page_developerZone_page_owner_extend extends page_developerZone_page_owner_main{
	
	function init(){
		parent::init();

		$model = $this->add('developerZone/Model_Entity');

		if($_POST['entity_id'] > 0 and $_POST['class_name']){
			$extend_model = $model->extend($_POST['entity_id'],$_POST['class_name']);
			echo $extend_model['id'];
			exit;
		}

		echo "undefined";
		exit;
	}
}