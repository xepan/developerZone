<?php

namespace developerZone;

class Model_Tools extends \SQL_Model{
	public $table = "developerZone_editor_tools";

	function init(){
		parent::init();

		$this->addField('category');
		$this->addField('name');
		$this->addField('type');
		$this->addField('template');
		$this->addField('instance_ports')->type('text');
		$this->addField('is_output_multibranch')->type('boolean');
		$this->addField('is_for_editor')->type('boolean')->defaultValue(false);
		$this->addField('can_add_ports')->type('boolean')->defaultValue(false);
		$this->addField('js_widget');
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
