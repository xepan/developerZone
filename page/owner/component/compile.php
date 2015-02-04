<?php

class page_developerZone_page_owner_component_compile extends page_developerZone_page_owner_main {

	function init(){
		parent::init();
		$cont = $this->add('developerZone/Controller_Compiler');
	}

}