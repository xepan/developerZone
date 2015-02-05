<?php

namespace developerZone;

class Model_Attribute extends \SQL_Model{
	public $table ="developerZone_entity_attributes";

	function init(){
		parent::init();

		$this->hasOne('developerZone\Entity');

		$this->addField('attribute_type')->enum(array('Field','Expression','hasOne','hasMany'));
		$this->addField('name');
		$this->addField('value');

		$this->add('dynamic_model/Controller_AutoCreator');

	}

	function getStructure(){
		return array('access_specifier'=>$this['attribute_type'],'attribute'=>$this['name'],'value'=>$this['value']);
	}

	function generateCode(){
		$str = $this['attribute_type']. ' $'. $this['name'];
			if($this['value']){
				$str .= "= ". $this['value'];
			}
			$str .= ";\n";

		return $str;
	}
}