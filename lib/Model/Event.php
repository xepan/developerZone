<?php

namespace developerZone;

class Model_Event extends \SQL_Model{
	public $table ="developerZone_events";

	function init(){
		parent::init();

		$this->hasOne('developerZone\Entity');
		$this->addField('name');
		$this->addField('condition');
		$this->addField('fire_spot');

		$this->add('dynamic_model/Controller_AutoCreator');
	}
}