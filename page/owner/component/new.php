<?php

class page_developerZone_page_owner_component_new extends page_developerZone_page_owner_main {
	function init(){
		parent::init();

		$app = $this->add('Model_MarketPlace');

		$app->getElement('type')->enum(array('module','application'));

		$form = $this->add('Form');
		$form->setModel($app,array('namespace','type','name','git_path','initialize_and_clone_from_git','has_toolbar_tools','has_owner_modules','has_plugins','has_live_edit_app_page'));

		$form->addSubmit('Verify And Create');

		if($form->isSubmitted()){
			$form->update();
			$form->api->redirect($this->api->url('developerZone_page_owner_component_edit',array('component'=>$form['namespace'])));
		}

	}
}