<?php

namespace developerZone;

class Model_PHPFunctions extends \SQL_Model{
	public $table = "developerZone_phpfunctions";

	function init(){
		parent::init();

		$this->addField('category');
		$this->addField('name');
		$this->addField('template');
		$this->addField('ports');
		$this->addField('is_output_multibranch')->type('boolean');
		$this->addField('special_handler');

		$this->add('dynamic_model/Controller_AutoCreator');

	}
}

/*
	function init(){
		parent::init();
		$model_quotation = $this->add('xFlow/Model_Quotation');

	}

*/
