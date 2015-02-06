<?php

namespace developerZone;

class Model_Tools extends \SQL_Model{
	public $table = "developerZone_editor_tools";

	function init(){
		parent::init();

		$this->addField('category');
		$this->addField('name');
		$this->addField('template');
		$this->addField('ports');
		$this->addField('is_output_multibranch')->type('boolean');
		$this->addField('js_plugin');
		$this->addField('special_php_handler');
		$this->addField('icon');
		$this->addField('order');

		$this->add('dynamic_model/Controller_AutoCreator');

	}
}

/*
	function init(){
		parent::init();
		$model_quotation = $this->add('xFlow/Model_Quotation');

	}

*/
